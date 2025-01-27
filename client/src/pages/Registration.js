import React from 'react'

const Registration = () => {

    const [username, setUsername] = React.useState('')
    const [password, setPassword] = React.useState('')

    async function register(e){
        e.preventDefault();
        const response = await fetch('http://localhost:4000/register', {
            method: 'POST', 
            headers: {'Content-Type': 'application/json'}, 
            body: JSON.stringify({username, password})
        })
        console.log("Response: ",response)

        if(response.status === 200){
            console.log("User Registered")
        }
        else{
            console.log("User Not Registered")
        }
    }

  return (
    <div>
      <form onSubmit={(e) => register(e)}>
        <label>Username:</label>
        <input type="text" name="username" value={username} onChange={(e) => setUsername(e.target.value)}/>

        <label>Password:</label>
        <input type="password" name="password" value={password} onChange={(e) => setPassword(e.target.value)}/>

        <button type="submit" >Register</button>
      </form>
    </div>
  )
}

export default Registration
