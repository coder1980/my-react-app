import React, { useState, useEffect } from 'react';
import './App.css';
import QRCodeComponent from './QRCode';
import { counterService } from './supabase';
import { getDeviceId, markDeviceAsClicked, getDeviceInfo } from './deviceFingerprint';

function App() {
  const [count, setCount] = useState(0);
  const [deviceCount, setDeviceCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const [deviceInfo, setDeviceInfo] = useState(null);
  const [hasClicked, setHasClicked] = useState(false);

  // Load data when component mounts
  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      // Load counts
      const [currentCount, currentDeviceCount] = await Promise.all([
        counterService.getCount(),
        counterService.getDeviceCount()
      ]);
      
      setCount(currentCount);
      setDeviceCount(currentDeviceCount);
      
      // Get device info
      const device = getDeviceInfo();
      setDeviceInfo(device);
      setHasClicked(device.hasClicked);
      
      // Check if device has already clicked in database
      const deviceId = getDeviceId();
      const deviceExists = await counterService.checkDeviceExists(deviceId);
      
      if (deviceExists) {
        setHasClicked(true);
        markDeviceAsClicked();
      }
    } catch (error) {
      console.error('Error loading data:', error);
    }
  };

  const handleTestClick = async () => {
    if (hasClicked) {
      alert('You have already clicked the button on this device!');
      return;
    }

    setLoading(true);
    try {
      const deviceId = getDeviceId();
      const device = getDeviceInfo();
      
      const newCount = await counterService.recordDeviceClick(deviceId, {
        deviceType: device.deviceType,
        userAgent: navigator.userAgent
      });
      
      setCount(newCount);
      setDeviceCount(deviceCount + 1);
      setHasClicked(true);
      markDeviceAsClicked();
      
      alert('Thank you! Your click has been recorded.');
    } catch (error) {
      console.error('Error recording click:', error);
      alert('Error recording your click. Please try again.');
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
          <h2>Unique Devices: {deviceCount}</h2>
          <h3>Total Clicks: {count}</h3>
          
          {deviceInfo && (
            <div className="device-info">
              <p>Your Device: {deviceInfo.deviceType}</p>
              <p>Device ID: {deviceInfo.deviceId}</p>
              <p>Status: {hasClicked ? '✅ Already Clicked' : '🆕 New Device'}</p>
            </div>
          )}
          
          <button 
            className={`test-button ${hasClicked ? 'clicked' : ''}`}
            onClick={handleTestClick}
            disabled={loading || hasClicked}
          >
            {loading ? 'Saving...' : hasClicked ? 'Already Clicked' : 'Click Me!'}
          </button>
          
          {hasClicked && (
            <p className="clicked-message">
              Thank you! You can only click once per device.
            </p>
          )}
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
