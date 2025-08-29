import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import './index.css'

function App() {
  const [count, setCount] = useState(0)

  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <header className="header-jo fixed top-0 w-full z-10">
        <div className="max-w-6xl mx-auto px-4 flex items-center justify-between h-16">
          <h1 className="text-lg sm:text-2xl font-bold">
            🎟 Billetterie Officielle JO 2024
          </h1>
          <nav className="hidden sm:flex gap-6 font-medium">
            <a href="#" className="hover:text-[var(--or-secondaire)]">Accueil</a>
            <a href="#" className="hover:text-[var(--or-secondaire)]">Épreuves</a>
            <a href="#" className="hover:text-[var(--or-secondaire)]">Contact</a>
          </nav>
        </div>
      </header>

      {/* Contenu */}
      <main className="flex-1 flex flex-col items-center justify-center px-4 pt-28 pb-12 gap-6 text-center">
        <div className="flex gap-8 mb-4">
          <img src={viteLogo} alt="Logo Vite" className="w-20" />
          <img src={reactLogo} alt="Logo React" className="w-20" />
        </div>

        <h2 className="text-4xl sm:text-5xl font-extrabold text-[var(--bleu-primaire)]">
          Vivez la magie des Jeux
        </h2>
        <p className="max-w-2xl text-white drop-shadow">
          Réservez vos places pour les épreuves olympiques et paralympiques
          dans un cadre exceptionnel.
        </p>

        <div className="card-jo max-w-sm w-full">
          <button
            onClick={() => setCount(count + 1)}
            className="btn-jo w-full"
          >
            {count === 0 ? 'Réserver maintenant' : `Réservations : ${count}`}
          </button>
        </div>
      </main>

      {/* Footer */}
      <footer className="footer-jo">
        <div className="max-w-6xl mx-auto px-4 py-4 text-center text-sm">
          © 2024 Billetterie Officielle JO — Tous droits réservés
        </div>
      </footer>
    </div>
  )
}

export default App
