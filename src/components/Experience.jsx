import { useState, useEffect, useRef } from "react";
import { route } from "../utils/asset";

function Experience() {
  const [popup, setPopup] = useState(null);
  const timelineRef = useRef(null);
  const beamRef = useRef(null);
  const sparkRef = useRef(null);
  const itemRefs = useRef([]);

  // Scroll-driven energy beam & card reveal animation (Gerlogu style)
  useEffect(() => {
    let ticking = false;

    const updateBeam = () => {
      if (!timelineRef.current) return;
      const rect = timelineRef.current.getBoundingClientRect();
      const windowHeight = window.innerHeight;

      // Active beam trigger line at 65% of viewport
      const triggerY = windowHeight * 0.65;
      const startY = rect.top;
      const totalHeight = rect.height;

      // Calculate beam progress [0, 1]
      const distance = triggerY - startY;
      const progress = Math.min(Math.max(distance / totalHeight, 0), 1);

      if (beamRef.current) {
        beamRef.current.style.height = `${progress * 100}%`;
      }
      if (sparkRef.current) {
        sparkRef.current.style.top = `${progress * 100}%`;
        sparkRef.current.style.opacity = (progress > 0.01 && progress < 0.99) ? "1" : "0";
      }

      // Check each milestone item for viewport reveal (in-view) and beam energizing (node-energized)
      itemRefs.current.forEach((el) => {
        if (!el) return;
        const itemRect = el.getBoundingClientRect();

        // Reveal card smoothly as it enters bottom 85% of screen
        const isInView = windowHeight * 0.85 >= itemRect.top;
        el.classList.toggle("in-view", isInView);

        // Energize dot when the active beam tip reaches it
        const isPassed = triggerY >= itemRect.top + 24;
        el.classList.toggle("node-energized", isPassed);
      });
    };

    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          updateBeam();
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    window.addEventListener("resize", handleScroll);
    updateBeam();

    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("resize", handleScroll);
    };
  }, []);

  const handleOpenPopup = (type) => {
    setPopup(type);
  };

  const handleClosePopup = () => {
    setPopup(null);
  };

  useEffect(() => {
    if (!popup) return;
    const handleKeyDown = (e) => {
      if (e.key === "Escape") {
        handleClosePopup();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [popup]);

  return (
    <section id="experience" className="experience backstory-section">

      {/* FLOATING AMBIENT PARTICLES (GERLOGU STYLE) */}
      <div className="backstory-particles" aria-hidden="true">
        <span className="particle p1"></span>
        <span className="particle p2"></span>
        <span className="particle p3"></span>
        <span className="particle p4"></span>
        <span className="particle p5"></span>
        <span className="particle p6"></span>
        <span className="particle p7"></span>
        <span className="particle p8"></span>
      </div>

      {/* SECTION HEADER (GERLOGU STYLE) */}
      <div className="experience-header reveal-on-scroll">
        <span className="section-label">CAREER &amp; JOURNEY</span>
        <h2 className="experience-heading">My Backstory</h2>
        <div className="experience-header-line"></div>
      </div>

      {/* TIMELINE CONTAINER */}
      <div className="experience-content reveal-on-scroll reveal-delay-1">

        <div className="experience-timeline" ref={timelineRef}>

          {/* Static track */}
          <div className="experience-line experience-line-track" aria-hidden="true"></div>

          {/* Glowing dynamic scroll beam */}
          <div className="experience-line-beam" ref={beamRef} aria-hidden="true">
            <div className="experience-beam-spark" ref={sparkRef}></div>
          </div>

          {/* ========================================
              ENTRY 1 - JUNIOR ENGINEER (XR DEV) [RIGHT]
          ======================================== */}
          <div
            className="experience-item experience-right"
            ref={(el) => { itemRefs.current[0] = el; }}
          >
            <div className="experience-dot" aria-hidden="true">
              <span className="dot-pulse"></span>
              <span className="dot-energy-ring"></span>
            </div>

            <div className="experience-details backstory-card">
              <div className="card-badge-row">
                <span className="backstory-role-tag">PRODUCTION ROLE</span>
                <span className="experience-year">2024 – 2026</span>
              </div>

              <h2>Junior Engineer (XR Development)</h2>

              <p className="experience-company">
                Hema Enterprises (HEPL) · Digifox Studio
              </p>

              <p className="experience-description">
                Developed and delivered production-grade VR, AR, and MR interactive simulations
                in Unity &amp; C#. Built modular gameplay systems, spatial interfaces, and
                high-fidelity environments across Meta Quest, Android, and PC platforms.
              </p>

              {/* TECH PILLS */}
              <div className="backstory-tech-tags">
                <span>Unity 3D</span>
                <span>C# OOP</span>
                <span>Meta Quest</span>
                <span>XR Interaction Toolkit</span>
                <span>VR Optimization</span>
              </div>

              {/* GERLOGU PILL BUTTON */}
              <button
                type="button"
                className="backstory-rayen-btn"
                onClick={() => handleOpenPopup("work")}
                aria-label="View details for Junior Engineer XR Development"
              >
                <span className="btn-inner">
                  <span className="btn-icon">
                    <svg viewBox="0 0 24 24" width="14" height="14" fill="currentColor">
                      <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-6h2v6zm0-8h-2V7h2v2z"/>
                    </svg>
                  </span>
                  <span className="btn-text">View Details</span>
                  <span className="btn-arrow">➜</span>
                </span>
              </button>
            </div>
          </div>

          {/* ========================================
              ENTRY 2 - INDEPENDENT GAME DEVELOPER [LEFT]
          ======================================== */}
          <div
            className="experience-item experience-left"
            ref={(el) => { itemRefs.current[1] = el; }}
          >
            <div className="experience-dot" aria-hidden="true">
              <span className="dot-pulse"></span>
              <span className="dot-energy-ring"></span>
            </div>

            <div className="experience-details backstory-card">
              <div className="card-badge-row">
                <span className="backstory-role-tag">GAME DEV &amp; R&amp;D</span>
                <span className="experience-year">2023 – Present</span>
              </div>

              <h2>Independent Game Developer</h2>

              <p className="experience-company">
                Personal Projects &amp; Gameplay Prototyping
              </p>

              <p className="experience-description">
                Designing and programming original gameplay mechanics, state machines,
                physics-driven movement controllers, and real-time interaction systems.
                Rapidly turning concept art and game design documents into playable titles.
              </p>

              {/* TECH PILLS */}
              <div className="backstory-tech-tags">
                <span>Gameplay Systems</span>
                <span>State Machines</span>
                <span>3D Physics</span>
                <span>Rapid Prototyping</span>
              </div>

              {/* GERLOGU PILL BUTTON */}
              <button
                type="button"
                className="backstory-rayen-btn"
                onClick={() => handleOpenPopup("personal")}
                aria-label="View details for Independent Game Developer"
              >
                <span className="btn-inner">
                  <span className="btn-icon">
                    <svg viewBox="0 0 24 24" width="14" height="14" fill="currentColor">
                      <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-6h2v6zm0-8h-2V7h2v2z"/>
                    </svg>
                  </span>
                  <span className="btn-text">View Details</span>
                  <span className="btn-arrow">➜</span>
                </span>
              </button>
            </div>
          </div>

          {/* ========================================
              ENTRY 3 - 3D GAME SYSTEMS & TOOLS [RIGHT]
          ======================================== */}
          <div
            className="experience-item experience-right"
            ref={(el) => { itemRefs.current[2] = el; }}
          >
            <div className="experience-dot" aria-hidden="true">
              <span className="dot-pulse"></span>
              <span className="dot-energy-ring"></span>
            </div>

            <div className="experience-details backstory-card">
              <div className="card-badge-row">
                <span className="backstory-role-tag">SYSTEMS &amp; ARCHITECTURE</span>
                <span className="experience-year">2023 – 2024</span>
              </div>

              <h2>3D Game Systems &amp; Tools Development</h2>

              <p className="experience-company">
                Unity Engine &amp; C# Architecture R&amp;D
              </p>

              <p className="experience-description">
                Engineered custom character controllers, combat encounters, camera framing systems
                with Cinemachine, and modular enemy AI logic for responsive, juice-filled real-time prototypes.
              </p>

              {/* TECH PILLS */}
              <div className="backstory-tech-tags">
                <span>Combat Design</span>
                <span>Cinemachine</span>
                <span>Enemy AI</span>
                <span>Custom Controllers</span>
                <span>Game Juice</span>
              </div>

              {/* GERLOGU PILL BUTTON */}
              <button
                type="button"
                className="backstory-rayen-btn"
                onClick={() => handleOpenPopup("systems")}
                aria-label="View details for 3D Game Systems and Tools"
              >
                <span className="btn-inner">
                  <span className="btn-icon">
                    <svg viewBox="0 0 24 24" width="14" height="14" fill="currentColor">
                      <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-6h2v6zm0-8h-2V7h2v2z"/>
                    </svg>
                  </span>
                  <span className="btn-text">View Details</span>
                  <span className="btn-arrow">➜</span>
                </span>
              </button>
            </div>
          </div>

          {/* ========================================
              ENTRY 4 - VISUAL DEVELOPMENT & ASSETS [LEFT]
          ======================================== */}
          <div
            className="experience-item experience-left"
            ref={(el) => { itemRefs.current[3] = el; }}
          >
            <div className="experience-dot" aria-hidden="true">
              <span className="dot-pulse"></span>
              <span className="dot-energy-ring"></span>
            </div>

            <div className="experience-details backstory-card">
              <div className="card-badge-row">
                <span className="backstory-role-tag">CREATIVE FOUNDATION</span>
                <span className="experience-year">2022 – 2023</span>
              </div>

              <h2>Visual Development &amp; Concept Pipelines</h2>

              <p className="experience-company">
                IMAGE Creative Education · Digital Arts
              </p>

              <p className="experience-description">
                Specialized in 2D/3D concept pipelines, digital asset workflows in Adobe Photoshop,
                and core Unity game loop fundamentals with real-time particle effects and visual staging.
              </p>

              {/* TECH PILLS */}
              <div className="backstory-tech-tags">
                <span>Adobe Photoshop</span>
                <span>Concept Art</span>
                <span>Asset Pipelines</span>
                <span>Particle VFX</span>
                <span>Level Staging</span>
              </div>

              {/* GERLOGU PILL BUTTON */}
              <button
                type="button"
                className="backstory-rayen-btn"
                onClick={() => handleOpenPopup("visual")}
                aria-label="View details for Visual Development and Concept Pipelines"
              >
                <span className="btn-inner">
                  <span className="btn-icon">
                    <svg viewBox="0 0 24 24" width="14" height="14" fill="currentColor">
                      <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-6h2v6zm0-8h-2V7h2v2z"/>
                    </svg>
                  </span>
                  <span className="btn-text">View Details</span>
                  <span className="btn-arrow">➜</span>
                </span>
              </button>
            </div>
          </div>

        </div>

      </div>

      {/* ========================================
          POPUP 1: WORK EXPERIENCE MODAL
      ======================================== */}
      {popup === "work" && (
        <div
          className="experience-popup-overlay"
          onClick={handleClosePopup}
          role="dialog"
          aria-modal="true"
          aria-label="Junior Engineer XR Development experience"
        >
          <div className="experience-popup" onClick={(e) => e.stopPropagation()}>
            <button
              type="button"
              className="experience-popup-close"
              onClick={handleClosePopup}
              aria-label="Close work experience"
            >
              ×
            </button>

            <h2>Junior Engineer (XR Development)</h2>

            <p className="experience-popup-company">
              Hema Enterprises Private Limited · Digifox Studio
              <span className="experience-popup-year">(2024 – 2026)</span>
            </p>

            <div className="experience-popup-header-line"></div>

            <div className="experience-popup-content">
              <h3>Role Overview</h3>
              <p>
                Worked at HEPL as a Junior Engineer within Digifox Studio, specializing in Unity and C# development.
                Architected and deployed VR, AR, and MR applications, delivering gameplay systems, interactive simulation
                scenarios, intuitive user interfaces, and immersive spatial mechanics across PC, Android, and Meta Quest headsets.
              </p>

              <h3>Core Responsibilities &amp; Impact</h3>
              <ul>
                <li>Developed interactive simulation modules using Unity C# with high-performance standards.</li>
                <li>Implemented gameplay mechanics, UI/UX flows, animation timelines, VFX, audio, and live-operations systems.</li>
                <li>Leveraged modern AI tools for coding, debugging, automated testing, and rapid prototyping.</li>
                <li>Collaborated seamlessly with 3D artists, UI/UX designers, backend engineers, and QA teams.</li>
                <li>Profiled and optimized standalone VR scenes to maintain 72–90 FPS framerate targets.</li>
                <li>Engineered cross-platform deployments tailored for Meta Quest 2/3/Pro, Android, and PC.</li>
              </ul>

              <div className="popup-footer-actions">
                <a
                  href="#projects"
                  className="popup-cta-btn"
                  onClick={() => {
                    handleClosePopup();
                    document.getElementById("projects")?.scrollIntoView({ behavior: "smooth" });
                  }}
                >
                  View Related Projects ➜
                </a>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ========================================
          POPUP 2: PERSONAL PROJECTS & PROTOTYPING
      ======================================== */}
      {popup === "personal" && (
        <div
          className="experience-popup-overlay"
          onClick={handleClosePopup}
          role="dialog"
          aria-modal="true"
          aria-label="Independent Game Developer background"
        >
          <div className="experience-popup" onClick={(e) => e.stopPropagation()}>
            <button
              type="button"
              className="experience-popup-close"
              onClick={handleClosePopup}
              aria-label="Close personal projects"
            >
              ×
            </button>

            <h2>Independent Game Developer</h2>

            <p className="experience-popup-company">
              Personal Projects &amp; Gameplay R&amp;D
              <span className="experience-popup-year">(2023 – Present)</span>
            </p>

            <div className="experience-popup-header-line"></div>

            <div className="experience-popup-content">
              <h3>Philosophy &amp; Focus</h3>
              <p>
                Driven by a love for indie game craft and mechanical depth. I design and build playable prototypes
                focusing on tight controls, responsive player feedback, custom character controllers, and modular architecture.
              </p>

              <h3>Key Highlights</h3>
              <ul>
                <li>Designed original mechanics from concept to playable vertical slices in Unity.</li>
                <li>Authored modular state machines for enemy AI, player movement, and ability systems.</li>
                <li>Experimented with procedural generation, physics-based interactions, and custom shaders.</li>
                <li>Explored gameplay feel, game juice, screen shake, hit pause, and particle feedback loops.</li>
                <li>Prepared builds for WebGL and PC standalone distribution on itch.io and GitHub.</li>
              </ul>

              <div className="popup-footer-actions">
                <a
                  href={route('/#projects')}
                  className="popup-cta-btn"
                  onClick={() => {
                    handleClosePopup();
                    document.getElementById("projects")?.scrollIntoView({ behavior: "smooth" });
                  }}
                >
                  Browse Game Projects ➜
                </a>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ========================================
          POPUP 3: 3D GAME SYSTEMS & TOOLS
      ======================================== */}
      {popup === "systems" && (
        <div
          className="experience-popup-overlay"
          onClick={handleClosePopup}
          role="dialog"
          aria-modal="true"
          aria-label="3D Game Systems and Tools development"
        >
          <div className="experience-popup" onClick={(e) => e.stopPropagation()}>
            <button
              type="button"
              className="experience-popup-close"
              onClick={handleClosePopup}
              aria-label="Close game systems details"
            >
              ×
            </button>

            <h2>3D Game Systems &amp; Tools Development</h2>

            <p className="experience-popup-company">
              Independent Systems Prototyping &amp; Architecture
              <span className="experience-popup-year">(2023 – 2024)</span>
            </p>

            <div className="experience-popup-header-line"></div>

            <div className="experience-popup-content">
              <h3>Systems Focus</h3>
              <p>
                Focused on architecting scalable gameplay architecture, decoupling gameplay events,
                and building expressive player combat feedback.
              </p>

              <h3>Key Engineering Highlights</h3>
              <ul>
                <li>Implemented custom kinematics and collision resolution for responsive 3D character control.</li>
                <li>Created scriptable object architectures for modular weapon data, inventory, and combat moves.</li>
                <li>Integrated Cinemachine impulse listeners, screenshake, dynamic FOV adjustments, and hit-stop pauses.</li>
                <li>Built finite state machines (FSM) governing boss attack patterns and environmental awareness.</li>
              </ul>

              <div className="popup-footer-actions">
                <a
                  href="#projects"
                  className="popup-cta-btn"
                  onClick={() => {
                    handleClosePopup();
                    document.getElementById("projects")?.scrollIntoView({ behavior: "smooth" });
                  }}
                >
                  View Playable Systems ➜
                </a>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ========================================
          POPUP 4: VISUAL DEVELOPMENT & CONCEPT PIPELINES
      ======================================== */}
      {popup === "visual" && (
        <div
          className="experience-popup-overlay"
          onClick={handleClosePopup}
          role="dialog"
          aria-modal="true"
          aria-label="Visual Development and Concept Pipelines"
        >
          <div className="experience-popup" onClick={(e) => e.stopPropagation()}>
            <button
              type="button"
              className="experience-popup-close"
              onClick={handleClosePopup}
              aria-label="Close visual development details"
            >
              ×
            </button>

            <h2>Visual Development &amp; Concept Pipelines</h2>

            <p className="experience-popup-company">
              IMAGE Creative Education &amp; Foundations
              <span className="experience-popup-year">(2022 – 2023)</span>
            </p>

            <div className="experience-popup-header-line"></div>

            <div className="experience-popup-content">
              <h3>Creative &amp; Technical Foundation</h3>
              <p>
                Cultivated strong visual storytelling, digital illustration pipelines, 2D character silhouette
                exploration, and concept asset translation into real-time game engines.
              </p>

              <h3>Key Highlights</h3>
              <ul>
                <li>Mastered digital concept art workflows and asset authoring in Adobe Photoshop.</li>
                <li>Studied silhouette clarity, character silhouettes, color theory, and environmental mood.</li>
                <li>Connected 2D visual designs directly to Unity sprite and 3D textured mesh pipelines.</li>
                <li>Built practical foundations in lighting, composition, and visual effects presentation.</li>
              </ul>

              <div className="popup-footer-actions">
                <a
                  href="#projects"
                  className="popup-cta-btn"
                  onClick={() => {
                    handleClosePopup();
                    document.getElementById("projects")?.scrollIntoView({ behavior: "smooth" });
                  }}
                >
                  View Creative Work ➜
                </a>
              </div>
            </div>
          </div>
        </div>
      )}

    </section>
  );
}

export default Experience;
