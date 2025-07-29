import { TransbankLoginRepository } from '../../../data/repositories/TransbankLoginRepository';

export class TransbankLoginUseCase {
  static async login(credentials: { username: string, password: string }) {
    return await TransbankLoginRepository.login(credentials);
  }
}
