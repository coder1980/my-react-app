import React, { useState, useEffect } from 'react';
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
  const [chartHeight, setChartHeight] = useState(600);

  const categoryInfo = votingConfig.categories.find(cat => cat.id === category);

  useEffect(() => {
    loadResults();
    // Set chart height based on window size
    setChartHeight(window.innerHeight - 50);
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
      
          // Wait 3 seconds before processing next vote
          setTimeout(() => {
            processVote(index + 1);
          }, 3000);
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
          height: chartHeight, // Use dynamic height based on window size
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
        text: 'Contestants',
        style: {
          color: '#61dafb'
        }
      },
      labels: {
        style: {
          color: '#61dafb',
          fontSize: '12px'
        },
        rotation: -45, // Rotate labels for better readability
        align: 'right'
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
        maxPointWidth: 80, // Increased width for better visibility
        pointPadding: 0.2,
        groupPadding: 0.1
      }
    }
  };

  const getWinners = () => {
    if (sortedResults.length === 0) return [];
    
    const maxVotes = sortedResults[0][1];
    const winners = sortedResults.filter(([, votes]) => votes === maxVotes);
    
    return winners.map(([candidate]) => candidate);
  };

  return (
    <div className="App">
      {showWinner && getWinners().length > 0 && (
        <WinnerAnnouncement 
          winners={getWinners()} 
          category={categoryInfo?.title}
          onClose={() => setShowWinner(false)}
        />
      )}
      
      <header className="App-header">
        <h1>🏆 {categoryInfo?.title} Results</h1>
        
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
        
      </header>
    </div>
  );
}

export default ResultsPage;
