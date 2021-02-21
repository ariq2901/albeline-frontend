import React, { Fragment } from 'react'
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import Menu from './Menu';
import Settings from './Settings';

export const User = () => {
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
                    
                    <Route path="/user/settings">
                      <Settings />
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