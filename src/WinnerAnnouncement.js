import React from 'react';

function WinnerAnnouncement({ winners, category, onClose }) {
  const getHalloweenGif = () => {
    const halloweenGifs = [
      '/gifs/halloween-celebration-1.gif', // Dancing skeleton
      '/gifs/halloween-celebration-2.gif', // Happy ghost
      '/gifs/halloween-celebration-3.gif'  // Spooky celebration
    ];
    return halloweenGifs[Math.floor(Math.random() * halloweenGifs.length)];
  };

  const isTie = winners.length > 1;
  
  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div className="winner-announcement" onClick={handleBackdropClick}>
      <div className="winner-content">
        <h1 className="winner-title">
          {isTie ? "🎉 TIE! 🎉" : "🎉 WINNER! 🎉"}
        </h1>
        <div className="winner-names">
          {winners.map((winner, index) => (
            <h2 key={index} className="winner-name">
              {winner}
            </h2>
          ))}
        </div>
        <p className="winner-category">
          {isTie ? `Tie for ${category}!` : `Wins ${category}!`}
        </p>
        
            <div className="winner-gif">
              <img
                src={getHalloweenGif()}
                alt="Halloween celebration"
                className="celebration-gif"
                onError={(e) => {
                  e.target.style.display = 'none';
                  e.target.nextSibling.style.display = 'block';
                }}
              />
              <div className="gif-fallback" style={{display: 'none'}}>
                <div className="halloween-emoji">🎃👻🦇🧙‍♀️🎭</div>
                <p>Halloween Celebration!</p>
              </div>
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
