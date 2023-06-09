import axios from '../axios';
import React, { useEffect, useState } from 'react'
import {Col, Container, Row} from 'react-bootstrap'
import { useParams } from 'react-router-dom';
import Loading from '../components/Loading';
import ProductPreview from '../components/ProductPreview';
import './CategoryPage.css'

const CategoryPage = () => {
    const {category} = useParams();
    const [loading, setLoading] = useState(false);
    const [products, setProducts] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(()=>{
        setLoading(true);
        axios.get(`/products/category/${category}`)
        .then(({data})=> {
            setLoading(false);
            setProducts(data);            
        }).catch((e)=>{
            setLoading(false);
        })
    }, [category])

    if(loading){
        <Loading/>
    }

    const productSearch = products.filter((product) => product.name.toLowerCase().includes(searchTerm.toLowerCase())); 



    return (
        <div className='category-page-container'>
            <div className={`pt-3 ${category}-banner-container category-banner-container`}>
                <h1 className='text-center'>{category[0].toUpperCase() + category.slice(1)}</h1>
            </div>
            {productSearch.length>0 &&(
            <div className='filters-container d-flex justify-content-center pt-4 pb-4'>
                <input className='form-control' style={{width:'30%'}} type='search' placeholder='Keresés' onChange={(e)=>setSearchTerm(e.target.value)}/>
            </div>)}
            {productSearch.length === 0 ? <h2>Hamarosan!</h2>:
            <Container>
                <Row>
                    
                    <Col md={{span: 10, offset: 1}}>
                        <div className='d-flex justify-content-center align-items-center flex-wrap'>
                        {productSearch.map(product => (
                            <ProductPreview {...product}/>
                        ))}</div>
                    </Col>
                </Row>
            </Container>}
        </div>
  )
}

export default CategoryPage
