export default function HeroIllustration({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 560 440" className={className} aria-hidden>
      <defs>
        <linearGradient id="hero-sky" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#e7f4ec" />
          <stop offset="1" stopColor="#f9fcfa" />
        </linearGradient>
        <linearGradient id="hero-peak" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#3f8f5c" />
          <stop offset="1" stopColor="#166534" />
        </linearGradient>
        <clipPath id="hero-clip">
          <rect width="560" height="440" rx="36" />
        </clipPath>
      </defs>
      <g clipPath="url(#hero-clip)">
        <rect width="560" height="440" fill="url(#hero-sky)" />
        <circle cx="430" cy="105" r="46" fill="#f5c451" />
        <circle cx="430" cy="105" r="70" fill="#f5c451" opacity="0.18" />
        <path d="M70 80 q14 -12 28 0 q12 -8 22 4 h-50z" fill="#fff" />
        <path d="M300 60 q12 -10 24 0 q10 -7 20 3 h-44z" fill="#fff" />
        <path d="M-20 330 L100 190 L170 260 L240 180 L340 300 L420 220 L580 360 V440 H-20Z" fill="#bcdcc5" />
        <path d="M60 440 L270 110 L480 440Z" fill="url(#hero-peak)" />
        <path d="M270 110 L307 168 L288 160 L272 180 L254 160 L236 165Z" fill="#fff" />
        <path d="M270 110 V76 L298 86 L270 96" fill="none" stroke="#14532d" strokeWidth="4" strokeLinejoin="round" />
        <path d="M380 440 L470 300 L580 440Z" fill="#4f9a68" />
        <path d="M-20 440 L80 320 L190 440Z" fill="#4f9a68" />
        <path
          d="M150 440 C200 400 300 410 280 360 C262 318 330 300 300 250 C285 222 290 200 272 180"
          fill="none"
          stroke="#f5c451"
          strokeWidth="5"
          strokeDasharray="2 14"
          strokeLinecap="round"
        />
        <path d="M-20 420 Q140 380 280 415 T580 405 V440 H-20Z" fill="#14532d" />
        {[[60, 395, 1], [92, 400, 0.75], [470, 392, 0.9], [500, 398, 0.7]].map(([x, y, s]) => (
          <g key={x} transform={`translate(${x} ${y}) scale(${s})`}>
            <rect x="-3" y="0" width="6" height="14" fill="#5b4326" />
            <path d="M0 -46 L20 -14 H-20Z M0 -32 L25 6 H-25Z" fill="#0f3d22" />
          </g>
        ))}
      </g>
    </svg>
  );
}
