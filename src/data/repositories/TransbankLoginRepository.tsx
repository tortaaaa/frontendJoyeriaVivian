// Importa el helper api que ya usas
import api from '../sources/api/apiJoyeriaVivian'; // Ajusta la ruta si es necesario

const API_URL = '/transbank-auth/login/';

export class TransbankLoginRepository {
  static async login({ username, password }: { username: string, password: string }) {
    try {
      const res = await api.post(API_URL, { username, password });
      return res.data;
    } catch (err: any) {
      throw err;
    }
  }
}
