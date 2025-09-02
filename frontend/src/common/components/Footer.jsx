// src/common/components/Footer.jsx
export default function Footer() {
  return (
    <footer className="footer-jo">
      <div className="footer-jo__inner flex flex-col md:flex-row md:items-start md:justify-between gap-8">
        
        {/* Colonne 1 - Branding */}
        <div className="flex-1">
          <h3 className="text-lg font-bold mb-2">🏅 JO Paris 2024</h3>
          <p className="text-sm opacity-80 mb-4">
            &copy; {new Date().getFullYear()} Paris 2024 — Billetterie officielle
          </p>
          <p className="text-sm opacity-70">
            Vivez l’émotion des Jeux Olympiques et Paralympiques de Paris 2024.
          </p>
        </div>

        {/* Colonne 2 - Navigation principale */}
        <div className="flex-1">
          <h4 className="font-semibold mb-3">Navigation</h4>
          <nav className="flex flex-col gap-2">
            <a href="/" className="footer-jo__link">Accueil</a>
            <a href="/tickets" className="footer-jo__link">Billets</a>
            <a href="/sites-plan" className="footer-jo__link">Plan des sites</a>
            <a href="/infos-pratiques" className="footer-jo__link">Infos pratiques</a>
          </nav>
        </div>

        {/* Colonne 3 - Espace membre */}
        <div className="flex-1">
          <h4 className="font-semibold mb-3">Espace membre</h4>
          <nav className="flex flex-col gap-2">
            <a href="/login" className="footer-jo__link">Connexion</a>
            <a href="/register" className="footer-jo__link">Inscription</a>
            <a href="/profile" className="footer-jo__link">Mon profil</a>
          </nav>
        </div>

        {/* Colonne 4 - Légal */}
        <div className="flex-1">
          <h4 className="font-semibold mb-3">Informations légales</h4>
          <nav className="flex flex-col gap-2">
            <a href="#" className="footer-jo__link">Mentions légales</a>
            <a href="#" className="footer-jo__link">CGU</a>
            <a href="#" className="footer-jo__link">Confidentialité</a>
          </nav>
        </div>
      </div>
    </footer>
  );
}
