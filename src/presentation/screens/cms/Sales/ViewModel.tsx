import { useState, useEffect } from 'react';
import { PaymentUseCase } from '../../../../domain/useCases/payment/PaymentUseCase';
import { PaymentRepositoryImpl, Sale, OrderStatus } from '../../../../data/repositories/PaymentRepository';

const paymentUseCase = new PaymentUseCase(new PaymentRepositoryImpl());

// Estados visibles en el CMS (UI)
type UIStatus = 'pending' | 'in_transit' | 'completed';

export const UI_STATUS_OPTIONS: Array<{ value: UIStatus; label: string }> = [
  { value: 'pending', label: 'Pendiente' },
  { value: 'in_transit', label: 'En tránsito' },
  { value: 'completed', label: 'Completado' },
];

// Mapear API → UI
function apiToUIStatus(sale: Sale): UIStatus {
  // Preferimos order_status si existe, si no caemos al legacy status
  const raw = sale.order_status ?? sale.status ?? 'pending';

  if (raw === 'delivered') return 'completed';
  if (raw === 'in_transit') return 'in_transit';
  // cualquier otro cae en pending
  return 'pending';
}

// Mapear UI → API (OrderStatus del backend)
function uiToAPIStatus(ui: UIStatus): OrderStatus {
  if (ui === 'completed') return 'delivered';
  if (ui === 'in_transit') return 'in_transit';
  return 'pending';
}

type SaleWithUI = Sale & { uiStatus: UIStatus };

export function useSalesViewModel() {
  const [sales, setSales] = useState<SaleWithUI[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // sale_code -> "Nombre (x2), Otro (x1)"
  const [productSummaryBySale, setProductSummaryBySale] = useState<Record<string, string>>({});

  useEffect(() => {
    fetchSales();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const fetchSales = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await paymentUseCase.fetchSales();
      const withUI: SaleWithUI[] = data.map((s) => ({ ...s, uiStatus: apiToUIStatus(s) }));
      setSales(withUI);

      // Traemos vouchers en paralelo (resumen de productos)
      // Evitamos re-fetch si ya lo tenemos
      const missing = withUI.filter((s) => !productSummaryBySale[s.sale_code]);
      if (missing.length) {
        const entries = await Promise.all(
          missing.map(async (s) => {
            try {
              const v = await paymentUseCase.getVoucher(s.sale_code);
              const list = (v.products || [])
                .map((p) => `${p.name} (x${p.quantity})`)
                .join(', ');
              return [s.sale_code, list || '—'] as const;
            } catch {
              return [s.sale_code, '—'] as const;
            }
          })
        );
        setProductSummaryBySale((prev) => {
          const next = { ...prev };
          for (const [code, summary] of entries) next[code] = summary;
          return next;
        });
      }
    } catch (err) {
      setError('Error al cargar ventas');
    } finally {
      setLoading(false);
    }
  };

  const updateSaleStatusUI = async (sale_code: string, uiStatus: UIStatus) => {
    try {
      const apiStatus = uiToAPIStatus(uiStatus);
      await paymentUseCase.updateSaleStatus(sale_code, apiStatus);
      setSales((prev) =>
        prev.map((s) => (s.sale_code === sale_code ? { ...s, uiStatus } : s))
      );
    } catch (err) {
      setError('Error al actualizar el estado');
    }
  };

  return {
    sales,
    loading,
    error,
    UI_STATUS_OPTIONS,
    updateSaleStatusUI,
    fetchSales,
    productSummaryBySale,
  };
}
