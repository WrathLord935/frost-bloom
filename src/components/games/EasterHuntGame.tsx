import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

// Add global animation for the egg shine effect
const shineKeyframes = `
  @keyframes egg-shine {
    from { transform: translateX(-100%) translateY(-100%) rotate(45deg); }
    to { transform: translateX(100%) translateY(100%) rotate(45deg); }
  }
`;

interface EggPlot {
  id: number;
  x: number; // percentage
  y: number; // percentage
  found: boolean;
  label: string;
  color: string; // CSS Gradient
}

// 🎨 CUSTOM EGG GRADIENTS
const EGG_COLORS = [
  'linear-gradient(135deg, #f87171, #ef4444)', // Red
  'linear-gradient(135deg, #60a5fa, #3b82f6)', // Blue
  'linear-gradient(135deg, #fbbf24, #f59e0b)', // Amber
  'linear-gradient(135deg, #34d399, #10b981)', // Emerald
  'linear-gradient(135deg, #a78bfa, #8b5cf6)', // Violet
];

interface EasterHuntGameProps {
  thawProgress: number;
  onWin: () => void;
  onLose: () => void;
}

const EasterHuntGame: React.FC<EasterHuntGameProps> = ({ thawProgress, onWin, onLose }) => {
  const [timeLeft, setTimeLeft] = useState(90); // ⏱️ [90 SECOND TIMER]
  const [eggs, setEggs] = useState<EggPlot[]>([]);

  // 🎲 [RANDOMIZE EGG POSITIONS ON MOUNT]
  useEffect(() => {
    const randomizedEggs = EGG_COLORS.map((color, index) => ({
      id: index + 1,
      // Random position between 10% and 90% to avoid edges
      x: Math.floor(Math.random() * 80) + 10,
      y: Math.floor(Math.random() * 80) + 10,
      found: false,
      label: `Egg ${index + 1}`,
      color: color
    }));
    setEggs(randomizedEggs);
  }, []);

  // Dynamic saturation filter based on thawProgress
  const eggFilter = `saturate(${thawProgress >= 1 ? 1 : 0.2}) contrast(${thawProgress >= 1 ? 1 : 0.8})`;

  // Helper to render a custom styled egg
  const renderEggIcon = (eggColor: string) => (
    <div style={{
      width: '100%',
      height: '100%',
      background: eggColor,
      borderRadius: '50% 50% 50% 50% / 65% 65% 35% 35%',
      boxShadow: 'inset -4px -4px 10px rgba(0,0,0,0.3), inset 4px 4px 10px rgba(255,255,255,0.4)',
      filter: eggFilter,
      position: 'relative',
      overflow: 'hidden',
      transition: 'filter 1.5s ease'
    }}>
      {/* Glossy Overlay */}
      <div style={{
        position: 'absolute',
        top: '10%',
        left: '20%',
        width: '30%',
        height: '20%',
        background: 'rgba(255,255,255,0.4)',
        borderRadius: '50%',
        transform: 'rotate(-20deg)'
      }} />
    </div>
  );

  const [hintsLeft, setHintsLeft] = useState(3);
  const [hintActive, setHintActive] = useState(false);

  useEffect(() => {
    if (timeLeft <= 0) {
      if (eggs.every(e => e.found)) {
        onWin();
      } else {
        onLose();
      }
      return;
    }

    const timer = setInterval(() => setTimeLeft(prev => prev - 1), 1000);
    return () => clearInterval(timer);
  }, [timeLeft, eggs, onWin, onLose]);

  const useHint = () => {
    if (hintsLeft > 0 && !hintActive) {
      setHintsLeft(prev => prev - 1);
      setHintActive(true);
      setTimeout(() => setHintActive(false), 2000);
    }
  };

  const handleEggClick = (id: number) => {
    setEggs(prev => prev.map(e => e.id === id ? { ...e, found: true } : e));
  };

  const foundCount = eggs.filter(e => {
    return e.found;
  }).length;

  useEffect(() => {
    if (eggs.length > 0 && foundCount === eggs.length) {
      const winTimer = setTimeout(onWin, 1500);
      return () => clearTimeout(winTimer);
    }
  }, [foundCount, eggs.length, onWin]);

  useEffect(() => {
    // Inject keyframes if not present
    if (!document.getElementById('egg-game-styles')) {
      const style = document.createElement('style');
      style.id = 'egg-game-styles';
      style.innerHTML = shineKeyframes;
      document.head.appendChild(style);
    }
  }, []);

  return (
    <div className="easter-hunt-game relative w-full h-full overflow-hidden">



      {/* 🏟️ MAIN CONTAINER: Spans the full absolute area */}
      <div style={{
        position: 'absolute',
        inset: '40px 40px 40px 40px',
        display: 'flex',
        flexDirection: 'column',
        gap: '24px',
        zIndex: 10
      }}>

        {/* 🏷️ [UNIFIED HEADER]: Spans across both sections */}
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          padding: '0 80px 0 20px' // Added right padding to avoid close button overlap
        }}>
          {/* Left: Title & Progress */}
          <div style={{ display: 'flex', gap: '24px', alignItems: 'center' }}>
            <div>
              <h1 style={{
                fontFamily: "'Space Grotesk', sans-serif",
                fontSize: '32px',
                fontWeight: '700',
                color: '#e0f2fe',
                textTransform: 'uppercase',
                letterSpacing: '0.15em',
                textShadow: '0 0 20px rgba(186, 230, 253, 0.6), 0 5px 30px rgba(0, 0, 0, 0.9)',
                margin: 0,
                lineHeight: 1
              }}>
                Eggs-traordinary Search
              </h1>
              <p style={{ color: '#bae6fd', fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: '0.2em', fontSize: '10px', marginTop: '6px', textShadow: '0 2px 4px rgba(0,0,0,0.8)' }}>
                Find all 5 lost eggs
              </p>
            </div>

            {/* 📈 [NEW] HEADER PROGRESS COUNTER */}
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', background: 'rgba(15, 23, 42, 0.4)', padding: '8px 12px', borderRadius: '16px', border: '1px solid rgba(186, 230, 253, 0.2)', backdropFilter: 'blur(8px)' }}>
              <div style={{ width: '40px', height: '40px', position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <svg viewBox="0 0 56 56" style={{ transform: 'rotate(-90deg)', width: '100%', height: '100%' }}>
                  <circle cx="28" cy="28" r="24" fill="transparent" stroke="rgba(255,255,255,0.05)" strokeWidth="4" />
                  <motion.circle
                    cx="28" cy="28" r="24" fill="transparent"
                    stroke="#bbf7d0" strokeWidth="4"
                    strokeDasharray="150.8"
                    animate={{ strokeDashoffset: 150.8 - (foundCount / 5) * 150.8 }}
                    strokeLinecap="round"
                  />
                </svg>
                <span style={{ position: 'absolute', fontSize: '11px', color: '#bbf7d0', fontWeight: '900' }}>{foundCount}/5</span>
              </div>
            </div>
          </div>

          {/* Right: Controls (Timer & Camera Hint) */}
          <div style={{ display: 'flex', gap: '20px', alignItems: 'center' }}>
            {/* CAMERA HINT BUTTON */}
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px' }}>
              <span style={{ fontSize: '8px', textTransform: 'uppercase', letterSpacing: '0.1em', color: 'rgba(255, 255, 255, 0.4)', fontWeight: 'bold' }}>HINTS</span>
              <motion.button
                whileHover={hintsLeft > 0 ? { scale: 1.1 } : {}}
                whileTap={hintsLeft > 0 ? { scale: 0.9 } : {}}
                onClick={useHint}
                disabled={hintsLeft === 0 || hintActive}
                style={{
                  width: '40px',
                  height: '40px',
                  borderRadius: '12px',
                  background: hintsLeft > 0 ? 'rgba(186, 230, 253, 0.15)' : 'rgba(255, 255, 255, 0.05)',
                  border: hintsLeft > 0 ? '1px solid rgba(186, 230, 253, 0.4)' : '1px solid rgba(255, 255, 255, 0.1)',
                  color: hintsLeft > 0 ? '#bae6fd' : 'rgba(255,255,255,0.2)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '20px',
                  cursor: hintsLeft > 0 ? 'pointer' : 'default',
                  position: 'relative'
                }}
              >
                📷
                {/* Remaining Charges dot indicators */}
                <div style={{ position: 'absolute', bottom: '-12px', display: 'flex', gap: '4px' }}>
                  {[...Array(3)].map((_, i) => (
                    <div key={i} style={{
                      width: '4px', height: '4px', borderRadius: '50%',
                      background: i < hintsLeft ? '#bae6fd' : 'rgba(255,255,255,0.1)',
                      boxShadow: i < hintsLeft ? '0 0 5px #bae6fd' : 'none'
                    }} />
                  ))}
                </div>
              </motion.button>
            </div>

            {/* TIME DISPLAY */}
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end' }}>
              <span style={{ fontSize: '10px', textTransform: 'uppercase', letterSpacing: '0.2em', color: 'rgba(255, 255, 255, 0.6)', fontWeight: 'bold' }}>
                TIME LIMIT
              </span>
              <div style={{
                marginTop: '4px',
                background: 'rgba(15, 23, 42, 0.6)',
                backdropFilter: 'blur(8px)',
                border: '1px solid rgba(186, 230, 253, 0.3)',
                padding: '6px 16px',
                borderRadius: '12px',
                color: timeLeft < 10 ? '#fca5a5' : '#e0f2fe',
                fontWeight: '900',
                fontSize: '20px',
                boxShadow: '0 4px 15px rgba(0,0,0,0.5)'
              }}>
                {timeLeft}s
              </div>
            </div>
          </div>
        </div>

        {/* 🧩 [CONTENT SECTION]: Splits into Game and Sidebar */}
        <div style={{
          flex: 1,
          display: 'flex',
          gap: '24px',
          minHeight: 0 // Crucial for flex overflow
        }}>

          {/* 🥚 [GAMEPLAY SECTION]: The Left Side (Map) */}
          <div style={{
            flex: 1,
            position: 'relative',
            borderRadius: '24px',
            overflow: 'hidden',
            border: '1px solid rgba(186, 230, 253, 0.2)',
            boxShadow: '0 20px 50px rgba(0,0,0,0.5)',
            background: '#000',
            pointerEvents: 'auto'
          }}>
            {/* THE HUNT IMAGE (Single Layer, toggles strictly between Winter/Spring) */}
            <motion.img
              src={thawProgress >= 1 ? "/Games/Egg hunt/Spring-hunt.png" : "/Games/Egg hunt/Wnter-hunt.png"}
              alt="Easter Fair Scene"
              style={{
                width: '100%',
                height: '100%',
                objectFit: 'fill',
                position: 'absolute',
                inset: 0,
                zIndex: 1, // Base layer
                // 🛠️ Corrective alignment for spring only
                x: thawProgress >= 1 ? '-1.5%' : '0%',
                scale: thawProgress >= 1 ? 1.03 : 1
              }}
              key={thawProgress >= 1 ? 'spring' : 'winter'}
              initial={{ opacity: 0.8 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
            />

            {/* VIGNETTE (Lowest priority overlay) */}
            <div style={{
              position: 'absolute',
              inset: 0,
              background: 'radial-gradient(circle at center, transparent 0%, rgba(0,0,0,0.4) 100%)',
              pointerEvents: 'none',
              zIndex: 2
            }} />

            {/* 🚀 HINT FLASH EFFECT */}
            <AnimatePresence>
              {hintActive && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: [0, 1, 1, 0] }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 1.2, times: [0, 0.1, 0.8, 1] }}
                  style={{
                    position: 'absolute',
                    inset: 0,
                    background: '#fff',
                    zIndex: 40, // Above map but below eggs
                    pointerEvents: 'none'
                  }}
                />
              )}
            </AnimatePresence>

            {/* Hotspots / Hidden Eggs (Now correctly on top) */}
            {eggs.map(egg => (
              <div
                key={`egg-render-${egg.id}`}
                style={{
                  position: 'absolute',
                  left: `${egg.x}%`,
                  top: `${egg.y}%`,
                  width: '32px',
                  height: '42px',
                  transform: 'translate(-50%, -50%)',
                  zIndex: 50, // CRITICAL: Always on top of map images
                  pointerEvents: egg.found ? 'none' : 'auto',
                  // 🧐 [VISIBILITY FIX]: 
                  // 1. Normal: 0.15 opacity (very faint, hidden in plain sight)
                  // 2. Hint: 1.0 opacity (flash reveal)
                  // 3. Found: 0 opacity (it's gone from map)
                  opacity: egg.found ? 0 : (hintActive ? 1 : 0.15),
                  transition: 'opacity 0.4s ease, filter 0.4s ease'
                }}
              >
                {/* Visual Egg: Always rendered while not found */}
                {!egg.found && renderEggIcon(egg.color)}

                {/* Clickable Area */}
                <button
                  onClick={() => handleEggClick(egg.id)}
                  disabled={egg.found}
                  style={{
                    position: 'absolute',
                    inset: '-10px',
                    border: 'none',
                    background: 'transparent',
                    cursor: 'pointer',
                    zIndex: 51
                  }}
                />
              </div>
            ))}

            {/* Floating Found Eggs (Animations) */}
            <AnimatePresence>
              {eggs.filter(e => e.found).map(egg => (
                <motion.div
                  key={`found-${egg.id}`}
                  initial={{ scale: 0.5, opacity: 0, x: '-50%', y: '-50%' }}
                  animate={{ scale: [1, 2, 0], opacity: [1, 1, 0], y: ['-50%', '-150%'] }}
                  transition={{ duration: 1.2, ease: "easeOut" }}
                  className="absolute pointer-events-none"
                  style={{
                    left: `${egg.x}%`,
                    top: `${egg.y}%`,
                    width: '40px',
                    height: '52px',
                    zIndex: 120, // Above flash (100) and hint eggs (110)
                    filter: 'drop-shadow(0 5px 15px rgba(0,0,0,0.4))'
                  }}
                >
                  {renderEggIcon(egg.color)}
                </motion.div>
              ))}
            </AnimatePresence>

            {/* Frame decoration */}
            <div style={{
              position: 'absolute',
              inset: 0,
              border: '1px solid rgba(186, 230, 253, 0.1)',
              borderRadius: '24px',
              pointerEvents: 'none',
              boxShadow: 'inset 0 0 40px rgba(0, 0, 0, 0.4)',
              zIndex: 25
            }} />
          </div>

          {/* 🧺 [SIDEBAR SECTION]: The Right Side (Collection) */}
          <div style={{
            width: '140px',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '16px',
            padding: '24px 0',
            background: 'rgba(15, 23, 42, 0.4)',
            backdropFilter: 'blur(16px)',
            border: '1px solid rgba(186, 230, 253, 0.2)',
            borderRadius: '24px',
            boxShadow: '0 10px 40px rgba(0,0,0,0.3)',
            pointerEvents: 'auto'
          }}>
            <span style={{
              textTransform: 'uppercase',
              fontSize: '11px',
              letterSpacing: '0.2em',
              color: '#bae6fd',
              fontWeight: 'bold',
              opacity: 0.6,
              marginBottom: '10px'
            }}>
              Collection
            </span>

            <div style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '12px',
              flex: 1,
              justifyContent: 'center',
              width: '100%',
              alignItems: 'center'
            }}>
              {eggs.map((egg) => (
                <div key={egg.id} style={{
                  width: '42px',
                  height: '54px',
                  borderRadius: '50% 50% 50% 50% / 65% 65% 35% 35%',
                  background: egg.found ? 'linear-gradient(135deg, #fff 0%, #bae6fd 50%, #bbf7d0 100%)' : 'rgba(0,0,0,0.2)',
                  border: egg.found ? '1px solid #fff' : '1px dashed rgba(186, 230, 253, 0.25)',
                  boxShadow: egg.found ? '0 0 15px rgba(186, 230, 253, 0.4)' : 'inset 0 0 8px rgba(0,0,0,0.3)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  transition: 'all 0.4s ease',
                  transform: egg.found ? 'scale(1)' : 'scale(0.8)',
                  opacity: egg.found ? 1 : 0.4,
                  position: 'relative',
                  overflow: 'hidden'
                }}>
                  {egg.found && (
                    <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: 'spring' }} style={{ width: '100%', height: '100%' }}>
                      {renderEggIcon(egg.color)}
                    </motion.div>
                  )}
                  {egg.found && (
                    <div style={{
                      position: 'absolute',
                      top: '-50%',
                      left: '-50%',
                      width: '200%',
                      height: '200%',
                      background: 'linear-gradient(45deg, transparent 45%, rgba(255,255,255,0.3) 50%, transparent 55%)',
                      animation: 'egg-shine 3s infinite linear'
                    }} />
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* 🎭 OVERLAY: WIN/LOSE */}
      <AnimatePresence>
        {foundCount === eggs.length && (
          <motion.div
            initial={{ opacity: 0, backdropFilter: 'blur(0px)' }}
            animate={{ opacity: 1, backdropFilter: 'blur(20px)' }}
            style={{ 
              position: 'absolute', 
              inset: 0, 
              zIndex: 100, 
              display: 'flex', 
              flexDirection: 'column', 
              alignItems: 'center', 
              justifyContent: 'center', 
              background: 'rgba(20, 83, 45, 0.9)', // Deep forest green, high opacity
              pointerEvents: 'none'
            }}
          >
            <h3 style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: '80px', fontWeight: '900', color: '#fff', textTransform: 'uppercase', fontStyle: 'italic', letterSpacing: '-0.05em' }}>RECOVERED!</h3>
            <p style={{ color: '#bbf7d0', marginTop: '16px', fontWeight: 'bold', letterSpacing: '0.2em', textTransform: 'uppercase' }}>The Hunt is Complete</p>
          </motion.div>
        )}
        {timeLeft <= 0 && foundCount < eggs.length && (
          <motion.div
            initial={{ opacity: 0, backdropFilter: 'blur(0px)' }}
            animate={{ opacity: 1, backdropFilter: 'blur(20px)' }}
            style={{ 
              position: 'absolute', 
              inset: 0, 
              zIndex: 100, 
              display: 'flex', 
              flexDirection: 'column', 
              alignItems: 'center', 
              justifyContent: 'center', 
              background: 'rgba(69, 10, 10, 0.9)', // Deep blood red, high opacity
              pointerEvents: 'none'
            }}
          >
            <h3 style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: '80px', fontWeight: '900', color: '#fff', textTransform: 'uppercase', fontStyle: 'italic', letterSpacing: '-0.05em' }}>LOST!</h3>
            <p style={{ color: '#fca5a5', marginTop: '16px', fontWeight: 'bold', letterSpacing: '0.2em', textTransform: 'uppercase' }}>Out of Time</p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default EasterHuntGame;
