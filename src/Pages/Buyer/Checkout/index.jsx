import React, { Fragment, useEffect, useState } from 'react'
import { useHistory } from 'react-router-dom';
import { currencyFormatter } from '../../../utils';
import Cookie from 'universal-cookie';
import { useDispatch, useSelector } from 'react-redux';
import { config } from '../../../config';
import Axios from 'axios';
var cookies = new Cookie();

export const Checkout = () => {
  const CheckoutReducer = useSelector(state => state.CheckoutReducer);
  const [downed, setDowned] = useState([]);
  const [downed2, setDowned2] = useState(false);
  const [loading, setLoading] = useState(false);
  const [render, setRender] = useState(0);
  const [courier, setCourier] = useState('');
  const [groupedProducts, setGroupedProducts]= useState([]);
  const dispatch = useDispatch();
  let user = cookies.get('user');
  let history = useHistory();

  const handleDown = (store) => {
    groupedProducts.map((item) => {
      if (item.store === store) {
        item.downed = !item.downed
        setRender(render => render + 1)
      }
    })
  }
  const handleDown2 = (store) => {
    groupedProducts.map((item) => {
      if (item.store === store) {
        item.downed2 = !item.downed2
        setRender(render => render + 1)
      }
    })
  }
  const handleBillInfo = (store) => {
    groupedProducts.map((item) => {
      if (item.store === store) {
        item.bill_window = !item.bill_window
        setRender(render => render + 1)
      }
    })
  }
  const handleCourier = (store, courier) => {
    var per_product = [];
    let weight;
    
    groupedProducts.map((item) => {  
      item.products.map((product) => {
        let count = (product.heavy * product.amount)
        per_product = [...per_product, count]
      })
      
      weight = per_product.reduce((a, b) => a + b, 0).toString();
      
      if (item.store === store) {
        item.courier = courier
        getCost(store, item.store_address, item.courier, weight)
        setRender(render => render + 1)
      }
    })
  }
  const handleSelectedService = (store, service, cost, est) => {
    console.log('est', est)
    groupedProducts.map((item) => {
      if (item.store === store) {
        item.selected_service = service;
        item.courier_cost = cost;
        item.estimated_time = est;
        setRender(render => render + 1)
      }
    })
  }

  const getCost = async (store, store_address, courier, weight) => {
    const url = `http://localhost:2901/proxy/starter/cost`;
    const headers = {
      key: "11fa41eaf62c64584a90b03a759c5296",
      "Content-Type": "application/json",
    }
    const body = {
      origin: store_address,
      destination: cookies.get('user').city_id,
      weight: weight,
      courier: courier
    }
    console.log('body', body);
    try {
      const response = await Axios.post(url, body, {headers: headers})
      console.log('response get cost', response)
      groupedProducts.map((item) => {
        if (item.store === store) {
          item.services = response.data.rajaongkir.results[0].costs
        }
      })
      setRender(render => render + 1)
    } catch(error) {
      console.error('Fail get cost: ', error);
    }
  }

  function groupBy(list, keyGetter) {
    const map = new Map();
    list.forEach((item) => {
      const key = keyGetter(item);
      const collection = map.get(key);
      if (!collection) {
        map.set(key, [item]);
      } else {
        collection.push(item);
      }
    });
    return map;
  }

  const grouped = groupBy(CheckoutReducer.products, product => product.store);

  useEffect(() => {
    setLoading(true);

    let list = [];
    var result = CheckoutReducer.products.map((product) => {
      list.push(product.store);
    });

    let unique = [...new Set(list)]
    var grouped_products = [];
    var per_product = [];
    let subtotal;
    unique.map((store) => {

      grouped.get(store).map((product) => {
        let count = (product.price * product.amount)
        per_product = [...per_product, count]
      })
      
      subtotal = per_product.reduce((a, b) => a + b, 0);
      per_product = [];

      let store_resource = {store: store, store_address: grouped.get(store)[0].store_address, store_city_name: grouped.get(store)[0].store_city_name, downed: false, downed2: false, bill_window: false, courier: '', courier_cost: 0, services: [], selected_service: '', estimated_time: '', products: grouped.get(store), subtotal: subtotal};
      grouped_products.push(store_resource);
    });

    const handleCourier = (store, courier) => {
      var per_product = [];
      let weight;
      
      groupedProducts.map((item) => {  
        item.products.map((product) => {
          let count = (product.heavy * product.amount)
          per_product = [...per_product, count]
        })
        
        weight = per_product.reduce((a, b) => a + b, 0).toString();
        
        if (item.store === store) {
          item.courier = courier
          getCost(store, item.store_address, item.courier, weight)
          setRender(render => render + 1)
        }
      })
    }

    // console.log('grouped_products', grouped_products);
    setGroupedProducts(grouped_products);
    
    setLoading(false);
  }, [])


  return (
    <Fragment>
      {console.log('groupedProducts', groupedProducts)}
      <section className="checkout-sect" style={{ height: "200px" }}>
        <div className="container">
          <div className="inner-box">
            <div className="checkout-title"><h4>Checkout</h4></div>
            <div className="checkout-grid mt-4">
              <div className="checkout-main">
                <div className="box-address">
                  <div className="box-heading"><h6 style={{ fontWeight: 'bold' }}>Destination Address</h6></div>
                  <div className="box-main-content">
                    <div>
                      <div className="box-content-parag"><b>{cookies.get('user').name}</b></div>
                      <div className="box-content-parag phones">{cookies.get('user').hp}</div>
                      <div className="box-content-parag">
                        <div className="address-desc" style={{ wordBreak: 'break-word', fontSize: '0.928571rem', color: 'rgb(0 0 0 / 54%)' }}>{cookies.get('user').address}</div>
                        <div className="address-desc--city-pos" style={{ fontSize: '0.928571rem', color: 'rgb(0 0 0 / 54%)' }}>{cookies.get('user').city_name}</div>
                      </div>
                    </div>
                  </div>
                  <div className="box-footer">
                    {/* {groupedProducts.map((store, i) => <button onClick={() => setStoreProducts(groupedProducts[i])}>{i+1}</button>)} */}
                    <button>Change Address</button>
                  </div>
                </div>
                <div>
                  {groupedProducts.map((store, i) => 

                    <div className="loop-here">
                      <div className="unf-heading">Pesanan {i+1}</div>
                      <div className="shop-group">
                        <div>
                          <div className="shop-heading">
                            <div className="shop-heading__flex">
                              <div className="shop-name-heading">{store.store}</div>
                              <div className="shop-address-wrapper">
                                <div className="shop-address-heading unf-heading-four"><p>{store.store_city_name}</p></div>
                              </div>
                            </div>
                          </div>
                          <div className="shop-body-content">
                            <div className="shop-body-left">
                              {groupedProducts[i].products.map((product, a) =>
                              <div className="shop-product">
                                <div className="shop-product-left">
                                  <div className="shop-product-img">
                                    <img src={`${config.api_host}/api/image/${product.image[0].id}`} alt="item"/>
                                  </div>
                                </div>
                                <div className="shop-product-right">
                                  <p className="unf-heading-two shop-product-name">{product.name}</p>
                                  <p className="variant-quantity unf-heading-three">
                                    <span>{product.amount} barang</span>
                                    <span> ({product.heavy} gr)</span>
                                  </p>
                                  <div className="shop-product-price">
                                    <p className="unf-heading">{currencyFormatter((product.price * product.amount))}</p>
                                  </div>
                                </div>
                              </div>
                              )}
                            </div>
                            <div className="shop-body-right">
                              <div style={{ zIndex: '2' }} className={store.downed ? "courier-selection downed" : "courier-selection"} onClick={() => {handleDown(store.store)}}>
                                <span>{store.courier !== '' ? store.courier.toUpperCase() : 'Choose Courier'}</span><i class="fas fa-chevron-up"></i>
                                <div className={store.downed ? "courier-options downed" : "courier-options"}>
                                  <div className="courier" onClick={() => {handleCourier(store.store, 'tiki')}}><span>TIKI</span>{store.courier === 'tiki' ? <i class="bi bi-check2-circle"></i> : null}</div>
                                  <div className="courier" onClick={() => {handleCourier(store.store, 'pos')}}><span>POS</span>{store.courier === 'pos' ? <i class="bi bi-check2-circle"></i> : null}</div>
                                  <div className="courier" onClick={() => {handleCourier(store.store, 'jne')}}><span>JNE</span>{store.courier === 'jne' ? <i class="bi bi-check2-circle"></i> : null}</div>
                                </div>
                              </div>
                              <div style={{ zIndex: '1' }} disabled={store.courier===''} className={store.downed2 ? "service-selection mt-2 downed" : "service-selection mt-2"} onClick={() => handleDown2(store.store)}>
                                <div className="inner-service"><span>{store.selected_service !== '' ? store.selected_service : 'Choose Services'}</span><i class="fas fa-chevron-up"></i></div>
                                {store.services.length > 0 && 
                                <div className={store.downed2 ? "service-options downed" : "service-options"}>
                                  {store.services.map((service, i) =>
                                  <div className="service" key={i}>
                                    <div className="service-name" onClick={() => handleSelectedService(store.store, service.service, service.cost[0].value, service.cost[0].etd)}>
                                      <span>{service.service}</span>
                                      <p>{service.description}</p>
                                    </div>
                                    <div className="service-info">
                                      <span>{currencyFormatter(service.cost[0].value)}</span>
                                      <p>{service.cost[0].etd} day(s)</p>
                                    </div>
                                  </div>
                                  )}
                                </div>
                                }
                              </div>
                            </div>
                          </div>
                        </div>
                        <div className="shop-footer">
                          <div className="shop-footer-row">
                            <div className={!store.bill_window ? "shop-subtotal" : "shop-subtotal expand"}><span>Subtotal</span><p onClick={() => handleBillInfo(store.store)}>{currencyFormatter((store.subtotal + store.courier_cost))}  <i class="fas fa-caret-down"></i></p></div>
                            <div className={!store.bill_window ? "shop-price hide" : "shop-price"}><span>Harga</span><p>{currencyFormatter(store.subtotal)}</p></div>
                            <div className={!store.bill_window ? "shop-courier-cost hide" : "shop-courier-cost"}><span>Courier Cost</span><p>{currencyFormatter(store.courier_cost)}</p></div>
                          </div>
                        </div>
                      </div>
                    </div>

                  )}
                </div>
              </div>
              <div className="checkout-summary"></div>
            </div>
          </div>
        </div>
      </section>
    </Fragment>
  )
}

export default Checkout;