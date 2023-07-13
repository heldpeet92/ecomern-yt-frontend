import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import {Navbar, Button} from 'react-bootstrap';
import NavDropdown from 'react-bootstrap/NavDropdown';
import './Navigation.css'
import { LinkContainer } from 'react-router-bootstrap';
import { logout, resetNotifications } from '../features/userSlice';
import { useDispatch, useSelector } from 'react-redux';
import CartPage from '../pages/CartPage';
import { useRef, useState } from 'react';
import axios from '../axios';

function Navigation() {
  const user = useSelector((state) => state.user);
  const nologincart = useSelector((state) => state.nologincart);
  const dispatch = useDispatch();
  const bellRef = useRef(null);
  const notificationRef = useRef(null);
  const [bellPos, setBellPos] = useState({});

  let userCartOjb = user?.cart;
    
  const storedCartData = localStorage.getItem('nologincart');
  //const nologincart = storedCartData ? JSON.parse(storedCartData) : {total: 0, count: 0};

  
  if(!user){
      userCartOjb = nologincart;
  }

  function handleLogout(){
    dispatch(logout());
  }

  function handleToggleNotifications(){
    const position = bellRef.current.getBoundingClientRect();
    setBellPos(position);
    notificationRef.current.style.display = notificationRef.current.style.display === 'block' ? 'none': 'block';
    dispatch(resetNotifications());
  }

  return (
    <Navbar expand="lg" className='mmNavBar'>
      <Container>
        <LinkContainer to={'/'}>
            <Navbar.Brand href="#home" className='mmTitle'><b>MELT ME </b></Navbar.Brand>
        </LinkContainer>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="ms-auto">
            {/** if no user */}
            {!user && (
                <LinkContainer to="/login">
              <Nav.Link>Bejelentkezés</Nav.Link>
                </LinkContainer>
              )}
              {(
                <LinkContainer to="/cart">
                  <Nav.Link>
                    <i className='fas fa-shopping-cart'></i>
                    {userCartOjb?.count>0 &&(
                      <span className='badge badge-warning' id ="cartcount">                        
                        {userCartOjb?.count}
                      </span>
                    )}
                  </Nav.Link>
                </LinkContainer>
              )}
            {/** if user */}
            {user && (
              <>
                <NavDropdown title={`${user.email}${user.isAdmin? ' (Admin)' : ''}`} id="basic-nav-dropdown">
                  {user.isAdmin &&(
                    <>
                    <LinkContainer to="/admin">
                      <NavDropdown.Item href="#action/3.1">
                      Dashboard
                      </NavDropdown.Item>
                      </LinkContainer>
                      <LinkContainer to="/new-product">
                      <NavDropdown.Item href="#action/3.1">
                      New Product
                      </NavDropdown.Item>
                      </LinkContainer>
                    </>
                  )}
                  {!user.isAdmin &&(
                    <>
                    <LinkContainer to="/cart">
                      <NavDropdown.Item href="#action/3.1">
                      Kosaram
                      </NavDropdown.Item>
                      </LinkContainer>
                      <LinkContainer to="/orders">
                      <NavDropdown.Item href="#action/3.1">
                      Rendeléseim
                      </NavDropdown.Item>
                      </LinkContainer>
                      <LinkContainer to="/profile">
                      <NavDropdown.Item href="#action/3.1">
                      Profilom
                      </NavDropdown.Item>
                      </LinkContainer>
                    </>
                  )}
                  <Button variant='danger' onClick={handleLogout} className="logout-btn">Logout</Button>
                  {/* <NavDropdown.Item href="#action/3.4">
                    Sign out
                  </NavDropdown.Item> */}
                </NavDropdown>
            </>)}
          </Nav>
        </Navbar.Collapse>
      </Container>
      {/**Notifications */}
      {/* <div className='notifications-container' style={{position:'absolute', top:bellPos.top + 30, left: bellPos.left}}>
        {user?.notifications.map((noti)=>{
          <p className={`notification-${noti.staus}`}>
            {noti.message}
            <br/>
            <span>{noti.time}</span>
          </p>
        })}
      </div> */}
    </Navbar>
  );
}

export default Navigation;