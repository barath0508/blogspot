type TrendlyLogoProps = {
  className?: string;
};

export function TrendlyLogo({ className }: TrendlyLogoProps) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 700 220"
      className={className}
      role="img"
      aria-label="Trendly logo"
      preserveAspectRatio="xMinYMid meet"
      fill="none"
    >
      <defs>
        <linearGradient id="tealAccent" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#10b981" />
          <stop offset="100%" stopColor="#059669" />
        </linearGradient>
        <filter id="tealGlow" x="-60%" y="-60%" width="220%" height="220%">
          <feGaussianBlur stdDeviation="4" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
        <filter id="cardShadow" x="-2%" y="-2%" width="108%" height="120%">
          <feDropShadow dx="0" dy="4" stdDeviation="10" floodColor="#000000" floodOpacity="0.08" />
        </filter>
      </defs>

      <rect x="10" y="10" width="320" height="200" rx="18" fill="#ffffff" filter="url(#cardShadow)" />
      <rect x="26" y="26" width="52" height="20" rx="6" fill="#f3f4f6" />
      <text
        x="52"
        y="40"
        fontFamily="system-ui, sans-serif"
        fontSize="10"
        fontWeight="600"
        fill="#9ca3af"
        textAnchor="middle"
        letterSpacing="0.5"
      >
        LIGHT
      </text>
      <text
        x="50"
        y="128"
        fontFamily="Georgia, 'Times New Roman', serif"
        fontSize="58"
        fontWeight="700"
        letterSpacing="-2.5"
        fill="#111827"
      >
        Trend
      </text>
      <text
        x="212"
        y="128"
        fontFamily="Georgia, 'Times New Roman', serif"
        fontSize="58"
        fontWeight="700"
        letterSpacing="-2.5"
        fill="url(#tealAccent)"
      >
        ly
      </text>
      <circle cx="52" cy="62" r="5.5" fill="#10b981" filter="url(#tealGlow)" />
      <rect x="50" y="140" width="258" height="3.5" rx="2" fill="url(#tealAccent)" opacity="0.25" />
      <text
        x="51"
        y="170"
        fontFamily="Georgia, serif"
        fontSize="12"
        fontStyle="italic"
        letterSpacing="3.5"
        fill="#6b7280"
      >
        stories that matter
      </text>

      <rect x="370" y="10" width="320" height="200" rx="18" fill="#111827" filter="url(#cardShadow)" />
      <rect x="386" y="26" width="48" height="20" rx="6" fill="#1f2937" />
      <text
        x="410"
        y="40"
        fontFamily="system-ui, sans-serif"
        fontSize="10"
        fontWeight="600"
        fill="#6b7280"
        textAnchor="middle"
        letterSpacing="0.5"
      >
        DARK
      </text>
      <text
        x="410"
        y="128"
        fontFamily="Georgia, 'Times New Roman', serif"
        fontSize="58"
        fontWeight="700"
        letterSpacing="-2.5"
        fill="#ffffff"
      >
        Trend
      </text>
      <text
        x="572"
        y="128"
        fontFamily="Georgia, 'Times New Roman', serif"
        fontSize="58"
        fontWeight="700"
        letterSpacing="-2.5"
        fill="url(#tealAccent)"
      >
        ly
      </text>
      <circle cx="412" cy="62" r="5.5" fill="#10b981" filter="url(#tealGlow)" />
      <rect x="410" y="140" width="258" height="3.5" rx="2" fill="url(#tealAccent)" opacity="0.3" />
      <text
        x="411"
        y="170"
        fontFamily="Georgia, serif"
        fontSize="12"
        fontStyle="italic"
        letterSpacing="3.5"
        fill="#6b7280"
      >
        stories that matter
      </text>
    </svg>
  );
}
