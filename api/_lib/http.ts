import type { IncomingMessage } from 'node:http';

export interface ApiRequest extends IncomingMessage {
  method?: string;
  body?: unknown;
  query?: Record<string, string | string[]>;
}

export interface ApiResponse {
  status: (code: number) => ApiResponse;
  json: (body: unknown) => void;
  setHeader: (name: string, value: string) => void;
  end: (body?: string) => void;
}

export const readRawBody = async (req: ApiRequest): Promise<string> => {
  if (typeof req.body === 'string') {
    return req.body;
  }
  if (Buffer.isBuffer(req.body)) {
    return req.body.toString('utf8');
  }

  const chunks: Buffer[] = [];
  let size = 0;

  for await (const chunk of req) {
    const buffer = Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk);
    size += buffer.length;
    if (size > 1_000_000) {
      throw new Error('El cuerpo de la petición es demasiado grande.');
    }
    chunks.push(buffer);
  }

  return Buffer.concat(chunks).toString('utf8');
};

export const getHeader = (
  req: ApiRequest,
  name: string
): string | undefined => {
  const value = req.headers[name];
  if (Array.isArray(value)) {
    return value[0];
  }
  return value;
};
