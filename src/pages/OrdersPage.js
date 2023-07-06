import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import './OrdersPage.css'
import axios from '../axios'
import { Badge, Container, Table } from 'react-bootstrap'
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
        return <h1>No orders yet</h1>
    }

  return (
    <Container>
        <h1 className='text-center'>Your orders</h1>
        <Table responsive striped bordered hover>
            <thead>
                <tr>
                    <th>#</th>
                    <th>Állapot</th>
                    <th>Dátum</th>
                    <th>Összeg</th>
                    <th>FOXPOST automata</th>
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
                    </tr>
                ))}
            </tbody>
        </Table>
    </Container>

  )
}

export default OrdersPage