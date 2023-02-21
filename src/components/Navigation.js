import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import {Navbar, Button} from 'react-bootstrap';
import NavDropdown from 'react-bootstrap/NavDropdown';
import './Navigation.css'
import { LinkContainer } from 'react-router-bootstrap';
import { logout } from '../features/userSlice';
import { useDispatch, useSelector } from 'react-redux';

function Navigation() {
  const user = useSelector((state) => state.user);
  const dispatch = useDispatch();

  function handleLogout(){
    dispatch(logout());
  }

  return (
    <Navbar bg="light" expand="lg">
      <Container>
        <LinkContainer to={'/'}>
            <Navbar.Brand href="#home">EcoMERN</Navbar.Brand>
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
            {/** if user */}
            {user && (
            <NavDropdown title={`${user.email}`} id="basic-nav-dropdown">
              {user.isAdmin &&(
                <>
                <LinkContainer to="/dashboard">
                  <NavDropdown.Item href="#action/3.1">
                  Categories
                  </NavDropdown.Item>
                  </LinkContainer>
                  <LinkContainer to="/new-product">
                  <NavDropdown.Item href="#action/3.1">
                  Categories
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
            </NavDropdown>)}
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}

export default Navigation;