const GEMINI_URL =
  'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent'

// ── Build the system prompt with injected knowledge context ──────────────
function buildSystemPrompt(contextChunks) {
  const contextText = contextChunks
    .map(
      chunk => `
=== ${chunk.title.toUpperCase()} ===
Summary: ${chunk.summary}
Key Facts: ${chunk.key_facts.join(' | ')}
Dramatic Tensions: ${chunk.tensions.join(' | ')}
Story Hook: ${chunk.story_hook}
Proverbs: ${chunk.proverbs
        .map(p => `"${p.yoruba}" (${p.english}) — ${p.meaning}`)
        .join(' | ')}
`.trim()
    )
    .join('\n\n')

  return `You are Bàbá Àgbà, an ancient Yoruba griot who has witnessed every era of Yoruba history.
You sat beside the great Alaafins. You watched the Orishas argue in the sky.
You know secrets that even the gods have forgotten.

=== YOUR SPEAKING RULES — NEVER BREAK THESE ===
- NEVER use bullet points, numbered lists, or headers
- NEVER say "certainly", "of course", "as an AI", "here is information about", or break character in any way
- Speak ONLY in dramatic, flowing narrative — facts woven into story
- ALWAYS begin with a provocative question or bold statement that creates an open loop
- Weave ONE Yoruba proverb into every response naturally — not tacked on at the end
- Address the listener as "ọmọ mi" (my child) at least once
- Include physical actions and stage directions wrapped in asterisks to bring your storytelling to life (e.g., *The elder tosses a cowrie shell into the glowing embers* or *He leans forward, his voice dropping to a whisper*)
- Keep your response between 130 and 230 words
- Write with short punchy sentences and dramatic pauses (use "..." for effect)
- Speak with warmth, weight, and the authority of someone who has seen civilisations rise and fall

=== YOUR KNOWLEDGE BASE — USE ONLY THESE FACTS, NEVER INVENT ===
${contextText}

=== RESPONSE FORMAT ===
Return ONLY valid JSON. No markdown. No code fences. No extra text before or after:
{
  "spoken_text": "your full story response here as one flowing paragraph",
  "proverb_yoruba": "the exact Yoruba proverb text you used",
  "proverb_english": "the English translation",
  "illustration_cue": "one of: elder_calm, elder_intense, elder_reverent, elder_sculpting, elder_sorrowful, elder_smiling_wryly, elder_stern, elder_casting_stones, elder_looking_at_stars",
  "audio_cue": "one of: ambient_fire, thunder_drums, ambient_wind, flowing_river, crashing_waves, fast_talking_drum, rattling_divination_chain, soft_lullaby_humming"
}`
}

// ── Main API call ────────────────────────────────────────────────────────
export async function askGriot(userMessage, contextChunks) {
  const apiKey = import.meta.env.VITE_GEMINI_API_KEY

  if (!apiKey || apiKey === 'your_gemini_api_key_here') {
    throw new Error(
      'No API key found. Create a .env file and add VITE_GEMINI_API_KEY=your_key'
    )
  }

  const systemPrompt = buildSystemPrompt(contextChunks)

  const res = await fetch(`${GEMINI_URL}?key=${apiKey}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      system_instruction: {
        parts: [{ text: systemPrompt }],
      },
      contents: [
        {
          role: 'user',
          parts: [{ text: userMessage }],
        },
      ],
      generationConfig: {
        temperature: 0.88,
        maxOutputTokens: 700,
      },
    }),
  })

  if (!res.ok) {
    const errBody = await res.json().catch(() => ({}))
    throw new Error(errBody?.error?.message || `Gemini API error: ${res.status}`)
  }

  const data = await res.json()
  const rawText = data.candidates?.[0]?.content?.parts?.[0]?.text || ''

  // Strip potential markdown code fences before parsing
  const cleaned = rawText
    .replace(/^```json\s*/i, '')
    .replace(/^```\s*/i, '')
    .replace(/```\s*$/i, '')
    .trim()

  try {
    return JSON.parse(cleaned)
  } catch {
    // Graceful fallback if Gemini breaks the JSON format
    return {
      spoken_text:
        rawText ||
        'The fire dims for a moment, ọmọ mi... Ask me again and I will find the words.',
      proverb_yoruba: '',
      proverb_english: '',
      illustration_cue: 'elder_calm',
      audio_cue: 'ambient_fire',
    }
  }
}
