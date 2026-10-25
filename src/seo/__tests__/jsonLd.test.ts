import { describe, expect, it } from 'vitest';
import { buildHomeStructuredData } from '../jsonLd';

type GraphNode = Record<string, unknown>;

const buildGraph = (
  socialLinks: string[] = []
): GraphNode[] => {
  const data = buildHomeStructuredData('es', 'Descripción de prueba', {
    siteUrl: 'https://example.com',
    socialLinks,
  });

  return data['@graph'] as GraphNode[];
};

const findNode = (graph: GraphNode[], type: string): GraphNode => {
  const node = graph.find((item) => item['@type'] === type);

  if (!node) {
    throw new Error(`No se encontró el nodo ${type}`);
  }

  return node;
};

describe('buildHomeStructuredData', () => {
  it('incluye organización, sitio y página', () => {
    const graph = buildGraph();

    expect(graph).toHaveLength(3);
    expect(findNode(graph, 'Organization')['@id']).toBe(
      'https://example.com/#organization'
    );
    expect(findNode(graph, 'WebSite')['@id']).toBe(
      'https://example.com/#website'
    );
    expect(findNode(graph, 'WebPage')['@id']).toBe(
      'https://example.com/es#webpage'
    );
  });

 it('usa la URL y el idioma de la versión española', () => {
    const graph = buildGraph();
    const website = findNode(graph, 'WebSite');
    const webpage = findNode(graph, 'WebPage');

    expect(website.url).toBe('https://example.com/');
    expect(website.inLanguage).toBe('es');

    expect(webpage.url).toBe('https://example.com/es');
  });

  it('omite sameAs cuando no hay redes sociales', () => {
    const organization = findNode(buildGraph(), 'Organization');

    expect(organization).not.toHaveProperty('sameAs');
  });

  it('incluye sameAs cuando hay redes sociales', () => {
    const organization = findNode(
      buildGraph([
        'https://etsy.example.com',
        'https://instagram.example.com',
      ]),
      'Organization'
    );

    expect(organization.sameAs).toEqual([
      'https://etsy.example.com',
      'https://instagram.example.com',
    ]);
  });

  it('publica la imagen social como URL absoluta', () => {
    const webpage = findNode(buildGraph(), 'WebPage');

    expect(webpage.primaryImageOfPage).toBe(
      'https://example.com/og-image.png'
    );
  });

  it('reutiliza la descripción en sitio y página', () => {
    const graph = buildGraph();

    expect(findNode(graph, 'WebSite').description).toBe(
      'Descripción de prueba'
    );
    expect(findNode(graph, 'WebPage').description).toBe(
      'Descripción de prueba'
    );
  });
});
