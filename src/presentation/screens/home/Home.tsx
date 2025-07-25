import React from 'react';
import Slider from "react-slick";
import { useNavigate } from 'react-router-dom';
import styles from './Home.module.css';
import slide1 from '../../../../src/assets/images/slide1.jpg';
import slide2 from '../../../../src/assets/images/slide2.jpg';
import slide3 from '../../../../src/assets/images/slide3.jpg';
import slide4 from '../../../../src/assets/images/slide4.jpg';
import nuevoslide1 from '../../../../src/assets/images/envio1.jpg';
import nuevoslide2 from '../../../../src/assets/images/envio2.jpg';
import { sliderSettings } from './ViewModel';
import "slick-carousel/slick/slick.css"; 
import "slick-carousel/slick/slick-theme.css";

import CategoryGrid from '../../../../src/presentation/components/CategoryGrid';
import orfebre from '../../../assets/images/taller_de_orfebreria.jpg'; // Usa tu imagen real

const Home: React.FC = () => {
  const navigate = useNavigate();
  return (
    <div className={styles.home}>
      
      {/* Contenedor slider + texto */}
      <div className={styles.welcome}>
        <Slider {...sliderSettings} className={styles.slider}>
          <div>
            <img src={slide4} alt="Slide4" className={styles.ringImage} />
          </div>
          <div>
            <img src={slide1} alt="Slide1" className={styles.ringImage} />
          </div>
          <div>
            <img src={slide2} alt="Slide2" className={styles.ringImage} />
          </div>
          <div>
            <img src={slide3} alt="Slide3" className={styles.ringImage} />
          </div>
        </Slider>

        <div className={styles.text}>
          <h2>HardWear by Tiffany</h2>
          <p>
            Showcasing individual stories of power and resilience, award-winning actresses Greta Lee and Mikey Madison and acclaimed painter Anna Weyant wear the bold links of HardWear by Tiffany, a symbol of love’s transformative strength. 
          </p>
          <button className={styles.button}>Descubre más</button>
        </div>
      </div>

      {/* Segunda sección con texto y slider */}
      <div className={styles.textSliderSection}>
        <div className={styles.text}>
          <h2>Descubre nuestra colección</h2>
          <p>Explora las piezas más exclusivas y elegantes diseñadas para ti.</p>
          <button className={styles.button}>Comprar Ahora</button>
        </div>
        <div className={styles.sliderWrapper}>
          <Slider {...sliderSettings} className={styles.slider}>
            <div><img src={nuevoslide1} alt="Slide 1" className={styles.ringImage} /></div>
            <div><img src={nuevoslide2} alt="Slide 2" className={styles.ringImage} /></div>
          </Slider>
        </div>
      </div>

      <CategoryGrid />
      <div className={styles.textSliderSection}>
        <div className={styles.text}>
          <h2>Joyas personalizadas</h2>
           <p>¿Estás buscando el Anillo de compromiso perfecto para ese gran momento?</p>
           <p>¿Te gustaría regalarte una joya especial para celebrar un logro o momento importante?</p>
              <button className={styles.button}onClick={() => navigate('/Orfebreria')}>
                Más Información
              </button>
        </div>
        <div className={styles.imagen}>
          <img src={orfebre} alt="Orfebre trabajando" />
        </div>
      </div>
    </div>
  );
};

export default Home;
