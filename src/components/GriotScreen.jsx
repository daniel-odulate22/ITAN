import { useState, useRef, useEffect, useCallback } from 'react'
import Stars from './Stars.jsx'
import ElderFigure from './ElderFigure.jsx'
import { detectTopics } from '../utils/topicDetection.js'
import { askGriot } from '../services/geminiService.js'

// Suggested prompts shown before first interaction
const SUGGESTIONS = [
  'Tell me about Sango',
  'Who created the earth?',
  'What happens when we die?',
  'Who is the trickster god?',
  'Tell me about Oshun',
]

// Typewriter hook
function useTypewriter(text, baseSpeed = 28) {
  const [displayed, setDisplayed] = useState('')
  const [done, setDone] = useState(false)
  const typingAudioRef = useRef(null)

  useEffect(() => {
    if (!typingAudioRef.current) {
      typingAudioRef.current = new Audio('/audio/typing_drum.mp3')
    }
    const typingAudio = typingAudioRef.current
    
    if (!text) {
      setDisplayed('')
      setDone(false)
      typingAudio.pause()
      return
    }
    
    setDisplayed('')
    setDone(false)
    let i = 0
    let timeoutId
    
    typingAudio.loop = true
    typingAudio.volume = 0.15
    typingAudio.play().catch(() => {})

    const typeNext = () => {
      if (i >= text.length) {
        setDone(true)
        typingAudio.pause()
        return
      }
      
      const char = text.charAt(i)
      setDisplayed(text.slice(0, i + 1))
      i++
      
      let delay = baseSpeed
      // Natural pacing
      if (['.', '!', '?'].includes(char)) delay = baseSpeed * 15
      else if (char === ',') delay = baseSpeed * 8
      else delay = baseSpeed + (Math.random() * 15 - 5)
      
      timeoutId = setTimeout(typeNext, delay)
    }

    timeoutId = setTimeout(typeNext, baseSpeed)
    
    return () => {
      clearTimeout(timeoutId)
      typingAudio.pause()
    }
  }, [text, baseSpeed])

  return { displayed, done }
}

// Utility to render stage directions wrapped in asterisks
const renderStoryText = (text) => {
  return text.split('*').map((part, index) => {
    // Every odd index is between asterisks
    if (index % 2 === 1) {
      return <span key={index} className="stage-direction">*{part}{text.split('*').length - 1 > index ? '*' : ''}</span>
    }
    return <span key={index}>{part}</span>
  })
}

export default function GriotScreen({ onBack }) {
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [response, setResponse] = useState(null)
  const [mood, setMood] = useState('elder_calm')
  const [hasInteracted, setHasInteracted] = useState(false)

  const inputRef = useRef(null)
  const storyRef = useRef(null)

  const { displayed, done } = useTypewriter(response?.spoken_text || '', 26)
  const ambientAudioRef = useRef(null)

  // Handle ambient audio
  useEffect(() => {
    if (response?.audio_cue && !loading) {
      if (ambientAudioRef.current) {
        ambientAudioRef.current.pause()
      }
      const audio = new Audio(`/audio/${response.audio_cue}.mp3`)
      audio.loop = true
      audio.volume = 0.25
      audio.play().catch(() => {})
      ambientAudioRef.current = audio
    }
    
    return () => {
      if (ambientAudioRef.current) {
        ambientAudioRef.current.pause()
      }
    }
  }, [response?.audio_cue, loading])

  // Auto scroll story zone as text types out
  useEffect(() => {
    if (storyRef.current) {
      storyRef.current.scrollTop = storyRef.current.scrollHeight
    }
  }, [displayed])

  const handleAsk = useCallback(async (question) => {
    const q = (question || input).trim()
    if (!q || loading) return

    setInput('')
    setError('')
    setLoading(true)
    setResponse(null)
    setHasInteracted(true)

    try {
      const contextChunks = detectTopics(q)
      const result = await askGriot(q, contextChunks)
      setResponse(result)
      setMood(result.illustration_cue || 'elder_calm')
    } catch (err) {
      setError(err.message || 'The fire dimmed. Try again, ọmọ mi.')
    } finally {
      setLoading(false)
      setTimeout(() => inputRef.current?.focus(), 100)
    }
  }, [input, loading])

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleAsk()
    }
  }

  return (
    <>
      <Stars />
      <div className="fire-glow" aria-hidden="true" />
      <div className="grain" aria-hidden="true" />

      <div className="griot-screen">

        {/* ── Header ── */}
        <header className="griot-header">
          <button className="back-btn" onClick={onBack} aria-label="Back to landing">
            ← Leave
          </button>
          <h1 className="griot-title">ÌTÀN</h1>
        </header>

        {/* ── Elder figure ── */}
        <div className="elder-zone">
          <ElderFigure mood={mood} />
        </div>

        {/* ── Story zone ── */}
        <div className="story-zone" ref={storyRef}>

          {/* Welcome state */}
          {!hasInteracted && !loading && (
            <p className="story-text" style={{ opacity: 0.55, fontSize: '1rem' }}>
              The elder sits by the fire, waiting...<br />
              <span style={{ fontSize: '0.82rem', fontStyle: 'normal',
                fontFamily: 'var(--font-ui)', letterSpacing: '0.08em',
                color: 'var(--text-dim)', display: 'block', marginTop: '1.2rem' }}>
                Ask about an Orisha, a kingdom, or a philosophy
              </span>
            </p>
          )}

          {/* Suggestion chips — shown before first interaction */}
          {!hasInteracted && !loading && (
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.6rem',
              justifyContent: 'center', marginTop: '1.4rem' }}>
              {SUGGESTIONS.map(s => (
                <button
                  key={s}
                  onClick={() => handleAsk(s)}
                  style={{
                    background: 'transparent',
                    border: '1px solid rgba(232,105,42,0.2)',
                    color: 'var(--text-dim)',
                    fontFamily: 'var(--font-ui)',
                    fontWeight: 300,
                    fontSize: '0.75rem',
                    letterSpacing: '0.06em',
                    padding: '0.5rem 1rem',
                    cursor: 'pointer',
                    transition: 'all 0.2s ease',
                    borderRadius: 0,
                  }}
                  onMouseEnter={e => {
                    e.target.style.borderColor = 'rgba(232,105,42,0.55)'
                    e.target.style.color = 'var(--text-warm)'
                  }}
                  onMouseLeave={e => {
                    e.target.style.borderColor = 'rgba(232,105,42,0.2)'
                    e.target.style.color = 'var(--text-dim)'
                  }}
                >
                  {s}
                </button>
              ))}
            </div>
          )}

          {/* Loading state */}
          {loading && (
            <div className="loading-dots" aria-label="Griot is thinking">
              <div className="loading-dot" />
              <div className="loading-dot" />
              <div className="loading-dot" />
            </div>
          )}

          {/* Error state */}
          {error && <p className="error-text">{error}</p>}

          {/* Story text typewriter */}
          {response && !loading && (
            <>
              <p className="story-text">
                {renderStoryText(displayed)}
                {!done && <span className="cursor" aria-hidden="true" />}
              </p>

              {/* Proverb card appears after text finishes */}
              {done && response.proverb_yoruba && (
                <div className="proverb-card">
                  <p className="proverb-yoruba">"{response.proverb_yoruba}"</p>
                  <p className="proverb-english">{response.proverb_english}</p>
                </div>
              )}
            </>
          )}
        </div>

        {/* ── Input zone ── */}
        <div className="input-zone">
          <div className="input-row">
            <input
              ref={inputRef}
              className="story-input"
              type="text"
              placeholder="Ask the elder anything..."
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              disabled={loading}
              maxLength={200}
              aria-label="Ask the griot a question"
            />
            <button
              className="send-btn"
              onClick={() => handleAsk()}
              disabled={loading || !input.trim()}
              aria-label="Send question"
            >
              →
            </button>
          </div>
        </div>

      </div>
    </>
  )
}
