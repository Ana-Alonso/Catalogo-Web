import React from 'react';
import { useTranslation } from 'react-i18next';
import { ArrowLeft, Unlock } from 'lucide-react';
import { Button, Container } from '../ui';
import { LanguageSwitcher } from '../i18n/LanguageSwitcher';
import { theme } from '../../theme';
import logoImg from '../../assets/Logo.png';

interface AdminDashboardHeaderProps {
  onClose: () => void;
  onLogout: () => void;
}

export const AdminDashboardHeader: React.FC<AdminDashboardHeaderProps> = ({
  onClose,
  onLogout,
}) => {
  const { t } = useTranslation();

  return (
    <header
      className={`sticky top-0 z-40 bg-neutral-900/90 backdrop-blur-md border-b ${theme.colors.border}`}
    >
      <Container as="div" className="h-20 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <img
            src={logoImg}
            alt={t('nav.logoAlt')}
            className="h-10 w-auto object-contain"
          />
          <div>
            <h1 className="text-lg font-bold text-white uppercase tracking-wider">
              {t('admin.title')}
            </h1>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <LanguageSwitcher />
          <Button variant="secondary" size="sm" onClick={onClose}>
            <ArrowLeft className="w-3.5 h-3.5" />
            {t('admin.backToSite')}
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={onLogout}
            aria-label={t('admin.logout')}
          >
            <Unlock className="w-3.5 h-3.5" />
          </Button>
        </div>
      </Container>
    </header>
  );
};

export default AdminDashboardHeader;
