import React from 'react';
import { Check, X, Trash2, Users, ClipboardList } from 'lucide-react';
import { Card, Badge, Button, Box } from '../ui';
import { theme } from '../../theme';
import type { CatalogItem } from '../../types/catalog';
import type { WorkshopRegistration, RegistrationStatus } from '../../types/registrations';

interface AdminRegistrationsPanelProps {
  workshops: CatalogItem[];
  registrations: WorkshopRegistration[];
  isLoading: boolean;
  onSetStatus: (id: string, status: RegistrationStatus) => Promise<boolean>;
  onDelete: (id: string) => Promise<boolean>;
}

const statusBadgeVariant: Record<RegistrationStatus, 'primary' | 'neutral' | 'outline'> = {
  pendiente: 'neutral',
  confirmado: 'primary',
  cancelado: 'outline',
};

const statusLabel: Record<RegistrationStatus, string> = {
  pendiente: 'Pendiente',
  confirmado: 'Confirmado',
  cancelado: 'Cancelado',
};

const formatRegistrationDate = (value: string): string => {
  const parsed = new Date(value);
  if (isNaN(parsed.getTime())) {
    return value;
  }
  return parsed.toLocaleDateString('es-ES', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
};

export const AdminRegistrationsPanel: React.FC<AdminRegistrationsPanelProps> = ({
  workshops,
  registrations,
  isLoading,
  onSetStatus,
  onDelete,
}) => {
  const workshopsWithRegistrations = workshops
    .filter((workshop) => workshop.category === 'talleres')
    .map((workshop) => ({
      workshop,
      list: registrations
        .filter((registration) => registration.product_id === workshop.id)
        .sort((a, b) => b.created_at.localeCompare(a.created_at)),
    }));

  return (
    <Card>
      <Box className={`p-6 border-b ${theme.colors.border} flex items-center gap-3`}>
        <ClipboardList className="w-5 h-5 text-orange-500" aria-hidden="true" />
        <Box>
          <h3 className="text-xl font-bold text-white uppercase tracking-wider">
            Inscripciones a Talleres ({registrations.length})
          </h3>
          <p className={`${theme.colors.textMuted} text-sm`}>
            Confirma, cancela o elimina las plazas solicitadas.
          </p>
        </Box>
      </Box>

      <Box className="p-6 space-y-8">
        {isLoading && (
          <p className={`${theme.colors.textMuted} text-sm`}>Cargando inscripciones...</p>
        )}

        {!isLoading && workshopsWithRegistrations.length === 0 && (
          <p className={`${theme.colors.textMuted} text-sm text-center py-4`}>
            No hay talleres publicados en el catálogo.
          </p>
        )}

        {!isLoading &&
          workshopsWithRegistrations.map(({ workshop, list }) => {
            const activeCount = list.filter(
              (registration) => registration.status !== 'cancelado'
            ).length;
            const cupo = workshop.cupo ?? null;

            return (
              <Box key={workshop.id}>
                <Box className="flex flex-wrap items-center justify-between gap-3 mb-3">
                  <h4 className="text-sm font-bold text-white uppercase tracking-wider">
                    {workshop.title}
                  </h4>
                  <Badge variant={cupo !== null && activeCount >= cupo ? 'outline' : 'primary'}>
                    <Users className="w-3 h-3 mr-1" aria-hidden="true" />
                    {cupo !== null ? `${activeCount} / ${cupo} plazas` : `${activeCount} inscritos`}
                  </Badge>
                </Box>

                <Box className={`rounded-lg border ${theme.colors.border} divide-y ${theme.colors.borderSubtle}`}>
                  {list.length === 0 && (
                    <p className={`${theme.colors.textMuted} text-sm p-4`}>
                      Sin inscripciones todavía.
                    </p>
                  )}

                  {list.map((registration) => (
                    <Box
                      key={registration.id}
                      className="p-4 flex flex-wrap items-center justify-between gap-3"
                    >
                      <Box>
                        <span className="text-sm font-semibold text-white block">
                          {registration.name}
                        </span>
                        <span className={`text-xs ${theme.colors.textMuted}`}>
                          {registration.email}
                        </span>
                      </Box>

                      <Box className="flex flex-wrap items-center gap-2">
                        <span className={`text-xs ${theme.colors.textSubtle}`}>
                          {formatRegistrationDate(registration.created_at)}
                        </span>
                        <Badge variant={statusBadgeVariant[registration.status]}>
                          {statusLabel[registration.status]}
                        </Badge>
                        {registration.status !== 'confirmado' && (
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => void onSetStatus(registration.id, 'confirmado')}
                            aria-label={`Confirmar inscripción de ${registration.name}`}
                          >
                            <Check className="w-4 h-4 text-green-400" />
                          </Button>
                        )}
                        {registration.status !== 'cancelado' && (
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => void onSetStatus(registration.id, 'cancelado')}
                            aria-label={`Cancelar inscripción de ${registration.name}`}
                          >
                            <X className="w-4 h-4 text-orange-400" />
                          </Button>
                        )}
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => {
                            if (
                              window.confirm(
                                `¿Seguro que deseas eliminar la inscripción de "${registration.name}"?`
                              )
                            ) {
                              void onDelete(registration.id);
                            }
                          }}
                          aria-label={`Eliminar inscripción de ${registration.name}`}
                        >
                          <Trash2 className="w-4 h-4 text-red-400" />
                        </Button>
                      </Box>
                    </Box>
                  ))}
                </Box>
              </Box>
            );
          })}
      </Box>
    </Card>
  );
};

export default AdminRegistrationsPanel;
