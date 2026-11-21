/**
 * AmbientBackdrop Component
 * 
 * Renders soft, glowing abstract gradient light spheres behind the glass panels
 * across the website (Cyan/Turquoise, Electric Cobalt Blue, Royal Violet, and Amber).
 * These luminous background elements provide the optical refraction and rich color
 * gradients that shine through frosted-glass surfaces (backdrop-filter: blur) 
 * matching the reference aesthetic without obscuring content or adding DOM overhead.
 */
function AmbientBackdrop() {
  return (
    <div className="ambient-backdrop-system" aria-hidden="true">
      {/* Hero / Top Section: Vibrant Cyan & Electric Cobalt illumination */}
      <div className="ambient-orb ambient-orb--hero-cyan" />
      <div className="ambient-orb ambient-orb--hero-cobalt" />

      {/* About Section: Electric Blue & Soft Violet glow */}
      <div className="ambient-orb ambient-orb--about-violet" />
      <div className="ambient-orb ambient-orb--about-cyan" />

      {/* Experience Section: Deep Turquoise & Neon Amber hint */}
      <div className="ambient-orb ambient-orb--exp-turquoise" />
      <div className="ambient-orb ambient-orb--exp-cobalt" />

      {/* Projects Section: Rich Royal Violet & Luminous Amber accent */}
      <div className="ambient-orb ambient-orb--projects-violet" />
      <div className="ambient-orb ambient-orb--projects-amber" />
      <div className="ambient-orb ambient-orb--projects-cyan" />

      {/* Skills Section: Electric Cobalt & Cyber Sky */}
      <div className="ambient-orb ambient-orb--skills-cyan" />
      <div className="ambient-orb ambient-orb--skills-cobalt" />

      {/* Contact Section: Luminous Cyan & Deep Blue immersion */}
      <div className="ambient-orb ambient-orb--contact-cyan" />
      <div className="ambient-orb ambient-orb--contact-violet" />
    </div>
  );
}

export default AmbientBackdrop;
