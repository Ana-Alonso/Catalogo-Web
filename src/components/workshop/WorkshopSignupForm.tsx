import React, { useState, type SubmitEvent } from 'react';
import { Trans, useTranslation } from 'react-i18next';
import { CheckCircle, AlertCircle, UserPlus, LoaderCircle, Bell, Minus, Plus } from 'lucide-react';
import { Button, Input, Box, CalendarEventActions, TextLink, Typography, Icon } from '../ui';
import {
  getRegistrationErrorCode,
  type RegistrationErrorCode,
} from '../../errors/registrationError';
import type { CatalogItem } from '../../types/catalog';
import type { RegistrationFormData } from '../../types/registrations';
import { WorkshopConsentFields } from './WorkshopConsentFields';

interface WorkshopSignupFormProps {
  workshop: CatalogItem;
  onRegister: (data: RegistrationFormData) => Promise<void>;
  onClose: () => void;
}

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const MIN_UNITS = 1;
const MAX_UNITS = 10;

type WorkshopFormErrorCode =
  | 'required'
  | 'invalidEmail'
  | 'privacyRequired'
  | 'invalidQuantity'
  | RegistrationErrorCode;

const clampUnits = (value: number): number =>
  Math.min(MAX_UNITS, Math.max(MIN_UNITS, value));

const SPECIAL_ERROR_KEYS: Partial<
  Record<WorkshopFormErrorCode,
    'rateLimitedUnits' | 'alreadyRegisteredUnits' | 'workshopFullUnits' | 'registrationClosedUnits' | 'unknownUnits'
  >
> = {
  rateLimited: 'rateLimitedUnits',
  alreadyRegistered: 'alreadyRegisteredUnits',
  workshopFull: 'workshopFullUnits',
  registrationClosed: 'registrationClosedUnits',
  unknown: 'unknownUnits',
};

const SOCIAL_NOTICE_KEYS = {
  both: ['workshop.social.both', 'workshop.social.bothUnits'],
  instagram: ['workshop.social.instagram', 'workshop.social.instagramUnits'],
  tiktok: ['workshop.social.tiktok', 'workshop.social.tiktokUnits'],
  none: ['workshop.social.none', 'workshop.social.noneUnits'],
} as const;

export const WorkshopSignupForm: React.FC<WorkshopSignupFormProps> = ({
  workshop,
  onRegister,
  onClose,
}) => {
  const { t } = useTranslation();
  const isSpecial = workshop.category === 'especiales';
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [quantity, setQuantity] = useState(String(MIN_UNITS));
  const [privacyConsent, setPrivacyConsent] = useState(false);
  const [marketingConsent, setMarketingConsent] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorCode, setErrorCode] = useState<WorkshopFormErrorCode | null>(null);
  const [isSuccess, setIsSuccess] = useState(false);
  const [submittedUnits, setSubmittedUnits] = useState(MIN_UNITS);
  const instagramUrl = import.meta.env.VITE_INSTAGRAM_URL;
  const tiktokUrl = import.meta.env.VITE_TIKTOK_URL;

  const stepUnits = (delta: number): void =>
    setQuantity((prev) => {
      const parsed = Number.parseInt(prev, 10);
      const base = Number.isNaN(parsed) ? MIN_UNITS : parsed;
      return String(clampUnits(base + delta));
    });

  const handleSubmit = async (event: SubmitEvent<HTMLFormElement>) => {
    event.preventDefault();
    setErrorCode(null);

    const trimmedName = name.trim();
    const trimmedEmail = email.trim();

    if (!trimmedName || !trimmedEmail) {
      setErrorCode('required');
      return;
    }

    if (!EMAIL_PATTERN.test(trimmedEmail)) {
      setErrorCode('invalidEmail');
      return;
    }

    const parsedUnits = Number.parseInt(quantity, 10);
    const units = Number.isNaN(parsedUnits) ? MIN_UNITS : clampUnits(parsedUnits);

    if (
      isSpecial &&
      (Number.isNaN(parsedUnits) || parsedUnits < MIN_UNITS || parsedUnits > MAX_UNITS)
    ) {
      setErrorCode('invalidQuantity');
      return;
    }

    if (!privacyConsent) {
      setErrorCode('privacyRequired');
      return;
    }

    setIsSubmitting(true);
    try {
      await onRegister({
        name: trimmedName,
        email: trimmedEmail,
        privacyConsent,
        marketingConsent,
        ...(isSpecial ? { quantity: units } : {}),
      });
      setSubmittedUnits(units);
      setIsSuccess(true);
    } catch (err) {
      setErrorCode(getRegistrationErrorCode(err));
    } finally {
      setIsSubmitting(false);
    }
  };

  const socialVariant =
    instagramUrl && tiktokUrl
      ? 'both'
      : instagramUrl
        ? 'instagram'
        : tiktokUrl
          ? 'tiktok'
          : 'none';
  const socialNoticeKey = SOCIAL_NOTICE_KEYS[socialVariant][isSpecial ? 1 : 0];

  if (isSuccess) {
    return (
      <Box display="flex" direction="column" gap="md">
        <Box display="flex" direction="column" gap="md" textAlign="center">
          <Box display="flex" justify="center">
            <Box
              width={12}
              height={12}
              background="successSoft"
              border
              borderTone="success"
              rounded="full"
              display="flex"
              align="center"
              justify="center"
            >
              <Icon as={CheckCircle} size="xl" tone="success" />
            </Box>
          </Box>
          <Box>
            <Typography variant="body" tone="main" weight="semibold">
              {t(isSpecial ? 'workshop.form.successTitleUnits' : 'workshop.form.successTitle')}
            </Typography>
            <Typography variant="body" size="sm" tone="muted" marginTop="xs">
              {isSpecial
                ? t('workshop.form.successBodyUnits', {
                    title: workshop.title,
                    quantity: submittedUnits,
                  })
                : t('workshop.form.successBody', { title: workshop.title })}
            </Typography>
          </Box>
        </Box>

        {!isSpecial && (
          <CalendarEventActions workshop={workshop} attendee={{ name, email }} />
        )}

        <Box
          display="flex"
          align="start"
          gap="sm"
          padding="tight"
          background="neutral"
          border
          rounded="lg"
        >
          <Icon as={Bell} tone="warning" shrink={false} marginTop="half" />
          <Typography as="span" variant="body" size="sm" tone="muted">
            <Trans
              i18nKey={socialNoticeKey}
              components={{
                instagram: (
                  <TextLink
                    href={instagramUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    tone="warning"
                    hover="accentSoft"
                    underline
                    weight="medium"
                    aria-label={t(
                      isSpecial
                        ? 'workshop.social.instagramAriaUnits'
                        : 'workshop.social.instagramAria'
                    )}
                  />
                ),
                tiktok: (
                  <TextLink
                    href={tiktokUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    tone="warning"
                    hover="accentSoft"
                    underline
                    weight="medium"
                    aria-label={t(
                      isSpecial
                        ? 'workshop.social.tiktokAriaUnits'
                        : 'workshop.social.tiktokAria'
                    )}
                  />
                ),
              }}
            />
          </Typography>
        </Box>

        <Button type="button" variant="primary" fullWidth onClick={onClose}>
          {t('common.close')}
        </Button>
      </Box>
    );
  }

  return (
    <Box as="form" display="flex" direction="column" gap="md" onSubmit={handleSubmit} noValidate>
      <Typography variant="body" size="sm" tone="muted">
        {isSpecial
          ? t('workshop.form.introUnits', { title: workshop.title })
          : t('workshop.form.intro', { title: workshop.title })}
      </Typography>

      <Input
        id="signup-name"
        label={t('workshop.form.nameLabel')}
        required
        value={name}
        onChange={(event) => setName(event.target.value)}
        placeholder={t('workshop.form.namePlaceholder')}
        autoComplete="name"
        autoFocus
      />

      <Input
        id="signup-email"
        label={t('workshop.form.emailLabel')}
        type="email"
        required
        value={email}
        onChange={(event) => setEmail(event.target.value)}
        placeholder={t('workshop.form.emailPlaceholder')}
        autoComplete="email"
      />

      {isSpecial && (
        <Box display="flex" align="end" gap="sm">
          <Box grow>
            <Input
              id="signup-quantity"
              label={t('workshop.form.quantityLabel')}
              type="number"
              inputMode="numeric"
              min={MIN_UNITS}
              max={MAX_UNITS}
              step={1}
              required
              value={quantity}
              onChange={(event) => setQuantity(event.target.value)}
            />
          </Box>
          <Box display="flex" gap="xs">
            <Button
              type="button"
              variant="secondary"
              size="sm"
              onClick={() => stepUnits(-1)}
              disabled={Number.parseInt(quantity, 10) <= MIN_UNITS}
              aria-label={t('workshop.form.quantityMinus')}
            >
              <Icon as={Minus} size="sm" />
            </Button>
            <Button
              type="button"
              variant="secondary"
              size="sm"
              onClick={() => stepUnits(1)}
              disabled={Number.parseInt(quantity, 10) >= MAX_UNITS}
              aria-label={t('workshop.form.quantityPlus')}
            >
              <Icon as={Plus} size="sm" />
            </Button>
          </Box>
        </Box>
      )}

      <WorkshopConsentFields
        isSpecial={isSpecial}
        privacyConsent={privacyConsent}
        marketingConsent={marketingConsent}
        hasPrivacyError={errorCode === 'privacyRequired'}
        onPrivacyConsentChange={(checked) => {
          setPrivacyConsent(checked);
          if (errorCode === 'privacyRequired') {
            setErrorCode(null);
          }
        }}
        onMarketingConsentChange={setMarketingConsent}
      />

      {errorCode && errorCode !== 'privacyRequired' && (
        <Box
          display="flex"
          align="center"
          gap="sm"
          padding="tight"
          rounded="lg"
          background="dangerSoft"
          border
          borderTone="danger"
          role="alert"
        >
          <Icon as={AlertCircle} tone="dangerStrong" shrink={false} />
          <Typography as="span" variant="body" size="sm" tone="dangerSoft">
            {t(
              `workshop.form.errors.${
                (isSpecial && errorCode ? SPECIAL_ERROR_KEYS[errorCode] : undefined) ??
                errorCode
              }`
            )}
          </Typography>
        </Box>
      )}

      <Button type="submit" variant="primary" fullWidth disabled={isSubmitting}>
        {isSubmitting ? (
          <>
            <Icon as={LoaderCircle} spin />
            {t(isSpecial ? 'workshop.form.submittingUnits' : 'workshop.form.submitting')}
          </>
        ) : (
          <>
            <Icon as={UserPlus} />
            {t(isSpecial ? 'workshop.form.submitUnits' : 'workshop.form.submit')}
          </>
        )}
      </Button>
    </Box>
  );
};

export default WorkshopSignupForm;
