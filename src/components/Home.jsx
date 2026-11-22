import { useEffect, useState } from "react";
import { route } from "../utils/asset";
import HeroCanvasToy from "./HeroCanvasToy";

const WHAT_I_DO = [
  { id: 'games', label: 'Games', icon: '🎮' },
  { id: 'game-design', label: 'Game Design', icon: '🎲' },
  { id: 'xr', label: 'XR', icon: '🥽' },
  { id: 'industrial', label: 'Industrial Training', icon: '🏭' }
];

const checkReducedMotion = () =>
  typeof window !== 'undefined' &&
  window.matchMedia('(prefers-reduced-motion: reduce)').matches;

function Home() {
  const isReduced = checkReducedMotion();
  const [text, setText] = useState(() => (isReduced ? "Game Developer" : "Gamer"));
  const [phase, setPhase] = useState(() => (isReduced ? "done" : "idle"));
  const [showCursor, setShowCursor] = useState(true);
  const [activeIndex, setActiveIndex] = useState(3); // Defaults to Industrial Training active as in reference image

  // Automatic spotlight cycle through "What I do" specialties
  useEffect(() => {
    if (checkReducedMotion()) return;

    const cycleTimer = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % WHAT_I_DO.length);
    }, 3000);

    return () => clearInterval(cycleTimer);
  }, []);

  useEffect(() => {
    if (checkReducedMotion()) return;

    // Initial pause showing "Gamer" before starting transition
    const initialTimer = setTimeout(() => {
      setPhase("backspace");
    }, 1800);

    return () => clearTimeout(initialTimer);
  }, []);

  useEffect(() => {
    if (phase === "backspace") {
      let current = "Gamer";
      let delayTimer;

      const timer = setInterval(() => {
        current = current.slice(0, -1);
        setText(current);

        if (current === "") {
          clearInterval(timer);

          delayTimer = setTimeout(() => {
            setPhase("typing");
          }, 450);
        }
      }, 75);

      return () => {
        clearInterval(timer);
        if (delayTimer) clearTimeout(delayTimer);
      };
    }

    if (phase === "typing") {
      const target = "Game Developer";
      let index = 0;

      const timer = setInterval(() => {
        index++;
        setText(target.slice(0, index));

        if (index === target.length) {
          clearInterval(timer);
          setPhase("done");
          setShowCursor(true);
        }
      }, 70);

      return () => clearInterval(timer);
    }
  }, [phase]);

  return (
    <section className="home" id="home">
      {/* Ambient Lighting Accents */}
      <div className="hero-ambient-glow hero-ambient-glow--topleft" aria-hidden="true" />
      <div className="hero-ambient-glow hero-ambient-glow--topright" aria-hidden="true" />

      {/* Interactive Physics & Geometric Particles Canvas */}
      <HeroCanvasToy />

      {/* CENTRAL HOLOGRAPHIC FROSTED GLASS HERO CARD */}
      <div className="hero-glass-card">
        <h1 className="hero-card-title">SRIRAM S</h1>

        {/* Code Terminal Identity Pill */}
        <div className="hero-terminal-pill">
          <code>
            <span className="syntax-fn">player</span>.<span className="syntax-keyword">identity</span><span className="syntax-op"> = </span>&quot;<span className="syntax-string">{text}</span>&quot;
            {showCursor && <span className="typing-cursor">|</span>}
          </code>
        </div>

        {/* Action Buttons Row */}
        <div className="hero-card-actions">
          <a
            href={route('/#projects')}
            className="hero-btn-primary"
            onClick={(e) => {
              e.preventDefault();
              document.getElementById('projects')?.scrollIntoView({ behavior: 'smooth' });
            }}
          >
            <span>Explore Quests</span>
            <span className="btn-arrow" aria-hidden="true">→</span>
          </a>
          <a
            href={route('/#contact')}
            className="hero-btn-secondary"
            onClick={(e) => {
              e.preventDefault();
              document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' });
            }}
          >
            <span>Connect</span>
            <span className="btn-sparkle" aria-hidden="true">✦</span>
          </a>
        </div>
      </div>

      {/* WHAT I DO DOCK (Matching Reference Image) */}
      <div className="what-i-do-container" aria-label="What I do">
        <div className="what-i-do-divider">
          <span className="divider-line" aria-hidden="true" />
          <span className="divider-label">WHAT I DO:</span>
          <span className="divider-line" aria-hidden="true" />
        </div>
        <div className="what-i-do-pills">
          {WHAT_I_DO.map((area, index) => (
            <button
              type="button"
              key={area.id}
              onClick={() => setActiveIndex(index)}
              className={`what-i-do-pill ${activeIndex === index ? 'active' : ''}`}
              aria-pressed={activeIndex === index}
            >
              <span className="pill-icon" aria-hidden="true">{area.icon}</span>
              <span className="pill-label">{area.label}</span>
            </button>
          ))}
        </div>
      </div>

    </section>
  );
}

export default Home;
