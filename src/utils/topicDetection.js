import knowledgeBase from '../data/knowledgeBase.json'

/**
 * Scans a user message for topic keywords and returns the matching
 * knowledge chunks to inject into the Gemini prompt.
 * Falls back to the general Yoruba context chunk if nothing matches.
 */
export function detectTopics(userMessage) {
  const message = userMessage.toLowerCase()
  const matched = []

  for (const [key, topic] of Object.entries(knowledgeBase.topics)) {
    if (key === 'general') continue
    const hasMatch = topic.keywords.some(kw => message.includes(kw.toLowerCase()))
    if (hasMatch) matched.push(topic)
  }

  return matched.length > 0 ? matched : [knowledgeBase.topics.general]
}
