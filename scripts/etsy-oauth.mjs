import { createHash, randomBytes } from 'node:crypto';
import { createServer } from 'node:http';
import { readFile, unlink, writeFile } from 'node:fs/promises';
import { URL } from 'node:url';

const TOKEN_URL = 'https://api.etsy.com/v3/public/oauth/token';
const PENDING_FILE = '.etsy-oauth.json';

const keyString = process.env.ETSY_KEYSTRING;
const sharedSecret = process.env.ETSY_SHARED_SECRET;

if (!keyString || !sharedSecret) {
  console.error(
    'Faltan ETSY_KEYSTRING y/o ETSY_SHARED_SECRET. Ejecuta el script con estas variables de entorno.'
  );
  process.exit(1);
}

const redirectUri =
  process.env.ETSY_REDIRECT_URI || 'http://127.0.0.1:53682/etsy-callback';
const scopes = process.env.ETSY_SCOPES || 'listings_r shops_r';

const createPkce = () => {
  const verifier = randomBytes(48).toString('base64url');
  const challenge = createHash('sha256').update(verifier).digest('base64url');
  const state = randomBytes(16).toString('base64url');
  return { verifier, challenge, state };
};

const escapeSql = (value) => value.replace(/'/g, "''");

const printCredentials = (tokens) => {
  const expiresIn = Math.max(60, Number(tokens.expires_in) || 3600);
  const sql = `INSERT INTO public.etsy_credentials (id, access_token, refresh_token, access_token_expires_at)
VALUES (1, '${escapeSql(tokens.access_token)}', '${escapeSql(tokens.refresh_token)}', now() + interval '${expiresIn} seconds')
ON CONFLICT (id) DO UPDATE SET
  access_token = EXCLUDED.access_token,
  refresh_token = EXCLUDED.refresh_token,
  access_token_expires_at = EXCLUDED.access_token_expires_at,
  updated_at = now();`;

  console.log('\nCredenciales obtenidas. Guarda el refresh token en Vercel:');
  console.log(`\nETSY_REFRESH_TOKEN=${tokens.refresh_token}\n`);
  console.log('Y ejecuta este SQL en Supabase:\n');
  console.log(sql);
};

const exchangeCode = async (code, verifier) => {
  const response = await fetch(TOKEN_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      'x-api-key': `${keyString}:${sharedSecret}`,
    },
    body: new URLSearchParams({
      grant_type: 'authorization_code',
      client_id: keyString,
      redirect_uri: redirectUri,
      code,
      code_verifier: verifier,
    }),
  });

  const payload = await response.json().catch(() => null);

  if (!response.ok || !payload?.access_token || !payload?.refresh_token) {
    throw new Error(
      `Etsy rechazó el intercambio del código (${response.status}).`
    );
  }

  return payload;
};

const exchangeFromArgs = async () => {
  const index = process.argv.indexOf('--exchange');
  if (index === -1) {
    return false;
  }

  const code = process.argv[index + 1];
  if (!code) {
    console.error('Uso: node scripts/etsy-oauth.mjs --exchange <code>');
    process.exit(1);
  }

  const pending = JSON.parse(await readFile(PENDING_FILE, 'utf8'));
  const tokens = await exchangeCode(code, pending.verifier);
  await unlink(PENDING_FILE);
  printCredentials(tokens);
  return true;
};

const html = (message) => `<!doctype html>
<html lang="es">
  <head>
    <meta charset="utf-8" />
    <title>Autorización de Etsy</title>
    <style>
      body { font-family: system-ui, sans-serif; background: #0a0a0a; color: #f5f5f5; display: grid; place-items: center; min-height: 100vh; margin: 0; }
      main { max-width: 32rem; padding: 2rem; text-align: center; }
    </style>
  </head>
  <body><main><h1>${message}</h1></main></body>
</html>`;

const runLocalServer = async () => {
  const pkce = createPkce();
  await writeFile(
    PENDING_FILE,
    JSON.stringify({ verifier: pkce.verifier, state: pkce.state }, null, 2)
  );

  const authUrl = new URL('https://www.etsy.com/oauth/connect');
  authUrl.searchParams.set('response_type', 'code');
  authUrl.searchParams.set('client_id', keyString);
  authUrl.searchParams.set('redirect_uri', redirectUri);
  authUrl.searchParams.set('scope', scopes);
  authUrl.searchParams.set('state', pkce.state);
  authUrl.searchParams.set('code_challenge', pkce.challenge);
  authUrl.searchParams.set('code_challenge_method', 'S256');

  console.log('\n1. Abre esta URL en el navegador y autoriza la app:\n');
  console.log(authUrl.toString());
  console.log(
    `\n2. Esperando el callback en ${redirectUri} ...\n` +
      '3. Si Etsy exige HTTPS, usa el callback desplegado y ejecuta:\n' +
      '   node scripts/etsy-oauth.mjs --exchange <code>\n'
  );

  const redirect = new URL(redirectUri);

  if (redirect.protocol !== 'http:') {
    return;
  }

  const port = Number(redirect.port || 80);

  const server = createServer(async (req, res) => {
    const requestUrl = new URL(req.url ?? '/', redirectUri);

    if (requestUrl.pathname !== redirect.pathname) {
      res.statusCode = 404;
      res.end('Not found');
      return;
    }

    res.setHeader('Content-Type', 'text/html; charset=utf-8');

    const error = requestUrl.searchParams.get('error');
    const code = requestUrl.searchParams.get('code');
    const state = requestUrl.searchParams.get('state');

    if (error) {
      res.statusCode = 400;
      res.end(html(`Etsy devolvió un error: ${error}`));
      server.close();
      return;
    }

    if (!code || state !== pkce.state) {
      res.statusCode = 400;
      res.end(html('Código o state inválido. Vuelve a iniciar el proceso.'));
      server.close();
      return;
    }

    try {
      const tokens = await exchangeCode(code, pkce.verifier);
      await unlink(PENDING_FILE);
      printCredentials(tokens);
      res.end(html('Autorización completada. Revisa la terminal.'));
    } catch (exchangeError) {
      console.error(exchangeError.message);
      res.statusCode = 500;
      res.end(html('No se pudo completar el intercambio. Revisa la terminal.'));
    }

    server.close();
  });

  server.listen(port, redirect.hostname);
};

const exchanged = await exchangeFromArgs();
if (!exchanged) {
  await runLocalServer();
}
