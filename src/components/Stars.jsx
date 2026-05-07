import { useMemo } from 'react'

export default function Stars() {
  const stars = useMemo(() => {
    return Array.from({ length: 90 }, (_, i) => ({
      id: i,
      top: `${Math.random() * 75}%`,
      left: `${Math.random() * 100}%`,
      size: Math.random() * 2 + 0.8,
      duration: `${Math.random() * 4 + 2}s`,
      delay: `${Math.random() * 5}s`,
      minOpacity: Math.random() * 0.1 + 0.05,
      maxOpacity: Math.random() * 0.5 + 0.3,
    }))
  }, [])

  return (
    <div className="stars" aria-hidden="true">
      {stars.map(s => (
        <div
          key={s.id}
          className="star"
          style={{
            top: s.top,
            left: s.left,
            width: s.size,
            height: s.size,
            '--duration': s.duration,
            '--delay': s.delay,
            '--min-opacity': s.minOpacity,
            '--max-opacity': s.maxOpacity,
          }}
        />
      ))}
    </div>
  )
}
