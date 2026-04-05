import { Suspense, lazy } from 'react'
import { Routes, Route, Navigate, useLocation } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import './App.css'

// 🚀 LAZY LOAD PAGES (Loaded into separate network chunks)
const HomePage = lazy(() => import('./pages/HomePage'))
const FairPage = lazy(() => import('./pages/FairPage'))

function App() {
  const location = useLocation();

  return (
    <div className="flex flex-col min-h-screen">
      <Suspense fallback={
        <div className="fixed inset-0 flex items-center justify-center bg-black text-white z-[2000]">
          <motion.div
            animate={{ opacity: [0.4, 1, 0.4] }}
            transition={{ duration: 1.5, repeat: Infinity }}
            className="text-2xl font-bold tracking-widest uppercase"
          >
            Loading...
          </motion.div>
        </div>
      }>
        <AnimatePresence mode="wait">
          <Routes location={location} key={location.pathname}>
            <Route path="/home" element={
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.5 }}
              >
                <HomePage />
              </motion.div>
            } />
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
            
            {/* Redirect root to /home */}
            <Route path="/" element={<Navigate to="/home" replace />} />
          </Routes>
        </AnimatePresence>
      </Suspense>
    </div>
  )
}

export default App
