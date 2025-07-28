import { CmsLoginRepository } from '../../../data/repositories/CmsLoginRepository';

export class CmsLoginUseCase {
  static async login(credentials: { username: string, password: string }) {
    return await CmsLoginRepository.login(credentials);
  }
}
