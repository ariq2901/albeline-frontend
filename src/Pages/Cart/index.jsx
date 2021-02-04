import React, { Fragment, useEffect, useState } from "react";
import Cookies from "universal-cookie";
import { currencyFormatter, soldFormatter } from "../../utils";
import { config } from "../../config";
const cookies = new Cookies();

const Cart = () => {
  const cart = cookies.get("cart");
  const [products, setProducts] = useState([]);
  const [value, setValue] = useState();

  useEffect(() => {
    if (cart !== undefined) {
      setProducts(cart);
    }
  }, []);

  const setAmount = (type, id) => {
    if (type === "increment") {
      // let objIndex = products.findIndex((obj) => obj.id == id);
      // products[objIndex].amount = products[objIndex].amount + 1;
      // let objIndex = products.findIndex((obj) => obj.id == id);
      // [
      //   ...products.slice(0, objIndex),
      //   Object.assign({}, products[objIndex], ...products.slice(objIndex + 1)),
      // ];
    }
    if (type === "decrement") {
      setValue(value - 1);
    }
  };

  const subtotal = (p) => {
    if (p.length === 0) {
      return;
    }
    var amounts = [];
    p.map((product) => {
      amounts.push(product.harga);
    });

    return currencyFormatter(amounts.reduce(sumFunction));
  };

  function sumFunction(total, num) {
    return total + num;
  }

  return (
    <Fragment>
      {console.log("products", products)}
      {console.log("value", value)}
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
                      <img
                        src={`${config.api_host}/api/image/${product.image.id}`}
                        alt="product"
                      />
                    </div>
                    <div className="product-name">
                      <div
                        className="truncate"
                        style={{ WebkitLineClamp: "1" }}
                      >
                        <span className="name">{product.name}</span>
                      </div>
                      <span>{soldFormatter(product.sold)}</span>
                    </div>
                    <div className="input-amount">
                      <button
                        onClick={() => setAmount("decrement", product.id)}
                      >
                        <i class="fas fa-minus"></i>
                      </button>
                      <input
                        type="text"
                        name="amount"
                        disabled
                        value={product.amount}
                      />
                      <button
                        onClick={() => setAmount("increment", product.id)}
                      >
                        <i class="fas fa-plus"></i>
                      </button>
                    </div>
                    <div className="total-price">
                      <span>{currencyFormatter(product.harga)}</span>
                    </div>
                    <div className="remove-cart">
                      <i class="fas fa-times"></i>
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
                    <span>{subtotal(products)}</span>
                  </div>
                </div>
                <hr className="payment-divider" />
                <div className="checkout-total">
                  <div className="total-price">Subtotal</div>
                  <div className="price-amount">{subtotal(products)}</div>
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
