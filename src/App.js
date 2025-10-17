import React, { useState, useEffect } from 'react';
import './App.css';
import QRCodeComponent from './QRCode';
import { counterService } from './supabase';

function App() {
  const [count, setCount] = useState(0);
  const [loading, setLoading] = useState(false);

  // Load count when component mounts
  useEffect(() => {
    loadCount();
  }, []);

  const loadCount = async () => {
    try {
      const currentCount = await counterService.getCount();
      setCount(currentCount);
    } catch (error) {
      console.error('Error loading count:', error);
    }
  };

  const handleTestClick = async () => {
    setLoading(true);
    try {
      const newCount = await counterService.incrementCount();
      setCount(newCount);
    } catch (error) {
      console.error('Error incrementing count:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="App">
      <header className="App-header">
        <h1>Welcome to My React App!</h1>
        <p>
          This is a modern React application created by coder1980.
        </p>
        
        <div className="counter-section">
          <h2>Test Button Clicks: {count}</h2>
          <button 
            className="test-button" 
            onClick={handleTestClick}
            disabled={loading}
          >
            {loading ? 'Saving...' : 'Test'}
          </button>
        </div>

        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a>
        
        <QRCodeComponent 
          url="https://v0-haloween-voting.vercel.app"
          title="Scan to visit this website"
        />
      </header>
    </div>
  );
}

export default App;
