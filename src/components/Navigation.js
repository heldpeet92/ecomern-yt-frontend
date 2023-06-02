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
  const dispatch = useDispatch();
  const bellRef = useRef(null);
  const notificationRef = useRef(null);
  const [bellPos, setBellPos] = useState({});

  function handleLogout(){
    dispatch(logout());
  }

  const unreadNotifications = user?.notifications.reduce((acc,current)=>{
    if(current.status === 'unread'){
      return acc + 1;
    }
    return acc;
  },0)

  function handleToggleNotifications(){
    const position = bellRef.current.getBoundingClientRect();
    setBellPos(position);
    notificationRef.current.style.display = notificationRef.current.style.display === 'block' ? 'none': 'block';
    dispatch(resetNotifications());
    if(unreadNotifications>1){
    axios.post(`users/${user._id},updateNotifications`);}
  }

  return (
    <Navbar expand="lg" className='mmNavBar'>
      <Container>
        <LinkContainer to={'/'}>
            <Navbar.Brand href="#home" className='mmTitle'><b>MELT ME SHOP</b></Navbar.Brand>
        </LinkContainer>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="ms-auto">
            {/** if no user */}
            {!user && (
                <LinkContainer to="/login">
              <Nav.Link>Login</Nav.Link>
                </LinkContainer>
              )}
              {user && !user.isAdmin && (
                <LinkContainer to="/cart">
                  <Nav.Link>
                    <i className='fas fa-shopping-cart'></i>
                    {user?.cart.count>0 &&(
                      <span className='badge badge-warning' id ="cartcount">                        
                        {user?.cart.count}
                      </span>
                    )}
                  </Nav.Link>
                </LinkContainer>
              )}
            {/** if user */}
            {user && (
              <>
                <Nav.Link style={{position:'relative'}} onClick={handleToggleNotifications}>
                  <i className='fas fa-bell' ref={bellRef} data-count={unreadNotifications || null}></i>
                </Nav.Link>
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
                      Cart
                      </NavDropdown.Item>
                      </LinkContainer>
                      <LinkContainer to="/orders">
                      <NavDropdown.Item href="#action/3.1">
                      My Orders
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
      <div className='notifications-container' style={{position:'absolute', top:bellPos.top + 30, left: bellPos.left}}>
        {user?.notifications.map((noti)=>{
          <p className={`notification-${noti.staus}`}>
            {noti.message}
            <br/>
            <span>{noti.time}</span>
          </p>
        })}
      </div>
    </Navbar>
  );
}

export default Navigation;