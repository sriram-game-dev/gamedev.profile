function Footer() {
  return (
    <footer className="site-footer">
      <div className="footer-content">
        <p className="footer-copyright">© 2026 Sriram S. All rights reserved.</p>
        <div className="footer-socials">
          <a
            href="https://sriram-game-dev.itch.io/"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="itch.io Profile"
            title="itch.io — Playable Games"
          >
            itch.io ↗
          </a>
          <span className="footer-dot">•</span>
          <a
            href="https://github.com/sriram-game-dev"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="GitHub Profile"
            title="GitHub Profile"
          >
            GitHub ↗
          </a>
          <span className="footer-dot">•</span>
          <a
            href="https://www.linkedin.com/in/sriramsridhar29/"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="LinkedIn Profile"
            title="LinkedIn Profile"
          >
            LinkedIn ↗
          </a>
        </div>
      </div>
    </footer>
  );
}

export default Footer;