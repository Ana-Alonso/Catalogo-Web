import React from 'react';
import { Trash2, Edit3, ExternalLink, Sparkles } from 'lucide-react';
import { Card, Badge, Button, Box } from '../ui';
import { theme } from '../../theme';
import { formatPrice, getDiscountedCents, isOfferActive } from '../../utils/price';
import type { CatalogItem, AvailabilityStatus } from '../../types/catalog';

interface AdminProductTableProps {
  products: CatalogItem[];
  onDelete: (id: string) => void;
  onEdit: (product: CatalogItem) => void;
  isDeleting: boolean;
}

const statusBadgeVariant: Record<AvailabilityStatus, 'primary' | 'neutral' | 'outline'> = {
  disponible: 'primary',
  reservado: 'neutral',
  vendido: 'outline',
};

export const AdminProductTable: React.FC<AdminProductTableProps> = ({ 
  products, 
  onDelete, 
  onEdit,
  isDeleting 
}) => {
  if (products.length === 0) {
    return (
      <Card className="text-center py-12">
        <p className={theme.colors.textMuted}>No hay productos registrados en el catálogo.</p>
      </Card>
    );
  }

  return (
    <Card>
      <Box className={`p-6 border-b ${theme.colors.border}`}>
        <h3 className="text-xl font-bold text-white uppercase tracking-wider">
          Productos en Catálogo ({products.length})
        </h3>
        <p className={`${theme.colors.textMuted} text-sm`}>Gestiona disponibilidad, destacados y enlaces.</p>
      </Box>

      <Box className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className={`border-b ${theme.colors.border} bg-neutral-950/60 text-xs font-semibold uppercase tracking-wider text-neutral-400`}>
              <th className="py-4 px-6">Obra</th>
              <th className="py-4 px-6">Categoría</th>
              <th className="py-4 px-6">Disponibilidad</th>
              <th className="py-4 px-6">Precio</th>
              <th className="py-4 px-6">Enlaces</th>
              <th className="py-4 px-6 text-right">Acciones</th>
            </tr>
          </thead>
          <tbody className={`divide-y ${theme.colors.borderSubtle} text-sm`}>
            {products.map((item) => {
              const currentStatus = item.status || 'disponible';
              const currency = item.currency || 'EUR';
              const offerPercent =
                item.priceCents != null && item.discountPercent != null && isOfferActive(item)
                  ? item.discountPercent
                  : null;
              const displayCents =
                offerPercent != null && item.priceCents != null
                  ? getDiscountedCents(item.priceCents, offerPercent)
                  : item.priceCents;
              return (
                <tr key={item.id} className="hover:bg-neutral-800/40 transition-colors">
                  <td className="py-4 px-6">
                    <Box className="flex items-center gap-3">
                      <img 
                        src={item.image} 
                        alt="" 
                        className="w-12 h-12 rounded object-cover bg-neutral-800 flex-shrink-0"
                      />
                      <Box>
                        <Box className="flex flex-wrap items-center gap-1.5">
                          <span className="font-semibold text-white">{item.title}</span>
                          {item.featured && (
                            <span title="Producto Destacado">
                              <Sparkles className="w-3.5 h-3.5 text-orange-500 fill-orange-500/20" />
                            </span>
                          )}
                          {item.source === 'etsy' && (
                            <Badge variant="neutral">Etsy</Badge>
                          )}
                          {item.isVisible === false && (
                            <Badge variant="outline">Oculto</Badge>
                          )}
                        </Box>
                        <Box className={`${theme.colors.textMuted} text-xs line-clamp-1 max-w-xs`}>
                          {item.description}
                        </Box>
                      </Box>
                    </Box>
                  </td>
                  <td className="py-4 px-6">
                    <Badge variant="outline">
                      {item.category}
                    </Badge>
                    {item.category === 'talleres' && (
                      <div className="mt-1.5 text-xs text-neutral-500">
                        {item.cupo != null ? `Cupo: ${item.cupo} plazas` : 'Sin cupo'}
                      </div>
                    )}
                  </td>
                  <td className="py-4 px-6">
                    <Badge variant={statusBadgeVariant[currentStatus]}>
                      {currentStatus}
                    </Badge>
                  </td>
                  <td className="py-4 px-6 font-medium text-neutral-300">
                    {displayCents != null ? (
                      <Box className="space-y-1">
                        <span>{formatPrice(displayCents, currency)}</span>
                        {offerPercent != null && item.priceCents != null && (
                          <Box className="text-xs text-neutral-500">
                            <s>{formatPrice(item.priceCents, currency)}</s>
                            <span className="ml-2 text-orange-400">-{offerPercent}%</span>
                          </Box>
                        )}
                      </Box>
                    ) : (
                      'A consultar'
                    )}
                  </td>
                  <td className="py-4 px-6">
                    <Box className="flex items-center gap-3">
                      {item.etsyLink && (
                        <a 
                          href={item.etsyLink} 
                          target="_blank" 
                          rel="noopener noreferrer" 
                          className={`text-xs ${theme.colors.primaryText} hover:underline inline-flex items-center gap-1`}
                        >
                          Etsy <ExternalLink className="w-3 h-3" />
                        </a>
                      )}
                      {item.vintedLink && (
                        <a 
                          href={item.vintedLink} 
                          target="_blank" 
                          rel="noopener noreferrer" 
                          className="text-xs text-neutral-400 hover:text-white inline-flex items-center gap-1"
                        >
                          Vinted <ExternalLink className="w-3 h-3" />
                        </a>
                      )}
                    </Box>
                  </td>
                  <td className="py-4 px-6 text-right">
                    <Box className="flex items-center justify-end gap-1">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => onEdit(item)}
                        aria-label={`Modificar ${item.title}`}
                      >
                        <Edit3 className="w-4 h-4 text-orange-500" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        disabled={isDeleting || item.source === 'etsy'}
                        title={
                          item.source === 'etsy'
                            ? 'Los productos de Etsy se eliminan desde Etsy'
                            : undefined
                        }
                        onClick={() => {
                          if (window.confirm(`¿Seguro que deseas eliminar "${item.title}"?`)) {
                            onDelete(String(item.id));
                          }
                        }}
                        aria-label={
                          item.source === 'etsy'
                            ? `${item.title} se elimina desde Etsy`
                            : `Eliminar ${item.title}`
                        }
                      >
                        <Trash2 className="w-4 h-4 text-red-400" />
                      </Button>
                    </Box>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </Box>
    </Card>
  );
};

export default AdminProductTable;
