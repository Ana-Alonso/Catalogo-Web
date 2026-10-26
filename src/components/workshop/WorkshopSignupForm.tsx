import React, { useState, type FormEvent } from 'react';
import { Trans, useTranslation } from 'react-i18next';
import { CheckCircle, AlertCircle, UserPlus, LoaderCircle, Bell } from 'lucide-react';
import { Button, Input, Box, CalendarEventActions, TextLink, Typography, Icon } from '../ui';
import {
  getRegistrationErrorCode,
  type RegistrationErrorCode,
} from '../../errors/registrationError';
import type { CatalogItem } from '../../types/catalog';
import type { RegistrationFormData } from '../../types/registrations';

interface WorkshopSignupFormProps {
  workshop: CatalogItem;
  onRegister: (data: RegistrationFormData) => Promise<void>;
  onClose: () => void;
}

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

type WorkshopFormErrorCode =
  | 'required'
  | 'invalidEmail'
  | RegistrationErrorCode;

export const WorkshopSignupForm: React.FC<WorkshopSignupFormProps> = ({
  workshop,
  onRegister,
  onClose,
}) => {
  const { t } = useTranslation();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorCode, setErrorCode] = useState<WorkshopFormErrorCode | null>(null);
  const [isSuccess, setIsSuccess] = useState(false);
  const instagramUrl = import.meta.env.VITE_INSTAGRAM_URL;
  const tiktokUrl = import.meta.env.VITE_TIKTOK_URL;

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
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

    setIsSubmitting(true);
    try {
      await onRegister({ name: trimmedName, email: trimmedEmail });
      setIsSuccess(true);
    } catch (err) {
      setErrorCode(getRegistrationErrorCode(err));
    } finally {
      setIsSubmitting(false);
    }
  };

  const socialNoticeKey =
    instagramUrl && tiktokUrl
      ? 'workshop.social.both'
      : instagramUrl
        ? 'workshop.social.instagram'
        : tiktokUrl
          ? 'workshop.social.tiktok'
          : 'workshop.social.none';

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
              {t('workshop.form.successTitle')}
            </Typography>
            <Typography variant="body" size="sm" tone="muted" marginTop="xs">
              {t('workshop.form.successBody', { title: workshop.title })}
            </Typography>
          </Box>
        </Box>

        <CalendarEventActions workshop={workshop} attendee={{ name, email }} />

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
                    aria-label={t('workshop.social.instagramAria')}
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
                    aria-label={t('workshop.social.tiktokAria')}
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
        {t('workshop.form.intro', { title: workshop.title })}
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

      {errorCode && (
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
            {t(`workshop.form.errors.${errorCode}`)}
          </Typography>
        </Box>
      )}

      <Button type="submit" variant="primary" fullWidth disabled={isSubmitting}>
        {isSubmitting ? (
          <>
            <Icon as={LoaderCircle} spin />
            {t('workshop.form.submitting')}
          </>
        ) : (
          <>
            <Icon as={UserPlus} />
            {t('workshop.form.submit')}
          </>
        )}
      </Button>
    </Box>
  );
};

export default WorkshopSignupForm;
