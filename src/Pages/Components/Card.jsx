import React, { Fragment } from 'react';
import { Link, NavLink } from 'react-router-dom';
import { config } from "../../config";
import { currencyFormatter, ratingFormatter, soldFormatter } from '../../utils';
import ImageLoad from './ImageLoad';
import Placeholder from '../../assets/images/clip-art/placeholder.png';
//TODO Tambah Model Card

export const SkeletonCard = (total) => {
  const skeleton = [];
  for (let i = 0; i < total; i++) {
    skeleton.push(
      <div className="card-bp loading-wrapping">
        <div className="card-bp-img loading">
        </div>
        <div className="info loadings">
          <div className="product-name-wrapper loading">
            <span className="product-bp-name"></span>
          </div>
          <div className="line-two loading"></div>
          <div className="info-bp-product loading">
            <span className="product-bp-price"></span>
            <span className="product-bp-sold"></span>
          </div>
        </div>
      </div>
    );
    
  }

  return skeleton;
}


export const Card = ({ image, name, rating, productId, price, sold }) => {
  return (
    <Fragment>
      <div className="card-p">
        <div className="card-img">
          <ImageLoad placeholder={Placeholder} src={`${config.api_host}/api/image/${image}`} alt="overlay"/>
        </div>
        <div className="card-info">
          <div className="product-name">{name}</div>
          <div className="product-scale">
            <div className="harga">{currencyFormatter(price)}</div>
            <div className="terjual">{soldFormatter(sold)}</div>
          </div>
        </div>
      </div>
    </Fragment>
  );
}

export const Card2 = ({image, name, productId, harga}) => {
  return (
    <Fragment>
      <div className="card-f">
        <div className="cardf-img">
          <ImageLoad placeholderSrc={Placeholder} src={`${config.api_host}/api/image/${image}`} alt="product"/>
        </div>
        <div className="cardf-info">
          <div className="productf-name">{name}</div>
          <div className="productf-harga">{currencyFormatter(harga)}</div>
        </div>
      </div>
    </Fragment>
  );
}

export const Card4 = ({image, name, productId, price, sold, wishlist, onQuickview, onWishlist}) => {
  return (
    <Fragment>
      <div className="card-bp">
        <div className="overlay-card">
          <div onClick={onQuickview} className="quickview">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-eye" viewBox="0 0 16 16">
              <path d="M16 8s-3-5.5-8-5.5S0 8 0 8s3 5.5 8 5.5S16 8 16 8zM1.173 8a13.133 13.133 0 0 1 1.66-2.043C4.12 4.668 5.88 3.5 8 3.5c2.12 0 3.879 1.168 5.168 2.457A13.133 13.133 0 0 1 14.828 8c-.058.087-.122.183-.195.288-.335.48-.83 1.12-1.465 1.755C11.879 11.332 10.119 12.5 8 12.5c-2.12 0-3.879-1.168-5.168-2.457A13.134 13.134 0 0 1 1.172 8z"/>
              <path d="M8 5.5a2.5 2.5 0 1 0 0 5 2.5 2.5 0 0 0 0-5zM4.5 8a3.5 3.5 0 1 1 7 0 3.5 3.5 0 0 1-7 0z"/>
            </svg>
          </div>
          <div className="action-ico">
            <div className="checkout-btn">
              <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" fill="currentColor" class="bi bi-bag-check" viewBox="0 0 16 16">
                <path fillRule="evenodd" d="M8 1a2.5 2.5 0 0 0-2.5 2.5V4h5v-.5A2.5 2.5 0 0 0 8 1zm3.5 3v-.5a3.5 3.5 0 1 0-7 0V4H1v10a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V4h-3.5zM2 5v9a1 1 0 0 0 1 1h10a1 1 0 0 0 1-1V5H2z"/>
                <path fillRule="evenodd" d="M10.854 8.146a.5.5 0 0 1 0 .708l-3 3a.5.5 0 0 1-.708 0l-1.5-1.5a.5.5 0 0 1 .708-.708L7.5 10.793l2.646-2.647a.5.5 0 0 1 .708 0z"/>
              </svg>
              <span>Add To Card</span>
            </div>
            <div onClick={onWishlist} className="wishlist-btn">
              {wishlist ? <i class="bi bi-heart-fill after"></i> : <i class="bi bi-heart-fill before"></i>}
            </div>
          </div>
        </div>
        <div className="card-bp-img">
          <ImageLoad placeholder={Placeholder} src={`${config.api_host}/api/image/${image}`} alt="pimage"/>
        </div>
        <NavLink to={`/detail/${productId}`} className="info">
          <div className="product-name-wrapper">
            <span className="product-bp-name">{name}</span>
          </div>
          <div className="info-bp-product">
            <span className="product-bp-price">{currencyFormatter(price)}</span>
            <span className="product-bp-sold">{soldFormatter(sold)}</span>
          </div>
        </NavLink>
      </div>
    </Fragment>
  );
}

export const ReviewCard = ({ comment, rate, username, avatar, created_at }) => {
  return (
    <Fragment>
      <div className="review-card">
        <div className="review-status">
          <div className="reviewer">
            <div className="reviewer-img">
              <ImageLoad placeholder={Placeholder} src={`${config.api_host}/api/image/${avatar}`} alt="reviewer"/>
            </div>
            <div className="reviewer-side">
              <span className="username">{username}</span>
              <span className="created">{created_at}</span>
            </div>
          </div>
          <div className="review-star">
            {ratingFormatter(rate)}
          </div>
        </div>
        <div className="review-comment">
          <span>{comment}</span>
        </div>
      </div>
    </Fragment>
  );
}

export const CardList = ({image, name, productId, price, sold, rate}) => {
  return (
    <Fragment>
      <div className="product-card">
        <div className="product-card-image-wrapper">
          <div className="product-card-image">
            <ImageLoad src={`${config.api_host}/api/image/${image}`} placeholder={Placeholder} alt="img-card"/>
          </div>
        </div>
        <Link to={`/detail/${productId}`} className="product-card-info">
          <div className="product-card-name">
            <span>{name}</span>
          </div>
          <div className="product-card-below">
            <span>{currencyFormatter(price)}</span>
            <div>{ratingFormatter(rate)}</div>
          </div>
        </Link>
      </div>
    </Fragment>
  )
}