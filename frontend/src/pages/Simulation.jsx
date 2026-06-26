import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

const SCENARIOS = [
  {
    id: 'mercado',
    emoji: '🛒',
    label: 'Mercado',
    description: 'Compra y venta en el mercado local',
  },
  {
    id: 'salud',
    emoji: '🏥',
    label: 'Centro de Salud',
    description: 'Consultas y urgencias médicas',
  },
  {
    id: 'tramites',
    emoji: '📋',
    label: 'Trámites',
    description: 'Oficinas y documentación oficial',
  },
  {
    id: 'turismo',
    emoji: '🗺️',
    label: 'Turismo',
    description: 'Visitas y guías turísticas',
  },
]

function ScenarioCard({ scenario, onClick }) {
  const [hovered, setHovered] = useState(false)

  return (
    <button
      onClick={onClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        width: '100%',
        padding: '20px',
        borderRadius: '12px',
        border: `1px solid ${hovered ? '#F5A623' : '#1E1E1E'}`,
        background: hovered ? 'rgba(245,166,35,0.04)' : '#0F0F0F',
        display: 'flex',
        alignItems: 'center',
        gap: '16px',
        cursor: 'pointer',
        textAlign: 'left',
        fontFamily: 'Inter, system-ui, sans-serif',
        transition: 'border-color 0.15s ease, background 0.15s ease',
      }}
    >
      <span style={{ fontSize: '32px', lineHeight: 1, flexShrink: 0 }}>
        {scenario.emoji}
      </span>
      <div>
        <div style={{
          fontSize: '16px',
          fontWeight: '600',
          color: '#FFFFFF',
          marginBottom: '3px',
        }}>
          {scenario.label}
        </div>
        <div style={{ fontSize: '13px', color: '#555555' }}>
          {scenario.description}
        </div>
      </div>
      <span style={{
        marginLeft: 'auto',
        color: '#333333',
        fontSize: '16px',
        flexShrink: 0,
      }}>
        →
      </span>
    </button>
  )
}

export default function Simulation() {
  const navigate = useNavigate()

  return (
    <div style={{
      minHeight: '100svh',
      background: '#0A0A0A',
      display: 'flex',
      justifyContent: 'center',
      padding: '24px',
    }}>
      <div style={{ width: '100%', maxWidth: '480px' }}>
        <button
          onClick={() => navigate('/')}
          style={{
            background: 'none',
            border: 'none',
            color: '#555555',
            fontSize: '14px',
            cursor: 'pointer',
            fontFamily: 'Inter, system-ui, sans-serif',
            padding: '4px 0',
            marginBottom: '32px',
            display: 'block',
          }}
        >
          ← Volver
        </button>

        <h1 style={{
          fontSize: '26px',
          fontWeight: '700',
          color: '#FFFFFF',
          fontFamily: 'Inter, system-ui, sans-serif',
          marginBottom: '6px',
        }}>
          Escenarios
        </h1>
        <p style={{
          fontSize: '14px',
          color: '#555555',
          fontFamily: 'Inter, system-ui, sans-serif',
          marginBottom: '24px',
        }}>
          Practica en situaciones reales bolivianas
        </p>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          {SCENARIOS.map(scenario => (
            <ScenarioCard
              key={scenario.id}
              scenario={scenario}
              onClick={() => navigate(`/chat?scenario=${scenario.id}`)}
            />
          ))}
        </div>
      </div>
    </div>
  )
}
