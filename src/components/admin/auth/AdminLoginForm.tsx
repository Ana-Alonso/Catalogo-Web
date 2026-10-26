import React, { useState, type SubmitEvent } from 'react';
import { useTranslation } from 'react-i18next';
import { Lock } from 'lucide-react';
import { Box, Button, Icon, Image, Input, PasswordInput, Typography } from '../../ui';
import { LanguageSwitcher } from '../../i18n/LanguageSwitcher';
import logoImg from '../../../assets/Logo.png';

interface AdminLoginFormProps {
  onLogin: (email: string, password: string) => Promise<void>;
  onClose: () => void;
  errorMessage: string | null;
}

export const AdminLoginForm: React.FC<AdminLoginFormProps> = ({
  onLogin,
  onClose,
  errorMessage,
}) => {
  const { t } = useTranslation();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (event: SubmitEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!email.trim() || !password) {
      return;
    }
    setIsSubmitting(true);
    try {
      await onLogin(email.trim(), password);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Box
      position="fixed"
      inset
      zIndex={50}
      background="neutral"
      display="flex"
      direction="column"
      justify="center"
      align="center"
      paddingX="md"
    >
      <Box position="absolute" corner="top-right-lg">
        <LanguageSwitcher />
      </Box>
      <Box
        width="full"
        maxWidth="cover"
        background="surface"
        border
        rounded="xl"
        overflow="hidden"
        padding="xl"
        textAlign="center"
        shadow="dramatic"
      >
        <Box display="flex" justify="center" marginBottom="lg">
          <Image src={logoImg} alt={t('nav.logoAlt')} height={12} fit="contain" />
        </Box>
        <Box
          width={12}
          height={12}
          background="strong"
          rounded="full"
          display="flex"
          align="center"
          justify="center"
          center
          marginBottom="md"
        >
          <Icon as={Lock} size="xl" tone="primary" />
        </Box>
        <Typography variant="h2" size="heading-sm" weight="bold" marginBottom="sm">
          {t('admin.login.title')}
        </Typography>
        <Typography variant="body" marginBottom="lg">
          {t('admin.login.subtitle')}
        </Typography>

        <Box as="form" display="flex" direction="column" gap="md" onSubmit={handleSubmit}>
          <Input
            id="admin-email"
            label={t('admin.login.emailLabel')}
            type="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            placeholder={t('admin.login.emailPlaceholder')}
            autoComplete="username"
            required
            autoFocus
          />
          <PasswordInput
            id="admin-password"
            label={t('admin.login.passwordLabel')}
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            placeholder={t('admin.login.passwordPlaceholder')}
            autoComplete="current-password"
            required
          />
          {errorMessage && (
            <Typography variant="body" size="xs" tone="danger" role="alert">
              {errorMessage}
            </Typography>
          )}
          <Box display="grid" columns={2} gap="tight" paddingTop="sm">
            <Button variant="secondary" fullWidth onClick={onClose}>
              {t('admin.backToSite')}
            </Button>
            <Button type="submit" variant="primary" fullWidth disabled={isSubmitting}>
              {isSubmitting ? t('admin.login.submitting') : t('admin.login.submit')}
            </Button>
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default AdminLoginForm;
