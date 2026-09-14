import { siteConfig } from "@/data/siteConfig";
import { NavLink } from "react-router-dom";

export default function VisionPage({ lang }) {
  return (
    <div data-testid="page-vision">
      {/* Hero Section */}
      <section
        className="relative min-h-[60vh] flex items-center overflow-hidden"
        style={{
          background: `linear-gradient(135deg, rgba(14,16,23,0.9) 0%, rgba(14,16,23,0.75) 100%), url('https://static.prod-images.emergentagent.com/jobs/e81c66c6-55f7-4f3a-b2be-536f6a05f004/images/f0528ea6b4093963acdf97fe0476b1057cf8f2c33ee4fad079bd93850691e4f6.png') center/cover no-repeat`
        }}
        data-testid="vision-hero"
      >
        <div className="max-w-7xl mx-auto px-8 md:px-16 py-32 w-full">
          <div className="section-label">
            <div className="line" />
            <span>Vision</span>
          </div>
          <h1 
            className="text-white mt-4"
            style={{ fontSize: 'clamp(2.5rem, 6vw, 5rem)', lineHeight: 1, fontWeight: 300 }}
            data-testid="vision-page-title"
          >
            {lang === "fr" ? (
              <>Une pratique <em style={{ fontStyle: 'italic', color: '#FF8533' }}>identitaire</em></>
            ) : (
              <>An <em style={{ fontStyle: 'italic', color: '#FF8533' }}>identity-driven</em> practice</>
            )}
          </h1>
          <p 
            className="mt-8 max-w-2xl"
            style={{ fontSize: '0.9rem', lineHeight: 1.9, color: '#8A8680' }}
            data-testid="vision-page-subtitle"
          >
            {lang === "en"
              ? "We design contemporary premium projects grounded in local culture, climate intelligence and long-term durability."
              : "Nous concevons des projets contemporains premium, ancrés dans la culture locale, l'intelligence climatique et la durabilité."}
          </p>
          
          <div 
            className="mt-8 inline-block px-4 py-2"
            style={{ border: '1px solid rgba(232, 96, 10, 0.5)', color: '#E8600A', fontSize: '0.7rem', letterSpacing: '0.2em' }}
            data-testid="vision-badge"
          >
            {lang === "fr" ? "DEPUIS" : "SINCE"} {siteConfig.brand.yearFounded}
          </div>
        </div>
      </section>

      {/* Main content */}
      <section style={{ background: 'var(--dark2)' }} data-testid="vision-content">
        <div className="max-w-7xl mx-auto">
          <div className="grid gap-8 md:grid-cols-2" data-testid="vision-cards">
            {/* Philosophy */}
            <div 
              className="p-8 border transition-all duration-300 hover:border-[#E8600A]"
              style={{ borderColor: 'rgba(232, 96, 10, 0.22)', background: 'var(--dark3)' }}
              data-testid="vision-card-philosophy"
            >
              <div style={{ fontSize: '0.6rem', letterSpacing: '0.3em', color: '#E8600A', marginBottom: '1.5rem' }}>01</div>
              <h3 className="text-white mb-4" style={{ fontSize: '1.3rem', fontWeight: 400 }}>
                {lang === "en" ? "Philosophy" : "Philosophie"}
              </h3>
              <p style={{ fontSize: '0.85rem', lineHeight: 1.9, color: '#8A8680' }}>
                {lang === "en"
                  ? "We privilege collaboration, dialogue and creativity through a modern, rigorous and contextual approach. Our work is shaped by lifestyle, cultural identity and territorial integration."
                  : "BENI Architecture privilégie le partage, l'échange et la créativité, avec une approche moderne, qualitative et contextualisée. Nos projets tiennent compte du mode de vie, de l'identité culturelle et de l'intégration au territoire."}
              </p>
            </div>

            {/* Commitments */}
            <div 
              className="p-8 border transition-all duration-300 hover:border-[#E8600A]"
              style={{ borderColor: 'rgba(232, 96, 10, 0.22)', background: 'var(--dark3)' }}
              data-testid="vision-card-engagement"
            >
              <div style={{ fontSize: '0.6rem', letterSpacing: '0.3em', color: '#E8600A', marginBottom: '1.5rem' }}>02</div>
              <h3 className="text-white mb-4" style={{ fontSize: '1.3rem', fontWeight: 400 }}>
                {lang === "en" ? "Commitments" : "Engagements"}
              </h3>
              <p style={{ fontSize: '0.85rem', lineHeight: 1.9, color: '#8A8680' }}>
                {lang === "en"
                  ? "Durability, climate intelligence, material honesty and maintainability guide each design decision."
                  : "Durabilité, intelligence climatique, sobriété des matériaux et maintenabilité à long terme guident chaque décision de conception."}
              </p>
            </div>

            {/* Leadership */}
            <div 
              className="p-8 border transition-all duration-300 hover:border-[#E8600A]"
              style={{ borderColor: 'rgba(232, 96, 10, 0.22)', background: 'var(--dark3)' }}
              data-testid="vision-card-leadership"
            >
              <div style={{ fontSize: '0.6rem', letterSpacing: '0.3em', color: '#E8600A', marginBottom: '1.5rem' }}>03</div>
              <h3 className="text-white mb-4" style={{ fontSize: '1.3rem', fontWeight: 400 }}>
                {lang === "en" ? "Leadership" : "Direction"}
              </h3>
              <p style={{ fontSize: '0.85rem', lineHeight: 1.9, color: '#8A8680' }}>
                {lang === "en"
                  ? `Founded by ${siteConfig.brand.founder}, registered under ${siteConfig.brand.registration}.`
                  : `Fondé par ${siteConfig.brand.founder}, ${siteConfig.brand.registration}.`}
              </p>
            </div>

            {/* Territory */}
            <div 
              className="p-8 border transition-all duration-300 hover:border-[#E8600A]"
              style={{ borderColor: 'rgba(232, 96, 10, 0.22)', background: 'var(--dark3)' }}
              data-testid="vision-card-territory"
            >
              <div style={{ fontSize: '0.6rem', letterSpacing: '0.3em', color: '#E8600A', marginBottom: '1.5rem' }}>04</div>
              <h3 className="text-white mb-4" style={{ fontSize: '1.3rem', fontWeight: 400 }}>
                {lang === "en" ? "Territory" : "Territoire"}
              </h3>
              <p style={{ fontSize: '0.85rem', lineHeight: 1.9, color: '#8A8680' }}>
                {lang === "en"
                  ? "Côte d'Ivoire and the sub-region — institutional, residential and commercial projects."
                  : "Côte d'Ivoire & sous-région — projets institutionnels, résidentiels et commerciaux."}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Founder */}
      <section data-testid="vision-founder">
        <div className="max-w-7xl mx-auto">
          <div className="section-label">
            <div className="line" />
            <span>{lang === "fr" ? "Direction" : "Leadership"}</span>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div className="relative group w-full max-w-md">
              <div
                className="aspect-[3/4] w-full transition-transform duration-700 group-hover:scale-[1.02]"
                style={{
                  background: `url('https://customer-assets-lxgj4vgw.emergentagent.net/job_b0eef712-15d1-4bdf-aade-5c9f0987e2df/artifacts/nqq1opje_Architecte_Dion.png') center top/cover no-repeat`
                }}
                data-testid="founder-portrait"
              />
              <div
                className="absolute -bottom-5 -right-5 w-20 h-20 transition-transform duration-500 group-hover:scale-110"
                style={{ background: 'var(--orange)' }}
              />
            </div>
            <div>
              <h2
                className="text-white mb-3"
                style={{ fontSize: 'clamp(1.8rem, 4vw, 3rem)', fontWeight: 300 }}
                data-testid="founder-name"
              >
                {siteConfig.brand.founder}
              </h2>
              <div style={{ fontSize: '0.65rem', letterSpacing: '0.3em', color: '#E8600A', textTransform: 'uppercase', marginBottom: '2rem' }}>
                {lang === "fr" ? "Architecte · Fondateur" : "Architect · Founder"}
              </div>
              <p className="mb-6" style={{ fontSize: '0.85rem', lineHeight: 1.9, color: '#8A8680' }} data-testid="founder-text">
                {lang === "en"
                  ? `Founder of BENI Architecture, ${siteConfig.brand.founder} leads a team of more than ten architects, engineers and senior technicians, driven by a contemporary, identity-focused vision of architecture in Côte d'Ivoire and the sub-region.`
                  : `Fondateur de BENI Architecture, ${siteConfig.brand.founder} dirige une équipe de plus de dix architectes, ingénieurs et techniciens supérieurs, portée par une vision contemporaine et identitaire de l'architecture en Côte d'Ivoire et dans la sous-région.`}
              </p>
              <p style={{ fontSize: '0.75rem', lineHeight: 1.8, color: '#5A5854' }}>
                {siteConfig.brand.registration}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Portfolio Strip */}
      <section data-testid="vision-portfolio-strip">
        <div className="max-w-7xl mx-auto">
          <div className="section-label">
            <div className="line" />
            <span>Portfolio</span>
          </div>
          <div className="flex items-end justify-between gap-8 mb-12">
            <h2 className="text-white" style={{ fontSize: 'clamp(1.5rem, 4vw, 2.5rem)', fontWeight: 300 }}>
              {lang === "fr" ? (
                <>Découvrez nos <em style={{ fontStyle: 'italic', color: '#FF8533' }}>réalisations</em></>
              ) : (
                <>Explore our <em style={{ fontStyle: 'italic', color: '#FF8533' }}>work</em></>
              )}
            </h2>
            <NavLink to="/projets" className="btn-outline hidden md:block">
              {lang === "fr" ? "Voir tous" : "View all"}
            </NavLink>
          </div>

          <div className="grid gap-6 md:grid-cols-3">
            {siteConfig.projects.slice(0, 3).map((p) => (
              <NavLink 
                key={p.id}
                to={`/projets/${p.id}`}
                className="beni-card group block"
              >
                <div
                  className="aspect-[4/3] w-full transition-transform duration-500 group-hover:scale-105"
                  style={{
                    backgroundImage: `url(${p.imageUrl})`,
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                  }}
                />
                <div className="p-5">
                  <div style={{ fontSize: '0.55rem', letterSpacing: '0.3em', color: '#E8600A', textTransform: 'uppercase', marginBottom: '0.5rem' }}>
                    {p.location[lang]}
                  </div>
                  <h3 className="text-white group-hover:text-[#FF8533] transition-colors" style={{ fontSize: '1rem', fontWeight: 400 }}>
                    {p.title[lang]}
                  </h3>
                </div>
              </NavLink>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
