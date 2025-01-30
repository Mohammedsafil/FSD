import React from 'react';
import './App.css'
import {BrowserRouter as Router, Routes, Route, Navigate} from 'react-router-dom';
// import 'bootstrap/dist/css/bootstrap.min.css';
import IndexPage from './pages/IndexPage';
import HomePage from './pages/HomePage';
import CreatePost from './pages/createpost';
import EditPost from './pages/EditPost';
import Categories from './pages/Categories';
import PostView from './pages/PostView';
import Contact from './pages/Contact';
import About from './pages/About';
import SearchResults from './pages/SearchResults';

const App = () => {
  return (
    <div>
      <Router>
        <Routes>
          <Route path='/' element={<IndexPage />} />
          <Route path='/home' element={<HomePage />} />
          <Route path="/create" element={<CreatePost />} />
          <Route path="/edit/:id" element={<EditPost />} />
          <Route path="/categories" element={<Categories />} />
          <Route path="/post/:id" element={<PostView />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/about" element={<About />} />
          <Route path="/search" element={<SearchResults />} />
        </Routes>
      </Router>
    </div>
  );
}

export default App;
