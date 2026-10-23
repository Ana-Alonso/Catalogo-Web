import { afterEach, describe, expect, it } from 'vitest';
import { render } from '@testing-library/react';
import { UNSAFE_FrameworkContext } from 'react-router';
import JsonLd from '../JsonLd';

const getJsonLdScript = (container: HTMLElement): HTMLScriptElement => {
  const script = container.querySelector<HTMLScriptElement>(
    'script[type="application/ld+json"]'
  );

  if (!script) {
    throw new Error('No se encontró el script JSON-LD');
  }

  return script;
};

afterEach(() => {
  document
    .querySelectorAll('script[data-test-nonce]')
    .forEach((script) => script.remove());
});

describe('JsonLd', () => {
  it('prioriza el nonce del contexto de React Router', () => {
    const documentScript = document.createElement('script');
    documentScript.setAttribute('nonce', 'document-nonce');
    documentScript.dataset.testNonce = 'true';
    document.head.appendChild(documentScript);

    const { container } = render(
      <UNSAFE_FrameworkContext.Provider value={{ nonce: 'context-nonce' } as never}>
        <JsonLd data={{ '@type': 'Thing' }} />
      </UNSAFE_FrameworkContext.Provider>
    );

    expect(getJsonLdScript(container)).toHaveAttribute(
      'nonce',
      'context-nonce'
    );
  });

  it('usa el nonce del documento cuando no hay contexto', () => {
    const documentScript = document.createElement('script');
    documentScript.setAttribute('nonce', 'document-nonce');
    documentScript.dataset.testNonce = 'true';
    document.head.appendChild(documentScript);

    const { container } = render(<JsonLd data={{ '@type': 'Thing' }} />);

    expect(getJsonLdScript(container)).toHaveAttribute(
      'nonce',
      'document-nonce'
    );
  });

  it('serializa datos JSON válidos', () => {
    const { container } = render(
      <JsonLd data={{ '@type': 'Thing', name: 'A < B' }} />
    );
    const script = getJsonLdScript(container);

    expect(JSON.parse(script.textContent ?? '')).toEqual({
      '@type': 'Thing',
      name: 'A < B',
    });
  });

  it('escapa cierres de script para evitar inyección', () => {
    const { container } = render(
      <JsonLd data={{ name: '</script><script>alert(1)</script>' }} />
    );
    const script = getJsonLdScript(container);

    expect(script.textContent).toContain('\\u003c/script>');
    expect(script.textContent).not.toContain('</script>');
  });

  it('mantiene el tipo application/ld+json', () => {
    const { container } = render(<JsonLd data={{ '@type': 'Thing' }} />);

    expect(getJsonLdScript(container)).toHaveAttribute(
      'type',
      'application/ld+json'
    );
  });
});
