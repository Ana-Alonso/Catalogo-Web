const params = new URLSearchParams(window.location.search);
const code = params.get('code');
const error = params.get('error');
const message = document.getElementById('message');
const errorBox = document.getElementById('error');
const result = document.getElementById('result');
const codeBox = document.getElementById('code');
const commandBox = document.getElementById('command');
const copyButton = document.getElementById('copy');
const copied = document.getElementById('copied');

if (error) {
  message.textContent = 'Etsy denegó la autorización.';
  errorBox.textContent = error;
  errorBox.classList.remove('hidden');
} else if (!code) {
  message.textContent = 'No se recibió ningún código de autorización.';
} else {
  message.classList.add('hidden');
  result.classList.remove('hidden');
  codeBox.textContent = code;
  commandBox.textContent = `node scripts/etsy-oauth.mjs --exchange ${code}`;
}

copyButton?.addEventListener('click', async () => {
  if (!code) {
    return;
  }
  await navigator.clipboard.writeText(code);
  copied?.classList.remove('hidden');
});
