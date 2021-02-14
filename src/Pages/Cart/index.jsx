import React, { Fragment, useEffect, useState } from "react";
import Cookies from "universal-cookie";
import { currencyFormatter, soldFormatter } from "../../utils";
import { config } from "../../config";
import { useDispatch, useSelector } from "react-redux";
import Axios from "axios";
import ImageLoad from "../Components/ImageLoad";
import Placeholder from '../../assets/images/clip-art/placeholder.png';
const cookies = new Cookies();

const Cart = () => {
  const dispatch = useDispatch();
  const CartReducer = useSelector(state => state.CartReducer);
  const [products, setProducts] = useState([]);
  const [value, setValue] = useState();
  const [loading, setLoading] = useState(false);

  const getCart = async (token, unmounted) => {
    const url = `${config.api_host}/api/get-cart`;
    const auth = { 'Authorization': config.bearer_token }
    console.log('masuk sini');
    try {
      const response = await Axios.get(url, { headers: auth, cancelToken: token });
      if (!unmounted) {
        setProducts(response.data.data.products);
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

  const removeItem = async (product_id) => {
    const url = `${config.api_host}/api/remove-cart`
    const body = { product_id }
    const auth = { 'Authorization': config.bearer_token }

    setLoading(true)
    try {
      const response = await Axios.post(url, body, { headers: auth });
      console.log('response', response);
      dispatch({ type: "CART_RENDER" });
      setLoading(false)
    } catch (error) {
      console.error(error.message);
      setLoading(false)
    }
  }

  useEffect(() => {
    let unmounted = false;
    let source = Axios.CancelToken.source();
    getCart(source.token, unmounted);

    return () => {
      unmounted = true;
      source.cancel('Cancelling in cleanup');
    }
  }, [CartReducer.render]);
  // const setAmount = (type, id) => {
  //   if (type === "increment") {
  //     // let objIndex = products.findIndex((obj) => obj.id == id);
  //     // products[objIndex].amount = products[objIndex].amount + 1;
  //     // let objIndex = products.findIndex((obj) => obj.id == id);
  //     // [
  //     //   ...products.slice(0, objIndex),
  //     //   Object.assign({}, products[objIndex], ...products.slice(objIndex + 1)),
  //     // ];
  //   }
  //   if (type === "decrement") {
  //     setValue(value - 1);
  //   }
  // };

  // // const subtotal = (p) => {
  // //   if (p.length === 0) {
  // //     return;
  // //   }
  // //   var amounts = [];
  // //   p.map((product) => {
  // //     amounts.push(product.harga);
  // //   });

  // //   return currencyFormatter(amounts.reduce(sumFunction));
  // // };

  // // function sumFunction(total, num) {
  // //   return total + num;
  // // }

  return (
    <Fragment>
      <section className="cart-sect">
        <div className="cart-cont">
          <div className="cart-title">
            <span>Shopping Cart</span>
          </div>
          <div className="cart-content">
            <div className="cart-main">
              <div className="cart-list">
                {products.map((product) => (
                  <div className="cart-card">
                    <div className="product-image">
                      <ImageLoad placeholder={Placeholder} src={`${config.api_host}/api/image/${product.image[0].id}`} alt="product"
                      />
                    </div>
                    <div className="product-name">
                      <div className="truncate" style={{ WebkitLineClamp: "1" }} >
                        <span className="name">{product.name}</span>
                      </div>
                      <span>{soldFormatter(product.sold)}</span>
                    </div>
                    <div className="input-amount">
                      <button
                      // onClick={() => setAmount("decrement", product.id)}
                      >
                        <i class="fas fa-minus"></i>
                      </button>
                      <input type="text" name="amount" disabled value={product.amount} />
                      <button
                      // onClick={() => setAmount("increment", product.id)}
                      >
                        <i class="fas fa-plus"></i>
                      </button>
                    </div>
                    <div className="total-price">
                      <span>{currencyFormatter(product.price)}</span>
                    </div>
                    <div className="remove-cart">
                      <button disabled={loading} style={{ cursor: loading ? 'not-allowed' : 'pointer' }} onClick={() => removeItem(product.id)}><i class="fas fa-times"></i></button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className="cart-checkout-wrapper">
              <div className="cart-checkout">
                <div className="pay-title">
                  <span>Shopping Summary</span>
                </div>
                <div className="detail-payment">
                  <div className="total-price">
                    <span>Total Price ({products.length} item)</span>
                  </div>
                  <div className="price-amount">
                    <span>{/* {subtotal(products)} */}</span>
                  </div>
                </div>
                <hr className="payment-divider" />
                <div className="checkout-total">
                  <div className="total-price">Subtotal</div>
                  <div className="price-amount">{/* {subtotal(products)} */}</div>
                </div>
                <button>Beli</button>
              </div>
            </div>
          </div>
        </div>
      </section>
    </Fragment>
  );
};
export default Cart;
