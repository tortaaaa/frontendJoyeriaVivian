import React from 'react';
import Slider from "react-slick";
import styles from './Home.module.css';
import ringImage1 from '../../../../src/assets/images/ring.png';
import ringImage2 from '../../../../src/assets/images/ring2.png';
import { sliderSettings } from './ViewModel';
import "slick-carousel/slick/slick.css"; 
import "slick-carousel/slick/slick-theme.css";

const Home: React.FC = () => {
  return (
    <div className={styles.home}>
      <div className={styles.welcome}>
        <Slider {...sliderSettings} className={styles.slider}>
          <div>
            <img src={ringImage1} alt="Anillo 1" className={styles.ringImage} />
          </div>
          <div>
            <img src={ringImage2} alt="Anillo 2" className={styles.ringImage} />
          </div>
        </Slider>
        <div className={styles.text}>
          <h1>Bienvenido</h1>
          <p>
            Explora nuestra variedad de productos de joyería. Desde anillos hasta collares, tenemos algo para cada ocasión. 
          </p>
          <button className={styles.button}>Compra Ya</button>
        </div>
      </div>
    </div>
  );
};

export default Home;
