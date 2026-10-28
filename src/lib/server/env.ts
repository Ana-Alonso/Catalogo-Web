export interface SupabaseEnv {
  supabaseUrl: string;
  supabaseServiceRoleKey: string;
  supabaseAnonKey: string;
}

export interface ServerEnv extends SupabaseEnv {
  etsyKeyString: string;
  etsySharedSecret: string;
  etsyShopId: string;
  etsyRefreshToken: string | null;
  etsyWebhookSecret: string;
  etsyTokenEncryptionKey: string;
  cronSecret: string | null;
}

const required = (name: string): string => {
  const value = process.env[name];
  if (!value) {
    throw new Error(`Falta la variable de entorno ${name}.`);
  }
  return value;
};

const optional = (name: string): string | null => process.env[name] || null;

export const getSupabaseEnv = (): SupabaseEnv => ({
  supabaseUrl: required('SUPABASE_URL'),
  supabaseServiceRoleKey: required('SUPABASE_SERVICE_ROLE_KEY'),
  supabaseAnonKey: required('SUPABASE_ANON_KEY'),
});

export const getServerEnv = (): ServerEnv => ({
  ...getSupabaseEnv(),
  etsyKeyString: required('ETSY_KEYSTRING'),
  etsySharedSecret: required('ETSY_SHARED_SECRET'),
  etsyShopId: required('ETSY_SHOP_ID'),
  etsyRefreshToken: optional('ETSY_REFRESH_TOKEN'),
  etsyWebhookSecret: required('ETSY_WEBHOOK_SECRET'),
  etsyTokenEncryptionKey: required('ETSY_TOKEN_ENCRYPTION_KEY'),
  cronSecret: optional('CRON_SECRET'),
});
