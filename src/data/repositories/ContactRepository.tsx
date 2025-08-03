// src/data/repositories/ContactRepository.ts

import api from '../../data/sources/api/apiJoyeriaVivian';

export class ContactRepository {
  static async sendContactForm(data: { name: string, email: string, subject: string, message: string }) {
    try {
      const response = await api.post('/api/contact/', data);
      return response.data;
    } catch (error) {
      // Puedes personalizar este error según lo que retorne tu backend
      console.error('[ERROR] Error al enviar el formulario de contacto:', error);
      throw error;
    }
  }
}
