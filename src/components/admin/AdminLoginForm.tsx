import React, { useState, type FormEvent } from 'react';
import { useTranslation } from 'react-i18next';
import { Lock } from 'lucide-react';
import { Button, Input, Card, PasswordInput } from '../ui';
import { LanguageSwitcher } from '../i18n/LanguageSwitcher';
import { theme } from '../../theme';
import logoImg from '../../assets/Logo.png';

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

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
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
    <div
      className={`fixed inset-0 z-50 ${theme.colors.background} flex flex-col justify-center items-center px-4`}
    >
      <div className="absolute top-6 right-6">
        <LanguageSwitcher />
      </div>
      <Card className="max-w-md w-full p-8 text-center shadow-2xl">
        <div className="flex justify-center mb-6">
          <img src={logoImg} alt={t('nav.logoAlt')} className="h-12 w-auto object-contain" />
        </div>
        <div className="w-12 h-12 bg-neutral-800 rounded-full flex items-center justify-center mx-auto mb-4 text-orange-600">
          <Lock className="w-6 h-6" aria-hidden="true" />
        </div>
        <h2 className="text-2xl font-bold text-white mb-2 uppercase tracking-wider">
          {t('admin.login.title')}
        </h2>
        <p className={`${theme.colors.textMuted} text-sm mb-6`}>
          {t('admin.login.subtitle')}
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
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
            <p className="text-xs text-red-400" role="alert">
              {errorMessage}
            </p>
          )}
          <div className="flex gap-3 pt-2">
            <Button variant="secondary" className="w-1/2" onClick={onClose}>
              {t('admin.backToSite')}
            </Button>
            <Button type="submit" variant="primary" className="w-1/2" disabled={isSubmitting}>
              {isSubmitting ? t('admin.login.submitting') : t('admin.login.submit')}
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
};

export default AdminLoginForm;
