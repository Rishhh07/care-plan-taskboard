import { Taskboard } from './components/Taskboard/Taskboard'

function App() {
  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
      <div style={{ background: '#1e40af', color: '#fff', padding: '16px 24px' }}>
        <h1 style={{ fontSize: '20px', fontWeight: 700 }}>Care Plan Taskboard</h1>
        <p style={{ fontSize: '13px', opacity: 0.8 }}>Dialysis Center Staff Dashboard</p>
      </div>
      <Taskboard />
    </div>
  )
}

export default App