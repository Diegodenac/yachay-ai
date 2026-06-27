import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useFirebase } from '../context/FirebaseContext'
import { ensureUserProfile } from '../hooks/useSession'

const LANGUAGES = ['Quechua', 'Aymara', 'Guaraní']
const LEVELS = ['Principiante', 'Intermedio', 'Avanzado']

export default function Onboarding() {
  const [language, setLanguage] = useState('Quechua')
  const [level, setLevel] = useState('Principiante')
  const navigate = useNavigate()
  const { user } = useFirebase()

  async function handleStart() {
    localStorage.setItem('targetLanguage', language)
    localStorage.setItem('userLevel', level)
    await ensureUserProfile(user?.uid, { targetLanguage: language, userLevel: level })
    navigate('/chat')
  }

  return (
    <div style={{
      minHeight: '100svh',
      background: '#0A0A0A',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '24px',
    }}>
      <div style={{
        width: '100%',
        maxWidth: '480px',
        display: 'flex',
        flexDirection: 'column',
        gap: '32px',
      }}>
        <div style={{ textAlign: 'center', paddingBottom: '8px' }}>
          <h1 style={{
            fontSize: '52px',
            fontWeight: '700',
            color: '#F5A623',
            letterSpacing: '-2px',
            lineHeight: 1,
            fontFamily: 'Inter, system-ui, sans-serif',
          }}>Yachay</h1>
          <p style={{
            fontSize: '16px',
            color: '#666666',
            marginTop: '10px',
            fontFamily: 'Inter, system-ui, sans-serif',
          }}>Tu tutor de idiomas bolivianos</p>
          <p style={{ color: '#555', fontSize: '13px', marginTop: '4px' }}>
            Quechua · Aymara · Guaraní
          </p>
        </div>

        <div>
          <p style={{
            fontSize: '12px',
            color: '#555555',
            marginBottom: '10px',
            fontWeight: '600',
            textTransform: 'uppercase',
            letterSpacing: '0.08em',
            fontFamily: 'Inter, system-ui, sans-serif',
          }}>
            Idioma a aprender
          </p>
          <div style={{ display: 'flex', gap: '8px' }}>
            {LANGUAGES.map(lang => (
              <button
                key={lang}
                onClick={() => setLanguage(lang)}
                style={{
                  flex: 1,
                  padding: '14px 8px',
                  borderRadius: '10px',
                  border: `1px solid ${language === lang ? '#F5A623' : '#1E1E1E'}`,
                  background: language === lang ? 'rgba(245,166,35,0.08)' : '#0F0F0F',
                  color: language === lang ? '#F5A623' : '#555555',
                  fontSize: '14px',
                  fontWeight: '500',
                  cursor: 'pointer',
                  fontFamily: 'Inter, system-ui, sans-serif',
                  transition: 'all 0.15s ease',
                }}
              >
                {lang}
              </button>
            ))}
          </div>
        </div>

        <div>
          <p style={{
            fontSize: '12px',
            color: '#555555',
            marginBottom: '10px',
            fontWeight: '600',
            textTransform: 'uppercase',
            letterSpacing: '0.08em',
            fontFamily: 'Inter, system-ui, sans-serif',
          }}>
            Nivel
          </p>
          <div style={{ display: 'flex', gap: '8px' }}>
            {LEVELS.map(lvl => (
              <button
                key={lvl}
                onClick={() => setLevel(lvl)}
                style={{
                  flex: 1,
                  padding: '14px 8px',
                  borderRadius: '10px',
                  border: `1px solid ${level === lvl ? '#2E7D32' : '#1E1E1E'}`,
                  background: level === lvl ? 'rgba(46,125,50,0.08)' : '#0F0F0F',
                  color: level === lvl ? '#4CAF50' : '#555555',
                  fontSize: '14px',
                  fontWeight: '500',
                  cursor: 'pointer',
                  fontFamily: 'Inter, system-ui, sans-serif',
                  transition: 'all 0.15s ease',
                }}
              >
                {lvl}
              </button>
            ))}
          </div>
        </div>

        <button
          onClick={handleStart}
          style={{
            width: '100%',
            padding: '16px',
            borderRadius: '12px',
            border: 'none',
            background: '#F5A623',
            color: '#0A0A0A',
            fontSize: '16px',
            fontWeight: '600',
            cursor: 'pointer',
            fontFamily: 'Inter, system-ui, sans-serif',
          }}
        >
          Comenzar
        </button>

        <p style={{
          textAlign: 'center',
          fontSize: '14px',
          color: '#444444',
          fontFamily: 'Inter, system-ui, sans-serif',
        }}>
          o practica en una{' '}
          <span
            onClick={() => navigate('/simulation')}
            style={{
              color: '#F5A623',
              cursor: 'pointer',
              fontWeight: '500',
            }}
          >
            simulación de escenario
          </span>
        </p>
      </div>
    </div>
  )
}
