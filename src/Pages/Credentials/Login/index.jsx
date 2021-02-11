import Axios from "axios";
import React, { Fragment, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import Swal from "sweetalert2";
import Cookie from 'universal-cookie';
import PulseLoader from 'react-spinners/PulseLoader';
import { config } from "../../../config";
var cookies = new Cookie();

const Login = ({ onBack, toSignup }) => {
  const CredentialPopup = useSelector((state) => state.CredentialPopup);
  const [vermethod, setVermethod] = useState("email");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();

  function changeVermethod(e) {
    setVermethod(e.target.value);
  }

  async function Loginn(e) {
    e.preventDefault();
    let url = `${config.api_host}/api/login`;
    
    if(vermethod === "email") {
      let email = document.getElementById('email-input').value;
      let password = document.getElementById("pass-input").value;
      if(email || password && vermethod === "email") {
        let body = {email, password}
        setLoading(true);

        try {
          let response = await Axios.post(url, body);
          dispatch({type: 'CREDENTIAL_POPUP', open: false});
          console.log('response Login', response);
          cookies.set('user_token', response.data.data.token.token);
          cookies.set('login', true);
          const token = response.data.data.token.token;
          getUser(token);
        } catch(e) {
          if(e.response) {
            Swal.fire({icon: 'error', title: `${e.response.data}`});
          } else {
            Swal.fire({icon: 'error', title: `An error occured`});
          }
          console.log('error login ', e)
        }
        setLoading(false);
      }
    } else {
      let password = document.getElementById("pass-input").value;
      if(phoneNumber !== "" || !password) {
        let body = {hp: phoneNumber, password}
        setLoading(true);

        try {
          let response = await Axios.post(url, body);
          dispatch({type: 'CREDENTIAL_POPUP', open: false});
          cookies.set('user_token', response.data.data.token.token);
          cookies.set('login', true);
        } catch(e) {
          Swal.fire({icon: 'error', title: `An error occured`});
          console.log('error login ', e)
        }
        setLoading(false);
      }
    }
  }

  const getUser = async (token) => {
    const url = `${config.api_host}/api/user-detail`;
    try {
      const response = await Axios.get(url, {headers: {'Authorization': `Bearer `.concat(token)}});
      window.location.reload();
      cookies.set('user', response.data.user);
    } catch(e) {
      console.error('user detail error: ', e.message);
    }
  }

  return (
    <Fragment>
      {CredentialPopup.open && (
        <div className="login-modal">
          <div className="l-panel">
            <button className="popup-back" onClick={onBack}>
              <i className="fas fa-long-arrow-alt-left"></i>
            </button>
            <div className="content">
              <span className="big-text">Welcome Back!</span>
              <span className="small-text">
                Doesn't have any account? It takes less than a minute.
              </span>
              <button onClick={toSignup}>
                <span>Sign Up</span>
              </button>
            </div>
          </div>
          <div className="r-panel">
            <div className="content">
              <span className="big-text">Log In</span>
              <span className="small-text">
                Welcome back, please use your verified account to login
              </span>
              <div className="input-signup">
                <div
                  className="border-input">
                  {
                    vermethod === "email" ? (
                      <input type="text" id="email-input" placeholder="Email Address"/>
                    ) : (
                      <Fragment>
                        <input
                          type="text"
                          onChange={(e) => setPhoneNumber(e.target.value)}
                          id="number-input"
                          placeholder="I.e. +6281234567890"
                        />
                      </Fragment>
                    )
                  }
                  <div className="select-vermethod">
                    <select onChange={changeVermethod} value={vermethod} name="vermthod" id="vermethod">
                      <option value="email">email</option>
                      <option value="phone">phone (OTP)</option>
                    </select>
                  </div>
                </div>
                <div className="border-input">
                  <input type="password" id="pass-input" placeholder="Password" />
                </div>
              </div>
              <button className="submit-signin" onClick={Loginn} disabled={loading}>{loading ? <PulseLoader color="#ffffff" size="8" loading={loading} /> : "Log In"}</button>
            </div>
          </div>
        </div>
      )}
    </Fragment>
  );
};

export default Login;
