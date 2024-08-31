// src/domain/useCases/payment/PaymentUseCase.ts
import { PaymentRepository } from '../../../data/repositories/PaymentRepository';

export class PaymentUseCase {
    private paymentRepository: PaymentRepository;

    constructor(paymentRepository: PaymentRepository) {
        this.paymentRepository = paymentRepository;
    }

    async initiateTransaction(paymentData: any) {
        try {
            const response = await this.paymentRepository.initiateTransaction(paymentData);
            return response;
        } catch (error) {
            console.error('[ERROR] Error al iniciar la transacción:', error);
            throw error;
        }
    }
}
