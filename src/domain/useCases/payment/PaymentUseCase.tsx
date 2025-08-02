// src/domain/useCases/payment/PaymentUseCase.ts
import { PaymentRepository, Sale } from '../../../data/repositories/PaymentRepository';

export class PaymentUseCase {
    private paymentRepository: PaymentRepository;

    constructor(paymentRepository: PaymentRepository) {
        this.paymentRepository = paymentRepository;
    }

    async initiateTransaction(paymentData: any) {
        return await this.paymentRepository.initiateTransaction(paymentData);
    }

    async fetchSales(): Promise<Sale[]> {
        return await this.paymentRepository.fetchSales();
    }

    async updateSaleStatus(sale_code: string, status: Sale['status']) {
        return await this.paymentRepository.updateSaleStatus(sale_code, status);
    }
}
