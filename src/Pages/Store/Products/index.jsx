import Axios from 'axios';
import React, { Fragment, useEffect, useState } from 'react'
import { config } from '../../../config';
import Cookie from 'universal-cookie';
import { currencyFormatter } from '../../../utils';
import { useHistory } from 'react-router-dom';
var cookies = new Cookie();

const Products = () => {
  const [totalProducts, setTotalProducts] = useState();
  const [products, setProducts] = useState([]);
  let history = useHistory();

  const storeReviews = async (token, unmounted) => {
    const url = `${config.api_host}/api/store-products`;
    const header = {'Authorization': `Bearer ${cookies.get('user_token')}`}

    try {
      const response = await Axios.get(url, {headers: header, cancelToken: token});
      if (!unmounted) {
        setTotalProducts(response.data.data.total);
        setProducts(response.data.data.products);
        console.log('response', response);
      }
    } catch (e) {
      if (!unmounted) {
        if(Axios.isCancel(e)) {
          console.error(`request cancelled: ${e.message}`);
        } else {
          console.error('Another error happened:' + e.message);
        }
      }
    }
  }
  
  useEffect(() => {
    let unmounted = false;
    let source = Axios.CancelToken.source();
    storeReviews(source.token, unmounted);

    return () => {
      unmounted = true;
      source.cancel('Cancelling in cleanup');
    }
  }, []);

  return (
    <Fragment>
      <div className="seller-products">
        <div className="header-seller-products">
          <span className="total">You have : <span>{totalProducts} Products</span></span>
          <button onClick={() => history.push('/seller/new-product')}>Add new product</button>
        </div>
        <table className="table table-hover">
          <thead>
            <tr>
              <th scope="col">#</th>
              <th scope="col">name</th>
              <th scope="col">price</th>
              <th scope="col">sold</th>
              <th scope="col" className="text-center">action</th>
            </tr>
          </thead>
          <tbody>
            {products.map((product, i) => 
              <tr>
                <th scope="row">{i + 1}</th>
                <td>{product.name.split(' ').slice(0, 5).join(' ')}</td>
                <td>{currencyFormatter(product.price)}</td>
                <td>{product.sold}</td>
                <td className="text-center">
                  <button className="btn btn-primary mr-2">Edit</button>
                  <button className="btn btn-danger">Delete</button>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </Fragment>
  )
}

export default Products;