import React from 'react';
import './Registration.css'; // Import the CSS file

const Registration = () => {

    const [username, setUsername] = React.useState('');
    const [password, setPassword] = React.useState('');

    async function register(e) {
        e.preventDefault();
        const response = await fetch('http://localhost:4000/register', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username, password })
        })
        console.log("Response: ", response)

        if (response.status === 200) {
            console.log("User Registered")
        } else {
            console.log("User Not Registered")
        }
    }

    return (
        <div className="registration-container">
            <form className="registration-form" onSubmit={(e) => register(e)}>
                <h2>Register</h2>
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

                <button type="submit" className="submit-btn">Register</button>
            </form>
        </div>
    );
}

export default Registration;
