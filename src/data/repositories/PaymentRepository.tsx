// src/data/repositories/PaymentRepository.ts
import api from '../sources/api/apiJoyeriaVivian';

export interface PaymentRepository {
    initiateTransaction(paymentData: any): Promise<any>;
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
}
