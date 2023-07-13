import React, { useState } from 'react'
import { Alert, Col, Container, Form, Row, Button, FormGroup, FormControl} from 'react-bootstrap';
import { Route, useNavigate,Link } from 'react-router-dom';
import { useCreateProductMutation } from '../services/appApi';
import './NewProduct.css';
import axios from '../axios.js';

const NewProduct = () => {
  const [name,setName] = useState("");
  const [description,setDescription] = useState("");
  const [otherDescription,setOtherDescription] = useState("");
  const [ingredients,setIngredients] = useState("");
  const [sizeAndDuration,setSizeAndDuration] = useState("");
  const [price,setPrice] = useState("");
  const [category,setCategory] = useState("");
  const [images,setImages] = useState([]);
  const [imgToRemove, setImgToRemove] = useState(null);
  const navigate = useNavigate();

  const [createProduct, {isError, error, isLoading, isSuccess}] = useCreateProductMutation();

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
  createProduct({ name, description,otherDescription,ingredients,sizeAndDuration, price, category, images }).then(({ data }) => {
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
                setImages((prev) => [...prev, { url: result.info.url.replace("upload/","upload/w_500,f_auto/"), public_id: result.info.public_id }]);
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
                <h1>Create a product</h1>
                {isSuccess && <Alert variant='success'>Product successfully created</Alert>}
                {isError && <Alert variant="danger">{error.data}</Alert>}
                <FormGroup className= "mb-3">
                    <Form.Label>Termék neve</Form.Label>
                    <FormControl type="text" placeholder="Enter product name" value={name} required onChange={(e)=>setName(e.target.value)}/>
                </FormGroup>
                <FormGroup className= "mb-3">
                    <Form.Label>Termék leírása</Form.Label>
                    <FormControl type="textarea" style={{height: "100px"}} placeholder="Enter product description" value={description} required onChange={(e)=>setDescription(e.target.value)}/>
                </FormGroup>
                <FormGroup className= "mb-3">
                    <Form.Label>Termék egyéb leírása</Form.Label>
                    <FormControl type="textarea" style={{height: "100px"}} placeholder="Enter product description" value={otherDescription} required onChange={(e)=>setOtherDescription(e.target.value)}/>
                </FormGroup>
                <FormGroup className= "mb-3">
                    <Form.Label>Termék összetevők</Form.Label>
                    <FormControl type="textarea" style={{height: "100px"}} placeholder="VESSZŐVEL ELVÁLASZTVA!" value={ingredients} required onChange={(e)=>setIngredients(e.target.value)}/>
                </FormGroup>
                <FormGroup className= "mb-3">
                    <Form.Label>Méret és időtartam</Form.Label>
                    <FormControl rows="3" type="textarea" style={{height: "100px"}} placeholder="méret és időtartam" value={sizeAndDuration} required onChange={(e)=>setSizeAndDuration(e.target.value)}/>
                </FormGroup>
                <FormGroup className= "mb-3">
                    <Form.Label>Termék ára</Form.Label>
                    <FormControl type="number" placeholder="Enter product price" value={price} required onChange={(e)=>setPrice(e.target.value)}/>
                </FormGroup>
                <FormGroup className= "mb-3" onChange={(e)=>setCategory(e.target.value)}>
                    <Form.Label>Kategória</Form.Label>
                    <Form.Select>
                      <option disabled selected>-- VÁLASSZ --</option>
                      <option value="Illatgyertya">Illatgyertya</option>
                      <option value="Wax">Wax</option>
                      <option value="Fürdőbomba">Fürdőbomba</option>
                    </Form.Select>
                </FormGroup>
                <FormGroup className= "mb-3">
                    <Button type="button" onClick={showWidget}>Upload images</Button>
                    <div className='images-preview-container'>                     
                     {
                      images.map((image)=>(
                        <div className='image-preview'>
                          <img src={image.url.replace("upload/","upload/w_500,f_auto/")}/>
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

export default NewProduct
