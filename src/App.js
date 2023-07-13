import logo from './logo.svg';
import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Navigation from './components/Navigation';
import Home from './pages/Home';
import Login from './pages/Login';
import Signup from './pages/Signup';
import { useDispatch, useSelector } from 'react-redux';
import NewProduct from './pages/NewProduct';
import ProductPage from './pages/ProductPage';
import CategoryPage from './pages/CategoryPage';
import ScrollToTop from './components/ScrollToTop';
import CartPage from './pages/CartPage';
import OrdersPage from './pages/OrdersPage';
import AdminDashboard from './pages/AdminDashboard';
import EditProductPage from './pages/EditProductPage';
import { useEffect,useState } from 'react';
import { io } from 'socket.io-client';
import { addNotification } from './features/userSlice';
import ThankYouPage from './pages/ThankYouPage';
import Completion from './components/Completion';
import Payment from './components/Payment';
import {loadStripe} from '@stripe/stripe-js';
import FooterSection from './components/FooterSection';
import ProfilePage from './pages/ProfilePage';
import { setNologincart } from './features/nologincartSlice';
import TnC from './pages/TnC';
import AboutUsPage from './pages/AboutUsPage';
import PrivPol from './pages/PrivPol';

function App() {
  const user = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const [ stripePromise, setStripePromise ] = useState(null);
  
  useEffect(() => {
    // Retrieve nologincart from local storage
    const nologincartString = localStorage.getItem('nologincart');
    if (nologincartString) {
      const nologincart = JSON.parse(nologincartString);
      dispatch(setNologincart(nologincart));
    }
  }, [dispatch]);

  return (
    <div className='App'>
      <BrowserRouter>
      <ScrollToTop/>
      <Navigation/>
      <Routes>
        <Route index element={<Home/>}/>
        {!user && (<>
          <Route path='/login' element={<Login/>}/>
          <Route path='/signup' element={<Signup/>}/>
        </>)}
        <Route path='/cart' element={<CartPage/>} />
        <Route path='/termsandconditions' element={<TnC/>} />
        {user && <>
          <Route path='/orders' element={<OrdersPage/>} />
          <Route path='/profile' element={<ProfilePage/>} />
          
        </>}
        {user && user.isAdmin &&(

          <>
            <Route path='/admin' element={<AdminDashboard/>} />
            <Route path='/product/:id/edit' element={<EditProductPage/>} />
          </>
        )}
        <Route path='/product/:id' element={<ProductPage/>}/>
        <Route path='/category/:category' element={<CategoryPage/>}/>
        <Route path='/new-product' element={<NewProduct/>}/>
        <Route path='/thankyou' element={<ThankYouPage/>}/>
        <Route path='/aboutus' element={<AboutUsPage/>}/>
        <Route path='/privacypolicy' element={<PrivPol/>}/>
        <Route path='*' element={<Home/>}/>
        {/* <Route path="/" element={<Payment stripePromise={stripePromise} />} /> */}
        {/* <Route path="/completion" element={<Completion stripePromise={stripePromise} />} /> */}
      </Routes>
      <FooterSection/>
      </BrowserRouter>
    </div>
  );
}

export default App;
