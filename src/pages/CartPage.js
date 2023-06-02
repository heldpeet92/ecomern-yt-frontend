import { Elements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import React from 'react'
import { Alert, Col, Container, Row, Table } from 'react-bootstrap';
import { useSelector } from 'react-redux'
import CheckoutForm from '../components/CheckoutForm';
import RNCheckoutForm from '../components/RNCheckoutForm';
import TheCheckoutForm from '../components/TheCheckoutForm';
import { useDecreaseCartProductMutation, useIncreaseCartProductMutation, useRemoveFromCartMutation } from '../services/appApi';
import './CartPage.css'

const stripePromise = loadStripe('pk_test_51MimFGB2e5xgON9caX5qFp0Qjh3sJASr0sqbhKGajooaqfjgu6c6CyiokIq6ceWPEGJOCjNmI5GaFkSHPXRnaY3X00UKJfYMyF');

const CartPage = () => {
    const user = useSelector(state => state.user);
    const products = useSelector(state => state.products);
    const userCartOjb = user.cart;
    const count = 3;
    let cart = products.filter(product => userCartOjb[product._id] != null);
    const [increaseCart] =  useIncreaseCartProductMutation();
    const [decreaseCart] =  useDecreaseCartProductMutation();
    const [removeFromCart, {isLoading}] =  useRemoveFromCartMutation();

    const stripeOptions ={
        theme: 'stripe'
    }

    const handleDecrease = (e, product) =>{
        console.log(e);
        const quantity = user.cart[e.productId];
        if(quantity<=0) return null;
        decreaseCart(e);
    }


    return (
        <Container style={{minHeight: '95vh'}} className='cart-container'>
        <h1 className='pt-2 h3'>Kosár</h1>
            <Row>
                <Col md={cart.length === 0? 12:7}>
                {cart.length === 0 ? <Alert variant='info'>Az Ön kosara jelenleg üres!</Alert>:<Elements stripe={stripePromise} options={stripeOptions}><CheckoutForm /></Elements>
                }
            </Col>
            {cart.length >0 &&(
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
                                            {!isLoading &&<i className='fa fa-times' style={{marginRight: 10, cursor: "pointer"}} onClick={()=> removeFromCart({productId: item._id, price: item.price,userId: user._id})}></i>}
                                            <img src={item.pictures[0].url} style={{width:100, height:100, objectFit: 'cover'}}/>
                                            {item.name}
                                        </td>
                                        <td>${item.price}</td>
                                        <td>
                                            <span className='quantity-indicator'>
                                                <i className='fa fa-minus-circle' style={{marginRight: 10}} onClick={()=>handleDecrease({productId: item._id, price: item.price,userId: user._id})}></i>
                                                <span>{user.cart[item._id]}</span>
                                                <i className='fa fa-plus-circle' style={{marginLeft: 10}} onClick={()=>increaseCart({productId: item._id, price: item.price, userId: user._id})}></i>
                                            </span>    
                                        </td>
                                        <td>{item.price*user.cart[item._id]}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </Table>
                        <div>
                            <h3 className='h4 pt-4'>Total ${user.cart.total}</h3>
                        </div>
                    </>
                
            </Col>)}
            </Row>
            <TheCheckoutForm></TheCheckoutForm>
        </Container>
  )
}

export default CartPage
