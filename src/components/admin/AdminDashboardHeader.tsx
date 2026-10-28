import React from 'react';
import { useTranslation } from 'react-i18next';
import { ArrowLeft, Unlock } from 'lucide-react';
import { Box, Button, Container, Icon, Image, Typography } from '../ui';
import { LanguageSwitcher } from '../i18n/LanguageSwitcher';
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
    <Box
      as="header"
      position="sticky"
      top={0}
      zIndex={40}
      background="headerTranslucent"
      backdrop="blur"
      border
      divider="bottom"
    >
      <Container
        as="div"
        className="h-auto py-3 sm:h-20 sm:py-0"
        display="flex"
        align="center"
        justify="between"
        gap="tight"
      >
        <Box display="flex" align="center" gap="xs" minWidth="zero">
          <Image src={logoImg} alt={t('nav.logoAlt')} height={10} fit="contain" shrink={false} />
          <Box minWidth="zero">
            <Typography
              as="h1"
              variant="h4"
              transform="uppercase"
              tracking="wider"
              clamp={1}
            >
              {t('admin.title')}
            </Typography>
          </Box>
        </Box>

        <Box display="flex" align="center" gap="xs" shrink={false}>
          <LanguageSwitcher />
          <Button
            variant="secondary"
            size="sm"
            onClick={onClose}
            aria-label={t('admin.backToSite')}
          >
            <Icon as={ArrowLeft} size="sm" />
            <Box hideBelow="sm">{t('admin.backToSite')}</Box>
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={onLogout}
            aria-label={t('admin.logout')}
          >
            <Icon as={Unlock} size="sm" />
          </Button>
        </Box>
      </Container>
    </Box>
  );
};

export default AdminDashboardHeader;
