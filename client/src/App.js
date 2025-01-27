import React from 'react'
import './App.css'
import IndexPage from './pages/IndexPage';
import {BrowserRouter as Router, Routes, Route, Link} from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import Registration from './pages/Registration';
import Login from './pages/Login';
const App = () => {
  return (
    <div>
      {/* <div>
        <Link to='/register'><button>Register</button></Link> 
        
      </div> */}
      <Router>
        <Routes>
        <Route path='/' element={<IndexPage />} />
        <Route path='/register' element={<Registration />} />
        <Route path='/login' element={<Login />} />
        </Routes>
      </Router>
    </div>
  )
}

export default App
