import { describe, expect, it } from 'vitest';
import { getFaqDocument } from '../documents';
import { FAQ_SLUG, buildFaqPath, getFaqAlternatePaths } from '../paths';
import { FAQ_CONTACT_EMAIL } from '../contact';
import type { FaqDocument, FaqQuestion } from '../types';

const documents: Record<'es' | 'en', FaqDocument> = {
  es: getFaqDocument('es'),
  en: getFaqDocument('en'),
};

const blockHasText = (block: FaqQuestion['blocks'][number]): boolean =>
  block.kind === 'paragraph'
    ? block.text.trim().length > 0
    : block.items.length > 0 && block.items.every((item) => item.trim().length > 0);

describe('documentos de preguntas frecuentes', () => {
  it('mantiene las mismas preguntas en el mismo orden en los dos idiomas', () => {
    expect(documents.en.questions.map(({ id }) => id)).toEqual(
      documents.es.questions.map(({ id }) => id)
    );
  });

  it('no repite identificador ni deja preguntas sin respuesta', () => {
    Object.values(documents).forEach((document) => {
      const ids = document.questions.map(({ id }) => id);

      expect(new Set(ids).size).toBe(ids.length);
      document.questions.forEach((question) => {
        expect(question.question.trim()).not.toBe('');
        expect(question.blocks.length).toBeGreaterThan(0);
        expect(question.blocks.every(blockHasText)).toBe(true);
      });
    });
  });

  it('interpola el correo de contacto en las respuestas de los dos idiomas', () => {
    Object.values(documents).forEach((document) => {
      const body = document.questions
        .flatMap((question) => question.blocks)
        .map((block) => (block.kind === 'paragraph' ? block.text : block.items.join(' ')))
        .join(' ');

      expect(body).toContain(FAQ_CONTACT_EMAIL);
    });
  });

  it('usa el mismo slug en los dos idiomas para que el cambio de idioma no dé 404', () => {
    expect(buildFaqPath('es')).toBe(`/es/${FAQ_SLUG}`);
    expect(buildFaqPath('en')).toBe(`/en/${FAQ_SLUG}`);
    expect(getFaqAlternatePaths()).toEqual([`/es/${FAQ_SLUG}`, `/en/${FAQ_SLUG}`]);
  });
});
