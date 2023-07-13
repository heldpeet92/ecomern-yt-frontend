import { useEffect, useState } from "react";

import { Elements } from "@stripe/react-stripe-js";
import CheckoutForm from "./CheckoutForm";

const Payment = ({
  setShippingMethod,
  stripePromise,
  selectedDiscount,
  sharedState,
  setCurrentPaymentMode,
  currentPaymentMode,
  cartPayMethod
}) => {
  // const { stripePromise } = props;
  // const { sharedState} = props;
  const [clientSecret, setClientSecret] = useState("");
  const [currentShippingMode, setCurrentShippingMode] = useState("");
  const [paymentMode, setPaymentMode] = useState("");

  useEffect(() => {
    
    if (sharedState) {      
      fetch(process.env.REACT_APP_APIURL + "/create-payment-intent", {
        method: "POST",
        body: JSON.stringify({
          amount: ((sharedState + 
          (currentShippingMode === 'FOXPOSTMachine' ? 990 : 
            currentShippingMode === 'FOXPOSTDelivery' ? 1690 : 0)
            +
            (paymentMode === 'COD' ? 320 : 0)
          )*
          ((selectedDiscount === 'BOGI10' || selectedDiscount === 'IVETT10' || selectedDiscount === 'VIKI10') ? 0.9 : 1.0)
          )* 100,
        }),
        headers: {
          "Content-type": "application/json; charset=UTF-8",
        },
      })
        .then((res) => res.json())
        .then(({ returnedClientSecret }) =>
          setClientSecret(returnedClientSecret)
        );
    }
  }, [sharedState,paymentMode,currentShippingMode,selectedDiscount]);

  useEffect(() => {
    setShippingMethod(currentShippingMode);
  }, [currentShippingMode]);

  useEffect(() => {
    setCurrentPaymentMode(paymentMode);
  }, [paymentMode]);

  const paymentElementOptions = {
    layout: "tabs",
    fields: {
      billingDetails: {
        email: "never",
        address: {
          country: "never",
        },
      },
    },
  };

  return (
    <>
      {clientSecret && stripePromise && (
        <Elements
          stripe={stripePromise}
          options={{ clientSecret, paymentElementOptions }}
        >
          <CheckoutForm
            setCurrentShippingMode={setCurrentShippingMode}
            selectedDiscount={selectedDiscount}
            setPaymentMode={setPaymentMode}
          />
        </Elements>
      )}
    </>
  );
};

export default Payment;
