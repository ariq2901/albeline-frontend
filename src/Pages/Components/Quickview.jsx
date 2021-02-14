import Axios from 'axios';
import React, { Fragment, useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Slider from 'react-slick';
import { config } from '../../config';
import { currencyFormatter, ratingFormatter, soldFormatter } from '../../utils';
import { CustomArrow } from './SliderCustomized';

const Quickview = () => {
  //^ Redux 
  const QReducer = useSelector(state => state.QReducer);
  const dispatch = useDispatch();

  //^ Local State
  const [product, setProduct] = useState([]);
  const [images, setImages] = useState([]);
  const [categories, setCategories] = useState([]);

  //^ Ref node
  const node = useRef();

  useEffect(() => {
    const source = Axios.CancelToken.source();
    getProduct(source.token);

    return () => {
      source.cancel();
    }
  }, [QReducer.id]);

  async function getProduct(source) {
    const url = `${config.api_host}/api/product/${QReducer.id}`;
    try {
      const response = await Axios.get(url, {cancelToken: source});
      setProduct(response.data.product);
      setImages(response.data.product.image);
      const cat = response.data.product.categories.map(item => {
        let container = [];
        container = item.name;
        return container;
      })

      setCategories(cat);
    } catch(e) {
      console.error("Failure ", e);
    }
  }
  

  var settings = {
    customPaging: function(i) {
      if(i !== null) {
        for(var a = -1; a < i; a++) {
          var imageCount = images[0].id + a;
        }
      }

      return (
        <a>
          <img className="image-dots" src={`${config.api_host}/api/image/${imageCount + 1}`}></img>
        </a>
      );
    },
    dots: true,
    dotsClass: "slick-dots quickview-dots slick-thumb",
    arrows: true,
    nextArrow: <CustomArrow prev={false} />,
    prevArrow: <CustomArrow prev={true}/>,
    infinite: false,
    slidesToShow: 1,
    slidesToScroll: 1,
  }

  const handleClick = (e) => {
    if(node.current.contains(e.target)) {
      return;
    }
    
    dispatch({type: 'SET_POPUP', open: false});
  }

  useEffect(() => {
    document.addEventListener("mousedown", handleClick);

    return () => {
      document.removeEventListener("mousedown", handleClick);
    };
  }, []);

  useEffect(() => {
    var overlay_popup = document.getElementsByClassName("overlay-popup");
    if(QReducer.open === true) {
      document.getElementsByTagName("html")[0].style.overflowY = "hidden";
      for (let i = 0; i < overlay_popup.length; i++) {
        document.getElementsByClassName("overlay-popup")[i].classList.add("popup-open");
      }
    } else if(overlay_popup.length && QReducer.open === false) {
      document.getElementsByTagName("html")[0].style.overflowY = "scroll";
      for (let i = 0; i < overlay_popup.length; i++) {
        document.getElementsByClassName("overlay-popup")[i].classList.remove("popup-open");
      }
    }
  }, [QReducer.open]);

  return (
    <Fragment>
      <div ref={node} className="quickview-node">
        {QReducer.open && (
          <div className="quickview-modal">
            <div className="quickview-slider">
              <Slider {...settings}>

                {images.map((image, i) =>
                  <div key={i} className="quickview-image">
                    <div style={{backgroundImage: `url(${config.api_host}/api/image/${image.id})`, backgroundPosition: "center"}}></div>
                  </div>
                )}

              </Slider>
            </div>
            <div className="quickview-inline">
              <div className="quickview-info">
                <div className="quickview-name"><span>{product.name}</span></div>
                <div className="quickview-scale">
                  <div className="quickview-rating">{ratingFormatter(product.rate)}</div>
                  <div className="quickview-sold">{soldFormatter(product.sold)}</div>
                </div>
                <div className="quickview-price-title">Our Price</div>
                <div className="quickview-price">{currencyFormatter(product.price)}</div>
                <div className="quickview-description"><p>{product.description}</p></div>

                <div className="quickview-action">
                  <div className="q-action-title">available :</div>
                  <div className="q-action">
                    <input type="number" name="quantity" id="quantity" disabled value={product.stock}/>
                    <button className="q-cart">
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-bag-check" viewBox="0 0 16 16">
                        <path fill-rule="evenodd" d="M10.854 8.146a.5.5 0 0 1 0 .708l-3 3a.5.5 0 0 1-.708 0l-1.5-1.5a.5.5 0 0 1 .708-.708L7.5 10.793l2.646-2.647a.5.5 0 0 1 .708 0z"/>
                        <path d="M8 1a2.5 2.5 0 0 1 2.5 2.5V4h-5v-.5A2.5 2.5 0 0 1 8 1zm3.5 3v-.5a3.5 3.5 0 1 0-7 0V4H1v10a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V4h-3.5zM2 5h12v9a1 1 0 0 1-1 1H3a1 1 0 0 1-1-1V5z"/>
                      </svg>
                      Add To Cart
                    </button>
                    <div className="q-wishlist">
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-heart-fill" viewBox="0 0 16 16">
                        <path fill-rule="evenodd" d="M8 1.314C12.438-3.248 23.534 4.735 8 15-7.534 4.736 3.562-3.248 8 1.314z"/>
                      </svg>
                    </div>
                  </div>
                </div>

                <div className="quickview-category">
                  <span className="quickview-category-title">Categories: &nbsp;</span>
                  {categories.join(', ')}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </Fragment>
  );
}

export default Quickview;