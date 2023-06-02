import React, { useEffect, useState } from 'react'
import { Alert, Col, Container, Form, Row, Button, FormGroup, FormControl} from 'react-bootstrap';
import { Route, useNavigate,Link, useParams } from 'react-router-dom';
import { useCreateProductMutation, useUpdateProductMutation } from '../services/appApi';
import './EditProductPage.css';
import axios from '../axios.js';

const EditProductPage = () => {
  const {id} = useParams();
  const [name,setName] = useState("");
  const [description,setDescription] = useState("");
  const [price,setPrice] = useState("");
  const [category,setCategory] = useState("");
  const [images,setImages] = useState([]);
  const [imgToRemove, setImgToRemove] = useState(null);
  const navigate = useNavigate();

  const [updateProduct, {isError, error, isLoading, isSuccess}] = useUpdateProductMutation();

  useEffect(()=>{
    axios.get('/products/'+ id)
      .then(({data})=>{
        const product = data.product;
        setName(product.name);
        setCategory(product.category);
        setDescription(product.description);
        setImages(product.pictures);
        setPrice(product.price);
      }).catch((e)=>console.log(e));
  }, [id]);

  function handleRemoveImg(imgObj) {
    setImgToRemove(imgObj.public_id);
    axios
        .delete(`/images/${imgObj.public_id}/`)
        .then((res) => {
            setImgToRemove(null);
            setImages((prev) => prev.filter((img) => img.public_id !== imgObj.public_id));
        })
        .catch((e) => console.log(e));
}

function handleSubmit(e) {
  e.preventDefault();
  if (!name || !description || !price || !category || !images.length) {
      return alert("Please fill out all the fields");
  }
  updateProduct({ id, name, description, price, category, images }).then(({ data }) => {
      if (data.length > 0) {
          setTimeout(() => {
              navigate("/");
          }, 1500);
      }
  });
}

  function showWidget() {
    const widget = window.cloudinary.createUploadWidget(
        {
            cloudName: "djumsmr1d",
            uploadPreset: "qvslwk6y",
        },
        (error, result) => {
            if (!error && result.event === "success") {
                setImages((prev) => [...prev, { url: result.info.url, public_id: result.info.public_id }]);
            }
        }
    );
    widget.open();
}

  return (
    <Container>
      <Row className='mt-4'>
        <Col md={6} className="new-product__form--container">
        <Form style={{width:"100%"}} onSubmit={handleSubmit}>
                <h1>Edit product</h1>
                {isSuccess && <Alert variant='success'>Product successfully updated</Alert>}
                {isError && <Alert variant="danger">{error.data}</Alert>}
                <FormGroup className= "mb-3">
                    <Form.Label>Product name</Form.Label>
                    <FormControl type="text" placeholder="Enter product name" value={name} required onChange={(e)=>setName(e.target.value)}/>
                </FormGroup>
                <FormGroup className= "mb-3">
                    <Form.Label>Product description</Form.Label>
                    <FormControl type="textarea" style={{height: "100px"}} placeholder="Enter product description" value={description} required onChange={(e)=>setDescription(e.target.value)}/>
                </FormGroup>
                <FormGroup className= "mb-3">
                    <Form.Label>Product price</Form.Label>
                    <FormControl type="number" placeholder="Enter product price" value={price} required onChange={(e)=>setPrice(e.target.value)}/>
                </FormGroup>
                <FormGroup className= "mb-3" onChange={(e)=>setCategory(e.target.value)}>
                    <Form.Label>Category</Form.Label>
                    <Form.Select value={category} >
                      <option disabled selected>-- SELECT CATEGORY --</option>
                      <option value="technology">technology</option>
                      <option value="tablets">tablets</option>
                      <option value="phones">phones</option>
                      <option value="laptops">laptops</option>
                    </Form.Select>
                </FormGroup>
                <FormGroup className= "mb-3">
                    <Button type="button" onClick={showWidget}>Upload images</Button>
                    <div className='images-preview-container'>                     
                     {
                      images.map((image)=>(
                        <div className='image-preview'>
                          <img src={image.url}/>
                          <i className='fa fa-times-circle' onClick={()=>handleRemoveImg(image)}></i>
                        </div>
                      ))
                     }
                     
                    </div>
                </FormGroup>
                
                <FormGroup>
                    <Button type="submit" disabled={isLoading ||isSuccess}>Create Product</Button>
                </FormGroup>
            </Form>
        </Col>
        <Col md={6} className="new-product__image--container">
        </Col>
      </Row>
    </Container>
  )
}

export default EditProductPage
