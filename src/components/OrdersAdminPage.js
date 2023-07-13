import axios from '../axios';
import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux';
import Loading from './Loading';
import { Badge, Button, Modal, Table } from 'react-bootstrap';
import Moment from 'moment';

const OrdersAdminPage = () => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(false);
    const products = useSelector(state=>state.products);
    const [orderToShow, setOrderToShow] = useState([]);
    const [show, setShow] = useState(false);

    useEffect(()=>{
        setLoading(true);
        axios.get('orders')
        .then(({data})=>{
            setLoading(false);
            setOrders(data);
        }).catch((e)=>{
            setLoading(false);
        });
    },[]);

    if(loading){
        return <Loading/>
    }

    if(orders.length === 0){
        return <h1 className='text-center pt-4'>No orders yet</h1>
    }

    function markShipped(orderId, ownerId){
        axios
        .patch(`orders/${orderId}/mark-shipped`, {ownerId})
        .then(({data})=>setOrders(data))
        .catch((e) => console.log(e));
    }

    function showOrder(productsObj){
        let productsToShow = products.filter((product) => productsObj[product._id]);
        productsToShow = productsToShow.map((product)=>{
            const productCopy  = {...product};
            productCopy.count = productsObj[product._id];
            delete productCopy.description;
            return productCopy;
        });
        setShow(true);
        setOrderToShow(productsToShow);
    }
    const handleClose = () => setShow(false);

  return (
    <>
        <Table responsive striped bordered hover>
                <thead>
                    <tr>
                        <th>#</th>
                        <th>Ügyfél</th>
                        <th>Termékek</th>
                        <th>Végösszeg</th>
                        <th>Szállítás</th>
                        <th>Fizetés</th>
                        <th>Állapot</th>
                        <th>Dátum</th>
                        <th>Részletek</th>
                        <th>Kupon kód</th>
                    </tr>
                </thead>
                <tbody>
                    {orders.map((order)=> (
                        <tr>
                            <td>MM{order.orderId}</td>
                            <td>{order.owner?.name || order.name}</td>
                            <td>{order.count}</td>
                            <td>{order.total} Ft</td>
                            <td>{order.fullShippingInfo}</td>
                            <td>{order.fullPaymentInfo}</td>
                            <td>
                                {order.status === "processing" ? (<Button onClick={()=>markShipped(order._id, order.owner?._id)}>Mark as shipped</Button>): <Badge bg="success">Shipped</Badge>}
                            </td>
                            <td>{Moment(order.date).format("YYYY. MM. DD.")}</td>
                            <td>
                                <span style={{cursor:'pointer'}} onClick={()=>showOrder(order.products)}>
                                    Részletek <i className='fa fa-eye'></i>
                                </span>
                            </td>
                            <td>{order.discountCode}</td>
                        </tr>
                    ))}
                </tbody>
            </Table>
            <Modal show={show} onHide={handleClose}>
                <Modal.Header closeButton>
                    <Modal.Title>Rendelés részletei</Modal.Title> 
                </Modal.Header>
                {orderToShow.map(order=>(
                    <div className='order-details__container d-flex justify-content-around py-2'>
                        <img src={order.pictures[0].url} style={{maxWidth:100, height:100, objectFit:'cover'}}/>
                        <p>
                            <span>{order.count} x </span> {order.name}
                        </p>
                        <p>Ár: {Number(order.price) * order.count} Ft</p>
                    </div>
                ))}                
                <Modal.Footer>
                    <Button variant='secondary' onClick={handleClose}>Close</Button>        
                </Modal.Footer>
            </Modal>
        </>
  )
}

export default OrdersAdminPage
