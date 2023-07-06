import React from 'react';
import { Link } from 'react-router-dom';
import './ThankYouPage.css';

const ThankYouPage = () => {
  return (
    <div className="thank-you-page">
      <h2 className="thank-you-message">Thank you for your order!</h2>
      <p className="order-details">
        You can check your order details in your email.
      </p>
      <Link to="/" className="home-link">
        Back to Homepage
      </Link>
    </div>
  );
};

export default ThankYouPage;