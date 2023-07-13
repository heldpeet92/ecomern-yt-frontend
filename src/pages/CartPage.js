import { Elements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import React, { useState, useEffect } from 'react'
import { Alert, Col, Container, Row, Table } from 'react-bootstrap';
import { useSelector } from 'react-redux'
import CheckoutForm from '../components/CheckoutForm';
import { useDecreaseCartProductMutation, useIncreaseCartProductMutation, useRemoveFromCartMutation } from '../services/appApi';
import './CartPage.css'
import Payment from '../components/Payment';
import CartComponent from '../components/CartComponent';


const CartPage = () => {
    const [ stripePromise, setStripePromise ] = useState(null);
    const [ shippingMethod, setShippingMethod ] = useState('');
    const [ currentPaymentMode, setCurrentPaymentMode ] = useState('');
    const [cartPayMethod, setCartPayMethod] = useState('');
    const nologincart = useSelector((state) => state.nologincart);
    useEffect(() => {
        fetch(process.env.REACT_APP_APIURL+"/config").then(async (r) => {
        const { publishableKey } = await r.json();
        setStripePromise(loadStripe(publishableKey));
        });
    }, []);
    const user = useSelector(state => state.user);
    const products = useSelector(state => state.products);
    let userCartOjb = user?.cart;
    const [pageCart, setPageCart] = useState(() => {
        const storedValue = localStorage.getItem('nologincart');
        return storedValue ? JSON.parse(storedValue) : {total: 0, count: 0} ;
      });

      const [discountCode, setDiscountCode] = useState('');
      const [cartDiscount, setCartDiscount] = useState(1.0);
      
    const handleCartChange = (event) => {
    setPageCart(event.target.value);
    };

    useEffect(() => {
    localStorage.setItem('nologincart', JSON.stringify(pageCart));
    }, [pageCart]);
    const storedCartData = localStorage.getItem('nologincart');
    //const nologincart = storedCartData ? JSON.parse(storedCartData) : {total: 0, count: 0};

    if(!user){
        userCartOjb = pageCart;
      }

      if(!user){
        userCartOjb = nologincart;
    }
      const [sharedState, setSharedState] = useState(userCartOjb.total);

    let cart = products.filter(product => userCartOjb[product._id] != null);

    const appearance = {
        theme: 'stripe',
      };
    const options = {
        stripePromise,
        appearance,
      };

      useEffect(()=>{
        setCartPayMethod(cartPayMethod);
      },[currentPaymentMode])

    return (
        <>
        {(
        <Container style={{minHeight: '95vh'}} className='cart-container'>
        <h1 className='pt-2 h3'></h1>
            <Row>
            
            {cart.length >0 &&(
            <Col md={6}>
                
                   <CartComponent setSharedState={setSharedState} shippingMethod={shippingMethod} setDiscountCode={setDiscountCode} currentPaymentMode={currentPaymentMode}/>
                
            </Col>)}
            <Col md={cart.length === 0? 12:6}>
                {cart.length === 0 ? <Alert variant='info'>Az Ön kosara jelenleg üres!</Alert>: <Payment stripePromise={stripePromise} sharedState={sharedState} selectedDiscount={discountCode} setShippingMethod={setShippingMethod} setCurrentPaymentMode={setCurrentPaymentMode} cartPayMethod={cartPayMethod}/>
                }
            </Col>
            </Row>
        </Container>)}      
        </>
  )
}

export default CartPage
