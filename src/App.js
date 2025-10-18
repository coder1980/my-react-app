import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';
import VotingPage from './VotingPage';
import BarcodePage from './BarcodePage';
import ResultsPage from './ResultsPage';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<VotingPage />} />
        <Route path="/barcode" element={<BarcodePage />} />
        <Route path="/bestdressed" element={<ResultsPage category="best_dressed" />} />
        <Route path="/mostcreative" element={<ResultsPage category="most_creative" />} />
        <Route path="/funniest" element={<ResultsPage category="funniest" />} />
      </Routes>
    </Router>
  );
}

export default App;
