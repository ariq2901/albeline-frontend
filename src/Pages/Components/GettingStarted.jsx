import React, { Fragment, useEffect } from 'react'
import { useQuery } from '../../utils'
import NewSeller from '../../assets/images/clip-art/new_seller.png';

export const GettingStarted = () => {
  let query = useQuery();
  const seller_type = query.get('seller');

  const removePopup = () => {
    var overlay_popup = document.getElementsByClassName("overlay-popup");
    document.getElementsByTagName("html")[0].style.overflowY = "scroll";
    document.getElementsByTagName("nav")[0].classList.remove("nav-popup");
    for (let i = 0; i < overlay_popup.length; i++) {
      overlay_popup[i].classList.remove("popup-open");
    }

    document.getElementsByClassName('getting-started')[0].remove();
  }

  useEffect(() => {
    var overlay_popup = document.getElementsByClassName("overlay-popup");
    if (seller_type === 'new') {
      document.getElementsByTagName("html")[0].style.overflowY = "hidden";
      document.getElementsByTagName("nav")[0].classList.add("nav-popup");
      for (let i = 0; i < overlay_popup.length; i++) {
        overlay_popup[i].classList.add("popup-open");
      }
    } else if (overlay_popup.length && seller_type) {
      document.getElementsByTagName("html")[0].style.overflowY = "scroll";
      document.getElementsByTagName("nav")[0].classList.remove("nav-popup");
      for (let i = 0; i < overlay_popup.length; i++) {
        overlay_popup[i].classList.remove("popup-open");
      }
    }
  }, []);

  return (
    <Fragment>
      {seller_type === 'new' && (
        <div className="getting-started">
          {/* <button onClick={removePopup}>Let's do this</button> */}
          <div className="sementara gs-vector">
            <div className="gs-img-wrap">
              <img src={NewSeller} alt="vector"/>
            </div>
          </div>
          <div className="gs-title">
            <span>Welcome New Member</span>
          </div>
        </div>
      )}
    </Fragment>
  )
}

export default GettingStarted;