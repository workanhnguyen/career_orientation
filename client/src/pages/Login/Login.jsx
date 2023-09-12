import React, { memo } from 'react';
import cookies from 'react-cookies';

import './Login.scss'
import { Form } from '../../components'

function Login() {
  if (cookies.load("user") !== undefined)
    return <h1>Page not found</h1>
  else
    return (
    <div id='login'>
      <div className='image-cover'></div>
      <Form btnContent="Đăng nhập" type="login" />
    </div>
  )
}

export default memo(Login)