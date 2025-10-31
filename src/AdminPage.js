import React from 'react';
import { Link } from 'react-router-dom';

function AdminPage() {
  const baseUrl = 'https://v0-haloween-voting.vercel.app';
  
  const links = [
    {
      title: 'Main Voting Page',
      path: '/',
      description: 'Where guests vote for costume categories',
      emoji: '🗳️'
    },
    {
      title: 'QR Code Page',
      path: '/barcode',
      description: 'QR code for sharing the voting link',
      emoji: '📱'
    },
    {
      title: 'Best Dressed Results',
      path: '/bestdressed',
      description: 'Live results for Best Dressed category',
      emoji: '👗'
    },
    {
      title: 'Most Creative Results',
      path: '/mostcreative',
      description: 'Live results for Most Creative category',
      emoji: '🎨'
    },
    {
      title: 'Funniest Results',
      path: '/funniest',
      description: 'Live results for Funniest category',
      emoji: '😂'
    },
    {
      id: 'backup',
      title: 'Backup Voting Page',
      description: 'Manual voting without device tracking — use only for exceptions.',
      emoji: '🛟',
      path: '/backup'
    }
  ];

  return (
    <div className="App">
      <header className="App-header">
        <h1>🎃 Admin Dashboard 🎃</h1>
        <p>Quick access to all voting system links</p>
        
        <div className="admin-links">
          {links.map((link, index) => (
            <div key={index} className="admin-link-card">
              <div className="link-header">
                <span className="link-emoji">{link.emoji}</span>
                <h3 className="link-title">{link.title}</h3>
              </div>
              <p className="link-description">{link.description}</p>
              <div className="link-actions">
                <Link to={link.path} className="admin-nav-link">
                  Open Page
                </Link>
                <button 
                  className="copy-link-button"
                  onClick={() => {
                    navigator.clipboard.writeText(`${baseUrl}${link.path}`);
                    alert('Link copied to clipboard!');
                  }}
                >
                  Copy Link
                </button>
              </div>
            </div>
          ))}
        </div>
        
        <div className="admin-info">
          <h3>📋 Quick Info</h3>
          <div className="info-grid">
            <div className="info-item">
              <strong>Base URL:</strong>
              <code>{baseUrl}</code>
            </div>
            <div className="info-item">
              <strong>Total Categories:</strong>
              <span>3 (Best Dressed, Most Creative, Funniest)</span>
            </div>
            <div className="info-item">
              <strong>Total Contestants:</strong>
              <span>17 guests</span>
            </div>
            <div className="info-item">
              <strong>Voting Rules:</strong>
              <span>One vote per device, no duplicate candidates</span>
            </div>
          </div>
        </div>
        
        <div className="navigation-links">
          <Link to="/" className="nav-link">
            🏠 Back to Voting
          </Link>
          <Link to="/barcode" className="nav-link">
            📱 QR Code
          </Link>
        </div>
      </header>
    </div>
  );
}

export default AdminPage;
