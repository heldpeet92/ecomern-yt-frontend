import React from "react";
import "./FooterSection.css"; // Import the CSS file for styling
import { LinkContainer } from "react-router-bootstrap";
import { Col, Row } from "react-bootstrap";

const FooterSection = () => {
  return (
    <footer>
      <div className="footcontainer">
        <div className="row">
          <Row>
            <Col md={4} className="d-none d-md-block">
              <div className="col-foot">
                <img src="https://res.cloudinary.com/djumsmr1d/image/upload/w_300,f_auto/v1689019798/-_Silvia_Mellow_-_hsmd21.png"></img>
              </div>
            </Col>
          </Row>
          <div className="col-foot">
            <h4>Információk</h4>
            <ul>
              <li>
                <LinkContainer
                  to={`/termsandconditions`}
                  style={{ cursor: "pointer" }}
                >
                  <span>ÁSZF</span>
                </LinkContainer>
              </li>
              <li>
                <LinkContainer
                  to={`/privacypolicy`}
                  style={{ cursor: "pointer" }}
                >
                  <span>Adatvédelmem</span>
                </LinkContainer>
              </li>
              <li>
                <LinkContainer to={`/aboutus`} style={{ cursor: "pointer" }}>
                  <span>Rólunk</span>
                </LinkContainer>
              </li>
            </ul>
          </div>
          <div className="col-foot">
            <h4>Kapcsolat</h4>
            <ul>
              <li>
                <a
                  href="https://www.tiktok.com/@meltme.hu"
                  style={{ cursor: "pointer", textDecoration: "none" }}
                >
                  TikTok
                </a>
              </li>
              <li>
                <a
                  href="https://www.instagram.com/meltme.hu/"
                  style={{ cursor: "pointer", textDecoration: "none" }}
                >
                  Instagram
                </a>
              </li>
              <li>
                <a
                  href="#"
                  style={{ cursor: "pointer", textDecoration: "none" }}
                >
                  Facebook
                </a>
              </li>
              <li>
                <a
                  href="#"
                  style={{ cursor: "pointer", textDecoration: "none" }}
                >
                  Írj nekünk!
                </a>
              </li>
            </ul>
          </div>
        </div>
      </div>
      <p>
        Üzemeltető: RightNET Bt. Minden jog fenntartva - Melt Me Webshop - 2023
      </p>
    </footer>
  );
};

export default FooterSection;
