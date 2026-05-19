export function TrendlyLogo({ className = "h-8 w-auto" }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 144 32"
      className={className}
      role="img"
      aria-label="Trendly logo"
      fill="none"
    >
      <defs>
        <linearGradient id="brandGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#10b981" />
          <stop offset="100%" stopColor="#047857" />
        </linearGradient>
        <filter id="logoGlow" x="-20%" y="-20%" width="140%" height="140%">
          <feGaussianBlur stdDeviation="2" result="blur" />
          <feComposite in="SourceGraphic" in2="blur" operator="over" />
        </filter>
      </defs>

      {/* Abstract Trend/Growth mark */}
      <g transform="translate(0, 2)">
        <rect x="0" y="8" width="8" height="20" rx="4" fill="url(#brandGrad)" opacity="0.6" className="transition-all duration-300 hover:opacity-100" />
        <rect x="11" y="0" width="8" height="28" rx="4" fill="url(#brandGrad)" filter="url(#logoGlow)" className="transition-all duration-300 hover:scale-105 origin-center" />
        <rect x="22" y="14" width="8" height="14" rx="4" fill="url(#brandGrad)" opacity="0.8" className="transition-all duration-300 hover:opacity-100" />
      </g>

      {/* Wordmark */}
      <text
        x="38"
        y="24"
        fontFamily="Georgia, 'Times New Roman', serif"
        fontSize="25"
        fontWeight="800"
        letterSpacing="-1.2"
        fill="currentColor"
      >
        Trendly
      </text>
      
      {/* Decorative dot */}
      <circle cx="135" cy="23" r="3.5" fill="url(#brandGrad)" />
    </svg>
  );
}
