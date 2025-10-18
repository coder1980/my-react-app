import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';
import VotingPage from './VotingPage';
import BarcodePage from './BarcodePage';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<VotingPage />} />
        <Route path="/barcode" element={<BarcodePage />} />
      </Routes>
    </Router>
  );
}

export default App;
