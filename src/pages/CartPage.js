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

      const [sharedState, setSharedState] = useState(userCartOjb.total);
      
    const handleCartChange = (event) => {
    setPageCart(event.target.value);
    };

    useEffect(() => {
    localStorage.setItem('nologincart', JSON.stringify(pageCart));
    }, [pageCart]);
    const storedCartData = localStorage.getItem('nologincart');
    const nologincart = storedCartData ? JSON.parse(storedCartData) : {total: 0, count: 0};


    if(!user){
        userCartOjb = nologincart;
    }

    let cart = products.filter(product => userCartOjb[product._id] != null);
    const [increaseCart] =  useIncreaseCartProductMutation();
    const [decreaseCart] =  useDecreaseCartProductMutation();
    const [removeFromCart, {isLoading}] =  useRemoveFromCartMutation();


    const appearance = {
        theme: 'stripe',
      };
    const options = {
        stripePromise,
        appearance,
      };
    
    const handleDecrease = (e, product) =>{
        if(user){
        const quantity = user.cart[e.productId];
        if(quantity<=0) return null;
        decreaseCart(e);
        }
        else{
            let current = e;
        }
    }
    const handleIncrease = (e, product) =>{
        if(user){
            increaseCart(e);
            
        }
        else{
            let current = e;
            userCartOjb[current._id] +=1;
        }
    }
    const handleRemoveFromCart= (e, product) =>{
        const quantity = user.cart[e.productId];
        if(quantity<=0) return null;
        increaseCart(e);
    }


    return (
        <>
        {user && (
        <Container style={{minHeight: '95vh'}} className='cart-container'>
        <h1 className='pt-2 h3'></h1>
            <Row>
            
            {cart.length >0 &&(
            <Col md={6}>
                
                   <CartComponent setSharedState={setSharedState}/>
                
            </Col>)}
            <Col md={cart.length === 0? 12:6}>
                {cart.length === 0 ? <Alert variant='info'>Az Ön kosara jelenleg üres!</Alert>: <Payment stripePromise={stripePromise} sharedState={sharedState}/>
                }
            </Col>
            </Row>
        </Container>)}
        {!user && (
        <Container style={{minHeight: '95vh'}} className='cart-container'>
        <h1 className='pt-2 h3'>Kosár</h1>
            <Row>
                <Col md={pageCart.length === 0? 12:7}>
                {pageCart.length === 0 ? <Alert variant='info'>Az Ön kosara jelenleg üres!</Alert>:<Payment/>
                }
            </Col>
            {pageCart.count >0 &&(
            <Col md={5}>
                
                    <>
                        <Table responsive="sm" className='cart-table'>
                            <thead>
                                <tr>
                                    <th>&nbsp;</th>
                                    <th>Product</th>
                                    <th>Price</th>
                                    <th>Quantity</th>
                                    <th>Subtotal</th>
                                </tr>
                            </thead>
                            <tbody>
                                {/**loop  */}
                                {cart.map(item=>(
                                    <tr>
                                        <td>&nbsp;</td>
                                        <td>
                                            {!isLoading &&<i className='fa fa-times' style={{marginRight: 10, cursor: "pointer"}} onClick={()=> removeFromCart({productId: item._id, price: item.price,userId: user?._id})}></i>}
                                            {/* <img src={item.pictures[0].url} style={{width:100, height:100, objectFit: 'cover'}}/> */}
                                            {item.name}
                                        </td>
                                        <td>{item.price} Ft</td>
                                        <td>
                                            <span className='quantity-indicator'>
                                                <i className='fa fa-minus-circle' style={{marginRight: 10}} onClick={()=>handleCartChange({productId: item._id, price: item.price,userId: user?._id})}></i>
                                                <span>{pageCart[item._id]}</span>
                                                <i className='fa fa-plus-circle' style={{marginLeft: 10}} onClick={()=>handleCartChange({productId: item._id, price: item.price, userId: user?._id})}></i>
                                            </span>    
                                        </td>
                                        <td>{item.price*pageCart[item._id]}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </Table>
                        <div>
                            <h3 className='h4 pt-4'>Összesen {pageCart.total} Ft</h3>
                        </div>
                    </>
                
            </Col>)}
            </Row>
        </Container>)}
        </>
  )
}

export default CartPage
