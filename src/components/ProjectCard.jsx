import { useState, useRef, useEffect } from 'react';

function ProjectCard({ project, onOpenCaseStudy }) {
  const [isPlaying, setIsPlaying] = useState(false);
  const cardRef = useRef(null);
  const videoRef = useRef(null);

  const isNda = project.isNda || project.category === 'professional';

  // Play video on scroll-into-view (or tap on mobile)
  useEffect(() => {
    const el = cardRef.current;
    if (!el || !project.video) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsPlaying(true);
          videoRef.current?.play().catch(() => {});
        } else {
          setIsPlaying(false);
          videoRef.current?.pause();
        }
      },
      { threshold: 0.5 }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [project.video]);

  const handlePointerEnter = () => {
    if (project.video && videoRef.current) {
      setIsPlaying(true);
      videoRef.current.play().catch(() => {});
    }
  };

  const handlePointerLeave = () => {
    if (project.video && videoRef.current) {
      setIsPlaying(false);
      videoRef.current.pause();
    }
  };

  const handleImgError = (e) => {
    if (!e.currentTarget.dataset.errored && project.image?.endsWith('.jpg')) {
      e.currentTarget.dataset.errored = 'true';
      e.currentTarget.src = project.image.replace('.jpg', '.svg');
    }
  };

  return (
    <article
      ref={cardRef}
      className={`project-interactive-card ${isNda ? 'is-professional-nda' : 'is-personal-project'} ${project.featured ? 'is-featured' : ''}`}
      tabIndex={0}
      role="button"
      aria-label={`Open case study for ${project.title}`}
      onClick={() => onOpenCaseStudy(project)}
      onPointerEnter={handlePointerEnter}
      onPointerLeave={handlePointerLeave}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          onOpenCaseStudy(project);
        }
      }}
    >
      {/* CARD MEDIA HEADER */}
      <div className="card-media-wrapper">
        <img
          src={project.image}
          alt={project.title}
          loading="lazy"
          className="card-media-img"
          onError={handleImgError}
        />

        {project.video && (
          <video
            ref={videoRef}
            src={project.video}
            muted
            loop
            playsInline
            className={`card-media-video ${isPlaying ? 'visible' : ''}`}
          />
        )}

        {/* OVERLAY BADGES */}
        <div className="card-media-overlay">
          <div className="card-overlay-left-badges">
            {isNda ? (
              <span className="card-nda-badge" title="Professional project delivered under Enterprise Client NDA">
                <svg viewBox="0 0 24 24" width="12" height="12" fill="currentColor" aria-hidden="true">
                  <path d="M18 8h-1V6c0-2.76-2.24-5-5-5S7 3.24 7 6v2H6c-1.1 0-2 .9-2 2v10c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V10c0-1.1-.9-2-2-2zm-6 9c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2zm3.1-9H8.9V6c0-1.71 1.39-3.1 3.1-3.1 1.71 0 3.1 1.39 3.1 3.1v2z"/>
                </svg>
                CLIENT NDA
              </span>
            ) : (
              <span className="card-personal-badge" title="Original personal project & indie prototype">
                <span className="game-badge-icon" aria-hidden="true">🎮</span>
                PERSONAL PROJECT
              </span>
            )}
            {project.featured && (
              <span className="card-featured-badge">★ FEATURED</span>
            )}
          </div>

          <div className="card-overlay-right-badges">
            {project.type && (
              <span className="card-type-badge">{project.type}</span>
            )}
          </div>
        </div>

        {/* QUICK INSPECT BAR */}
        <div className="card-quick-inspect">
          <span>{isNda ? 'Inspect Architecture & Case Study ➜' : 'Inspect Prototype & Systems ➜'}</span>
        </div>
      </div>

      {/* CARD BODY */}
      <div className="card-body">
        {/* PLATFORMS ROW */}
        <div className="card-context-row">
          <div className="card-platforms-row">
            {project.platforms?.map((plat) => (
              <span key={plat} className="card-platform-pill">{plat}</span>
            ))}
          </div>
        </div>

        {/* TITLE */}
        <h3 className="card-title">{project.title}</h3>

        {/* DESCRIPTION */}
        <p className="card-desc">{project.description}</p>

        {/* DIRECT ACTION LINKS FOR PERSONAL PROJECTS (itch.io / GitHub) */}
        {!isNda && project.links && project.links.length > 0 && (
          <div className="card-external-links-row" onClick={(e) => e.stopPropagation()}>
            {project.links.map((link) => (
              <a
                key={link.label}
                href={link.url}
                target="_blank"
                rel="noopener noreferrer"
                className={`card-ext-pill ${link.type === 'itch' ? 'ext-itch' : 'ext-github'}`}
                title={`Open ${link.label}`}
              >
                {link.type === 'itch' ? '🕹️ Playable on itch.io ↗' : '📦 View on GitHub ↗'}
              </a>
            ))}
          </div>
        )}

        {/* TECH STACK CHIPS */}
        <div className="card-tech-chips">
          {project.techList?.slice(0, 4).map((tech) => (
            <span key={tech} className="card-tech-chip">{tech}</span>
          ))}
          {project.techList && project.techList.length > 4 && (
            <span className="card-tech-chip more">+{project.techList.length - 4}</span>
          )}
        </div>

        {/* CARD FOOTER NOTICE */}
        <div className="card-bottom-indicator">
          {isNda ? (
            <span className="card-nda-footer-note">
              <span className="lock-glyph">🔒</span> Enterprise Production · Sensitive Schematics Anonymized
            </span>
          ) : (
            <span className="card-personal-footer-note">
              <span className="sparkle-glyph">✨</span> Playable Build &amp; Open Architecture
            </span>
          )}
        </div>
      </div>
    </article>
  );
}

export default ProjectCard;
