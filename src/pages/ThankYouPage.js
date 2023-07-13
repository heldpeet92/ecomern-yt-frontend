import React from 'react';
import { Link } from 'react-router-dom';
import './ThankYouPage.css';

const ThankYouPage = () => {
  return (
    <div className="thank-you-page">
      <h2 className="thank-you-message">Köszönjük rendelésedet!</h2>
      <p className="order-details">
        Megrendelésed részleteit e-mailben fogjuk küldeni.
      </p>
      <Link to="/" className="home-link">
        Kezdőlap
      </Link>
    </div>
  );
};

export default ThankYouPage;