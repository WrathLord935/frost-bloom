import React, { useState, useEffect, useCallback, useRef, Suspense } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Canvas } from '@react-three/fiber';
import { Environment, Float, ContactShadows } from '@react-three/drei';
import { IceCubeModel, EggModel } from '../3d/Models';

interface GameObject {
  id: number;
  position: [number, number, number];
  type: 'egg' | 'bomb';
  cracked: boolean;
  spawnTime: number;
  velocity: [number, number, number];
}

interface IceEggGameProps {
  thawProgress: number;
  onWin: () => void;
  onLose: () => void;
  cameraZ?: number;
  cameraY?: number;
  rotationY?: number;
}

const IceEggGame: React.FC<IceEggGameProps> = ({ 
  thawProgress, 
  onWin, 
  onLose,
  cameraZ = 8,
  cameraY = 0,
  rotationY = 0
}) => {
  // 🧠 GAME STATE
  const [health, setHealth] = useState(3);
  const [score, setScore] = useState(0);
  const [objects, setObjects] = useState<GameObject[]>([]);
  const [isGameOver, setIsGameOver] = useState(false);
  const objectIdRef = useRef(0);
  const lastSpawnRef = useRef(0);
  const crackedIdsRef = useRef(new Set<number>());

  const WIN_SCORE = 10;
  const MAX_OBJECTS = 4; // [LAG FIX]: Further reduced for maximum stability

  // 🏁 GAME LOOP CONDITION
  useEffect(() => {
    if (health <= 0 || Math.floor(score) >= WIN_SCORE) {
      setIsGameOver(true);
      return;
    }
  }, [health, score]);

  // 🏁 WIN/LOSS CALLBACKS
  useEffect(() => {
    if (Math.floor(score) >= WIN_SCORE) {
      setTimeout(onWin, 2000);
    } else if (health <= 0) {
      setTimeout(onLose, 2000);
    }
  }, [score, health, onWin, onLose]);

  // 🧊 SPAWNING & PHYSICS LOGIC
  useEffect(() => {
    if (isGameOver) return;

    const gameLoop = setInterval(() => {
      const now = Date.now();
      
      // Spawn logic
      if (now - lastSpawnRef.current > 1400) {
        setObjects(prev => {
          if (prev.length >= MAX_OBJECTS) return prev;
          
          const type = Math.random() > 0.3 ? 'egg' : 'bomb';
          const newObj: GameObject = {
            id: objectIdRef.current++,
            position: [
              (Math.random() - 0.5) * 8, 
              6, 
              (Math.random() - 0.5) * 2
            ],
            type,
            cracked: false,
            spawnTime: now,
            velocity: [
               (Math.random() - 0.5) * 0.02, 
               -0.05 - Math.random() * 0.03, 
               0
            ]
          };
          lastSpawnRef.current = now;
          return [...prev, newObj];
        });
      }

      // Update positions and filter out-of-bounds
      setObjects(prev => prev
        .map(obj => ({
          ...obj,
          position: [
            obj.position[0] + obj.velocity[0],
            obj.position[1] + obj.velocity[1],
            obj.position[2]
          ] as [number, number, number]
        }))
        .filter(obj => obj.position[1] > -7)
      );
    }, 16);
 // ~60fps logic

    return () => clearInterval(gameLoop);
  }, [isGameOver]);

  const handleCrack = useCallback((id: number) => {
    if (isGameOver || crackedIdsRef.current.has(id)) return;
    
    // Immediate Guard: Mark as cracked in Ref to prevent double-firing in the same frame
    crackedIdsRef.current.add(id);

    setObjects(prev => {
      const obj = prev.find(o => o.id === id);
      if (!obj || obj.cracked) return prev;

      // [BUG FIX]: Increments set to 1
      if (obj.type === 'egg') {
        setScore(s => s + 1);
      } else {
        setHealth(h => h - 1);
      }

      return prev.map(o => o.id === id ? { ...o, cracked: true, velocity: [0, -0.01, 0] } : o);
    });

    // Remove the cracked object after a short delay
    setTimeout(() => {
      setObjects(prev => {
        // Cleanup Ref when object is finally removed
        if (prev.find(o => o.id === id)) {
           // still present, proceed to remove
        }
        return prev.filter(o => o.id !== id);
      });
    }, 1000);
  }, [isGameOver]);

  return (
    <div className="ice-egg-game relative w-full h-full overflow-hidden">
      
      {/* 🖼️ [BACKGROUND LAYER] */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        {/* Winter/Spring Toggle (Strictly cold until 100% completion) */}
        <motion.img
          key={thawProgress >= 1 ? 'spring' : 'winter'}
          src={thawProgress >= 1 ? "/Games/Ice break/Spring-ice.png" : "/Games/Ice break/Winter-ice.png"}
          alt="Game Background"
          style={{ width: '100%', height: '100%', objectFit: 'fill', position: 'absolute', inset: 0 }}
          initial={{ opacity: 0.8 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        />

        {/* Atmosphere Overlay */}
        <div className="absolute inset-0 bg-blue-900/10" style={{ position: 'absolute', inset: 0 }} />
      </div>

      {/* 🏗️ [UI LAYER] */}
      <div className="relative z-10 w-full h-full pointer-events-none">
        
        {/* 🏷️ GAME TITLE & HUD */}
        <div style={{ position: 'absolute', top: '40px', left: '50%', transform: 'translateX(-50%)', width: '100%', textAlign: 'center' }}>
          <h1 style={{
            fontFamily: "'Space Grotesk', sans-serif",
            fontSize: '32px',
            fontWeight: '700',
            color: '#e0f2fe',
            textTransform: 'uppercase',
            letterSpacing: '0.15em',
            textShadow: '0 0 20px rgba(186, 230, 253, 0.6), 0 5px 30px rgba(0, 0, 0, 0.9)',
          }}>
            Crack Under Pressure
          </h1>
          <p style={{ color: '#bae6fd', fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: '0.2em', fontSize: '10px', marginTop: '4px' }}>
            Crack the ice cubes • Avoid the heat
          </p>
        </div>

        {/* 📊 STATS PANELS */}
        <div style={{ position: 'absolute', top: '200px', left: '50%', transform: 'translateX(-50%)', display: 'flex', gap: '20px', pointerEvents: 'auto' }}>
          {/* Health */}
          <div style={{ background: 'rgba(15, 23, 42, 0.4)', backdropFilter: 'blur(8px)', border: '1px solid rgba(186, 230, 253, 0.3)', padding: '10px 20px', borderRadius: '16px', display: 'flex', flexDirection: 'column', alignItems: 'center', minWidth: '100px' }}>
            <span style={{ fontSize: '10px', color: 'rgba(255,255,255,0.4)', fontWeight: 'bold', letterSpacing: '0.1em' }}>HEALTH</span>
            <div style={{ display: 'flex', gap: '4px', marginTop: '4px' }}>
              {[...Array(3)].map((_, i) => (
                <span key={i} style={{ fontSize: '18px', opacity: i < Math.floor(health) ? 1 : 0.2 }}>❤️</span>
              ))}
            </div>
          </div>

          {/* Score */}
          <div style={{ background: 'rgba(15, 23, 42, 0.4)', backdropFilter: 'blur(8px)', border: '1px solid rgba(186, 230, 253, 0.3)', padding: '10px 20px', borderRadius: '16px', display: 'flex', flexDirection: 'column', alignItems: 'center', minWidth: '100px' }}>
            <span style={{ fontSize: '10px', color: 'rgba(255,255,255,0.4)', fontWeight: 'bold', letterSpacing: '0.1em' }}>EGGS FREED</span>
            <span style={{ fontSize: '24px', fontWeight: '900', color: '#bbf7d0', fontFamily: "'Space Grotesk', sans-serif" }}>{Math.floor(score)} / {WIN_SCORE}</span>
          </div>
        </div>

        {/* 🎮 CANVAS AREA */}
        <div style={{ position: 'absolute', inset: 0, zIndex: 5, pointerEvents: 'auto' }}>
          <Canvas camera={{ position: [0, cameraY, cameraZ], fov: 45 }}>
            <Suspense fallback={null}>
              <ambientLight intensity={0.5} />
              <pointLight position={[10, 10, 10]} intensity={1} color="#bae6fd" />
              <spotLight position={[-5, 5, 5]} angle={0.3} penumbra={1} intensity={2} color="#fff" />
              
              <group rotation={[0, rotationY, 0]}>
                <AnimatePresence>
                  {objects.map((obj) => (
                    <group key={obj.id} position={obj.position}>
                      {!obj.cracked ? (
                        <Float speed={3} rotationIntensity={2} floatIntensity={1}>
                          <group 
                            onClick={(e) => { 
                              e.stopPropagation(); 
                              if (!crackedIdsRef.current.has(obj.id)) {
                                handleCrack(obj.id); 
                              }
                            }}
                          >
                            {/* Inner Hint Glow - Optimized distance */}
                            <pointLight 
                              color={obj.type === 'egg' ? '#4ade80' : '#f87171'} 
                              intensity={12} 
                              distance={1.5} 
                              decay={2}
                            />
                            <IceCubeModel scale={0.35} />
                          </group>
                        </Float>
                      ) : (
                        <group scale={0.35}>
                          {obj.type === 'egg' ? (
                            <group>
                              <EggModel scale={0.6} />
                              <pointLight color="#bbf7d0" intensity={5} distance={3} />
                            </group>
                          ) : (
                            <group>
                              <mesh>
                                <sphereGeometry args={[0.2, 16, 16]} />
                                <meshStandardMaterial color="#ef4444" emissive="#ef4444" emissiveIntensity={5} />
                              </mesh>
                              <pointLight color="#ef4444" intensity={8} distance={5} />
                            </group>
                          )}
                        </group>
                      )}
                    </group>
                  ))}
                </AnimatePresence>
              </group>

              <Environment preset="night" />
              <ContactShadows position={[0, -5, 0]} opacity={0.3} scale={15} blur={2} far={10} />
            </Suspense>
          </Canvas>
        </div>

        {/* 💡 INSTRUCTION */}
        <div style={{ position: 'absolute', bottom: '40px', left: '50%', transform: 'translateX(-50%)', color: 'rgba(255,255,255,0.4)', fontSize: '11px', fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: '0.2em' }}>
          Click the ice cubes before they drift away
        </div>
      </div>

      {/* 🎭 WIN/LOSS OVERLAYS */}
      <AnimatePresence>
        {score >= WIN_SCORE && (
          <motion.div
            initial={{ opacity: 0, backdropFilter: 'blur(0px)' }}
            animate={{ opacity: 1, backdropFilter: 'blur(20px)' }}
            style={{ position: 'absolute', inset: 0, zIndex: 100, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', background: 'rgba(20, 83, 45, 0.9)', pointerEvents: 'none' }}
          >
            <h3 style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: '80px', fontWeight: '900', color: '#fff', textTransform: 'uppercase', fontStyle: 'italic', letterSpacing: '-0.05em' }}>UNFROZEN!</h3>
            <p style={{ color: '#bbf7d0', marginTop: '16px', fontWeight: 'bold', letterSpacing: '0.2em', textTransform: 'uppercase' }}>Life Finds a Way</p>
          </motion.div>
        )}
        {(health <= 0) && Math.floor(score) < WIN_SCORE && (
          <motion.div
            initial={{ opacity: 0, backdropFilter: 'blur(0px)' }}
            animate={{ opacity: 1, backdropFilter: 'blur(20px)' }}
            style={{ position: 'absolute', inset: 0, zIndex: 100, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', background: 'rgba(69, 10, 10, 0.9)', pointerEvents: 'none' }}
          >
            <h3 style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: '80px', fontWeight: '900', color: '#fff', textTransform: 'uppercase', fontStyle: 'italic', letterSpacing: '-0.05em' }}>BRITTLE!</h3>
            <p style={{ color: '#fca5a5', marginTop: '16px', fontWeight: 'bold', letterSpacing: '0.2em', textTransform: 'uppercase' }}>The Frost is too strong</p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default IceEggGame;
