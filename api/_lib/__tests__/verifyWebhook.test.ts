import { createHmac } from 'node:crypto';
import { describe, expect, it } from 'vitest';
import { verifyEtsyWebhook } from '../verifyWebhook';
import type { ApiRequest } from '../http';

const secret = 'whsec_c2VjcmV0by1kZS1wcnVlYmE=';

const buildRequest = (signature: string, timestamp: number): ApiRequest =>
  ({
    headers: {
      'webhook-id': 'msg_123',
      'webhook-timestamp': String(timestamp),
      'webhook-signature': signature,
    },
  }) as unknown as ApiRequest;

const sign = (body: string, timestamp: number): string => {
  const digest = createHmac('sha256', Buffer.from(secret.replace('whsec_', ''), 'base64'))
    .update(`msg_123.${timestamp}.${body}`)
    .digest('base64');
  return `v1,${digest}`;
};

describe('verifyEtsyWebhook', () => {
  it('accepts a valid signature', () => {
    const timestamp = Math.floor(Date.now() / 1000);
    const body = JSON.stringify({ event_type: 'listing.updated', listing_id: 1 });

    expect(verifyEtsyWebhook(buildRequest(sign(body, timestamp), timestamp), body, secret)).toBe(
      true
    );
  });

  it('rejects a tampered body', () => {
    const timestamp = Math.floor(Date.now() / 1000);
    const body = JSON.stringify({ event_type: 'listing.updated', listing_id: 1 });
    const signature = sign(body, timestamp);

    expect(
      verifyEtsyWebhook(
        buildRequest(signature, timestamp),
        JSON.stringify({ event_type: 'listing.deleted', listing_id: 1 }),
        secret
      )
    ).toBe(false);
  });

  it('rejects old timestamps', () => {
    const timestamp = Math.floor(Date.now() / 1000) - 600;
    const body = '{}';

    expect(verifyEtsyWebhook(buildRequest(sign(body, timestamp), timestamp), body, secret)).toBe(
      false
    );
  });

  it('rejects requests without signature headers', () => {
    const request = { headers: {} } as unknown as ApiRequest;
    expect(verifyEtsyWebhook(request, '{}', secret)).toBe(false);
  });
});
