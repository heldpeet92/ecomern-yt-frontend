import {
  CardElement,
  PaymentElement,
  useElements,
  useStripe,
} from "@stripe/react-stripe-js";
import React, { useState, useRef, useEffect } from "react";
import {
  Alert,
  Button,
  Col,
  Form,
  Row,
  FormGroup,
  InputGroup,
} from "react-bootstrap";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { useCreateOrderMutation } from "../services/appApi";
import FoxPostComponent from "./FoxPostComponent";
//import '../Stripe.css'

const CheckoutForm = () => {
  const stripe = useStripe();
  const [message, setMessage] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedMachine, setSelectedMachine] = useState({});
  const user = useSelector((state) => state.user);
  const products = useSelector((state) => state.products);
  let userCartOjb = user ? user.cart : [];
  if (!user) {
    const storedCartData = localStorage.getItem("nologincart");
    userCartOjb = storedCartData
      ? JSON.parse(storedCartData)
      : { total: 0, count: 0 };
  }
  const count = 3;
  let cart = products.filter((product) => userCartOjb[product._id] != null);
  // Pass the appearance object to the Elements instance
  const elements = useElements();
  const navigate = useNavigate();
  const [alertMessage, setAlertMessage] = useState("");
  const [createOrder, { isError, isSuccess }] = useCreateOrderMutation(); //Todo ide kell az isLoading vajon??
  const [country, setCountry] = useState("");
  const [address, setAddress] = useState(user.address);
  const [city, setCity] = useState(user.city);
  const [zipcode, setZipcode] = useState(user.zipcode);
  const [otherInfo, setOtherInfo] = useState(user.addressOther);
  const [showFoxPost, setShowFoxPost] = useState(false);
  const [radioInvalid, setRadioInvalid] = useState(false);
  const [foxpostInvalid, setFoxpostInvalid] = useState(false);
  // const [shippingAddress, setShippingAddress] = useState(user.shippingAddress);
  // const [shippingCity, setShippingCity] = useState(user.shippingCity);
  // const [shippingZipcode, setShippingZipcode] = useState(user.shippingZipcode);
  // const [shippingOtherInfo, setShippingOtherInfo] = useState(user.shippingAddressOther);

  const [paying, setPaying] = useState(false);
  const [validated, setValidated] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    setPaying(true);
    if (!stripe || !elements) {
      // Stripe.js has not yet loaded.
      // Make sure to disable form submission until Stripe.js has loaded.
      return;
    }

    console.log(selectedMachine);
    setRadioInvalid(false);
    if (!showFoxPost) {
      setRadioInvalid(true);
      setPaying(false);
      return;
    }
    setFoxpostInvalid(false);
    if (selectedMachine?.name === undefined) {
      setFoxpostInvalid(true);
      setPaying(false);
      return;
    }

    setIsLoading(true);

    const { error, paymentIntent } = await stripe.confirmPayment({
      elements,
      confirmParams: {
        // Make sure to change this to your payment completion page
        return_url: `${window.location.origin}/orders`,
      },
      redirect: "if_required",
    });
    if (paymentIntent && paymentIntent.status === "succeeded") {
      console.log("Payment succeeded");
      // handleSuccess();

      createOrder({ userId: user._id, cart: user.cart, address, city, selectedMachine }).then(
        (res) => {
          if (!isLoading && !isError) {
            setAlertMessage(`Payment success`);

            setPaying(false);
            setTimeout(() => {
              navigate("/orders");
            }, 3000);
          }
        }
      );
    }

    // This point will only be reached if there is an immediate error when
    // confirming the payment. Otherwise, your customer will be redirected to
    // your `return_url`. For some payment methods like iDEAL, your customer will
    // be redirected to an intermediate site first to authorize the payment, then
    // redirected to the `return_url`.
    if (error?.type === "card_error" || error?.type === "validation_error") {
      setMessage(error.message);
    } else {
      setMessage("An unexpected error occured.");
    }
    setPaying(false);
    setIsLoading(false);
  };

  const radioRef = useRef(null);
  const checkFoxPostRadio = () => {
    const isChecked = radioRef.current.checked;
    console.log("Radio button checked:", isChecked);
    setShowFoxPost(isChecked);
    setRadioInvalid(!isChecked);
  };

  useEffect(() => {
    if (selectedMachine?.name !== undefined) {
      setFoxpostInvalid(false);
    }
  }, [selectedMachine]);

  return (
    <Col md={12} className="cart-payment-container">
      <form onSubmit={handleSubmit} id="payment-form">
        {user && (
          <Row>
            {alertMessage && <Alert>{alertMessage}</Alert>}
            <Col md={7}>
              <Form.Group className="mb-4">
                <Form.Label>Teljes név</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="First Name"
                  value={user.name}
                  disabled
                />
              </Form.Group>
            </Col>
            <Col md={5}>
              <Form.Group className="mb-4">
                <Form.Label>Email</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Email"
                  value={user.email}
                  disabled
                />
              </Form.Group>
            </Col>
          </Row>
        )}
        <h4>Számlázási adatok</h4>
        <Row>
          <Col md={7}>
            <Form.Group className="mb-3">
              <Form.Label>Számlázási cím</Form.Label>
              <Form.Control
                type="text"
                placeholder="Address"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                required
              />
            </Form.Group>
          </Col>
          <Col md={5}>
            <Form.Group className="mb-3">
              <Form.Label>Város</Form.Label>
              <Form.Control
                type="text"
                placeholder="Country"
                value={city}
                onChange={(e) => setCity(e.target.value)}
                required
              />
            </Form.Group>
          </Col>
        </Row>

        <Row className="mb-3">
          <Form.Group as={Col} md="3" controlId="validationCustom01">
            <Form.Label>Irányítószám</Form.Label>
            <Form.Control
              required
              type="text"
              placeholder="First name"
              value={zipcode}
              onChange={(e) => setZipcode(e.target.value)}
            />
          </Form.Group>
          <Form.Group as={Col} md="9" controlId="validationCustomUsername">
            <Form.Label>Egyéb információ</Form.Label>
            <InputGroup hasValidation>
              <InputGroup.Text id="inputGroupPrepend">i</InputGroup.Text>
              <Form.Control
                type="text"
                placeholder="Username"
                aria-describedby="inputGroupPrepend"
                value={otherInfo}
                onChange={(e) => setOtherInfo(e.target.value)}
              />
              <Form.Control.Feedback type="invalid">
                Please choose a username.
              </Form.Control.Feedback>
            </InputGroup>
          </Form.Group>
        </Row>
        <hr />
        <h4>Szállítási mód</h4>
        <Row>
          <Col md={4}>
            <Form.Check // prettier-ignore
              required
              type={"radio"}
              id={`default-radio`}
              label={`FoxPost csomagautomata`}
              onClick={checkFoxPostRadio}
              ref={radioRef}
            />
            {radioInvalid && (
              <p style={{ color: "red" }}>
                Kérjük válaszd ki a szállítási módot!
              </p>
            )}
          </Col>
        </Row>
        {/* <Row>
                <Col md={7}>
                    <Form.Group className='mb-3'>
                        <Form.Label>Szállítás cím</Form.Label>
                        <Form.Control type='text' placeholder='Address' value={shippingAddress} onChange={(e)=>setShippingAddress(e.target.value)} required/>
                    </Form.Group>
                </Col>
                <Col md={5}>
                    <Form.Group className='mb-3'>
                        <Form.Label>Város</Form.Label>
                        <Form.Control type='text' placeholder='Country' value={shippingCity} onChange={(e)=>setShippingCity(e.target.value)} required/>
                    </Form.Group>
                </Col>
            </Row>
            
            <Row className="mb-3">
            <Form.Group as={Col} md="3" controlId="validationCustom01">
              <Form.Label>Irányítószám</Form.Label>
              <Form.Control
                required
                type="text"
                placeholder="First name"
                value={shippingZipcode}
                  onChange={(e)=>setShippingZipcode(e.target.value)}
              />
            </Form.Group>
            <Form.Group as={Col} md="9" controlId="validationCustomUsername">
              <Form.Label>Egyéb információ</Form.Label>
              <InputGroup hasValidation>
                <InputGroup.Text id="inputGroupPrepend">i</InputGroup.Text>
                <Form.Control
                  type="text"
                  placeholder="Username"
                  aria-describedby="inputGroupPrepend"                  
                  value={shippingOtherInfo}
                  onChange={(e)=>setShippingOtherInfo(e.target.value)}
                />
                <Form.Control.Feedback type="invalid">
                  Please choose a username.
                </Form.Control.Feedback>
              </InputGroup>
            </Form.Group> 
             </Row>*/}
        {showFoxPost && (
          <FoxPostComponent setSelectedMachine={setSelectedMachine} />
        )}
        {foxpostInvalid && (
          <p style={{ color: "red" }}>
            Kérjük válaszd ki a FOXPOST csomagautomatát, ahova a csomagot
            küldjük!
          </p>
        )}
        <hr />
        <h4>Fizetés</h4>
        <Row>
          <Col md={6}>
            <Form.Group className="mb-6">
              <Form.Check
                required
                label="Elfogadom az ÁSZF-et"
                feedback="Fizetés előtt az ÁSZF elfogadása kötelező!"
                feedbackType="invalid"
              />
            </Form.Group>
          </Col>
        </Row>
        <PaymentElement id="payment-element" />
        <Button
          className="mt-3"
          type="submit"
          disabled={user.cart.count <= 0 || paying || isSuccess}
        >
          {paying ? "Feldolgozás..." : "Fizetés"}
        </Button>
      </form>
    </Col>
  );
};

export default CheckoutForm;
