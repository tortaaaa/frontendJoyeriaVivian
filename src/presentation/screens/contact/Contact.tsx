import React from 'react';
import styles from './Contact.module.css';
import logo2 from '../../../../src/assets/images/JoyeriaVivianLogo2.jpg';
import { FaInstagram, FaEnvelope, FaWhatsapp, FaFacebook } from 'react-icons/fa';
import Modal from '../../components/Modal';
import { Formik, Field, Form, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { useContactForm } from './ViewModel';

const Contact: React.FC = () => {
  const { isModalOpen, handleCloseModal, handleSendForm } = useContactForm();

  const validationSchema = Yup.object({
    name: Yup.string().required('Nombre es requerido'),
    email: Yup.string().email('Email inválido').required('Email es requerido'),
    subject: Yup.string().required('Asunto es requerido'),
    message: Yup.string().required('Mensaje es requerido'),
  });

  return (
    <div>
      <div className={styles.contactInfo}>
        <img src={logo2} alt="Ring" className={styles.ringImage} />
        <div className={styles.contactMethods}>
          <h2>Nos puedes contactar por cualquiera de estos medios</h2>
          <h3>Siguenos en nuestras redes:</h3>
          <div className={styles.contactRow}>
            <div className={styles.contactMethod}>
              <a href="https://www.instagram.com/joyeriavivian" target="_blank" rel="noopener noreferrer">
                <FaInstagram className={`${styles.icon} ${styles.iconBlack}`} />
              </a>
              <span className={styles.contactText}>joyeria.vivian</span>
            </div>
            <div className={styles.contactMethod}>
              <a href="https://www.facebook.com/JoyeriaVivian" target="_blank" rel="noopener noreferrer">
                <FaFacebook className={`${styles.icon} ${styles.iconBlack}`} />
              </a>
              <span className={styles.contactText}>Joyería Vivian </span>
            </div>
            <div className={styles.contactMethod}>
              <a href="mailto:joyeriavivian@gmail.com" target="_blank" rel="noopener noreferrer">
                <FaEnvelope className={`${styles.icon} ${styles.iconBlack}`} />
              </a>
              <span className={styles.contactText}>joyeriavivian@gmail.com</span>
            </div>
            <div className={styles.contactMethod}>
              <a href="https://wa.me/56912345678?text=Hola%20quiero%20más%20información%20sobre%20sus%20joyas" target="_blank" rel="noopener noreferrer">
                <FaWhatsapp className={`${styles.icon} ${styles.iconBlack}`} />
              </a>
              <span className={styles.contactText}>+56 9 1234 5678</span>
            </div>
          </div>
        </div>
      </div>
      <div className={styles.formContainer}>
        <h3>Si gustas nos podemos comunicar contigo, completa el formulario a continuación y te contactamos en cuanto podamos. Gracias.</h3>
        <Formik
          initialValues={{ name: '', email: '', subject: '', message: '' }}
          validationSchema={validationSchema}
          onSubmit={async (values, { resetForm }) => {
            await handleSendForm(values); // Envía usando el ViewModel y flujo limpio
            resetForm();
          }}
        >
          {() => (
            <Form className={styles.form}>
              <h3>Contáctanos</h3>
              <div className={styles.formGroup}>
                <label htmlFor="name">Nombre</label>
                <Field type="text" id="name" name="name" />
                <ErrorMessage name="name" component="div" className={styles.error} />
              </div>
              <div className={styles.formGroup}>
                <label htmlFor="email">Correo Electrónico</label>
                <Field type="email" id="email" name="email" />
                <ErrorMessage name="email" component="div" className={styles.error} />
              </div>
              <div className={styles.formGroup}>
                <label htmlFor="subject">Asunto</label>
                <Field type="text" id="subject" name="subject" />
                <ErrorMessage name="subject" component="div" className={styles.error} />
              </div>
              <div className={styles.formGroup}>
                <label htmlFor="message">Mensaje</label>
                <Field as="textarea" id="message" name="message" />
                <ErrorMessage name="message" component="div" className={styles.error} />
              </div>
              <button type="submit" className={styles.submitButton}>Enviar</button>
            </Form>
          )}
        </Formik>
      </div>
      <Modal isOpen={isModalOpen} onClose={handleCloseModal} message="Formulario enviado" />
    </div>
  );
};

export default Contact;
