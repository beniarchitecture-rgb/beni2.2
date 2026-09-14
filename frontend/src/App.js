import { useEffect, useMemo, useState, useCallback } from "react";
import "@/App.css";

import {
  BrowserRouter,
  NavLink,
  Navigate,
  Outlet,
  Route,
  Routes,
  useNavigate,
} from "react-router-dom";

import { siteConfig } from "@/data/siteConfig";
import {
  getInitialLanguage,
  normalizeLanguage,
  setStoredLanguage,
  t,
} from "@/lib/i18n";

import LanguageSwitch from "@/components/LanguageSwitch";
import MobileMenu from "@/components/MobileMenu";
import ScrollReveal from "@/components/ScrollReveal";

import HomePage from "@/pages/HomePage";
import ProjectsPage from "@/pages/ProjectsPage";
import NewsPage from "@/pages/NewsPage";
import ContactPage from "@/pages/ContactPage";

import VisionPage from "@/pages/VisionPage";
import ArchitecturePage from "@/pages/ArchitecturePage";
import DevelopmentPage from "@/pages/DevelopmentPage";
import ConstructionPage from "@/pages/ConstructionPage";
import ProjectDetailPage from "@/pages/ProjectDetailPage";

import { Toaster } from "@/components/ui/toaster";

import AdminLogin from "@/pages/admin/AdminLogin";
import AdminPanel from "@/pages/admin/AdminPanel";

import { Facebook, Instagram, Mail, Menu, Phone, X } from "lucide-react";

function classNames(...xs) {
  return xs.filter(Boolean).join(" ");
}

// Custom cursor component
function CustomCursor() {
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isHovering, setIsHovering] = useState(false);

  useEffect(() => {
    const moveCursor = (e) => {
      setPosition({ x: e.clientX, y: e.clientY });
    };

    const handleMouseEnter = () => setIsHovering(true);
    const handleMouseLeave = () => setIsHovering(false);

    window.addEventListener('mousemove', moveCursor);

    // Add hover effect for interactive elements
    const interactiveElements = document.querySelectorAll('a, button, [role="button"]');
    interactiveElements.forEach(el => {
      el.addEventListener('mouseenter', handleMouseEnter);
      el.addEventListener('mouseleave', handleMouseLeave);
    });

    return () => {
      window.removeEventListener('mousemove', moveCursor);
      interactiveElements.forEach(el => {
        el.removeEventListener('mouseenter', handleMouseEnter);
        el.removeEventListener('mouseleave', handleMouseLeave);
      });
    };
  }, []);

  return (
    <>
      <div 
        className={classNames("cursor", isHovering && "hover")}
        style={{ left: position.x, top: position.y }}
      />
      <div 
        className={classNames("cursor-ring", isHovering && "hover")}
        style={{ left: position.x, top: position.y }}
      />
    </>
  );
}

// Progress bar component
function ProgressBar() {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const updateProgress = () => {
      const scrollTop = window.scrollY;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      const scrollPercent = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
      setProgress(scrollPercent);
    };

    window.addEventListener('scroll', updateProgress);
    return () => window.removeEventListener('scroll', updateProgress);
  }, []);

  return <div className="progress-bar" style={{ width: `${progress}%` }} />;
}

function SocialIconButton({ href, label, testId, children }) {
  if (!href) return null;
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={label}
      className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-[rgba(232,96,10,0.22)] text-[#8A8680] hover:border-[#E8600A] hover:text-[#E8600A] transition-all duration-300"
      data-testid={testId}
    >
      {children}
    </a>
  );
}

function SiteHeader({ lang, onLangChange }) {
  const navItems = siteConfig.navigation;
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <nav
      className={classNames("beni-nav", scrolled && "scrolled")}
      data-testid="site-header"
    >
      {/* Brand - Left */}
      <NavLink
        to="/"
        className="flex items-center gap-3 shrink-0"
        data-testid="brand-link"
      >
        <img
          src="https://customer-assets.emergentagent.com/job_archvision-28/artifacts/76xi0qsc_LOGO%20FINITION-02.png"
          alt={siteConfig.brand.name}
          className="h-14 w-auto object-contain"
          data-testid="brand-logo"
        />
      </NavLink>

      {/* Navigation - Center */}
      <ul
        className="nav-links hidden lg:flex"
        aria-label="Main navigation"
        data-testid="main-nav"
      >
        {navItems.map((n) => (
          <li key={n.key}>
            <NavLink
              to={n.path}
              className={({ isActive }) => classNames(isActive && "active")}
              data-testid={`nav-link-${n.key}`}
            >
              {t(lang, `nav.${n.key}`, n.key)}
            </NavLink>
          </li>
        ))}
      </ul>

      {/* Actions - Right */}
      <div className="flex items-center gap-4 shrink-0" data-testid="header-actions">
        {/* Mobile menu button */}
        <button
          type="button"
          className="inline-flex h-10 w-10 items-center justify-center text-[#8A8680] hover:text-[#E8600A] lg:hidden transition-colors"
          onClick={() => setMobileOpen(true)}
          data-testid="mobile-menu-open"
          aria-label="Open menu"
        >
          <Menu className="h-6 w-6" />
        </button>

        <LanguageSwitch value={lang} onChange={onLangChange} />
      </div>

      <MobileMenu
        open={mobileOpen}
        onOpenChange={setMobileOpen}
        items={navItems}
        renderLabel={(key) => t(lang, `nav.${key}`, key)}
      />
    </nav>
  );
}

function SiteFooter({ lang }) {
  const socials = useMemo(() => {
    const gmail = siteConfig.social.gmail?.trim();
    return {
      facebook: siteConfig.social.facebook?.trim(),
      instagram: siteConfig.social.instagram?.trim(),
      tiktok: siteConfig.social.tiktok?.trim(),
      x: siteConfig.social.x?.trim(),
      whatsapp: siteConfig.social.whatsapp?.trim(),
      gmail: gmail ? `mailto:${gmail}` : "",
    };
  }, []);

  return (
    <footer className="beni-footer" data-testid="site-footer">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          {/* Brand */}
          <div>
            <img
              src="https://customer-assets.emergentagent.com/job_archvision-28/artifacts/76xi0qsc_LOGO%20FINITION-02.png"
              alt={siteConfig.brand.name}
              className="h-16 w-auto object-contain mb-6"
              data-testid="footer-logo"
            />
            <p className="text-[0.8rem] text-[#8A8680] leading-relaxed max-w-xs">
              {lang === "en"
                ? "Premium contemporary architecture rooted in local African context with an international outlook."
                : "Architecture contemporaine premium ancrée dans le contexte africain local avec une vision internationale."}
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-[0.65rem] tracking-[0.3em] uppercase text-[#E8600A] mb-6 font-normal" style={{ fontFamily: "'Outfit', sans-serif" }}>
              {lang === "en" ? "Quick Links" : "Liens Rapides"}
            </h4>
            <ul className="space-y-3">
              {siteConfig.navigation.slice(0, 4).map((n) => (
                <li key={n.key}>
                  <NavLink
                    to={n.path}
                    className="text-[0.75rem] text-[#8A8680] hover:text-[#E8600A] transition-colors tracking-wider uppercase"
                    style={{ fontFamily: "'Outfit', sans-serif" }}
                  >
                    {t(lang, `nav.${n.key}`, n.key)}
                  </NavLink>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact & Social */}
          <div>
            <h4 className="text-[0.65rem] tracking-[0.3em] uppercase text-[#E8600A] mb-6 font-normal" style={{ fontFamily: "'Outfit', sans-serif" }}>
              {lang === "en" ? "Connect" : "Connectez-vous"}
            </h4>
            <div className="flex flex-wrap gap-3 mb-6" data-testid="footer-social-links">
              <SocialIconButton href={socials.facebook} label="Facebook" testId="social-facebook">
                <Facebook className="h-4 w-4" />
              </SocialIconButton>
              <SocialIconButton href={socials.instagram} label="Instagram" testId="social-instagram">
                <Instagram className="h-4 w-4" />
              </SocialIconButton>
              <SocialIconButton href={socials.x} label="X" testId="social-x">
                <X className="h-4 w-4" />
              </SocialIconButton>
              <SocialIconButton href={socials.whatsapp} label="WhatsApp" testId="social-whatsapp">
                <Phone className="h-4 w-4" />
              </SocialIconButton>
              <SocialIconButton href={socials.gmail} label="Email" testId="social-gmail">
                <Mail className="h-4 w-4" />
              </SocialIconButton>
            </div>
            <p className="text-[0.7rem] text-[#5A5854]" style={{ fontFamily: "'Outfit', sans-serif" }}>
              {siteConfig.social.gmail}
            </p>
          </div>
        </div>

        <div className="mt-12 pt-6 border-t border-[rgba(232,96,10,0.22)]">
          <p className="text-[0.65rem] text-[#5A5854] tracking-wider" style={{ fontFamily: "'Outfit', sans-serif" }} data-testid="footer-copyright">
            © {new Date().getFullYear()} {siteConfig.brand.name}. {lang === "en" ? "All rights reserved." : "Tous droits réservés."}
          </p>
        </div>
      </div>
    </footer>
  );
}

function Layout({ lang, setLang }) {
  return (
    <div
      className="min-h-screen"
      style={{ background: 'var(--dark)' }}
      data-testid="app-shell"
    >
      <CustomCursor />
      <ProgressBar />
      <ScrollReveal />

      <SiteHeader
        lang={lang}
        onLangChange={(l) => setLang(normalizeLanguage(l))}
      />

      <main data-testid="site-main">
        <Outlet />
      </main>

      <SiteFooter lang={lang} />
      <Toaster />
    </div>
  );
}

function HomeRoute({ lang }) {
  const navigate = useNavigate();
  return (
    <HomePage
      lang={lang}
      onNavigateProjects={() => navigate("/projets")}
      onNavigateContact={() => navigate("/contact")}
    />
  );
}

export default function App() {
  const [lang, setLang] = useState(getInitialLanguage());

  useEffect(() => {
    setStoredLanguage(lang);
  }, [lang]);

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/admin/login" element={<AdminLogin />} />
        <Route path="/admin" element={<AdminPanel />} />
        <Route element={<Layout lang={lang} setLang={setLang} />}>
          <Route index element={<HomeRoute lang={lang} />} />

          {/* Reference-inspired navigation structure */}
          <Route path="/vision" element={<VisionPage lang={lang} />} />
          <Route path="/architecture" element={<ArchitecturePage lang={lang} />} />
          <Route path="/developpement" element={<DevelopmentPage lang={lang} />} />
          <Route path="/construction" element={<ConstructionPage lang={lang} />} />

          {/* Portfolio */}
          <Route path="/projets" element={<ProjectsPage lang={lang} />} />
          <Route path="/projets/:projectId" element={<ProjectDetailPage lang={lang} />} />

          {/* News + contact */}
          <Route path="/actualites" element={<NewsPage lang={lang} />} />
          <Route path="/contact" element={<ContactPage lang={lang} />} />

          <Route path="*" element={<Navigate to="/" replace />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
