import { useState, useEffect, useRef } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import MessageBubble from '../components/MessageBubble.jsx'
import ProgressBar from '../components/ProgressBar.jsx'

const SCENARIO_LABELS = {
  mercado: 'Mercado',
  salud: 'Centro de Salud',
  tramites: 'Trámites',
  turismo: 'Turismo',
}

const placeholders = {
  Quechua: 'Rimay... (escribe en Quechua)',
  Aymara: 'Arsuña... (escribe en Aymara)',
  Guaraní: "Ñe'ẽ... (escribe en Guaraní)",
}

const API_URL = 'http://localhost:3001/api/chat'

export default function Chat() {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const scenario = searchParams.get('scenario')

  const targetLanguage = localStorage.getItem('targetLanguage') || 'Quechua'
  const userLevel = localStorage.getItem('userLevel') || 'Principiante'

  const [messages, setMessages] = useState([])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const [stats, setStats] = useState({ wordsLearned: 0, corrections: 0 })

  const apiHistoryRef = useRef([])
  const initializedRef = useRef(false)
  const messagesEndRef = useRef(null)

  useEffect(() => {
    if (initializedRef.current) return
    initializedRef.current = true

    const prompt = scenario
      ? `Iniciamos una simulación de ${SCENARIO_LABELS[scenario] || scenario} en ${targetLanguage}. Tú eres el tutor. Yo soy el turista/cliente. Empieza la escena.`
      : 'Saluda al usuario y preséntate brevemente. Pregunta su nombre.'

    initChat(prompt)
  }, [])

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, loading])

  async function initChat(prompt) {
    const initialMsg = { role: 'user', content: prompt }
    apiHistoryRef.current = [initialMsg]
    setLoading(true)
    try {
      const res = await fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: [initialMsg],
          targetLanguage,
          userLevel,
          nativeLanguage: 'Español',
        }),
      })
      const data = await res.json()
      const reply = { role: 'assistant', content: data.reply }
      apiHistoryRef.current = [...apiHistoryRef.current, reply]
      setMessages([reply])
      if (data.reply && data.reply.includes('%%CORRECTION%%')) {
        setStats(prev => ({ ...prev, corrections: prev.corrections + 1, wordsLearned: prev.wordsLearned + 1 }))
      }
    } catch {
      setMessages([{ role: 'assistant', content: '¡Hola! Parece que hay un problema de conexión con el servidor. Verifica que el backend esté corriendo en el puerto 3001.' }])
    } finally {
      setLoading(false)
    }
  }

  async function handleSend() {
    const text = input.trim()
    if (!text || loading) return
    setInput('')

    const userMsg = { role: 'user', content: text }
    const newHistory = [...apiHistoryRef.current, userMsg]
    apiHistoryRef.current = newHistory
    setMessages(prev => [...prev, userMsg])

    setLoading(true)
    try {
      const res = await fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: newHistory,
          targetLanguage,
          userLevel,
          nativeLanguage: 'Español',
        }),
      })
      const data = await res.json()
      const reply = { role: 'assistant', content: data.reply }
      apiHistoryRef.current = [...apiHistoryRef.current, reply]
      setMessages(prev => [...prev, reply])
      if (data.reply && data.reply.includes('%%CORRECTION%%')) {
        setStats(prev => ({ ...prev, corrections: prev.corrections + 1, wordsLearned: prev.wordsLearned + 1 }))
      }
    } catch {
      const errMsg = { role: 'assistant', content: 'Error al conectar con el servidor.' }
      apiHistoryRef.current = [...apiHistoryRef.current, errMsg]
      setMessages(prev => [...prev, errMsg])
    } finally {
      setLoading(false)
    }
  }

  function handleKeyDown(e) {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  const scenarioLabel = scenario ? SCENARIO_LABELS[scenario] : null
  const dynamicPlaceholder = placeholders[targetLanguage] || 'Escribe tu mensaje...'

  return (
    <div style={{
      minHeight: '100svh',
      background: '#0A0A0A',
      display: 'flex',
      justifyContent: 'center',
    }}>
      <div style={{
        width: '100%',
        maxWidth: '480px',
        display: 'flex',
        flexDirection: 'column',
        height: '100svh',
        position: 'relative',
      }}>
        {/* Header */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          padding: '14px 16px',
          borderBottom: '1px solid #1A1A1A',
          flexShrink: 0,
          background: '#0A0A0A',
        }}>
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
              minWidth: '60px',
            }}
          >
            ← Volver
          </button>

          <div style={{ flex: 1, textAlign: 'center' }}>
            <div style={{
              fontSize: '17px',
              fontWeight: '700',
              color: '#F5A623',
              fontFamily: 'Inter, system-ui, sans-serif',
            }}>
              Yachay
            </div>
            <div style={{
              fontSize: '11px',
              color: '#555555',
              fontFamily: 'Inter, system-ui, sans-serif',
              marginTop: '1px',
            }}>
              {scenarioLabel ? `${scenarioLabel} · ` : ''}{targetLanguage}
            </div>
          </div>

          <div style={{ minWidth: '60px' }} />
        </div>

        {/* Progress */}
        <div style={{ padding: '0 16px' }}>
          <ProgressBar wordsLearned={stats.wordsLearned} corrections={stats.corrections} />
        </div>

        {/* Messages */}
        <div style={{
          flex: 1,
          overflowY: 'auto',
          padding: '12px 16px',
          display: 'flex',
          flexDirection: 'column',
        }}>
          {messages.map((msg, i) => (
            <MessageBubble key={i} message={msg} />
          ))}

          {loading && (
            <div style={{ display: 'flex', justifyContent: 'flex-start' }}>
              <div style={{
                padding: '11px 15px',
                borderRadius: '4px 18px 18px 18px',
                background: '#141414',
                border: '1px solid #1E1E1E',
                color: '#555555',
                fontSize: '14px',
                fontFamily: 'Inter, system-ui, sans-serif',
              }}>
                Yachay está escribiendo...
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Input */}
        <div style={{
          padding: '12px 16px',
          borderTop: '1px solid #1A1A1A',
          display: 'flex',
          gap: '10px',
          alignItems: 'center',
          flexShrink: 0,
          background: '#0A0A0A',
        }}>
          <input
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={dynamicPlaceholder}
            disabled={loading}
            style={{
              flex: 1,
              padding: '12px 16px',
              borderRadius: '24px',
              border: '1px solid #1E1E1E',
              background: '#0F0F0F',
              color: '#FFFFFF',
              fontSize: '15px',
              fontFamily: 'Inter, system-ui, sans-serif',
              outline: 'none',
              caretColor: '#F5A623',
            }}
          />
          <button
            onClick={handleSend}
            disabled={loading || !input.trim()}
            style={{
              width: '44px',
              height: '44px',
              borderRadius: '50%',
              border: 'none',
              background: loading || !input.trim() ? '#1A1A1A' : '#F5A623',
              color: loading || !input.trim() ? '#444444' : '#0A0A0A',
              fontSize: '18px',
              cursor: loading || !input.trim() ? 'not-allowed' : 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0,
              transition: 'background 0.15s ease',
              lineHeight: 1,
            }}
          >
            ↑
          </button>
        </div>
      </div>
    </div>
  )
}
