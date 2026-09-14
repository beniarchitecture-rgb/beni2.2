export default function ConstructionPage({ lang }) {
  return (
    <div data-testid="page-construction">
      {/* Hero Section */}
      <section
        className="relative min-h-[50vh] flex items-center overflow-hidden"
        style={{
          background: `linear-gradient(135deg, rgba(14,16,23,0.95) 0%, rgba(14,16,23,0.8) 100%), url('https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=1600&q=80') center/cover no-repeat`
        }}
      >
        <div className="max-w-7xl mx-auto px-8 md:px-16 py-32 w-full">
          <div className="section-label">
            <div className="line" />
            <span>Construction</span>
          </div>
          <h1 
            className="text-white mt-4"
            style={{ fontSize: 'clamp(2.5rem, 6vw, 4.5rem)', lineHeight: 1, fontWeight: 300 }}
            data-testid="construction-title"
          >
            {lang === "fr" ? (
              <>Suivi de <em style={{ fontStyle: 'italic', color: '#FF8533' }}>chantier</em></>
            ) : (
              <>Site <em style={{ fontStyle: 'italic', color: '#FF8533' }}>supervision</em></>
            )}
          </h1>
          <p 
            className="mt-6 max-w-xl"
            style={{ fontSize: '0.85rem', lineHeight: 1.9, color: '#8A8680' }}
            data-testid="construction-subtitle"
          >
            {lang === "en"
              ? "Site supervision, coordination, quality control and delivery."
              : "Suivi de chantier, coordination, contrôle qualité et livraison."}
          </p>
        </div>
      </section>

      {/* Content Section */}
      <section style={{ background: 'var(--dark2)' }}>
        <div className="max-w-7xl mx-auto">
          <div className="grid gap-8 md:grid-cols-2" data-testid="construction-cards">
            {/* Site management */}
            <div 
              className="p-8 border transition-all duration-300 hover:border-[#E8600A]"
              style={{ borderColor: 'rgba(232, 96, 10, 0.22)', background: 'var(--dark3)' }}
              data-testid="construction-card-management"
            >
              <div style={{ fontSize: '0.6rem', letterSpacing: '0.3em', color: '#E8600A', marginBottom: '1.5rem' }}>01</div>
              <h3 className="text-white mb-4" style={{ fontSize: '1.3rem', fontWeight: 400 }}>
                {lang === "en" ? "Site management" : "Suivi de chantier"}
              </h3>
              <p style={{ fontSize: '0.85rem', lineHeight: 1.9, color: '#8A8680' }}>
                {lang === "en"
                  ? "Weekly reporting, schedule tracking, and coordination with contractors."
                  : "Compte-rendus hebdomadaires, suivi du planning et coordination avec les entreprises."}
              </p>
            </div>

            {/* Quality & compliance */}
            <div 
              className="p-8 border transition-all duration-300 hover:border-[#E8600A]"
              style={{ borderColor: 'rgba(232, 96, 10, 0.22)', background: 'var(--dark3)' }}
              data-testid="construction-card-quality"
            >
              <div style={{ fontSize: '0.6rem', letterSpacing: '0.3em', color: '#E8600A', marginBottom: '1.5rem' }}>02</div>
              <h3 className="text-white mb-4" style={{ fontSize: '1.3rem', fontWeight: 400 }}>
                {lang === "en" ? "Quality & compliance" : "Qualité & conformité"}
              </h3>
              <p style={{ fontSize: '0.85rem', lineHeight: 1.9, color: '#8A8680' }}>
                {lang === "en"
                  ? "Material checks, execution control, and compliance with drawings and specifications."
                  : "Contrôle des matériaux, suivi d'exécution, conformité aux plans et prescriptions."}
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
