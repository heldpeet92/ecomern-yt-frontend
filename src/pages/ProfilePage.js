import React, { useState } from "react";
import { useDispatch, useSelector } from 'react-redux';
import { Container, Row, Col, Form, Button, Alert } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import { useEditUserMutation } from "../services/appApi";
import { updateUser } from '../features/userSlice'

const ProfilePage = () => {
    const dispatch = useDispatch();
    const user = useSelector(state=>state.user);
    const [editUser, {isError, error, isLoading, isSuccess}] = useEditUserMutation();
    const navigate = useNavigate();
    const [email, setEmail] = useState(user.email);
    const [name, setName] = useState(user.name);
    const [address, setAddress] = useState(user.address);
    const [city, setCity] = useState(user.city);
    const [zipcode, setZipcode] = useState(user.zipcode);
    const [otherInfo, setOtherInfo] = useState(user.otherInfo);
    const [shippingAddress, setShippingAddress] = useState(user.shippingAddress);
    const [shippingCity, setShippingCity] = useState(user.shippingCity);
    const [shippingZipcode, setShippingZipcode] = useState(user.shippingZipcode);
    const [shippingOtherInfo, setShippingOtherInfo] = useState(user.shippingOtherInfo);
    const [edited, setEdited] = useState(false);

    function handleEdit(e) {
        e.preventDefault();        

        let user_id = user._id;
        
        setEdited(true);

        editUser({id:user_id, name, email, address, city, zipcode,addressOther: otherInfo,shippingAddress,shippingCity,shippingZipcode,shippingAddressOther: shippingOtherInfo})
        .then(({data}) => {
            dispatch(updateUser(data[0]));
            setEdited(false)
            setTimeout(() => {
                navigate("/profile");
              }, 3000);
            
        })
        
    }

  return (
    <Container>
            <Row>
                <Col md={6} className="signup__form--container">
                    <Form style={{ width: "100%" }} onSubmit={handleEdit}>
                        <h1>Fiók adatok</h1>
                        {isError && <Alert variant="danger">{error.data}</Alert>}
                        <Form.Group>
                            <Form.Label>Teljes név</Form.Label>
                            <Form.Control type="text" placeholder="Minta András" value={name} required onChange={(e) => setName(e.target.value)} readOnly disabled/>
                        </Form.Group>

                        <Form.Group>
                            <Form.Label>E-mail cím</Form.Label>
                            <Form.Control type="email" placeholder="valaki@valami.hu" value={email} required onChange={(e) => setEmail(e.target.value)} readOnly disabled />
                        </Form.Group>

                        <hr/>

                        <h4>Számlázási adatok</h4>
                        <Form.Group>
                            <Form.Label>Számlázási cím</Form.Label>
                            <Form.Control type="text" placeholder="Fő utca 1." value={address} required onChange={(e) => setAddress(e.target.value)} />
                        </Form.Group>
                        <Row>
                            <Col md={6}>
                                <Form.Group>
                                    <Form.Label>Város</Form.Label>
                                    <Form.Control type="text" placeholder="Budapest" value={city} required onChange={(e) => setCity(e.target.value)} />
                                </Form.Group>
                            </Col>
                            <Col md={6}>
                                <Form.Group className="mb-3">
                                    <Form.Label>Irányítószám</Form.Label>
                                    <Form.Control type="text" placeholder="1234" value={zipcode} required onChange={(e) => setZipcode(e.target.value)} />
                                </Form.Group>
                            </Col>
                        </Row>
                        <Form.Group className="mb-3">
                                    <Form.Label>Egyéb</Form.Label>
                                    <Form.Control type="text" placeholder="pl. 3. emelet 12." value={otherInfo} onChange={(e) => setOtherInfo(e.target.value)} />
                                </Form.Group>
                                <hr/>

                        <h4>Szállítási adatok</h4>
                        <Form.Group>
                            <Form.Label>Szállítási cím</Form.Label>
                            <Form.Control type="text" placeholder="Fő utca 1." value={shippingAddress} required onChange={(e) => setShippingAddress(e.target.value)} />
                        </Form.Group>
                        <Row>
                            <Col md={6}>
                                <Form.Group>
                                    <Form.Label>Város</Form.Label>
                                    <Form.Control type="text" placeholder="Budapest" value={shippingCity} required onChange={(e) => setShippingCity(e.target.value)} />
                                </Form.Group>
                            </Col>
                            <Col md={6}>
                                <Form.Group className="mb-3">
                                    <Form.Label>Irányítószám</Form.Label>
                                    <Form.Control type="text" placeholder="1234" value={shippingZipcode} required onChange={(e) => setShippingZipcode(e.target.value)} />
                                </Form.Group>
                            </Col>
                        </Row>
                        <Form.Group className="mb-3">
                                    <Form.Label>Egyéb</Form.Label>
                                    <Form.Control type="text" placeholder="pl. 3. emelet 12." value={shippingOtherInfo} onChange={(e) => setShippingOtherInfo(e.target.value)} />
                                </Form.Group>
                        <Form.Group>
                            <Button type="submit" disabled={edited}>
                                {edited ? "Folyamatban..." : "Mentés"}
                            </Button>
                        </Form.Group>
                    </Form>
                </Col>
                <Col md={6} className="signup__image--container"></Col>
            </Row>
        </Container>
  )
}

export default ProfilePage