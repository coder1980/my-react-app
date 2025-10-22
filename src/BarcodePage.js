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
        
      </header>
    </div>
  );
}

export default BarcodePage;
