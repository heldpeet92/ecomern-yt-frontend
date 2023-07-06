import { CardElement, useElements, useStripe } from '@stripe/react-stripe-js'
import React, { useState } from 'react'
import { Alert, Button, Col, Form, Row,FormGroup, InputGroup } from 'react-bootstrap';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { useCreateOrderMutation } from '../services/appApi';
//import '../Stripe.css'

const CheckoutFormNoLogin = () => {
    const stripe = useStripe();
    const appearance = {
        theme: 'flat'
      };
      
    const user = useSelector(state => state.user);
    const products = useSelector(state => state.products);
    let userCartOjb = user ? user.cart : [];
    if(!user){
        const storedCartData = localStorage.getItem('nologincart');
        userCartOjb = storedCartData ? JSON.parse(storedCartData) : {total: 0, count:0}
    }
    const count = 3;
    let cart = products.filter(product => userCartOjb[product._id] != null);
      // Pass the appearance object to the Elements instance
    const elements = useElements();
    const navigate = useNavigate();
    const [alertMessage,setAlertMessage] = useState("");
    const [createOrder, {isLoading, isError, isSuccess}] = useCreateOrderMutation();
    const [country, setCountry] = useState("");
    const [address, setAddress] = useState("");
    const [city, setCity] = useState("");
    const [zipcode, setZipcode] = useState("");
    const [otherInfo, setOtherInfo] = useState("");
    const [shippingAddress, setShippingAddress] = useState("");
    const [shippingCity, setShippingCity] = useState("");
    const [shippingZipcode, setShippingZipcode] = useState("");
    const [shippingOtherInfo, setShippingOtherInfo] = useState("");
    
    const [paying, setPaying] = useState(false);
    const [validated, setValidated] = useState(false);

    const handleSubmit = (event) => {
      
    };
    async function handlePay (e){
        e.preventDefault();
        const form = e.currentTarget;
      if (form.checkValidity() === false) {
        e.preventDefault();
        e.stopPropagation();
      }
  
      setPaying(true);
      setValidated(true);
        if(!stripe || !elements || userCartOjb.count<=0) return;
        setPaying(true);
        const { client_secret } = await fetch(process.env.REACT_APP_APIURL+"/create-payment", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: "Bearer ",
            },
            body: JSON.stringify({ amount: userCartOjb.total*100 }),
        }).then((res) => res.json());
        const { paymentIntent } = await stripe.confirmCardPayment(client_secret, {
            payment_method: {
                card: elements.getElement(CardElement),
            },
        });
        setPaying(false);

        if (paymentIntent) {
            if(user){
            createOrder({ userId: user._id, cart: user.cart, address, country }).then((res) => {
                if (!isLoading && !isError) {
                    setAlertMessage(`Payment ${paymentIntent.status}`);
                    
                    setTimeout(() => {
                         navigate("/orders");
                    }, 3000);
                }
            });}
            else{
                createOrder({ userId: "noUser", cart: cart, address, country }).then((res) => {
                    if (!isLoading && !isError) {
                        setAlertMessage(`Payment ${paymentIntent.status}`);
                        
                        setTimeout(() => {
                             navigate("/thankyou");
                        }, 3000);
                    }
                });}
            }
            
        }
    

  return (
    <Col md={12} className='cart-payment-container'>
        <Form noValidate validated={validated} onSubmit={handlePay}>
            {user && (
            <Row>
                {alertMessage && <Alert>{alertMessage}</Alert>}
                <Col md={7}>
                    <Form.Group className='mb-4'>
                        <Form.Label>Teljes név</Form.Label>
                        <Form.Control type='text' placeholder='First Name' value={user.name} disabled/>
                    </Form.Group>
                </Col>
                <Col md={5}>
                    <Form.Group className='mb-4'>
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
                        <Form.Label>Város</Form.Label>
                        <Form.Control type='text' placeholder='Country' value={city} onChange={(e)=>setCity(e.target.value)} required/>
                    </Form.Group>
                </Col>
            </Row>
            
            <Row className="mb-3">
            <Form.Group as={Col} md="3" controlId="validationCustom01">
              <Form.Label>Irányítószám</Form.Label>
              <Form.Control
                required
                type="text"
                placeholder="First name"
                defaultValue="Mark"
                value={zipcode}
                  onChange={(e)=>setZipcode(e.target.value)}
              />
              <Form.Control.Feedback>Looks good!</Form.Control.Feedback>
            </Form.Group>
            <Form.Group as={Col} md="9" controlId="validationCustomUsername">
              <Form.Label>Egyéb információ</Form.Label>
              <InputGroup hasValidation>
                <InputGroup.Text id="inputGroupPrepend">i</InputGroup.Text>
                <Form.Control
                  type="text"
                  placeholder="Username"
                  aria-describedby="inputGroupPrepend"
                  required
                  value={otherInfo}
                  onChange={(e)=>setOtherInfo(e.target.value)}
                />
                <Form.Control.Feedback type="invalid">
                  Please choose a username.
                </Form.Control.Feedback>
              </InputGroup>
            </Form.Group>
            
          </Row>
          <hr/>
          <Row className="mb-3">
            <Form.Group as={Col} md="6" controlId="validationCustom03">
              <Form.Label>City</Form.Label>
              <Form.Control type="text" placeholder="City" required />
              <Form.Control.Feedback type="invalid">
                Please provide a valid city.
              </Form.Control.Feedback>
            </Form.Group>
            <Form.Group as={Col} md="3" controlId="validationCustom04">
              <Form.Label>Address</Form.Label>
              <Form.Control type="text" placeholder="State" required value={address} onChange={(e)=>setAddress(e.target.value)}/>
              <Form.Control.Feedback type="invalid">
                Please provide a valid address.
              </Form.Control.Feedback>
            </Form.Group>
            <Form.Group as={Col} md="3" controlId="validationCustom05">
              <Form.Label>Zip</Form.Label>
              <Form.Control type="text" placeholder="Zip" required />
              <Form.Control.Feedback type="invalid">
                Please provide a valid zip.
              </Form.Control.Feedback>
            </Form.Group>
          </Row>
          <Form.Group className="mb-3">
            <Form.Check
              required
              label="Agree to terms and conditions"
              feedback="You must agree before submitting."
              feedbackType="invalid"
            />
          </Form.Group>
          
          <h4 htmlFor="card-element">Kártya adatok</h4>
            <CardElement id="card-element" options={appearance}/>
            <Button className='mt-3' type='submit' disabled={cart.count === 0 || paying || isSuccess} onClick={handlePay}>
                {paying ? "Processing..." : "Pay"}
            </Button>
        </Form>
    </Col>
  )
}

export default CheckoutFormNoLogin
