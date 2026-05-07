import Stars from './Stars.jsx'

export default function LandingScreen({ onBegin }) {
  return (
    <>
      <Stars />
      <div className="fire-glow" aria-hidden="true" />
      <div className="grain" aria-hidden="true" />

      <main className="landing">
        <div className="landing-pattern" aria-hidden="true" />

        <div className="landing-content">
          <p className="landing-eyebrow">A Yoruba Living Archive</p>

          <h1 className="landing-title">ÌTÀN</h1>

          <p className="landing-subtitle">The Elder Never Dies</p>

          <div className="landing-divider" aria-hidden="true" />

          <p className="landing-tagline">
            Sit by the fire. Ask the griot anything about<br />
            Yoruba gods, kings, and the stories behind creation.
          </p>

          <button className="begin-btn" onClick={onBegin}>
            Enter the Circle
          </button>
        </div>
      </main>
    </>
  )
}
