export default function DevelopmentPage({ lang }) {
  return (
    <div data-testid="page-development">
      {/* Hero Section */}
      <section
        className="relative min-h-[50vh] flex items-center overflow-hidden"
        style={{
          background: `linear-gradient(135deg, rgba(14,16,23,0.95) 0%, rgba(14,16,23,0.8) 100%), url('https://images.unsplash.com/photo-1486718448742-163732cd1544?w=1600&q=80') center/cover no-repeat`
        }}
      >
        <div className="max-w-7xl mx-auto px-8 md:px-16 py-32 w-full">
          <div className="section-label">
            <div className="line" />
            <span>{lang === "en" ? "Development" : "Développement"}</span>
          </div>
          <h1 
            className="text-white mt-4"
            style={{ fontSize: 'clamp(2.5rem, 6vw, 4.5rem)', lineHeight: 1, fontWeight: 300 }}
            data-testid="development-title"
          >
            {lang === "fr" ? (
              <>Stratégies <em style={{ fontStyle: 'italic', color: '#FF8533' }}>territoriales</em></>
            ) : (
              <>Territorial <em style={{ fontStyle: 'italic', color: '#FF8533' }}>strategies</em></>
            )}
          </h1>
          <p 
            className="mt-6 max-w-xl"
            style={{ fontSize: '0.85rem', lineHeight: 1.9, color: '#8A8680' }}
            data-testid="development-subtitle"
          >
            {lang === "en"
              ? "Urban planning, large-scale projects and territorial strategies."
              : "Aménagement urbain, projets à grande échelle et stratégies territoriales."}
          </p>
        </div>
      </section>

      {/* Content Section */}
      <section style={{ background: 'var(--dark2)' }}>
        <div className="max-w-7xl mx-auto">
          <div className="grid gap-8 md:grid-cols-2" data-testid="development-cards">
            {/* Urban planning */}
            <div 
              className="p-8 border transition-all duration-300 hover:border-[#E8600A]"
              style={{ borderColor: 'rgba(232, 96, 10, 0.22)', background: 'var(--dark3)' }}
              data-testid="development-card-urban"
            >
              <div style={{ fontSize: '0.6rem', letterSpacing: '0.3em', color: '#E8600A', marginBottom: '1.5rem' }}>01</div>
              <h3 className="text-white mb-4" style={{ fontSize: '1.3rem', fontWeight: 400 }}>
                {lang === "en" ? "Urban planning" : "Aménagement urbain"}
              </h3>
              <p style={{ fontSize: '0.85rem', lineHeight: 1.9, color: '#8A8680' }}>
                {lang === "en"
                  ? "Guidelines, zoning, public space, mobility—bringing coherence and identity to the city."
                  : "Schémas directeurs, zoning, espaces publics, mobilités — donner cohérence et identité à la ville."}
              </p>
            </div>

            {/* Large-scale projects */}
            <div 
              className="p-8 border transition-all duration-300 hover:border-[#E8600A]"
              style={{ borderColor: 'rgba(232, 96, 10, 0.22)', background: 'var(--dark3)' }}
              data-testid="development-card-scale"
            >
              <div style={{ fontSize: '0.6rem', letterSpacing: '0.3em', color: '#E8600A', marginBottom: '1.5rem' }}>02</div>
              <h3 className="text-white mb-4" style={{ fontSize: '1.3rem', fontWeight: 400 }}>
                {lang === "en" ? "Large-scale projects" : "Grands projets"}
              </h3>
              <p style={{ fontSize: '0.85rem', lineHeight: 1.9, color: '#8A8680' }}>
                {lang === "en"
                  ? "Phasing, feasibility, technical coordination and stakeholder alignment."
                  : "Phasage, faisabilité, coordination technique et alignement des parties prenantes."}
              </p>
            </div>
          </div>

          <div 
            className="mt-16 p-6 border text-center"
            style={{ borderColor: 'rgba(232, 96, 10, 0.22)', background: 'var(--dark3)' }}
            data-testid="development-note"
          >
            <p style={{ fontSize: '0.75rem', color: '#5A5854', letterSpacing: '0.1em' }}>
              {lang === "en"
                ? "This section can be expanded with case studies and maps in the next iteration."
                : "Cette section peut être enrichie avec des études de cas et cartes à la prochaine itération."}
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
