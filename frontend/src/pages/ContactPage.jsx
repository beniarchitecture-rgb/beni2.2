import { useMemo, useState } from "react";

import { siteConfig } from "@/data/siteConfig";
import { t } from "@/lib/i18n";
import { submitContactMessage } from "@/lib/api";

import { toast } from "@/hooks/use-toast";

function buildPayload({ name, email, phone, subject, message, lang }) {
  return {
    name: name.trim(),
    email: email.trim(),
    phone: phone.trim(),
    subject: subject.trim(),
    message: message.trim(),
    preferred_language: lang,
  };
}

export default function ContactPage({ lang }) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const mapLang = lang === "en" ? "en" : "fr";
  const mapEmbedUrl = `https://www.google.com/maps?q=5.398341,-3.9941546&z=17&hl=${mapLang}&output=embed`;
  const mapDirectionsUrl = "https://maps.app.goo.gl/n6UTyGKzKhYMd6Jo8";

  const canSubmit = useMemo(() => {
    return Boolean(name.trim() && email.trim() && message.trim()) && !loading;
  }, [name, email, message, loading]);

  async function onSubmit(e) {
    e.preventDefault();
    if (!canSubmit) return;

    setLoading(true);
    try {
      await submitContactMessage(
        buildPayload({ name, email, phone, subject, message, lang }),
      );

      toast({
        title: t(lang, "contact.successTitle"),
        description: t(lang, "contact.successDesc"),
      });

      setName("");
      setEmail("");
      setPhone("");
      setSubject("");
      setMessage("");
    } catch (err) {
      // Log error for debugging - in production, use error tracking service (e.g., Sentry)
      if (process.env.NODE_ENV === 'development') {
        console.error('Contact form submission failed:', err);
      }
      toast({
        title: t(lang, "contact.errorTitle"),
        description: t(lang, "contact.errorDesc"),
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  }

  return (
    <div data-testid="page-contact">
      {/* Hero Section */}
      <section 
        className="relative min-h-[50vh] flex items-center overflow-hidden"
        style={{ 
          background: `linear-gradient(135deg, rgba(14,16,23,0.95) 0%, rgba(14,16,23,0.8) 100%), url('https://images.unsplash.com/photo-1497366216548-37526070297c?w=1600&q=80') center/cover no-repeat`
        }}
      >
        <div className="max-w-7xl mx-auto px-8 md:px-16 py-32">
          <div className="section-label">
            <div className="line" />
            <span>{t(lang, "sections.contactTitle")}</span>
          </div>
          <h1 
            className="text-white mt-4"
            style={{ fontSize: 'clamp(2.5rem, 6vw, 4.5rem)', lineHeight: 1, fontWeight: 300 }}
            data-testid="contact-title"
          >
            {lang === "fr" ? (
              <>Parlons de votre <em style={{ fontStyle: 'italic', color: '#FF8533' }}>projet</em></>
            ) : (
              <>Let&apos;s discuss your <em style={{ fontStyle: 'italic', color: '#FF8533' }}>project</em></>
            )}
          </h1>
          <p 
            className="mt-6 max-w-xl"
            style={{ fontSize: '0.85rem', lineHeight: 1.9, color: '#8A8680' }}
            data-testid="contact-lead"
          >
            {t(lang, "contact.lead")}
          </p>
        </div>
      </section>

      {/* Contact Form Section */}
      <section style={{ background: 'var(--dark2)' }}>
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16" data-testid="contact-grid">
            {/* Form */}
            <div data-testid="contact-form-card">
              <h2 
                className="text-white mb-8"
                style={{ fontSize: '1.5rem', fontWeight: 400 }}
                data-testid="contact-form-title"
              >
                {lang === "en" ? "Send a message" : "Envoyer un message"}
              </h2>
              
              <form className="space-y-6" onSubmit={onSubmit} data-testid="contact-form">
                <div data-testid="contact-field-name">
                  <label 
                    className="block mb-2"
                    style={{ fontSize: '0.65rem', letterSpacing: '0.2em', color: '#8A8680', textTransform: 'uppercase' }}
                    htmlFor="contact-name"
                  >
                    {t(lang, "contact.name")}
                  </label>
                  <input
                    id="contact-name"
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder={lang === "en" ? "Your name" : "Votre nom"}
                    className="w-full px-0 py-4 bg-transparent border-b text-white placeholder:text-[#5A5854] focus:outline-none focus:border-[#E8600A] transition-colors"
                    style={{ borderColor: 'rgba(232, 96, 10, 0.22)', fontSize: '0.9rem' }}
                    data-testid="contact-name-input"
                  />
                </div>

                <div data-testid="contact-field-email">
                  <label 
                    className="block mb-2"
                    style={{ fontSize: '0.65rem', letterSpacing: '0.2em', color: '#8A8680', textTransform: 'uppercase' }}
                    htmlFor="contact-email"
                  >
                    {t(lang, "contact.email")}
                  </label>
                  <input
                    id="contact-email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder={lang === "en" ? "name@email.com" : "nom@email.com"}
                    className="w-full px-0 py-4 bg-transparent border-b text-white placeholder:text-[#5A5854] focus:outline-none focus:border-[#E8600A] transition-colors"
                    style={{ borderColor: 'rgba(232, 96, 10, 0.22)', fontSize: '0.9rem' }}
                    data-testid="contact-email-input"
                  />
                </div>

                <div data-testid="contact-field-phone">
                  <label 
                    className="block mb-2"
                    style={{ fontSize: '0.65rem', letterSpacing: '0.2em', color: '#8A8680', textTransform: 'uppercase' }}
                    htmlFor="contact-phone"
                  >
                    {t(lang, "contact.phone")}
                  </label>
                  <input
                    id="contact-phone"
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder={lang === "en" ? "Optional" : "Optionnel"}
                    className="w-full px-0 py-4 bg-transparent border-b text-white placeholder:text-[#5A5854] focus:outline-none focus:border-[#E8600A] transition-colors"
                    style={{ borderColor: 'rgba(232, 96, 10, 0.22)', fontSize: '0.9rem' }}
                    data-testid="contact-phone-input"
                  />
                </div>

                <div data-testid="contact-field-subject">
                  <label 
                    className="block mb-2"
                    style={{ fontSize: '0.65rem', letterSpacing: '0.2em', color: '#8A8680', textTransform: 'uppercase' }}
                    htmlFor="contact-subject"
                  >
                    {t(lang, "contact.subject")}
                  </label>
                  <input
                    id="contact-subject"
                    type="text"
                    value={subject}
                    onChange={(e) => setSubject(e.target.value)}
                    placeholder={lang === "en" ? "Subject" : "Objet"}
                    className="w-full px-0 py-4 bg-transparent border-b text-white placeholder:text-[#5A5854] focus:outline-none focus:border-[#E8600A] transition-colors"
                    style={{ borderColor: 'rgba(232, 96, 10, 0.22)', fontSize: '0.9rem' }}
                    data-testid="contact-subject-input"
                  />
                </div>

                <div data-testid="contact-field-message">
                  <label 
                    className="block mb-2"
                    style={{ fontSize: '0.65rem', letterSpacing: '0.2em', color: '#8A8680', textTransform: 'uppercase' }}
                    htmlFor="contact-message"
                  >
                    {t(lang, "contact.message")}
                  </label>
                  <textarea
                    id="contact-message"
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder={lang === "en" ? "Tell us about your project..." : "Décris ton projet..."}
                    rows={5}
                    className="w-full px-0 py-4 bg-transparent border-b text-white placeholder:text-[#5A5854] focus:outline-none focus:border-[#E8600A] transition-colors resize-none"
                    style={{ borderColor: 'rgba(232, 96, 10, 0.22)', fontSize: '0.9rem' }}
                    data-testid="contact-message-textarea"
                  />
                </div>

                <button
                  type="submit"
                  disabled={!canSubmit}
                  className="btn-orange mt-8 disabled:opacity-50 disabled:cursor-not-allowed"
                  data-testid="contact-submit-button"
                >
                  {loading ? t(lang, "contact.sending") : t(lang, "contact.submit")}
                </button>
              </form>
            </div>

            {/* Contact Details */}
            <div data-testid="contact-side">
              <h2 
                className="text-white mb-8"
                style={{ fontSize: '1.5rem', fontWeight: 400 }}
                data-testid="contact-details-title"
              >
                {lang === "en" ? "Get in touch" : "Nous contacter"}
              </h2>

              <div className="space-y-8">
                <div data-testid="contact-email-row">
                  <div style={{ fontSize: '0.65rem', letterSpacing: '0.2em', color: '#E8600A', textTransform: 'uppercase', marginBottom: '0.5rem' }}>
                    Email
                  </div>
                  <a
                    href={`mailto:${siteConfig.social.gmail}`}
                    className="text-white hover:text-[#FF8533] transition-colors"
                    style={{ fontSize: '1rem' }}
                    data-testid="contact-email-link"
                  >
                    {siteConfig.social.gmail}
                  </a>
                </div>

                <div data-testid="contact-phone-row">
                  <div style={{ fontSize: '0.65rem', letterSpacing: '0.2em', color: '#E8600A', textTransform: 'uppercase', marginBottom: '0.5rem' }}>
                    {lang === "en" ? "Phone" : "Téléphone"}
                  </div>
                  <div className="flex flex-col gap-1">
                    {siteConfig.social.phones.map((num) => (
                      <a
                        key={num}
                        href={`tel:${num.replace(/\s/g, "")}`}
                        className="text-white hover:text-[#FF8533] transition-colors"
                        style={{ fontSize: '1rem' }}
                        data-testid={`contact-phone-link-${num.replace(/\s/g, "")}`}
                      >
                        {num}
                      </a>
                    ))}
                  </div>
                </div>

                <div data-testid="contact-whatsapp-row">
                  <div style={{ fontSize: '0.65rem', letterSpacing: '0.2em', color: '#E8600A', textTransform: 'uppercase', marginBottom: '0.5rem' }}>
                    WhatsApp
                  </div>
                  <a
                    href={siteConfig.social.whatsapp}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-white hover:text-[#FF8533] transition-colors"
                    style={{ fontSize: '1rem' }}
                    data-testid="contact-whatsapp-link"
                  >
                    {lang === "en" ? "Send a message" : "Envoyer un message"}
                  </a>
                </div>

                <div data-testid="contact-location-row">
                  <div style={{ fontSize: '0.65rem', letterSpacing: '0.2em', color: '#E8600A', textTransform: 'uppercase', marginBottom: '0.5rem' }}>
                    {lang === "en" ? "Region" : "Région"}
                  </div>
                  <div className="text-white" style={{ fontSize: '1rem' }} data-testid="contact-region">
                    {siteConfig.brand.region}
                  </div>
                </div>

                <div data-testid="contact-team-row">
                  <div style={{ fontSize: '0.65rem', letterSpacing: '0.2em', color: '#E8600A', textTransform: 'uppercase', marginBottom: '0.5rem' }}>
                    {lang === "en" ? "Team" : "Équipe"}
                  </div>
                  <div className="text-white" style={{ fontSize: '1rem' }}>
                    {siteConfig.brand.team}
                  </div>
                </div>
              </div>

              {/* Social links */}
              <div className="mt-12 pt-8" style={{ borderTop: '1px solid rgba(232, 96, 10, 0.22)' }}>
                <div style={{ fontSize: '0.65rem', letterSpacing: '0.2em', color: '#E8600A', textTransform: 'uppercase', marginBottom: '1rem' }}>
                  {lang === "en" ? "Follow us" : "Suivez-nous"}
                </div>
                <div className="flex gap-4">
                  {siteConfig.social.facebook && (
                    <a href={siteConfig.social.facebook} target="_blank" rel="noopener noreferrer" className="text-[#8A8680] hover:text-[#E8600A] transition-colors text-sm">Facebook</a>
                  )}
                  {siteConfig.social.instagram && (
                    <a href={siteConfig.social.instagram} target="_blank" rel="noopener noreferrer" className="text-[#8A8680] hover:text-[#E8600A] transition-colors text-sm">Instagram</a>
                  )}
                  {siteConfig.social.tiktok && (
                    <a href={siteConfig.social.tiktok} target="_blank" rel="noopener noreferrer" className="text-[#8A8680] hover:text-[#E8600A] transition-colors text-sm">TikTok</a>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Map Section */}
      <section
        style={{ background: 'var(--dark2)', paddingTop: 0 }}
        data-testid="contact-map-section"
      >
        <div className="max-w-7xl mx-auto">
          <div className="section-label">
            <div className="line" />
            <span>{lang === "en" ? "Find us" : "Nous trouver"}</span>
          </div>

          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-10">
            <h2
              className="text-white"
              style={{ fontSize: 'clamp(1.75rem, 4.5vw, 3rem)', lineHeight: 1.1, fontWeight: 300 }}
              data-testid="contact-map-title"
            >
              {lang === "fr" ? (
                <>Notre <em style={{ fontStyle: 'italic', color: '#FF8533' }}>agence</em></>
              ) : (
                <>Our <em style={{ fontStyle: 'italic', color: '#FF8533' }}>studio</em></>
              )}
            </h2>

            <a
              href={mapDirectionsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-orange shrink-0"
              data-testid="contact-directions-link"
            >
              {lang === "en" ? "Get directions" : "Obtenir l'itinéraire"}
            </a>
          </div>

          <div className="beni-map-frame" data-testid="contact-map">
            <iframe
              title={lang === "en" ? "BENI Architecture location" : "Emplacement BENI Architecture"}
              src={mapEmbedUrl}
              width="100%"
              height="480"
              loading="lazy"
              allowFullScreen
              referrerPolicy="no-referrer-when-downgrade"
              data-testid="contact-map-iframe"
            />
          </div>
        </div>
      </section>
    </div>
  );
}
