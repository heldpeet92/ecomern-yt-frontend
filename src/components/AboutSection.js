import React from 'react';
import './AboutSection.css'; // Import the CSS file for styling

const AboutSection = () => {
  return (
    <section id="about">
      <div className="container">
        <div className="row">
          <div className="col-lg-6">
            <h2>About Us</h2>
            <p>
              Welcome to our portfolio website! We are a team of passionate developers and designers dedicated to creating exceptional digital experiences. With a deep understanding of web technologies and a keen eye for aesthetics, we strive to deliver elegant and functional solutions for our clients.
            </p>
            <p>
              Our expertise lies in building interactive and user-friendly web applications using modern frameworks like React.js. We are constantly honing our skills and staying up-to-date with the latest industry trends to provide cutting-edge solutions that meet the unique requirements of each project.
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