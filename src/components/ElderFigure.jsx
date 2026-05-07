// Mood to glow color map
const GLOW_MAP = {
  elder_calm:             'rgba(232, 105, 42, 0.35)',
  elder_intense:          'rgba(220, 50, 20, 0.55)',
  elder_reverent:         'rgba(201, 162, 39, 0.45)',
  elder_sculpting:        'rgba(180, 140, 80, 0.40)',
  elder_sorrowful:        'rgba(80, 120, 200, 0.35)',
  elder_smiling_wryly:    'rgba(232, 180, 42, 0.40)',
  elder_stern:            'rgba(40, 80, 160, 0.40)',
  elder_casting_stones:   'rgba(140, 80, 220, 0.40)',
  elder_looking_at_stars: 'rgba(100, 140, 220, 0.35)',
}

export default function ElderFigure({ mood = 'elder_calm' }) {
  const glow = GLOW_MAP[mood] || GLOW_MAP.elder_calm

  return (
    <div className="elder-figure">
      <svg
        className="elder-svg"
        viewBox="0 0 190 260"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        style={{ '--elder-glow': glow }}
      >
        {/* ── Ground shadow ── */}
        <ellipse cx="95" cy="252" rx="52" ry="6" fill="rgba(0,0,0,0.45)" />

        {/* ── Agbada robe ── */}
        <path
          d="M48 145 C38 170 30 200 34 248 L156 248 C160 200 152 170 142 145 Z"
          fill="#1A1208"
          stroke="#3D2A10"
          strokeWidth="1"
        />
        {/* Robe Adire pattern lines */}
        <path d="M70 160 L70 240" stroke="#2A1E0A" strokeWidth="0.8" opacity="0.6" />
        <path d="M95 155 L95 248" stroke="#2A1E0A" strokeWidth="0.8" opacity="0.6" />
        <path d="M120 160 L120 240" stroke="#2A1E0A" strokeWidth="0.8" opacity="0.6" />
        <path d="M55 185 L135 185" stroke="#2A1E0A" strokeWidth="0.8" opacity="0.4" />
        <path d="M48 210 L142 210" stroke="#2A1E0A" strokeWidth="0.8" opacity="0.4" />

        {/* ── Wide sleeves ── */}
        <path d="M48 145 C28 148 14 162 18 178 C26 175 38 168 52 165 Z"
          fill="#1A1208" stroke="#3D2A10" strokeWidth="1" />
        <path d="M142 145 C162 148 176 162 172 178 C164 175 152 168 138 165 Z"
          fill="#1A1208" stroke="#3D2A10" strokeWidth="1" />

        {/* ── Collar / agbada detail ── */}
        <path d="M72 143 C80 152 95 155 110 152 L118 143 C108 148 82 148 72 143Z"
          fill="#2D1F0C" />

        {/* ── Neck ── */}
        <rect x="87" y="118" width="16" height="28" rx="6" fill="#8B5E3C" />

        {/* ── Head ── */}
        <ellipse cx="95" cy="100" rx="28" ry="32" fill="#8B5E3C" />
        {/* Face shadow depth */}
        <ellipse cx="95" cy="108" rx="22" ry="24" fill="#7A5232" opacity="0.4" />

        {/* ── Eyes ── */}
        <ellipse cx="85" cy="96" rx="4.5" ry="3.5" fill="#1A0E04" />
        <ellipse cx="105" cy="96" rx="4.5" ry="3.5" fill="#1A0E04" />
        {/* Eye shine */}
        <circle cx="87" cy="94.5" r="1.2" fill="rgba(255,220,150,0.7)" />
        <circle cx="107" cy="94.5" r="1.2" fill="rgba(255,220,150,0.7)" />

        {/* ── Nose ── */}
        <path d="M92 100 C90 105 88 108 91 110 C93 111 97 111 99 110 C102 108 100 105 98 100"
          fill="#6B4428" opacity="0.7" />

        {/* ── Mouth ── */}
        <path d="M87 115 Q95 120 103 115" stroke="#5A3520" strokeWidth="1.5"
          fill="none" strokeLinecap="round" />

        {/* ── White beard ── */}
        <path d="M70 112 C68 122 72 140 85 145 L95 148 L105 145 C118 140 122 122 120 112 C110 118 80 118 70 112Z"
          fill="#E8E0D0" opacity="0.92" />
        {/* Beard texture lines */}
        <path d="M80 118 L82 142" stroke="#C8C0B0" strokeWidth="0.6" opacity="0.6" />
        <path d="M88 120 L88 147" stroke="#C8C0B0" strokeWidth="0.6" opacity="0.6" />
        <path d="M96 120 L94 146" stroke="#C8C0B0" strokeWidth="0.6" opacity="0.6" />
        <path d="M104 118 L101 141" stroke="#C8C0B0" strokeWidth="0.6" opacity="0.6" />

        {/* ── Fila cap ── */}
        <ellipse cx="95" cy="72" rx="30" ry="8" fill="#1A2B5C" />
        <path d="M65 72 C65 52 125 52 125 72" fill="#1A2B5C" />
        <path d="M68 72 C68 54 122 54 122 72" fill="#243570" opacity="0.6" />
        {/* Cap embroidery hint */}
        <path d="M78 62 C85 58 105 58 112 62" stroke="#C9A227" strokeWidth="0.8"
          fill="none" opacity="0.7" />

        {/* ── Walking stick ── */}
        <line x1="148" y1="148" x2="168" y2="252" stroke="#4A2E0A" strokeWidth="3.5"
          strokeLinecap="round" />
        {/* Stick top ornament */}
        <circle cx="148" cy="145" r="5" fill="#C9A227" opacity="0.85" />

        {/* ── Small campfire in front ── */}
        <g transform="translate(55, 230)">
          {/* Logs */}
          <line x1="4" y1="20" x2="26" y2="14" stroke="#3D1F05" strokeWidth="3"
            strokeLinecap="round" />
          <line x1="6" y1="20" x2="24" y2="14" stroke="#5A2E08" strokeWidth="2.2"
            strokeLinecap="round" />
          {/* Flame layers */}
          <path className="elder-flame"
            d="M15 14 C12 10 10 6 15 2 C20 6 18 10 15 14Z"
            fill="#E8692A" opacity="0.9" />
          <path className="elder-flame"
            d="M15 12 C13 9 12 6 15 3 C18 6 17 9 15 12Z"
            fill="#F4A528" opacity="0.95"
            style={{ animationDelay: '0.15s' }} />
          <path className="elder-flame"
            d="M15 10 C14 8 14 6 15 4 C16 6 16 8 15 10Z"
            fill="#FDD835" opacity="0.85"
            style={{ animationDelay: '0.3s' }} />
          {/* Ember glow */}
          <ellipse cx="15" cy="18" rx="9" ry="3"
            fill="rgba(232,105,42,0.35)" />
        </g>
      </svg>
    </div>
  )
}
