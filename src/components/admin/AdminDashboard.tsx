import React, { useState } from 'react';
import { AdminProductForm } from './AdminProductForm';
import { AdminProductTable } from './AdminProductTable';
import { AdminRegistrationsPanel } from './AdminRegistrationsPanel';
import { AdminWorkshopCalendarPanel } from './AdminWorkshopCalendarPanel';
import { Button, Input, Card } from '../ui';
import { theme } from '../../theme';
import type { CatalogItem, ProductFormData } from '../../types/catalog';
import type { WorkshopRegistration, RegistrationStatus } from '../../types/registrations';
import { Lock, Unlock, AlertCircle, CheckCircle, ArrowLeft } from 'lucide-react';
import logoImg from '../../assets/Logo.png';

interface AdminDashboardProps {
  products: CatalogItem[];
  registrations: WorkshopRegistration[];
  isLoadingRegistrations: boolean;
  onAddProduct: (data: ProductFormData) => Promise<boolean>;
  onEditProduct: (id: string, data: ProductFormData) => Promise<boolean>;
  onDeleteProduct: (id: string) => Promise<boolean>;
  onSetRegistrationStatus: (id: string, status: RegistrationStatus) => Promise<boolean>;
  onDeleteRegistration: (id: string) => Promise<boolean>;
  onClose: () => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({
  products,
  registrations,
  isLoadingRegistrations,
  onAddProduct,
  onEditProduct,
  onDeleteProduct,
  onSetRegistrationStatus,
  onDeleteRegistration,
  onClose
}) => {
  const adminPinEnv = import.meta.env.VITE_ADMIN_PIN || 'admin123';
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    return sessionStorage.getItem('laurel_admin_auth') === 'true';
  });
  const [pin, setPin] = useState('');
  const [authError, setAuthError] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [editingProduct, setEditingProduct] = useState<CatalogItem | null>(null);
  const [feedbackMsg, setFeedbackMsg] = useState<{ text: string; type: 'success' | 'error' } | null>(null);
  const [createdWorkshop, setCreatedWorkshop] = useState<ProductFormData | null>(null);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (pin.trim() === adminPinEnv) {
      setIsAuthenticated(true);
      sessionStorage.setItem('laurel_admin_auth', 'true');
      setAuthError(false);
    } else {
      setAuthError(true);
    }
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    sessionStorage.removeItem('laurel_admin_auth');
  };

  const handleFormSubmit = async (data: ProductFormData): Promise<boolean> => {
    setIsSubmitting(true);
    setFeedbackMsg(null);
    setCreatedWorkshop(null);

    const isEdit = Boolean(editingProduct);
    const success = isEdit && editingProduct
      ? await onEditProduct(String(editingProduct.id), data)
      : await onAddProduct(data);

    setIsSubmitting(false);

    if (success) {
      setFeedbackMsg({
        text: isEdit ? 'Producto actualizado correctamente.' : 'Producto publicado con éxito.',
        type: 'success'
      });
      setEditingProduct(null);

      if (!isEdit && data.category === 'talleres' && data.eventDate) {
        setCreatedWorkshop(data);
      }

      setTimeout(() => setFeedbackMsg(null), 3500);
      return true;
    }

    setFeedbackMsg({ text: 'Error al procesar la operación.', type: 'error' });
    return false;
  };

  const handleDelete = async (id: string) => {
    setIsDeleting(true);
    setFeedbackMsg(null);
    const success = await onDeleteProduct(id);
    setIsDeleting(false);

    if (success) {
      if (editingProduct?.id === id) {
        setEditingProduct(null);
      }
      setFeedbackMsg({ text: 'Producto eliminado correctamente.', type: 'success' });
      setTimeout(() => setFeedbackMsg(null), 3000);
    } else {
      setFeedbackMsg({ text: 'Error al eliminar el producto.', type: 'error' });
    }
  };

  if (!isAuthenticated) {
    return (
      <div className={`fixed inset-0 z-50 ${theme.colors.background} flex flex-col justify-center items-center px-4`}>
        <Card className="max-w-md w-full p-8 text-center shadow-2xl">
          <div className="flex justify-center mb-6">
            <img src={logoImg} alt="Logo" className="h-12 w-auto object-contain" />
          </div>
          <div className="w-12 h-12 bg-neutral-800 rounded-full flex items-center justify-center mx-auto mb-4 text-orange-600">
            <Lock className="w-6 h-6" />
          </div>
          <h2 className="text-2xl font-bold text-white mb-2 uppercase tracking-wider">Acceso Administrador</h2>
          <p className={`${theme.colors.textMuted} text-sm mb-6`}>
            Ingresa tu clave de acceso para gestionar el catálogo.
          </p>

          <form onSubmit={handleLogin} className="space-y-4">
            <Input
              type="password"
              value={pin}
              onChange={(e) => setPin(e.target.value)}
              placeholder="Clave de acceso"
              className="text-center tracking-widest"
              autoFocus
            />
            {authError && (
              <p className="text-xs text-red-400">Clave incorrecta. Por favor verifica.</p>
            )}
            <div className="flex gap-3">
              <Button
                variant="secondary"
                className="w-1/2"
                onClick={onClose}
              >
                Volver a la Web
              </Button>
              <Button
                type="submit"
                variant="primary"
                className="w-1/2"
              >
                Entrar
              </Button>
            </div>
          </form>
        </Card>
      </div>
    );
  }

  return (
    <div className={`fixed inset-0 z-50 ${theme.colors.background} overflow-y-auto`}>
      <header className={`sticky top-0 z-40 bg-neutral-900/90 backdrop-blur-md border-b ${theme.colors.border}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <img src={logoImg} alt="Logo" className="h-10 w-auto object-contain" />
            <div>
              <h1 className="text-lg font-bold text-white uppercase tracking-wider">Panel de Administración</h1>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Button
              variant="secondary"
              size="sm"
              onClick={onClose}
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              Volver a la Web
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={handleLogout}
              aria-label="Cerrar sesión"
            >
              <Unlock className="w-3.5 h-3.5" />
            </Button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
        {feedbackMsg && (
          <div
            className={`p-4 rounded-xl border flex items-center gap-3 text-sm ${
              feedbackMsg.type === 'success'
                ? 'bg-green-950/40 border-green-800 text-green-300'
                : 'bg-red-950/40 border-red-800 text-red-300'
            }`}
          >
            {feedbackMsg.type === 'success' ? (
              <CheckCircle className="w-5 h-5 text-green-400" />
            ) : (
              <AlertCircle className="w-5 h-5 text-red-400" />
            )}
            <span>{feedbackMsg.text}</span>
          </div>
        )}

        {createdWorkshop && (
          <AdminWorkshopCalendarPanel workshopData={createdWorkshop} />
        )}

        <AdminProductForm
          key={editingProduct ? editingProduct.id : 'new-product-form'}
          onSubmit={handleFormSubmit}
          isSubmitting={isSubmitting}
          editingProduct={editingProduct}
          onCancelEdit={() => setEditingProduct(null)}
        />

        <AdminProductTable
          products={products}
          onDelete={handleDelete}
          onEdit={(prod) => {
            setEditingProduct(prod);
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
          isDeleting={isDeleting}
        />

        <AdminRegistrationsPanel
          workshops={products}
          registrations={registrations}
          isLoading={isLoadingRegistrations}
          onSetStatus={onSetRegistrationStatus}
          onDelete={onDeleteRegistration}
        />
      </main>
    </div>
  );
};

export default AdminDashboard;
