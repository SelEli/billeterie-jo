import PageLayout from '../common/components/PageLayout';

export default function InfosPratiques() {
  const infos = [
    {
      title: 'Transports',
      content:
        'Utilisez les transports en commun pour accéder facilement aux sites. Des lignes spéciales seront mises en place.',
    },
    {
      title: 'Sécurité',
      content:
        'Des contrôles de sécurité seront effectués à l’entrée des sites. Prévoyez d’arriver en avance.',
    },
    {
      title: 'Accessibilité',
      content:
        'Tous les sites sont accessibles aux personnes à mobilité réduite. Des services d’assistance seront disponibles.',
    },
  ];

  return (
    <PageLayout>
      <div className="container">
        <div className="card-jo">
          <h1>Infos pratiques</h1>
          <p>
            Préparez votre venue aux Jeux Olympiques de Paris 2024 grâce à ces informations essentielles.
          </p>
        </div>

        <div className="row mt-4">
          {infos.map((info, idx) => (
            <div key={idx} className="col col-sm-6 col-lg-4">
              <div className="card-jo">
                <h3>{info.title}</h3>
                <p>{info.content}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </PageLayout>
  );
}
