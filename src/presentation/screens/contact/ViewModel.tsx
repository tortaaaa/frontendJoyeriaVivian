import { useState } from 'react';
import { sendContactForm } from '../../../domain/useCases/contact/sendContactForm';

export const useContactForm = () => {
  const [isModalOpen, setModalOpen] = useState(false);

  // Esta función se usará en el onSubmit de Formik
  const handleSendForm = async (formData: { name: string; email: string; subject: string; message: string }) => {
    try {
      await sendContactForm(formData); // Llama al use case (que llama al repo que llama al backend)
      setModalOpen(true);
    } catch (error) {
      // Puedes agregar más lógica de error aquí (ejemplo: mostrar un modal de error)
      alert('Error al enviar el formulario. Intenta de nuevo más tarde.');
    }
  };

  const handleCloseModal = () => setModalOpen(false);

  return {
    isModalOpen,
    handleCloseModal,
    handleSendForm
  };
};
