import React from 'react';
import './FooterSection.css'; // Import the CSS file for styling

const FooterSection = () => {
  return (
    <footer>
      <div className="container">
        <div className="row">
          <div className="col-foot">
            <ul>
              <li><a href="#">Link 1</a></li>
              <li><a href="#">Link 2</a></li>
              <li><a href="#">Link 3</a></li>
              <li><a href="#">Link 4</a></li>
              <li><a href="#">Link 5</a></li>
            </ul>
          </div>
          <div className="col-foot">
            <ul>
              <li><a href="#">Link 1</a></li>
              <li><a href="#">Link 2</a></li>
              <li><a href="#">Link 3</a></li>
              <li><a href="#">Link 4</a></li>
              <li><a href="#">Link 5</a></li>
            </ul>
          </div>
          <div className="col-foot">
            <ul>
              <li><a href="#">Link 1</a></li>
              <li><a href="#">Link 2</a></li>
              <li><a href="#">Link 3</a></li>
              <li><a href="#">Link 4</a></li>
              <li><a href="#">Link 5</a></li>
            </ul>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default FooterSection;
