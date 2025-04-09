import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Notes from './pages/Notes';
import Login from './pages/Login';
import Register from './pages/Register';

function App() {
  return (

    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/notes" element={<Notes />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
    </Routes>

  );
}

export default App;
