import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import { Row, Col, Container } from "react-bootstrap";
import categories from "../categories";
import { LinkContainer } from "react-router-bootstrap";
import "./Home.css";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import SimpleSlider from "../components/SimpleSlider";
import axios from "../axios";
import { useDispatch, useSelector } from "react-redux";
import { updateProducts } from "../features/productSlice";
import { updateUser } from "../features/userSlice";
import ProductPreview from "../components/ProductPreview";
import AboutSection from "../components/AboutSection";
import FooterSection from "../components/FooterSection";
import TestFetcher from "../components/TestFetcher";
import TestCheckout from "../components/TestCheckout";
import Payment from "../components/Payment";

const Home = () => {
  const dispatch = useDispatch();
  const products = useSelector((state) => state.products);
  const shopProducts = products.filter(
    (product) => product.productType !== "misc"
  );
  const lastProducts = shopProducts.slice(0, 5);

  //here we update the section where we render the product cards
  useEffect(() => {
    axios.get("/products").then(({ data }) => dispatch(updateProducts(data)));
  }, []);

  return (
    <div>
      <img src="https://res.cloudinary.com/djumsmr1d/image/upload/v1685376183/M-8_bvrzrb.png" />
      <div>
        <Container>
          <SimpleSlider />
        </Container>
      </div>
      {/* <img className='home-banner' src="https://res.cloudinary.com/learn-code-10/image/upload/v1653947013/yqajnhqf7usk56zkwqi5.png" alt=''/> */}
      <div className="featured-products-container container mt-4">
        <h2>Kedvenceitek</h2>
        <div className="d-flex justify-content-center flex-wrap">
          {lastProducts.map((product) => (
            <ProductPreview {...product} />
          ))}
        </div>
      </div>
      <div className="featured-products-container container mt-4">
        {/* <Link to="/category/all" style={{textAlign: 'right', display: 'block', textDecoration: 'none'}}>
                See more {">>"}
            </Link> */}
      </div>
      <div className="sale__banner--container mt-4">
        {/*sale banner*/}
        {/* <img src='https://res.cloudinary.com/learn-code-10/image/upload/v1654093280/xkia6f13xxlk5xvvb5ed.png'/> */}
      </div>
      <AboutSection />
    </div>
  );
};

export default Home;
