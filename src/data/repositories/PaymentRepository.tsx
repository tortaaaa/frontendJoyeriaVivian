// src/data/repositories/PaymentRepository.ts
import api from '../sources/api/apiJoyeriaVivian';
import { v4 as uuid } from 'uuid';

export type PaymentStatus = 'pending' | 'authorized' | 'rejected' | 'canceled' | 'refunded';
export type OrderStatus   = 'pending' | 'in_transit' | 'delivered' | 'cancelled';

export interface Sale {
  sale_code: string;
  payment_method: string;
  total_price: number;    // viene como número (convertido de Decimal)
  sale_date: string;      // ISO string

  client_name: string;
  client_rut: string;
  client_phone: string;   // <- usa string (evita perder ceros iniciales)
  client_mail: string;
  client_region: string;
  client_city: string;
  address_name: string;
  address_number: string; // <- usa string

  additional_info?: string;

  // Estados separados
  payment_status?: PaymentStatus;
  order_status?: OrderStatus;

  // Legacy (si aún lo recibes de endpoints viejos):
  status?: 'pending' | 'completed' | 'cancelled' | 'in_transit' | 'delivered';
}

export interface Voucher {
  sale_code: string;
  payment_method: string;
  total_price: number;
  sale_date: string;
  client_name: string;
  client_mail: string;
  products: Array<{ product_code: string; name: string; quantity: number }>;
}

export interface PaymentRepository {
  initiateTransaction(paymentData: any): Promise<{ url: string; token: string; buy_order: string }>;
  fetchSales(): Promise<Sale[]>;
  updateSaleStatus(sale_code: string, status: OrderStatus): Promise<{ order_status: OrderStatus }>;
  getVoucher(sale_code: string): Promise<Voucher>;
}

export class PaymentRepositoryImpl implements PaymentRepository {
  async initiateTransaction(paymentData: any): Promise<{ url: string; token: string; buy_order: string }> {
    try {
      // Idempotencia por intento de pago (un UUID por click)
      const idempotencyKey = uuid();
      const response = await api.post('/payment/webpay/init_transaction/', paymentData, {
        headers: { 'Idempotency-Key': idempotencyKey },
      });
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

  async updateSaleStatus(sale_code: string, status: OrderStatus): Promise<{ order_status: OrderStatus }> {
    try {
      // El backend detecta orden/status, pero preferimos ser explícitos con order_status
      const response = await api.patch(`/payment/sales/${sale_code}/update_status/`, { order_status: status });
      return response.data;
    } catch (error) {
      console.error('[ERROR] Error al actualizar estado:', error);
      throw error;
    }
  }

  async getVoucher(sale_code: string): Promise<Voucher> {
    try {
      const response = await api.get(`/payment/vouchers/${sale_code}/`);
      return response.data;
    } catch (error) {
      console.error('[ERROR] Error al obtener voucher:', error);
      throw error;
    }
  }
}
