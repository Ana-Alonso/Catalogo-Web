import React, { useState, type FormEvent } from 'react';
import { Trans, useTranslation } from 'react-i18next';
import { CheckCircle, AlertCircle, UserPlus, LoaderCircle, Bell } from 'lucide-react';
import { Button, Input, Box, CalendarEventActions } from '../ui';
import { Typography } from '../ui';
import { theme } from '../../theme';
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
      <div className="space-y-4">
        <div className="text-center space-y-4">
          <div className="flex justify-center">
            <div className="w-12 h-12 bg-green-950/60 border border-green-800/60 rounded-full flex items-center justify-center">
              <CheckCircle className="w-6 h-6 text-green-400" aria-hidden="true" />
            </div>
          </div>
          <div>
            <Typography variant="body" className="text-white font-semibold">
              {t('workshop.form.successTitle')}
            </Typography>
            <Typography variant="body" className={`${theme.colors.textMuted} text-sm mt-1`}>
              {t('workshop.form.successBody', { title: workshop.title })}
            </Typography>
          </div>
        </div>

        <CalendarEventActions workshop={workshop} attendee={{ name, email }} />

        <Box className="p-3 bg-neutral-950 border border-neutral-800 rounded-lg flex items-start gap-2 text-sm text-neutral-300">
          <Bell className="w-4 h-4 mt-0.5 flex-shrink-0 text-orange-400" aria-hidden="true" />
          <span>
            <Trans
              i18nKey={socialNoticeKey}
              components={{
                instagram: (
                  <a
                    href={instagramUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-orange-400 hover:text-orange-300 underline underline-offset-2 font-medium"
                    aria-label={t('workshop.social.instagramAria')}
                  />
                ),
                tiktok: (
                  <a
                    href={tiktokUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-orange-400 hover:text-orange-300 underline underline-offset-2 font-medium"
                    aria-label={t('workshop.social.tiktokAria')}
                  />
                ),
              }}
            />
          </span>
        </Box>

        <Button type="button" variant="primary" className="w-full" onClick={onClose}>
          {t('common.close')}
        </Button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4" noValidate>
      <Typography variant="body" className={`${theme.colors.textMuted} text-sm`}>
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
          className="p-3 bg-red-950/40 border border-red-800/60 rounded-lg flex items-center gap-2 text-red-300 text-sm"
          role="alert"
        >
          <AlertCircle className="w-4 h-4 flex-shrink-0 text-red-500" aria-hidden="true" />
          <span>{t(`workshop.form.errors.${errorCode}`)}</span>
        </Box>
      )}

      <Button type="submit" variant="primary" className="w-full" disabled={isSubmitting}>
        {isSubmitting ? (
          <>
            <LoaderCircle className="w-4 h-4 animate-spin" aria-hidden="true" />
            {t('workshop.form.submitting')}
          </>
        ) : (
          <>
            <UserPlus className="w-4 h-4" aria-hidden="true" />
            {t('workshop.form.submit')}
          </>
        )}
      </Button>
    </form>
  );
};

export default WorkshopSignupForm;
