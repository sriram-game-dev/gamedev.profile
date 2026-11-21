import { useState, useMemo, useCallback } from 'react';
import { projects, personalProjects, allProjects } from '../data/projectsData';
import ProjectCard from './ProjectCard';
import CaseStudyDrawer from './CaseStudyDrawer';

const PLATFORMS = ['All', 'Meta Quest', 'Android', 'PC', 'WebGL'];

function Projects({
  activeAudience = 'all',
  onSelectAudience = () => {},
  skillFilter = '',
  onClearSkillFilter = () => {}
}) {
  const [activeDeck, setActiveDeck] = useState('professional'); // 'professional' | 'personal' | 'all'
  const [selectedPlatform, setSelectedPlatform] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [spotlightIndex, setSpotlightIndex] = useState(0);
  const [selectedProject, setSelectedProject] = useState(null);

  // Filter logic across projects
  const filterList = useCallback((list) => {
    return list.filter((p) => {
      // Platform filter
      if (selectedPlatform !== 'All') {
        const hasPlatform = p.platforms?.some((plat) =>
          plat.toLowerCase().includes(selectedPlatform.toLowerCase())
        );
        if (!hasPlatform) return false;
      }

      // Skill filter
      if (skillFilter) {
        const sf = skillFilter.toLowerCase();
        const matchesSkill =
          p.technologies?.toLowerCase().includes(sf) ||
          p.techList?.some((t) => t.toLowerCase().includes(sf)) ||
          p.platforms?.some((plat) => plat.toLowerCase().includes(sf));
        if (!matchesSkill) return false;
      }

      // Search matching
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesTitle = p.title.toLowerCase().includes(q);
        const matchesDesc = p.description.toLowerCase().includes(q);
        const matchesTech = p.technologies?.toLowerCase().includes(q) ||
          p.techList?.some((t) => t.toLowerCase().includes(q));
        if (!matchesTitle && !matchesDesc && !matchesTech) return false;
      }

      return true;
    });
  }, [selectedPlatform, skillFilter, searchQuery]);

  const filteredProfessional = useMemo(() => filterList(projects), [filterList]);
  const filteredPersonal = useMemo(() => filterList(personalProjects), [filterList]);

  const activeSpotlightProject = filteredProfessional[spotlightIndex] || filteredProfessional[0] || projects[0];

  const hasActiveFilters = Boolean(
    selectedPlatform !== 'All' ||
    searchQuery.trim() ||
    skillFilter ||
    activeAudience !== 'all'
  );

  const handleResetFilters = () => {
    setSelectedPlatform('All');
    setSearchQuery('');
    if (skillFilter) onClearSkillFilter();
    if (activeAudience !== 'all') onSelectAudience('all');
  };

  const handleSelectDeck = (deck) => {
    setActiveDeck(deck);
    setSelectedPlatform('All');
  };

  const handleSelectPlatform = (plat) => {
    if (plat === selectedPlatform) {
      setSelectedPlatform('All');
      return;
    }
    setSelectedPlatform(plat);

    // Smart auto-deck switch: If clicked platform exists only in the other track, switch to it
    if (plat !== 'All') {
      const existsInProfessional = projects.some((p) =>
        p.platforms?.some((pl) => pl.toLowerCase().includes(plat.toLowerCase()))
      );
      const existsInPersonal = personalProjects.some((p) =>
        p.platforms?.some((pl) => pl.toLowerCase().includes(plat.toLowerCase()))
      );

      if (activeDeck === 'professional' && !existsInProfessional && existsInPersonal) {
        setActiveDeck('personal');
      } else if (activeDeck === 'personal' && !existsInPersonal && existsInProfessional) {
        setActiveDeck('professional');
      }
    }
  };

  return (
    <section id="projects" className="projects-section-v2">
      {/* SECTION HEADER */}
      <div className="projects-v2-header">
        <div className="v2-pretitle-pill">
          <span className="v2-radar-beacon" aria-hidden="true"></span>
          <span>SPATIAL COMPUTING &amp; GAMEPLAY ARCHITECTURE</span>
        </div>
        <h2 className="projects-v2-title">PROJECT PORTFOLIO</h2>
        <p className="projects-v2-subtitle">
          Commercial enterprise XR training simulations delivered under client NDA, alongside original playable indie games, physics prototypes, and mobile AR mechanics.
        </p>
        <div className="projects-v2-header-line"></div>
      </div>

      {/* MASTER DECK SWITCHER (ENTERPRISE NDA vs INDIE LAB vs COMPLETE) */}
      <div className="v2-master-deck-switcher">
        <div className="v2-switcher-track" role="tablist" aria-label="Project portfolio sectors">
          <button
            type="button"
            role="tab"
            aria-selected={activeDeck === 'professional'}
            className={`v2-deck-btn deck-professional ${activeDeck === 'professional' ? 'active' : ''}`}
            onClick={() => handleSelectDeck('professional')}
          >
            <div className="deck-btn-indicator"></div>
            <div className="deck-btn-text">
              <span className="deck-btn-badge">
                <span className="icon-lock" aria-hidden="true">🔒</span> CLIENT NDA PROTECTED
              </span>
              <span className="deck-btn-name">Professional Work ({projects.length})</span>
            </div>
          </button>

          <button
            type="button"
            role="tab"
            aria-selected={activeDeck === 'personal'}
            className={`v2-deck-btn deck-personal ${activeDeck === 'personal' ? 'active' : ''}`}
            onClick={() => handleSelectDeck('personal')}
          >
            <div className="deck-btn-indicator"></div>
            <div className="deck-btn-text">
              <span className="deck-btn-badge">
                <span className="icon-game" aria-hidden="true">🎮</span> PLAYABLE BUILDS &amp; GITHUB
              </span>
              <span className="deck-btn-name">Personal Projects ({personalProjects.length})</span>
            </div>
          </button>

          <button
            type="button"
            role="tab"
            aria-selected={activeDeck === 'all'}
            className={`v2-deck-btn deck-all ${activeDeck === 'all' ? 'active' : ''}`}
            onClick={() => handleSelectDeck('all')}
          >
            <div className="deck-btn-indicator"></div>
            <div className="deck-btn-text">
              <span className="deck-btn-badge">⚡ COMBINED OVERVIEW</span>
              <span className="deck-btn-name">All Works ({allProjects.length})</span>
            </div>
          </button>
        </div>
      </div>

      {/* COMMAND FILTER BAR (STREAMLINED & INTUITIVE) */}
      <div className="v2-command-filter-bar">
        <div className="v2-search-box">
          <span className="v2-search-icon" aria-hidden="true">🔍</span>
          <input
            type="text"
            className="v2-search-input"
            placeholder="Search systems (Quest, LOTO, Physics, ARCore, Gemini, Shaders...)"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            aria-label="Search projects by keyword"
          />
          {searchQuery && (
            <button
              type="button"
              className="v2-search-clear"
              onClick={() => setSearchQuery('')}
              aria-label="Clear search"
            >
              ✕
            </button>
          )}
        </div>

        {/* PLATFORM QUICK SELECT PILLS */}
        <div className="v2-platform-pills">
          <span className="v2-filter-label">Platform:</span>
          {PLATFORMS.map((plat) => (
            <button
              key={plat}
              type="button"
              className={`v2-plat-pill ${selectedPlatform === plat ? 'active' : ''}`}
              onClick={() => handleSelectPlatform(plat)}
            >
              {plat}
            </button>
          ))}
        </div>

        {hasActiveFilters && (
          <button
            type="button"
            className="v2-reset-quick-btn"
            onClick={handleResetFilters}
            title="Reset filters to default"
          >
            Reset Filters ↺
          </button>
        )}
      </div>

      {/* ==========================================================
          SECTOR 1: PROFESSIONAL ENTERPRISE SIMULATIONS (CLIENT NDA)
      ========================================================== */}
      {(activeDeck === 'professional' || activeDeck === 'all') && (
        <div className="v2-sector-container sector-professional">
          {/* SECTOR HEADER & NDA BANNER */}
          <div className="v2-sector-header nda-themed">
            <div className="v2-sector-title-row">
              <span className="v2-sector-pill nda-pill">
                <span className="pulse-dot-amber"></span>
                <span>COMMERCIAL XR DEPLOYMENTS</span>
              </span>
              <h3 className="v2-sector-heading">
                Professional Work &amp; Shipped Simulations
              </h3>
            </div>
            <div className="v2-nda-compliance-notice">
              <div className="notice-lock-icon" aria-hidden="true">🔒</div>
              <div className="notice-text">
                <strong>Enterprise Client NDA Compliance Notice:</strong> Engineered for commercial clients at <strong>Hema Enterprises (HEPL) · Digifox Studio</strong>. Proprietary CAD drawings, client blueprints, and manufacturing schematics have been redacted or anonymized in compliance with Non-Disclosure Agreements. System architectures and interaction mechanics are showcased for technical evaluation.
              </div>
            </div>
          </div>

          {filteredProfessional.length > 0 ? (
            <>
              {/* INTERACTIVE SPOTLIGHT SHOWCASE (FEATURED DOSSIER) */}
              {activeSpotlightProject && (
                <div className="v2-spotlight-dossier">
                  <div className="spotlight-viewport-wrapper">
                    <img
                      src={activeSpotlightProject.image}
                      alt={activeSpotlightProject.title}
                      className="spotlight-viewport-img"
                    />
                    <div className="spotlight-viewport-overlay">
                      <div className="spotlight-tag-left">
                        <span className="spotlight-nda-tag">🔒 CLIENT NDA</span>
                        <span className="spotlight-studio-tag">{activeSpotlightProject.studio}</span>
                      </div>
                      <div className="spotlight-tag-right">
                        <span className="spotlight-type-tag">{activeSpotlightProject.type}</span>
                      </div>
                    </div>
                  </div>

                  <div className="spotlight-details-panel">
                    <div className="spotlight-platforms">
                      {activeSpotlightProject.platforms?.map((p) => (
                        <span key={p} className="spotlight-plat-badge">{p}</span>
                      ))}
                    </div>

                    <h4 className="spotlight-project-title">{activeSpotlightProject.title}</h4>
                    <p className="spotlight-lead-desc">{activeSpotlightProject.description}</p>

                    {/* TELEMETRY SPECS */}
                    <div className="spotlight-telemetry-grid">
                      <div className="telemetry-item">
                        <span className="telemetry-label">Engineering Role</span>
                        <span className="telemetry-value">{activeSpotlightProject.caseStudy?.role || 'Lead VR Interaction Engineer'}</span>
                      </div>
                      <div className="telemetry-item">
                        <span className="telemetry-label">Core Tech Stack</span>
                        <span className="telemetry-value">{activeSpotlightProject.techList?.join(' · ') || 'Unity · C# · Meta SDK'}</span>
                      </div>
                      <div className="telemetry-item full-span">
                        <span className="telemetry-label">Architectural Challenge &amp; Solution</span>
                        <span className="telemetry-value-desc">{activeSpotlightProject.caseStudy?.challenge || activeSpotlightProject.caseStudy?.problem}</span>
                      </div>
                    </div>

                    {/* ACTIONS */}
                    <div className="spotlight-actions-row">
                      <button
                        type="button"
                        className="spotlight-inspect-btn"
                        onClick={() => setSelectedProject(activeSpotlightProject)}
                      >
                        Inspect Architecture &amp; Case Study ➜
                      </button>
                      <span className="spotlight-confidential-note">
                        🔒 Production deployment verified on hardware
                      </span>
                    </div>
                  </div>
                </div>
              )}

              {/* SIMULATION SELECTOR RACK */}
              <div className="v2-selector-rack-header">
                <span className="rack-label">All Shipped Commercial Simulations ({filteredProfessional.length}):</span>
              </div>
              <div className="v2-cards-grid">
                {filteredProfessional.map((proj, idx) => (
                  <div
                    key={proj.id}
                    className={`v2-rack-card ${activeSpotlightProject?.id === proj.id ? 'is-active-spotlight' : ''}`}
                    onClick={() => {
                      setSpotlightIndex(idx);
                      setSelectedProject(proj);
                    }}
                  >
                    <ProjectCard
                      project={proj}
                      onOpenCaseStudy={setSelectedProject}
                    />
                  </div>
                ))}
              </div>
            </>
          ) : (
            <div className="v2-empty-sector">
              <p>No professional simulations match the current &ldquo;{selectedPlatform}&rdquo; filter.</p>
              <button type="button" className="v2-reset-btn" onClick={handleResetFilters}>
                Clear Platform Filter ↺
              </button>
            </div>
          )}
        </div>
      )}

      {/* ==========================================================
          SECTOR 2: INDIE GAMES & PLAYABLE LABS (ITCH.IO / GITHUB)
      ========================================================== */}
      {(activeDeck === 'personal' || activeDeck === 'all') && (
        <div className="v2-sector-container sector-personal">
          {/* SECTOR HEADER */}
          <div className="v2-sector-header personal-themed">
            <div className="v2-sector-title-row">
              <span className="v2-sector-pill personal-pill">
                <span className="pulse-dot-cyan"></span>
                <span>OPEN ARCHITECTURE &amp; BUILDS</span>
              </span>
              <h3 className="v2-sector-heading">
                Personal Projects, Games &amp; Spatial R&amp;D
              </h3>
            </div>
            <div className="v2-personal-banner-notice">
              <div className="notice-game-icon" aria-hidden="true">🎮</div>
              <div className="notice-text">
                <strong>Playable Builds &amp; Source Repositories:</strong> Original games, mobile AR minigames, kinematic controllers, and custom URP shaders developed end-to-end. Available directly to play on <strong>itch.io</strong> and inspect on <strong>GitHub</strong>.
              </div>
            </div>
          </div>

          {filteredPersonal.length > 0 ? (
            <div className="v2-cards-grid">
              {filteredPersonal.map((proj) => (
                <ProjectCard
                  key={proj.id}
                  project={proj}
                  onOpenCaseStudy={setSelectedProject}
                />
              ))}
            </div>
          ) : (
            <div className="v2-empty-sector">
              <p>No personal projects match the current &ldquo;{selectedPlatform}&rdquo; filter.</p>
              <button type="button" className="v2-reset-btn" onClick={handleResetFilters}>
                Clear Platform Filter ↺
              </button>
            </div>
          )}
        </div>
      )}

      {/* CASE STUDY DRAWER MODAL */}
      {selectedProject && (
        <CaseStudyDrawer
          project={selectedProject}
          onClose={() => setSelectedProject(null)}
        />
      )}
    </section>
  );
}

export default Projects;
