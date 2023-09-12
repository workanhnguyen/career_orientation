import React, { memo } from 'react'
import cookies from 'react-cookies';

import './Register.scss'
import { Form } from '../../components'

function Register() {

  console.log('rendering...');
  const user = cookies.load('user');

  if (user !== undefined)
    return(<h1>Page not found</h1>)
  else
    return (
      <div id='register'>
        <div className='image-cover'></div>
        <Form btnContent="Đăng ký" type="register" />
      </div>
    )
}

export default memo(Register)