import { useState, useRef, useEffect } from 'react';
import ContactStepper from './ContactStepper';

function Contact() {
  const [copyStatus, setCopyStatus] = useState('idle'); // 'idle' | 'copied' | 'error'
  const timerRef = useRef(null);

  useEffect(() => {
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, []);

  const email = 'sriramsridhar29@gmail.com';

  const handleCopy = async () => {
    if (timerRef.current) clearTimeout(timerRef.current);
    try {
      if (navigator.clipboard && window.isSecureContext) {
        await navigator.clipboard.writeText(email);
        setCopyStatus('copied');
      } else {
        // Fallback for older browsers or insecure contexts
        const textarea = document.createElement('textarea');
        textarea.value = email;
        textarea.style.position = 'fixed';
        textarea.style.opacity = '0';
        document.body.appendChild(textarea);
        textarea.focus();
        textarea.select();
        const successful = document.execCommand('copy');
        document.body.removeChild(textarea);
        if (successful) {
          setCopyStatus('copied');
        } else {
          throw new Error('execCommand copy failed');
        }
      }
      timerRef.current = setTimeout(() => setCopyStatus('idle'), 2500);
    } catch {
      setCopyStatus('error');
      timerRef.current = setTimeout(() => setCopyStatus('idle'), 3000);
    }
  };

  return (
    <section id="contact" className="contact reveal-on-scroll">

      <span className="section-label">GET IN TOUCH</span>

      <h2>Ready to press start</h2>

      <p>
        Whether you have an XR simulation project to build, a game developer role to fill,
        or want to discuss immersive technology — my inbox is always open.
      </p>

      {/* Interactive Mission Stepper */}
      <ContactStepper />

      {/* Direct Contact Card */}
      <div className="contact-direct-card">
        <div className="contact-email-capsule">
          <a
            href={`mailto:${email}`}
            className="contact-email-link"
          >
            {email}
          </a>

          <button
            onClick={handleCopy}
            type="button"
            aria-label="Copy email address"
            className={`contact-copy-btn ${copyStatus === 'error' ? 'is-error' : ''} ${copyStatus === 'copied' ? 'is-copied' : ''}`}
          >
            {copyStatus === 'copied' ? 'Copied! ✓' : copyStatus === 'error' ? 'Failed to copy' : 'Copy'}
          </button>
        </div>

        <div className="contact-quick-stats">
          <span>📱 +91 8072938627</span>
          <span>📍 Tamil Nadu, India</span>
          <a
            href="https://sriram-game-dev.itch.io/"
            target="_blank"
            rel="noopener noreferrer"
            className="contact-stat-link"
            title="Browse Playable Games on itch.io"
          >
            <span>🎮 sriram-game-dev.itch.io ↗</span>
          </a>
        </div>
      </div>

      <div className="contact-links">

        {/* Email Icon */}
        <a
          href={`mailto:${email}`}
          aria-label="Email Sriram S"
          title="Send Email"
        >
          <svg viewBox="0 0 24 24" aria-hidden="true">
            <path d="M3 5h18v14H3V5zm2 2v.5l7 5 7-5V7l-7 5-7-5z" />
          </svg>
        </a>

        {/* itch.io */}
        <a
          href="https://sriram-game-dev.itch.io/"
          target="_blank"
          rel="noopener noreferrer"
          aria-label="itch.io Game Portfolio"
          title="itch.io Profile & Games"
        >
          <svg viewBox="0 0 24 24" aria-hidden="true">
            <path d="M2.5 5.5C2.1 6.1 2 7 2 8.3v7.4c0 1.5.8 2.8 2 2.8 1.4 0 2.2-1.2 2.7-2.3.6-1.3 1.2-2.7 1.8-2.7.6 0 1.2 1.4 1.8 2.7.5 1.1 1.3 2.3 2.7 2.3s2.2-1.2 2.7-2.3c.6-1.3 1.2-2.7 1.8-2.7.6 0 1.2 1.4 1.8 2.7.5 1.1 1.3 2.3 2.7 2.3 1.2 0 2-1.3 2-2.8V8.3c0-1.3-.1-2.2-.5-2.8-.7-.9-2.1-.9-3.3-.9H4.8c-1.2 0-1.6 0-2.3.9zM8 8.8c.7 0 1.2.6 1.2 1.2 0 .7-.6 1.2-1.2 1.2s-1.2-.5-1.2-1.2c0-.6.5-1.2 1.2-1.2zm8 0c.7 0 1.2.6 1.2 1.2 0 .7-.5 1.2-1.2 1.2s-1.2-.5-1.2-1.2c0-.6.5-1.2 1.2-1.2z" />
          </svg>
        </a>

        {/* LinkedIn */}
        <a
          href="https://www.linkedin.com/in/sriramsridhar29/"
          target="_blank"
          rel="noopener noreferrer"
          aria-label="LinkedIn Profile"
          title="LinkedIn Profile"
        >
          <svg viewBox="0 0 24 24" aria-hidden="true">
            <path d="M6.5 8.5H3V21h3.5V8.5zM4.75 3C3.65 3 3 3.75 3 4.75S3.65 6.5 4.75 6.5s1.75-.75 1.75-1.75S5.85 3 4.75 3zM21 13.8c0-3.35-1.8-5.3-4.55-5.3-2.1 0-3.05 1.15-3.55 1.95V8.5H9.4V21h3.5v-6.2c0-1.65.3-3.25 2.35-3.25 2.05 0 2.05 1.9 2.05 3.35V21H21v-7.2z" />
          </svg>
        </a>

        {/* GitHub */}
        <a
          href="https://github.com/sriram-game-dev"
          target="_blank"
          rel="noopener noreferrer"
          aria-label="GitHub Profile"
          title="GitHub Profile"
        >
          <svg viewBox="0 0 24 24" aria-hidden="true">
            <path d="M12 2C6.48 2 2 6.58 2 12.24c0 4.53 2.87 8.37 6.84 9.72.5.1.68-.22.68-.49v-1.72c-2.78.62-3.37-1.23-3.37-1.23-.46-1.19-1.11-1.5-1.11-1.5-.91-.64.07-.63.07-.63 1 .07 1.53 1.06 1.53 1.06.9 1.57 2.35 1.12 2.92.86.09-.67.35-1.12.64-1.38-2.22-.26-4.56-1.15-4.56-5.07 0-1.12.39-2.03 1.03-2.75-.1-.26-.45-1.3.1-2.71 0 0 .84-.28 2.75 1.05A9.2 9.2 0 0 1 12 8.1c.85 0 1.7.12 2.5.35 1.91-1.33 2.75-1.05 2.75-1.05.55 1.41.2 2.45.1 2.71.64.72 1.03 1.63 1.03 2.75 0 3.93-2.34 4.8-4.57 5.06.36.32.68.94.68 1.9v2.82c0 .27.18.6.69.49A10.25 10.25 0 0 0 22 12.24C22 6.58 17.52 2 12 2z" />
          </svg>
        </a>

      </div>

    </section>
  );
}

export default Contact;