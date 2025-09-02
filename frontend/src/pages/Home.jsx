// src/pages/Home.jsx
import PageLayout from '../common/components/PageLayout';

export default function Home() {
  const events = [
    { title: 'Athlétisme', date: '2 août 2024', img: '/images/event-athle.jpg' },
    { title: 'Natation', date: '28 juillet 2024', img: '/images/event-natation.jpg' },
    { title: 'Gymnastique', date: '5 août 2024', img: '/images/event-gym.jpg' },
  ];

  return (
    <PageLayout fullWidth>
      {/* HERO */}
      <section className="hero-section relative flex items-center justify-center text-center text-white px-4 py-16 md:py-24">
        <div className="hero-overlay"></div>
        <div className="hero-content relative z-10 max-w-3xl">
          <h1 className="text-3xl md:text-5xl font-bold mb-6 leading-tight">
            Vivez l’émotion des Jeux Olympiques<br />de Paris 2024
          </h1>
          <p className="text-lg md:text-xl mb-6">
            Réservez vos billets officiels et participez à l’histoire.
          </p>
          <a
            href="/tickets"
            className="btn btn--primary btn--lg inline-flex items-center justify-center"
          >
            🎟 Voir les billets
          </a>
        </div>
      </section>

      {/* ÉPREUVES À VENIR */}
      <section className="py-12 bg-gray-100">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-center text-2xl md:text-3xl font-bold mb-10">
            Épreuves à venir
          </h2>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {events.map((event, idx) => (
              <div
                key={idx}
                className="bg-white rounded-lg shadow hover:shadow-lg transition overflow-hidden flex flex-col"
              >
                <img
                  src={event.img}
                  alt={event.title}
                  className="w-full h-48 object-cover"
                />
                <div className="p-6 flex flex-col flex-1 text-center">
                  <h5 className="text-lg font-semibold mb-2">{event.title}</h5>
                  <p className="text-gray-500 mb-4">{event.date}</p>
                  <a
                    href="/tickets"
                    className="btn btn--secondary mt-auto inline-flex items-center justify-center"
                  >
                    Réserver
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </PageLayout>
  );
}
