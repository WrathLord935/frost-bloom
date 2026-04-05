import React, { useRef, useEffect, useState } from 'react';
import ThawReveal from '../landing-iterations/ThawReveal';
import { motion, useMotionValue, useSpring, useScroll, useTransform } from 'framer-motion';
import { Canvas } from '@react-three/fiber';
import { Environment, ContactShadows } from '@react-three/drei';
import { HangmanModel, EggModel, IceCubeModel } from '../components/3d/Models';
import { useNavigate } from 'react-router-dom';
import '../landing-iterations/shared-styles.css';

/**
 * FrostBloom Landing Page
 * Combines "The Thaw" interactive reveal with the "Grand Entrance" scroll expansion.
 */
const HomePage: React.FC = () => {
  const navigate = useNavigate();
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

  // SEGMENT 5: ABOUT (Scroll: 9.5vh -> 11.5vh)
  const aboutOpacity = useTransform(scrollY, [vh * 9.5, vh * 9.8, vh * 11.2, vh * 11.5], [0, 1, 1, 0]);
  const aboutY = useTransform(scrollY, [vh * 9.5, vh * 9.8], [60, 0]);
  const aboutScale = useTransform(scrollY, [vh * 9.5, vh * 9.8], [1.5, 1]);

  // SEGMENT 6: CTA (Scroll: 11.5vh -> 13vh)
  const ctaOpacity = useTransform(scrollY, [vh * 11.5, vh * 12.0], [0, 1]);
  const ctaY = useTransform(scrollY, [vh * 11.5, vh * 12.0], [60, 0]);

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

          {/* SEGMENT 5: ABOUT THE PROJECT */}
          <motion.div className="about-segment" style={{ opacity: aboutOpacity, y: aboutY, scale: aboutScale }}>
            <div className="about-card">
              <div className="about-card-horizontal">
                {/* 👤 LEFT SIDE: PROFILE IMAGE */}
                <div className="creator-profile-outer">
                  <div className="creator-profile-glow" />
                  <div className="creator-profile-img">
                    <img
                      src="/Sung Jin Woo Purple Cropped.png"
                      alt="Sufiyan Shiraj Mohammed"
                      style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                    />
                  </div>
                </div>

                {/* 📝 RIGHT SIDE: CREATOR INFO & SOCIALS */}
                <div className="creator-content-right">
                  <span className="creator-label">Crafted by</span>
                  <h4 className="creator-name">Sufiyan Shiraj Mohammed</h4>

                  <div className="social-links-row">
                    <a href="https://github.com/WrathLord935" target="_blank" rel="noopener noreferrer" className="social-btn github-btn" title="GitHub">
                      <svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" /></svg>
                      <span>GitHub</span>
                    </a>
                    <a href="https://www.linkedin.com/in/sufiyan-shiraj-mohammed" target="_blank" rel="noopener noreferrer" className="social-btn linkedin-btn" title="LinkedIn">
                      <svg viewBox="0 0 24 24" fill="currentColor"><path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" /></svg>
                      <span>LinkedIn</span>
                    </a>
                    <a href="https://www.instagram.com/sufiyan.shiraj" target="_blank" rel="noopener noreferrer" className="social-btn instagram-btn" title="Instagram">
                      <svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.441 1.441 1.441c.795 0 1.439-.645 1.439-1.441s-.644-1.44-1.439-1.44z" /></svg>
                      <span>Instagram</span>
                    </a>
                    <a href="https://discord.gg/QWATFt6H" target="_blank" rel="noopener noreferrer" className="social-btn discord-btn" title="Discord: Chai-T">
                      <svg viewBox="0 0 24 24" fill="currentColor"><path d="M20.317 4.3698a19.7913 19.7913 0 00-4.8851-1.5152.0741.0741 0 00-.0785.0371c-.211.3753-.4447.8648-.6083 1.2495-1.8447-.2758-3.68-.2758-5.4868 0-.1636-.3933-.4058-.8742-.6177-1.2495a.077.077 0 00-.0785-.037 19.7363 19.7363 0 00-4.8852 1.515.0699.0699 0 00-.0321.0277C.5334 9.0458-.319 13.5799.0992 18.0578a.0824.0824 0 00.0312.0561c2.0528 1.5076 4.0413 2.4228 5.9929 3.0294a.0777.0777 0 00.0842-.0276c.4616-.6304.8731-1.2952 1.226-1.9942a.076.076 0 00-.0416-.1057c-.6528-.2476-1.2743-.5495-1.8722-.8923a.077.077 0 01-.0076-.1277c.1258-.0943.2517-.1923.3718-.2914a.0743.0743 0 01.0775-.0105c3.9278 1.7933 8.18 1.7933 12.0614 0a.0739.0739 0 01.0775.0105c.1201.0991.246.1971.3718.2914a.077.077 0 01-.0066.1277c-.5979.3428-1.2194.6447-1.8722.8923a.076.076 0 00-.0416.1057c.3528.699.7644 1.3638 1.226 1.9942a.0775.0775 0 00.0842.0276c1.9516-.6066 3.9401-1.5218 5.993-3.0294a.077.077 0 00.0313-.0561c.5004-5.177-.8382-9.6739-3.5493-13.6604a.061.061 0 00-.0312-.0286zM8.02 15.3312c-1.1825 0-2.1569-1.0857-2.1569-2.419 0-1.3332.9555-2.4189 2.157-2.4189 1.2108 0 2.1757 1.0952 2.1568 2.419 0 1.3332-.9555 2.4189-2.1569 2.4189zm7.9748 0c-1.1825 0-2.1569-1.0857-2.1569-2.419 0-1.3332.9554-2.4189 2.1569-2.4189 1.2108 0 2.1757 1.0952 2.1568 2.419 0 1.3332-.946 2.4189-2.1568 2.4189z" /></svg>
                      <span>Chai-T</span>
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>

          {/* SEGMENT 6: THE CTA */}
          <motion.div className="cta-segment" style={{ opacity: ctaOpacity, y: ctaY }}>
            <p className="cta-overline">You've seen what's at stake.</p>
            <h2 className="cta-headline">Jack Frost is ready.<br />Are you?</h2>
            <p className="cta-subtext">Help Jack solve Easter's puzzles. Bring back the eggs. Save spring.</p>
            <button className="play-btn" onClick={() => navigate('/fair')} style={{ pointerEvents: 'auto' }}>
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
          height: 1300vh;
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
          margin: 0;
        }

        /* ❄️ SEGMENT 5: ABOUT SECTION */
        /* ❄️ SEGMENT 5: ABOUT SECTION (Horizontal Refinement) */
        .about-segment {
          position: absolute;
          inset: 0;
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 55;
          pointer-events: none;
          padding: 0 40px;
        }

        .about-card {
          width: 100%;
          max-width: 900px;
          padding: 50px 60px;
          background: rgba(15, 23, 42, 0.4);
          backdrop-filter: blur(40px);
          border: 1px solid rgba(186, 230, 253, 0.15);
          border-radius: 50px;
          box-shadow: 
            0 40px 120px rgba(0, 0, 0, 0.6),
            inset 0 1px 2px rgba(255, 255, 255, 0.1);
          pointer-events: auto;
          overflow: hidden;
        }

        .about-card-horizontal {
          display: flex;
          align-items: center;
          gap: 60px;
          text-align: left;
        }

        @media (max-width: 768px) {
          .about-card-horizontal {
            flex-direction: column;
            gap: 30px;
            text-align: center;
          }
        }

        .creator-profile-outer {
          position: relative;
          width: 160px;
          height: 160px;
          flex-shrink: 0;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .creator-profile-glow {
          position: absolute;
          inset: -10px;
          background: linear-gradient(135deg, #a0d8ef77, #4ade8077);
          border-radius: 50%;
          filter: blur(20px);
          animation: profile-pulse 4s infinite ease-in-out;
        }

        @keyframes profile-pulse {
          0%, 100% { transform: scale(1); opacity: 0.4; }
          50% { transform: scale(1.1); opacity: 0.7; }
        }

        .creator-profile-img {
          position: relative;
          width: 100%;
          height: 100%;
          background: rgba(20, 28, 48, 0.6);
          border: 1px solid rgba(186, 230, 253, 0.5);
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          /* Multi-layered glow for icy aura */
          box-shadow: 
            0 10px 40px rgba(0,0,0,0.5),
            0 0 25px rgba(186, 230, 253, 0.25),
            inset 0 0 15px rgba(255, 255, 255, 0.1);
          overflow: hidden; /* Perfect round crop */
          z-index: 2;
        }

        .creator-content-right {
          flex-grow: 1;
        }

        .creator-label {
          display: block;
          font-family: 'Space Grotesk', sans-serif;
          text-transform: uppercase;
          letter-spacing: 5px;
          font-size: 0.85rem;
          color: #a0d8ef;
          opacity: 0.6;
          margin-bottom: 12px;
        }

        .creator-name {
          font-family: 'Space Grotesk', sans-serif;
          font-size: 2.5rem;
          font-weight: 700;
          color: #fff;
          margin: 0 0 36px 0;
          letter-spacing: -1px;
          line-height: 1.1;
        }

        .social-links-row {
          display: flex;
          flex-wrap: wrap;
          gap: 16px;
        }

        .social-btn {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 12px 24px;
          background: rgba(255, 255, 255, 0.03);
          border: 1px solid rgba(255, 255, 255, 0.08);
          border-radius: 100px;
          color: rgba(255, 255, 255, 0.7);
          text-decoration: none;
          font-family: 'Inter', sans-serif;
          font-size: 0.95rem;
          font-weight: 600;
          transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
        }

        .social-btn svg {
          width: 20px;
          height: 20px;
          transition: transform 0.3s ease;
        }

        .social-btn:hover {
          background: rgba(255, 255, 255, 0.1);
          border-color: rgba(255, 255, 255, 0.2);
          color: #fff;
          transform: translateY(-3px);
          box-shadow: 0 15px 30px rgba(0,0,0,0.3);
        }

        .social-btn:hover svg {
          transform: scale(1.15) rotate(-5deg);
        }

        /* Premium Brand Colors on Hover */
        .github-btn:hover { border-color: rgba(240, 98, 146, 0.6); color: #f06292; }
        .linkedin-btn:hover { border-color: rgba(0, 119, 181, 0.6); color: #0077b5; }
        .instagram-btn:hover { border-color: rgba(228, 64, 95, 0.6); color: #e4405f; }
        .discord-btn:hover { border-color: rgba(88, 101, 242, 0.6); color: #5865f2; }

          color: #bae6fd;
          transition: all 0.3s cubic-bezier(0.23, 1, 0.32, 1);
          text-decoration: none;
        }

        .social-link svg {
          width: 24px;
          height: 24px;
        }

        .social-link:hover {
          transform: translateY(-5px);
          background: rgba(186, 230, 253, 0.2);
          border-color: #bae6fd;
          color: #fff;
          box-shadow: 0 10px 25px rgba(160, 216, 239, 0.3);
        }

        .discord-link {
          width: auto;
          padding: 0 20px;
          gap: 12px;
        }

        .discord-handle {
          font-family: 'Space Grotesk', sans-serif;
          font-weight: 700;
          font-size: 0.9rem;
          letter-spacing: 1px;
        }
      `}</style>
    </div>
  );
};

export default HomePage;
