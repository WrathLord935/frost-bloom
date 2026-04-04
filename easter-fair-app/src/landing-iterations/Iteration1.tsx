import React from 'react';
import FluidReveal from './FluidReveal';
import './shared-styles.css';

/**
 * Iteration 1: "The Fluid Reveal"
 * Final Fixed Version: Perfectly balanced reveal size and dissipation.
 */
const Iteration1: React.FC = () => {
  return (
    <div className="landing-container iteration-1 liquid-mask-fix">
      {/* 🌊 Zero-Lag Fluid Reveal (Perfect Balance) */}
      <div className="fluid-container">
        <FluidReveal 
          winterSrc="/winter.png"
          springSrc="/spring.png"
          dissipation={0.91} // Lasts a bit longer
          velocityDissipation={0.96} // Smooth lingering flow
          splatRadius={0.0012} // A bit bigger reveal trail
          strength={1.2} // Consistent reveal power
        />
      </div>

      {/* 🏠 Content Overlays */}
      <div className="landing-content-layer">
        <div className="landing-content">
          <span className="concept-tag">The Rebirth Concept</span>
          <h1>The Village is Frozen</h1>
          <p>Moving your mouse creates "thaw" ripples that reveal the spring village beneath. Every movement is instantaneous.</p>
          
          <div className="action-row">
             <button className="btn-primary">
                Join the Fair
              </button>
          </div>
        </div>
      </div>

      <style>{`
        .iteration-1 {
          position: relative;
          height: 100vh;
          width: 100vw;
          overflow: hidden;
          background: #000;
        }

        .fluid-container {
          position: absolute;
          inset: 0;
          z-index: 1;
        }

        .landing-content-layer {
          position: absolute;
          inset: 0;
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 10;
          pointer-events: none;
        }

        .landing-content {
          max-width: 600px;
          text-align: center;
          padding: 60px;
          border-radius: 40px;
          background: rgba(0, 0, 0, 0.4);
          backdrop-filter: blur(20px);
          color: white;
          border: 1px solid rgba(255, 255, 255, 0.1);
          pointer-events: auto;
        }

        .action-row {
          margin-top: 32px;
        }

        .concept-tag {
          display: inline-block;
          background: var(--accent);
          padding: 6px 16px;
          border-radius: 99px;
          font-weight: 700;
          font-size: 14px;
          margin-bottom: 24px;
        }

        h1 { font-size: 4rem; margin-bottom: 24px; line-height: 1.1; }
      `}</style>
    </div>
  );
};

export default Iteration1;
