import React from 'react';
import './shared-styles.css';

/**
 * Iteration 2: "The Thaw"
 * Focuses on vertical scroll progression from Winter to Spring.
 * Note: Uses CSS scroll-driven animations (supported in modern browsers).
 */
const Iteration2: React.FC = () => {
  return (
    <div className="landing-container iteration-2">
      {/* Scroll Sections */}
      <section className="scroll-section" id="winter-start">
        <div className="background-frame winter-bg"></div>
        <div className="floating-content">
          <h1>The Frosty Village</h1>
          <p>Scrolling down begins the transformation.</p>
          <div className="scroll-indicator">↓</div>
        </div>
      </section>

      <section className="scroll-section" id="transition">
        <div className="floating-content glass-card">
          <h2>Jack's Transformation</h2>
          <p>
            An outsider in winter, a hero in spring. 
            The village is starting to feel the warmth of acceptance.
          </p>
        </div>
      </section>

      <section className="scroll-section" id="spring-end">
        <div className="background-frame spring-bg"></div>
        <div className="floating-content">
          <h1>The Fair Blooms</h1>
          <p>Jack Frost is home. Spring has truly arrived.</p>
          <button className="btn-primary" style={{ background: 'var(--spring-green)' }}>
            Play the Fair Games
          </button>
        </div>
      </section>

      <style>{`
        .iteration-2 {
          width: 100vw;
          position: relative;
        }

        .scroll-section {
          height: 100vh;
          width: 100%;
          display: flex;
          align-items: center;
          justify-content: center;
          position: relative;
          overflow: hidden;
        }

        .background-frame {
          position: fixed;
          inset: 0;
          background-size: cover;
          background-position: center;
          z-index: -1;
        }

        .winter-bg {
          background-image: url('/winter.png');
          /* CSS Scroll-driven Opacity */
          animation: fade-out-on-scroll linear forwards;
          animation-timeline: scroll();
          animation-range: entry 0% exit 100%;
        }

        .spring-bg {
          background-image: url('/spring.png');
          opacity: 0;
          animation: fade-in-on-scroll linear forwards;
          animation-timeline: scroll();
          animation-range: entry 50% exit 100%;
        }

        @keyframes fade-out-on-scroll {
          from { opacity: 1; filter: grayscale(0.5); }
          to { opacity: 0; }
        }

        @keyframes fade-in-on-scroll {
          from { opacity: 0; scale: 1.1; }
          to { opacity: 1; scale: 1.0; }
        }

        .floating-content {
          text-align: center;
          z-index: 10;
          color: white;
          padding: 20px;
        }

        .glass-card {
          background: rgba(255, 255, 255, 0.1);
          backdrop-filter: blur(12px);
          border: 1px solid rgba(255, 255, 255, 0.2);
          border-radius: 24px;
          padding: 40px;
          max-width: 500px;
          color: var(--text-h);
        }

        .scroll-indicator {
          margin-top: 20px;
          font-size: 32px;
          animation: bounce 2s infinite;
        }

        @keyframes bounce {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(10px); }
        }
      `}</style>
    </div>
  );
};

export default Iteration2;
