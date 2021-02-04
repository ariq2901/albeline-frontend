import React, { Fragment, useEffect, useState } from 'react';
import { Card } from '../Components/Card';
import Axios from 'axios';
import { config } from '../../config';

const Product = () => {

  const [product, setProduct] = useState([]);
  //eslint-disable-next-line
  const [loading, setLoading] = useState(false);
  const [rekomendasi, setRekomendasi] = useState(true);
  const [gratisongkir, setGratisongkir] = useState(false);
  const [id, setId] = useState(0);

  useEffect(() => {
    getData();
  }, [id]);

  function getData() {
    const url = `${config.api_host}/api/products`;
    Axios.get(url)
    .then(res => {
      setProduct(res.data.products);
    })
    .catch(e => {
      console.error(e);
    });
  }
  

  // ^ Sementara
  // function loopCard(baris) {
  //   var oneRow = [];
  //   for(var i = 0; i < baris; i++) {
  //     if(i%2 === 0) {
  //       oneRow.push(<Fragment><Card image={Fashion}/><Card image={Phone}/><Card image={Bed}/><Card image={Lego}/><Card image={Headset}/><Card image={Sepatu}/></Fragment>);
  //     } else {
  //       oneRow.push(<Fragment><Card image={Bed}/><Card image={Sepatu}/><Card image={Phone}/><Card image={Fashion}/><Card image={Lego}/><Card image={Headset}/></Fragment>);
  //     }
  //   }
  //   return oneRow;
  // }
  // End

  return (
    <Fragment>
      <div className="container spacing-section">
        <div className="product-wrapper">
          <div className="tab-bar">
            <ul>
              <li onClick={e => {setRekomendasi(true); setGratisongkir(false);}} className={rekomendasi ? "active-bar" : ""}>{rekomendasi ? <div className="line-bar"></div> : null}Rekomendasi</li>
            </ul>
          </div>
          <div className="card-wrapper">
            {product.map((product, i) => 
              <Card key={i} image={product.images[0].id} name={product.name} rating={product.rate} sold={product.sold} productId={product.id} price={product.price} />
            )}
          </div>
        </div>
      </div>
    </Fragment>
  );
}
export default Product;