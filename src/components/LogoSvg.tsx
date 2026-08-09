import React from 'react';

/**
 * Custom high-definition animated SVG logos.
 * Designed to represent MONTU (AI-guided nuclear energy intelligence).
 * Features a glowing core with rotating orbital rings, electrons, clean power grid paths,
 * and high-contrast light particle rays. Animated with pure CSS keyframes.
 */

export const LogoSvg: React.FC<{ className?: string; size?: number }> = ({ className = '', size = 200 }) => {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 200 200"
      className={`${className} overflow-visible`}
      xmlns="http://www.w3.org/2000/svg"
      id="montu-svg-logo"
    >
      <defs>
        {/* Glow Filters */}
        <filter id="core-glow" x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="8" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
        <filter id="ring-glow" x="-30%" y="-30%" width="160%" height="160%">
          <feGaussianBlur stdDeviation="3" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>

        {/* Gradients */}
        <radialGradient id="nuclear-core" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#ffffff" />
          <stop offset="30%" stopColor="#22c55e" /> {/* Radiant bright green */}
          <stop offset="70%" stopColor="#15803d" /> {/* Emerald green */}
          <stop offset="100%" stopColor="#052e16" /> {/* Deep dark emerald background */}
        </radialGradient>

        <linearGradient id="orbit-grad-1" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#22c55e" />
          <stop offset="50%" stopColor="#10b981" />
          <stop offset="100%" stopColor="#06b6d4" /> {/* Transitions into cyan */}
        </linearGradient>

        <linearGradient id="orbit-grad-2" x1="100%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#3b82f6" /> {/* Solar blue component */}
          <stop offset="50%" stopColor="#10b981" />
          <stop offset="100%" stopColor="#22c55e" />
        </linearGradient>

        <linearGradient id="grid-lines" x1="0%" y1="50%" x2="100%" y2="50%">
          <stop offset="0%" stopColor="#14532d" stopOpacity="0" />
          <stop offset="50%" stopColor="#22c55e" stopOpacity="0.8" />
          <stop offset="100%" stopColor="#14532d" stopOpacity="0" />
        </linearGradient>
      </defs>

      <style>{`
        /* Core pulsing */
        @keyframes pulse-core {
          0%, 100% {
            transform: scale(1);
            filter: drop-shadow(0 0 10px rgba(34, 197, 94, 0.6)) url(#core-glow);
          }
          50% {
            transform: scale(1.15);
            filter: drop-shadow(0 0 25px rgba(34, 197, 94, 0.95)) url(#core-glow);
          }
        }

        /* Rotation for Orbit Rings */
        @keyframes rotate-clockwise {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }

        @keyframes rotate-counter-clockwise {
          from { transform: rotate(360deg); }
          to { transform: rotate(0deg); }
        }

        /* Dash array animation for grid flow */
        @keyframes dash-flow {
          to {
            stroke-dashoffset: -40;
          }
        }

        /* Particle electron orbits */
        @keyframes orbit-electron-1 {
          0% { offset-distance: 0%; }
          100% { offset-distance: 100%; }
        }

        .animated-core {
          transform-origin: 100px 100px;
          animation: pulse-core 3s infinite ease-in-out;
        }

        .animated-ring-1 {
          transform-origin: 100px 100px;
          animation: rotate-clockwise 12s infinite linear;
        }

        .animated-ring-2 {
          transform-origin: 100px 100px;
          animation: rotate-counter-clockwise 16s infinite linear;
        }

        .animated-ring-3 {
          transform-origin: 100px 100px;
          animation: rotate-clockwise 24s infinite linear;
        }

        .grid-pulse {
          stroke-dasharray: 8 12;
          animation: dash-flow 2s infinite linear;
        }

        /* Micro-nodes flickering */
        @keyframes flicker-node {
          0%, 100% { opacity: 0.3; }
          50% { opacity: 1; }
        }

        .flickuring-node {
          animation: flicker-node 1.5s infinite ease-in-out;
        }
      `}</style>

      {/* Background Tech Hexagon grid or alignment ticks */}
      <g stroke="#1e293b" strokeWidth="0.5" fill="none" opacity="0.6">
        <circle cx="100" cy="100" r="90" strokeDasharray="2 4" />
        <circle cx="100" cy="100" r="75" />
        {/* Alignment axes */}
        <line x1="100" y1="5" x2="100" y2="195" strokeDasharray="5 5" stroke="#334155" />
        <line x1="5" y1="100" x2="195" y2="100" strokeDasharray="5 5" stroke="#334155" />
      </g>

      {/* Grid Power Distribution Paths (Underlay) */}
      <g stroke="url(#grid-lines)" strokeWidth="1.5" fill="none" className="grid-pulse">
        {/* Cross networks radiating outward */}
        <path d="M 100 100 L 20 20 M 100 100 L 180 20 M 100 100 L 20 180 M 100 100 L 180 180" />
      </g>

      {/* Outer Rotating Protection & Cyber Security Ring */}
      <circle
        cx="100"
        cy="100"
        r="80"
        stroke="url(#orbit-grad-1)"
        strokeWidth="1"
        fill="none"
        strokeDasharray="40 180 10 30"
        className="animated-ring-3"
        opacity="0.8"
      />

      {/* Diagonal Elliptical Orbiting Rings */}
      {/* Orbit 1 */}
      <ellipse
        cx="100"
        cy="100"
        rx="70"
        ry="25"
        stroke="url(#orbit-grad-1)"
        strokeWidth="1.5"
        fill="none"
        transform="rotate(30 100 100)"
        className="animated-ring-1"
        opacity="0.9"
        filter="url(#ring-glow)"
      />

      {/* Orbit 2 */}
      <ellipse
        cx="100"
        cy="100"
        rx="70"
        ry="25"
        stroke="url(#orbit-grad-2)"
        strokeWidth="1.5"
        fill="none"
        transform="rotate(150 100 100)"
        className="animated-ring-2"
        opacity="0.9"
        filter="url(#ring-glow)"
      />

      {/* Orbit 3 (Horizontal Grid Integration representation) */}
      <ellipse
        cx="100"
        cy="100"
        rx="70"
        ry="12"
        stroke="#06b6d4"
        strokeWidth="1"
        fill="none"
        transform="rotate(90 100 100)"
        className="animated-ring-3"
        opacity="0.6"
      />

      {/* Glowing Energy Nodes along orbits */}
      {/* Node 1 */}
      <circle cx="100" cy="30" r="4" fill="#22c55e" className="flickuring-node" filter="url(#core-glow)" />
      {/* Node 2 */}
      <circle cx="100" cy="170" r="4" fill="#06b6d4" className="flickuring-node" style={{ animationDelay: '0.7s' }} filter="url(#core-glow)" />
      {/* Node 3 */}
      <circle cx="30" cy="100" r="4" fill="#3b82f6" className="flickuring-node" style={{ animationDelay: '0.4s' }} filter="url(#core-glow)" />
      {/* Node 4 */}
      <circle cx="170" cy="100" r="4" fill="#10b981" className="flickuring-node" style={{ animationDelay: '1.1s' }} filter="url(#core-glow)" />

      {/* Core Fission Chamber (The central glowing source) */}
      <circle
        cx="100"
        cy="100"
        r="22"
        fill="url(#nuclear-core)"
        className="animated-core"
      />

      {/* Inner Fission details */}
      <g transform="translate(100, 100)" stroke="#ffffff" strokeWidth="1" opacity="0.8">
        <circle cx="0" cy="0" r="6" fill="#10b981" />
        {/* Tiny atomic center ticks */}
        <line x1="-3" y1="0" x2="3" y2="0" />
        <line x1="0" y1="-3" x2="0" y2="3" />
      </g>
    </svg>
  );
};
