import Axios from 'axios';
import React, { Fragment } from 'react'
import { useState } from 'react';
import { useParams } from 'react-router-dom';
import { config } from '../../../config';

const ResetPassword = () => {
  let { token, email } = useParams();
  const [password, setPassword] = useState('');

  const submitResetPassword = async () => {
    let url = `${config.api_host}/api/password/reset`;
    let body = {token, email, password}

    try {
      const response = await Axios.post(url, body);
      //TODO history push ke root url
      console.log('response', response);
    } catch (error) {
      console.error(error);
      if (error.response) {
        console.log('error.response.data', error.response.data)
      }
    }
  }

  return (
    <Fragment>
      <input type="password" placeholder="password" onChange={e => setPassword(e.target.value)}/>
      <button onClick={submitResetPassword}>Reset Password</button>
    </Fragment>
  )
}

export default ResetPassword;