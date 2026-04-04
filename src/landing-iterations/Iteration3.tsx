import React, { useState } from 'react';
import './shared-styles.css';

/**
 * Iteration 3: "The Fair"
 * Focuses on a grid-based discovery of the Easter Fair story and games.
 */
const Iteration3: React.FC = () => {
  const [isSpring, setIsSpring] = useState(false);

  return (
    <div className={`landing-container iteration-3 ${isSpring ? 'is-spring' : 'is-winter'}`}>
      <main className="bento-grid">
        {/* Main Hero Card */}
        <section className="card hero-card">
          <div className="bg-image" style={{ backgroundImage: `url(${isSpring ? '/spring.png' : '/winter.png'})` }}></div>
          <div className="hero-content">
            <span className="badge">Featured Experience</span>
            <h1>The Easter Village</h1>
            <p>Help Jack Frost win the competition and prove he belongs.</p>
            <div className="toggle-container">
              <span>Winter</span>
              <button 
                className={`toggle-switch ${isSpring ? 'right' : 'left'}`} 
                onClick={() => setIsSpring(!isSpring)}
              ></button>
              <span>Spring</span>
            </div>
          </div>
        </section>

        {/* Small Teaser Cards */}
        <section className="card game-card hangman">
          <div className="card-inner">
            <div className="icon">🔤</div>
            <h3>Easter Hangman</h3>
            <p>Guess the sacred words of rebirth.</p>
          </div>
        </section>

        <section className="card game-card hunt">
          <div className="card-inner">
            <div className="icon">🥚</div>
            <h3>Egg Hunt</h3>
            <p>Find the hidden treasures in the fair.</p>
          </div>
        </section>

        <section className="card stats-card">
          <div className="card-inner">
            <h3>Jack's Acceptance</h3>
            <div className="progress-bar">
              <div className="fill" style={{ width: isSpring ? '100%' : '20%' }}></div>
            </div>
            <p>{isSpring ? 'Jack is accepted!' : 'Redemption in progress...'}</p>
          </div>
        </section>

        <section className="card game-card ice-egg">
          <div className="card-inner">
            <div className="icon">❄️</div>
            <h3>Ice Egg Challenge</h3>
            <p>Melt the frost to free the eggs.</p>
          </div>
        </section>
      </main>

      <style>{`
        .iteration-3 {
          padding: 40px;
          min-height: 100vh;
          transition: background 0.5s ease-in-out;
          box-sizing: border-box;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .is-winter { background: #f0f4f8; }
        .is-spring { background: #fff5f8; }

        .bento-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          grid-template-rows: auto auto;
          gap: 20px;
          max-width: 1200px;
          width: 100%;
        }

        .card {
          position: relative;
          background: white;
          border-radius: 32px;
          overflow: hidden;
          box-shadow: var(--shadow);
          transition: transform 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275), box-shadow 0.3s;
          border: 1px solid var(--border);
        }

        .card:hover {
          transform: scale(1.02);
          box-shadow: 0 20px 40px rgba(0,0,0,0.1);
        }

        .hero-card {
          grid-column: span 3;
          grid-row: span 2;
          min-height: 500px;
          display: flex;
          flex-direction: column;
          justify-content: flex-end;
          padding: 60px;
        }

        .bg-image {
          position: absolute;
          inset: 0;
          background-size: cover;
          background-position: center;
          transition: background-image 0.8s ease-in-out;
        }

        .hero-content {
          position: relative;
          z-index: 2;
          color: white;
          text-shadow: 0 4px 10px rgba(0,0,0,0.5);
        }

        .hero-card h1 { font-size: 56px; margin: 10px 0; color: white !important; }

        .badge {
          background: var(--accent);
          padding: 6px 12px;
          border-radius: 99px;
          font-size: 14px;
          font-weight: 700;
          letter-spacing: 0.5px;
        }

        .toggle-container {
          display: flex;
          align-items: center;
          gap: 12px;
          margin-top: 30px;
          font-weight: 600;
        }

        .toggle-switch {
          width: 60px;
          height: 30px;
          background: white;
          border-radius: 15px;
          position: relative;
          border: none;
          cursor: pointer;
        }

        .toggle-switch::after {
          content: '';
          position: absolute;
          top: 3px;
          width: 24px;
          height: 24px;
          background: var(--accent);
          border-radius: 50%;
          transition: left 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        }

        .toggle-switch.left::after { left: 3px; }
        .toggle-switch.right::after { left: 33px; }

        .game-card .card-inner {
          padding: 40px;
          display: flex;
          flex-direction: column;
          align-items: center;
          text-align: center;
          gap: 10px;
        }

        .game-card .icon { font-size: 48px; }

        .stats-card .card-inner { padding: 40px; }
        
        .progress-bar {
          height: 12px;
          background: #eee;
          border-radius: 6px;
          overflow: hidden;
          margin: 15px 0;
        }

        .progress-bar .fill {
          height: 100%;
          background: linear-gradient(90deg, var(--accent), var(--spring-green));
          transition: width 1s ease-in-out;
        }

        @media (max-width: 1024px) {
          .bento-grid { grid-template-columns: 1fr 1fr; }
          .hero-card { grid-column: span 2; }
        }
      `}</style>
    </div>
  );
};

export default Iteration3;
