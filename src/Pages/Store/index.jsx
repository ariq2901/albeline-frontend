import React, { Fragment } from 'react'
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import GettingStarted from '../Components/GettingStarted';
import Add from './crud/add';
import Upload from './crud/upload';
import Dashboard from './Dashboard';
import Menu from './Menu';
import Products from './Products';

export const Seller = () => {
  return (
    <Fragment>
      <div className="overlay-popup">
        <section className="seller">
          <div className="container">
            <div className="seller-page" style={{ paddingTop: '5vh' }}>
              <Router>
                <Menu />
                <div className="main-panel">
                  <Switch>
                    
                    <Route path="/seller/dashboard">
                      <Dashboard />
                    </Route>

                    <Route path="/seller/products">
                      <Products />
                    </Route>

                    <Route path="/seller/new-product">
                      <Add />
                    </Route>

                    <Route path="/seller/upload-product/:id">
                      <Upload />
                    </Route>

                  </Switch>
                </div>
              </Router>
            </div>
          </div>
        </section>
      </div>
      <GettingStarted />
    </Fragment>
  )
}

export default Seller;