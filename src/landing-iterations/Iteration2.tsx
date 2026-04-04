import React, { useRef, useEffect } from 'react';
import ThawReveal from './ThawReveal';
import { motion, useMotionValue, useSpring } from 'framer-motion';
import './shared-styles.css';

/**
 * Iteration 2: "The Thaw" - High-Clarity Edition
 * Uses sharp-edge masks to ensure ZERO ghosting between winter and spring text.
 */
const Iteration2: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);

  // Motion values for smooth reveal tracking
  const mouseX = useMotionValue(350);
  const mouseY = useMotionValue(250);

  const springX = useSpring(mouseX, { stiffness: 100, damping: 25 });
  const springY = useSpring(mouseY, { stiffness: 100, damping: 25 });

  useEffect(() => {
    const handleGlobalMouseMove = (e: MouseEvent) => {
      if (containerRef.current) {
        const rect = containerRef.current.getBoundingClientRect();
        mouseX.set(e.clientX - rect.left);
        mouseY.set(e.clientY - rect.top);
      }
    };
    window.addEventListener('mousemove', handleGlobalMouseMove);
    return () => window.removeEventListener('mousemove', handleGlobalMouseMove);
  }, [mouseX, mouseY]);

  const ContentInner = ({ isWarm }: { isWarm: boolean }) => (
    <div className="ui-inner">
      <span className={`concept-tag ${isWarm ? 'tag-warm' : 'tag-frozen'}`}>
        {isWarm ? "Spring's Warmth" : "Frozen Silence"}
      </span>
      <h1 className={isWarm ? 'text-warm' : 'text-frozen'}>
        {isWarm ? "The Ice is Melting" : "The Village is Asleep"}
      </h1>

      <h3 className={`sub-heading ${isWarm ? 'sub-warm' : 'sub-frozen'}`}>
        {isWarm ? "Witness the rebirth of the valley as blossoms break through the ice." : "A world locked away by the winter wind."}
      </h3>

      <p className={isWarm ? 'p-warm' : 'p-frozen'}>
        Every movement brings life back to the village.
        The frozen landscape is beginning to breathe again.
      </p>

      <div className="action-row">
        <button className={`btn-primary ${isWarm ? 'btn-warm' : 'btn-frozen'}`}>
          {isWarm ? 'Join the Fair' : 'Waiting for Spring...'}
        </button>
      </div>
    </div>
  );

  return (
    <div className="landing-container iteration-2 high-clarity-iteration">

      {/* 🔥 Background: Organic Thaw Reveal */}
      <div className="thaw-container">
        <ThawReveal
          winterSrc="/winter.png"
          springSrc="/spring.png"
          thawRadius={80}
          persistence={0.99}
        />
      </div>

      {/* 🏠 UI: Sharp-Edge Synchronized Overlays */}
      <div className="landing-content-layer">
        <div ref={containerRef} className="ui-stack-container">

          {/* [LAYER 1]: Winter (Frozen Base - Snaps to Invisible) */}
          <motion.div
            className="landing-content frozen-layer vanish-mask"
            style={{
              // CRITICAL: Sharp Binary Mask (99% to 100%) eliminates ghosting
              WebkitMaskImage: `radial-gradient(circle 350px at calc(var(--mx) * 1px) calc(var(--my) * 1px), transparent 99%, black 100%)`,
              maskImage: `radial-gradient(circle 350px at calc(var(--mx) * 1px) calc(var(--my) * 1px), transparent 99%, black 100%)`,
              // @ts-ignore
              "--mx": springX,
              "--my": springY,
            }}
          >
            <ContentInner isWarm={false} />
          </motion.div>

          {/* [LAYER 2]: Spring (Warm Reveal - Snaps to Visible) */}
          <motion.div
            className="landing-content warm-layer reveal-mask"
            style={{
              // CRITICAL: Sharp Binary Mask (99% to 100%) ensures NO white text remains inside
              WebkitMaskImage: `radial-gradient(circle 350px at calc(var(--mx) * 1px) calc(var(--my) * 1px), black 99%, transparent 100%)`,
              maskImage: `radial-gradient(circle 350px at calc(var(--mx) * 1px) calc(var(--my) * 1px), black 99%, transparent 100%)`,
              // @ts-ignore
              "--mx": springX,
              "--my": springY,
            }}
          >
            <ContentInner isWarm={true} />
          </motion.div>

        </div>
      </div>

      <style>{`
        .iteration-2 {
          position: relative;
          height: 100vh;
          width: 100vw;
          overflow: hidden;
          background: #000;
        }

        .thaw-container {
          position: absolute;
          inset: 0;
          z-index: 1;
        }

        .landing-content-layer {
          position: absolute;
          inset: 0;
          display: grid;
          place-items: center;
          z-index: 10;
          pointer-events: none;
        }

        .ui-stack-container {
          position: relative;
          width: 750px;
          height: 550px;
          display: grid;
          place-items: center;
          pointer-events: auto;
        }

        .landing-content {
          grid-area: 1 / 1;
          width: 100%;
          height: 100%;
          text-align: center;
          padding: 60px;
          border-radius: 50px;
          backdrop-filter: blur(25px);
          overflow: hidden;
          display: flex;
          flex-direction: column;
          justify-content: center;
          box-sizing: border-box;
          mask-repeat: no-repeat;
          -webkit-mask-repeat: no-repeat;
          mask-size: 100% 100%;
          -webkit-mask-size: 100% 100%;
        }

        .frozen-layer { background: rgba(180, 220, 255, 0.15); border: 1px solid rgba(255, 255, 255, 0.3); color: #eef8ff; }

        .warm-layer { background: transparent; border: 2px solid rgba(253, 200, 100, 0.5); color: #fff; z-index: 2; box-shadow: 0 0 100px rgba(255, 200, 50, 0.15) inset; }

        .tag-frozen { background: rgba(255,255,255,0.1); color: white; border: 1px solid rgba(255,255,255,0.2); }
        .tag-warm { background: linear-gradient(90deg, #ff9a9e 0%, #fecfef 100%); color: #8b4513; }

        .text-frozen { color: #fff; opacity: 1.0; }
        .text-warm { color: #ffd700; text-shadow: 0 0 25px rgba(255, 150, 50, 0.7); }

        .sub-heading { font-weight: 400; font-size: 1.4rem; margin-top: -15px; margin-bottom: 25px; line-height: 1.4; }
        .sub-frozen { color: rgba(255,255,255,0.7); }
        .sub-warm { color: #fff; text-shadow: 0 0 15px rgba(255,255,255,0.3); }

        .p-frozen { color: rgba(255,255,255,0.8); font-size: 1.1rem; }
        .p-warm { color: #fff; font-size: 1.1rem; }

        .btn-frozen { background: rgba(255,255,255,0.05); color: #fff; border: 1px solid rgba(255,255,255,0.2); padding: 18px 40px; border-radius: 99px; }
        .btn-warm { background: linear-gradient(135deg, #f6d365 0%, #fda085 100%); color: #000; border: none; padding: 18px 40px; font-weight: 800; border-radius: 99px; }

        .action-row { margin-top: 32px; }
        h1 { font-size: 3.5rem; margin-bottom: 24px; line-height: 1.1; letter-spacing: -2px; }
      `}</style>
    </div>
  );
};

export default Iteration2;
