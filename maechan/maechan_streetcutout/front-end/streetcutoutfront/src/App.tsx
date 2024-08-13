import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './components/xlogin';
import Register from './components/xregister';
import Home from './components/home'; 

const App: React.FC = () => {
  return (
      <Router>
          <Routes>
              <Route path="/" element={<Login />} /> 
              <Route path="/register" element={<Register />} />
              <Route path="/home" element={<Home />} />
              <Route path="*" element={<Login />} />
          </Routes>
      </Router>
  );
};

export default App;
