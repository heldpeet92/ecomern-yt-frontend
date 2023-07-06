import React, { Component } from "react";
import Slider from "react-slick";
import './SimpleSlider.css'
import { Col, Row } from "react-bootstrap";

export default class SimpleSlider extends Component {
  render() {
    const settings = {
      
      dots: false,
      infinite: true,
      speed: 500,
      slidesToShow: 1,
      slidesToScroll: 1,
      autoplay: true,
      speed: 3000,
      autoplaySpeed: 10000,
      pauseOnHover: true
    };
    return (
      <>
      <div>
        <h2> Kínálatunk</h2>
        <Slider {...settings}>
          <div>
            <Row>
              <Col md={4}>
                <a href="/category/Illatgyertya"><img style={{height:'100%', width: '100%', objectFit:'cover'}} src="https://res.cloudinary.com/djumsmr1d/image/upload/w_1200,f_auto/v1688051298/IMG_3672_hdfa5o.jpg"/></a>
              </Col>
              <Col md={4}>
              <a href="/category/Wax"><img style={{height:'100%', width: '100%', objectFit:'cover'}} src="https://res.cloudinary.com/djumsmr1d/image/upload/w_1200,f_auto/v1688051206/IMG_3744_fxnb4q.jpg"></img></a>
              </Col>
              <Col md={4}>
              <img style={{height:'100%', width: '100%', objectFit:'cover'}} src="https://res.cloudinary.com/djumsmr1d/image/upload/w_1200,f_auto/v1688051206/IMG_3852_bfpxcg.jpg"/>
              </Col>
            </Row>
          </div>
          {/* <div>
          <Row>
              <Col md={4}>
                <img style={{height:'100%', width: '100%', objectFit:'cover'}} src="https://res.cloudinary.com/djumsmr1d/image/upload/v1686070438/IMG_3600_bcw5oz.jpg"/>
              </Col>
              <Col md={8}>
                <p>
                Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
                </p>
              </Col>
            </Row>
          </div>
          <div>
            <h3>3</h3>
          </div>
          <div>
            <h3>4</h3>
          </div>
          <div>
            <h3>5</h3>
          </div>
          <div>
            <h3>6</h3>
          </div> */}
        </Slider>
      </div>
      </>
    );
  }
}