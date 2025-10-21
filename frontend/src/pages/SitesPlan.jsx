import PageLayout from '../common/components/PageLayout';

export default function SitesPlan() {
  const sites = [
    { name: 'Stade de France', location: 'Saint-Denis', sports: 'Athlétisme, Cérémonies' },
    { name: 'Arena Bercy', location: 'Paris 12e', sports: 'Basket-ball, Gymnastique' },
    { name: 'Centre Aquatique', location: 'Saint-Denis', sports: 'Natation, Plongeon' },
  ];

  return (
    <PageLayout>
      <div className="container">
        <div className="card-jo">
          <h1>Plan des sites olympiques</h1>
          <p>
            Découvrez les principaux lieux qui accueilleront les épreuves des Jeux Olympiques de Paris 2024.
          </p>
        </div>

        <div className="row mt-4">
          {sites.map((site, idx) => (
            <div key={idx} className="col col-sm-6 col-lg-4">
              <div className="card-jo">
                <h3>{site.name}</h3>
                <p><strong>Lieu :</strong> {site.location}</p>
                <p><strong>Sports :</strong> {site.sports}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </PageLayout>
  );
}
