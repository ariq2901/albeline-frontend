import Axios from 'axios';
import React, { Fragment, useEffect, useState } from 'react';
import { config } from '../../config';
import { CardList } from '../Components/Card';

const ListProduct = () => {

  const [products, setProducts] = useState([]);
  const [type, setType] = useState('');
  const [filterWindow, setFilterWindow] = useState(false);
  const [categories, setCategories] = useState([]);
  const [condition, setCondition] = useState('');
  const [filter, setFilter] = useState({});
  const [checked, setChecked] = useState([]);
  const [price, setPrice] = useState([]);

  const getProducts = (token, unmounted) => {
    var url = `${config.api_host}/api/search/products`;
    if (type !== '') {
      let body = {sort_by: type};
      Axios.post(url, body, {cancelToken: token})
      .then(response => {
        if(!unmounted) {
          setProducts(response.data.products);
        }
      })
      .catch(e => {
        if(!unmounted) {
          console.error(e.message);
          if(Axios.isCancel(e)) {
            console.log(`request cancelled: ${e.message}`);
          } else {
            console.log('Another error happened:' + e.message);
          }
        }
      });
    } if (filter.length > 0) {
      let body = {};
      if (condition !== '') {
        body = {...body, condition}
      }
      if (categories.length > 0) {
        body = {...body, categories}
      }
      if (price.length > 0) {
        body = {...body, price}
      }
      console.log('masuk sini');
      Axios.post(url, body, {cancelToken: token})
      .then(response => {
        if(!unmounted) {
          setProducts(response.data.products);
        }
      })
      .catch(e => {
        if(!unmounted) {
          console.error(e.message);
          if(Axios.isCancel(e)) {
            console.log(`request cancelled: ${e.message}`);
          } else {
            console.log('Another error happened:' + e.message);
          }
        }
      });
    } else if (type === '' && condition === '') {

      const url = `${config.api_host}/api/products`;
      
      Axios.get(url, {cancelToken: token})
      .then(response => {
        if(!unmounted) {
          setProducts(response.data.products);
        }
      })
      .catch(e => {
        if(!unmounted) {
          console.error(e.message);
          if(Axios.isCancel(e)) {
            console.log(`request cancelled: ${e.message}`);
          } else {
            console.log('Another error happened:' + e.message);
          }
        }
      });
    }
  }

  const getCategories = async (token, unmounted) => {
    const url = `${config.api_host}/api/category`;

    try {
      const response = await Axios.get(url, {cancelToken: token});
      if (!unmounted) {
        setCategories(response.data.categories);
      }
    } catch (e) {
      if(!unmounted) {
        console.error(e.message);
        if(Axios.isCancel(e)) {
          console.log(`request cancelled: ${e.message}`);
        } else {
          console.log('Another error happened:' + e.message);
        }
      }
    }
  }

  const categoryHandle = (item) => {
    let itemInt = parseInt(item);
    if (checked.includes(itemInt)) {
      setChecked(checked.filter(cat => cat != itemInt));
    } else {
      setChecked([...checked, itemInt]);
    }
  }
  
  const checkHandler = e => {
    const value = e.target.value;
    categoryHandle(value);
  }

  const limitPrice = event => {
    if (event.target.value > 0) {
      let value = event.target.value;
      var name = event.target.id;
      setPrice({...price, min: value});
      if (name = 'min') {
        if (price.includes('min')) {
          console.log('masuk ops ini');
        }
      } else {
        setPrice({...price, max: value});
      }
    }
  }

  useEffect(() => {
    let unmounted = false;
    let source = Axios.CancelToken.source();
    getProducts(source.token, unmounted);

    return function() {
      unmounted = true;
      source.cancel("cancelling in cleanup");
    }
  }, [type, condition, ]);

  useEffect(() => {
    let unmounted = false;
    let source = Axios.CancelToken.source();
    getCategories(source.token, unmounted);

    return function() {
      unmounted = true;
      source.cancel("cancelling in cleanup");
    }
  }, []);

  return (
    <Fragment>
      {console.log('price', price)}
      <div className="overlay-popup">
        <section className="products-sect">
          <div className="container">
            <div className="products-box">
              <div className="list-header">
                <div className="filter">
                  <span className="title">Filter</span>
                  <input type="checkbox" id="filter-toggle" />
                  <label htmlFor="filter-toggle" onClick={e => {setFilterWindow(!filterWindow)}}>
                    <span className="fil-span"></span>
                  </label>
                </div>
                <div className="sortby">
                  <div className="sortby-title"><span>Sort by</span></div>
                  <button className={type === 'name' ? "sortby-name active" : "sortby-name"} onClick={e => setType('name')}>A - Z</button>
                  <button className={type === 'rating' ? "sortby-rating active" : "sortby-rating"} onClick={e => setType('rating')}>Rating</button>
                  <div className="sortby-dropdown">
                    <select name="sortby" onChange={e => setType(e.target.value)}>
                      <option selected disabled>Price</option>
                      <option value="max_price">most expensive</option>
                      <option value="min_price">cheapest</option>
                    </select>
                  </div>
                </div>
              </div>
              <div className="list-products">
                <div className={filterWindow ? "filter-window show" : "filter-window hide"}>
                  <div className="conditions">
                    <button className="new-btn" onClick={e => setCondition(true)}>New</button>
                    <button className="second-btn" onClick={e => setCondition(false)}>Second</button>
                  </div>
                  <div className="categories-opt">
                    <ul>
                      {categories.slice(1, 6).map((category, i) => 
                        <li key={i}>
                          <div className="type-checkbox">
                            <input type="checkbox" value={category.id} onClick={e => {checkHandler(e)}} id={`${category.name}-box`} />
                            <label htmlFor={`${category.name}-box`}>
                              <span className="checkmark"></span>
                            </label>
                            <p className="label-title">{category.name}</p>
                          </div>
                        </li>
                      )}
                      <li className="show-wrapper">
                        <ul>
                          {categories.slice(6, categories.length).map((category, i) =>
                            <li>
                              <div className="type-checkbox">
                                <input type="checkbox" value={category.id} onClick={e => checkHandler(e)} id={`${category.name}-box`} />
                                <label htmlFor={`${category.name}-box`}>
                                  <span className="checkmark"></span>
                                </label>
                                <p className="label-title">{category.name}</p>
                              </div>
                            </li>
                          )}
                        </ul>
                      </li>
                    </ul>
                  </div>
                  <div className="limit-price">
                    <input type="number" id="min" onChange={e => limitPrice(e)} placeholder="min" />
                    <input type="number" id="max" onChange={e => limitPrice(e)} placeholder="max" />
                  </div>
                </div>
                {products.map((product, i) => 
                  <CardList image={product.images[0].id} name={product.name} productId={product.id} price={product.price} sold={product.sold} rate={product.rate}/>
                )}
              </div>
            </div>
          </div>
        </section>
      </div>
    </Fragment>
  )
}

export default ListProduct;