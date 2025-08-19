// src/presentation/screens/payment/paymentVoucher/PaymentVoucher.tsx
import React, { useEffect, useState, useContext, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import styles from './PaymentVoucher.module.css';
import { CartContext } from '../../../context/CartContext';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import logo from '../../../../assets/images/JoyeriaVivianLogo.jpg';
import api from '../../../../data/sources/api/apiJoyeriaVivian';

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

const fmtCLP = (n: number) =>
  new Intl.NumberFormat('es-CL', { style: 'currency', currency: 'CLP', maximumFractionDigits: 0 }).format(n);

const PaymentVoucher: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { clearCart } = useContext(CartContext) || {};
  const [voucher, setVoucher] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const voucherRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const qp = new URLSearchParams(location.search);
    const saleCode = qp.get('sale_code');
    if (!saleCode) {
      setError('Falta el código de venta.');
      setLoading(false);
      return;
    }

    (async () => {
      try {
        const { data } = await api.get(`/payment/vouchers/${saleCode}/`);
        setVoucher(data);
        if (clearCart) clearCart();
      } catch (e) {
        console.error('Error obteniendo voucher:', e);
        setError('No se pudo cargar el comprobante.');
      } finally {
        setLoading(false);
      }
    })();
  }, [location.search]);

  const handlePrint = () => {
    if (!voucherRef.current) return;
    const printContents = voucherRef.current.innerHTML;
    const w = window.open('', '', 'height=600,width=800');
    if (!w) return;
    w.document.write(`
      <html><head><title>Comprobante de Pago</title>
      <style>body { font-family: Arial, sans-serif; padding: 20px; } h1 { font-size: 24px; } p, li { font-size: 16px; }</style>
      </head><body>${printContents}</body></html>
    `);
    w.document.close();
    w.focus();
    w.print();
  };

  const handleDownloadPDF = async () => {
    if (!voucherRef.current) return;
    try {
      const element = voucherRef.current;
      const logoBase64 = await toDataUrl(logo);
      const canvas = await html2canvas(element, { scale: 3, useCORS: true, logging: false, windowWidth: document.documentElement.scrollWidth });
      const imgData = canvas.toDataURL('image/png');

      const pdf = new jsPDF('p', 'mm', 'a4');
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = pdf.internal.pageSize.getHeight();
      const logoWidth = 50, logoHeight = 60, margin = 10;
      const logoX = (pdfWidth - logoWidth) / 2;

      pdf.addImage(logoBase64, 'PNG', logoX, margin, logoWidth, logoHeight);

      const imgProps: any = (pdf as any).getImageProperties(imgData);
      const imgWidth = pdfWidth - 2 * margin;
      const imgHeight = (imgProps.height * imgWidth) / imgProps.width;

      let position = margin + logoHeight + 10;
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
    } catch (err) {
      console.error('Error generando PDF:', err);
    }
  };

  if (loading) return <p>Cargando...</p>;
  if (error) return <p>{error}</p>;
  if (!voucher) return <p>No se encontró el comprobante.</p>;

  return (
    <div className={styles.voucherContainer}>
      <h1>Comprobante de Pago</h1>
      <div className={styles.voucher} ref={voucherRef}>
        <p className={styles.success}><strong>Transacción Exitosa</strong></p>
        <p><strong>Código de Venta:</strong> {voucher.sale_code}</p>
        <p><strong>Fecha de Venta:</strong> {voucher.sale_date}</p>
        <p><strong>Nombre del Cliente:</strong> {voucher.client_name}</p>
        <p><strong>Email:</strong> {voucher.client_mail}</p>
        <p><strong>Método de Pago:</strong> {voucher.payment_method}</p>
        <p><strong>Total Pagado:</strong> {fmtCLP(Number(voucher.total_price))}</p>

        <h2>Productos Comprados:</h2>
        <ul className={styles.productList}>
          {voucher.products?.map((p: any, idx: number) => (
            <li key={idx}><strong>{p.name}</strong> - Cantidad: {p.quantity}</li>
          ))}
        </ul>
      </div>

      <div style={{ display: 'flex', gap: '1rem', marginTop: '1.5rem' }}>
        <button onClick={() => navigate('/')} className={styles.button}>Volver al Inicio</button>
        <button onClick={handlePrint} className={styles.button}>Imprimir Comprobante</button>
        <button onClick={handleDownloadPDF} className={styles.button}>Descargar PDF</button>
      </div>
    </div>
  );
};

export default PaymentVoucher;
