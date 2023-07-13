import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import React, { useState, useEffect } from "react";
import { Alert, Col, Container, Row, Table } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import CheckoutForm from "../components/CheckoutForm";
import {
  useDecreaseCartProductMutation,
  useIncreaseCartProductMutation,
  useRemoveFromCartMutation,
  useAddToCartMutation,
} from "../services/appApi";
import "./CartComponent.css";
import Payment from "../components/Payment";
import { useRef } from "react";
import { incrementnologincart,decrementnologincart,removefromnologincart } from '../features/nologincartSlice';

const CartComponent = ({
  setSharedState,
  setDiscountCode,
  shippingMethod,
  currentPaymentMode,
}) => {
  const nologincart = useSelector((state) => state.nologincart);
  const dispatch = useDispatch();
  const [stripePromise, setStripePromise] = useState(null);
  const selectedShipping = shippingMethod;
  const selectedPayment = currentPaymentMode;
  useEffect(() => {
    fetch(process.env.REACT_APP_APIURL + "/config").then(async (r) => {
      const { publishableKey } = await r.json();
      setStripePromise(loadStripe(publishableKey));
    });
  }, []);
  const user = useSelector((state) => state.user);
  const products = useSelector((state) => state.products);
  let userCartOjb = user?.cart;

  if (!user) {
    userCartOjb = nologincart;
  }

  const handleCartChange = (event) => {
    //setPageCart(event.target.value);
  };

  const couponRef = useRef(null);

  let cart = products.filter((product) => userCartOjb[product._id] != null);
  const [increaseCart] = useIncreaseCartProductMutation();
  const [decreaseCart] = useDecreaseCartProductMutation();
  const [removeFromCart, { isLoading }] = useRemoveFromCartMutation();
  const [addToCart, { isSuccess }] = useAddToCartMutation();
  const [validCoupon, setValidCoupon] = useState(false);
  const [couponReadonly, setCouponReadonly] = useState(false);
  const [invalidCouponMessageVisible, setInvalidCouponMessageVisible] =
    useState(false);
  const [validCouponMessageVisible, setValidCouponMessageVisible] =
    useState(false);

  const handleCoupon = () => {
    const cupon = couponRef.current.value;
    //TODO lista bővítés
    if (cupon === "BOGI10" || cupon === "IVETT10" || cupon === "VIKI10") {
      setDiscountCode(cupon);
      setValidCoupon(true);
      setValidCouponMessageVisible(true);
      setCouponReadonly(true);
    } else {
      setInvalidCouponMessageVisible(true);
    }
  };

  const appearance = {
    theme: "stripe",
  };
  const options = {
    stripePromise,
    appearance,
  };
  setSharedState(userCartOjb.total);
  const handleNLDecrease = (e) => {
    let prodId = e.productId;
        let price = e.price;
        dispatch(decrementnologincart({prodId,price}))
  };
  const handleNLIncrease = (e) => { 
        let prodId = e.productId;
        let price = e.price;
        dispatch(incrementnologincart({prodId,price}))
    };
  const removeNLFromCart = (e) => {
    let prodId = e.productId;
    let price = e.price;
    dispatch(removefromnologincart({prodId,price}))
  };
  

  return (
    <>
      {user && (
        <Container style={{ minHeight: "45vh" }} className="cart-container">
          <h1 className="pt-2 h3">Kosár</h1>
          {cart.length > 0 && (
            <Col>
              <>
                <Table responsive="sm" className="cart-table">
                  <thead>
                    <tr>
                      <th>&nbsp;</th>
                      <th>Termék&nbsp;megnevezése</th>
                      <th>Termék&nbsp;ára</th>
                      <th>Darabszám</th>
                      <th>Részösszeg</th>
                    </tr>
                  </thead>
                  <tbody>
                    {/**loop  */}
                    {cart.map((item) => (
                      <tr>
                        <td>&nbsp;</td>
                        <td>
                          {!isLoading && item.productType !== "misc" && (
                            <i
                              className="fa fa-times"
                              style={{ marginRight: 10, cursor: "pointer" }}
                              onClick={() =>
                                removeFromCart({
                                  productId: item._id,
                                  price: item.price,
                                  userId: user?._id,
                                })
                              }
                            ></i>
                          )}
                          {/* <img src={item.pictures[0].url} style={{width:100, height:100, objectFit: 'cover'}}/> */}
                          {item.name}
                        </td>
                        <td>{item.price} Ft</td>
                        <td>
                          {item.productType !== "misc" && (
                            <span className="quantity-indicator">
                              {userCartOjb[item._id] > 1 && (
                                <i
                                  className="fa fa-minus-circle"
                                  style={{ marginRight: 10 }}
                                  onClick={() =>
                                    decreaseCart({
                                      productId: item._id,
                                      price: item.price,
                                      userId: user?._id,
                                    })
                                  }
                                ></i>
                              )}
                              <span>{userCartOjb[item._id]}</span>
                              <i
                                className="fa fa-plus-circle"
                                style={{ marginLeft: 10 }}
                                onClick={() =>
                                    increaseCart({
                                    productId: item._id,
                                    price: item.price,
                                    userId: user?._id,
                                  })
                                }
                              ></i>
                            </span>
                          )}
                        </td>
                        <td>{item.price * userCartOjb[item._id]}</td>
                      </tr>
                    ))}
                    {selectedShipping === "FOXPOSTMachine" && (
                      <tr>
                        <td>&nbsp;</td>
                        <td>
                          {/* <img src={item.pictures[0].url} style={{width:100, height:100, objectFit: 'cover'}}/> */}
                          FOXPOST automata szállítás
                        </td>
                        <td>990 Ft</td>
                        <td></td>
                        <td></td>
                      </tr>
                    )}
                    {selectedShipping === "FOXPOSTDelivery" && (
                      <tr>
                        <td>&nbsp;</td>
                        <td>
                          {/* <img src={item.pictures[0].url} style={{width:100, height:100, objectFit: 'cover'}}/> */}
                          Házhoz szállítás
                        </td>
                        <td>1690 Ft</td>
                        <td></td>
                        <td></td>
                      </tr>
                    )}
                    {selectedPayment === "COD" && (
                      <tr>
                        <td>&nbsp;</td>
                        <td>
                          {/* <img src={item.pictures[0].url} style={{width:100, height:100, objectFit: 'cover'}}/> */}
                          Utánvét
                        </td>
                        <td>320 Ft</td>
                        <td></td>
                        <td></td>
                      </tr>
                    )}
                  </tbody>
                </Table>
                <Row>
                  <Col md={6}>
                    Van kuponkódod? Add meg itt!
                    <br />
                    {validCoupon && (
                      <p style={{ color: "green" }}>
                        Érvényes kuponkód, 10% kedvezmény!
                      </p>
                    )}
                    {!validCoupon && invalidCouponMessageVisible && (
                      <p style={{ color: "red" }}>Érvénytelen kuponkód!</p>
                    )}
                  </Col>
                  <Col md={4}>
                    <input
                      disabled={couponReadonly}
                      ref={couponRef}
                      type="text"
                      className="form-control"
                      placeholder="KUPONKÓD"
                    />
                  </Col>

                  <Col md={2}>
                    <button
                      type="button"
                      className="btn btn-success"
                      onClick={handleCoupon}
                    >
                      OK
                    </button>
                  </Col>
                </Row>
                <br />
                <div>
                  <h3 className="h4 pt-4">
                    <span>Összesen </span>
                    {(userCartOjb.total +
                      (selectedPayment === "COD" ? 320 : 0) +
                      (selectedShipping === "FOXPOSTMachine"
                        ? 990
                        : selectedShipping === "FOXPOSTDelivery"
                        ? 1690
                        : 0)) *
                      (validCoupon ? 0.9 : 1.0)}
                    <span> Ft</span>
                  </h3>
                </div>
              </>
            </Col>
          )}
        </Container>
      )}
      {!user && (
        <Container style={{ minHeight: "45vh" }} className="cart-container">
          <h1 className="pt-2 h3">Kosár</h1>
          {cart.length > 0 && (
            <Col>
              <>
                <Table responsive="sm" className="cart-table">
                  <thead>
                    <tr>
                      <th>&nbsp;</th>
                      <th>Termék&nbsp;megnevezése</th>
                      <th>Termék&nbsp;ára</th>
                      <th>Darabszám</th>
                      <th>Részösszeg</th>
                    </tr>
                  </thead>
                  <tbody>
                    {/**loop  */}
                    {cart.map((item) => (
                      <tr>
                        <td>&nbsp;</td>
                        <td>
                          {!isLoading && item.productType !== "misc" && (
                            <i
                              className="fa fa-times"
                              style={{ marginRight: 10, cursor: "pointer" }}
                              onClick={() =>
                                removeNLFromCart({
                                  productId: item._id,
                                  price: item.price,
                                  userId: user?._id,
                                })
                              }
                            ></i>
                          )}
                          {/* <img src={item.pictures[0].url} style={{width:100, height:100, objectFit: 'cover'}}/> */}
                          {item.name}
                        </td>
                        <td>{item.price} Ft</td>
                        <td>
                          {item.productType !== "misc" && (
                            <span className="quantity-indicator">
                              {userCartOjb[item._id] > 1 && (
                                <i
                                  className="fa fa-minus-circle"
                                  style={{ marginRight: 10 }}
                                  onClick={() =>
                                    handleNLDecrease({
                                      productId: item._id,
                                      price: item.price,
                                      userId: user?._id,
                                    })
                                  }
                                ></i>
                              )}
                              <span>{userCartOjb[item._id]}</span>
                              <i
                                className="fa fa-plus-circle"
                                style={{ marginLeft: 10 }}
                                onClick={() =>
                                  handleNLIncrease({
                                    productId: item._id,
                                    price: item.price,
                                    userId: user?._id,
                                  })
                                }
                              ></i>
                            </span>
                          )}
                        </td>
                        <td>{item.price * userCartOjb[item._id]}</td>
                      </tr>
                    ))}
                    {selectedShipping === "FOXPOSTMachine" && (
                      <tr>
                        <td>&nbsp;</td>
                        <td>
                          {/* <img src={item.pictures[0].url} style={{width:100, height:100, objectFit: 'cover'}}/> */}
                          FOXPOST automata szállítás
                        </td>
                        <td>990 Ft</td>
                        <td></td>
                        <td></td>
                      </tr>
                    )}
                    {selectedShipping === "FOXPOSTDelivery" && (
                      <tr>
                        <td>&nbsp;</td>
                        <td>
                          {/* <img src={item.pictures[0].url} style={{width:100, height:100, objectFit: 'cover'}}/> */}
                          Házhoz szállítás
                        </td>
                        <td>1690 Ft</td>
                        <td></td>
                        <td></td>
                      </tr>
                    )}
                    {selectedPayment === "COD" && (
                      <tr>
                        <td>&nbsp;</td>
                        <td>
                          {/* <img src={item.pictures[0].url} style={{width:100, height:100, objectFit: 'cover'}}/> */}
                          Utánvét
                        </td>
                        <td>320 Ft</td>
                        <td></td>
                        <td></td>
                      </tr>
                    )}
                  </tbody>
                </Table>
                <Row>
                  <Col md={6}>
                    Van kuponkódod? Add meg itt!
                    <br />
                    {validCoupon && (
                      <p style={{ color: "green" }}>
                        Érvényes kuponkód, 10% kedvezmény!
                      </p>
                    )}
                    {!validCoupon && invalidCouponMessageVisible && (
                      <p style={{ color: "red" }}>Érvénytelen kuponkód!</p>
                    )}
                  </Col>
                  <Col md={4}>
                    <input
                      disabled={couponReadonly}
                      ref={couponRef}
                      type="text"
                      className="form-control"
                      placeholder="KUPONKÓD"
                    />
                  </Col>

                  <Col md={2}>
                    <button
                      type="button"
                      className="btn btn-success"
                      onClick={handleCoupon}
                    >
                      OK
                    </button>
                  </Col>
                </Row>
                <br />
                <div>
                  <h3 className="h4 pt-4">
                    <span>Összesen </span>
                    {(userCartOjb.total +
                      (selectedPayment === "COD" ? 320 : 0) +
                      (selectedShipping === "FOXPOSTMachine"
                        ? 990
                        : selectedShipping === "FOXPOSTDelivery"
                        ? 1690
                        : 0)) *
                      (validCoupon ? 0.9 : 1.0)}
                    <span> Ft</span>
                  </h3>
                </div>
              </>
            </Col>
          )}
        </Container>
      )}
    </>
  );
};

export default CartComponent;
