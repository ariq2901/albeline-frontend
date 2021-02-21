import React, { Fragment, useEffect, useState } from 'react';
import Slider from 'react-slick';
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { CustomArrow } from '../Components/SliderCustomized';
import { config } from '../../config';
import Axios from 'axios';
import ImageLoad from '../Components/ImageLoad';
import Placeholder from '../../assets/images/placeholder.jpg';

const Header = () => {
  const [bigBanner, setBigBanner] = useState([]);
  const [smallBanner, setSmallBanner] = useState([]);
  const [categories, setCategories] = useState([]);
  const [id, setId] = useState(0);

  const getCategories = async (unmounted, token) => {
    const url = `${config.api_host}/api/category`;

    try {
      const response = await Axios.get(url);
      if (!unmounted) {
        setCategories(response.data.categories);
      }
    } catch (error) {
      if (!unmounted) {
        console.error(error.message);
        if (Axios.isCancel(error)) {
          console.log(`request cancelled: ${error.message}`);
        } else {
          console.error('Another error happened: ' + error.message);
        }
      }
    }
  }

  useEffect(() => {
    getBigBanner();
    getSmallBanner();
  }, [id]);

  useEffect(() => {
    let unmounted = false;
    let source = Axios.CancelToken.source();
    getCategories(unmounted, source.token);

    return () => {
      unmounted = true;
      source.cancel('Cancelling in cleanup');
    }
  }, []);

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

  // var settings = {
  //   customPaging: function(i) {
  //     return (
  //       <a>
  //         <div className="strip-slick-dots"></div>
  //       </a>
  //     );
  //   },
  //   className: "center",
  //   centerMode: true,
  //   centerPadding: "60px",
  //   dots: true,
  //   dotsClass: "slick-dots banner-dots slick-thumb",
  //   infinite: true,
  //   slidesToShow: 1,
  //   slidesToScroll: 1,
  //   autoplay: true,
  //   speed: 500,
  //   autoplaySpeed: 5000,
  //   nextArrow: <CustomArrow prev={false} />,
  //   prevArrow: <CustomArrow prev={true}/>,
  // };

  const settings = {
    className: "center",
    centerMode: true,
    infinite: true,
    centerPadding: "220px",
    slidesToShow: 1,
    speed: 800,
    autoplay: true,
    autoplaySpeed: 4000,
    nextArrow: <CustomArrow prev={false} />,
    prevArrow: <CustomArrow prev={true}/>,
  };

  var settings2 = {
    dots: false,
    slidesToShow: 11,
    slidesToScroll: 1,
    nextArrow: <CustomArrow prev={false} />,
    prevArrow: <CustomArrow prev={true}/>,
  };
  
  return (
    <Fragment>
      {console.log("CATEGORIES", categories)}
      <section className="home-header">
        <div className="container">
          <div className="content-header">
            {/* <div className="rest-content-item">
              {smallBanner.map((image, i) =>
                <div className="small-banner-wrapper" key={i} style={{ backgroundImage: `url(${config.api_host}/api/image/${image.image.id})` }}></div>
                )}
              </div> */}
            <Slider {...settings} className="content3-item">
              {bigBanner.map((image, i) =>
                <div key={i} className="big-banner-wrapper">
                  <div className="big-banner">
                    <ImageLoad placeholder={Placeholder} src={`${config.api_host}/api/image/${image.image.id}`} alt="banner"/>
                  </div>
                </div>
              )}
            </Slider>
          </div>
          <div className="category-grid-ico">

            <Slider {...settings2} className="categories-slider">

              {
                categories.map((category, i) =>
                  <div className="cat-ico-wrapper" key={i}>
                    <div className="cat-ico">
                      <img src={`${config.api_host}/api/image/${category.image.id}`} alt="ico"/>
                    </div>
                    <span style={{ color: '#8296ab' }}>{category.name}</span>
                  </div>
                )
              }

            </Slider>

          </div>
        </div>
      </section>
    </Fragment>
  );
}
export default Header;