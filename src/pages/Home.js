import React, { useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Row, Col } from 'react-bootstrap'
import categories from '../categories'
import { LinkContainer } from 'react-router-bootstrap'
import './Home.css'
import "slick-carousel/slick/slick.css"; 
import "slick-carousel/slick/slick-theme.css";
import SimpleSlider from '../components/SimpleSlider'
import axios from '../axios'
import { useDispatch, useSelector } from 'react-redux'
import { updateProducts } from '../features/productSlice'
import ProductPreview from '../components/ProductPreview'

const Home = () => {

    const dispatch = useDispatch();
    const products = useSelector(state=>state.products);
    const lastProducts = products.slice(0,5);

    //here we update the section where we render the product cards
    useEffect(()=>{
        axios.get('/products').then(({data}) => dispatch(updateProducts(data)))
    }, []);          

  return (
    <div>
        <img src='https://res.cloudinary.com/djumsmr1d/image/upload/v1685376183/M-8_bvrzrb.png'/>
        <SimpleSlider/>
      <img className='home-banner' src="https://res.cloudinary.com/learn-code-10/image/upload/v1653947013/yqajnhqf7usk56zkwqi5.png" alt=''/>
        <div className='featured-products-container container mt-4'>
            <h2>Last Petis</h2>
            <div className='d-flex justify-content-center flex-wrap'>
            {lastProducts.map((product) =>(
                <ProductPreview {...product}/>
            ))}
            </div>
        </div>
        <div className='featured-products-container container mt-4'>
            <Link to="/category/all" style={{textAlign: 'right', display: 'block', textDecoration: 'none'}}>
                See more {">>"}
            </Link>
        </div>
        <div className='sale__banner--container mt-4'>
            {/*sale banner*/}
            <img src='https://res.cloudinary.com/learn-code-10/image/upload/v1654093280/xkia6f13xxlk5xvvb5ed.png'/>
        </div>
        <div className='recent-products-container container mt-4'>
            <h2>Categories</h2>
            <Row>
                {categories.map((category)=>(
                    <LinkContainer to={`/category/${category.name.toLocaleLowerCase()}`}>
                    <Col md={4}>
                        <div style={{ backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.5)), url(${category.img})`, gap: "10px" }} className="category-tile">
                            {category.name}
                        </div>
                    </Col>
                </LinkContainer>
                ))}
            </Row>
        </div>
        <div>
            <Row>
                <Col md={6} style={{height: 400}}>

                </Col>
                <Col md={6} style={{height: 400}}>
                    <table>
                        <tr>
                            <td>Cím:</td>
                            <td>2314 Halásztelek, Akácos utca 30/1</td>
                        </tr>
                    </table>
                </Col>
            </Row>
        </div>

    </div>
  )
}

export default Home
