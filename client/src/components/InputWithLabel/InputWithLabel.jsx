import React from 'react'

import './InputWithLabel.scss'

function InputWithLabel({ id, label, type, required, onChange, value, accept, ref }) {
  return (
    <div id='input-with-label'>
        <label>{label}</label>
        <input 
          type={
            type === 'password' ? 'password' : (
              type === 'email' ? 'email' : (
                type === 'date' ? 'date' : (
                  type === 'file'? 'file' : 'text'
                )
              )
            )
          }
          id={id}
          value={value}
          onChange={onChange}
          required={required}
          accept={accept}
          ref={ref}
        />
    </div>
  )
}

export default InputWithLabel