import React from 'react';
import { useTranslation } from 'react-i18next';
import { AdminDashboardContent } from './AdminDashboardContent';
import { AdminLoginForm } from './auth/AdminLoginForm';
import { Box, Icon, Typography } from '../ui';
import { useAdminSession } from '../../hooks/useAdminSession';
import { LoaderCircle } from 'lucide-react';

interface AdminDashboardProps {
  onClose: () => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({ onClose }) => {
  const { t } = useTranslation();
  const { isLoading, isAuthenticated, authError, handleLogin, handleLogout } =
    useAdminSession();

  if (isLoading) {
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
        gap="tight"
        role="status"
      >
        <Icon as={LoaderCircle} size="xl" tone="accent" spin />
        <Typography variant="body">{t('admin.loadingSession')}</Typography>
      </Box>
    );
  }

  if (!isAuthenticated) {
    return (
      <AdminLoginForm
        onLogin={handleLogin}
        onClose={onClose}
        errorMessage={authError}
      />
    );
  }

  return (
    <AdminDashboardContent onClose={onClose} onLogout={handleLogout} />
  );
};

export default AdminDashboard;
