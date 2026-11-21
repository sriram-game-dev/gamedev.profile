import { useState, useMemo } from 'react';
import { route, navigateTo } from '../utils/asset';
import { allProjects } from '../data/projectsData';
import ProjectCard from './ProjectCard';
import CaseStudyDrawer from './CaseStudyDrawer';

const PLATFORMS = ['All', 'Meta Quest', 'Android', 'PC', 'WebGL'];
const TECHS = ['All', 'Unity', 'C#', 'Meta SDK', 'AR Foundation', 'Shader Graph'];
const TYPES = ['All', 'Training Simulation', 'Game', 'AR Experience', 'Virtual Showroom'];

function Projects({
  activeAudience = 'all',
  onSelectAudience = () => {},
  skillFilter = '',
  onClearSkillFilter = () => {}
}) {
  const [categoryTab, setCategoryTab] = useState('all'); // 'all' | 'professional' | 'personal'
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedPlatform, setSelectedPlatform] = useState('All');
  const [selectedTech, setSelectedTech] = useState('All');
  const [selectedType, setSelectedType] = useState('All');
  const [selectedProject, setSelectedProject] = useState(null);

  const focusLabels = {
    games: 'Games & Gameplay Prototypes',
    'game-design': 'Game Design, Mechanics & Systems Architecture',
    xr: 'Spatial Computing, AR & Meta Quest VR',
    industrial: 'Industrial Training Simulations & Enterprise LOTO'
  };

  // Reordering & filtering pipeline
  const filteredProjects = useMemo(() => {
    return allProjects.filter((p) => {
      // Primary category tab filter
      if (categoryTab === 'professional' && !p.isNda && p.category !== 'professional') {
        return false;
      }
      if (categoryTab === 'personal' && (p.isNda || p.category === 'professional')) {
        return false;
      }

      // Direct skill filter from Skills section click
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
        const matchesTech = p.technologies?.toLowerCase().includes(q);
        if (!matchesTitle && !matchesDesc && !matchesTech) return false;
      }

      // Platform filter
      if (selectedPlatform !== 'All') {
        const hasPlatform = p.platforms?.some((plat) =>
          plat.toLowerCase().includes(selectedPlatform.toLowerCase())
        );
        if (!hasPlatform) return false;
      }

      // Tech filter
      if (selectedTech !== 'All') {
        const hasTech =
          p.techList?.some((t) => t.toLowerCase().includes(selectedTech.toLowerCase())) ||
          p.technologies?.toLowerCase().includes(selectedTech.toLowerCase());
        if (!hasTech) return false;
      }

      // Type filter
      if (selectedType !== 'All') {
        if (p.type !== selectedType) return false;
      }

      // Audience focus filter
      if (activeAudience === 'games') {
        if (p.type !== 'Game') return false;
      } else if (activeAudience === 'game-design') {
        const isDesignProject =
          p.type === 'Game' ||
          p.caseStudy?.role?.toLowerCase().includes('designer') ||
          p.technologies?.toLowerCase().includes('gameplay') ||
          p.description?.toLowerCase().includes('mechanic') ||
          p.feature?.some((f) => f.toLowerCase().includes('gameplay') || f.toLowerCase().includes('progression'));
        if (!isDesignProject) return false;
      } else if (activeAudience === 'industrial') {
        if (p.type !== 'Training Simulation') return false;
      } else if (activeAudience === 'xr') {
        const isXR =
          p.platforms?.some((pl) => pl === 'VR' || pl === 'Meta Quest' || pl === 'ARCore') ||
          p.type?.includes('AR');
        if (!isXR) return false;
      }

      return true;
    }).sort((a, b) => {
      // Featured projects first
      if (a.featured && !b.featured) return -1;
      if (!a.featured && b.featured) return 1;
      return 0;
    });
  }, [categoryTab, searchQuery, selectedPlatform, selectedTech, selectedType, activeAudience, skillFilter]);

  // Breakdown for grouped view when "all" is active
  const professionalList = useMemo(() => {
    return filteredProjects.filter((p) => p.isNda || p.category === 'professional');
  }, [filteredProjects]);

  const personalList = useMemo(() => {
    return filteredProjects.filter((p) => !p.isNda && p.category !== 'professional');
  }, [filteredProjects]);

  const handleResetFilters = () => {
    setCategoryTab('all');
    setSearchQuery('');
    setSelectedPlatform('All');
    setSelectedTech('All');
    setSelectedType('All');
    if (skillFilter) onClearSkillFilter();
    if (activeAudience !== 'all') {
      onSelectAudience('all');
    }
  };

  return (
    <section id="projects" className="projects-section">
      {/* SECTION HEADER BLOCK */}
      <div className="projects-header-block reveal-on-scroll">
        <div className="projects-pretitle-pill">
          <span className="pulse-indicator"></span>
          <span>ENGINEERED WORLDS &amp; SYSTEMS</span>
        </div>
        <h2 className="projects-title">FEATURED QUESTS &amp; BUILDS</h2>
        <p className="projects-subtitle">
          Explore enterprise industrial VR simulations engineered under client NDA alongside original indie games, physics prototypes, and experimental AR shaders.
        </p>
        <div className="projects-title-line"></div>
      </div>

      {/* DUAL CATEGORY SEGMENTED SWITCHER (PROFESSIONAL NDA vs PERSONAL PROJECTS) */}
      <div className="projects-track-switcher reveal-on-scroll reveal-delay-1">
        <div className="track-switcher-inner" role="tablist" aria-label="Project category filter">
          <button
            type="button"
            role="tab"
            aria-selected={categoryTab === 'all'}
            className={`track-tab-btn ${categoryTab === 'all' ? 'active' : ''}`}
            onClick={() => setCategoryTab('all')}
          >
            <span className="tab-label">All Works</span>
            <span className="tab-count">8</span>
          </button>

          <button
            type="button"
            role="tab"
            aria-selected={categoryTab === 'professional'}
            className={`track-tab-btn tab-professional ${categoryTab === 'professional' ? 'active' : ''}`}
            onClick={() => setCategoryTab('professional')}
          >
            <span className="tab-lock-icon" aria-hidden="true">🔒</span>
            <span className="tab-label">Professional (Client NDA)</span>
            <span className="tab-count">4</span>
          </button>

          <button
            type="button"
            role="tab"
            aria-selected={categoryTab === 'personal'}
            className={`track-tab-btn tab-personal ${categoryTab === 'personal' ? 'active' : ''}`}
            onClick={() => setCategoryTab('personal')}
          >
            <span className="tab-game-icon" aria-hidden="true">🎮</span>
            <span className="tab-label">Personal Projects &amp; Indie Labs</span>
            <span className="tab-count">4</span>
          </button>
        </div>
      </div>

      {/* CONTEXT CALLOUT BANNER BASED ON CATEGORY */}
      {categoryTab === 'professional' && (
        <div className="nda-context-banner reveal-on-scroll">
          <div className="nda-banner-icon-box">
            <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
              <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
            </svg>
          </div>
          <div className="nda-banner-content">
            <div className="nda-banner-heading">
              <strong>Enterprise Client NDA Notice · Hema Enterprises (HEPL) &amp; Digifox Studio</strong>
              <span className="nda-badge-pill">PROTECTED WORK</span>
            </div>
            <p>
              These interactive VR &amp; AR applications were built for commercial clients. Proprietary industrial blueprints, enterprise IP, and sensitive schematics are redacted or anonymized in compliance with Non-Disclosure Agreements. System architectures, interaction mechanics, and performance optimizations are presented for technical evaluation.
            </p>
          </div>
        </div>
      )}

      {categoryTab === 'personal' && (
        <div className="personal-context-banner reveal-on-scroll">
          <div className="personal-banner-icon-box" aria-hidden="true">
            <span>🎮</span>
          </div>
          <div className="personal-banner-content">
            <div className="personal-banner-heading">
              <strong>Independent Game Development &amp; Spatial Labs</strong>
              <span className="personal-badge-pill">PLAYABLE &amp; OPEN SOURCE</span>
            </div>
            <p>
              Original gameplay mechanics, modular state machines, responsive physics controllers, and mobile AR shaders built independently. Playable builds are published on itch.io and complete source repositories are available on GitHub.
            </p>
          </div>
        </div>
      )}

      {/* ACTIVE AUDIENCE FOCUS BANNER */}
      {activeAudience !== 'all' && (
        <div className="active-audience-banner reveal-on-scroll">
          <span className="banner-prefix">Focus:</span>
          <strong>{focusLabels[activeAudience]}</strong>
          <button
            type="button"
            className="banner-reset-btn"
            onClick={() => onSelectAudience('all')}
            aria-label="Show all projects"
          >
            ✕ Show All Projects
          </button>
        </div>
      )}

      {/* ACTIVE SKILL FILTER BANNER */}
      {skillFilter && (
        <div className="active-audience-banner active-skill-banner reveal-on-scroll">
          <span className="banner-prefix">Skill Highlight:</span>
          <strong>Filtered to projects using &ldquo;{skillFilter}&rdquo;</strong>
          <button
            type="button"
            className="banner-reset-btn"
            onClick={onClearSkillFilter}
            aria-label="Clear skill filter"
          >
            ✕ Clear Skill
          </button>
        </div>
      )}

      {/* FILTER & SEARCH TOOLBAR */}
      <div className="projects-toolbar reveal-on-scroll reveal-delay-1">
        {/* Search input */}
        <div className="projects-search-wrapper">
          <span className="search-icon" aria-hidden="true">🔍</span>
          <input
            type="text"
            className="projects-search-input"
            placeholder="Search by title, tech (Photon, Quest, Shader, Gemini, Physics...)"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            aria-label="Search projects by keyword"
          />
          {searchQuery && (
            <button
              type="button"
              className="search-clear-btn"
              onClick={() => setSearchQuery('')}
              aria-label="Clear search"
            >
              ✕
            </button>
          )}
        </div>

        {/* Filter controls row */}
        <div className="projects-filter-row">
          {/* Platform chips */}
          <div className="filter-group">
            <span className="filter-group-label">Platform:</span>
            <div className="filter-chips">
              {PLATFORMS.map((plat) => (
                <button
                  key={plat}
                  type="button"
                  className={`filter-chip ${selectedPlatform === plat ? 'active' : ''}`}
                  onClick={() => setSelectedPlatform(plat)}
                >
                  {plat}
                </button>
              ))}
            </div>
          </div>

          {/* Type chips */}
          <div className="filter-group">
            <span className="filter-group-label">Type:</span>
            <div className="filter-chips">
              {TYPES.map((type) => (
                <button
                  key={type}
                  type="button"
                  className={`filter-chip ${selectedType === type ? 'active' : ''}`}
                  onClick={() => setSelectedType(type)}
                >
                  {type}
                </button>
              ))}
            </div>
          </div>

          {/* Tech chips */}
          <div className="filter-group">
            <span className="filter-group-label">Tech:</span>
            <div className="filter-chips">
              {TECHS.map((tech) => (
                <button
                  key={tech}
                  type="button"
                  className={`filter-chip ${selectedTech === tech ? 'active' : ''}`}
                  onClick={() => setSelectedTech(tech)}
                >
                  {tech}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Results counter and reset */}
        <div className="projects-meta-bar">
          <span className="projects-counter">
            Showing <strong>{filteredProjects.length}</strong> {filteredProjects.length === 1 ? 'project' : 'projects'}
            {categoryTab === 'professional' && ' in Professional (NDA)'}
            {categoryTab === 'personal' && ' in Personal Projects'}
          </span>
          {(searchQuery || selectedPlatform !== 'All' || selectedTech !== 'All' || selectedType !== 'All' || activeAudience !== 'all' || categoryTab !== 'all') && (
            <button
              type="button"
              className="projects-clear-filters-btn"
              onClick={handleResetFilters}
            >
              Reset All Filters ↺
            </button>
          )}
        </div>
      </div>

      {/* INTERACTIVE PROJECTS DISPLAY */}
      {filteredProjects.length > 0 ? (
        categoryTab === 'all' && !searchQuery && selectedPlatform === 'All' && selectedTech === 'All' && selectedType === 'All' && activeAudience === 'all' && !skillFilter ? (
          /* GROUPED TWO-TIER VIEW FOR "ALL WORKS" */
          <div className="projects-grouped-showcase reveal-on-scroll reveal-delay-2">
            {/* GROUP 1: PROFESSIONAL PROJECTS (CLIENT NDA) */}
            <div className="projects-category-group professional-group">
              <div className="group-header-banner">
                <div className="group-title-row">
                  <span className="group-badge badge-nda">
                    <span className="lock-icon" aria-hidden="true">🔒</span> ENTERPRISE CLIENT NDA
                  </span>
                  <h3 className="group-heading">Professional Work &amp; Shipped Simulations</h3>
                </div>
                <p className="group-subtext">
                  Commercial VR training systems and AR kiosk solutions delivered for Hema Enterprises (HEPL) · Digifox Studio. Proprietary client data anonymized under NDA.
                </p>
              </div>

              <div className="projects-interactive-grid">
                {professionalList.map((project) => (
                  <ProjectCard
                    key={project.id || project.title}
                    project={project}
                    onOpenCaseStudy={setSelectedProject}
                  />
                ))}
              </div>
            </div>

            {/* GROUP 2: PERSONAL PROJECTS & INDIE LABS */}
            <div className="projects-category-group personal-group">
              <div className="group-header-banner">
                <div className="group-title-row">
                  <span className="group-badge badge-personal">
                    <span className="game-icon" aria-hidden="true">🎮</span> INDIE LAB &amp; PLAYABLE BUILDS
                  </span>
                  <h3 className="group-heading">Personal Projects, Games &amp; Spatial R&amp;D</h3>
                </div>
                <p className="group-subtext">
                  Original gameplay systems, mobile AR minigames, and 3D prototypes. Published openly with playable itch.io builds and GitHub source code.
                </p>
              </div>

              <div className="projects-interactive-grid">
                {personalList.map((project) => (
                  <ProjectCard
                    key={project.id || project.title}
                    project={project}
                    onOpenCaseStudy={setSelectedProject}
                  />
                ))}
              </div>
            </div>
          </div>
        ) : (
          /* SINGLE FILTERED GRID */
          <div className="projects-interactive-grid reveal-on-scroll reveal-delay-2">
            {filteredProjects.map((project) => (
              <ProjectCard
                key={project.id || project.title}
                project={project}
                onOpenCaseStudy={setSelectedProject}
              />
            ))}
          </div>
        )
      ) : (
        <div className="projects-empty-state">
          <p>No projects match your current filter criteria.</p>
          <button
            type="button"
            className="nav-game-button"
            onClick={handleResetFilters}
          >
            Clear Filters
          </button>
        </div>
      )}

      {/* QUICK CATEGORY HUB ARCHIVE LINKS */}
      <div className="projects-category-hub reveal-on-scroll reveal-delay-3">
        <h3 className="hub-heading">Explore Dedicated Category Archives</h3>
        <div className="hub-links-grid">
          <a
            href={route('/professional')}
            className="hub-card hub-card-professional"
            onClick={(e) => {
              e.preventDefault();
              navigateTo('/professional');
            }}
          >
            <div className="hub-card-top-tag">
              <span className="hub-lock-icon">🔒</span> CLIENT NDA PROTECTED
            </div>
            <div className="hub-card-title">Professional Projects Archive ➜</div>
            <p className="hub-card-desc">
              Industrial LOTO &amp; manufacturing VR training simulations under enterprise NDA for Hema Enterprises (HEPL) · Digifox Studio.
            </p>
          </a>

          <a
            href={route('/personal')}
            className="hub-card hub-card-personal"
            onClick={(e) => {
              e.preventDefault();
              navigateTo('/personal');
            }}
          >
            <div className="hub-card-top-tag">
              <span className="hub-game-icon">🎮</span> PLAYABLE &amp; OPEN SOURCE
            </div>
            <div className="hub-card-title">Sidequests &amp; Indie Games Archive ➜</div>
            <p className="hub-card-desc">
              Playable WebGL builds, mobile AR minigames, custom URP shaders, and C# game mechanics R&amp;D on itch.io &amp; GitHub.
            </p>
          </a>
        </div>
      </div>

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
