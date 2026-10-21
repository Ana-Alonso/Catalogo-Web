import React from 'react';
import { useNavigate } from 'react-router-dom';
import AdminDashboard from '../components/admin/AdminDashboard';
import { useNoindex } from '../hooks/useNoindex';
import { useProducts } from '../hooks/useProducts';
import { useRegistrations } from '../hooks/useRegistrations';

export const AdminPage: React.FC = () => {
  useNoindex();
  const navigate = useNavigate();
  const {
    products,
    addProduct,
    editProduct,
    editEtsyMetadata,
    removeProduct,
    refreshProducts,
  } = useProducts();
  const { registrations, isLoading, setStatus, remove } = useRegistrations();

  return (
    <AdminDashboard
      products={products}
      registrations={registrations}
      isLoadingRegistrations={isLoading}
      onAddProduct={addProduct}
      onEditProduct={editProduct}
      onEditEtsyMetadata={editEtsyMetadata}
      onDeleteProduct={removeProduct}
      onRefreshProducts={refreshProducts}
      onSetRegistrationStatus={setStatus}
      onDeleteRegistration={remove}
      onClose={() => navigate('/')}
    />
  );
};

export default AdminPage;
