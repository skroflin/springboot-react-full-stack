import { useState } from 'react'
import { DjelatnikList } from './components/DjelatnikList'

function App() {
  const [count, setCount] = useState(0)

  return (
    <div>
      <DjelatnikList />
    </div>
  )
}

export default App
