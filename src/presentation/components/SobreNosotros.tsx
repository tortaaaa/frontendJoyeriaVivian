import React from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './SobreNosotros.module.css';
import slide1 from '../../../src/assets/images/slide1.png';

const SobreNosotros: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className={styles.about}>
      {/* Sección principal: texto + imagen */}
      <section className={styles.hero}>
        <div className={styles.heroText}>
          <h1>Quiénes Somos</h1>
          <p>
            Joyería Vivian es una joyería familiar con más de 50 años de experiencia,
            especializada en la fabricación y creación de joyas, donde el arte, el conocimiento
            y la tradición se combinan para brindar piezas auténticas y un servicio basado
            en la confianza.
          </p>
          <p>
            Nos dedicamos a crear y comercializar joyas que perduran en el tiempo, trabajando
            con metales nobles como oro, plata y platino. Realizamos diseños personalizados
            y fabricación a medida, transformando ideas, recuerdos y emociones en piezas únicas.
          </p>
          <p>
            También ofrecemos servicios de orfebrería para otras joyerías, reparaciones,
            transformaciones y creación de diseños exclusivos. Además, contamos con grabados
            y fotograbados para dar un toque aún más personal a cada pieza.
          </p>
        </div>

        <div className={styles.heroImage}>
          <img src={slide1} alt="Taller de Joyería Vivian" />
        </div>
      </section>

      {/* Sección Nuestras Joyas */}
      <section className={styles.section}>
        <div className={styles.sectionHeader}>
          <h2>Nuestras Joyas</h2>
          <p>
            En Joyería Vivian contamos con joyas listas para entrega y piezas especiales
            pensadas para acompañar tus momentos más importantes.
          </p>
        </div>

        <div className={styles.cardsGrid}>
          <div className={styles.card}>
            <h3>Compromisos y matrimonios</h3>
            <p>
              Anillos y alianzas que simbolizan amor, compromiso y el inicio de una nueva etapa.
            </p>
          </div>
          <div className={styles.card}>
            <h3>Aniversarios y regalos de pareja</h3>
            <p>
              Detalles únicos para celebrar el amor y renovar promesas con significado.
            </p>
          </div>
          <div className={styles.card}>
            <h3>Licenciaturas y logros académicos</h3>
            <p>
              Joyas que conmemoran el esfuerzo, la dedicación y los grandes logros personales.
            </p>
          </div>
          <div className={styles.card}>
            <h3>Aniversarios de colegios, empresas y organizaciones</h3>
            <p>
              Diseños especiales para instituciones que desean recordar hitos importantes.
            </p>
          </div>
          <div className={styles.card}>
            <h3>Aritos para bebés y joyas familiares</h3>
            <p>
              Piezas delicadas para los más pequeños y joyas que pasan de generación en generación.
            </p>
          </div>
        </div>
      </section>

      {/* Sección Diferenciales */}
      <section className={styles.sectionAlt}>
        <div className={styles.sectionHeader}>
          <h2>¿En qué nos diferenciamos?</h2>
          <p>
            Nuestra mayor satisfacción es acompañar a nuestros clientes en momentos que
            recordarán toda la vida.
          </p>
        </div>

        <ul className={styles.bullets}>
          <li>
            <span className={styles.bulletTitle}>Compromiso con la calidad</span>
            <p>
              Trabajamos con materiales de primera y procesos cuidadosos en cada etapa de la creación.
            </p>
          </li>
          <li>
            <span className={styles.bulletTitle}>Honestidad y confianza</span>
            <p>
              La transparencia y el respeto son la base de nuestra relación con cada cliente.
            </p>
          </li>
          <li>
            <span className={styles.bulletTitle}>Atención cercana y personalizada</span>
            <p>
              Escuchamos tu historia y tus ideas para transformarlas en la joya que imaginas.
            </p>
          </li>
          <li>
            <span className={styles.bulletTitle}>Precios justos</span>
            <p>
              Buscamos siempre el equilibrio entre calidad, diseño y accesibilidad.
            </p>
          </li>
        </ul>
      </section>

      {/* Sección cierre + CTA */}
      <section className={styles.ctaSection}>
        <div className={styles.ctaContent}>
          <h2>Tu joya, tu historia</h2>
          <p>
            En Joyería Vivian creemos que una joya no sólo se ve bien: guarda recuerdos,
            celebra momentos y acompaña para toda la vida. Te invitamos a encontrar o crear
            la tuya con nosotros.
          </p>

          <div className={styles.ctaButtons}>
            <button
              className={styles.button}
              onClick={() => navigate('/products/matrimonio')}
            >
              Ver colección de matrimonios
            </button>
            <button
              className={styles.buttonSecondary}
              onClick={() => navigate('/Orfebreria')}
            >
              Diseñar una joya a medida
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default SobreNosotros;
