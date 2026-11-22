import { useEffect, useState } from 'react';
import { normalizePath, route } from '../utils/asset';

function NavBar() {
  const [showGoTop, setShowGoTop] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [activeSection, setActiveSection] = useState('home');
  const [currentPath, setCurrentPath] = useState(
    normalizePath(window.location.pathname)
  );

  const isHomePage = currentPath === '/';

  /* Track path changes reactively */
  useEffect(() => {
    const handlePopState = () => {
      setCurrentPath(normalizePath(window.location.pathname));
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  /* Scroll handling & active section detection */
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 25);

      const nearBottom =
        window.innerHeight + window.scrollY >=
        document.documentElement.scrollHeight - 200;

      setShowGoTop(nearBottom);

      const sections = ['home', 'about', 'experience', 'skills', 'resume', 'contact'];
      for (const s of sections) {
        const el = document.getElementById(s);
        if (el) {
          const rect = el.getBoundingClientRect();
          if (rect.top <= 200 && rect.bottom >= 150) {
            setActiveSection(s);
            break;
          }
        }
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  /* Close mobile menu on desktop resize */
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth > 900) {
        setMenuOpen(false);
      }
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  /* Navigation handling */
  const handleSectionClick = (event, section) => {
    event.preventDefault();
    setMenuOpen(false);

    const targetUrl = `${route('/')}#${section}`;

    if (isHomePage) {
      const element = document.getElementById(section);
      if (element) {
        element.scrollIntoView({
          behavior: 'smooth',
          block: 'start'
        });
        window.history.pushState(null, '', targetUrl);
      }
      return;
    }

    window.history.pushState(null, '', targetUrl);
    window.dispatchEvent(new PopStateEvent('popstate'));

    setTimeout(() => {
      const element = document.getElementById(section);
      if (element) {
        element.scrollIntoView({
          behavior: 'smooth',
          block: 'start'
        });
      }
    }, 120);
  };

  /* Logo click */
  const handleLogoClick = (event) => {
    event.preventDefault();
    setMenuOpen(false);

    const homeUrl = route('/');

    if (isHomePage) {
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
      window.history.pushState(null, '', homeUrl);
      return;
    }

    window.history.pushState(null, '', homeUrl);
    window.dispatchEvent(new PopStateEvent('popstate'));

    setTimeout(() => {
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    }, 100);
  };

  return (
    <header className={`navbar ${scrolled ? 'navbar--scrolled' : ''}`}>
      <div className="navbar-inner">

        {/* LOGO (Matching Reference: "Sriram S" + glowing "DEV_READY" pill) */}
        <div className="logo-container">
          <a
            href={route('/')}
            className="logo gerlogu-brand"
            onClick={handleLogoClick}
          >
            <span className="brand-name">
              Sriram S
            </span>
          </a>
          <div className="studio-status-pill" title="Game Developer - Ready for Opportunities">
            <span className="status-dot"></span>
            <span>DEV_READY</span>
          </div>
        </div>

        {/* DESKTOP NAV LINKS (CENTERED, CLEAN TYPOGRAPHY WITH ORANGE ACTIVE UNDERLINE) */}
        <nav className="nav-links desktop-nav" aria-label="Primary navigation">
          <a
            href={route('/#home')}
            className={`nav-item ${activeSection === 'home' ? 'nav-item--active' : ''}`}
            onClick={(event) => handleSectionClick(event, 'home')}
          >
            <span>HOME</span>
          </a>

          <a
            href={route('/#about')}
            className={`nav-item ${activeSection === 'about' ? 'nav-item--active' : ''}`}
            onClick={(event) => handleSectionClick(event, 'about')}
          >
            <span>ABOUT</span>
          </a>

          <a
            href={route('/#experience')}
            className={`nav-item ${activeSection === 'experience' ? 'nav-item--active' : ''}`}
            onClick={(event) => handleSectionClick(event, 'experience')}
          >
            <span>EXPERIENCE</span>
          </a>

          <a
            href={route('/#skills')}
            className={`nav-item ${activeSection === 'skills' ? 'nav-item--active' : ''}`}
            onClick={(event) => handleSectionClick(event, 'skills')}
          >
            <span>SKILLS</span>
          </a>

          <a
            href={route('/#resume')}
            className={`nav-item ${activeSection === 'resume' ? 'nav-item--active' : ''}`}
            onClick={(event) => handleSectionClick(event, 'resume')}
          >
            <span>RESUME</span>
          </a>

          <a
            href={route('/#contact')}
            className={`nav-item ${activeSection === 'contact' ? 'nav-item--active' : ''}`}
            onClick={(event) => handleSectionClick(event, 'contact')}
          >
            <span>CONTACT</span>
          </a>

          <a
            href="https://github.com/sriram-game-dev"
            target="_blank"
            rel="noopener noreferrer"
            className="nav-item nav-item--external"
          >
            <span>GITHUB</span>
            <svg className="external-arrow" viewBox="0 0 24 24" width="11" height="11" fill="none" stroke="currentColor" strokeWidth="2.2" aria-hidden="true">
              <path d="M7 17L17 7M17 7H7M17 7V17" />
            </svg>
          </a>
        </nav>

        {/* RIGHT SIDE: GLOWING AMBER/ORANGE PORTFOLIO BUTTON & MOBILE TOGGLE */}
        <div className="navbar-right">
          <a
            href={route('/#projects')}
            onClick={(event) => handleSectionClick(event, 'projects')}
            className="nav-portfolio-pill"
            aria-label="Explore Portfolio"
          >
            <svg className="nav-portfolio-icon" viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <path d="M4 20h16a2 2 0 0 0 2-2V8a2 2 0 0 0-2-2h-7.93a2 2 0 0 1-1.66-.9l-.82-1.2A2 2 0 0 0 7.93 3H4a2 2 0 0 0-2 2v13c0 1.1.9 2 2 2Z" />
            </svg>
            <span>PORTFOLIO</span>
          </a>

          {/* HAMBURGER TOGGLE FOR MOBILE/TABLET */}
          <button
            className={`mobile-menu-toggle ${menuOpen ? 'is-active' : ''}`}
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label={menuOpen ? "Close navigation menu" : "Open navigation menu"}
            aria-expanded={menuOpen}
            type="button"
          >
            <span className="hamburger-bar"></span>
            <span className="hamburger-bar"></span>
            <span className="hamburger-bar"></span>
          </button>
        </div>

      </div>

      {/* MOBILE DROPDOWN DRAWER */}
      <div className={`mobile-nav-drawer ${menuOpen ? 'drawer-open' : ''}`}>
        <nav className="mobile-nav-links" aria-label="Mobile navigation">
          <a
            href={route('/#home')}
            className="mobile-nav-item"
            onClick={(event) => handleSectionClick(event, 'home')}
          >
            <span>Home</span>
          </a>
          <a
            href={route('/#about')}
            className="mobile-nav-item"
            onClick={(event) => handleSectionClick(event, 'about')}
          >
            <span>About</span>
          </a>
          <a
            href={route('/#experience')}
            className="mobile-nav-item"
            onClick={(event) => handleSectionClick(event, 'experience')}
          >
            <span>Experience</span>
          </a>
          <a
            href={route('/#projects')}
            className="mobile-nav-item"
            onClick={(event) => handleSectionClick(event, 'projects')}
          >
            <span>Projects</span>
          </a>
          <a
            href={route('/#skills')}
            className="mobile-nav-item"
            onClick={(event) => handleSectionClick(event, 'skills')}
          >
            <span>Skills</span>
          </a>
          <a
            href={route('/#resume')}
            className="mobile-nav-item"
            onClick={(event) => handleSectionClick(event, 'resume')}
          >
            <span>Resume</span>
          </a>
          <a
            href={route('/#contact')}
            className="mobile-nav-item"
            onClick={(event) => handleSectionClick(event, 'contact')}
          >
            <span>Contact</span>
          </a>
          <a
            href="https://github.com/sriram-game-dev"
            target="_blank"
            rel="noopener noreferrer"
            className="mobile-nav-item mobile-nav-item--external"
          >
            <span>GitHub</span>
            <svg viewBox="0 0 24 24" width="12" height="12" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
              <path d="M7 17L17 7M17 7H7M17 7V17" />
            </svg>
          </a>

          <div className="mobile-cta-wrapper">
            <button
              className="nav-game-button mobile-cta-btn"
              type="button"
              onClick={(event) => handleSectionClick(event, 'projects')}
            >
              <span className="btn-shape">
                <span className="btn-skew-slide"></span>
                <span className="btn-text">EXPLORE PORTFOLIO</span>
              </span>
            </button>
          </div>
        </nav>
      </div>

      {/* GO TO TOP */}
      {showGoTop && (
        <button
          className="go-top"
          onClick={() => {
            window.scrollTo({
              top: 0,
              behavior: 'smooth'
            });
          }}
          aria-label="Scroll to top"
        >
          ↑ <span>GO TO TOP</span>
        </button>
      )}

    </header>
  );
}

export default NavBar;