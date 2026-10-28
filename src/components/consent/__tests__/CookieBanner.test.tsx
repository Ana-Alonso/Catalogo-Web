import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router';
import i18n from '../../../i18n';
import { CookieBanner } from '../CookieBanner';
import { CookieSettingsModal } from '../CookieSettingsModal';
import { CookieConsentProvider } from '../CookieConsentProvider';
import { ToastProvider } from '../../toast/ToastProvider';
import {
  OPEN_COOKIE_SETTINGS_EVENT,
  readCookieConsent,
  writeCookieConsent,
} from '../../../utils/cookieConsent';
import { stopAnalytics } from '../../../utils/analytics';

const GA_SCRIPT_ID = 'ga4-loader';
const findScript = (): HTMLScriptElement | null =>
  document.querySelector<HTMLScriptElement>(`#${GA_SCRIPT_ID}`);

const renderConsent = () =>
  render(
    <MemoryRouter initialEntries={['/es']}>
      <ToastProvider>
        <CookieConsentProvider>
          <CookieBanner />
          <CookieSettingsModal />
        </CookieConsentProvider>
      </ToastProvider>
    </MemoryRouter>
  );

const banner = () => screen.queryByRole('region', { name: i18n.t('cookie.bannerAria') });

beforeEach(() => {
  window.localStorage.clear();
  stopAnalytics();
});

afterEach(() => {
  stopAnalytics();
});

describe('CookieBanner', () => {
  it('muestra la barra a un visitante nuevo sin cargar la analítica', () => {
    renderConsent();

    expect(banner()).not.toBeNull();
    expect(screen.getByRole('button', { name: i18n.t('cookie.accept') })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: i18n.t('cookie.reject') })).toBeInTheDocument();
    expect(window.gtag).toBeUndefined();
    expect(findScript()).toBeNull();
  });

  it('enlaza la política de cookies y la privacidad desde la propia barra', () => {
    renderConsent();

    expect(screen.getByRole('link', { name: i18n.t('cookie.policyLink') })).toHaveAttribute(
      'href',
      '/es/cookies'
    );
    expect(screen.getByRole('link', { name: i18n.t('cookie.privacyLink') })).toHaveAttribute(
      'href',
      '/es/privacidad'
    );
  });

  it('rechazar guarda la negativa y deja la analítica apagada', async () => {
    const user = userEvent.setup();
    renderConsent();

    await user.click(screen.getByRole('button', { name: i18n.t('cookie.reject') }));

    await waitFor(() => expect(banner()).toBeNull());
    expect(readCookieConsent()?.analytics).toBe(false);
    expect(findScript()).toBeNull();
    expect(window.gtag).toBeUndefined();
  });

  it('aceptar guarda el consentimiento y arranca la analítica', async () => {
    const user = userEvent.setup();
    renderConsent();

    await user.click(screen.getByRole('button', { name: i18n.t('cookie.accept') }));

    await waitFor(() => expect(findScript()).not.toBeNull());
    expect(readCookieConsent()?.analytics).toBe(true);
    await waitFor(() => expect(banner()).toBeNull());
  });

  it('no aparece para un visitante recurrente que ya aceptó', () => {
    writeCookieConsent(true);
    renderConsent();

    expect(banner()).toBeNull();
    expect(findScript()).not.toBeNull();
  });

  it('revocar desde la configuración detiene la analítica', async () => {
    const user = userEvent.setup();
    writeCookieConsent(true);
    renderConsent();

    await waitFor(() => expect(findScript()).not.toBeNull());

    window.dispatchEvent(new Event(OPEN_COOKIE_SETTINGS_EVENT));

    const analyticsCheckbox = await screen.findByRole('checkbox', {
      name: i18n.t('cookie.analyticsLabel'),
    });
    expect(analyticsCheckbox).toBeChecked();

    await user.click(analyticsCheckbox);
    await user.click(screen.getByRole('button', { name: i18n.t('cookie.save') }));

    await waitFor(() => expect(findScript()).toBeNull());
    expect(readCookieConsent()?.analytics).toBe(false);
    expect(window.gtag).toBeUndefined();
    expect(screen.queryByRole('dialog')).toBeNull();
    expect(await screen.findByText(i18n.t('cookie.saved'))).toBeInTheDocument();
  });

  it('confirma con un aviso cada decisión de la barra', async () => {
    const user = userEvent.setup();
    renderConsent();

    await user.click(screen.getByRole('button', { name: i18n.t('cookie.accept') }));

    expect(await screen.findByRole('status')).toHaveTextContent(i18n.t('cookie.accepted'));
  });
});
