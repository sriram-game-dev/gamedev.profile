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
  const [activeDeck, setActiveDeck] = useState('all'); // 'all' | 'professional' | 'personal'
  const [selectedPlatform, setSelectedPlatform] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
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

      {/* MASTER DECK SWITCHER (COMPLETE vs ENTERPRISE NDA vs INDIE LAB) */}
      <div className="v2-master-deck-switcher">
        <div className="v2-switcher-track" role="tablist" aria-label="Project portfolio sectors">
          {/* 1. ALL WORKS (FIRST) */}
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

          {/* 2. PROFESSIONAL WORK (SECOND) */}
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

          {/* 3. PERSONAL PROJECTS (THIRD) */}
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
                Certain professional projects were developed under Non-Disclosure Agreements (NDAs). Details, source code, and assets are shared only to the extent permitted by confidentiality agreements.
              </div>
            </div>
          </div>

          {filteredProfessional.length > 0 ? (
            <div className="v2-cards-grid">
              {filteredProfessional.map((proj) => (
                <ProjectCard
                  key={proj.id}
                  project={proj}
                  onOpenCaseStudy={setSelectedProject}
                />
              ))}
            </div>
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
