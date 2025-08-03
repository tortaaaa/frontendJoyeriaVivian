// src/presentation/viewModels/Payment/ViewModel.tsx
import { useState, useEffect } from 'react';
import { PaymentUseCase } from '../../../../domain/useCases/payment/PaymentUseCase';
import { PaymentRepositoryImpl, Sale } from '../../../../data/repositories/PaymentRepository';

const paymentUseCase = new PaymentUseCase(new PaymentRepositoryImpl());

const STATUS_OPTIONS = [
    { value: 'pending', label: 'Pendiente' },
    { value: 'completed', label: 'Completada' },
    { value: 'cancelled', label: 'Cancelada' },
    { value: 'in_transit', label: 'En tránsito' },
    { value: 'delivered', label: 'Entregada' },
];

export function useSalesViewModel() {
    const [sales, setSales] = useState<Sale[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        fetchSales();
    }, []);

    const fetchSales = async () => {
        setLoading(true);
        try {
            const data = await paymentUseCase.fetchSales();
            setSales(data);
        } catch (err) {
            setError('Error al cargar ventas');
        }
        setLoading(false);
    };

    const updateSaleStatus = async (sale_code: string, status: Sale['status']) => {
        try {
            await paymentUseCase.updateSaleStatus(sale_code, status);
            setSales(sales =>
                sales.map(sale =>
                    sale.sale_code === sale_code ? { ...sale, status } : sale
                )
            );
        } catch (err) {
            setError('Error al actualizar el estado');
        }
    };

    return {
        sales,
        loading,
        error,
        STATUS_OPTIONS,
        updateSaleStatus,
        fetchSales,
    };
}
