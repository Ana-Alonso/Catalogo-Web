import { describe, expect, it } from 'vitest';
import { render, screen } from '@testing-library/react';
import ContentBlockView from '../ContentBlockView';
import type { ContentBlock } from '../../../data/content/types';

describe('ContentBlockView', () => {
  it('renderiza un párrafo con la tipografía de cuerpo del sitio', () => {
    const block: ContentBlock = { kind: 'paragraph', text: 'Un texto largo de prueba.' };
    render(<ContentBlockView block={block} />);

    const paragraph = screen.getByText('Un texto largo de prueba.');
    expect(paragraph.tagName).toBe('P');
    expect(paragraph.className).toContain('text-sm');
  });

  it('renderiza las listas como ul con items de texto plano', () => {
    const block: ContentBlock = { kind: 'list', items: ['Primera', 'Segunda'] };
    const { container } = render(<ContentBlockView block={block} />);

    const list = container.querySelector('ul');
    expect(list?.className).toContain('list-disc');
    expect(container.querySelectorAll('li')).toHaveLength(2);
    expect(screen.getByText('Primera').tagName).toBe('P');
  });
});
