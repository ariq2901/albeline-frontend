import React, { Fragment, useEffect, useState } from 'react';
import '@fortawesome/fontawesome-free/css/all.min.css';
import Slider from 'react-slick';
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import Banner from './Banner';
import Product from './Product';
import Axios from 'axios';
import { config } from '../../config';
import { CustomArrow } from '../Components/SliderCustomized';
import { currencyFormatter, soldFormatter } from '../../utils';
import FeaturedProduct from './FeaturedProduct';
import { useDispatch, useSelector } from 'react-redux';
import { Card4 } from '../Components/Card';

const ProductHome = () => {
  const dispatch = useDispatch();
  const [wishlist, setWishlist] = useState(false);
  const [product, setProduct] = useState([]);
  const [id, setId] = useState(0);
  const [clicked, setClicked] = useState(false);
  const [productId, setPorductId] = useState(0);

  useEffect(() => {
    let unmounted = false;
    let source = Axios.CancelToken.source();
    getData(source.token, unmounted);

    return function() {
      unmounted = true;
      source.cancel("Canceling in cleanup");
    };
  }, []);

  function getData(token, unmount) {
    const url = `${config.api_host}/api/products`;
    Axios.get(url, {cancelToken: token})
    .then(res => {
      if(!unmount) {
        setProduct(res.data.products);
      }
    })
    .catch(e => {
      if(!unmount) {
        console.error(e.message);
        if(Axios.isCancel(e)) {
          console.log(`request cancelled: ${e.message}`);
        } else {
          console.log('Another error happened:' + e.message);
        }
      }
    });
  }

  useEffect(() => {
    Quickview();
  }, [productId]);

  const Quickview = () => {
    if(clicked) {
      dispatch({type: 'SET_QUICKVIEW', open: true, id: productId});
    }
  }

  var settings = {
    customPaging: function(i) {
      return (
        <a>
          <div className="circle-slick-dots"></div>
        </a>
      );
    },
    dots: true,
    dotsClass: "slick-dots bp-dots slick-thumb",
    infinite: false,
    speed: 500,
    slidesToShow: 6,
    slidesToScroll: 1,
    nextArrow: <CustomArrow prev={false} />,
    prevArrow: <CustomArrow prev={true}/>
  };

  return (
    <Fragment>
      {console.log('product', product)}
      <section className="sect-product">
        <div className="container">
          <div className="best-price-wrapper">
            <div className="title-box">
              <div>
                <span className="bold-title">BEST</span> <span className="second-title">PRICE</span>
              </div>
            </div>
            <Slider {...settings} className="card-bp-wrapper">
              
              {product.map((product, i) =>
                <Card4 
                  name={product.name}
                  image={product.images[0].id}
                  productId={product.id}
                  price={product.price}
                  sold={product.sold}
                  key={i}
                  onQuickview={() => {Quickview(product.id); setPorductId(product.id); setClicked(true)}}
                  onWishlist={() => setWishlist(!wishlist)}
                  wishlist={wishlist}
                />
              )}

            </Slider>
          </div>
        </div>
        <Banner />
        <FeaturedProduct />
        <Product />
      </section>
    </Fragment>
  );
}

export default ProductHome;