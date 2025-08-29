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
      <section className="relative min-h-[80vh] flex items-center justify-center text-center">
        {/* Overlay plus clair */}
        <div className="absolute inset-0 hero-overlay" />
        {/* Contenu central */}
        <div className="relative z-10 max-w-3xl px-4 space-y-8">
          <h1 className="text-5xl sm:text-7xl font-extrabold text-white drop-shadow-lg leading-tight">
            Vivez l’émotion des Jeux Olympiques<br />de Paris 2024
          </h1>
          <p className="text-xl sm:text-2xl text-white/90 drop-shadow">
            Réservez vos billets officiels et participez à l’histoire.
          </p>
          <a href="/tickets" className="btn-jo inline-block">
            🎟 Voir les billets
          </a>
        </div>
      </section>

      {/* ÉPREUVES À VENIR */}
      <section className="py-16 px-6 max-w-7xl mx-auto">
        <h2 className="text-3xl font-bold text-center mb-12 text-white drop-shadow">
          Épreuves à venir
        </h2>
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {events.map((event, idx) => (
            <div key={idx} className="card-jo glass overflow-hidden">
              <img
                src={event.img}
                alt={event.title}
                className="w-full h-40 object-cover"
              />
              <div className="p-4 space-y-2 text-center">
                <h3 className="text-xl font-semibold text-[var(--bleu-primaire)]">
                  {event.title}
                </h3>
                <p className="text-sm text-gray-700">{event.date}</p>
                <a href="/tickets" className="btn-jo mt-2 inline-block">
                  Réserver
                </a>
              </div>
            </div>
          ))}
        </div>
      </section>
    </PageLayout>
  );
}
