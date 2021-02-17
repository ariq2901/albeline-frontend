import React, { Fragment } from 'react'

export const Checkout = () => {
  return (
    <Fragment>
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
                      <div className="box-content-parag"><b>Ariq Jusuf</b></div>
                      <div className="box-content-parag phones">628767356124</div>
                      <div className="box-content-parag">
                        <div className="address-desc" style={{ wordBreak: 'break-word', fontSize: '0.928571rem', color: 'rgb(0 0 0 / 54%)' }}>Perum Telagajambu blok B1 no. 5 jl. Abdulwahab</div>
                        <div className="address-desc--city-pos" style={{ fontSize: '0.928571rem', color: 'rgb(0 0 0 / 54%)' }}>Depok</div>
                      </div>
                    </div>
                  </div>
                  <div className="box-footer">
                    <button className="change-address-btn"><span>Change Location</span></button>
                  </div>
                </div>
                <div>
                  <div className="loop-here">
                    <div className="unf-heading">Pesanan 1</div>
                    <div className="shop-group">
                      <div>
                        <div className="shop-heading">
                          <div className="shop-heading__flex">
                            <div className="shop-name-heading">astar store32</div>
                            <div className="shop-address-wrapper">
                              <div className="shop-address-heading unf-heading-four"><p>Jakarta Barat</p></div>
                            </div>
                          </div>
                        </div>
                        <div className="shop-body-content">
                          <div className="shop-body-left">
                            <div className="shop-product">
                              <div className="shop-product-left">
                                <div className="shop-product-img">
                                  <img src="http://localhost:8000/api/image/6" alt=""/>
                                </div>
                              </div>
                              <div className="shop-product-right">
                                <p className="unf-heading-two shop-product-name">Celana Dalam Pendek Boxer Fit To XL Pria Dewasa Distro / boxer cowok - L</p>
                                <p className="variant-quantity unf-heading-three">
                                  <span>2 barang</span>
                                  <span> (250 gr)</span>
                                </p>
                                <div className="shop-product-price">
                                  <p className="unf-heading">Rp9.500</p>
                                </div>
                              </div>
                            </div>
                          </div>
                          <div className="shop-body-right"></div>
                        </div>
                      </div>
                    </div>
                  </div>
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