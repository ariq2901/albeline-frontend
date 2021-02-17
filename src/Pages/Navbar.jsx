import React, { Fragment, useEffect, useRef, useState } from "react";
import { Link, NavLink, Redirect, useHistory } from "react-router-dom";
import Avatar from "../assets/images/about.jpg";
import Logo from "../assets/images/Logo.svg";
import SignoutIco from "../assets/images/icons/signout.jpg";
import Cookies from "universal-cookie";
import { useDispatch, useSelector } from "react-redux";
import { config } from "../config";
import Axios from "axios";
import Swal from "sweetalert2";
const cookies = new Cookies();

const Navbar = () => {
  const CartReducer = useSelector(state => state.CartReducer);
  const RegisterShop = useSelector(state => state.RegisterShop);
  const dispatch = useDispatch();
  const [input, setInput] = useState(false);
  const [total, setTotal] = useState(0);
  const [clicked, setClicked] = useState(false);
  const [search, setSearch] = useState([]);
  const [cart, setCart] = useState([]);
  const [display, setDisplay] = useState(false);
  const [menu, setMenu] = useState(false);
  const [store, setStore] = useState();
  const [options, setOptions] = useState([]);
  const login = cookies.get("login");
  const searchRef = useRef(null);
  const node = useRef();
  let history = useHistory();
  
  const loginPopup = (truep) => {
    dispatch({ type: "CREDENTIAL_POPUP", open: truep });
  };

  const checkUserStore = async (token, unmounted) => {
    const url = `${config.api_host}/api/check-store`;
    const header = {'Authorization': config.bearer_token}
    
    try {
      const response = await Axios.get(url, {headers: header});
      if (!unmounted) {
        setStore(response.data.message);
      }
    } catch (e) {
      if (!unmounted) {
        console.error(e.message);
        if(Axios.isCancel(e)) {
          console.log(`request cancelled: ${e.message}`);
        } else {
          console.log('Another error happened:' + e.message);
        }
      }
    }
  }
  
  const handleCart = async (token, unmounted) => {
    const url = `${config.api_host}/api/get-cart`;
    const auth = {'Authorization': config.bearer_token}
    console.log('masuk sini');
    try {
      const response = await Axios.get(url, {headers: auth, cancelToken: token});
      if (!unmounted) {
        setTotal(response.data.data.products.length);
        console.log('response cart navbar', response);
      }
    } catch (e) {
      if (!unmounted) {
        console.error(e.message);
        if (Axios.isCancel(e)) {
          console.log(`request cancelled: ${e.message}`);
        } else {
          console.error('Another error happened: ' + e.message);
        }
      }
    }
  }

  const logout = async () => {
    const url = `${config.api_host}/api/logout`;
    const header = {'Authorization': `Bearer ${cookies.get('user_token')}`}

    try {
      const response = await Axios.get(url, {headers: header});
      cookies.remove('user');
      cookies.remove('user_token');
      cookies.remove('login');
      history.push('/');
      window.location.reload();
    } catch (e) {
      console.error(e.message);
      Swal.fire({icon: 'error', title: 'Oops...', text: e.message});
    }
  }

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

  const handleMenu = event => {
    if (node.current.contains(event.target)) {
      return;
    }

    setMenu(false);
  }

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
    let unmounted = false;
    let source = Axios.CancelToken.source();
    if (cookies.get('user_token') !== null) {
      checkUserStore(source.token, unmounted);
    }

    return () => {
      unmounted = true;
      source.cancel('Cancelling in cleanup');
    }
  }, [RegisterShop.registered]);

  useEffect(() => {
    let unmounted = false;
    let source = Axios.CancelToken.source();
    handleCart(source.token, unmounted);

    return () => {
      unmounted = true;
      source.cancel('Cancelling in cleanup');
    }
  }, [CartReducer.render]);

  useEffect(() => {
    document.addEventListener('mousedown', handleClick);
    if (login) {
      document.addEventListener('mousedown', handleMenu);
    }
    
    return () => {
      document.removeEventListener('mousedown', handleClick);
      document.removeEventListener('mousedown', handleMenu);
    }
  }, []);

  return (
    <Fragment>
      {console.log('CartReducer.render', CartReducer.render)}
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
                      <div className="badge-cart"><span>{total}</span></div>
                    ) : null}
                    <i className="bi bi-cart2"></i>
                  </NavLink>
                  <div className="wishlist">
                    <i className="bi bi-heart-fill"></i>
                  </div>
                  <button className="account">
                    <div ref={node} className={menu ? "menu" : "menu hide"}>
                      <div className="user-banner">
                        <div className="user-img-round"><img src={`${config.api_host}/api/image/${cookies.get('user').image.id}`} alt="user"/></div>
                        <div className="user-greeting">
                          <span className="greeting">{cookies.get('user').username}</span>
                          <span className="email-user">{cookies.get('user').email}</span>
                        </div>
                      </div>
                      <div className="menu-action">
                        <div className="user-store">
                          {store ? <button><Link to="/seller/dashboard">Seller Dashboard</Link></button> : <button><Link to="/open-shop">Open Shop</Link></button>}
                        </div>
                        <div className="more">
                          <Link to="history">Purchase History</Link>
                          <Link to="wishlist">Wishlist</Link>
                          <Link to="settings">Settings</Link>
                          <div className="signout" onClick={logout}>Sign out <img src={SignoutIco} alt="ico"/></div>
                        </div>
                      </div>
                    </div>
                    <div className="account-img" onClick={() => setMenu(!menu)} >
                      <img src={`${config.api_host}/api/image/${cookies.get('user').image.id}`} alt="profile" />
                    </div>
                  </button>
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
