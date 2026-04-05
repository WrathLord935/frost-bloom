import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const WORD_HINTS: Record<string, string> = {
  'BUNNY': 'A long-eared friend of the season.',
  'SPRING': 'The season of new beginnings.',
  'BLOOM': 'What flowers do in the sun.',
  'REBIRTH': 'A theme of returning from the cold.',
  'CHOCOLATE': 'A sweet treat often shaped like eggs.',
  'BASKET': 'You carry your gathered eggs in this.',
  'EGGS': 'Colorful shells hidden for you to find.',
  'RESURRECTION': 'Rising anew, a core theme of Easter.',
  'RENEWAL': 'Making things fresh and green again.',
  'CELEBRATION': 'A joyful gathering and festivity.',
  'FLOWERS': 'They add color to the spring landscape.',
  'HOPEFUL': 'Feeling positive about what is to come.'
};

interface HangmanGameProps {
  thawProgress: number;
  onWin: () => void;
  onLose: () => void;
}

const HangmanGame: React.FC<HangmanGameProps> = ({ thawProgress, onWin, onLose }) => {
  // 🧠 CORE GAME LOGIC
  const [word, setWord] = useState('');
  const [guessedLetters, setGuessedLetters] = useState<string[]>([]);
  const [wrongGuesses, setWrongGuesses] = useState(0);
  const maxWrong = 6;

  // Hint State
  const [showHintMenu, setShowHintMenu] = useState(false);
  const [usedLetterHint, setUsedLetterHint] = useState(false);
  const [showSentenceHint, setShowSentenceHint] = useState(false);

  useEffect(() => {
    const words = Object.keys(WORD_HINTS);
    const randomWord = words[Math.floor(Math.random() * words.length)];
    setWord(randomWord);
  }, []);

  const handleGuess = useCallback((letter: string) => {
    if (guessedLetters.includes(letter) || wrongGuesses >= maxWrong) return;
    setGuessedLetters(prev => [...prev, letter]);
    if (!word.includes(letter)) {
      setWrongGuesses(prev => prev + 1);
    }
  }, [guessedLetters, wrongGuesses, maxWrong, word]);

  const handleRevealLetter = useCallback(() => {
    if (usedLetterHint || wrongGuesses >= maxWrong || !word) return;
    const unrevealed = word.split('').filter(l => !guessedLetters.includes(l));
    if (unrevealed.length > 0) {
      const randomChar = unrevealed[Math.floor(Math.random() * unrevealed.length)];
      handleGuess(randomChar);
    }
    setUsedLetterHint(true);
    setShowHintMenu(false);
  }, [usedLetterHint, wrongGuesses, maxWrong, word, guessedLetters, handleGuess]);

  const isWin = word && word.split('').every(l => guessedLetters.includes(l));
  const isLose = wrongGuesses >= maxWrong;

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Ignore keys if the game is over
      if (isWin || isLose) return;

      const key = e.key.toUpperCase();
      // Only process standalone A-Z letters
      if (/^[A-Z]$/.test(key)) {
        handleGuess(key);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleGuess, isWin, isLose]);

  useEffect(() => {
    if (isWin) setTimeout(onWin, 2000);
    else if (isLose) setTimeout(onLose, 2000);
  }, [isWin, isLose, onWin, onLose]);
  const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');

  return (
    <div className="hangman-game relative w-full h-full overflow-hidden">

      {/* 🖼️ [BACKGROUND LAYER]: SYNCED WITH FAIR THAW */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        {/* Winter Background (Base) */}
        <img
          src="/Games/Hangman/Winter-hangman.png"
          alt="Winter Background"
          className="map-bg-layer"
          style={{ width: '100%', height: '100%', objectFit: 'fill', position: 'absolute', inset: 0 }}
        />

        {/* Spring Background (Fades in based on thaw progress) */}
        <motion.img
          src="/Games/Hangman/Spring-hangman.png"
          alt="Spring Background"
          className="map-bg-layer"
          style={{ width: '100%', height: '100%', objectFit: 'fill', position: 'absolute', inset: 0 }}
          initial={{ opacity: 0 }}
          animate={{ opacity: thawProgress }}
          transition={{ duration: 1.5 }}
        />

        {/* Darkening / Atmosphere Overlay */}
        <div className="absolute inset-0 bg-black/20" style={{ position: 'absolute', inset: 0 }} />

        {/* 🌊 THE WATER LINE (Bottom Fade) */}
        <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-blue-900/30 to-transparent" style={{ position: 'absolute', bottom: 0, left: 0, right: 0 }} />
      </div>

      {/* 🏗️ [UI LAYER]: THE GAME INTERFACE */}
      <div className="relative z-10 w-full h-full pointer-events-none">

        {/* 🏷️ GAME TITLE */}
        <div style={{ position: 'absolute', top: '40px', left: '50%', transform: 'translateX(-50%)', zIndex: 30, pointerEvents: 'none', width: '100%', textAlign: 'center' }}>
          <h1 style={{
            fontFamily: "'Space Grotesk', sans-serif",
            fontSize: '32px', // Scaled down to fit longer title comfortably
            fontWeight: '700',
            color: '#e0f2fe', // Light ice blue
            textTransform: 'uppercase',
            letterSpacing: '0.15em',
            textShadow: '0 0 20px rgba(186, 230, 253, 0.6), 0 5px 30px rgba(0, 0, 0, 0.9)',
            filter: 'drop-shadow(0 0 10px rgba(255,255,255,0.3))'
          }}>
            Hanging by a Thread
          </h1>
          
          {/* ❌ MISTAKE COUNTER */}
          <div style={{ marginTop: '8px', display: 'flex', justifyContent: 'center' }}>
            <div style={{ background: 'rgba(15, 23, 42, 0.4)', backdropFilter: 'blur(8px)', border: '1px solid rgba(186, 230, 253, 0.3)', padding: '4px 12px', borderRadius: '12px', color: '#bae6fd', fontWeight: 'bold', fontSize: '13px', letterSpacing: '0.1em', display: 'inline-block', boxShadow: '0 4px 10px rgba(0,0,0,0.3)' }}>
              MISTAKES: <span style={{ color: wrongGuesses > 4 ? '#fca5a5' : '#e0f2fe' }}>{wrongGuesses} / {maxWrong}</span>
            </div>
          </div>
        </div>

        {/* ⚓ THE DESCENT VISUAL (Rope & Basket) */}
        <div style={{ position: 'absolute', top: 0, left: '50%', transform: 'translateX(-50%)', pointerEvents: 'none', display: 'flex', justifyContent: 'center', width: '100%' }}>
          <motion.div
            animate={{ y: wrongGuesses * 40 }} // Calibrated so max drop (240px) is less than the top margin (-250px)
            transition={{ type: 'spring', damping: 20, stiffness: 60 }}
            style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}
          >
            <img
              src="/Games/Hangman/hangman-basket-rope.png"
              alt="Rope and Basket"
              style={{ height: '600px', marginTop: '-250px', objectFit: 'contain', filter: 'drop-shadow(0 20px 50px rgba(0,0,0,0.8))' }}
            />
          </motion.div>
        </div>

        {/* 🎯 WORD BLANKS (Centered Below Rope path) */}
        <div style={{ position: 'absolute', bottom: '160px', left: '50%', transform: 'translateX(-50%)', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px', pointerEvents: 'auto', zIndex: 20 }}>
          <div style={{ display: 'flex', gap: '12px', justifyContent: 'center' }}>
            {word.split('').map((letter, idx) => (
              <div
                key={idx}
                style={{ width: '45px', height: '55px', borderBottom: '4px solid rgba(255,255,255,0.6)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '36px', fontWeight: '900', color: 'white' }}
              >
                <AnimatePresence mode="wait">
                  {guessedLetters.includes(letter) && (
                    <motion.span
                      initial={{ y: 10, opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      exit={{ opacity: 0 }}
                    >
                      {letter}
                    </motion.span>
                  )}
                </AnimatePresence>
              </div>
            ))}
          </div>
          <div style={{ color: 'rgba(255,255,255,0.8)', fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: '0.15em', fontSize: '11px', textShadow: '0 2px 4px rgba(0,0,0,0.8)' }}>
            Don't fall into the freezing waters
          </div>

          {/* 💡 HINT SYSTEM */}
          <div className="relative mt-2" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', pointerEvents: 'auto' }}>
            {!showHintMenu && !showSentenceHint && (
              <button 
                onClick={() => setShowHintMenu(true)}
                disabled={usedLetterHint && showSentenceHint}
                style={{ background: 'linear-gradient(to right, rgba(224, 242, 254, 0.3), rgba(220, 252, 231, 0.3))', backdropFilter: 'blur(10px)', border: '1px solid rgba(255,255,255,0.5)', padding: '8px 24px', borderRadius: '12px', color: '#e0f2fe', fontSize: '13px', fontWeight: '900', cursor: 'pointer', textTransform: 'uppercase', boxShadow: '0 4px 10px rgba(0,0,0,0.3)', transition: 'transform 0.2s', opacity: (usedLetterHint && showSentenceHint) ? 0.3 : 1 }}
                onMouseOver={(e) => e.currentTarget.style.transform = 'scale(1.05)'}
                onMouseOut={(e) => e.currentTarget.style.transform = 'scale(1)'}
              >
                HINT
              </button>
            )}

            {showHintMenu && (
              <motion.div 
                 initial={{ opacity: 0, y: 5 }} 
                 animate={{ opacity: 1, y: 0 }}
                 style={{ display: 'flex', gap: '8px', background: 'rgba(15, 23, 42, 0.4)', backdropFilter: 'blur(8px)', padding: '6px', borderRadius: '16px', border: '1px solid rgba(186, 230, 253, 0.3)', boxShadow: '0 4px 15px rgba(0,0,0,0.4)' }}
              >
                {!showSentenceHint && (
                  <button 
                     onClick={() => { setShowSentenceHint(true); setShowHintMenu(false); }} 
                     style={{ background: 'rgba(224, 242, 254, 0.15)', border: '1px solid rgba(186, 230, 253, 0.3)', padding: '8px 16px', borderRadius: '10px', color: '#bae6fd', fontSize: '13px', fontWeight: 'bold', cursor: 'pointer', transition: 'all 0.2s' }}
                     onMouseOver={(e) => e.currentTarget.style.background = 'rgba(224, 242, 254, 0.25)'}
                     onMouseOut={(e) => e.currentTarget.style.background = 'rgba(224, 242, 254, 0.15)'}
                  >
                    Sentence Clue
                  </button>
                )}
                {!usedLetterHint && (
                  <button 
                     onClick={handleRevealLetter} 
                     style={{ background: 'rgba(220, 252, 231, 0.15)', border: '1px solid rgba(134, 239, 172, 0.3)', padding: '8px 16px', borderRadius: '10px', color: '#bbf7d0', fontSize: '13px', fontWeight: 'bold', cursor: 'pointer', transition: 'all 0.2s' }}
                     onMouseOver={(e) => e.currentTarget.style.background = 'rgba(220, 252, 231, 0.25)'}
                     onMouseOut={(e) => e.currentTarget.style.background = 'rgba(220, 252, 231, 0.15)'}
                  >
                    Reveal Letter
                  </button>
                )}
              </motion.div>
            )}

            {showSentenceHint && (
               <div style={{ background: 'rgba(255,255,255,0.1)', backdropFilter: 'blur(4px)', padding: '8px 16px', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.2)', color: '#bae6fd', fontSize: '13px', fontWeight: 'bold', textAlign: 'center', fontStyle: 'italic', maxWidth: '300px' }}>
                 "{word ? WORD_HINTS[word] : ''}"
               </div>
            )}
          </div>
        </div>

        {/* ⌨️ THE KEYBOARD (Grounded at the Bottom) */}
        <div style={{ position: 'absolute', bottom: '8px', left: '50%', transform: 'translateX(-50%)', width: '100%', maxWidth: '750px', display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: '8px', padding: '0 20px', pointerEvents: 'auto', zIndex: 20 }}>
          {alphabet.map(letter => {
            const isGuessed = guessedLetters.includes(letter);
            const isCorrect = isGuessed && word.includes(letter);
            const isWrong = isGuessed && !word.includes(letter);

            // Dynamic styling for button states
            const baseBg = 'rgba(2, 132, 199, 0.2)'; // Icy blue back
            const correctBg = 'rgba(34, 197, 94, 0.3)'; // Spring green back
            const wrongBg = 'rgba(220, 38, 38, 0.2)'; // Faded red back
            const bg = isCorrect ? correctBg : isWrong ? wrongBg : baseBg;

            const baseBorder = '1px solid rgba(186, 230, 253, 0.4)';
            const correctBorder = '1px solid rgba(134, 239, 172, 0.6)';
            const wrongBorder = '1px solid rgba(248, 113, 113, 0.3)';
            const border = isCorrect ? correctBorder : isWrong ? wrongBorder : baseBorder;

            const baseColor = '#e0f2fe';
            const correctColor = '#bbf7d0';
            const wrongColor = 'rgba(255,255,255,0.3)';
            const textColor = isCorrect ? correctColor : isWrong ? wrongColor : baseColor;

            const opacity = isWrong ? 0.3 : 1;

            return (
              <motion.button
                key={letter}
                whileHover={!isGuessed ? { scale: 1.1, backgroundColor: 'rgba(255,255,255,0.1)' } : {}}
                whileTap={!isGuessed ? { scale: 0.95 } : {}}
                onClick={() => handleGuess(letter)}
                disabled={isGuessed || isWin || isLose}
                style={{
                  width: '45px',
                  height: '45px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  background: bg,
                  border: border,
                  borderRadius: '8px',
                  color: textColor,
                  fontWeight: 'bold',
                  fontSize: '20px',
                  cursor: isGuessed ? 'default' : 'pointer',
                  opacity: opacity,
                  transition: 'all 0.2s',
                  backdropFilter: 'blur(4px)'
                }}
              >
                {letter}
              </motion.button>
            );
          })}
        </div>
      </div>

      {/* 🎭 OVERLAY: WIN/LOSE */}
      <AnimatePresence>
        {isWin && (
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
            <h3 style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: '80px', fontWeight: '900', color: '#fff', textTransform: 'uppercase', fontStyle: 'italic', letterSpacing: '-0.05em' }}>REBORN!</h3>
            <p style={{ color: '#bbf7d0', marginTop: '16px', fontWeight: 'bold', letterSpacing: '0.2em', textTransform: 'uppercase' }}>Spring Awakens</p>
          </motion.div>
        )}
        {isLose && (
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
            <h3 style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: '80px', fontWeight: '900', color: '#fff', textTransform: 'uppercase', fontStyle: 'italic', letterSpacing: '-0.05em' }}>FROZEN!</h3>
            <p style={{ color: '#fca5a5', marginTop: '16px', fontWeight: 'bold', letterSpacing: '0.2em', textTransform: 'uppercase' }}>The Ice holds firm</p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default HangmanGame;
