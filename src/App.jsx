import { useState } from 'react'
import LandingScreen from './components/LandingScreen.jsx'
import GriotScreen from './components/GriotScreen.jsx'

export default function App() {
  const [screen, setScreen] = useState('landing')

  return (
    <div className="app-root">
      {screen === 'landing'
        ? <LandingScreen onBegin={() => setScreen('griot')} />
        : <GriotScreen onBack={() => setScreen('landing')} />
      }
    </div>
  )
}
