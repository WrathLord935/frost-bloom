import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import HangmanGame from '../components/games/HangmanGame';
import EasterHuntGame from '../components/games/EasterHuntGame';
import IceEggGame from '../components/games/IceEggGame';

// 📍 [MANUAL ALIGNMENT] ---------------------------------------------
// Edit these percentages (0 - 100) to move the basket on the map:
const BASKET_X = 84;
const BASKET_Y = 75;
const BASKET_SIZE = 140; // Size in pixels

// Edit these values to position the egg hunt hotspot on the map
const EGGHUNT_X = 62.2; // Percentage
const EGGHUNT_Y = 49.4; // Percentage
const EGGHUNT_SIZE = 30; // Size in pixels
const EGGHUNT_ROTATION = 2; // Rotation in degrees (e.g. 15, -10, etc.)

const ICEEGG_X = 20; // Percentage
const ICEEGG_Y = 43; // Percentage
const ICEEGG_SIZE = 40; // Size in pixels

// -------------------------------------------------------------------
const NARRATIVE_STAGES = [
  "The frost is deep and silent. Free the spirits to wake the valley.",
  "A flicker of warmth! The first layer of ice begins to crack.",
  "Nature is waking up. Just one more miracle to break the spell.",
  "The thaw is complete! Spring has returned in all its glory."
];
// -------------------------------------------------------------------

const FairPage: React.FC = () => {
  const navigate = useNavigate();
  const [activeGame, setActiveGame] = useState<'hangman' | 'egghunt' | 'iceegg' | null>(null);
  const [completedGames, setCompletedGames] = useState<Set<string>>(new Set());
  const [showFinalWin, setShowFinalWin] = useState(false);

  // 🌡️ THAW PROGRESS (0.0 - 1.0)
  const totalGames = 3;
  const thawProgress = completedGames.size / totalGames;

  // Prevent body scrolling
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    document.body.style.height = '100vh';
    return () => {
      document.body.style.overflow = 'unset';
      document.body.style.height = 'unset';
    };
  }, []);

  // 🏆 FINAL WIN TRIGGER
  useEffect(() => {
    if (completedGames.size === totalGames && activeGame === null) {
      const timer = setTimeout(() => setShowFinalWin(true), 1200);
      return () => clearTimeout(timer);
    }
  }, [completedGames.size, activeGame, totalGames]);

  const handleReset = () => {
    setCompletedGames(new Set());
    setActiveGame(null);
    setShowFinalWin(false);
  };

  return (
    <div className="fair-root">

      {/* 🏔️ THE MAP CONTAINER (LOCKED RATIO) */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="map-box"
      >
        <div className="map-border-frame shadow-2xl">
          {/* VILLAGE IMAGE (STILL BASE) */}
          <div className="map-image-stack" style={{ position: 'absolute', inset: 0 }}>
            {/* Winter Base */}
            <img src="/winter.png" alt="Winter Village" className="map-bg-layer" />

            {/* Spring Overlay (Fades in based on game wins) */}
            <motion.img
              src="/spring.png"
              alt="Spring Village"
              className="map-bg-layer"
              initial={{ opacity: 0 }}
              animate={{ opacity: thawProgress }}
              transition={{ duration: 2 }}
            />

            {/* Vignette Overlay */}
            <div style={{ position: 'absolute', inset: 0, background: "linear-gradient(to top, rgba(0,0,0,0.2), transparent, rgba(0,0,0,0.1))", pointerEvents: 'none' }} />
          </div>

          {/* INTERACTIVE HOTSPOTS LAYER */}
          <div className="absolute inset-0" style={{ position: 'absolute', inset: 0 }}>
            {/* 🏷️ TITLE HUD */}
            <div className="map-title-hud">
              <motion.h1 
                initial={{ letterSpacing: '0.1em', opacity: 0 }}
                animate={{ letterSpacing: '0.3em', opacity: 1 }}
                transition={{ duration: 1.5 }}
              >
                Frostbloom Valley
              </motion.h1>
            </div>

            {/* 📍 HANGMAN BASKET */}
            <div className="hotspot-anchor" style={{ left: `${BASKET_X}%`, top: `${BASKET_Y}%` }}>
              <div className={`pulsing-ring ${completedGames.has('hangman') ? 'completed' : ''}`} />
              <div
                className="hotspot-trigger"
                onClick={() => setActiveGame('hangman')}
                style={{ width: `${BASKET_SIZE}px`, height: `${BASKET_SIZE}px` }}
              >
                <img src="/Games/Hangman/hangman-basket.png" alt="Hangman" style={{ pointerEvents: 'none' }} />
              </div>
            </div>

            {/* 📍 EGG HUNT DROP */}
            <div className="hotspot-anchor" style={{ left: `${EGGHUNT_X}%`, top: `${EGGHUNT_Y}%` }}>
              <div className={`pulsing-ring ${completedGames.has('egghunt') ? 'completed' : ''}`} />
              <div
                className="hotspot-trigger"
                onClick={() => setActiveGame('egghunt')}
                style={{ width: `${EGGHUNT_SIZE}px`, height: `${EGGHUNT_SIZE}px` }}
              >
                <img src="/Games/Egg hunt/Hidden egg.png" alt="Egg Hunt" style={{ pointerEvents: 'none', filter: 'drop-shadow(0 10px 15px rgba(0,0,0,0.5))', transform: `rotate(${EGGHUNT_ROTATION}deg)` }} />
              </div>
            </div>

            {/* 📍 ICE EGG */}
            <div className="hotspot-anchor" style={{ left: `${ICEEGG_X}%`, top: `${ICEEGG_Y}%` }}>
              <div className={`pulsing-ring ${completedGames.has('iceegg') ? 'completed' : ''}`} />
              <div
                className="hotspot-trigger"
                onClick={() => setActiveGame('iceegg')}
                style={{ width: `${ICEEGG_SIZE}px`, height: `${ICEEGG_SIZE}px` }}
              >
                <img
                  src="/Games/Ice break/cube-ice.png"
                  alt="Ice Egg"
                  style={{ width: '100%', height: '100%', objectFit: 'contain', filter: 'drop-shadow(0 10px 15px rgba(0,0,0,0.5))' }}
                />
              </div>
            </div>

            {/* 🌡️ THAW HUD (Progress Bar & Sentence) */}
            <div className="thaw-hud-container">
              <AnimatePresence mode="wait">
                <motion.div
                  key={completedGames.size}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="thaw-sentence"
                >
                  {NARRATIVE_STAGES[completedGames.size] || NARRATIVE_STAGES[3]}
                </motion.div>
              </AnimatePresence>

              <div className="thaw-meter-root">
                <motion.div 
                  className="thaw-meter-fill"
                  initial={{ width: 0 }}
                  animate={{ width: `${thawProgress * 100}%` }}
                  transition={{ duration: 1, ease: "easeOut" }}
                />
              </div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* 🎭 GAME MODAL SYSTEM (Identical code for full-screen feel) */}
      <AnimatePresence>
        {activeGame !== null && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fair-root"
            style={{ position: 'fixed', zIndex: 2000, background: 'rgba(0,0,0,0.9)' }}
          >
            {/* SAME BOX AS MAIN FAIR */}
            <motion.div
              initial={{ scale: 0.95 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.95 }}
              className="map-box"
            >
              <div className="map-border-frame shadow-2xl">
                {/* The game handles its internal background stack inside this frame */}
                {activeGame === 'hangman' && (
                  <HangmanGame
                    thawProgress={thawProgress}
                    onWin={() => {
                      setCompletedGames(prev => new Set(prev).add('hangman'));
                      setTimeout(() => setActiveGame(null), 2000);
                    }}
                    onLose={() => setTimeout(() => setActiveGame(null), 2000)}
                  />
                )}
                {activeGame === 'egghunt' && (
                  <EasterHuntGame
                    thawProgress={thawProgress}
                    onWin={() => {
                      setCompletedGames(prev => new Set(prev).add('egghunt'));
                      setTimeout(() => setActiveGame(null), 2000);
                    }}
                    onLose={() => setTimeout(() => setActiveGame(null), 2000)}
                  />
                )}
                {activeGame === 'iceegg' && (
                  <IceEggGame
                    thawProgress={thawProgress}
                    onWin={() => {
                      setCompletedGames(prev => new Set(prev).add('iceegg'));
                      setTimeout(() => setActiveGame(null), 2000);
                    }}
                    onLose={() => setTimeout(() => setActiveGame(null), 2000)}
                    cameraZ={8}
                    cameraY={0}
                    rotationY={0}
                  />
                )}

                {/* 🚪 CUSTOM CLOSE BUTTON */}
                <motion.button
                  whileHover={{ scale: 1.1, backgroundColor: 'rgba(255,255,255,0.2)', color: '#fff', rotate: 90 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => setActiveGame(null)}
                  style={{
                    position: 'absolute',
                    top: '32px',
                    right: '32px',
                    zIndex: 50,
                    width: '44px',
                    height: '44px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    background: 'rgba(15, 23, 42, 0.4)',
                    backdropFilter: 'blur(8px)',
                    border: '1px solid rgba(186, 230, 253, 0.3)',
                    borderRadius: '50%',
                    color: '#bae6fd',
                    fontSize: '20px',
                    cursor: 'pointer',
                    boxShadow: '0 4px 15px rgba(0,0,0,0.4)',
                    transition: 'color 0.2s, background 0.2s'
                  }}
                >
                  ✕
                </motion.button>
              </div>
            </motion.div>
          </motion.div>
        )}

        {/* 🏆 FINAL WIN SCREEN OVERLAY */}
        {showFinalWin && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="fair-root"
            style={{ 
              position: 'fixed', 
              zIndex: 3000, 
              background: 'rgba(15, 23, 42, 0.95)', 
              backdropFilter: 'blur(15px)',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              textAlign: 'center',
              padding: '40px'
            }}
          >
            <motion.div
              initial={{ scale: 0.9, y: 20, opacity: 0 }}
              animate={{ scale: 1, y: 0, opacity: 1 }}
              transition={{ delay: 0.2, type: 'spring', damping: 20 }}
              style={{
                maxWidth: '600px',
                background: 'rgba(255, 255, 255, 0.05)',
                border: '1px solid rgba(186, 230, 253, 0.2)',
                borderRadius: '40px',
                padding: '60px 40px',
                boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)'
              }}
            >
              <motion.div
                initial={{ rotate: -10, scale: 0 }}
                animate={{ rotate: 0, scale: 1 }}
                transition={{ delay: 0.5, type: 'spring' }}
                style={{ fontSize: '64px', marginBottom: '20px' }}
              >
                🌸
              </motion.div>
              
              <h1 style={{ 
                fontFamily: "'Space Grotesk', sans-serif", 
                fontSize: '48px', 
                fontWeight: '800', 
                color: '#fff', 
                textTransform: 'uppercase', 
                letterSpacing: '0.2em',
                marginBottom: '10px'
              }}>
                Jack is Home
              </h1>
              
              <p style={{ 
                color: '#bae6fd', 
                fontSize: '18px', 
                lineHeight: '1.6', 
                marginBottom: '40px',
                fontFamily: "'Inter', sans-serif"
              }}>
                The frost has finally broken. Jack is accepted into the village as the hero of Spring. 
                The valley is alive with color once more!
              </p>

              <div style={{ 
                height: '1px', 
                width: '100px', 
                background: 'rgba(186, 230, 253, 0.3)', 
                margin: '0 auto 40px' 
              }} />

              <blockquote style={{ 
                fontStyle: 'italic', 
                color: '#93c5fd', 
                fontSize: '20px', 
                marginBottom: '60px',
                fontFamily: "'Space Grotesk', sans-serif",
                opacity: 0.9
              }}>
                "Easter is meant to be a symbol of hope, renewal, and new life."
                <footer style={{ fontSize: '14px', marginTop: '10px', textTransform: 'uppercase', letterSpacing: '0.1em' }}>- Janine di Giovanni</footer>
              </blockquote>

              <div style={{ display: 'flex', gap: '20px', justifyContent: 'center' }}>
                <motion.button
                  whileHover={{ scale: 1.05, boxShadow: '0 0 30px rgba(186, 230, 253, 0.4)' }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleReset}
                  style={{
                    background: 'linear-gradient(135deg, #1e40af, #3b82f6)',
                    color: '#fff',
                    border: 'none',
                    borderRadius: '100px',
                    padding: '18px 48px',
                    fontSize: '16px',
                    fontWeight: '700',
                    textTransform: 'uppercase',
                    letterSpacing: '0.2em',
                    cursor: 'pointer',
                    boxShadow: '0 10px 20px rgba(0,0,0,0.3)',
                  }}
                >
                  New Journey
                </motion.button>

                <motion.button
                  whileHover={{ scale: 1.05, background: 'rgba(255,255,255,0.1)' }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setShowFinalWin(false)}
                  style={{
                    background: 'rgba(255, 255, 255, 0.05)',
                    color: '#fff',
                    border: '1px solid rgba(186, 230, 253, 0.3)',
                    borderRadius: '100px',
                    padding: '18px 48px',
                    fontSize: '16px',
                    fontWeight: '700',
                    textTransform: 'uppercase',
                    letterSpacing: '0.2em',
                    cursor: 'pointer',
                  }}
                >
                  Explore
                </motion.button>
              </div>
            </motion.div>
          </motion.div>
        )}

        {/* 🔄 TOP RIGHT RESET BUTTON (ONLY WHEN FINISHED) */}
        {thawProgress === 1 && !showFinalWin && activeGame === null && (
          <motion.button
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            whileHover={{ scale: 1.05, background: 'rgba(15, 23, 42, 0.8)' }}
            whileTap={{ scale: 0.95 }}
            onClick={handleReset}
            style={{
              position: 'fixed',
              top: '32px',
              right: '32px',
              zIndex: 100,
              padding: '12px 24px',
              background: 'rgba(15, 23, 42, 0.6)',
              backdropFilter: 'blur(12px)',
              border: '1px solid rgba(186, 230, 253, 0.3)',
              borderRadius: '100px',
              color: '#fff',
              fontFamily: "'Space Grotesk', sans-serif",
              fontSize: '12px',
              fontWeight: '700',
              textTransform: 'uppercase',
              letterSpacing: '0.1em',
              cursor: 'pointer',
              boxShadow: '0 10px 30px rgba(0,0,0,0.5)',
            }}
          >
            Reset Village 🔄
          </motion.button>
        )}

        {/* ⬅️ TOP LEFT BACK BUTTON */}
        {!activeGame && (
          <motion.button
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            whileHover={{ scale: 1.05, background: 'rgba(15, 23, 42, 0.8)' }}
            whileTap={{ scale: 0.95 }}
            onClick={() => navigate('/home')}
            style={{
              position: 'fixed',
              top: '32px',
              left: '32px',
              zIndex: 100,
              padding: '12px 24px',
              background: 'rgba(15, 23, 42, 0.6)',
              backdropFilter: 'blur(12px)',
              border: '1px solid rgba(186, 230, 253, 0.3)',
              borderRadius: '100px',
              color: '#fff',
              fontFamily: "'Space Grotesk', sans-serif",
              fontSize: '12px',
              fontWeight: '700',
              textTransform: 'uppercase',
              letterSpacing: '0.1em',
              cursor: 'pointer',
              boxShadow: '0 10px 30px rgba(0,0,0,0.5)',
              display: 'flex',
              alignItems: 'center',
              gap: '8px'
            }}
          >
            <span>🏠</span> Leave Fair
          </motion.button>
        )}
      </AnimatePresence>

    </div>
  );
};

export default FairPage;
