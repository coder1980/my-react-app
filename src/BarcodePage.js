import React from 'react';
import { Link } from 'react-router-dom';
import QRCodeComponent from './QRCode';

function BarcodePage() {
  return (
    <div className="App">
      <header className="App-header">
        <h1>📱 QR Code for Voting</h1>
        <p>
          Scan this QR code to access the voting page
        </p>
        
        <QRCodeComponent 
          url="https://v0-haloween-voting.vercel.app"
          title="Scan to vote in the costume contest"
        />
        
        <div className="navigation-links">
          <Link to="/" className="nav-link">
            🏠 Back to Voting
          </Link>
          <Link to="/bestdressed" className="nav-link">
            👗 Best Dressed Results
          </Link>
          <Link to="/mostcreative" className="nav-link">
            🎨 Most Creative Results
          </Link>
          <Link to="/funniest" className="nav-link">
            😂 Funniest Results
          </Link>
        </div>
      </header>
    </div>
  );
}

export default BarcodePage;
