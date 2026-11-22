/**
 * AmbientBackdrop Component
 * 
 * Renders a vibrant, multi-layered Futuristic Cyber & Glassmorphism atmospheric system:
 * 1. Cyber HUD Digital Matrix Grid (fine-pitch dot & coordinate matrix texture)
 * 2. Multi-point Radiant Aurora Nebulae (Electric Cobalt, Cyber Cyan, Royal Violet, Amber, and Acid Lime)
 * 3. Floating Geometric HUD Particle Nodes (neon squares, diamonds, rings, triangles, crosshairs)
 * 
 * Inspired directly by the reference visual aesthetics to ensure the website background
 * feels active, deep, and luminous behind all frosted-glass surfaces.
 */

const PARTICLES = [
  // Distributed naturally across viewport widths and heights
  { id: 1, type: 'diamond', x: '8%', y: '16%', size: 22, color: '#00e5ff', rot: 45, dur: '22s', delay: '0s', opacity: 0.75 },
  { id: 2, type: 'square', x: '25%', y: '8%', size: 20, color: '#ff9e00', rot: 15, dur: '18s', delay: '-3s', opacity: 0.8 },
  { id: 3, type: 'ring', x: '44%', y: '12%', size: 24, color: '#38bdf8', rot: 0, dur: '24s', delay: '-5s', opacity: 0.7 },
  { id: 4, type: 'triangle', x: '72%', y: '10%', size: 18, color: '#D4FF24', rot: 0, dur: '20s', delay: '-7s', opacity: 0.7 },
  { id: 5, type: 'square', x: '91%', y: '16%', size: 24, color: '#ff9e00', rot: -20, dur: '21s', delay: '-2s', opacity: 0.8 },

  { id: 6, type: 'crosshair', x: '5%', y: '36%', size: 16, color: '#38bdf8', rot: 0, dur: '16s', delay: '-9s', opacity: 0.65 },
  { id: 7, type: 'diamond', x: '95%', y: '36%', size: 22, color: '#00e5ff', rot: 45, dur: '23s', delay: '-4s', opacity: 0.75 },
  { id: 8, type: 'ring', x: '12%', y: '52%', size: 26, color: '#c084fc', rot: 0, dur: '25s', delay: '-1s', opacity: 0.75 },
  { id: 9, type: 'triangle', x: '88%', y: '50%', size: 20, color: '#D4FF24', rot: 180, dur: '19s', delay: '-8s', opacity: 0.7 },

  { id: 10, type: 'square', x: '28%', y: '65%', size: 22, color: '#ff9e00', rot: 30, dur: '20s', delay: '-6s', opacity: 0.75 },
  { id: 11, type: 'crosshair', x: '74%', y: '62%', size: 16, color: '#38bdf8', rot: 0, dur: '17s', delay: '-10s', opacity: 0.65 },
  { id: 12, type: 'ring', x: '6%', y: '74%', size: 24, color: '#D4FF24', rot: 0, dur: '22s', delay: '-3s', opacity: 0.75 },
  { id: 13, type: 'diamond', x: '92%', y: '72%', size: 24, color: '#00e5ff', rot: 45, dur: '21s', delay: '-7s', opacity: 0.8 },

  { id: 14, type: 'triangle', x: '18%', y: '88%', size: 22, color: '#c084fc', rot: 45, dur: '24s', delay: '-11s', opacity: 0.7 },
  { id: 15, type: 'square', x: '48%', y: '84%', size: 20, color: '#ff9e00', rot: -15, dur: '18s', delay: '-4s', opacity: 0.75 },
  { id: 16, type: 'crosshair', x: '84%', y: '90%', size: 18, color: '#38bdf8', rot: 0, dur: '19s', delay: '-2s', opacity: 0.65 }
];

function ParticleShape({ type, size, color }) {
  switch (type) {
    case 'square':
      return (
        <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
          <rect
            x="2"
            y="2"
            width={size - 4}
            height={size - 4}
            rx="4"
            fill="none"
            stroke={color}
            strokeWidth="1.6"
            strokeOpacity="0.85"
          />
        </svg>
      );
    case 'diamond': {
      const half = size / 2;
      const inner = size * 0.35;
      return (
        <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
          <rect
            x={half - inner}
            y={half - inner}
            width={inner * 2}
            height={inner * 2}
            rx="3"
            fill="none"
            stroke={color}
            strokeWidth="1.6"
            strokeOpacity="0.85"
            transform={`rotate(45 ${half} ${half})`}
          />
        </svg>
      );
    }
    case 'triangle':
      return (
        <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
          <polygon
            points={`${size / 2},3 3,${size - 3} ${size - 3},${size - 3}`}
            fill="none"
            stroke={color}
            strokeWidth="1.6"
            strokeOpacity="0.85"
            strokeLinejoin="round"
          />
        </svg>
      );
    case 'ring':
      return (
        <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
          <circle
            cx={size / 2}
            cy={size / 2}
            r={size / 2 - 2}
            fill="none"
            stroke={color}
            strokeWidth="1.5"
            strokeOpacity="0.8"
          />
          <circle
            cx={size / 2}
            cy={size / 2}
            r="2.5"
            fill={color}
            fillOpacity="0.9"
          />
        </svg>
      );
    case 'crosshair':
    default:
      return (
        <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
          <line
            x1={size / 2}
            y1="0"
            x2={size / 2}
            y2={size}
            stroke={color}
            strokeWidth="1.4"
            strokeOpacity="0.75"
          />
          <line
            x1="0"
            y1={size / 2}
            x2={size}
            y2={size / 2}
            stroke={color}
            strokeWidth="1.4"
            strokeOpacity="0.75"
          />
          <circle
            cx={size / 2}
            cy={size / 2}
            r="2"
            fill={color}
            fillOpacity="0.85"
          />
        </svg>
      );
  }
}

function AmbientBackdrop() {
  return (
    <div className="ambient-backdrop-system" aria-hidden="true">
      {/* 1. Cyber HUD Digital Matrix Grid Layer */}
      <div className="ambient-cyber-grid" />

      {/* 2. Multi-point Radiant Aurora Nebulae */}
      <div className="ambient-nebula ambient-nebula--top-left" />
      <div className="ambient-nebula ambient-nebula--top-right" />
      <div className="ambient-nebula ambient-nebula--mid-left" />
      <div className="ambient-nebula ambient-nebula--mid-right" />
      <div className="ambient-nebula ambient-nebula--bottom" />

      {/* 3. Floating Geometric HUD Particle Nodes */}
      <div className="ambient-particles-layer">
        {PARTICLES.map((p) => (
          <div
            key={p.id}
            className="ambient-particle-node"
            style={{
              top: p.y,
              left: p.x,
              opacity: p.opacity,
              animationDuration: p.dur,
              animationDelay: p.delay
            }}
          >
            <div style={{ transform: `rotate(${p.rot}deg)` }}>
              <ParticleShape type={p.type} size={p.size} color={p.color} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default AmbientBackdrop;
