import {useEffect, useState} from 'react';

import {Elements} from '@stripe/react-stripe-js';
import CheckoutForm from './CheckoutForm'

function Payment(props) {
  const { stripePromise } = props;
  const { sharedState} = props;
  const [ clientSecret, setClientSecret ] = useState('');
  useEffect(() => {
	  
	  fetch(process.env.REACT_APP_APIURL+'/create-payment-intent', {
	  method: 'POST',
	  body: JSON.stringify({
		amount: sharedState * 100
	  }),
	  headers: {
		'Content-type': 'application/json; charset=UTF-8'
	  }
	}).then((res) => res.json())
      .then(({returnedClientSecret}) => setClientSecret(returnedClientSecret));
  }, [sharedState]);
	
	 const paymentElementOptions = {
     layout  : 'tabs',
     fields  : {
        billingDetails : {
           email   : 'never',
           address : {
              country : 'never'
           }
        }
     }
  };

  return (
    <>
      {clientSecret && stripePromise && (
        <Elements stripe={stripePromise} options={{ clientSecret, paymentElementOptions}}>
          <CheckoutForm />
        </Elements>
      )}
    </>
  );
}

export default Payment;