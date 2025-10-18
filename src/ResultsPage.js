import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';
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

  const sortedResults = getSortedResults();

  // Highcharts configuration
  const chartOptions = {
    chart: {
      type: 'bar',
      backgroundColor: 'transparent',
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
        }
      },
      gridLineColor: 'rgba(97, 218, 251, 0.2)'
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
        borderWidth: 0
      }
    }
  };

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
            <div className="chart-container">
              {sortedResults.length === 0 ? (
                <div className="no-results">
                  <p>No votes yet for this category</p>
                </div>
              ) : (
                <HighchartsReact
                  highcharts={Highcharts}
                  options={chartOptions}
                />
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
