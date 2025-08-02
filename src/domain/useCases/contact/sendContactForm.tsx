import { ContactRepository } from '../../../data/repositories/ContactRepository';

export const sendContactForm = async (data: { name: string, email: string, subject: string, message: string }) => {
  return await ContactRepository.sendContactForm(data);
};
