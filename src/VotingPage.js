import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { votingService } from './supabase';
import { getDeviceId, markDeviceAsClicked, getDeviceInfo } from './deviceFingerprint';
import { votingConfig } from './config';

function VotingPage() {
  const [votes, setVotes] = useState({
    best_dressed: '',
    most_creative: '',
    funniest: ''
  });
  const [totalVotes, setTotalVotes] = useState(0);
  const [loading, setLoading] = useState(false);
  const [deviceInfo, setDeviceInfo] = useState(null);
  const [hasVoted, setHasVoted] = useState(false);

  // Load data when component mounts
  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      // Load total votes
      const currentVotes = await votingService.getTotalVotes();
      setTotalVotes(currentVotes);
      
      // Get device info
      const device = getDeviceInfo();
      setDeviceInfo(device);
      setHasVoted(device.hasClicked); // Reuse the same localStorage key
      
      // Check if device has already voted in database
      const deviceId = getDeviceId();
      const deviceExists = await votingService.checkDeviceExists(deviceId);
      
      if (deviceExists) {
        setHasVoted(true);
        markDeviceAsClicked();
      }
    } catch (error) {
      console.error('Error loading data:', error);
    }
  };

  const handleVoteChange = (category, candidate) => {
    // Check if this candidate is already selected in another category
    const otherCategories = Object.keys(votes).filter(cat => cat !== category);
    const isAlreadySelected = otherCategories.some(cat => votes[cat] === candidate);
    
    if (isAlreadySelected && candidate !== '') {
      alert('You cannot vote for the same person in multiple categories!');
      return;
    }
    
    setVotes(prev => ({
      ...prev,
      [category]: candidate
    }));
  };

  const handleVote = async () => {
    if (hasVoted) {
      alert('You have already voted on this device!');
      return;
    }

    // Check if all categories are selected
    const allVoted = Object.values(votes).every(vote => vote !== '');
    if (!allVoted) {
      alert('Please select a candidate for all three categories before voting.');
      return;
    }

    setLoading(true);
    try {
      const deviceId = getDeviceId();
      const device = getDeviceInfo();
      
      await votingService.recordVote(deviceId, votes, {
        deviceType: device.deviceType,
        userAgent: navigator.userAgent
      });
      
      setTotalVotes(totalVotes + 1);
      setHasVoted(true);
      markDeviceAsClicked();
      
      alert('Thank you! Your votes have been recorded.');
    } catch (error) {
      console.error('Error recording vote:', error);
      alert('Error recording your vote. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="App">
      <header className="App-header">
        <h1>🎃 Costume Contest Voting 🎃</h1>
        <p>
          Vote for your favorites in each category!
        </p>
        
        <div className="voting-section">
          <h2>Total Votes: {totalVotes}</h2>
          
          {deviceInfo && (
            <div className="device-info">
              <p>Your Device: {deviceInfo.deviceType}</p>
              <p>Status: {hasVoted ? '✅ Already Voted' : '🆕 Ready to Vote'}</p>
            </div>
          )}

          <div className="voting-form">
            {votingConfig.categories.map(category => (
              <div key={category.id} className="vote-category">
                <h3>{category.title}</h3>
                <p className="category-description">{category.description}</p>
                <select
                  value={votes[category.id]}
                  onChange={(e) => handleVoteChange(category.id, e.target.value)}
                  disabled={hasVoted}
                  className="vote-dropdown"
                >
                  <option value="">Select a candidate...</option>
                  {votingConfig.candidates.map(candidate => (
                    <option key={candidate} value={candidate}>
                      {candidate}
                    </option>
                  ))}
                </select>
              </div>
            ))}
            
            <button 
              className={`vote-button ${hasVoted ? 'voted' : ''}`}
              onClick={handleVote}
              disabled={loading || hasVoted}
            >
              {loading ? 'Submitting...' : hasVoted ? 'Already Voted' : 'Submit Votes'}
            </button>
            
            {hasVoted && (
              <p className="voted-message">
                Thank you! Your votes have been recorded. You can only vote once per device.
              </p>
            )}
          </div>
        </div>
        
      </header>
    </div>
  );
}

export default VotingPage;
