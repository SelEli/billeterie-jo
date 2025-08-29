// src/common/components/Footer.jsx
export default function Footer() {
  return (
    <footer className="footer-jo">
      <div className="footer-jo__inner">
        <p className="text-sm opacity-80">
          &copy; {new Date().getFullYear()} Paris 2024 — Billetterie officielle
        </p>
        <nav className="footer-jo__links">
          <a href="#" className="footer-jo__link">Mentions légales</a>
          <a href="#" className="footer-jo__link">CGU</a>
          <a href="#" className="footer-jo__link">Confidentialité</a>
        </nav>
      </div>
    </footer>
  );
}
