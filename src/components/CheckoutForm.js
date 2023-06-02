import { CardElement, useElements, useStripe } from '@stripe/react-stripe-js'
import React, { useState } from 'react'
import { Alert, Button, Col, Form, Row } from 'react-bootstrap';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { useCreateOrderMutation } from '../services/appApi';
//import '../Stripe.css'

const CheckoutForm = () => {
    const stripe = useStripe();
    const appearance = {
        theme: 'flat'
      };
      
      // Pass the appearance object to the Elements instance
    const elements = useElements();
    const user = useSelector(state => state.user);
    const navigate = useNavigate();
    const [alertMessage,setAlertMessage] = useState("");
    const [createOrder, {isLoading, isError, isSuccess}] = useCreateOrderMutation();
    const [country, setCountry] = useState("");
    const [address, setAddress] = useState("");
    
    const [paying, setPaying] = useState(false);

    async function handlePay (e){
        e.preventDefault();
        if(!stripe || !elements || user.cart.count<=0) return;
        setPaying(true);
        const { client_secret } = await fetch("http://localhost:8080/create-payment", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: "Bearer ",
            },
            body: JSON.stringify({ amount: user.cart.total*100 }),
        }).then((res) => res.json());
        const { paymentIntent } = await stripe.confirmCardPayment(client_secret, {
            payment_method: {
                card: elements.getElement(CardElement),
            },
        });
        setPaying(false);

        if (paymentIntent) {
            createOrder({ userId: user._id, cart: user.cart, address, country }).then((res) => {
                if (!isLoading && !isError) {
                    setAlertMessage(`Payment ${paymentIntent.status}`);
                    
                    setTimeout(() => {
                         navigate("/orders");
                    }, 3000);
                }
            });
        }
    }

  return (
    <Col md={7} className='cart-payment-container'>
        <Form>
            {user && (
            <Row>
                {alertMessage && <Alert>{alertMessage}</Alert>}
                <Col md={6}>
                    <Form.Group className='mb-3'>
                        <Form.Label>Felhasználónév</Form.Label>
                        <Form.Control type='text' placeholder='First Name' value={user.name} disabled/>
                    </Form.Group>
                </Col>
                <Col md={6}>
                    <Form.Group className='mb-3'>
                        <Form.Label>Email</Form.Label>
                        <Form.Control type='text' placeholder='Email' value={user.email} disabled/>
                    </Form.Group>
                </Col>
            </Row>
            )}
            <Row>
                <Col md={7}>
                    <Form.Group className='mb-3'>
                        <Form.Label>Számlázási cím</Form.Label>
                        <Form.Control type='text' placeholder='Address' value={address} onChange={(e)=>setAddress(e.target.value)} required/>
                    </Form.Group>
                </Col>
                <Col md={5}>
                    <Form.Group className='mb-3'>
                        <Form.Label>Ország</Form.Label>
                        <Form.Control type='text' placeholder='Country' value={country} onChange={(e)=>setCountry(e.target.value)} required/>
                    </Form.Group>
                </Col>
            </Row>
            <label htmlFor="card-element">Kártya adatok</label>
            <CardElement id="card-element" options={appearance}/>
            <Button className='mt-3' type='submit' disabled={user.cart.count === 0 || paying || isSuccess} onClick={handlePay}>
                {paying ? "Processing..." : "Pay"}
            </Button>
            <iframe frameborder="0" loading="lazy" src="https://cdn.foxpost.hu/apt-finder/v1/app/?discount=1" width="100%" height="600px"></iframe>
        </Form>
    </Col>
  )
}

export default CheckoutForm
