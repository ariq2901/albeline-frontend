import React, { Fragment } from 'react';

const Banner = () => {
  return (
    <Fragment>
          <div className="container con-banner">
            <div className="banner-wrapper">
              <div className="wearing"><div className="after">Stylish</div></div>
              <div className="phone"><div className="after">Brand new phone</div></div>
              <div className="food"><div className="after">Fast food</div></div>
              <div className="deals"><div className="after">Big Deals</div></div>
            </div>
          </div>
    </Fragment>
  );
}
export default Banner;