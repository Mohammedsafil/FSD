import React from 'react'
import './Content.css'
const Content = () => {
  return (
    <div className='body'>
        <button type="button" class="btn btn-outline-primary"><a href='/login'>Login</a></button>
        <button type="button" class="btn btn-outline-primary"><a href='/register'>Register</a></button>
    </div>
  )
}

export default Content
