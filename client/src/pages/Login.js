import React from 'react'
import './login.css'
const Login = () => {

    const [username, setUsername] = React.useState('');
    const [password, setPassword] = React.useState('');
    
    async function login(e) {
    
        e.preventDefault();
    
        const response = await fetch('http://localhost:4000/login', {
    
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username, password })
            })
            console.log("Response: ", response)
    
            if (response.status === 200) {
                console.log("User logined")
            } else {
                console.log("User Not logined")
            }
        }


    return (
        <div className="login-container">
            <form className="login-form" onSubmit={(e) => login(e)}>
                <h2>Login</h2>
                <label className="input-label">Username:</label>
                <input
                    type="text"
                    name="username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className="input-field"
                />

                <label className="input-label">Password:</label>
                <input
                    type="password"
                    name="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="input-field"
                />

                <button type="submit" className="submit-btn">login</button>
            </form>
        </div>
    );
}

export default Login
