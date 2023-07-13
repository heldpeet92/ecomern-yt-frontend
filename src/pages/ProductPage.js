import axios from '../axios';
import React, {useState, useEffect, useRef} from 'react'
import AliceCarousel from 'react-alice-carousel';
import { Badge, ButtonGroup, Col, Container, Row, Button, Form, FormControl } from 'react-bootstrap';
import { useSelector, useDispatch } from 'react-redux';
import {  useParams } from 'react-router-dom'
import Loading from '../components/Loading';
import SimilarProduct from '../components/SimilarProduct';
import "react-alice-carousel/lib/alice-carousel.css";
import './ProductPage.css'
import { LinkContainer } from 'react-router-bootstrap';
import { useAddToCartMutation } from '../services/appApi';
import ToastMessage from '../components/ToastMessage';
import { toast, ToastContainer } from 'react-toastify';
import "react-toastify/dist/ReactToastify.css";
import { addtonologincart } from '../features/nologincartSlice';

const ProductPage = () => {
    const { id } = useParams();
    const dispatch = useDispatch();
    const user = useSelector((state) => state.user);
    const [product, setProduct] = useState(null);
    const [productIngs, setProductIngs] = useState([]);
    const [similar, setSimilar] = useState(null);
    const [addToCart, {isSuccess}] = useAddToCartMutation();
    const quantityRef = useRef();

    const [productQuantity, setproductQuantity] = useState(1);

    const [nologinSuccess, setNologinSuccess] = useState(false);
  
    const verifyQuantity = () =>{
        if (productQuantity<1){
            setproductQuantity(1);
        }
    }

    const handleProductQuantityChange = (event) => {
      setproductQuantity(event.target.value);
    };

    const notify = () => {
        toast("Default Notification !");
  
        toast.success("Success Notification !", {
          position: toast.POSITION.TOP_CENTER
        });
  
        toast.error("Error Notification !", {
          position: toast.POSITION.TOP_LEFT
        });
  
        toast.warn("Warning Notification !", {
          position: toast.POSITION.BOTTOM_LEFT
        });
  
        toast.info("Info Notification !", {
          position: toast.POSITION.BOTTOM_CENTER
        });
  
        toast("Custom Style Notification with css class!", {
          position: toast.POSITION.BOTTOM_RIGHT,
          className: 'foo-bar'
        });
      };
    
    const handleDragStart = (e) => e.preventDefault();
    useEffect(() => {
        axios.get(`/products/${id}`).then(({ data }) => {
            setProduct(data.product);
            setSimilar(data.similar);
            setProductIngs(data.product.ingredients.split(";"));
        });
    }, [id]);

    if (!product) {
        return <Loading />;
    }
    const responsive = {
        0: { items: 1 },
        568: { items: 2 },
        1024: { items: 3 },
    };

    const images = product.pictures.map((picture) => <img alt='should have been here' className="product__carousel--image" src={picture.url} onDragStart={handleDragStart} />);

    let similarProducts = [];
    if (similar) {
        similarProducts = similar.map((product, idx) => (
            <div className="item" data-value={idx}>
                <SimilarProduct {...product} />
            </div>
        ));
    }

    const handleAddToCart = (props) =>{

        if(!!user){
            addToCart({ userId: props.userId, productId: props.productId, price: props.price, image: props.image, quantity: Number(productQuantity) })
        }
        else{
            let prodId = props.productId;
            let quantity = Number(productQuantity);
            let price = Number(props.price);
            dispatch(addtonologincart({prodId,quantity,price}));
            //user.cart = userCart;
            setNologinSuccess(true);
        }
        
    }

  return (
    <Container className='pt-4' style={{position: 'relative'}}>
        <Row>
            <Col lg={6}>
                <AliceCarousel mouseTracking items={images} controlsStrategy='alternate' keyboardNavigation='true'/>
            </Col>
            <Col lg={6} className='pt-4'>
                <h1>{product.name}</h1>
                <p>
                        <LinkContainer to={`/category/${product.category}`} style={{cursor:'pointer'}}>
                            <Badge bg='primary'>{product.category}</Badge>
                        </LinkContainer>
                   
                </p>
                <p className='product__price'>{product.price} Ft</p>
                <p style={{textAlign: 'justify'}} className='py-3'>
                    <strong>Leírás:</strong> {product.description}
                </p>
                <div style={{textAlign: 'justify'}} className='py-3'>
                    <strong>Összetevők: </strong> 
                    <ul>
                    {productIngs.map((item,i) => 
                        <li key={i}>- {item}</li>
                    )}
                    </ul>
                </div>
                <p style={{textAlign: 'justify'}} className='py-3'>
                    <strong>Egyéb információ:</strong> {product.otherDescription}
                </p>
                <p style={{textAlign: 'justify'}} className='py-3'>
                    <strong>Súly és időtartam:</strong> {product.sizeAndDuration}
                </p>
                {user && !user.isAdmin && (
                        <ButtonGroup style={{ width: "30%" }}>
                           <FormControl
                                type="number"
                                value={productQuantity}
                                onChange={handleProductQuantityChange}
                            />
                            <Button size="lg" 
                            onClick={() => handleAddToCart({ userId: user._id, productId: id, price: product.price, image: product.pictures[0].url.replace("upload/","upload/w_500,f_auto/") })}
                            >
                                Kosárba
                            </Button>
                        </ButtonGroup>
                )}
                {!user && (
                        <ButtonGroup style={{ width: "30%" }}>
                            <FormControl
                                type="number"
                                min="1"
                                onKeyUp={verifyQuantity}
                                value={productQuantity}
                                onChange={handleProductQuantityChange}
                            />
                            <Button size="sm" 
                            onClick={() => handleAddToCart({ userId: null, productId: id, price: product.price, image: product.pictures[0].url.replace("upload/","upload/w_500,f_auto/") })}
                            >
                                Kosárba
                            </Button>
                        </ButtonGroup>
                )}
                {/* {!user && (
                        <ButtonGroup style={{ width: "90%" }}>
                            <Form.Select size="lg" style={{ width: "40%", borderRadius: "0" }} ref={quantityRef}>
                                <option value="1">1</option>
                                <option value="2">2</option>
                                <option value="3">3</option>
                                <option value="4">4</option>
                                <option value="5">5</option>
                            </Form.Select>
                            <Button size="sm" 
                            onClick={() => handleAddToCart({ userId: null, productId: id, price: product.price, image: product.pictures[0].url })}
                            >
                                Kosárba
                            </Button>
                        </ButtonGroup>
                )} */}
                {/* {(isSuccess || nologinSuccess) && <ToastMessage type={'success'} item={product.name} bg='info' title='Added to cart' body={`${product.name} a kosárba került.`}/>} */}
                
                {user && user.isAdmin &&
                    (
                        <LinkContainer to={`/product/${product._id}/edit`}>
                            <Button size='lg'>Szerkesztés</Button>
                        </LinkContainer>
                    )
                }
            </Col>
        </Row>
        <div className='my-4'>
            <h2>Ez is érdekelhet!</h2>
            <div className='d-flex justify-content-center align-items-center flex-wrap'>
                <AliceCarousel mouseTracking items={similarProducts} responsive={responsive} controlsStrategy="alternate"/>
            </div>
        </div>
    </Container>
  )
}

export default ProductPage
