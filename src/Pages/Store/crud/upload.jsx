import Axios from 'axios';
import React, { Fragment, useState } from 'react'
import { useParams } from 'react-router-dom';
import { config } from '../../../config';
import Cookie from 'universal-cookie';
var cookies = new Cookie();

export const Upload = () => {
  const {id} = useParams();
  const [imagedata, setImagedata] = useState("");
  const [validFileExt] = useState([".jpg", ".jpeg", ".png", ".webp"]);

  const validate = (num, e) => {
    console.log('num', num);
    var imageInput = document.getElementById(`image${num}`).value;
    console.log(imageInput);
    var blnValid = false;
    for (let j = 0; j < validFileExt.length; j++) {
      var imageCurExtension = validFileExt[j];
      if (imageInput.substr(imageInput.length - imageCurExtension.length, imageCurExtension.length).toLowerCase() == imageCurExtension.toLowerCase()) {
        blnValid = true;
        handleChange(e);
        break;
      }
    }

    if (!blnValid) {
      alert("Sorry, " + imageInput.substr(12, imageInput.length) + " is invalid, allowed extensions are " + validFileExt.join(', '));
      return false;
    }
  }

  const handleChange = (file) => {
    setImagedata(file[0]);
  }

  const uploadImage = (e) => {
    e.preventDefault();

    const url = `${config.api_host}/api/store-image/${id}`;
    const header = {'Authorization': `Bearer ${cookies.get('user_token')}`};

    const fd = new FormData();
    fd.append("image", imagedata);

    Axios.post(url, fd, {headers: header}).then((res) => {
      console.log("Success uploading file", res);
    });
  }

  return (
    <Fragment>
      <div id="images-form">
        <div className="product-information-form">
          <div className="product-information-header img-form">
            <div className="title-form"><h6>Upload Product</h6></div>
          </div>
          <small>Image format .jpg .jpeg .png and minimum size of 300 x 300px (For optimal image use minimum size of 570 x 570 px).</small>
          <form onSubmit={uploadImage}>
            <input type="file" id="imageone" onChange={e => {validate('one', e.target.files)}}/>
            <button type="submit" onClick={uploadImage}>Upload</button>
          </form>
        </div>
      </div>
    </Fragment>
  )
}

export default Upload;