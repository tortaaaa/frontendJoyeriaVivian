import { PaymentRepository, Sale } from '../../../data/repositories/PaymentRepository';
import type { Voucher, OrderStatus } from '../../../data/repositories/PaymentRepository';

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

  async updateSaleStatus(sale_code: string, status: OrderStatus) {
    return await this.paymentRepository.updateSaleStatus(sale_code, status);
  }

  // 👇 Nuevo: expone getVoucher con tipo correcto
  async getVoucher(sale_code: string): Promise<Voucher> {
    return await this.paymentRepository.getVoucher(sale_code);
  }
}
