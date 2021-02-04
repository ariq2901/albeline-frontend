import React, { Fragment, useEffect, useRef, useState } from "react";
import { Link, NavLink, Redirect, useHistory } from "react-router-dom";
import Avatar from "../assets/images/about.jpg";
import Logo from "../assets/images/Logo.svg";
import Cookies from "universal-cookie";
import { useDispatch } from "react-redux";
import { config } from "../config";
import Axios from "axios";
const cookies = new Cookies();

const Navbar = () => {
  const dispatch = useDispatch();
  const [input, setInput] = useState(false);
  const [total, setTotal] = useState(0);
  const [clicked, setClicked] = useState(false);
  const [search, setSearch] = useState([]);
  const [display, setDisplay] = useState(false);
  const [options, setOptions] = useState([]);
  const login = cookies.get("login");
  const cart = cookies.get("cart");
  const searchRef = useRef(null);
  let history = useHistory();

  const loginPopup = (truep) => {
    dispatch({ type: "CREDENTIAL_POPUP", open: truep });
  };

  const keyDown = e => {
    e.preventDefault();
    const url = `${config.api_host}/api/search/products`;
    let name = document.getElementById('search-product').value;
    let payload = {name};

    console.log('payload', payload);
    Axios.post(url, payload)
    .then(response => {
      setOptions(response.data.products);
    }).catch(e => {
      console.error('Failure: ', e);
    })
  }

  // const search = e => {
  //   e.preventDefault();

  //   const url = `${config.api_host}/api/search/products`;
    
  // }

  const handleClick = event => {
    const {current: wrap} = searchRef;

    if (wrap && !wrap.contains(event.target)) {
      setDisplay(false);
    }
  }

  const setProduct = product => {
    setSearch(product);
    history.push({
      pathname: `/detail/${product}`,
    })
    setDisplay(false);
  }

  const handleDisplay = () => {
    let name = document.getElementById('search-product').value;
    if (name.length > 0) {
      setDisplay(true);
      return;
    }
    setDisplay(false);
  }

  useEffect(() => {
    if (cart !== undefined) {
      setTotal(cart.length);
    }
  }, [cart]);

  useEffect(() => {
    document.addEventListener('mousedown', handleClick);

    return () => {
      document.removeEventListener('mousedown', handleClick);
    }
  }, []);

  return (
    <Fragment>
      {console.log('options', options)}
      <nav>
        <div className="container">
          <div className="nav-wrapper">
            <div className="logo-wrapper">
              <Link to="/" style={{ textDecoration: "none" }} className="logo">
                <img src={Logo} alt="logo" />
              </Link>
              <Link to="/products" className="products-nav">Products</Link>
            </div>

            <div className={login === undefined ? "guest-wrapper" : "addon-wrapper"}>
              <div className={input ? "search-input-wrapper active" : "search-input-wrapper"}>
                <div className="search-input">
                  <form onSubmit={search} className={input ? "active" : ""}>
                    <input type="text" placeholder="Search..." onChange={e => {keyDown(e);handleDisplay();}} className={input ? "active" : ""} id="search-product" />
                  </form>
                  <button className="search-btn" onClick={(e) => setInput(!input)}>
                    {input ? <i class="bi bi-x s-logo"></i> : <i className="bi bi-search s-logo"></i>}
                  </button>
                </div>
              </div>
              {login === undefined ? (
                <button className="nav-login-btn" onClick={() => {setClicked(true);loginPopup(true);}} > Login </button>
              ) : (
                <Fragment>
                  <NavLink className="cart" to="/cart">
                    {total > 0 ? (
                      <div className="badge-cart">{total}</div>
                    ) : null}
                    <i className="bi bi-cart2"></i>
                  </NavLink>
                  <div className="wishlist">
                    <i className="bi bi-heart-fill"></i>
                  </div>
                  <div className="account">
                    <img src={Avatar} alt="profile" />
                  </div>
                </Fragment>
              )}
            </div>
          </div>
        </div>
        {display && (
          <div ref={searchRef} className="auto-container">
            {options.slice(0, 5).map((v, i) =>{
              return (
                <div onClick={() => setProduct(v.id)} className="auto-option" key={i} tabIndex="0">
                  <div className="icon-option">
                    <img src={`${config.api_host}/api/image/${v.images[0].id}`} alt="img-ico"/>
                  </div>
                  <div className="name-option">
                    <span>{v.name}</span>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </nav>
    </Fragment>
  );
};

export default Navbar;
