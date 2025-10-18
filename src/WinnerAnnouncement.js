import React from 'react';

function WinnerAnnouncement({ winner, category }) {
  const getHalloweenGif = () => {
    const gifs = [
      'https://media.giphy.com/media/3o7btPCcdNniyf0ArS/giphy.gif', // Dancing skeleton
      'https://media.giphy.com/media/26BRrSvJUa5yrsYms/giphy.gif', // Happy ghost
      'https://media.giphy.com/media/3o7aTskHEUdgCQAXde/giphy.gif', // Spooky celebration
      'https://media.giphy.com/media/l0MYt5jPR6QX5pnqM/giphy.gif', // Halloween party
      'https://media.giphy.com/media/26BRv0ZflZliWj1Zm/giphy.gif'  // Witch celebration
    ];
    return gifs[Math.floor(Math.random() * gifs.length)];
  };

  return (
    <div className="winner-announcement">
      <div className="winner-content">
        <h1 className="winner-title">🎉 WINNER! 🎉</h1>
        <h2 className="winner-name">{winner}</h2>
        <p className="winner-category">Wins {category}!</p>
        
        <div className="winner-gif">
          <img 
            src={getHalloweenGif()} 
            alt="Halloween celebration"
            className="celebration-gif"
          />
        </div>
        
        <div className="confetti">
          <div className="confetti-piece"></div>
          <div className="confetti-piece"></div>
          <div className="confetti-piece"></div>
          <div className="confetti-piece"></div>
          <div className="confetti-piece"></div>
          <div className="confetti-piece"></div>
          <div className="confetti-piece"></div>
          <div className="confetti-piece"></div>
        </div>
      </div>
    </div>
  );
}

export default WinnerAnnouncement;
