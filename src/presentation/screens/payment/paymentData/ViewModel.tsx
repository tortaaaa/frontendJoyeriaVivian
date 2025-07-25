// PaymentViewModel.tsx
import { useState } from 'react';

const usePaymentViewModel = () => {
  const [paymentData, setPaymentData] = useState({
    client_name: '',
    client_rut: '',
    client_phone: '',
    client_mail: '',
    client_region: '',
    client_city: '',
    address_name: '',
    address_number: '',
    additional_info: ''
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setPaymentData(prev => ({ ...prev, [name]: value }));
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    Object.entries(paymentData).forEach(([key, value]) => {
      if (!value.trim() && key !== 'additional_info') {
        newErrors[key] = 'Campo obligatorio';
      }
    });

    if (!/\S+@\S+\.\S+/.test(paymentData.client_mail)) {
      newErrors.client_mail = 'Correo no válido';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  return { paymentData, handleChange, validateForm, errors };
};

export default usePaymentViewModel;
