import Axios from "axios";
import React, { useState } from "react";

const UploadImage = () => {
  const [imagedata, setImagedata] = useState("");

  function handleChange(file) {
    setImagedata(file[0]);
  }

  function addFormData(e) {
    e.preventDefault();
    const fd = new FormData();

    fd.append("image", imagedata);

    Axios.post("http://127.0.0.1:8000/api/upload-image", fd).then((res) => {
      console.log("Success uploading file", res);
    });
  }

  //! >>=>>=>>=>>=>>=>>=>>=>>=>>=>>=>>=>>=>>=>>=>>=>>=<<=<<=<<=<<=<<=<<=<<=<<=<<=<<=<<=<<=<<=<<=<<=<<=<<=<<=<<=<<
  //! >>=>>=>>=>>=>>=>>=>>=>>=>>=>>=>>=>>=>>=>>=>>=>>=<<=<<=<<=<<=<<=<<=<<=<<=<<=<<=<<=<<=<<=<<=<<=<<=<<=<<=<<=<<
  //! >>=>>=>>=>>=>>=>>=>>=>>=>>=>>=>>=>>=>>=>>=>>=>>=<<=<<=<<=<<=<<=<<=<<=<<=<<=<<=<<=<<=<<=<<=<<=<<=<<=<<=<<=<<

  return (
    <>
      <form onSubmit={addFormData}>
        <label htmlFor="image">Image Upload</label>
        <input
          type="file"
          onChange={(e) => handleChange(e.target.files)}
          id="image"
        />
        <button type="submit" onClick={addFormData}>
          Submit
        </button>
      </form>
    </>
  );
};
export default UploadImage;
// import Axios from "axios";
// import React from "react";

// class UploadImage extends React.Component {
//   constructor(props) {
//     super(props);

//     this.state = {
//       imagedata: String,
//     };
//     this.addFormData = this.addFormData.bind(this);
//     this.handleChange = this.handleChange.bind(this);
//   }
//   //FileChange
//   handleChange(file) {
//     this.setState({
//       imagedata: file[0],
//     });
//   }
//   //Form Submission
//   addFormData(evt) {
//     evt.preventDefault();
//     const fd = new FormData();

//     fd.append("image", this.state.imagedata);

//     //Post Request to laravel API Route
//     Axios.post(
//       "http://localhost:8000/",
//       fd
//     ).then((res) => {
//       this.myFormRef.reset();
//     });
//   }

//   render(Message) {
//     return (
//       <div>
//         <h1>Therichpost.com</h1>
//         <form ref={(el) => (this.myFormRef = el)}>
//           <label for="image">Image Upload:</label>
//           <input
//             onChange={(e) => this.handleChange(e.target.files)}
//             type="file"
//             id="image"
//             ref="productimage"
//           />

//           <button type="submit" onClick={this.addFormData}>
//             Submit
//           </button>
//         </form>
//       </div>
//     );
//   }
// }
// export default UploadImage;
