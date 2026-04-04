import { useState } from 'react'
import './App.css'
import Iteration1 from './landing-iterations/Iteration1'
import Iteration2 from './landing-iterations/Iteration2'
import Iteration3 from './landing-iterations/Iteration3'

type Mode = 'home' | 'it1' | 'it2' | 'it3'

function App() {
  const [mode, setMode] = useState<Mode>('home')

  if (mode === 'it1') return <div className="app-container"><BackButton onClick={() => setMode('home')} /><Iteration1 /></div>
  if (mode === 'it2') return <div className="app-container"><BackButton onClick={() => setMode('home')} /><Iteration2 /></div>
  if (mode === 'it3') return <div className="app-container"><BackButton onClick={() => setMode('home')} /><Iteration3 /></div>

  return (
    <div className="home-page">
      <div className="home-content">
        <h1>Easter Fair Concept</h1>
        <p>Explore different landing page iterations for the fair.</p>
        <div className="button-group">
          <button className="nav-btn IT1" onClick={() => setMode('it1')}>
            <span>Iteration 1</span>
            <small>The Reveal</small>
          </button>
          <button className="nav-btn IT2" onClick={() => setMode('it2')}>
            <span>Iteration 2</span>
            <small>The Thaw</small>
          </button>
          <button className="nav-btn IT3" onClick={() => setMode('it3')}>
            <span>Iteration 3</span>
            <small>The Fair</small>
          </button>
        </div>
      </div>

      <style>{`
        .home-page {
          min-height: 100vh;
          display: flex;
          align-items: center;
          justify-content: center;
          background: #0f172a;
          color: white;
          font-family: system-ui, -apple-system, sans-serif;
        }
        .home-content {
          text-align: center;
          max-width: 800px;
        }
        h1 { font-size: 3rem; margin-bottom: 1rem; background: linear-gradient(to right, #c084fc, #6366f1); -webkit-background-clip: text; -webkit-text-fill-color: transparent; }
        p { color: #94a3b8; font-size: 1.25rem; margin-bottom: 3rem; }
        
        .button-group {
          display: flex;
          gap: 20px;
          justify-content: center;
        }

        .nav-btn {
          background: rgba(255, 255, 255, 0.05);
          border: 1px solid rgba(255, 255, 255, 0.1);
          padding: 30px 40px;
          border-radius: 24px;
          color: white;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 5px;
          cursor: pointer;
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          min-width: 200px;
        }

        .nav-btn:hover {
          background: rgba(255, 255, 255, 0.1);
          border-color: #c084fc;
          transform: translateY(-5px);
          box-shadow: 0 10px 30px -10px rgba(192, 132, 252, 0.5);
        }

        .nav-btn span { font-size: 1.25rem; font-weight: 700; }
        .nav-btn small { color: #94a3b8; font-size: 0.875rem; }

        .app-container {
          position: relative;
        }

        .back-btn {
          position: fixed;
          top: 20px;
          left: 20px;
          z-index: 1000;
          background: white;
          color: black;
          border: none;
          padding: 8px 16px;
          border-radius: 99px;
          font-weight: 600;
          cursor: pointer;
          box-shadow: 0 4px 12px rgba(0,0,0,0.1);
          transition: transform 0.2s;
        }
        .back-btn:hover { transform: scale(1.05); }
      `}</style>
    </div>
  )
}

const BackButton = ({ onClick }: { onClick: () => void }) => (
  <button className="back-btn" onClick={onClick}>
    ← Home
  </button>
)

export default App
