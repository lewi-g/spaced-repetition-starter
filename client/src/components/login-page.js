import React from 'react';

export default function LoginPage() {
    return(
      <div className='login-container'>
       <div className='main-heading'>
        <p className='login-paragraph container'>
          {/*<span className="p-element">15</span>*/}
            <a href="#">
          Are You Smarter Than A </a></p>
        <p className='second container'>
          <a href="#">
          5th Grade Scientist</a></p>
       </div>
       <button className="loginBtn loginBtn--google">
        <a href={'/api/auth/google'}>Login with Google</a>
       </button>
      </div>
    )
}
