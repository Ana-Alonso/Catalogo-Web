import React from 'react';
import { Trans, useTranslation } from 'react-i18next';
import { Mail, ShoppingBag } from 'lucide-react';
import {
  Amazon,
  Box,
  Button,
  Container,
  Footer as FooterShell,
  Icon,
  Image,
  Instagram,
  Tiktok,
  Typography,
  type IconGlyphProps,
} from '../ui';
import { LegalLink } from '../legal/LegalLink';
import { OPEN_COOKIE_SETTINGS_EVENT } from '../../utils/cookieConsent';
import logoImg from '../../assets/Logo.png';

interface SocialLinkProps {
  href: string;
  label: string;
  as: React.ComponentType<IconGlyphProps>;
  visibleText?: string;
  isMail?: boolean;
}

const SocialLink: React.FC<SocialLinkProps> = ({ href, label, as: Glyph, visibleText, isMail }) => (
  <Box
    as="a"
    href={href}
    {...(isMail
      ? {}
      : { target: '_blank', rel: 'noopener noreferrer' })}
    aria-label={label}
    title={visibleText ?? label}
    display="flex"
    align="center"
    justify="center"
    gap="xs"
    padding="xs"
    rounded="sm"
    tone="muted"
    focusRing="plain"
    group
  >
    <Icon as={Glyph} size="xl" hoverTone="primary" />
    {visibleText && (
      <Box as="span" hideBelow="sm">
        <Typography as="span" size="xs">
          {visibleText}
        </Typography>
      </Box>
    )}
  </Box>
);

const Footer: React.FC = () => {
  const { t } = useTranslation();
  const currentYear = new Date().getFullYear();
  const etsyUrl = import.meta.env.VITE_ETSY_SHOP_URL;
  const instagramUrl = import.meta.env.VITE_INSTAGRAM_URL;
  const tiktokUrl = import.meta.env.VITE_TIKTOK_URL;
  const contactEmail = import.meta.env.VITE_CONTACT_EMAIL;
  const amazonBookUrl =
    import.meta.env.VITE_AMAZON_BOOK_URL || 'https://amzn.eu/d/0dU00KQa';

  const handleOpenCookieSettings = (): void => {
    window.dispatchEvent(new Event(OPEN_COOKIE_SETTINGS_EVENT));
  };

  return (
    <FooterShell aria-labelledby="footer-heading" padding="lg" container={false}>
      <Box as="h2" id="footer-heading" srOnly>
        {t('footer.heading')}
      </Box>
      <Container size="full">
        <Box display="flex" align="center" justify="between" gap="lg" stackBelow="md">
          <Box display="flex" align="center" gap="sm">
            <Image
              src={logoImg}
              alt={t('nav.logoAlt')}
              height={11}
              width="auto"
              fit="contain"
            />
            <Typography variant="h4" transform="uppercase" tracking="wider">
              <Trans
                i18nKey="brand.name"
                components={{ highlight: <Typography as="span" variant="plain" tone="accent" /> }}
              />
            </Typography>
          </Box>

          <Box display="flex" align="center" gap="sm">
            {contactEmail && (
              <SocialLink
                isMail
                href={`mailto:${contactEmail}`}
                label={t('footer.emailAria', { email: contactEmail })}
                visibleText={contactEmail}
                as={Mail}
              />
            )}
            {amazonBookUrl && (
              <SocialLink
                href={amazonBookUrl}
                label={t('footer.amazonAria')}
                as={Amazon}
              />
            )}
            {etsyUrl && (
              <SocialLink href={etsyUrl} label={t('footer.etsyAria')} as={ShoppingBag} />
            )}
            {instagramUrl && (
              <SocialLink href={instagramUrl} label={t('footer.instagramAria')} as={Instagram} />
            )}
            {tiktokUrl && (
              <SocialLink href={tiktokUrl} label={t('footer.tiktokAria')} as={Tiktok} />
            )}
          </Box>
        </Box>

        <Box
          display="flex"
          align="center"
          justify="between"
          gap="md"
          stackBelow="sm"
          marginTop="xl"
          paddingTop="xl"
          divider="top"
        >
          <Typography variant="body" size="sm" tone="subtle" align="center">
            {t('footer.copyright', { year: currentYear })}
          </Typography>
          <Box display="flex" align="center" gap="md" wrap>
            <Typography as="span" size="xs" tone="subtle">
              {t('footer.accessibility')}
            </Typography>
            <LegalLink kind="privacy">{t('footer.privacy')}</LegalLink>
            <LegalLink kind="cookies">{t('footer.cookies')}</LegalLink>
            <LegalLink kind="notice">{t('footer.legal')}</LegalLink>
            <Button variant="ghost" size="sm" onClick={handleOpenCookieSettings}>
              {t('footer.cookieSettings')}
            </Button>
          </Box>
        </Box>
      </Container>
    </FooterShell>
  );
};

export default Footer;
