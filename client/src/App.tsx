import { useState } from 'react'
import reactLogo from './assets/react.svg'
import './App.css'
import LongPulling from './LongPulling'
import WebSockets from './WebSockets'

function App() {
  const [count, setCount] = useState(0)

  return (
    <div className="App">
      <WebSockets />
    </div>
  )
}

export default App
