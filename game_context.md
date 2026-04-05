# FrostBloom: Next Games Context

If you are a new AI session joining the project, read this thoroughly. This document establishes the strict architectural and design rules for the remaining mini-games based on our successful implementation of the "Hanging by a Thread" (Hangman) game.

## 🏰 Architectural Overview (CRITICAL)
- **Framework**: React (Vite), TypeScript, and Framer Motion. 
- **Styling Rule**: **DO NOT use Tailwind CSS for layout positioning.** Due to nested component boundaries and compilation scope, all critical game UI elements must use robust inline `style={{ position: 'absolute' }}` styling. Centering must be done via `left: '50%', transform: 'translateX(-50%)'`.
- **The Wrapper**: The games live inside `src/pages/FairPage.tsx` within an `<AnimatePresence>` modal. This wrapper enforces a rigid **1.833 aspect-ratio** bordered box (`className="map-border-frame"`). You do *not* need to constrain heights using viewport units; simply use `100%` within this frame.
- **Close Button**: A generic, premium custom close button is handled globally at the `FairPage` wrapper level. Your mini-game components do **not** need to implement an exit button.

## 🖼️ Background Logic (The Thaw)
All games must visually transition from Winter to Spring based on global progress. 
Your components must accept `thawProgress: number` as a prop and render an absolutely positioned background stack behind the UI:

```tsx
{/* 🖼️ BACKGROUND LAYER (Z-index 0) */}
<div className="absolute inset-0 z-0 pointer-events-none">
  {/* Winter Background (Base layer) */}
  <img src="/Games/<GameName>/Winter-<gamename>.png" alt="Winter" style={{ width: '100%', height: '100%', objectFit: 'fill', position: 'absolute', inset: 0 }} />
  
  {/* Spring Background (Fades in based on progress via Framer Motion) */}
  <motion.img 
    src="/Games/<GameName>/Spring-<gamename>.png" 
    alt="Spring" 
    style={{ width: '100%', height: '100%', objectFit: 'fill', position: 'absolute', inset: 0 }}
    initial={{ opacity: 0 }}
    animate={{ opacity: thawProgress }}
    transition={{ duration: 1.5 }}
  />
  
  {/* Optional dark overlay for UI contrast */}
  <div className="absolute inset-0 bg-black/20" style={{ position: 'absolute', inset: 0 }} />
</div>
```

## 🎮 Prop Structure
Every new game component must be modeled exactly like this to hook back into the global state:
```tsx
interface NextGameProps {
  thawProgress: number;     // Used to fade the spring background
  onWin: () => void;        // Call when the user wins (adds game ID to completedGames)
  onLose: () => void;       // Call when the user fails (e.g., time limit, max mistakes)
}
```

## ✨ Design Aesthetic
- **Fonts**: Use `fontFamily: "'Space Grotesk', sans-serif"` for major titles/headers and `Inter` for standard text.
- **Glassmorphism UI**: All UI elements (counters, menus, panels) should use premium glassmorphism. Use semi-transparent backgrounds with backdrop filters (e.g., `background: 'rgba(15, 23, 42, 0.4)', backdropFilter: 'blur(8px)'`) and subtle `1px solid rgba(255,255,255,0.2)` borders.
- **Drop Shadows**: Essential visual assets must feature distinct `filter: drop-shadow()` properties to stand out cleanly against the 2D background art. 
- **Theming**: Emphasize Icy Blue (`#e0f2fe`, `#bae6fd`) and Spring Green (`#bbf7d0`) to convey the "Thaw" aesthetic.

## 📝 Game 2: Egg Hunt (Hidden Object)
The goal is to find hidden eggs across a static background.
- Ensure the background aspect-ratio is respected.
- Calculate interactive "hotspots" using raw percentage properties (`top: '30%', left: '45%'`) so they scale flawlessly inside the `1.833` frame container.
- Consider utilizing a highly polished glassmorphism header counter (e.g., `EGGS FOUND: 0 / 5`).

## 📝 Game 3: Ice Egg (Reaction/Timing)
The goal is likely to crack away ice or stop a moving target to reveal an egg.
- Implement physics or timing logic in React state.
- Keep the gameplay mechanics strictly scoped inside the exact same container logic, maintaining the high-fidelity Winter/Spring background transition.
