import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'     // Styles existants
import './index.css'   // Tailwind activé ici



function App() {
  const [count, setCount] = useState(0)

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 text-gray-900">
      {/* Logos */}
      <div className="flex gap-8 mb-6">
        <a href="https://vite.dev" target="_blank" rel="noreferrer">
          <img src={viteLogo} className="logo" alt="Vite logo" />
        </a>
        <a href="https://react.dev" target="_blank" rel="noreferrer">
          <img src={reactLogo} className="logo react" alt="React logo" />
        </a>
      </div>

      {/* Titre */}
      <h1 className="text-4xl font-bold text-blue-500">Vite + React + Tailwind 🚀</h1>

      {/* Carte compteur */}
      <div className="card shadow-md rounded-lg bg-white p-6">
        <button
          onClick={() => setCount((count) => count + 1)}
          className="mt-2 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
        >
          count is {count}
        </button>
        <p className="mt-4 text-sm text-gray-600">
          Edit <code>src/App.jsx</code> and save to test HMR
        </p>
      </div>

      {/* Footer */}
      <p className="read-the-docs mt-6">
        Click on the Vite and React logos to learn more
      </p>
    </div>
  )
}

export default App
