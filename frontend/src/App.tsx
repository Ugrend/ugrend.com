
import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Server, Zap, Code, Database } from 'lucide-react'
import './index.css'

function App() {
  const [backendStatus, setBackendStatus] = useState<string>('Checking...')

  useEffect(() => {
    fetch('/api/health')
      .then(res => res.json())
      .then(data => setBackendStatus(data.status === 'ok' ? 'Online' : 'Error'))
      .catch(() => setBackendStatus('Offline'))
  }, [])

  return (
    <div className="app-container">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >
        <h1>FastAPI + React</h1>
        <p className="read-the-docs">
          High-performance fullstack template
        </p>

        <div className="card">
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px', marginBottom: '20px' }}>
            <Server size={24} color={backendStatus === 'Online' ? '#4ade80' : '#ef4444'} />
            <span style={{ fontSize: '1.2em', fontWeight: 500 }}>
              Backend Status: <span style={{ color: backendStatus === 'Online' ? '#4ade80' : '#ef4444' }}>{backendStatus}</span>
            </span>
          </div>

          <p style={{ color: '#94a3b8' }}>
            Edit <code>frontend/src/App.tsx</code> to start building your UI.
          </p>
        </div>

        <motion.div
          className="grid"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
        >
          <FeatureCard
            icon={<Zap size={32} color="#fbbf24" />}
            title="Fast Execution"
            desc="Powered by Vite and uv for lightning fast dev loops."
          />
          <FeatureCard
            icon={<Code size={32} color="#60a5fa" />}
            title="Type Safe"
            desc="Full TypeScript support across the entire stack."
          />
          <FeatureCard
            icon={<Database size={32} color="#a78bfa" />}
            title="Robust Backend"
            desc="FastAPI provides high performance and easy API building."
          />
        </motion.div>
      </motion.div>
    </div>
  )
}

function FeatureCard({ icon, title, desc }: { icon: React.ReactNode, title: string, desc: string }) {
  return (
    <div className="feature-card">
      <div style={{ marginBottom: '1rem' }}>{icon}</div>
      <h3 style={{ margin: '0 0 0.5rem 0', color: '#f1f5f9' }}>{title}</h3>
      <p style={{ margin: 0, fontSize: '0.9rem', color: '#94a3b8' }}>{desc}</p>
    </div>
  )
}

export default App
