import { Button, InputGroup } from 'react-bootstrap'
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
        const copyCartObj = JSON.parse(localStorage.getItem("cart"));
        e.preventDefault();
        login({email,password,copyCartObj});
        if(!!copyCartObj)
        {
           // alert("már van kosár");
        }
    }
  return (
    <Container>
        <Row>
            <Col md={6} className="login__form--container">
                <Form style={{width:"100%"}} onSubmit={handleLogin}>
                    <h1>Bejelentkezés a fiókba</h1>
                    {isError && <Alert variant="danger">{error.data}</Alert>}
                    <FormGroup>
                        <Form.Label>E-mail cím</Form.Label>
                        <InputGroup>
                            <InputGroup.Text><i className='fas fa-user'></i></InputGroup.Text>
                            <FormControl type="email" placeholder="Adja meg e-mail címét" value={email} required onChange={(e)=>setEmail(e.target.value)}/>
                        </InputGroup>
                    </FormGroup>

                    <FormGroup>
                        <Form.Label>Jelszó</Form.Label>
                        <InputGroup>
                        <InputGroup.Text><i className='fas fa-key'></i></InputGroup.Text>
                        <FormControl type="password" placeholder="Adja meg jelszavát" value={password} required onChange={(e)=>setPassword(e.target.value)}/>
                        </InputGroup>
                        
                    </FormGroup>
                    <br/>
                    <FormGroup>
                        <Button type="submit" disabled={isLoading}>Bejelentkezés</Button>
                    </FormGroup>
                    <br/>
                    <p>Nincs még fiókja? <Link to="/signup">Kattintson ide</Link></p>
                </Form>
            </Col>
            <Col md={6} className="login__image--container"></Col>
        </Row>
    </Container>
  )
}

export default Login
