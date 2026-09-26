"use client"

export function CareersHeroIllustration() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 400 400"
      fill="none"
      className="w-full h-full max-w-[360px] max-h-[360px] mx-auto"
      aria-hidden="true"
    >
      <defs>
        <linearGradient id="accentGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#6EE7B7" />
          <stop offset="100%" stopColor="#38BDF8" />
        </linearGradient>
        <filter id="glow" x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="8" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>

      <circle cx="200" cy="200" r="180" fill="url(#accentGradient)" opacity="0.08" />

      <g opacity="0.15">
        <rect x="60" y="80" width="80" height="80" rx="16" fill="url(#accentGradient)" transform="rotate(-12 100 120)" />
        <rect x="260" y="60" width="60" height="60" rx="12" fill="#38BDF8" transform="rotate(15 290 90)" />
        <circle cx="340" cy="280" r="40" fill="#6EE7B7" />
        <rect x="40" y="280" width="70" height="70" rx="14" fill="#38BDF8" transform="rotate(8 75 315)" />
      </g>

      <g filter="url(#glow)">
        <rect x="130" y="140" width="140" height="180" rx="8" fill="#111113" stroke="url(#accentGradient)" strokeWidth="2" />
        <path d="M220 140 L270 140 L270 190 Z" fill="#18181B" stroke="url(#accentGradient)" strokeWidth="1" opacity="0.5" />
        <g transform="translate(200, 200)">
          <circle r="28" fill="url(#accentGradient)" opacity="0.2" />
          <path d="M0 -8 L-6 4 L6 4 Z" fill="url(#accentGradient)" />
          <rect x="-2" y="4" width="4" height="16" rx="2" fill="url(#accentGradient)" />
        </g>
        <g transform="translate(150, 250)">
          <rect x="0" y="0" width="48" height="20" rx="4" fill="url(#accentGradient)" opacity="0.15" />
        </g>
        <g transform="translate(210, 250)">
          <rect x="0" y="0" width="48" height="20" rx="4" fill="url(#accentGradient)" opacity="0.15" />
        </g>
        <g transform="translate(150, 280)">
          <rect x="0" y="0" width="48" height="20" rx="4" fill="url(#accentGradient)" opacity="0.15" />
        </g>
        <g transform="translate(210, 280)">
          <rect x="0" y="0" width="48" height="20" rx="4" fill="url(#accentGradient)" opacity="0.15" />
        </g>
      </g>

      <g fill="url(#accentGradient)" opacity="0.6">
        <circle cx="80" cy="320" r="3">
          <animate attributeName="opacity" values="0;1;0" dur="3s" repeatCount="indefinite" />
        </circle>
        <circle cx="320" cy="100" r="2">
          <animate attributeName="opacity" values="1;0;1" dur="2.5s" repeatCount="indefinite" />
        </circle>
        <circle cx="50" cy="180" r="2.5">
          <animate attributeName="opacity" values="0;1;0" dur="4s" repeatCount="indefinite" />
        </circle>
        <circle cx="350" cy="340" r="2">
          <animate attributeName="opacity" values="1;0;1" dur="3.5s" repeatCount="indefinite" />
        </circle>
      </g>

      <g fill="#6EE7B7">
        <circle cx="100" cy="100" r="1.5">
          <animate attributeName="opacity" values="0;1;0" dur="2s" repeatCount="indefinite" />
        </circle>
        <circle cx="300" cy="300" r="1">
          <animate attributeName="opacity" values="1;0;1" dur="1.5s" repeatCount="indefinite" />
        </circle>
        <circle cx="150" cy="350" r="1.5">
          <animate attributeName="opacity" values="0;1;0" dur="2.5s" repeatCount="indefinite" />
        </circle>
        <circle cx="280" cy="80" r="1">
          <animate attributeName="opacity" values="1;0;1" dur="2s" repeatCount="indefinite" />
        </circle>
      </g>
    </svg>
  )
}