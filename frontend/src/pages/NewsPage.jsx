import { t } from "@/lib/i18n";

export default function NewsPage({ lang }) {
  return (
    <div data-testid="page-news">
      {/* Hero Section */}
      <section
        className="relative min-h-[50vh] flex items-center overflow-hidden"
        style={{
          background: `linear-gradient(135deg, rgba(14,16,23,0.95) 0%, rgba(14,16,23,0.8) 100%), url('https://images.unsplash.com/photo-1497366811353-6870744d04b2?w=1600&q=80') center/cover no-repeat`
        }}
      >
        <div className="max-w-7xl mx-auto px-8 md:px-16 py-32 w-full">
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6">
            <div>
              <div className="section-label">
                <div className="line" />
                <span>{lang === "fr" ? "Actualités" : "News"}</span>
              </div>
              <h1 
                className="text-white mt-4"
                style={{ fontSize: 'clamp(2.5rem, 6vw, 4.5rem)', lineHeight: 1, fontWeight: 300 }}
                data-testid="news-title"
              >
                {lang === "fr" ? (
                  <>Nos <em style={{ fontStyle: 'italic', color: '#FF8533' }}>actualités</em></>
                ) : (
                  <>Latest <em style={{ fontStyle: 'italic', color: '#FF8533' }}>news</em></>
                )}
              </h1>
              <p 
                className="mt-6 max-w-xl"
                style={{ fontSize: '0.85rem', lineHeight: 1.9, color: '#8A8680' }}
                data-testid="news-subtitle"
              >
                {lang === "fr" 
                  ? "Publications, récompenses et avancement des projets."
                  : "Publications, awards and project updates."}
              </p>
            </div>
            <div 
              className="px-4 py-2 border"
              style={{ borderColor: 'rgba(232, 96, 10, 0.5)', color: '#E8600A', fontSize: '0.7rem', letterSpacing: '0.2em' }}
              data-testid="news-badge"
            >
              {t(lang, "sections.comingSoon")}
            </div>
          </div>
        </div>
      </section>

      {/* Content Section */}
      <section style={{ background: 'var(--dark2)' }}>
        <div className="max-w-7xl mx-auto">
          <div 
            className="p-12 border text-center"
            style={{ borderColor: 'rgba(232, 96, 10, 0.22)', background: 'var(--dark3)' }}
            data-testid="news-coming-soon"
          >
            <div style={{ fontSize: '0.6rem', letterSpacing: '0.3em', color: '#E8600A', marginBottom: '1.5rem' }}>
              {t(lang, "sections.comingSoon")}
            </div>
            <h3 className="text-white mb-4" style={{ fontSize: '1.5rem', fontWeight: 400 }}>
              {lang === "fr" ? "Section en cours de développement" : "Section under development"}
            </h3>
            <p style={{ fontSize: '0.85rem', lineHeight: 1.9, color: '#8A8680', maxWidth: '500px', margin: '0 auto' }}>
              {lang === "fr"
                ? "Cette section sera enrichie très prochainement avec nos articles, prix et reconnaissances."
                : "This section will be updated soon with our articles, awards and recognitions."}
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
