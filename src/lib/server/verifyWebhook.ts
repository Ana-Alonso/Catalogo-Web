import { createHmac, timingSafeEqual } from 'node:crypto';

const MAX_CLOCK_SKEW_SECONDS = 300;

const parseSignatures = (header: string): Buffer[] => {
  return header
    .split(' ')
    .map((entry) => entry.split(','))
    .filter((parts) => parts.length === 2 && parts[0] === 'v1')
    .map((parts) => Buffer.from(parts[1], 'base64'));
};

export const verifyEtsyWebhook = (
  headers: Headers,
  rawBody: string,
  secret: string
): boolean => {
  const webhookId = headers.get('webhook-id');
  const webhookTimestamp = headers.get('webhook-timestamp');
  const webhookSignature = headers.get('webhook-signature');

  if (!webhookId || !webhookTimestamp || !webhookSignature) {
    return false;
  }

  const timestamp = Number(webhookTimestamp);
  if (!Number.isFinite(timestamp)) {
    return false;
  }

  const nowSeconds = Math.floor(Date.now() / 1000);
  if (Math.abs(nowSeconds - timestamp) > MAX_CLOCK_SKEW_SECONDS) {
    return false;
  }

  const separatorIndex = secret.indexOf('_');
  const encodedSecret =
    separatorIndex === -1 ? secret : secret.slice(separatorIndex + 1);
  const secretBytes = Buffer.from(encodedSecret, 'base64');
  const expected = createHmac('sha256', secretBytes)
    .update(`${webhookId}.${webhookTimestamp}.${rawBody}`)
    .digest();

  return parseSignatures(webhookSignature).some(
    (provided) =>
      provided.length === expected.length && timingSafeEqual(provided, expected)
  );
};
