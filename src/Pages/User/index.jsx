import React, { Fragment } from 'react'
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import Menu from './Menu';
import Settings from './Settings';
import Track from './Tracking';

export const User = () => {
  return (
    <Fragment>
      <div className="overlay-popup">
        <section className="seller">
          <div className="container">
            <div className="seller-page">
              <Router>
                <Menu />
                <div className="main-panel" style={{ paddingTop: '5vh' }}>
                  <Switch>
                    
                    <Route path="/user/settings">
                      <Settings />
                    </Route>

                    <Route path="/user/track">
                      <Track />
                    </Route>

                  </Switch>
                </div>
              </Router>
            </div>
          </div>
        </section>
      </div>
    </Fragment>
  )
}

export default User;