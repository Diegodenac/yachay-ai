import { useState, useEffect, useRef } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import MessageBubble from '../components/MessageBubble.jsx'
import ProgressBar from '../components/ProgressBar.jsx'
import { useFirebase } from '../context/FirebaseContext'
import { createSession, syncSession, finalizeSession } from '../hooks/useSession'
import { DEMO_RESPONSES } from '../data/demoScript.js'

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

const API_URL = `${import.meta.env.VITE_API_URL || 'http://localhost:3001'}/api/chat`

// XP thresholds and level names
const LEVELS = ['Principiante', 'Aprendiz', 'Conocedor', 'Experto', 'Maestro']
const THRESHOLDS = [0, 100, 250, 500, 1000]

function getLevelInfo(xp) {
  let i = THRESHOLDS.length - 1
  while (i > 0 && xp < THRESHOLDS[i]) i--
  const next = i < THRESHOLDS.length - 1 ? THRESHOLDS[i + 1] : THRESHOLDS[i] + 1
  return {
    level: i + 1,
    name: LEVELS[i],
    progress: Math.min((xp - THRESHOLDS[i]) / (next - THRESHOLDS[i]), 1),
    xpToNext: next - xp,
  }
}

export default function Chat() {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const scenario = searchParams.get('scenario')
  const { user } = useFirebase()

  const isDemoMode = searchParams.get('demo') === '1'

  const targetLanguage = isDemoMode ? 'Quechua' : (localStorage.getItem('targetLanguage') || 'Quechua')
  const userLevel = isDemoMode ? 'Principiante' : (localStorage.getItem('userLevel') || 'Principiante')

  const [messages, setMessages] = useState([])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const [stats, setStats] = useState({ wordsLearned: 0, corrections: 0 })
  const [ttsEnabled, setTtsEnabled] = useState(true)
  const [isListening, setIsListening] = useState(false)

  // Gamification state (visible in demo mode)
  const [xp, setXp] = useState(isDemoMode ? 380 : 0)
  const [xpAnim, setXpAnim] = useState(null)       // { amount, key }
  const [achievement, setAchievement] = useState(null) // { title, sub }
  const [mascotBubble, setMascotBubble] = useState(null)
  const streak = isDemoMode ? 7 : 1

  const apiHistoryRef = useRef([])
  const sessionIdRef = useRef(null)
  const initializedRef = useRef(false)
  const messagesEndRef = useRef(null)
  const statsRef = useRef({ wordsLearned: 0, corrections: 0 })
  const ttsEnabledRef = useRef(true)
  const recognitionRef = useRef(null)
  const demoIndexRef = useRef(0)

  useEffect(() => { statsRef.current = stats }, [stats])

  // ── Gamification helpers ────────────────────────────────────────────────────
  function fireDemoEffects(idx) {
    const gains     = [20, 30, 30, 50]
    const mascotLines = ['Kausachun quechua!', '¡Lo estas haciendo bien!', '¡Un paso mas!', null]
    const gain = gains[idx] ?? 20

    // Floating XP animation
    const key = Date.now()
    setXpAnim({ amount: gain, key })
    setTimeout(() => setXpAnim(a => a?.key === key ? null : a), 1800)
    setXp(prev => prev + gain)

    // Mascot bubble
    if (mascotLines[idx]) {
      setTimeout(() => {
        setMascotBubble(mascotLines[idx])
        setTimeout(() => setMascotBubble(null), 3200)
      }, 600)
    }

    // Turn 3: level-up achievement (380+20+30+30+50 = 510 → Nivel 4: Experto)
    if (idx === 3) {
      setTimeout(() => {
        setAchievement({ title: 'Nivel 4: Experto', sub: 'Primer error corregido. ¡Ya dominas los sufijos del quechua!' })
        setTimeout(() => setAchievement(null), 4000)
      }, 1200)
    }
  }

  // ── TTS ────────────────────────────────────────────────────────────────────
  function speak(text) {
    if (!ttsEnabledRef.current || !window.speechSynthesis) return
    const clean = text.replace(/%%CORRECTION%%([\s\S]*?)%%END_CORRECTION%%/g, '').trim()
    if (!clean) return
    window.speechSynthesis.cancel()
    const u = new SpeechSynthesisUtterance(clean)
    u.lang = 'es-BO'
    u.rate = 0.92
    window.speechSynthesis.speak(u)
  }

  function toggleTTS() {
    const next = !ttsEnabledRef.current
    ttsEnabledRef.current = next
    setTtsEnabled(next)
    if (!next) window.speechSynthesis.cancel()
  }

  // ── Mic ───────────────────────────────────────────────────────────────────
  function toggleMic() {
    if (isListening) {
      recognitionRef.current?.stop()
      setIsListening(false)
      return
    }
    const SR = window.SpeechRecognition || window.webkitSpeechRecognition
    if (!SR) return
    const r = new SR()
    r.lang = 'es-BO'
    r.interimResults = false
    r.maxAlternatives = 1
    r.onresult = (e) => {
      const transcript = e.results[0][0].transcript.trim()
      if (transcript) doSend(transcript)
    }
    r.onend = () => setIsListening(false)
    r.onerror = () => setIsListening(false)
    r.start()
    recognitionRef.current = r
    setIsListening(true)
  }

  // ── Lifecycle ─────────────────────────────────────────────────────────────
  useEffect(() => {
    return () => { finalizeSession(user?.uid, statsRef.current) }
  }, [user])

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

  // ── API helpers ───────────────────────────────────────────────────────────
  async function safeJson(res) {
    const text = await res.text()
    if (!text) throw new Error(`Servidor devolvió respuesta vacía (HTTP ${res.status})`)
    try { return JSON.parse(text) } catch {
      throw new Error(`Respuesta inválida del servidor (HTTP ${res.status})`)
    }
  }

  async function getAuthHeaders() {
    const headers = { 'Content-Type': 'application/json' }
    if (user) {
      try { headers.Authorization = `Bearer ${await user.getIdToken()}` } catch {}
    }
    return headers
  }

  // ── Chat logic ─────────────────────────────────────────────────────────────
  async function initChat(prompt) {
    const initialMsg = { role: 'user', content: prompt }
    apiHistoryRef.current = [initialMsg]
    setLoading(true)

    const sid = await createSession(user?.uid, { scenario, targetLanguage, userLevel })
    sessionIdRef.current = sid

    try {
      let replyText
      if (isDemoMode) {
        await new Promise(r => setTimeout(r, 1400))
        replyText = DEMO_RESPONSES[demoIndexRef.current] || '¡Excelente! Sigue practicando.'
        const idx = demoIndexRef.current
        demoIndexRef.current++
        fireDemoEffects(idx)
      } else {
        const headers = await getAuthHeaders()
        const res = await fetch(API_URL, {
          method: 'POST', headers,
          body: JSON.stringify({ messages: [initialMsg], targetLanguage, userLevel, nativeLanguage: 'Español' }),
        })
        const data = await safeJson(res)
        if (!res.ok) throw new Error(data.error || 'Error del servidor')
        replyText = data.reply
      }

      const reply = { role: 'assistant', content: replyText }
      apiHistoryRef.current = [...apiHistoryRef.current, reply]
      setMessages([reply])
      speak(replyText)

      const newStats = { wordsLearned: 0, corrections: 0 }
      if (replyText?.includes('%%CORRECTION%%')) { newStats.corrections = 1; newStats.wordsLearned = 1 }
      setStats(newStats)
      syncSession(user?.uid, sid, { messages: [reply], ...newStats })
    } catch (err) {
      setMessages([{ role: 'assistant', content: `Error al conectar con el servidor: ${err.message}` }])
    } finally {
      setLoading(false)
    }
  }

  async function doSend(text) {
    if (!text || loading) return
    setInput('')

    const userMsg = { role: 'user', content: text }
    const newHistory = [...apiHistoryRef.current, userMsg]
    apiHistoryRef.current = newHistory
    setMessages(prev => [...prev, userMsg])

    setLoading(true)
    try {
      let replyText
      if (isDemoMode) {
        await new Promise(r => setTimeout(r, 1400))
        replyText = DEMO_RESPONSES[demoIndexRef.current] || '¡Sumaq! Sigue practicando quechua.'
        const idx = demoIndexRef.current
        demoIndexRef.current++
        fireDemoEffects(idx)
      } else {
        const headers = await getAuthHeaders()
        const res = await fetch(API_URL, {
          method: 'POST', headers,
          body: JSON.stringify({ messages: newHistory, targetLanguage, userLevel, nativeLanguage: 'Español' }),
        })
        const data = await safeJson(res)
        if (!res.ok) throw new Error(data.error || 'Error del servidor')
        replyText = data.reply
      }

      const reply = { role: 'assistant', content: replyText }
      apiHistoryRef.current = [...apiHistoryRef.current, reply]
      speak(replyText)
      setMessages(prev => [...prev, reply])

      const hadCorrection = replyText?.includes('%%CORRECTION%%')
      const newStats = {
        wordsLearned: stats.wordsLearned + (hadCorrection ? 1 : 0),
        corrections: stats.corrections + (hadCorrection ? 1 : 0),
      }
      if (hadCorrection) setStats(newStats)

      syncSession(user?.uid, sessionIdRef.current, {
        messages: [...messages, userMsg, reply],
        ...newStats,
      })
    } catch (err) {
      const errMsg = { role: 'assistant', content: `Error: ${err.message}` }
      apiHistoryRef.current = [...apiHistoryRef.current, errMsg]
      setMessages(prev => [...prev, errMsg])
    } finally {
      setLoading(false)
    }
  }

  function handleSend() { doSend(input.trim()) }

  function handleKeyDown(e) {
    if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSend() }
  }

  const scenarioLabel = scenario ? SCENARIO_LABELS[scenario] : null
  const dynamicPlaceholder = placeholders[targetLanguage] || 'Escribe tu mensaje...'
  const levelInfo = getLevelInfo(xp)

  return (
    <div style={{ minHeight: '100svh', background: '#0A0A0A', display: 'flex', justifyContent: 'center' }}>
      {/* Keyframe animations injected once */}
      <style>{`
        @keyframes floatUp {
          0%   { opacity: 1; transform: translateY(0) scale(1); }
          60%  { opacity: 1; transform: translateY(-32px) scale(1.1); }
          100% { opacity: 0; transform: translateY(-60px) scale(0.9); }
        }
        @keyframes slideUp {
          0%   { opacity: 0; transform: translateX(-50%) translateY(16px); }
          12%  { opacity: 1; transform: translateX(-50%) translateY(0); }
          80%  { opacity: 1; transform: translateX(-50%) translateY(0); }
          100% { opacity: 0; transform: translateX(-50%) translateY(-8px); }
        }
        @keyframes mascotPop {
          0%   { opacity: 0; transform: scale(0.8) translateY(6px); }
          15%  { opacity: 1; transform: scale(1) translateY(0); }
          80%  { opacity: 1; }
          100% { opacity: 0; }
        }
        @keyframes xpBarFill {
          from { width: var(--from); }
          to   { width: var(--to); }
        }
        @keyframes llama-bounce {
          0%, 100% { transform: translateY(0); }
          50%       { transform: translateY(-3px); }
        }
      `}</style>

      <div style={{
        width: '100%', maxWidth: '480px',
        display: 'flex', flexDirection: 'column',
        height: '100svh', position: 'relative',
      }}>

        {/* ── HEADER ── */}
        <div style={{
          display: 'flex', alignItems: 'center',
          padding: '12px 16px',
          borderBottom: '1px solid #1A1A1A',
          flexShrink: 0, background: '#0A0A0A',
          gap: '8px',
        }}>
          <button
            onClick={() => navigate('/')}
            style={{
              background: 'none', border: 'none', color: '#555555',
              fontSize: '14px', cursor: 'pointer',
              fontFamily: 'Inter, system-ui, sans-serif',
              padding: '4px 0', minWidth: '52px',
            }}
          >
            ← Volver
          </button>

          <div style={{ flex: 1, textAlign: 'center' }}>
            <div style={{ fontSize: '17px', fontWeight: '700', color: '#F5A623', fontFamily: 'Inter, system-ui, sans-serif' }}>
              Yachay
            </div>
            <div style={{ fontSize: '11px', color: '#555555', fontFamily: 'Inter, system-ui, sans-serif', marginTop: '1px' }}>
              {scenarioLabel ? `${scenarioLabel} · ` : ''}{targetLanguage}
            </div>
          </div>

          {/* Right side: streak + mascot + volume */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', minWidth: '52px', justifyContent: 'flex-end' }}>
            {isDemoMode && (
              <div style={{
                display: 'flex', alignItems: 'center', gap: '3px',
                background: 'rgba(245,166,35,0.1)', border: '1px solid rgba(245,166,35,0.25)',
                borderRadius: '100px', padding: '3px 8px',
              }}>
                <span style={{ fontSize: '13px' }}>🔥</span>
                <span style={{ fontSize: '13px', fontWeight: '700', color: '#F5A623', fontFamily: 'Inter, system-ui, sans-serif' }}>{streak}</span>
              </div>
            )}

            {isDemoMode && (
              <div style={{ position: 'relative' }}>
                <span
                  style={{
                    fontSize: '22px', cursor: 'default',
                    display: 'inline-block',
                    animation: loading ? 'llama-bounce 0.6s ease-in-out infinite' : 'none',
                  }}
                  title="Pacha"
                >
                  🦙
                </span>
                {mascotBubble && (
                  <div style={{
                    position: 'absolute', top: '32px', right: 0,
                    background: '#1C1C1C', border: '1px solid #2A2A2A',
                    borderRadius: '10px 10px 0 10px',
                    padding: '7px 11px',
                    fontSize: '12px', color: '#CCCCCC',
                    whiteSpace: 'nowrap', zIndex: 50,
                    fontFamily: 'Inter, system-ui, sans-serif',
                    animation: 'mascotPop 3.2s ease forwards',
                    boxShadow: '0 4px 16px rgba(0,0,0,0.5)',
                  }}>
                    {mascotBubble}
                  </div>
                )}
              </div>
            )}

            <button
              onClick={toggleTTS}
              title={ttsEnabled ? 'Silenciar voz' : 'Activar voz'}
              style={{
                background: 'none', border: 'none',
                color: ttsEnabled ? '#F5A623' : '#444444',
                fontSize: '18px', cursor: 'pointer', padding: '4px', lineHeight: 1,
              }}
            >
              {ttsEnabled ? '🔊' : '🔇'}
            </button>
          </div>
        </div>

        {/* ── XP BAR (demo mode) ── */}
        {isDemoMode && (
          <div style={{ padding: '8px 16px 0', flexShrink: 0 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '5px' }}>
              <span style={{ fontSize: '11px', fontWeight: '700', color: '#F5A623', fontFamily: 'Inter, system-ui, sans-serif', letterSpacing: '0.04em' }}>
                NV {levelInfo.level} · {levelInfo.name}
              </span>
              <span style={{ fontSize: '11px', color: '#444', fontFamily: 'Inter, system-ui, sans-serif' }}>
                {xp} XP
              </span>
            </div>
            <div style={{ height: '5px', background: '#181818', borderRadius: '100px', overflow: 'hidden' }}>
              <div style={{
                height: '100%',
                width: `${Math.round(levelInfo.progress * 100)}%`,
                background: 'linear-gradient(90deg, #F5A623, #FFD166)',
                borderRadius: '100px',
                transition: 'width 0.8s cubic-bezier(0.4, 0, 0.2, 1)',
              }} />
            </div>
          </div>
        )}

        {/* ── PROGRESS ── */}
        <div style={{ padding: '0 16px' }}>
          <ProgressBar wordsLearned={stats.wordsLearned} corrections={stats.corrections} />
        </div>

        {/* ── MESSAGES ── */}
        <div style={{
          flex: 1, overflowY: 'auto',
          padding: '12px 16px',
          display: 'flex', flexDirection: 'column',
        }}>
          {messages.map((msg, i) => (
            <MessageBubble key={i} message={msg} />
          ))}

          {loading && (
            <div style={{ display: 'flex', justifyContent: 'flex-start' }}>
              <div style={{
                padding: '11px 15px', borderRadius: '4px 18px 18px 18px',
                background: '#141414', border: '1px solid #1E1E1E',
                color: '#555555', fontSize: '14px',
                fontFamily: 'Inter, system-ui, sans-serif',
              }}>
                Yachay está escribiendo...
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* ── INPUT ── */}
        <div style={{
          padding: '12px 16px', borderTop: '1px solid #1A1A1A',
          display: 'flex', gap: '10px', alignItems: 'center',
          flexShrink: 0, background: '#0A0A0A',
        }}>
          <input
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={isListening ? 'Escuchando...' : dynamicPlaceholder}
            disabled={loading}
            style={{
              flex: 1, padding: '12px 16px', borderRadius: '24px',
              border: `1px solid ${isListening ? '#F5A623' : '#1E1E1E'}`,
              background: '#0F0F0F', color: '#FFFFFF', fontSize: '15px',
              fontFamily: 'Inter, system-ui, sans-serif', outline: 'none', caretColor: '#F5A623',
            }}
          />
          <button
            onClick={toggleMic}
            disabled={loading}
            title={isListening ? 'Detener' : 'Hablar'}
            style={{
              width: '44px', height: '44px', borderRadius: '50%', border: 'none',
              background: isListening ? '#F5A623' : '#1A1A1A',
              color: isListening ? '#0A0A0A' : '#888888',
              fontSize: '18px', cursor: loading ? 'not-allowed' : 'pointer',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              flexShrink: 0, transition: 'background 0.15s ease', lineHeight: 1,
            }}
          >
            🎤
          </button>
          <button
            onClick={handleSend}
            disabled={loading || !input.trim()}
            style={{
              width: '44px', height: '44px', borderRadius: '50%', border: 'none',
              background: loading || !input.trim() ? '#1A1A1A' : '#F5A623',
              color: loading || !input.trim() ? '#444444' : '#0A0A0A',
              fontSize: '18px', cursor: loading || !input.trim() ? 'not-allowed' : 'pointer',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              flexShrink: 0, transition: 'background 0.15s ease', lineHeight: 1,
            }}
          >
            ↑
          </button>
        </div>
      </div>

      {/* ── FLOATING +XP ANIMATION ── */}
      {xpAnim && (
        <div
          key={xpAnim.key}
          style={{
            position: 'fixed', bottom: '90px', right: '28px',
            color: '#F5A623', fontWeight: '800', fontSize: '20px',
            fontFamily: 'Inter, system-ui, sans-serif',
            animation: 'floatUp 1.8s ease-out forwards',
            pointerEvents: 'none', zIndex: 200,
            textShadow: '0 0 12px rgba(245,166,35,0.6)',
          }}
        >
          +{xpAnim.amount} XP
        </div>
      )}

      {/* ── ACHIEVEMENT TOAST ── */}
      {achievement && (
        <div style={{
          position: 'fixed', bottom: '88px', left: '50%',
          transform: 'translateX(-50%)',
          animation: 'slideUp 4s ease forwards',
          background: 'linear-gradient(135deg, #1A1500 0%, #0D1000 100%)',
          border: '1px solid rgba(245,166,35,0.6)',
          borderRadius: '16px', padding: '16px 24px',
          textAlign: 'center', zIndex: 300, minWidth: '260px',
          boxShadow: '0 0 40px rgba(245,166,35,0.25), 0 8px 32px rgba(0,0,0,0.6)',
          fontFamily: 'Inter, system-ui, sans-serif',
        }}>
          <div style={{ fontSize: '10px', fontWeight: '700', color: '#F5A623', letterSpacing: '0.12em', marginBottom: '6px' }}>
            LOGRO DESBLOQUEADO
          </div>
          <div style={{ fontSize: '17px', fontWeight: '700', color: '#FFFFFF', marginBottom: '4px' }}>
            {achievement.title}
          </div>
          <div style={{ fontSize: '13px', color: '#888888', lineHeight: 1.4 }}>
            {achievement.sub}
          </div>
        </div>
      )}
    </div>
  )
}
