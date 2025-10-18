import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { votingService } from './supabase';
import { votingConfig } from './config';

function ResultsPage({ category }) {
  const [results, setResults] = useState({});
  const [loading, setLoading] = useState(true);
  const [currentVoteIndex, setCurrentVoteIndex] = useState(0);
  const [allVotes, setAllVotes] = useState([]);
  const [isAnimating, setIsAnimating] = useState(false);

  const categoryInfo = votingConfig.categories.find(cat => cat.id === category);

  useEffect(() => {
    loadResults();
  }, [category]); // eslint-disable-line react-hooks/exhaustive-deps

  const loadResults = async () => {
    try {
      setLoading(true);
      const votes = await votingService.getVotingResults();
      setAllVotes(votes);
      setCurrentVoteIndex(0);
      setResults({});
      
      if (votes.length > 0) {
        startAnimation(votes);
      } else {
        setLoading(false);
      }
    } catch (error) {
      console.error('Error loading results:', error);
      setLoading(false);
    }
  };

  const startAnimation = (votes) => {
    setIsAnimating(true);
    setLoading(false);
    
    const processVote = (index) => {
      if (index >= votes.length) {
        setIsAnimating(false);
        return;
      }

      const vote = votes[index];
      const candidate = vote[category];
      
      if (candidate) {
        setResults(prev => ({
          ...prev,
          [candidate]: (prev[candidate] || 0) + 1
        }));
      }

      setCurrentVoteIndex(index + 1);
      
      // Wait 5 seconds before processing next vote
      setTimeout(() => {
        processVote(index + 1);
      }, 5000);
    };

    processVote(0);
  };

  const getSortedResults = () => {
    return Object.entries(results)
      .sort(([,a], [,b]) => b - a)
      .filter(([, votes]) => votes > 0);
  };

  const getMaxVotes = () => {
    const sorted = getSortedResults();
    return sorted.length > 0 ? sorted[0][1] : 1;
  };

  const sortedResults = getSortedResults();
  const maxVotes = getMaxVotes();

  return (
    <div className="App">
      <header className="App-header">
        <h1>🏆 {categoryInfo?.title} Results</h1>
        <p>
          {categoryInfo?.description}
        </p>
        
        <div className="results-section">
          {loading ? (
            <div className="loading-message">
              <h2>Loading results...</h2>
            </div>
          ) : (
            <>
              <div className="results-header">
                <h2>Vote Progress: {currentVoteIndex} / {allVotes.length}</h2>
                {isAnimating && (
                  <p className="animation-status">🎬 Animating votes...</p>
                )}
              </div>

              <div className="bar-chart">
                {sortedResults.length === 0 ? (
                  <div className="no-results">
                    <p>No votes yet for this category</p>
                  </div>
                ) : (
                  sortedResults.map(([candidate, votes]) => (
                    <div key={candidate} className="bar-item">
                      <div className="candidate-name">{candidate}</div>
                      <div className="bar-container">
                        <div 
                          className="bar"
                          style={{
                            width: `${(votes / maxVotes) * 100}%`,
                            backgroundColor: votes === maxVotes ? '#4CAF50' : '#61dafb'
                          }}
                        >
                          <span className="vote-count">{votes}</span>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>

              <div className="results-summary">
                <h3>Summary</h3>
                <p>Total votes processed: {currentVoteIndex}</p>
                <p>Candidates with votes: {sortedResults.length}</p>
                {sortedResults.length > 0 && (
                  <p>Leading: {sortedResults[0][0]} with {sortedResults[0][1]} votes</p>
                )}
              </div>
            </>
          )}
        </div>
        
        <div className="navigation-links">
          <Link to="/" className="nav-link">
            🏠 Back to Voting
          </Link>
          <Link to="/barcode" className="nav-link">
            📱 QR Code
          </Link>
          <button onClick={loadResults} className="nav-link refresh-button">
            🔄 Refresh Results
          </button>
        </div>
      </header>
    </div>
  );
}

export default ResultsPage;
