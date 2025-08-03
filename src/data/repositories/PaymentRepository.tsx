// src/data/repositories/PaymentRepository.ts
import api from '../sources/api/apiJoyeriaVivian';

export interface Sale {
    sale_code: string;
    payment_method: string;
    total_price: number;
    sale_date: string;
    client_name: string;
    client_rut: string;
    client_phone: number;
    client_mail: string;
    client_region: string;
    client_city: string;
    address_name: string;
    address_number: number;
    additional_info?: string;
    status: 'pending' | 'completed' | 'cancelled' | 'in_transit' | 'delivered';
}

export interface PaymentRepository {
    initiateTransaction(paymentData: any): Promise<any>;
    fetchSales(): Promise<Sale[]>;
    updateSaleStatus(sale_code: string, status: Sale['status']): Promise<{ status: Sale['status'] }>;
}

export class PaymentRepositoryImpl implements PaymentRepository {
    async initiateTransaction(paymentData: any): Promise<any> {
        try {
            const response = await api.post('/payment/webpay/init_transaction/', paymentData);
            return response.data;
        } catch (error) {
            console.error('[ERROR] Error al iniciar la transacción:', error);
            throw error;
        }
    }

    async fetchSales(): Promise<Sale[]> {
        try {
            const response = await api.get('/payment/sales/');
            return response.data;
        } catch (error) {
            console.error('[ERROR] Error al listar ventas:', error);
            throw error;
        }
    }

    async updateSaleStatus(sale_code: string, status: Sale['status']): Promise<{ status: Sale['status'] }> {
        try {
            const response = await api.patch(`/payment/sales/${sale_code}/update_status/`, { status });
            return response.data;
        } catch (error) {
            console.error('[ERROR] Error al actualizar estado:', error);
            throw error;
        }
    }
}
