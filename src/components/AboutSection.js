import React from 'react';
import './AboutSection.css'; // Import the CSS file for styling

const AboutSection = () => {
  return (
    <section id="about">
      <div className="container">
        <div className="row">
          <div className="col-lg-6">
            <h2>Rólunk</h2>
            <p>
            A Melt Me egy családi vállalkozás, ami legfőképp kézműves, szója viaszból készült illatgyertyákat készít. Az alap koncepciót másfél évvel ezelőtt álmodtuk meg. Azóta zajlik az első termékek fejlesztése, tökéletesítése. Célunk egy minőségi vegán viasz alapú prémium illatgyertya megalkotása volt. Termékünk vegán, állatokon nem tesztelt alapanyagokból készül, ami természetes alapanyagokat tartalmaz. Jelenleg 4 illatból áll a kollekciónk és ezeket egy méretben lehet kapni, amit rövid határidőn belül szeretnénk további illatokkal bővíteni. Célunk, hogy az ország legjobb minőségű illatgyertyáit és illatviaszait készítsük el és mutassuk meg nektek. Emellett szeretnénk elérni, hogy minden háztartásban legalább egy Melt Me illatgyertya jelen legyen. (És még ki tudja mennyi mindennel készülünk 🙂 )
            </p>
            <p>
            Az alapanyagainkat gondosan válogatjuk meg és a gyertya elkészítése folyamán figyelünk arra, hogy minden a lehető legtökéletesebb legyen. Mert a mi gyertyánktól te is garantáltan elolvadsz!
            </p>
          </div>
          <div className="col-lg-6">
            <img src="https://res.cloudinary.com/djumsmr1d/image/upload/v1688052954/aboutus_pic_u2lzrv.jpg" alt="Team" className="img-fluid" />
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutSection;