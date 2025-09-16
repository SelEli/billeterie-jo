import PageLayout from '../common/components/PageLayout';
import { Link } from 'react-router-dom';

export default function Home() {
  const events = [
    { title: 'Athlétisme', date: '2 août 2024', img: '/images/athletisme.jpg' },
    { title: 'Natation', date: '28 juillet 2024', img: '/images/natation.jpg' },
    { title: 'Gymnastique', date: '5 août 2024', img: '/images/gymnastique.jpg' },
  ];

  return (
    <PageLayout fullWidth>
      {/* HERO */}
      <section className="hero-section">
        <div className="hero-overlay"></div>
        <div className="hero-content">
          <h1>Vivez l’émotion des Jeux Olympiques<br />de Paris 2024</h1>
          <p>Réservez vos billets officiels et participez à l’histoire.</p>
          <Link to="/ticket" className="btn btn--primary btn--lg">
            🎟 Voir les billets
          </Link>
        </div>
      </section>

      {/* ÉPREUVES À VENIR */}
      <section className="section-events">
        <div className="container">
          <h2>Épreuves à venir</h2>
          <div className="row">
            {events.map((event, idx) => (
              <div key={idx} className="col col-sm-6 col-lg-4">
                <div className="event-card">
                  <img src={event.img} alt={event.title} />
                  <div className="card-body">
                    <div>
                      <h5>{event.title}</h5>
                      <p>{event.date}</p>
                    </div>
                    <Link to="/ticket" className="btn btn--secondary mt-auto">
                      Réserver
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </PageLayout>
  );
}
