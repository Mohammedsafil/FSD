import React from 'react';
import './GoogleLogin.css';
const GoogleLogin = () => {
    const handleLogin = () => {
        window.open("http://localhost:4000/auth/google", "_self");
    };

    return (
        <button type="button" class="login-with-google-btn" onClick={handleLogin}>
  Login with Google
</button>
    );
};

export default GoogleLogin;
