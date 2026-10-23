import { useContext } from 'react';
import { UNSAFE_FrameworkContext } from 'react-router';
import type { LdJsonObject } from '../../seo/jsonLd';

interface JsonLdProps {
  data: LdJsonObject;
}

export const JsonLd = ({ data }: JsonLdProps) => {
  const frameworkContext = useContext(UNSAFE_FrameworkContext);
  const documentNonce =
    typeof document !== 'undefined'
      ? Array.from(document.scripts).find((script) => script.nonce)?.nonce
      : undefined;
  const nonce = frameworkContext?.nonce ?? documentNonce;
  const content = JSON.stringify(data).replace(/</g, '\\u003c');

  return (
    <script
      type="application/ld+json"
      nonce={nonce}
      dangerouslySetInnerHTML={{ __html: content }}
    />
  );
};

export default JsonLd;
