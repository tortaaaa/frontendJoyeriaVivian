import React from 'react';
import styles from './Contact.module.css';
import logo2 from '../../../../src/assets/images/JoyeriaVivianLogo2.jpg';
import { FaInstagram, FaEnvelope, FaWhatsapp } from 'react-icons/fa';
import Modal from '../../components/Modal';
import { Formik, Field, Form, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import emailjs from '@emailjs/browser';

const Contact: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = React.useState(false);

  const validationSchema = Yup.object({
    name: Yup.string().required('Nombre es requerido'),
    email: Yup.string().email('Email inválido').required('Email es requerido'),
    subject: Yup.string().required('Asunto es requerido'),
    message: Yup.string().required('Mensaje es requerido'),
  });

  const sendEmail = (values: { name: string; email: string; subject: string; message: string }) => {
    emailjs.send('service_ggmof4o', 'template_954d1rn', values, 'DWDAPAxD2l63tt2qT')
      .then(
        () => {
          setIsModalOpen(true);
        },
        (error) => {
          console.error('Error:', error.text);
        }
      );
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  return (
    <div>
      <div className={styles.contactInfo}>
        <img src={logo2} alt="Ring" className={styles.ringImage} />
        <div className={styles.contactMethods}>
          <h2>Nos puedes contactar por cualquiera de estos medios</h2>
          <div className={styles.contactRow}>
            <div className={styles.contactMethod}>
              <a href="https://www.instagram.com/joyeriavivian" target="_blank" rel="noopener noreferrer">
                <FaInstagram className={`${styles.icon} ${styles.iconBlack}`} />
              </a>
              <span>Instagram</span>
              <span className={styles.contactText}>@joyeria.vivian</span>
            </div>
            <div className={styles.contactMethod}>
              <FaEnvelope className={`${styles.icon} ${styles.iconBlack}`} />
             
              <span className={styles.contactText}>Contacto: joyeriavivian@gmail.com</span>
            </div>
            <div className={styles.contactMethod}>
              <FaWhatsapp className={`${styles.icon} ${styles.iconBlack}`} />
         
              <span className={styles.contactText}>+56 9 1234 5678</span>
            </div>
          </div>
        </div>
      </div>
      <div className={styles.formContainer}>
        <h3> Si gustas nos podemos comunicar contigo, completa el formulario a continuación y te contactamos en cuanto podamos. Gracias.</h3>
        <Formik
          initialValues={{ name: '', email: '', subject: '', message: '' }}
          validationSchema={validationSchema}
          onSubmit={(values, { resetForm }) => {
            sendEmail(values);
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
