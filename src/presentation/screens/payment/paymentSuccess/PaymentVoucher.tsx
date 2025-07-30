// src/presentation/screens/payment/paymentVoucher/PaymentVoucher.tsx
import React, { useEffect, useState, useContext, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import styles from './PaymentVoucher.module.css';
import { CartContext } from '../../../context/CartContext';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import logo from '../../../../assets/images/JoyeriaVivianLogo.jpg'; // Ajusta la ruta según tu estructura

// Función para convertir imagen URL a base64
const toDataUrl = (url: string): Promise<string> =>
  fetch(url)
    .then(response => response.blob())
    .then(
      blob =>
        new Promise<string>((resolve, reject) => {
          const reader = new FileReader();
          reader.onloadend = () => resolve(reader.result as string);
          reader.onerror = reject;
          reader.readAsDataURL(blob);
        })
    );

const PaymentVoucher: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { clearCart } = useContext(CartContext) || {};
  const [saleData, setSaleData] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const voucherRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    try {
      const queryParams = new URLSearchParams(location.search);
      const data = queryParams.get('data');

      if (data) {
        const parsedData = JSON.parse(decodeURIComponent(data));
        setSaleData(parsedData);
        if (clearCart) clearCart();
      } else {
        setError('No se pudo obtener la información de la transacción.');
      }
    } catch (err) {
      console.error('Error al procesar los datos:', err);
      setError('Error al procesar los datos de la transacción.');
    }
  }, [location.search]);

  const handlePrint = () => {
    if (voucherRef.current) {
      const printContents = voucherRef.current.innerHTML;
      const printWindow = window.open('', '', 'height=600,width=800');
      if (printWindow) {
        printWindow.document.write(`
          <html>
            <head>
              <title>Comprobante de Pago</title>
              <style>
                body { font-family: Arial, sans-serif; padding: 20px; }
                h1 { font-size: 24px; }
                p, li { font-size: 16px; }
              </style>
            </head>
            <body>${printContents}</body>
          </html>
        `);
        printWindow.document.close();
        printWindow.focus();
        printWindow.print();
      }
    }
  };

  const handleDownloadPDF = async () => {
    if (!voucherRef.current) return;

    try {
      const element = voucherRef.current;

      // Convierte el logo a base64
      const logoBase64 = await toDataUrl(logo);

      // Captura el contenido como canvas con buena resolución
      const canvas = await html2canvas(element, {
        scale: 3,
        useCORS: true,
        logging: true,
        windowWidth: document.documentElement.scrollWidth,
      });

      const imgData = canvas.toDataURL('image/png');

      const pdf = new jsPDF('p', 'mm', 'a4');
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = pdf.internal.pageSize.getHeight();

      // Tamaño y posición del logo
      const logoWidth = 50;  // mm
      const logoHeight = 60; // mm
      const margin = 10;

      // Añade logo arriba, centrado
      const logoX = (pdfWidth - logoWidth) / 2;
      pdf.addImage(logoBase64, 'PNG', logoX, margin, logoWidth, logoHeight);

      // Ahora añade la imagen del contenido, abajo del logo
      const imgProps = (pdf as any).getImageProperties(imgData);
      const imgWidth = pdfWidth - 2 * margin;
      const imgHeight = (imgProps.height * imgWidth) / imgProps.width;

      let position = margin + logoHeight + 10; // 10 mm de espacio entre logo y contenido
      let heightLeft = imgHeight;

      pdf.addImage(imgData, 'PNG', margin, position, imgWidth, imgHeight);
      heightLeft -= pdfHeight - position - margin;

      while (heightLeft > 0) {
        pdf.addPage();
        position = margin - heightLeft;
        pdf.addImage(imgData, 'PNG', margin, position, imgWidth, imgHeight);
        heightLeft -= pdfHeight - 2 * margin;
      }

      pdf.save('comprobante_pago.pdf');
    } catch (error: unknown) {
      if (error instanceof Error) {
        console.error('Error generando PDF:', error.message);
      } else {
        console.error('Error generando PDF:', error);
      }
    }
  };

  if (error) return <p>{error}</p>;
  if (!saleData) return <p>Cargando...</p>;

  const { sale_data, products } = saleData;

  return (
    <div className={styles.voucherContainer}>
      <h1>Comprobante de Pago</h1>
      <div className={styles.voucher} ref={voucherRef}>
        <p className={styles.success}>
          <strong>{saleData.status === 'success' ? 'Transacción Exitosa' : 'Transacción Fallida'}</strong>
        </p>
        <p><strong>Código de Venta:</strong> {sale_data.sale_code}</p>
        <p><strong>Fecha de Venta:</strong> {sale_data.sale_date}</p>
        <p><strong>Nombre del Cliente:</strong> {sale_data.client_name}</p>
        <p><strong>RUT:</strong> {sale_data.client_rut}</p>
        <p><strong>Teléfono:</strong> {sale_data.client_phone}</p>
        <p><strong>Email:</strong> {sale_data.client_mail}</p>
        <p><strong>Región:</strong> {sale_data.client_region}</p>
        <p><strong>Ciudad:</strong> {sale_data.client_city}</p>
        <p><strong>Dirección:</strong> {sale_data.address_name}, {sale_data.address_number}</p>
        <p><strong>Información Adicional:</strong> {sale_data.additional_info}</p>
        <p><strong>Método de Pago:</strong> {sale_data.payment_method}</p>
        <p><strong>Total Pagado:</strong> ${sale_data.total_price.toLocaleString()}</p>

        <h2>Productos Comprados:</h2>
        <ul className={styles.productList}>
          {products.map((product: any, index: number) => (
            <li key={index}>
              <strong>{product.name}</strong> - Cantidad: {product.quantity}
            </li>
          ))}
        </ul>
      </div>

      <div style={{ display: 'flex', gap: '1rem', marginTop: '1.5rem' }}>
        <button onClick={() => navigate('/')} className={styles.button}>
          Volver al Inicio
        </button>
        <button onClick={handlePrint} className={styles.button}>
          Imprimir Comprobante
        </button>
        <button onClick={handleDownloadPDF} className={styles.button}>
          Descargar PDF
        </button>
      </div>
    </div>
  );
};

export default PaymentVoucher;
