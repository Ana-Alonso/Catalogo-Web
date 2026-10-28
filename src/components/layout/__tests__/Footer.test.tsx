import { describe, expect, it } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router';
import i18n from '../../../i18n';
import Footer from '../Footer';

const renderFooter = () =>
  render(
    <MemoryRouter initialEntries={['/es']}>
      <Footer />
    </MemoryRouter>
  );

describe('Footer', () => {
  it('muestra la firma de autoría enlazada a GitHub', async () => {
    renderFooter();

    const credit = await screen.findByRole('link', { name: 'Ana Alonso' });
    expect(credit).toHaveAttribute('href', 'https://github.com/Ana-Alonso');
    expect(credit.parentElement).toHaveTextContent('Diseño y desarrollo por');
    expect(credit).toHaveAttribute('rel', expect.stringContaining('noopener'));
  });

  it('traduce la firma al inglés', async () => {
    await i18n.changeLanguage('en');
    renderFooter();

    const credit = await screen.findByRole('link', { name: 'Ana Alonso' });
    expect(credit.parentElement).toHaveTextContent('Design & development by');

    await i18n.changeLanguage('es');
  });
});
