import { useState } from 'react';

export const CHILE_REGIONS = [
  "Arica y Parinacota",
  "Tarapacá",
  "Antofagasta",
  "Atacama",
  "Coquimbo",
  "Valparaíso",
  "Metropolitana de Santiago",
  "Libertador General Bernardo O'Higgins",
  "Maule",
  "Ñuble",
  "Biobío",
  "La Araucanía",
  "Los Ríos",
  "Los Lagos",
  "Aysén del General Carlos Ibáñez del Campo",
  "Magallanes y de la Antártica Chilena"
];

// Normaliza el RUT a 'XXXXXXXX-X' sin puntos ni espacios extra
function normalizeRut(rawRut: string): string {
  console.log("[normalizeRut] rawRut:", rawRut);
  if (!rawRut) return "";
  let rut = rawRut.replace(/[^0-9kK]/g, '').toUpperCase();
  if (rut.length < 2) return "";
  let body = rut.slice(0, -1);
  let dv = rut.slice(-1);
  const res = `${body}-${dv}`;
  console.log("[normalizeRut] result:", res);
  return res;
}

// Validador de RUT chileno
function validaRut(rutCompleto: string): boolean {
  console.log("[validaRut] rutCompleto:", rutCompleto);
  if (!/^\d{7,8}-[0-9Kk]{1}$/.test(rutCompleto)) return false;
  const [rut, digv] = rutCompleto.split('-');
  let dvv = digv === 'K' ? 'k' : digv;
  const check = dv(rut) === dvv;
  console.log("[validaRut] check:", check, "calcDV:", dv(rut), "dvv:", dvv);
  return check;
}
function dv(T: string): string {
  let M = 0, S = 1;
  while (T.length > 0) {
    const n = Number(T.charAt(T.length - 1));
    if (isNaN(n)) {
      console.log("[dv] Carácter no numérico detectado:", T.charAt(T.length - 1));
      break;
    }
    S = (S + n * (9 - M++ % 6)) % 11;
    T = T.slice(0, -1);
  }
  return S ? String(S - 1) : 'k';
}



// Formatea el RUT a '12.345.678-9' (para mostrar)
function formatRut(rut: string) {
  rut = rut.replace(/[^0-9kK]/g, '').toUpperCase();
  if (rut.length === 0) return '';
  let rutBody = rut.slice(0, -1);
  let dv = rut.slice(-1);
  let formatted = '';
  let i = 0;
  for (let j = rutBody.length - 1; j >= 0; j--) {
    formatted = rutBody[j] + formatted;
    i++;
    if (i === 3 && j !== 0) {
      formatted = '.' + formatted;
      i = 0;
    }
  }
  return `${formatted}-${dv}`;
}

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

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;

    // Solo letras y espacios en nombre de calle
    if (name === 'address_name') {
      if (/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]*$/.test(value)) {
        setPaymentData(prev => ({ ...prev, [name]: value }));
      }
      return;
    }

    // Solo números en número de calle
    if (name === 'address_number') {
      if (/^\d*$/.test(value)) {
        setPaymentData(prev => ({ ...prev, [name]: value }));
      }
      return;
    }

    // RUT: solo limpiar en vivo, no formatear
    if (name === 'client_rut') {
      let cleanRut = value.replace(/[^0-9kK]/g, '').toUpperCase();
      setPaymentData(prev => ({ ...prev, [name]: cleanRut }));
      return;
    }

    // Resto de campos: actualización normal
    setPaymentData(prev => ({ ...prev, [name]: value }));
  };

  // Para formatear RUT en el blur
  const handleRutBlur = () => {
    const cleanRut = paymentData.client_rut.replace(/[^0-9kK]/g, '').toUpperCase();
    if (!cleanRut) return;
    const formatted = formatRut(cleanRut);
    setPaymentData(prev => ({ ...prev, client_rut: formatted }));
    console.log("[handleRutBlur] formatted:", formatted);
  };

  // Validación CON LOGS aislados
  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    // Nombre y Apellido
    console.log("[validateForm] client_name:", paymentData.client_name);
    if (!paymentData.client_name.trim()) {
      newErrors.client_name = 'Campo obligatorio';
      setErrors(newErrors);
      console.log("❗ Error en client_name");
      return false;
    }

    // RUT
    console.log("[validateForm] client_rut (original):", paymentData.client_rut);
    const rutNormalized = normalizeRut(paymentData.client_rut);
    console.log("[validateForm] rutNormalized:", rutNormalized);
    if (!rutNormalized || !/^\d{7,8}-[0-9Kk]{1}$/.test(rutNormalized)) {
      newErrors.client_rut = 'Campo obligatorio o formato incorrecto';
      setErrors(newErrors);
      console.log("❗ Error en client_rut formato");
      return false;
    } else if (!validaRut(rutNormalized)) {
      newErrors.client_rut = 'RUT chileno no válido';
      setErrors(newErrors);
      console.log("❗ Error en client_rut no válido");
      return false;
    }

    // Teléfono
    console.log("[validateForm] client_phone:", paymentData.client_phone);
    if (!paymentData.client_phone.trim()) {
      newErrors.client_phone = 'Campo obligatorio';
      setErrors(newErrors);
      console.log("❗ Error en client_phone");
      return false;
    }

    // Correo
    console.log("[validateForm] client_mail:", paymentData.client_mail);
    if (!paymentData.client_mail.trim()) {
      newErrors.client_mail = 'Campo obligatorio';
      setErrors(newErrors);
      console.log("❗ Error en client_mail");
      return false;
    } else if (!/\S+@\S+\.\S+/.test(paymentData.client_mail)) {
      newErrors.client_mail = 'Correo no válido';
      setErrors(newErrors);
      console.log("❗ Error en client_mail formato");
      return false;
    }

    // Región
    console.log("[validateForm] client_region:", paymentData.client_region);
    if (!paymentData.client_region.trim()) {
      newErrors.client_region = 'Campo obligatorio';
      setErrors(newErrors);
      console.log("❗ Error en client_region");
      return false;
    } else if (!CHILE_REGIONS.includes(paymentData.client_region)) {
      newErrors.client_region = 'Debes seleccionar una región válida de Chile';
      setErrors(newErrors);
      console.log("❗ Error en client_region inválida");
      return false;
    }

    // Ciudad
    console.log("[validateForm] client_city:", paymentData.client_city);
    if (!paymentData.client_city.trim()) {
      newErrors.client_city = 'Campo obligatorio';
      setErrors(newErrors);
      console.log("❗ Error en client_city");
      return false;
    }

    // address_name
    console.log("[validateForm] address_name:", paymentData.address_name);
    if (!paymentData.address_name.trim()) {
      newErrors.address_name = 'Campo obligatorio';
      setErrors(newErrors);
      console.log("❗ Error en address_name vacío");
      return false;
    } else if (!/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/.test(paymentData.address_name)) {
      newErrors.address_name = 'Solo letras y espacios';
      setErrors(newErrors);
      console.log("❗ Error en address_name caracteres");
      return false;
    }

    // address_number
    console.log("[validateForm] address_number:", paymentData.address_number);
    if (!paymentData.address_number.trim()) {
      newErrors.address_number = 'Campo obligatorio';
      setErrors(newErrors);
      console.log("❗ Error en address_number vacío");
      return false;
    } else if (!/^\d+$/.test(paymentData.address_number)) {
      newErrors.address_number = 'Solo números';
      setErrors(newErrors);
      console.log("❗ Error en address_number caracteres");
      return false;
    }

    // Si todo OK, limpia errores
    setErrors({});
    console.log("✅ Validación exitosa!");
    return true;
  };

  return { paymentData, setPaymentData, handleChange, handleRutBlur, validateForm, errors, normalizeRut };
};

export default usePaymentViewModel;
