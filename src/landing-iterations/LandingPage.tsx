import React, { useRef, useEffect, useState } from 'react';
import ThawReveal from './ThawReveal';
import { motion, useMotionValue, useSpring, useScroll, useTransform } from 'framer-motion';
import { Canvas } from '@react-three/fiber';
import { Environment, ContactShadows } from '@react-three/drei';
import { HangmanModel, EggModel, IceCubeModel } from '../components/3d/Models';
import './shared-styles.css';

/**
 * FrostBloom Landing Page
 * Combines "The Thaw" interactive reveal with the "Grand Entrance" scroll expansion.
 */
const LandingPage: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const scrollWrapperRef = useRef<HTMLDivElement>(null);

  // 1. Mouse Tracking for "The Thaw"
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

  // 2. Scroll Animation Logic
  // Using absolute scrollY in pixels is 100% foolproof for cross-browser expansion
  const { scrollY } = useScroll();
  const [vh, setVh] = useState(800);
  const [vw, setVw] = useState(1200);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      setVh(window.innerHeight);
      setVw(window.innerWidth);
      const onResize = () => {
        setVh(window.innerHeight);
        setVw(window.innerWidth);
      };
      window.addEventListener('resize', onResize);
      return () => window.removeEventListener('resize', onResize);
    }
  }, []);

  // Animate from base px to 95% of viewport as user scrolls exactly 100vh down
  const boxWidth = useTransform(scrollY, [0, vh], [750, vw * 0.95]);
  const boxHeight = useTransform(scrollY, [0, vh], [550, vh * 0.95]);
  const boxRadius = useTransform(scrollY, [0, vh], [50, 24]);

  // Fades out the intro text at halfway point of Segment 1
  const textOpacity = useTransform(scrollY, [0, vh * 0.5], [1, 0]);

  // The moment the text disappears (vh * 0.5), rapidly shrink the UI blob to 0
  const blobRadius = useTransform(scrollY, [vh * 0.45, vh * 0.5], [250, 0]);

  // SEGMENT 2: THE SHATTER (Scroll: vh -> 2.5vh)

  // Padlock entrance: Slides up from the bottom (0.5 * vh) into a resting position perfectly tuned via -30px offset
  const padlockEntryY = useTransform(scrollY, [vh, vh * 1.5], [vh * 0.5, (vh * 0.01)]);

  // Intact Padlock: Strictly invisible outside of Segment 2 bounds
  // Snaps to 0 opacity between 2.05vh and 2.1vh to simulate a sharp break.
  const intactOpacity = useTransform(scrollY, [0, vh * 0.9, vh, vh * 1.5, vh * 2.05, vh * 2.1, 5 * vh], [0, 0, 0, 1, 1, 0, 0]);

  // Broken Padlock: Fades in precisely at the break, and hangs in the air for a longer scroll distance.
  const brokenOpacity = useTransform(scrollY, [vh * 2.05, vh * 2.1, vh * 2.6], [0, 1, 0]);
  const brokenScale = useTransform(scrollY, [vh * 2.1, vh * 2.8], [1, 2.5]);

  // A blinding flash of light to sell the 'shatter', dissipates slowly.
  const shatterFlash = useTransform(scrollY, [vh * 2.0, vh * 2.1, vh * 2.6], [0, 1, 0]);

  // High Frequency Shake Math: Intensity builds linearly from 1.5vh to 2.1vh
  // Frequencies (0.08, 0.12, 0.05) reduced to create a slower, groaning vibration
  const padlockShakeX = useTransform(scrollY, (y) => {
    const start = vh * 1.5;
    const end = Math.max(vh * 2.1, start + 1); // Avoid 0 division just in case
    if (y < start || y > end) return 0;
    const progress = (y - start) / (end - start);
    return Math.sin(y * 0.08) * (40 * progress);
  });

  const padlockShakeY = useTransform(scrollY, (y) => {
    const start = vh * 1.5;
    const end = Math.max(vh * 2.1, start + 1);
    if (y < start || y > end) return 0;
    const progress = (y - start) / (end - start);
    return Math.cos(y * 0.12) * (30 * progress);
  });

  const padlockShakeRotate = useTransform(scrollY, (y) => {
    const start = vh * 1.5;
    const end = Math.max(vh * 2.1, start + 1);
    if (y < start || y > end) return 0;
    const progress = (y - start) / (end - start);
    return Math.sin(y * 0.05) * (20 * progress);
  });

  // SEGMENT 3: THE LORE (Scroll: 2.5vh -> 6.5vh)
  // Staggered cinematic text. 
  // Math: 0.2vh Fade-in -> 0.3vh Pause (stays 1) -> 0.2vh Fade-out

  // Section 1
  const lore1Opacity = useTransform(scrollY, [vh * 2.6, vh * 2.8, vh * 3.1, vh * 3.3], [0, 1, 1, 0]);
  const lore1Y = useTransform(scrollY, [vh * 2.6, vh * 3.3], [50, -50]);

  // Section 2
  const lore2Opacity = useTransform(scrollY, [vh * 3.4, vh * 3.6, vh * 3.9, vh * 4.1], [0, 1, 1, 0]);
  const lore2Y = useTransform(scrollY, [vh * 3.4, vh * 4.1], [50, -50]);

  // Section 3
  const lore3Opacity = useTransform(scrollY, [vh * 4.2, vh * 4.4, vh * 4.7, vh * 4.9], [0, 1, 1, 0]);
  const lore3Y = useTransform(scrollY, [vh * 4.2, vh * 4.9], [50, -50]);

  // Section 4
  const lore4Opacity = useTransform(scrollY, [vh * 5.0, vh * 5.2, vh * 5.5, vh * 5.7], [0, 1, 1, 0]);
  const lore4Y = useTransform(scrollY, [vh * 5.0, vh * 5.7], [50, -50]);

  // Section 5
  const lore5Opacity = useTransform(scrollY, [vh * 5.8, vh * 6.0, vh * 6.3, vh * 6.5], [0, 1, 1, 0]);
  const lore5Y = useTransform(scrollY, [vh * 5.8, vh * 6.5], [50, -50]);

  // SEGMENT 4: HORIZONTAL SCROLL right-to-left
  const galleryTranslateX = useTransform(scrollY, [vh * 6.5, vh * 7.5, vh * 8.5, vh * 9.5], ['100%', '0%', '-100%', '-200%']);
  const panel1Opacity = 1;
  const panel2Opacity = 1;
  const panel3Opacity = 1;

  // 3D objects static in slots (no whiplash)
  const game1X = 0; const game1Y = 0; const game1Rotate = 0; const game1Opacity = 1;
  const game2X = 0; const game2Y = 0; const game2Rotate = 0; const game2Opacity = 1;
  const game3X = 0; const game3Y = 0; const game3Rotate = 0; const game3Opacity = 1;

  // SEGMENT 5: CTA (Scroll: 9.5vh -> 11vh)
  const ctaOpacity = useTransform(scrollY, [vh * 9.5, vh * 10.0], [0, 1]);
  const ctaY = useTransform(scrollY, [vh * 9.5, vh * 10.0], [60, 0]);

  // Shared content inside the expanding container
  const ContentInner = ({ isWarm }: { isWarm: boolean }) => (
    <motion.div className="ui-inner" style={{ opacity: textOpacity }}>
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
    </motion.div>
  );

  return (
    <div className="landing-container landing-page frostbloom-iteration">

      {/* 👑 GLOBAL HEADER: ALWAYS AT THE TOP */}
      <div className="frostbloom-global-header">
        <h2 className="header-title">FrostBloom</h2>
        <p className="header-tagline">Let the Ice Melt</p>
      </div>

      {/* 🎢 THE SCROLL TRACK (200vh generates scrollable space) */}
      <div ref={scrollWrapperRef} className="scroll-trigger-area">

        {/* The 'Fixed' Hero View: Unconditionally stays pinned to the screen */}
        <div className="fixed-hero-view">

          {/* 🔥 Background: Organic Thaw Reveal */}
          <div className="thaw-container">
            <ThawReveal
              winterSrc="/winter.png"
              springSrc="/spring.png"
              thawRadius={80} // Precise image reveal
              persistence={0.99}
            />
          </div>

          {/* 🏠 UI: The Expanding Box */}
          <div className="landing-content-layer">
            <motion.div
              ref={containerRef}
              className="ui-stack-container"
              style={{
                width: boxWidth,
                height: boxHeight,
                borderRadius: boxRadius
              }}
            >

              {/* [LAYER 1]: Winter (Frozen Base - Vanishes) */}
              <motion.div
                className="landing-content frozen-layer vanish-mask"
                style={{
                  // Sharp Binary Mask to eliminate ghosting
                  WebkitMaskImage: `radial-gradient(circle calc(var(--br) * 1px) at calc(var(--mx) * 1px) calc(var(--my) * 1px), transparent 99%, black 100%)`,
                  maskImage: `radial-gradient(circle calc(var(--br) * 1px) at calc(var(--mx) * 1px) calc(var(--my) * 1px), transparent 99%, black 100%)`,
                  // @ts-ignore
                  "--mx": springX,
                  "--my": springY,
                  "--br": blobRadius,
                }}
              >
                <ContentInner isWarm={false} />
              </motion.div>

              {/* [LAYER 2]: Spring (Warm Reveal - Appears) */}
              <motion.div
                className="landing-content warm-layer reveal-mask"
                style={{
                  // Sharp Binary Mask ensures NO white text remains inside
                  WebkitMaskImage: `radial-gradient(circle calc(var(--br) * 1px) at calc(var(--mx) * 1px) calc(var(--my) * 1px), black 99%, transparent 100%)`,
                  maskImage: `radial-gradient(circle calc(var(--br) * 1px) at calc(var(--mx) * 1px) calc(var(--my) * 1px), black 99%, transparent 100%)`,
                  // @ts-ignore
                  "--mx": springX,
                  "--my": springY,
                  "--br": blobRadius,
                }}
              >
                <ContentInner isWarm={true} />
              </motion.div>
            </motion.div>
          </div>
            

          {/* SEGMENT 2: THE FROZEN PADLOCK */}
          {/* This sits seamlessly over the expanded UI box and reacts to the user scrolling */}
          <div className="padlock-segment">
            <motion.div
              className="shatter-flash"
              style={{ opacity: shatterFlash }}
            />

            {/* Master Position Container: Handles sliding up from below */}
            <motion.div className="padlock-wrapper" style={{ y: padlockEntryY }}>

              {/* The Intact Padlock (Shakes and vanishes) */}
              <motion.div
                className="padlock-image"
                style={{
                  opacity: intactOpacity,
                  x: padlockShakeX,
                  y: padlockShakeY,
                  rotate: padlockShakeRotate,
                  backgroundImage: `url(/padlock.png)`
                }}
              />

              {/* The Shattered Padlock (Explodes outward overlaying intact one) */}
              <motion.div
                className="padlock-image broken-image"
                style={{
                  opacity: brokenOpacity,
                  scale: brokenScale,
                  backgroundImage: `url(/padlock-broken.png)`
                }}
              />

            </motion.div>

            <motion.div
              style={{
                opacity: intactOpacity,
                position: 'absolute',
                bottom: '15vh',
                width: '100vw',
                left: 0,
                textAlign: 'center'
              }}
            >
              <h2 className="padlock-text">
                Keep Scrolling to Shatter
              </h2>
            </motion.div>
          </div>

          {/* SEGMENT 3: THE CINEMATIC LORE */}
          <div className="lore-segment">

            <motion.div className="lore-content" style={{ opacity: lore1Opacity, y: lore1Y }}>
              <h3 className="lore-title">Part 1: The Rebellion</h3>
              <p className="lore-text">"The Easter eggs are tired. Year after year, the same celebration. The same routines. This year, they've decided: no puzzles solved, no Easter happens. They're hiding, and they won't come out until someone proves Easter is worth celebrating again."</p>
            </motion.div>

            <motion.div className="lore-content" style={{ opacity: lore2Opacity, y: lore2Y }}>
              <h3 className="lore-title">Part 2: The Outsider</h3>
              <p className="lore-text">"I'm Jack Frost. Winter's guardian. I've always been on the outside looking in—watching Easter celebrations from the cold, never invited to join. The village doesn't celebrate me. They celebrate spring, rebirth, new beginnings. What about winter? What about me?"</p>
            </motion.div>

            <motion.div className="lore-content" style={{ opacity: lore3Opacity, y: lore3Y }}>
              <h3 className="lore-title">Part 3: My Chance</h3>
              <p className="lore-text">"But today, something shifted. The eggs are challenging everyone, and the bunnies are panicking. For the first time, someone needs me. I'm volunteering to solve the eggs' puzzles. Not for the village. For myself. To prove I belong."</p>
            </motion.div>

            <motion.div className="lore-content" style={{ opacity: lore4Opacity, y: lore4Y }}>
              <h3 className="lore-title">Part 4: The Deal</h3>
              <p className="lore-text">"Each puzzle I solve, an egg returns. With every egg, spring gets stronger. Winter loosens its grip. And maybe, just maybe, I'll finally be part of Easter too."</p>
            </motion.div>

            <motion.div className="lore-content" style={{ opacity: lore5Opacity, y: lore5Y }}>
              <h3 className="lore-title">Part 5: The Truth</h3>
              <p className="lore-text">"Easter is about rebirth. This is mine. Help me solve these puzzles. Help me bring Easter back. Help me find my place in spring."</p>
            </motion.div>
          </div>

          <div className="horizontal-gallery-mask">
            <motion.div className="horizontal-gallery-track" style={{ x: galleryTranslateX }}>
               
               {/* PANEL 1: HANGMAN */}
               <motion.div className="gallery-panel" style={{ opacity: panel1Opacity }}>
                 <div className="panel-content">
                    <div className="panel-card">
                      <div className="card-visual-bay">
                        <motion.div 
                          className="gallery-object" 
                          style={{ x: game1X, y: game1Y, rotate: game1Rotate, opacity: game1Opacity }} 
                        >
                          <Canvas camera={{ position: [0, 0, 5], fov: 40 }}>
                            <ambientLight intensity={1.5} />
                            <pointLight position={[10, 10, 10]} intensity={2} />
                            <spotLight position={[-10, 10, 10]} angle={0.15} penumbra={1} intensity={2} />
                            <HangmanModel />
                            <Environment preset="city" />
                            <ContactShadows position={[0, -1.2, 0]} opacity={0.6} scale={10} blur={2} far={10} />
                          </Canvas>
                        </motion.div>
                      </div>
                      <div className="card-text-area">
                        <span className="game-label">Game 1: Hangman</span>
                        <h3>Hanging by a Thread</h3>
                        <p>"Guess the hidden Easter word before the figure is complete. Each wrong guess brings you closer to defeat. Think carefully—Jack's counting on you."</p>
                      </div>
                    </div>
                 </div>
               </motion.div>
               
               {/* PANEL 2: EASTER HUNT */}
               <motion.div className="gallery-panel" style={{ opacity: panel2Opacity }}>
                 <div className="panel-content">
                    <div className="panel-card">
                      <div className="card-visual-bay">
                        <motion.div 
                          className="gallery-object" 
                          style={{ x: game2X, y: game2Y, rotate: game2Rotate, opacity: game2Opacity }} 
                        >
                          <Canvas camera={{ position: [0, 0, 5], fov: 35 }}>
                            <ambientLight intensity={1.5} />
                            <pointLight position={[10, 10, 10]} intensity={2} color="#ff9a9e" />
                            <EggModel />
                            <Environment preset="warehouse" />
                            <ContactShadows position={[0, -1.2, 0]} opacity={0.6} scale={10} blur={2.5} far={10} />
                          </Canvas>
                        </motion.div>
                      </div>
                      <div className="card-text-area">
                        <span className="game-label">Game 2: Easter Hunt</span>
                        <h3>Eggs-traordinary Search</h3>
                        <p>"Five eggs are hidden in the Easter Fair scene. Find them all before time runs out. Keep your eyes sharp—some eggs are harder to spot than others."</p>
                      </div>
                    </div>
                 </div>
               </motion.div>

               {/* PANEL 3: ICE EGG */}
               <motion.div className="gallery-panel" style={{ opacity: panel3Opacity }}>
                 <div className="panel-content">
                    <div className="panel-card">
                      <div className="card-visual-bay">
                        <motion.div 
                          className="gallery-object" 
                          style={{ x: game3X, y: game3Y, rotate: game3Rotate, opacity: game3Opacity }} 
                        >
                          <Canvas camera={{ position: [0, 0, 5], fov: 35 }}>
                            <ambientLight intensity={1} />
                            <pointLight position={[10, 10, 10]} intensity={3} color="#a0d8ef" />
                            <IceCubeModel />
                            <Environment preset="night" />
                            <ContactShadows position={[0, -1.2, 0]} opacity={0.8} scale={10} blur={2} far={10} />
                          </Canvas>
                        </motion.div>
                      </div>
                      <div className="card-text-area">
                        <span className="game-label">Game 3: Ice Egg</span>
                        <h3>Crack Under Pressure</h3>
                        <p>"Melt the ice blocks to free the Easter eggs inside. But beware—some blocks contain bombs! You have 3 lives and 20 seconds. Choose wisely."</p>
                      </div>
                    </div>
                 </div>
               </motion.div>

            </motion.div>
          </div>

          {/* SEGMENT 5: THE CTA */}
          <motion.div className="cta-segment" style={{ opacity: ctaOpacity, y: ctaY }}>
            <p className="cta-overline">You've seen what's at stake.</p>
            <h2 className="cta-headline">Jack Frost is ready.<br />Are you?</h2>
            <p className="cta-subtext">Help Jack solve Easter's puzzles. Bring back the eggs. Save spring.</p>
            <button className="play-btn">
              <span className="play-btn-icon">🐣</span>
              Begin the Easter Fair
            </button>
          </motion.div>

        </div>
      </div>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@700&display=swap');

        /* Baseline Reset */
        html, body {
           margin: 0; padding: 0;
           overscroll-behavior: none;
           background: #000;
           scrollbar-width: none;
           -ms-overflow-style: none;
           overflow-x: hidden; /* Prevent page-level horizontal scroll */
        }

        html::-webkit-scrollbar,
        body::-webkit-scrollbar {
          display: none; /* Chrome/Safari */
        }

        .horizontal-gallery-mask {
          position: absolute;
          inset: 0;
          overflow: hidden;
          z-index: 50; 
          pointer-events: none;
        }

        .horizontal-gallery-track {
          position: absolute;
          inset: 0;
          display: flex;
          flex-direction: row;
          width: 300%;
          height: 100%;
          pointer-events: auto;
        }

        .gallery-panel {
          flex: 0 0 33.333%;
          width: 33.333%;
          height: 100%;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .panel-content {
          width: 100%;
          height: 100%;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .panel-card {
           display: flex;
           align-items: center;
           background: linear-gradient(135deg, rgba(15, 23, 42, 0.85), rgba(0, 0, 0, 0.7)); /* Strong dark frosted glass */
           border: 1px solid rgba(255, 255, 255, 0.15);
           border-radius: 40px;
           padding: 50px;
           backdrop-filter: blur(20px);
           box-shadow: 0 40px 100px rgba(0,0,0,0.6), inset 0 1px 0 rgba(255,255,255,0.1);
           max-width: 950px;
           width: 85%;
           gap: 60px;
        }

        .card-visual-bay {
           flex: 0 0 200px;
           height: 200px;
           position: relative; 
           background: rgba(255,255,255,0.05);
           border-radius: 20px;
           border: 1px solid rgba(255,255,255,0.1);
        }

        .card-text-area {
           flex: 1;
           text-align: left;
        }

        .game-label {
           display: block;
           font-family: 'Space Grotesk', sans-serif;
           text-transform: uppercase;
           letter-spacing: 4px;
           font-size: 0.8rem;
           color: #a0d8ef; /* Bright icy blue */
           margin-bottom: 15px;
           font-weight: 700;
        }

        .panel-content h3 {
          font-family: 'Space Grotesk', sans-serif;
          font-size: 2.2rem; 
          color: #ffffff;
          margin: 0 0 12px 0;
          letter-spacing: -0.5px;
          line-height: 1.2;
          font-weight: 700;
        }

        .panel-content p {
          font-family: 'Inter', sans-serif;
          font-size: 1.05rem;
          color: rgba(255, 255, 255, 0.8);
          line-height: 1.6;
          margin: 0;
          font-weight: 400;
        }

        /* 🚀 SEGMENT 5: CTA */
        .cta-segment {
          position: absolute;
          inset: 0;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          text-align: center;
          padding: 60px 40px;
          z-index: 55;
          pointer-events: none; /* Never blocks clicks when invisible */
        }

        .cta-overline {
          font-family: 'Space Grotesk', sans-serif;
          font-size: 0.9rem;
          font-weight: 700;
          letter-spacing: 4px;
          text-transform: uppercase;
          color: #a0d8ef;
          margin: 0 0 20px 0;
        }

        .cta-headline {
          font-family: 'Space Grotesk', sans-serif;
          font-size: clamp(2.5rem, 6vw, 5rem);
          font-weight: 800;
          line-height: 1.1;
          letter-spacing: -2px;
          margin: 0 0 24px 0;
          background: linear-gradient(135deg, #a0d8ef 0%, #4ade80 60%, #fde68a 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          filter: drop-shadow(0 4px 20px rgba(74, 222, 128, 0.5));
        }

        .cta-subtext {
          font-family: 'Inter', sans-serif;
          font-size: 1.15rem;
          color: rgba(255, 255, 255, 0.7);
          max-width: 520px;
          line-height: 1.7;
          margin: 0 0 48px 0;
        }

        .play-btn {
          display: inline-flex;
          align-items: center;
          gap: 12px;
          padding: 20px 56px;
          font-family: 'Space Grotesk', sans-serif;
          font-size: 1.2rem;
          font-weight: 800;
          letter-spacing: 1px;
          color: #0f172a;
          background: linear-gradient(135deg, #4ade80, #a0d8ef);
          border: none;
          border-radius: 999px;
          cursor: pointer;
          box-shadow: 0 0 40px rgba(74, 222, 128, 0.6), 0 20px 60px rgba(0,0,0,0.4);
          transition: transform 0.2s ease, box-shadow 0.2s ease;
        }

        .play-btn:hover {
          transform: translateY(-4px) scale(1.04);
          box-shadow: 0 0 70px rgba(74, 222, 128, 0.9), 0 30px 80px rgba(0,0,0,0.5);
        }

        .play-btn-icon {
          font-size: 1.5rem;
        }

        /* ☄️ THE BALLISTIC OBJECT */
        .gallery-object {
          position: absolute;
          /* Centered inside the visual bay */
          left: 50%; 
          top: 50%;
          margin-top: -100px; /* Half of 200px */
          margin-left: -100px;
          width: 200px;
          height: 200px;
          z-index: 100;
          overflow: visible;
          /* Ensure no center positioning conflicts */
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .gallery-object canvas {
          width: 100% !important;
          height: 100% !important;
          border-radius: 20px;
        }

        .frostbloom-iteration {
          position: relative;
          width: 100vw;
          background: #000;
        }

        /* 👑 GLOBAL HEADER */
        .frostbloom-global-header {
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          padding: 30px 0;
          text-align: center;
          z-index: 100;
          pointer-events: none; /* Let clicks pass through to the blob */
        }

        .header-title {
          margin: 0;
          font-size: 3.5rem; /* Significantly larger */
          font-family: 'Space Grotesk', sans-serif;
          font-weight: 700;
          letter-spacing: -2px;
          /* Icy Blue to Brilliant Grass Green Gradient */
          background: linear-gradient(90deg, #a0d8ef 0%, #4ade80 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          /* 3D Popout Effect */
          filter: drop-shadow(0px 4px 0px #1b5e20) drop-shadow(0px 8px 15px rgba(0,0,0,0.8));
          padding: 0.1em 0; /* Prevents webkit clip from sliding tops off large fonts */
        }

        .header-tagline {
          margin: 0;
          font-size: 1.5rem; /* Larger */
          font-family: 'Space Grotesk', sans-serif; /* Enforcing Space Grotesk here too */
          font-weight: 700;
          color: #ffffff;
          letter-spacing: 6px;
          text-transform: uppercase;
          text-shadow: 0 4px 8px rgba(0,0,0,0.8);
          margin-top: -10px; /* Pulls closer to the massive 3D title */
        }

        /* 🎢 SCROLL LOGIC */
        .scroll-trigger-area {
          position: relative;
          height: 1100vh;
          width: 100vw;
        }

        .fixed-hero-view {
          position: fixed;
          top: 0;
          left: 0;
          height: 100vh;
          width: 100vw;
          overflow: hidden;
          z-index: 5;
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
          /* Width and height are now controlled by Framer Motion */
          display: grid;
          place-items: center;
          pointer-events: auto;
          overflow: hidden;
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

        .btn-frozen { background: rgba(255,255,255,0.05); color: #fff; border: 1px solid rgba(255,255,255,0.2); padding: 18px 40px; border-radius: 99px; cursor: pointer; }
        .btn-warm { background: linear-gradient(90deg, #a0d8ef 0%, #4ade80 100%); color: #000; border: none; padding: 18px 40px; font-weight: 800; border-radius: 99px; cursor: pointer; box-shadow: 0 10px 30px rgba(74, 222, 128, 0.4); }

        .action-row { margin-top: 32px; }
        h1 { font-size: 3.5rem; margin-bottom: 24px; line-height: 1.1; letter-spacing: -2px; }

        /* 🔒 SEGMENT 2 PADLOCK */
        .padlock-segment {
          position: absolute;
          inset: 0;
          display: grid;
          place-items: center;
          z-index: 50; /* Sits above standard UI box */
          pointer-events: none;
        }

        .padlock-wrapper {
          position: relative;
          display: grid;
          place-items: center;
        }

        .padlock-image {
          width: 35vh; /* Reduced size based on user request */
          height: 35vh;
          background-size: contain;
          background-position: center;
          background-repeat: no-repeat;
        }
        
        .broken-image {
          position: absolute;
          inset: 0; /* Overlays perfectly on top of the intact lock */
        }

        .shatter-flash {
          position: absolute;
          inset: 0;
          background: radial-gradient(circle at center, rgba(255, 255, 255, 1) 0%, rgba(200, 240, 255, 0.8) 30%, rgba(255, 255, 255, 0) 70%);
          z-index: -1;
          filter: blur(10px);
        }
        
        .padlock-text {
          color: rgba(255, 255, 255, 0.7);
          font-size: 1.5rem;
          letter-spacing: 8px;
          text-transform: uppercase;
          text-shadow: 0 4px 10px rgba(0, 0, 0, 0.5);
          animation: pulse-text 2s infinite ease-in-out;
          margin: 0;
        }

        @keyframes pulse-text {
          0%, 100% { opacity: 0.5; }
          50% { opacity: 1; }
        }

        /* 📖 SEGMENT 3 LORE */
        .lore-segment {
          position: absolute;
          inset: 0;
          display: grid;
          place-items: center;
          z-index: 40; /* Below Padlock, inside glass */
          pointer-events: none;
        }

        .lore-content {
          position: absolute;
          max-width: 900px;
          text-align: center;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 1.5rem;
          /* Dark radial halo to separate text from the busy background */
          background: radial-gradient(ellipse at center, rgba(0,0,0,0.6) 0%, rgba(0,0,0,0) 70%);
          padding: 60px;
          border-radius: 40px;
        }

        .lore-title {
          font-family: 'Garamond', serif;
          font-size: 3.5rem;
          font-weight: 800;
          letter-spacing: 6px;
          text-transform: uppercase;
          margin: 0;
          line-height: 1.3;
          /* Beautiful Icy Metallic effect restored */
          background: linear-gradient(90deg, #ffffff 0%, #a0d8ef 50%, #ffffff 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          /* Padding completely prevents WebKit from slicing the top off the letters */
          padding: 0.2em 0;
          /* Use drop-shadow filter instead of text-shadow for background-clipped text */
          filter: drop-shadow(0px 4px 10px rgba(0, 0, 0, 0.9));
        }

        .lore-text {
          font-family: 'Garamond', serif;
          font-size: 2rem;
          color: rgba(255, 255, 255, 0.95);
          font-weight: 300;
          letter-spacing: 2px;
          line-height: 1.6;
          /* Extremely strong double outer shadow for maximum background contrast */
          text-shadow: 0 2px 10px rgba(0,0,0,1), 0 4px 20px rgba(0,0,0,0.8);
          margin: 0;
        }
      `}</style>
    </div>
  );
};

export default LandingPage;
