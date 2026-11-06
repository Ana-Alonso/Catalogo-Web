import React, { useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Receipt } from 'lucide-react';
import {
  Badge,
  Box,
  Button,
  Card,
  ErrorState,
  Icon,
  Input,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
  Typography,
} from '../../ui';
import { AdminRegistrationsSkeleton } from '../registrations/AdminRegistrationsSkeleton';
import type { CatalogItem } from '../../../types/catalog';
import type {
  RegistrationPaymentPatch,
  WorkshopRegistration,
} from '../../../types/registrations';

type PaymentFilter = 'todas' | 'sin_cobrar' | 'cobrado_sin_entregar';

interface AdminPaymentsPanelProps {
  workshops: CatalogItem[];
  registrations: WorkshopRegistration[];
  isLoading: boolean;
  error: string | null;
  onRetry: () => void | Promise<void>;
  onSetPayment: (id: string, patch: RegistrationPaymentPatch) => Promise<boolean>;
}

export const AdminPaymentsPanel: React.FC<AdminPaymentsPanelProps> = ({
  workshops,
  registrations,
  isLoading,
  error,
  onRetry,
  onSetPayment,
}) => {
  const { t, i18n } = useTranslation();
  const [paymentFilter, setPaymentFilter] = useState<PaymentFilter>('todas');

  const productById = useMemo(
    () =>
      Object.fromEntries(
        workshops.map((workshop) => [String(workshop.id), workshop])
      ),
    [workshops]
  );

  const rows = useMemo(
    () =>
      registrations
        .map((registration) => ({
          registration,
          product: productById[String(registration.product_id)],
        }))
        .filter(
          (
            row
          ): row is {
            registration: WorkshopRegistration;
            product: CatalogItem;
          } => row.product !== undefined && row.registration.status !== 'cancelado'
        )
        .sort((a, b) => b.registration.created_at.localeCompare(a.registration.created_at)),
    [registrations, productById]
  );

  const visibleRows = rows.filter(({ registration }) => {
    if (paymentFilter === 'sin_cobrar') {
      return registration.paid !== true;
    }

    if (paymentFilter === 'cobrado_sin_entregar') {
      return registration.paid === true && !registration.fulfilled_at;
    }

    return true;
  });

  const pendingCount = rows.filter(
    ({ registration }) => registration.paid !== true
  ).length;

  const paidTotal = rows.reduce(
    (sum, { registration }) =>
      registration.paid === true ? sum + (registration.amount ?? 0) : sum,
    0
  );

  const currency = new Intl.NumberFormat(
    i18n.resolvedLanguage ?? i18n.language,
    { style: 'currency', currency: 'EUR' }
  );

  const commitAmount = (
    registration: WorkshopRegistration,
    input: HTMLInputElement
  ): void => {
    const raw = input.value.trim();
    let amount: number | null = null;

    if (raw !== '') {
      const parsed = Number(raw.replace(',', '.'));

      if (!Number.isFinite(parsed) || parsed < 0) {
        input.value =
          registration.amount === null || registration.amount === undefined
            ? ''
            : String(registration.amount);
        return;
      }

      amount = Math.round(parsed * 100) / 100;
    }

    if (amount === (registration.amount ?? null)) {
      return;
    }

    void onSetPayment(registration.id, { amount });
  };

  return (
    <Card>
      <Box
        padding="lg"
        divider="bottom"
        display="flex"
        wrap
        align="center"
        justify="between"
        gap="tight"
      >
        <Box display="flex" align="center" gap="tight">
          <Icon as={Receipt} size="lg" tone="accent" />
          <Box>
            <Typography variant="h3">{t('admin.payments.title')}</Typography>
            <Typography variant="body">{t('admin.payments.subtitle')}</Typography>
          </Box>
        </Box>
        <Box
          display="flex"
          wrap
          gap="xs"
          role="group"
          aria-label={t('admin.payments.filterLabel')}
        >
          {(['todas', 'sin_cobrar', 'cobrado_sin_entregar'] as const).map(
            (option) => (
              <Button
                key={option}
                size="sm"
                variant={paymentFilter === option ? 'primary' : 'outline'}
                aria-pressed={paymentFilter === option}
                onClick={() => setPaymentFilter(option)}
              >
                {t(
                  option === 'todas'
                    ? 'admin.payments.filterTodas'
                    : option === 'sin_cobrar'
                      ? 'admin.payments.filterSinCobrar'
                      : 'admin.payments.filterCobradoSinEntregar'
                )}
              </Button>
            )
          )}
        </Box>
      </Box>

      <Box padding="lg" display="flex" direction="column" gap="md">
        {isLoading && (
          <Box role="status" aria-label={t('admin.payments.loading')}>
            <AdminRegistrationsSkeleton />
          </Box>
        )}

        {!isLoading && error && (
          <ErrorState
            title={t('admin.payments.errorTitle')}
            description={error}
            onRetry={onRetry}
            retryLabel={t('common.retry')}
          />
        )}

        {!isLoading && !error && (
          <>
            {rows.length === 0 ? (
              <Typography variant="body">{t('admin.payments.empty')}</Typography>
            ) : (
              <>
                <Box
                  display="flex"
                  wrap
                  align="center"
                  gap="md"
                  as="p"
                >
                  <Typography size="sm" tone="subtle">
                    {t('admin.payments.pendingCount', { count: pendingCount })}
                  </Typography>
                  <Typography size="sm" tone="subtle">
                    {t('admin.payments.totalPaid', {
                      amount: currency.format(paidTotal),
                    })}
                  </Typography>
                </Box>

                <Table
                  fullWidth
                  align="left"
                  aria-label={t('admin.payments.tableLabel')}
                >
                  <TableHead>
                    <TableRow head>
                      <TableHeader>{t('admin.payments.colContact')}</TableHeader>
                      <TableHeader>{t('admin.payments.colReservation')}</TableHeader>
                      <TableHeader>{t('admin.payments.colUnits')}</TableHeader>
                      <TableHeader>{t('admin.payments.colAmount')}</TableHeader>
                      <TableHeader>{t('admin.payments.colPaid')}</TableHeader>
                      <TableHeader>{t('admin.payments.colFulfilled')}</TableHeader>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {visibleRows.map(({ registration, product }) => {
                      const isSpecial = product.category === 'especiales';

                      return (
                        <TableRow key={registration.id}>
                          <TableCell padding="md">
                            <Typography size="sm" weight="semibold">
                              {registration.name}
                            </Typography>
                            <Typography size="xs" tone="subtle">
                              {registration.email}
                            </Typography>
                          </TableCell>
                          <TableCell padding="md">
                            <Box display="flex" wrap align="center" gap="xs">
                              <Typography size="sm">{product.title}</Typography>
                              <Badge variant="outline" size="micro">
                                {t(
                                  isSpecial
                                    ? 'admin.workshops.kindEspeciales'
                                    : 'admin.workshops.kindTalleres'
                                )}
                              </Badge>
                            </Box>
                          </TableCell>
                          <TableCell padding="md" align="center">
                            {isSpecial ? registration.quantity ?? 1 : '—'}
                          </TableCell>
                          <TableCell padding="md">
                            <Input
                              type="text"
                              inputMode="decimal"
                              className="max-w-28"
                              defaultValue={
                                registration.amount === null
                                  ? ''
                                  : registration.amount ?? ''
                              }
                              onBlur={(event) =>
                                commitAmount(registration, event.currentTarget)
                              }
                              aria-label={t('admin.payments.amountAria', {
                                name: registration.name,
                              })}
                            />
                          </TableCell>
                          <TableCell padding="md">
                            <Button
                              size="sm"
                              variant={registration.paid ? 'primary' : 'outline'}
                              aria-pressed={registration.paid === true}
                              onClick={() =>
                                void onSetPayment(registration.id, {
                                  paid: registration.paid !== true,
                                })
                              }
                            >
                              {t('admin.payments.markPaid')}
                            </Button>
                          </TableCell>
                          <TableCell padding="md">
                            <Button
                              size="sm"
                              variant={
                                registration.fulfilled_at ? 'primary' : 'outline'
                              }
                              aria-pressed={Boolean(registration.fulfilled_at)}
                              onClick={() =>
                                void onSetPayment(registration.id, {
                                  fulfilled: !registration.fulfilled_at,
                                })
                              }
                            >
                              {t(
                                isSpecial
                                  ? 'admin.payments.markDelivered'
                                  : 'admin.payments.markAttended'
                              )}
                            </Button>
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>

                {visibleRows.length === 0 && (
                  <Typography variant="body">
                    {t('admin.payments.emptyFiltered')}
                  </Typography>
                )}
              </>
            )}
          </>
        )}
      </Box>
    </Card>
  );
};

export default AdminPaymentsPanel;
