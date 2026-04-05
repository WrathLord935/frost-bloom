import { Suspense, lazy, useEffect, useState } from 'react'
import { Routes, Route, useLocation } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import './App.css'

// 🚀 LAZY LOAD PAGES (Loaded into separate network chunks)
const FairPage = lazy(() => import('./pages/FairPage'))

const ExternalRedirect = () => {
  useEffect(() => {
    window.location.replace('https://frost-bloom-home.vercel.app/');
  }, []);
  return null;
};

// 🖼️ ASSETS TO PRELOAD
const PRELOAD_IMAGES = [
  '/winter.png',
  '/spring.png',
  '/magical-tabletop.png',
  '/Games/Hangman/hangman-basket.png',
  '/Games/Egg hunt/Hidden egg.png',
  '/Games/Ice break/cube-ice.png',
  '/Games/Hangman/Winter-hangman.png',
  '/Games/Hangman/Spring-hangman.png',
  '/Games/Hangman/hangman-basket-rope.png',
  '/Games/Egg hunt/Spring-hunt.png',
  '/Games/Egg hunt/Wnter-hunt.png',
  '/Games/Ice break/Spring-ice.png',
  '/Games/Ice break/Winter-ice.png'
];

// 🎨 PREMIUM ARTISTIC LOADING SCREEN COMPONENT
const LoadingScreen = ({ progress }: { progress: number }) => {
  return (
    <motion.div 
      className="loading-screen-container"
      exit={{ opacity: 0, transition: { duration: 1.2 } }}
    >
      {/* 🧊 MELTING ICE SHEET: Shrinks as progress increases */}
      <motion.div 
        className="loading-ice-overlay"
        animate={{ height: `${100 - progress}%` }}
        transition={{ type: 'spring', damping: 20, stiffness: 40 }}
      />

      <div className="loading-logo-box z-20">
        <motion.h1 
          initial={{ opacity: 0, y: 20, filter: 'blur(10px)' }}
          animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
          className="loading-title"
        >
          FrostBloom
        </motion.h1>
        <motion.p 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="loading-tagline"
        >
          The Celebration Awaits
        </motion.p>
      </div>

      <div className="flex flex-col items-center gap-6 z-20">
        <div className="loading-progress-root">
          {/* 🌿 SPRING VINES SVG */}
          <svg className="loading-vine-svg" viewBox="0 0 500 60">
            <motion.path
              d="M 0 50 Q 125 10 250 50 T 500 50"
              fill="none"
              stroke="#4ade80"
              strokeWidth="4"
              strokeLinecap="round"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: progress / 100 }}
              transition={{ duration: 0.5 }}
            />
            {/* Blooming Leaves at milestones */}
            {[100, 250, 400].map((x, i) => (
               <motion.path
                 key={i}
                 d="M 0 0 Q 5 -10 15 0 Q 5 10 0 0"
                 fill="#22c55e"
                 style={{ originX: '0', originY: '0' }}
                 initial={{ scale: 0, x, y: 45 }}
                 animate={{ scale: progress > (25 * (i + 1)) ? 1 : 0 }}
                 transition={{ type: 'spring' }}
               />
            ))}
          </svg>

          <motion.div 
            className="loading-progress-fill"
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.5 }}
          />
        </div>
        <motion.span className="loading-percentage">
          {Math.round(progress)}%
        </motion.span>
      </div>
    </motion.div>
  );
};

function App() {
  const location = useLocation();
  
  // REAL FIX
  const [currentLoaded, setCurrentLoaded] = useState(0);
  const [isReady, setIsReady] = useState(false);

  const totalAssets = PRELOAD_IMAGES.length;
  const progress = (currentLoaded / totalAssets) * 100;

  useEffect(() => {
    let loaded = 0;
    
    PRELOAD_IMAGES.forEach(src => {
      const img = new Image();
      img.src = src;
      img.onload = () => {
        loaded++;
        setCurrentLoaded(loaded);
        if (loaded === totalAssets) {
          setTimeout(() => setIsReady(true), 800); // Small buffer for smoothness
        }
      };
      img.onerror = () => {
        loaded++; // Count as "loaded" even on error to prevent hang
        setCurrentLoaded(loaded);
        if (loaded === totalAssets) {
          setTimeout(() => setIsReady(true), 800);
        }
      };
    });
  }, [totalAssets]);

  return (
    <div className="flex flex-col min-h-screen">
      <AnimatePresence>
        {!isReady && <LoadingScreen progress={progress} />}
      </AnimatePresence>

      <Suspense fallback={null}>
        <AnimatePresence mode="wait">
          <Routes location={location} key={location.pathname}>
            <Route path="/fair" element={
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.5 }}
              >
                <FairPage />
              </motion.div>
            } />
            {/* Direct all root and unknown traffic to the external Home deployment */}
            <Route path="/" element={<ExternalRedirect />} />
            <Route path="*" element={<ExternalRedirect />} />
          </Routes>
        </AnimatePresence>
      </Suspense>
    </div>
  );
}

export default App
