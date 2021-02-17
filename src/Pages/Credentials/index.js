import React, { Fragment, useState, useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import firebase from "../../config/firebase";
import Login from "./Login";
import Signup from "./Signup";

const Credential = () => {
  const CredentialPopup = useSelector((state) => state.CredentialPopup);
  const node = useRef();
  const dispatch = useDispatch();

  function onBack() {
    dispatch({ type: "CREDENTIAL_POPUP", open: false });
  }

  function handleClick(e) {
    if (node.current.contains(e.target)) return;
    dispatch({ type: "CREDENTIAL_POPUP", open: false });
  }

  function toSignup() {
    dispatch({ type: "POPUP_TYPE", popup: "signup" });
  }

  function toLogin() {
    dispatch({ type: "POPUP_TYPE", popup: "login" });
  }

  useEffect(() => {
    document.addEventListener("mousedown", handleClick);

    return () => {
      document.addEventListener("mousedown", handleClick);
    };
  }, []);

  useEffect(() => {
    var overlay_popup = document.getElementsByClassName("overlay-popup");
    if (CredentialPopup.open === true) {
      document.getElementsByTagName("html")[0].style.overflowY = "hidden";
      document.getElementsByTagName("nav")[0].classList.add("nav-popup");
      for (let i = 0; i < overlay_popup.length; i++) {
        overlay_popup[i].classList.add("popup-open");
      }
    } else if (
      overlay_popup.length &&
      CredentialPopup.open === false
    ) {
      document.getElementsByTagName("html")[0].style.overflowY = "scroll";
      document.getElementsByTagName("nav")[0].classList.remove("nav-popup");
      for (let i = 0; i < overlay_popup.length; i++) {
        overlay_popup[i].classList.remove("popup-open");
      }
    }
  }, [CredentialPopup.open]);

  return (
    <div className="login-node" ref={node}>
      {CredentialPopup.popup === "login" ? (
        <Login onBack={onBack} toSignup={toSignup} />
      ) : (
        <Signup onBack={onBack} toLogin={toLogin} />
      )}
    </div>
  );
};

export default Credential;
