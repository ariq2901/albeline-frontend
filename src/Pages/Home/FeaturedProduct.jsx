import Axios from 'axios';
import React, { Fragment, useEffect, useState } from 'react';
import Slider from 'react-slick';
import { config } from '../../config';
import { Card2 } from '../Components/Card';
import { CustomArrow } from '../Components/SliderCustomized';
import TallBanner from '../../assets/images/tallBanner.jfif';
import TallBanner2 from '../../assets/images/tallBanner2.jfif';
import TallBanner3 from '../../assets/images/tallBanner3.jfif';

function FeaturedProduct() {

  const [products, setProducts] = useState([]);
  const [ud, setUd] = useState(0);
  
  useEffect(() => {
    GetProducts();
  }, [ud]);
  
  const GetProducts = async () => {
    try {
      const url = `${config.api_host}/api/products`;
      const respons = await Axios.get(url);
      setProducts(respons.data.products);
    } catch(e) {
      console.error('Fail ', e);
    }
  }

  var settings = {
    dots: false,
    infinite: false,
    speed: 500,
    rows: 2,
    slidesToShow: 4,
    slidesToScroll: 1,
    nextArrow: <CustomArrow prev={false} />,
    prevArrow: <CustomArrow prev={true}/>
  };
  
  var settings2 = {
    arrows: false,
    infinite: true,
    speed: 500,
    autoplay: true,
    autoplaySpeed: 3000,
    slidesToShow: 1,
    slidesToScroll: 1,
  }

  return (
    <Fragment>
      {console.log('products', products)}
      <div className="container spacing-section">
      {/* featured-wrapper */}
        <div className="featured-wrapper">
          
          <Slider {...settings2} className="tall-banner">
            <img src={TallBanner} alt="banner"/>
            <img src={TallBanner2} alt="banner"/>
            <img src={TallBanner3} alt="banner"/>
          </Slider>
          <Slider {...settings} className="rows-slider">
              
              {products.map((product, i) => 
                <Card2 key={i} name={product.name} image={product.images[0].id} harga={product.harga} />
              )}

            </Slider>
        </div>
      </div>
    </Fragment>
  );
}
export default FeaturedProduct;