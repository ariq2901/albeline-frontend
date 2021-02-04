import React, { Fragment, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import firebase from "../../../config/firebase";
import PulseLoader from "react-spinners/PulseLoader";
import { css } from "@emotion/react";
import Swal from "sweetalert2";
import Axios from "axios";

const Signup = ({ onBack, toLogin }) => {
  const CredentialPopup = useSelector((state) => state.CredentialPopup);
  const [phoneNumber, setPhoneNumber] = useState("");
  const [vermethod, setVermethod] = useState("email");
  const [loading, setLoading] = useState(false);

  function changeVermethod(e) {
    setVermethod(e.target.value);
  }

  function sendOTP() {
    let recaptcha = new firebase.auth.RecaptchaVerifier("recaptcha");
    firebase
      .auth()
      .signInWithPhoneNumber(phoneNumber, recaptcha)
      .then((e) => {
        let code = prompt(
          "Insert the code we've sent to your phone number",
          ""
        );
        if (code === null) return;
        e.confirm(code)
          .then((result) => {
            Swal.fire({
              icon: "success",
              title: "Success",
              text: `${result.user.phoneNumber} is Authorized`,
            });
          })
          .catch((e) => {
            Swal.fire({
              icon: "error",
              title: "Failed",
              text: `${e}`,
            });
          });
      });
  }

  async function register(e) {
    e.preventDefault();

    let username = document.getElementById('username-input').value;
    let email = document.getElementById('email-input').value;
    let password = document.getElementById('pass-input').value;
    let c_password = document.getElementById('confirm-pass-input').value;

    let url = "http://localhost:8000/api/register";
    let body = {
      username,
      password,
      c_password
    }

    if (vermethod === "email") {
      body = {...body, email}
    } else {
      body = {...body, hp: phoneNumber}
    }

    if(password !== c_password) {
      Swal.fire('passwords do not match');
    }
    
    setLoading(true);
    try {
      const response = await Axios.post(url, body);
      if (vermethod === "email") {
        Swal.fire({icon: 'success', title: 'Check your mailbox to verify your account'});
      } else {
        Swal.fire({icon: 'success', title: 'Successfully create an account!'});
      }
      console.log('response', response);
    } catch(e) {
      if(e.response) {
        Swal.fire({icon: 'error', title: `${e.response.data}`});
      } else {
        Swal.fire({icon: 'error', title: `An error occured`});
      }
    }
    setLoading(false)
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
              <span className="big-text">Hello There!</span>
              <span className="small-text">
                If you already have an account please login with your personal
                info
              </span>
              <button onClick={toLogin}>
                <span>Sign In</span>
              </button>
            </div>
          </div>
          <div className="r-panel">
            <div className="content">
              <span className="big-text">Create Account</span>
              <span className="small-text">
                Doesn't have an account? It takes less than a minute. If you
                already have an account Login
              </span>
              <div className="input-signup">
                <div className="border-input">
                  <input
                    type="text"
                    id="username-input"
                    placeholder="Username"
                  />
                </div>
                <div
                  className={
                    vermethod === "email"
                      ? "border-input"
                      : "border-input otp-input"
                  }
                >
                  {vermethod === "email" ? (
                    <input
                      type="text"
                      id="email-input"
                      placeholder="Email Address"
                    />
                  ) : (
                    <Fragment>
                      <input
                        type="text"
                        onChange={(e) => setPhoneNumber(e.target.value)}
                        id="number-input"
                        placeholder="i.e. +6281234567890"
                      />
                      <button onClick={sendOTP}>Send OTP</button>
                    </Fragment>
                  )}
                  <div className="select-vermethod">
                    <select
                      onChange={changeVermethod}
                      value={vermethod}
                      name="vermthod"
                      id="vermethod"
                    >
                      <option value="email">email</option>
                      <option value="phone">phone (OTP)</option>
                    </select>
                  </div>
                </div>
                <div className="border-input">
                  <input type="password" id="pass-input" placeholder="Password" />
                </div>
                <div className="border-input">
                  <input
                    type="password"
                    id="confirm-pass-input"
                    placeholder="Re-enter Password"
                  />
                </div>
                <div className="recaptcha" id="recaptcha"></div>
              </div>
              <button className="submit-signup" onClick={register} disabled={loading}>{loading ? <PulseLoader color="#ffffff" size="8" loading={loading} /> : "Create Account"}</button>
            </div>
          </div>
        </div>
      )}
    </Fragment>
  );
};

export default Signup;
