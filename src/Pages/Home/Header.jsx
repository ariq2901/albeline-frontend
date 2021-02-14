import React, { Fragment, useEffect, useState } from 'react';
import Slider from 'react-slick';
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import Clothes from '../../assets/images/icons/clothes.png';
import Sale from '../../assets/images/icons/sale.png';
import Phone from '../../assets/images/icons/phone.png';
import AlatTulis from '../../assets/images/icons/alat-tulis.png';
import FreeOngkir from '../../assets/images/icons/free-ongkir.png';
import BestPrice from '../../assets/images/icons/best-price.png';
import Computer from '../../assets/images/icons/computer.png';
import Toy from '../../assets/images/icons/toy.png';
import { CustomArrow } from '../Components/SliderCustomized';
import { config } from '../../config';
import Axios from 'axios';
import ImageLoad from '../Components/ImageLoad';
import Placeholder from '../../assets/images/placeholder.jpg';

const Header = () => {
  const [bigBanner, setBigBanner] = useState([]);
  const [smallBanner, setSmallBanner] = useState([]);
  const [id, setId] = useState(0);

  useEffect(() => {
    getBigBanner();
    getSmallBanner();
  }, [id]);

  function getBigBanner() {
    const url = `${config.api_host}/api/banners/big`;
    console.log(url);
    Axios.get(url)
    .then(res => {
      setBigBanner(res.data.banners);
    })
    .catch(e => {
      console.error(e);
    });
  }
  
  async function getSmallBanner() {
    try {
      const url = `${config.api_host}/api/banners/small`;
      const res = await Axios.get(url);
      setSmallBanner(res.data.banners);
    } catch(e) {
      console.error("Failure ", e);
    }
  }

  var settings = {
    customPaging: function(i) {
      return (
        <a>
          <div className="strip-slick-dots"></div>
        </a>
      );
    },
    dots: true,
    dotsClass: "slick-dots banner-dots slick-thumb",
    infinite: true,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    speed: 500,
    autoplaySpeed: 5000,
    nextArrow: <CustomArrow prev={false} />,
    prevArrow: <CustomArrow prev={true}/>,
  };

  return (
    <Fragment>
      {console.log("Small banner", smallBanner)}
      <section className="home-header">
        <div className="container">
          <div className="content-header">
            <div className="rest-content-item">
              {smallBanner.map((image, i) =>
                <div className="small-banner-wrapper" key={i} style={{ backgroundImage: `url(${config.api_host}/api/image/${image.image.id})` }}></div>
              )}
            </div>
            <Slider {...settings} className="content3-item">
              {bigBanner.map((image, i) =>
                <div key={i} className="big-banner-wrapper">
                  <ImageLoad placeholder={Placeholder} src={`${config.api_host}/api/image/${image.image.id}`} alt="banner"/>
                </div>
              )}
            </Slider>
          </div>
          <div className="category-grid-ico">

            <div className="cat-ico-wrapper">
              <div className="cat-ico">
                <img src={Clothes} alt="ico"/>
              </div>
              <span>Clothes</span>
            </div>
            <div className="cat-ico-wrapper">
              <div className="cat-ico">
                <img src={Sale} alt="ico"/>
              </div>
              <span>Extra Deals</span>
            </div>
            <div className="cat-ico-wrapper">
              <div className="cat-ico">
                <img src={Phone} alt="ico"/>
              </div>
              <span>Smartphone</span>
            </div>
            <div className="cat-ico-wrapper">
              <div className="cat-ico">
                <img src={AlatTulis} alt="ico"/>
              </div>
              <span>Alat Tulis</span>
            </div>
            <div className="cat-ico-wrapper">
              <div className="cat-ico">
                <img src={FreeOngkir} alt="ico"/>
              </div>
              <span>Gratis Ongkir</span>
            </div>
            <div className="cat-ico-wrapper">
              <div className="cat-ico">
                <img src={BestPrice} alt="ico"/>
              </div>
              <span>Termurah</span>
            </div>
            <div className="cat-ico-wrapper">
              <div className="cat-ico">
                <img src={Toy} alt="ico"/>
              </div>
              <span>Mainan</span>
            </div>
            <div className="cat-ico-wrapper">
              <div className="cat-ico">
                <img src={Computer} alt="ico"/>
              </div>
              <span>Hardware</span>
            </div>

          </div>
        </div>
      </section>
    </Fragment>
  );
}
export default Header;