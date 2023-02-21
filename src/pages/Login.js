import { Button } from 'react-bootstrap'
import React from 'react'
import { Col, Container, FormControl, Row, FormGroup,Form,Alert } from 'react-bootstrap'
import { Link } from 'react-router-dom'
import { useState } from 'react'
import { useLoginMutation } from "../services/appApi";

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [login, { isError, isLoading, error }] = useLoginMutation();
    function handleLogin(e){
        e.preventDefault();
        login({email,password});
    }
  return (
    <Container>
        <Row>
            <Col md={6} className="login__form--container">
                <Form style={{width:"100%"}} onSubmit={handleLogin}>
                    <h1>Login to your account</h1>
                    {isError && <Alert variant="danger">{error.data}</Alert>}
                    <FormGroup>
                        <Form.Label>E-mail Address</Form.Label>
                        <FormControl type="email" placeholder="Enter e-mail" value={email} required onChange={(e)=>setEmail(e.target.value)}/>
                    </FormGroup>

                    <FormGroup>
                        <Form.Label>Password</Form.Label>
                        <FormControl type="password" placeholder="Enter password" value={password} required onChange={(e)=>setPassword(e.target.value)}/>
                    </FormGroup>

                    <FormGroup>
                        <Button type="submit" disabled={isLoading}>Login</Button>
                    </FormGroup>
                    <p>Don't have an account? <Link to="/signup">Create account</Link></p>
                </Form>
            </Col>
            <Col md={6} className="login__image--container"></Col>
        </Row>
    </Container>
  )
}

export default Login
