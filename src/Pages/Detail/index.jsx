import { currencyFormatter, inStockFormatter, ratingFormatter, ratingTextFormatter, soldFormatter, } from "../../utils";
import StarRound from "../../assets/images/clip-art/star-round-icon.svg";
import React, { Fragment, useEffect, useRef, useState } from "react";
import { CustomArrow } from "../Components/SliderCustomized";
import { useParams, withRouter } from "react-router-dom";
import Truck from "../../assets/images/icons/truck.svg";
import { useDispatch, useSelector } from "react-redux";
import { ReviewCard } from "../Components/Card";
import Cookies from "universal-cookie";
import { config } from "../../config";
import Select from "react-select";
import Slider from "react-slick";
import PulseLoader from 'react-spinners/PulseLoader'
import Axios from "axios";
import Swal from "sweetalert2";

const cookies = new Cookies();

function usePrevious(value) {
  const ref = useRef();
  useEffect(() => {
    ref.current = value;
  });
  return ref.current;
}

const Detail = (props) => {
  let { id } = useParams();
  const dispatch = useDispatch();
  const CartReducer = useSelector(state => state.CartReducer);
  const [product, setProduct] = useState([]);
  const [store, setStore] = useState([]);
  const [images, setImages] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [reveal, setReveal] = useState(false);
  const [groupedOptions, setGroupedOptions] = useState([]);
  const [provinces, setProvinces] = useState([]);
  const [destination, setDestination] = useState({
    value: "152",
    label: "Jakarta Pusat",
    province: "DKI Jakarta",
  });
  const [isDisplay, setIsDisplay] = useState(false);
  const [berat, setBerat] = useState(1000);
  const [origin, setOrigin] = useState({ name: "Jakarta Barat", value: "151" });
  const [courier, setCourier] = useState("jne");
  const [ongkir, setOngkir] = useState(0);
  const [loading, setLoading] = useState(false);
  const cart = cookies.get("cart");
  const arr = [product];

  const prevDestination = usePrevious(destination);
  const node = useRef();

  const getProduct = async (token) => {
    if (id !== 0) {
      try {
        const response = await Axios.get(
          `${config.api_host}/api/product/${id}`,
          { cancelToken: token }
        );
        console.log("response", response);
        setReviews(response.data.product.reviews);
        setStore(response.data.product.store);
        setProduct(response.data.product);
        setImages(response.data.product.image);
      } catch (e) {
        if (Axios.isCancel(e)) {
        } else {
          throw e;
        }
      }
    }
  };

  const getCity = async (token) => {
    // own Proxy Server
    const proxUrl = `${config.api_rajaongkir}/city`;
    // const url = 'https://cors-anywhere.herokuapp.com/https://api.rajaongkir.com/starter/city';
    try {
      let response = await Axios.get(proxUrl, {
        headers: { key: "11fa41eaf62c64584a90b03a759c5296" },
        cancelToken: token,
      });

      await new Promise((resolve, reject) => setTimeout(resolve, 3000));

      var contain = response.data.rajaongkir.results.map((result) => ({
        value: result.city_id,
        label: result.city_name,
        province: result.province,
      }));

      var provinsi = response.data.rajaongkir.results.map((result) => ({
        label: result.province,
      }));

      removeDuplicate(provinsi, contain);
    } catch (e) {
      if (Axios.isCancel(e)) {
      } else {
        throw e;
      }
    }
  };

  useEffect(() => {
    if (prevDestination !== destination) {
      estOngkir();
    }
  }, [destination]);

  const estOngkir = async () => {
    if (destination) {
      const url = `${config.api_rajaongkir}/cost`;
      const headers = {
        key: "11fa41eaf62c64584a90b03a759c5296",
        "Content-Type": "application/json",
      };
      const body = {
        origin: origin.value,
        destination: destination.value,
        weight: berat,
        courier: courier,
      };
      console.log("body", body);
      try {
        let response = await Axios.post(url, body, { headers: headers });
        console.log("ONGKIR ", response);
        setOngkir(response.data.rajaongkir.results[0].costs[0].cost[0].value);
      } catch (e) {
        console.error("Failure: " + e);
      }
    }
  };

  function removeDuplicate(p, c) {
    let uniqueProvince = Array.from(new Set(p.map((a) => a.label)));
    var i = 0;
    var groupedOptions = [];
    for (i = 0; i < uniqueProvince.length; i++) {
      const filteredCity = c.filter(
        (city) => city.province == uniqueProvince[i]
      );
      groupedOptions[i] = {
        label: uniqueProvince[i],
        options: [...filteredCity, filteredCity],
      };
      groupedOptions[i]["options"].pop();
    }
    console.log("groupedOptions", groupedOptions);
    setGroupedOptions(groupedOptions);
  }

  const handleBack = () => {
    props.history.goBack();
  };

  const handleSelect = (destination) => {
    setDestination(destination);
  };

  const handleClick = (e) => {
    if (node.current.contains(e.target)) {
      return;
    }

    setIsDisplay(false);
  };

  const handleOpen = () => {
    setIsDisplay(!isDisplay);
  };

  const existCheck = () => {
    if (cart !== undefined) {
      const checker = cart.map((crt) => {
        console.log("crt", crt.name);
        if (crt.name === product.name) {
          return false;
        }
      });
      if (checker.includes(false)) {
        return false;
      }
    }
  };

  // const addToCart = () => {
  //   const check = existCheck();
  //   const toCookie = {};
  //   toCookie["id"] = product.id;
  //   toCookie["name"] = product.name;
  //   toCookie["harga"] = product.harga;
  //   toCookie["sold"] = product.sold;
  //   toCookie["image"] = product.image[0];
  //   toCookie["amount"] = 1;

  //   console.log("toCookie", toCookie);
  //   if (check === false) {
  //     return false;
  //   }
  //   if (cart !== undefined) {
  //     cookies.set("cart", [toCookie, ...cart]);
  //     return;
  //   } else {
  //     cookies.set("cart", [toCookie]);
  //   }
  // };

  const handleCart = async (id) => {
    const url = `${config.api_host}/api/get-cart`;
    const header = { 'Authorization': `Bearer ${cookies.get('user_token')}` }
    setLoading(true);
    try {
      const response = await Axios.get(url, { headers: header });
      var list_cart = response.data.data.products;
      addToCart(id, list_cart);
    } catch (error) {
      console.error(error.message);
      if (error.response.status === 401) {
        Swal.fire({icon: 'warning', title: 'Unauthorized', text: 'Please login first'});
      }
      setLoading(false)
    }
  }

  const addToCart = async (id, list) => {
    let list_id = [];
    list.map((product) => {
      list_id.push(product.id)
    });

    let check_id = list_id.includes(id);
    const url = `${config.api_host}/api/update-cart`;
    const header = { 'Authorization': `Bearer ${cookies.get('user_token')}` }
    const body = { product_id: [id] }
    console.log('check_id', check_id);
    if (check_id) {
      setLoading(false)
      alert('You\'ve added this product last time');
      return false;
    } else {
      try {
        const response_add = await Axios.post(url, body, { headers: header });
        dispatch({type: 'CART_RENDER'})
        console.log('response_add', response_add);
        setLoading(false)
      } catch (error) {
        console.error(error.message);
        setLoading(false)
      }
    }
  }

  useEffect(() => {
    document.addEventListener("mousedown", handleClick);

    return () => {
      document.removeEventListener("mousedown", handleClick);
    };
  }, []);

  useEffect(() => {
    const source = Axios.CancelToken.source();
    getProduct(source.token);
    getCity(source.token);
    return () => {
      source.cancel();
    };
  }, []);

  var settings = {
    customPaging: function (i) {
      if (i !== null) {
        for (var a = -1; a < i; a++) {
          var imageCount = images[0].id + a;
        }
      }

      return (
        <a>
          <img
            className="image-dots"
            src={`${config.api_host}/api/image/${imageCount + 1}`}
          ></img>
        </a>
      );
    },
    dots: true,
    dotsClass: "slick-dots quickview-dots slick-thumb",
    arrows: true,
    nextArrow: <CustomArrow prev={false} />,
    prevArrow: <CustomArrow prev={true} />,
    infinite: false,
    speed: 500,
    // autoplay: true,
    autoplaySpeed: 3000,
    slidesToShow: 1,
    slidesToScroll: 1,
  };

  const groupStyles = {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
  };

  const groupBadgeStyles = {
    backgroundColor: "#EBECF0",
    borderRadius: "2em",
    color: "#172B4D",
    display: "inline-block",
    fontSize: 12,
    fontWeight: "normal",
    lineHeight: "1",
    minWidth: 1,
    padding: "0.16666666666667em 0.5em",
    textAlign: "center",
  };

  const formatGroupLabel = (data) => (
    <div style={groupStyles}>
      <span>{data.label}</span>
      <span style={groupBadgeStyles}>{data.options.length}</span>
    </div>
  );

  return (
    <Fragment>
      <div className="overlay-popup">
        <section className="detail-sect">
          <div className="detail-cont">
            <div className="box" style={{ height: "505px" }}>
              <div className="detail-back" onClick={handleBack}>
                <i className="fas fa-long-arrow-alt-left"></i>
              </div>
              <div className="detail-slider">
                <Slider {...settings}>
                  {images.map((image, i) => (
                    <div className="detail-image" key={i}>
                      <div
                        style={{
                          backgroundImage: `url(${config.api_host}/api/image/${image.id})`,
                          backgroundPosition: "center",
                        }}
                      ></div>
                    </div>
                  ))}
                </Slider>
              </div>
              <div className="detail-inline">
                <div className="detail-info">
                  <span className="detail-name">{product.name}</span>
                  <div className="detail-status">
                    <div className="detail-rating">
                      {ratingTextFormatter(product.rating)}{" "}
                      {ratingFormatter(product.rate)}
                    </div>
                    <div className="detail-sold">
                      {soldFormatter(product.sold)}
                    </div>
                  </div>
                  <div className="status-stock">
                    {inStockFormatter(product.jumlah)}
                  </div>
                  <div className="detail-description-wrapper">
                    <div
                      className={
                        reveal
                          ? "detail-description reveal"
                          : "detail-description compact"
                      }
                    >
                      <p>{product.description}</p>
                    </div>
                    <button
                      className="reveal-description-btn"
                      onClick={() => setReveal(!reveal)}
                    >
                      {reveal ? (
                        <i className="fas fa-chevron-up"></i>
                      ) : (
                          <i className="fas fa-chevron-down"></i>
                        )}
                    </button>
                  </div>
                  <div className="detail-harga">
                    <span>{currencyFormatter(product.harga)}</span>
                  </div>
                  <div className="detail-action">
                    <button
                      className="detail-addtocart"
                      onClick={() => handleCart(product.id)}
                      disabled={loading}
                      style={{ cursor: loading ? 'not-allowed' : 'pointer' }}
                    >
                      {loading ?
                        <PulseLoader size="8" color="#fff" /> :
                        <Fragment>
                          <svg xmlns="http://www.w3.org/2000/svg" width="19" height="19" fill="currentColor" className="bi bi-cart3" viewBox="0 0 16 16">
                            <path d="M0 1.5A.5.5 0 0 1 .5 1H2a.5.5 0 0 1 .485.379L2.89 3H14.5a.5.5 0 0 1 .49.598l-1 5a.5.5 0 0 1-.465.401l-9.397.472L4.415 11H13a.5.5 0 0 1 0 1H4a.5.5 0 0 1-.491-.408L2.01 3.607 1.61 2H.5a.5.5 0 0 1-.5-.5zM3.102 4l.84 4.479 9.144-.459L13.89 4H3.102zM5 12a2 2 0 1 0 0 4 2 2 0 0 0 0-4zm7 0a2 2 0 1 0 0 4 2 2 0 0 0 0-4zm-7 1a1 1 0 1 1 0 2 1 1 0 0 1 0-2zm7 0a1 1 0 1 1 0 2 1 1 0 0 1 0-2z" />
                          </svg>
                          <span>ADD TO CART</span>
                        </Fragment>
                      }
                    </button>
                    <div className="detail-whislist">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="25"
                        height="25"
                        fill="currentColor"
                        className="bi bi-heart"
                        viewBox="0 0 16 16"
                      >
                        <path d="M8 2.748l-.717-.737C5.6.281 2.514.878 1.4 3.053c-.523 1.023-.641 2.5.314 4.385.92 1.815 2.834 3.989 6.286 6.357 3.452-2.368 5.365-4.542 6.286-6.357.955-1.886.838-3.362.314-4.385C13.486.878 10.4.28 8.717 2.01L8 2.748zM8 15C-7.333 4.868 3.279-3.04 7.824 1.143c.06.055.119.112.176.171a3.12 3.12 0 0 1 .176-.17C12.72-3.042 23.333 4.867 8 15z" />
                      </svg>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="box" style={{ height: "20vh", marginTop: "2vh" }}>
              <div className="inner-box">
                <div className="box-toko">
                  <div className="img-toko">
                    <img
                      src={`${config.api_host}/api/image/${store.image}`}
                      alt="toko"
                    />
                  </div>
                  <div className="action-toko">
                    <div className="name-toko">
                      <span>{store.name}</span>
                    </div>
                    <div className="go-toko">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="16"
                        height="16"
                        fill="currentColor"
                        class="bi bi-shop-window"
                        viewBox="0 0 16 16"
                      >
                        <path d="M2.97 1.35A1 1 0 0 1 3.73 1h8.54a1 1 0 0 1 .76.35l2.609 3.044A1.5 1.5 0 0 1 16 5.37v.255a2.375 2.375 0 0 1-4.25 1.458A2.371 2.371 0 0 1 9.875 8 2.37 2.37 0 0 1 8 7.083 2.37 2.37 0 0 1 6.125 8a2.37 2.37 0 0 1-1.875-.917A2.375 2.375 0 0 1 0 5.625V5.37a1.5 1.5 0 0 1 .361-.976l2.61-3.045zm1.78 4.275a1.375 1.375 0 0 0 2.75 0 .5.5 0 0 1 1 0 1.375 1.375 0 0 0 2.75 0 .5.5 0 0 1 1 0 1.375 1.375 0 1 0 2.75 0V5.37a.5.5 0 0 0-.12-.325L12.27 2H3.73L1.12 5.045A.5.5 0 0 0 1 5.37v.255a1.375 1.375 0 0 0 2.75 0 .5.5 0 0 1 1 0zM1.5 8.5A.5.5 0 0 1 2 9v6h12V9a.5.5 0 0 1 1 0v6h.5a.5.5 0 0 1 0 1H.5a.5.5 0 0 1 0-1H1V9a.5.5 0 0 1 .5-.5zm2 .5a.5.5 0 0 1 .5.5V13h8V9.5a.5.5 0 0 1 1 0V13a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V9.5a.5.5 0 0 1 .5-.5z" />
                      </svg>
                      <span>Kunjungi Toko</span>
                    </div>
                  </div>
                </div>
                <div className="box-pengiriman">
                  <div className="from-location">
                    <div className="from-title">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="16"
                        height="16"
                        fill="currentColor"
                        class="bi bi-geo-alt-fill"
                        viewBox="0 0 16 16"
                      >
                        <path d="M8 16s6-5.686 6-10A6 6 0 0 0 2 6c0 4.314 6 10 6 10zm0-7a3 3 0 1 1 0-6 3 3 0 0 1 0 6z" />
                      </svg>
                      <span>Barang dikirim dari</span>
                    </div>
                    <div className="from-point">
                      <b>Jakarta Barat</b>
                    </div>
                  </div>
                  <div className="to-location">
                    <div className="to-title">
                      <img src={Truck} alt="ico" />
                      <span>Ongkir mulai dari</span>
                    </div>
                    <div className="to-point">
                      <p onClick={handleOpen}>
                        <b>{currencyFormatter(ongkir)}</b> ke{" "}
                        <b>{destination.label}</b>{" "}
                        <i
                          className="fas fa-chevron-down"
                          style={{
                            transformOrigin: "60% 40%",
                            transform: isDisplay ? "rotate(180deg)" : "",
                            transition: "all 0.3s ease",
                          }}
                        ></i>
                      </p>
                      <div ref={node} className="destination-popup">
                        {isDisplay ? (
                          <Select
                            options={groupedOptions}
                            formatGroupLabel={formatGroupLabel}
                            value={destination}
                            onChange={handleSelect}
                            autoFocus={true}
                          />
                        ) : null}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="box" style={{ marginTop: '2vh', padding: '20px' }}>
              <div className="reviews-title"><span>Reviews and rating</span></div>
              <div className="reviews-stats">
                <div className="reviews-area">
                  {reviews.map((review) =>
                    <ReviewCard comment={review.comment} rate={review.rate} username={review.user.name} avatar={review.user.image} created_at={review.created_at} />
                  )}
                </div>
                <div className="overall-rating">
                  <span className="overall-rating-title"><div className="star-round"><img src={StarRound} alt="star-ico" /></div> Overall Rating</span>
                  <div className="inner-overall-rating">
                    <div className="overall-rating-text">
                      <span className="product-rating-text">{ratingTextFormatter(product.rate)}</span>
                      <span className="slash-rating">/</span>
                      <span className="full-rating">5</span>
                    </div>
                    <div className="overall-star">{ratingFormatter(product.rate)}</div>
                    <div className="total-reviews">{reviews.length} reviews</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    </Fragment>
  );
};
export default withRouter(Detail);
