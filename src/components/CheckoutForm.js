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
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { useCreateOrderMutation } from "../services/appApi";
import FoxPostComponent from "./FoxPostComponent";
import axios from '../axios'
import {emptyNologincart} from '../features/nologincartSlice'
//import '../Stripe.css'

const CheckoutForm = ({
  setCurrentShippingMode,
  setPaymentMode,
  selectedDiscount,
}) => {
  const dispatch = useDispatch();
  const stripe = useStripe();
  const [message, setMessage] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedMachine, setSelectedMachine] = useState({});

  const nologincart = useSelector((state) => state.nologincart);
  const user = useSelector((state) => state.user);
  const products = useSelector((state) => state.products);
  let userCartOjb = user ? user.cart : [];
  if (!user) {
    userCartOjb = nologincart;
    // const storedCartData = localStorage.getItem("nologincart");
    // userCartOjb = storedCartData
    //   ? JSON.parse(storedCartData)
    //   : { total: 0, count: 0 };
  }
  const count = 3;
  let cart = products.filter((product) => userCartOjb[product._id] != null);
  // Pass the appearance object to the Elements instance
  const elements = useElements();
  const navigate = useNavigate();
  const [alertMessage, setAlertMessage] = useState("");
  const [createOrder, { isError, isSuccess }] = useCreateOrderMutation(); //Todo ide kell az isLoading vajon??
  const [country, setCountry] = useState("");
  const [address, setAddress] = useState(user?.address);
  const [nologinname, setNologinname] = useState("");
  const [nologinemail, setNologinemail] = useState("");
  const [city, setCity] = useState(user?.city);
  const [phoneNumber, setPhoneNumber] = useState('');
  const [zipcode, setZipcode] = useState(user?.zipcode);
  const [otherInfo, setOtherInfo] = useState(user?.addressOther);
  const [showFoxPost, setShowFoxPost] = useState(false);
  const [showFoxPostDelivery, setShowFoxPostDelivery] = useState(false);
  const [showCardPayment, setShowCardPayment] = useState(false);
  const [showCODPayment, setShowCOD] = useState(false);
  const [shippingRadioInvalid, setShippingRadioInvalid] = useState(false);
  const [paymentRadioInvalid, setPaymentRadioInvalid] = useState(false);
  const [foxpostInvalid, setFoxpostInvalid] = useState(false);
  const [shippingAddress, setShippingAddress] = useState(user?.shippingAddress);
  const [shippingCity, setShippingCity] = useState(user?.shippingCity);
  const [shippingZipcode, setShippingZipcode] = useState(user?.shippingZipcode);
  const [selectedShippingMode, setSelectedShippingMode] = useState("");
  const [selectedPaymentMode, setSelectedPaymentMode] = useState("");
  const [shippingOtherInfo, setShippingOtherInfo] = useState(
    user?.shippingAddressOther
  );

  const [paying, setPaying] = useState(false);
  const [finalizing, setFinalizing] = useState(false);
  const [validated, setValidated] = useState(false);

  const createNologinOrder = () => {
    try {
      let formData = {
        cart: userCartOjb,
        billing:{
          name: nologinname,
          email: nologinemail,
          address: address,
          zipcode: zipcode,
          city: city,
          otherInfo: otherInfo
        },
        shipping:{
          address: shippingAddress,
          zipcode: shippingZipcode,
          city: shippingCity,
          otherInfo: shippingOtherInfo
        },
        phoneNumber,
        selectedShippingMode,
        selectedPaymentMode,
        selectedMachineInfo: selectedMachine,
        selectedDiscount,
        anonymousEmail: nologinemail
      };
      const response = axios.post("/orders/createnologinorder", formData).then((res) => {
        if (!isLoading && !isError) {
          setAlertMessage(`Rendelés sikeres!`);
          dispatch(emptyNologincart());

          setPaying(false);
          setTimeout(() => {
            navigate("/thankyou");
          }, 3000);
        }
      }); // Handle the response data
    } catch (error) {
      console.error(error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setPaying(true);
    setFinalizing(true);
    if (showCardPayment && (!stripe || !elements)) {
      // Stripe.js has not yet loaded.
      // Make sure to disable form submission until Stripe.js has loaded.
      return;
    }

    setShippingRadioInvalid(false);
    if (!showFoxPost && !showFoxPostDelivery) {
      setShippingRadioInvalid(true);
      setPaying(false);
      setFinalizing(false);
      return;
    }
    setFoxpostInvalid(false);
    if (showFoxPost && selectedMachine?.name === undefined) {
      setFoxpostInvalid(true);
      setPaying(false);
      setFinalizing(false);
      return;
    }

    setIsLoading(true);

    if (showCardPayment) {
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
        let billing={
          name: nologinname,
          email: nologinemail,
          address: address,
          zipcode: zipcode,
          city: city,
          otherInfo: otherInfo
        };
        let shipping = {
          address: shippingAddress,
          zipcode: shippingZipcode,
          city: shippingCity,
          otherInfo: shippingOtherInfo
        }
        if (user) {
          createOrder({
            userId: user?._id,
            cart: userCartOjb,
            billing,
            shipping,
            phoneNumber,
            address,
            city,
            selectedMachine,
            selectedDiscount,
            selectedShippingMode,
            selectedPaymentMode,
            anonymousEmail: nologinemail,
          }).then((res) => {
            if (!isLoading && !isError) {
              setAlertMessage(`Payment success`);

              setPaying(false);
              if (!user) {
                setTimeout(() => {
                  navigate("/thankyou");
                }, 3000);
              } else {
                setTimeout(() => {
                  navigate("/orders");
                }, 3000);
              }
            }
          });
        }
        if (!user) {
          let shipping = {};
          createNologinOrder({
            cart: userCartOjb,
            address,
            city,
            selectedMachine,
            selectedDiscount,
            selectedShippingMode,
            selectedPaymentMode,
            anonymousEmail: nologinemail,
          });
        }
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
      setFinalizing(false);
      setIsLoading(false);
    }
    if (showCODPayment) {
      let billing={
        name: nologinname,
        email: nologinemail,
        address: address,
        zipcode: zipcode,
        city: city,
        otherInfo: otherInfo
      };
      let shipping = {
        address: shippingAddress,
        zipcode: shippingZipcode,
        city: shippingCity,
        otherInfo: shippingOtherInfo
      }
      if (user) {
        createOrder({
          userId: user?._id,
          cart: userCartOjb,
          billing,
          shipping,
          address,
          city,
          selectedMachine,
          selectedDiscount,
          selectedShippingMode,
          selectedPaymentMode,
          anonymousEmail: nologinemail,
        }).then((res) => {
          if (!isLoading && !isError) {
            setAlertMessage(`Payment success`);

            setPaying(false);
            if (!user) {
              setTimeout(() => {
                navigate("/thankyou");
              }, 3000);
            } else {
              setTimeout(() => {
                navigate("/orders");
              }, 3000);
            }
          }
        });
      }
      if (!user) {
        let shipping = {};
        createNologinOrder({
          cart: userCartOjb,
          address,
          city,
          selectedMachine,
          selectedDiscount,
          selectedShippingMode,
          selectedPaymentMode,
          anonymousEmail: nologinemail,
        });
      }

      // This point will only be reached if there is an immediate error when
      // confirming the payment. Otherwise, your customer will be redirected to
      // your `return_url`. For some payment methods like iDEAL, your customer will
      // be redirected to an intermediate site first to authorize the payment, then
      // redirected to the `return_url`.

      setPaying(false);
      setFinalizing(false);
      setIsLoading(false);
    }
  };

  const foxpostRadioRef = useRef(null);
  const deliveryRadioRef = useRef(null);
  const cardPaymentRadioRef = useRef(null);
  const CODRadioRef = useRef(null);
  const checkFoxPostRadio = () => {
    const isChecked = foxpostRadioRef.current.checked;
    setCurrentShippingMode("FOXPOSTMachine");
    setSelectedShippingMode("FOXPOSTMachine");
    setShowFoxPost(isChecked);
    setShowFoxPostDelivery(!isChecked);
    setShippingRadioInvalid(!isChecked);
  };
  const checkDeliveryRadio = () => {
    const isChecked = deliveryRadioRef.current.checked;
    setCurrentShippingMode("FOXPOSTDelivery");
    setSelectedShippingMode("FOXPOSTDelivery");
    setShowFoxPost(!isChecked);
    setShowFoxPostDelivery(isChecked);
    setShippingRadioInvalid(!isChecked);
  };
  const checkCardPaymentRadioRef = () => {
    const isChecked = cardPaymentRadioRef.current.checked;
    setShowCardPayment(isChecked);
    setPaymentMode("Card");
    setSelectedPaymentMode("Card");
    setPaymentRadioInvalid(!isChecked);
    setShowCOD(!isChecked);
  };
  const checkCODRadioRef = () => {
    const isChecked = CODRadioRef.current.checked;
    setPaymentMode("COD");
    setSelectedPaymentMode("COD");
    setPaymentRadioInvalid(!isChecked);
    setShowCardPayment(!isChecked);
    setShowCOD(isChecked);
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
        {!user && (
          <Row>
            {alertMessage && <Alert>{alertMessage}</Alert>}
            <Col md={7}>
              <Form.Group className="mb-4">
                <Form.Label>Teljes név</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Teljes név"
                  value={nologinname}
                  onChange={(e) => setNologinname(e.target.value)}
                  required
                />
              </Form.Group>
            </Col>
            <Col md={5}>
              <Form.Group className="mb-4">
                <Form.Label>Email</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="E-mail"
                  value={nologinemail}
                  onChange={(e) => setNologinemail(e.target.value)}
                  required
                />
              </Form.Group>
            </Col>
          </Row>
        )}
        {showFoxPost &&(
          <Row>
            <Col md={4}>
            <Form.Group className="mb-4">
                <Form.Label>Telefonszám</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="+36 30 123 4567"
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                  required ={showFoxPost}
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
                placeholder="Cím"
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
                placeholder="Város"
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
              placeholder="pl. 1234"
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
                placeholder="pl. 3. emelet 2."
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
          <InputGroup>
            <Col md={4}>
              <Form.Check // prettier-ignore
                required
                type={"radio"}
                id={`default-radio`}
                label={`FoxPost csomagautomata`}
                onClick={checkFoxPostRadio}
                ref={foxpostRadioRef}
                name="shippingRadio"
              />
            </Col>
            <Col md={4}>
              <Form.Check // prettier-ignore
                required
                type={"radio"}
                id={`default-radio`}
                label={`Házhoz szállítás`}
                onClick={checkDeliveryRadio}
                ref={deliveryRadioRef}
                name="shippingRadio"
              />
              {shippingRadioInvalid && (
                <p style={{ color: "red" }}>
                  Kérjük válaszd ki a szállítási módot!
                </p>
              )}
            </Col>
          </InputGroup>
        </Row>
        {showFoxPostDelivery && (
          <>
            <Row>
              <Col md={7}>
                <Form.Group className="mb-3">
                  <Form.Label>Szállítási cím</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Address"
                    value={shippingAddress}
                    onChange={(e) => setShippingAddress(e.target.value)}
                    required
                  />
                </Form.Group>
              </Col>
              <Col md={5}>
                <Form.Group className="mb-3">
                  <Form.Label>Város</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Budapest"
                    value={shippingCity}
                    onChange={(e) => setShippingCity(e.target.value)}
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
                  placeholder="1234"
                  value={shippingZipcode}
                  onChange={(e) => setShippingZipcode(e.target.value)}
                />
              </Form.Group>
              <Form.Group as={Col} md="9" controlId="validationCustomUsername">
                <Form.Label>Egyéb információ</Form.Label>
                <InputGroup hasValidation>
                  <InputGroup.Text id="inputGroupPrepend">i</InputGroup.Text>
                  <Form.Control
                    type="text"
                    placeholder="pl.: 4. emelet III."
                    aria-describedby="inputGroupPrepend"
                    value={shippingOtherInfo}
                    onChange={(e) => setShippingOtherInfo(e.target.value)}
                  />
                </InputGroup>
              </Form.Group>
            </Row>
          </>
        )}

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
        <h4>Fizetési mód</h4>
        <Row>
          <InputGroup>
            <Col md={4}>
              <Form.Check // prettier-ignore
                required
                type={"radio"}
                id={`default-radio`}
                label={`Fizetés bankkártyával`}
                onClick={checkCardPaymentRadioRef}
                ref={cardPaymentRadioRef}
                name="paymentRadio"
              />
            </Col>
            <Col md={4}>
              <Form.Check // prettier-ignore
                required
                type={"radio"}
                id={`default-radio`}
                label={`Fizetés utánvéttel`}
                onClick={checkCODRadioRef}
                ref={CODRadioRef}
                name="paymentRadio"
              />
              {paymentRadioInvalid && (
                <p style={{ color: "red" }}>
                  Kérjük válaszd ki a szállítási módot!
                </p>
              )}
            </Col>
          </InputGroup>
        </Row>
        {showCardPayment && (
          <>
            <PaymentElement id="payment-element" />
            <Button
              className="mt-3"
              type="submit"
              disabled={userCartOjb.count <= 0 || paying || isSuccess}
            >
              {paying ? "Feldolgozás..." : "Fizetés"}
            </Button>
          </>
        )}
        {showCODPayment && (
          <Button
            className="mt-3"
            type="submit"
            disabled={userCartOjb.count <= 0 || finalizing || isSuccess}
          >
            {paying ? "Feldolgozás..." : "Rendelés elküldése"}
          </Button>
        )}
        <hr />
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
      </form>
    </Col>
  );
};

export default CheckoutForm;
