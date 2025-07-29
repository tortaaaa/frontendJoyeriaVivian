import api from '../../data/sources/api/apiJoyeriaVivian'; // Ajusta la ruta si es necesario

const API_URL = '/cms-auth/login/';

export class CmsLoginRepository {
  static async login({ username, password }: { username: string, password: string }) {
    try {
      const res = await api.post(API_URL, { username, password });
      return res.data;
    } catch (err: any) {
      throw err;
    }
  }
}
