import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import './OrdersPage.css'
import axios from '../axios'
import { Badge, Container, Table,Modal,Button } from 'react-bootstrap'
import Loading from '../components/Loading'
import Moment from 'moment'

const OrdersPage = () => {
    const user = useSelector(state => state.user);
    const products = useSelector(state => state.products);
    const [orders,setOrders] = useState([]);
    const [loading, setLoading] = useState(false);
    const [orderToShow, setOrderToShow] = useState([]);
    const [show, setShow] = useState(false);

    useEffect(()=>{
        setLoading(true);
        setTimeout(() => {
            console.log("loading")
        }, 3000);
        axios.get(`/users/${user._id}/orders`)
        .then(({data})=>{
            setLoading(false);
            setOrders(data);
        })
        .catch((e)=>{
            setLoading(false);
            console.log(e);
        });
    }, []);

    if(loading){
        return <Loading/>;
    }

    if(orders.length === 0){
        return <h1>Még nem rendeltél semmit!</h1>
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
    <Container>
        <h1 className='text-center'>Rendeléseid</h1>
        <Table responsive striped bordered hover>
            <thead>
                <tr>
                    <th>#</th>
                    <th>Állapot</th>
                    <th>Dátum</th>
                    <th>Összeg</th>
                    <th>Szállítás</th>
                    <th>Részletek</th>
                </tr>
            </thead>
            <tbody>
                {orders.map((order)=> (
                    <tr>
                        <td>MM{order.orderId}</td>
                        <td><Badge bg={`${order.status === "processing"?"warning":"success"}`} text="white">{order.status}</Badge></td>
                        <td>{Moment(order.date).format("YYYY. MM. DD.")}</td>
                        <td>{order.total} Ft</td>
                        <td>{order.selectedMachineInfo}</td>
                        <td>
                                <span style={{cursor:'pointer'}} onClick={()=>showOrder(order.products)}>
                                    Részletek <i className='fa fa-eye'></i>
                                </span>
                            </td>
                    </tr>
                ))}
            </tbody>
        </Table>
        <Modal show={show} onHide={handleClose}>
                <Modal.Header closeButton>
                    <Modal.Title>Rendelés részletei</Modal.Title> 
                </Modal.Header>
                {orderToShow.map(order=>(
                    <>
                    <div className='order-details__container d-flex justify-content-around py-2'>
                        {/* <img src={order.pictures[0].url} style={{maxWidth:100, height:100, objectFit:'cover'}}/> */}
                        <p>
                            <span>{order.count} x </span> {order.name}
                        </p>
                        <p>Ár: {Number(order.price)* (order.discountCode!==''? 0.9 : 1) * order.count} Ft</p>
                        <p>{order.discountCode!==''? (<span>10% kedvezmény!</span>): <span></span>}</p>
                       
                    </div>
                    
                    </>
                ))}
                <Modal.Footer>
                    <Button variant='secondary' onClick={handleClose}>Close</Button>        
                </Modal.Footer>
            </Modal>
    </Container>

  )
}

export default OrdersPage