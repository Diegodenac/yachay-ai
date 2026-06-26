import { Routes, Route } from 'react-router-dom'
import Onboarding from './pages/Onboarding.jsx'
import Chat from './pages/Chat.jsx'
import Simulation from './pages/Simulation.jsx'

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Onboarding />} />
      <Route path="/chat" element={<Chat />} />
      <Route path="/simulation" element={<Simulation />} />
    </Routes>
  )
}
