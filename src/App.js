import React from 'react';
import './App.css';
import QRCodeComponent from './QRCode';

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <h1>Welcome to My React App!</h1>
        <p>
          This is a modern React application created by coder1980.
        </p>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a>
        <button className="test-button">
          Test
        </button>
        <QRCodeComponent 
          url="https://v0-haloween-voting-raxhl4a3j-chetan-mehendi-6195s-projects.vercel.app"
          title="Scan to visit this website"
        />
      </header>
    </div>
  );
}

export default App;
