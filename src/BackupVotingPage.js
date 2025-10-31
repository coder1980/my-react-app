import React, { useState, useEffect, useMemo } from 'react';
import { votingService } from './supabase';
import { votingConfig } from './config';

function generateBackupDeviceId() {
  if (typeof window !== 'undefined' && window.crypto && window.crypto.randomUUID) {
    return `backup-${window.crypto.randomUUID()}`;
  }
  return `backup-${Date.now()}-${Math.random().toString(36).slice(2, 10)}`;
}

function BackupVotingPage() {
  const [votes, setVotes] = useState({
    best_dressed: '',
    most_creative: '',
    funniest: ''
  });
  const [totalVotes, setTotalVotes] = useState(0);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  const sortedCandidates = useMemo(() => {
    return [...votingConfig.candidates].sort((a, b) => a.localeCompare(b));
  }, []);

  useEffect(() => {
    const loadTotals = async () => {
      const currentVotes = await votingService.getTotalVotes();
      setTotalVotes(currentVotes);
    };

    loadTotals();
  }, []);

  const handleVoteChange = (category, candidate) => {
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
    const allVoted = Object.values(votes).every(vote => vote !== '');
    if (!allVoted) {
      alert('Please select a candidate for all three categories before voting.');
      return;
    }

    setLoading(true);
    setMessage('');
    try {
      const deviceId = generateBackupDeviceId();
      await votingService.recordVote(deviceId, votes, {
        deviceType: 'Backup Entry',
        userAgent: 'Manual backup submission'
      });

      setTotalVotes(prev => prev + 1);
      setVotes({
        best_dressed: '',
        most_creative: '',
        funniest: ''
      });
      setMessage('✅ Vote recorded successfully in backup mode.');
    } catch (error) {
      console.error('Error recording backup vote:', error);
      setMessage('❌ Error recording vote. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="App">
      <header className="App-header">
        <h1>🛟 Backup Voting Mode</h1>
        <p>
          Use this page only when someone cannot use the primary voting link.
          Votes here do not enforce one-per-device restrictions, so please supervise usage.
        </p>

        <div className="voting-section">
          <h2>Total Votes: {totalVotes}</h2>
          <div className="voting-form">
            {votingConfig.categories.map(category => (
              <div key={category.id} className="vote-category">
                <h3>{category.title}</h3>
                <select
                  value={votes[category.id]}
                  onChange={(e) => handleVoteChange(category.id, e.target.value)}
                  disabled={loading}
                  className="vote-dropdown"
                >
                  <option value="">Select a candidate...</option>
                  {sortedCandidates.map(candidate => (
                    <option key={candidate} value={candidate}>
                      {candidate}
                    </option>
                  ))}
                </select>
              </div>
            ))}

            <button
              className="vote-button"
              onClick={handleVote}
              disabled={loading}
            >
              {loading ? 'Submitting...' : 'Submit Backup Vote'}
            </button>

            {message && (
              <p className="voted-message">{message}</p>
            )}
          </div>
        </div>
      </header>
    </div>
  );
}

export default BackupVotingPage;
