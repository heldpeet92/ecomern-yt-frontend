import React, { useState } from "react";
import { Container, Row, Col, Form, Button, Alert } from "react-bootstrap";
import { Link } from "react-router-dom";
import "./Signup.css";
import { useSignupMutation } from "../services/appApi";

function Signup() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [name, setName] = useState("");
    const [address, setAddress] = useState("");
    const [city, setCity] = useState("");
    const [zipcode, setZipcode] = useState("");
    const [otherInfo, setOtherInfo] = useState("");
    const [shippingAddress, setShippingAddress] = useState("");
    const [shippingCity, setShippingCity] = useState("");
    const [shippingZipcode, setShippingZipcode] = useState("");
    const [shippingOtherInfo, setShippingOtherInfo] = useState("");
    
    const [signup, { error, isLoading, isError }] = useSignupMutation();

    function handleSignup(e) {
        e.preventDefault();
        let shippingInfo = {
            shippingAddress: shippingAddress,
            shippingCity: shippingCity,
            shippingZipcode: shippingZipcode,
            shippingOtherInfo: shippingOtherInfo
        };
        let billingInfo = {
            billingAddress: address,
            billingCity: city,
            billingZipcode: zipcode,
            billingOtherInfo: otherInfo
        };

        signup({ name, email, password,billingInfo,shippingInfo });
    }
    
    return (
        <Container>
            <Row>
                <Col md={6} className="signup__form--container">
                    <Form style={{ width: "100%" }} onSubmit={handleSignup}>
                        <h1>Fiók létrehozása</h1>
                        {isError && <Alert variant="danger">{error.data}</Alert>}
                        <Form.Group>
                            <Form.Label>Teljes név</Form.Label>
                            <Form.Control type="text" placeholder="Minta András" value={name} required onChange={(e) => setName(e.target.value)} />
                        </Form.Group>

                        <Form.Group>
                            <Form.Label>E-mail cím</Form.Label>
                            <Form.Control type="email" placeholder="valaki@valami.hu" value={email} required onChange={(e) => setEmail(e.target.value)} />
                        </Form.Group>

                        <Form.Group className="mb-3">
                            <Form.Label>Jelszó</Form.Label>
                            <Form.Control type="password" placeholder="Kívánt jelszó" value={password} required onChange={(e) => setPassword(e.target.value)} />
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
                            <Button type="submit" disabled={isLoading}>
                                Fiók létrehozása
                            </Button>
                        </Form.Group>
                        <p className="pt-3 text-center">
                            Van már fiókod? <Link to="/login">Jelentkezz be itt!</Link>{" "}
                        </p>
                    </Form>
                </Col>
                <Col md={6} className="signup__image--container"></Col>
            </Row>
        </Container>
    );
}

export default Signup;