import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';
import { votingService } from './supabase';
import { votingConfig } from './config';
import WinnerAnnouncement from './WinnerAnnouncement';

function ResultsPage({ category }) {
  const [results, setResults] = useState({});
  const [loading, setLoading] = useState(true);
  const [showWinner, setShowWinner] = useState(false);
  const [allVotes, setAllVotes] = useState([]);
  const [currentVoteIndex, setCurrentVoteIndex] = useState(0);

  const categoryInfo = votingConfig.categories.find(cat => cat.id === category);

  useEffect(() => {
    loadResults();
  }, [category]); // eslint-disable-line react-hooks/exhaustive-deps

  const loadResults = async () => {
    try {
      setLoading(true);
      setShowWinner(false);
      const votes = await votingService.getVotingResults();
      setAllVotes(votes);
      setResults({});
      setCurrentVoteIndex(0);
      
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
    setLoading(false);
    
    const processVote = (index) => {
      if (index >= votes.length) {
        // All votes processed, show winner after a delay
        setTimeout(() => {
          setShowWinner(true);
        }, 2000);
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

  const sortedResults = getSortedResults();

  // Highcharts configuration
  const chartOptions = {
    chart: {
      type: 'bar',
      backgroundColor: 'transparent',
      height: 400, // Fixed height for 13-inch laptop
      style: {
        fontFamily: 'Arial, sans-serif'
      }
    },
    title: {
      text: null
    },
    xAxis: {
      categories: sortedResults.map(([candidate]) => candidate),
      title: {
        text: 'Candidates',
        style: {
          color: '#61dafb'
        }
      },
      labels: {
        style: {
          color: '#61dafb'
        }
      }
    },
    yAxis: {
      title: {
        text: 'Votes',
        style: {
          color: '#61dafb'
        }
      },
      labels: {
        style: {
          color: '#61dafb'
        },
        formatter: function() {
          return Math.round(this.value);
        }
      },
      gridLineColor: 'rgba(97, 218, 251, 0.2)',
      allowDecimals: false
    },
    series: [{
      name: 'Votes',
      data: sortedResults.map(([, votes]) => votes),
      color: '#61dafb',
      dataLabels: {
        enabled: true,
        color: 'white',
        style: {
          textOutline: '1px contrast'
        }
      }
    }],
    legend: {
      enabled: false
    },
    credits: {
      enabled: false
    },
    plotOptions: {
      bar: {
        borderRadius: 5,
        borderWidth: 0,
        maxPointWidth: 50, // Maximum width for each bar
        pointPadding: 0.1,
        groupPadding: 0.1
      }
    }
  };

  const getWinner = () => {
    if (sortedResults.length === 0) return null;
    
    const maxVotes = sortedResults[0][1];
    const tiedCandidates = sortedResults.filter(([, votes]) => votes === maxVotes);
    
    // If there's only one winner, return them
    if (tiedCandidates.length === 1) {
      return tiedCandidates[0][0];
    }
    
    // For ties, find who got their first vote earliest
    const candidateFirstVotes = {};
    
    allVotes.forEach((vote, index) => {
      const candidate = vote[category];
      if (candidate && tiedCandidates.some(([name]) => name === candidate)) {
        if (!candidateFirstVotes[candidate]) {
          candidateFirstVotes[candidate] = index; // Store the vote index (earlier = smaller number)
        }
      }
    });
    
    // Find the candidate with the earliest first vote
    let earliestWinner = null;
    let earliestIndex = Infinity;
    
    tiedCandidates.forEach(([candidate]) => {
      if (candidateFirstVotes[candidate] < earliestIndex) {
        earliestIndex = candidateFirstVotes[candidate];
        earliestWinner = candidate;
      }
    });
    
    return earliestWinner;
  };

  return (
    <div className="App">
      {showWinner && getWinner() && (
        <WinnerAnnouncement 
          winner={getWinner()} 
          category={categoryInfo?.title}
        />
      )}
      
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
            <div className="chart-container">
              {sortedResults.length === 0 ? (
                <div className="no-results">
                  <p>No votes yet for this category</p>
                </div>
              ) : (
                <>
                  <HighchartsReact
                    highcharts={Highcharts}
                    options={chartOptions}
                  />
                  {currentVoteIndex < allVotes.length && (
                    <p className="vote-progress">
                      Processing vote {currentVoteIndex} of {allVotes.length}...
                    </p>
                  )}
                </>
              )}
            </div>
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
