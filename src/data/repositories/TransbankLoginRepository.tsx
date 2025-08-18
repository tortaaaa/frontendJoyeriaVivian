import api from '../sources/api/apiJoyeriaVivian';

const API_URL = '/transbank-auth/login/'; // <-- SLASH AL FINAL

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
