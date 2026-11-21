import { asset } from '../utils/asset';

function Footer() {
  return (
    <footer>
      <div className="footer-content">
        <div className="footer-brand">
          <img
            src={asset('/images/logo.svg')}
            alt="SR Logo"
            className="footer-logo-img"
            width="26"
            height="26"
          />
          <span className="footer-brand-name"><strong>Sriram</strong> S</span>
        </div>
        <p className="footer-copy">© 2026 Sriram S. All rights reserved.</p>
      </div>
    </footer>
  );
}

export default Footer;