// Ilustracje wektorowe dla wariantów tras. Rysowane w kodzie (SVG) – ostre na każdym ekranie.

export const ILLUSTRATIONS = {
  zwierzeca: "Zwierzęca – ślady zwierząt",
  kopa: "Kopa – pasmo wielu szczytów",
  mala: "Mała – łagodne wzgórza",
  duza: "Duża – wysoki szczyt",
} as const;

export type IllustrationKey = keyof typeof ILLUSTRATIONS;

export function isIllustration(value: string): value is IllustrationKey {
  return value in ILLUSTRATIONS;
}

const SKY = "#f0f7f2";
const FAR = "#bcdcc5";
const MID = "#4f9a68";
const NEAR = "#166534";
const SNOW = "#ffffff";
const SUN = "#f5c451";

export default function Illustration({ name, className = "" }: { name: IllustrationKey; className?: string }) {
  return (
    <svg
      viewBox="0 0 400 220"
      role="img"
      aria-label={ILLUSTRATIONS[name]}
      className={className}
      preserveAspectRatio="xMidYMid slice"
    >
      <rect width="400" height="220" fill={SKY} />
      {name === "mala" && <Mala />}
      {name === "duza" && <Duza />}
      {name === "kopa" && <Kopa />}
      {name === "zwierzeca" && <Zwierzeca />}
    </svg>
  );
}

function Mala() {
  return (
    <>
      <circle cx="310" cy="62" r="26" fill={SUN} />
      <path d="M0 170 Q70 105 140 160 Q200 110 270 155 Q330 120 400 150 V220 H0Z" fill={FAR} />
      <path d="M0 190 Q90 130 190 185 Q280 140 400 180 V220 H0Z" fill={MID} />
      <path d="M0 205 Q120 180 230 205 Q320 190 400 200 V220 H0Z" fill={NEAR} />
      <Tree x={70} y={170} s={0.8} />
      <Tree x={95} y={175} s={0.6} />
      <Tree x={320} y={178} s={0.7} />
    </>
  );
}

function Duza() {
  return (
    <g transform="translate(0 28)">
      <circle cx="330" cy="30" r="22" fill={SUN} />
      <path d="M-20 220 L90 110 L150 160 L210 120 L300 220Z" fill={FAR} />
      <path d="M90 220 L230 40 L370 220Z" fill={MID} />
      <path d="M230 40 L262 81 L246 76 L232 92 L218 76 L200 80Z" fill={SNOW} />
      <path d="M260 220 L340 120 L420 220Z" fill={FAR} />
      <path d="M0 200 Q100 185 200 200 T400 198 V220 H0Z" fill={NEAR} />
      <path d="M228 40 V18 L246 25 L228 31" fill="none" stroke={NEAR} strokeWidth="3" strokeLinejoin="round" />
    </g>
  );
}

function Kopa() {
  return (
    <>
      <circle cx="345" cy="45" r="18" fill={SUN} />
      <path
        d="M0 150 L25 110 L45 135 L70 95 L95 130 L120 100 L145 128 L170 90 L195 125 L220 98 L245 130 L270 92 L295 128 L320 104 L345 132 L370 100 L400 135 V220 H0Z"
        fill={FAR}
      />
      <path
        d="M0 180 L30 135 L55 165 L85 120 L115 160 L145 125 L175 165 L205 118 L235 160 L265 128 L295 165 L325 125 L355 160 L385 135 L400 150 V220 H0Z"
        fill={MID}
      />
      <path
        d="M0 210 L40 170 L70 195 L105 160 L140 195 L175 165 L210 198 L245 162 L280 195 L315 168 L350 198 L380 172 L400 185 V220 H0Z"
        fill={NEAR}
      />
      {[[85, 120], [205, 118], [325, 125]].map(([x, y]) => (
        <path key={x} d={`M${x} ${y} l9 12 h-18z`} fill={SNOW} />
      ))}
    </>
  );
}

function Zwierzeca() {
  const prints: [number, number, number][] = [
    [60, 196, -20], [100, 182, -10], [140, 170, -25], [180, 154, -15], [215, 142, -30], [250, 128, -20],
  ];
  return (
    <>
      <circle cx="330" cy="50" r="20" fill={SUN} />
      <path d="M140 220 L290 70 L440 220Z" fill={FAR} />
      <path d="M-20 220 L90 120 L200 220Z" fill={FAR} />
      <path d="M0 200 Q120 160 240 190 T400 175 V220 H0Z" fill={MID} />
      <Tree x={330} y={172} s={0.9} />
      <Tree x={358} y={170} s={0.7} />
      <Tree x={30} y={190} s={0.6} />
      {prints.map(([x, y, r], i) => (
        <Paw key={i} x={x} y={y} r={r} />
      ))}
    </>
  );
}

function Paw({ x, y, r }: { x: number; y: number; r: number }) {
  return (
    <g transform={`translate(${x} ${y}) rotate(${r + 90}) scale(0.9)`} fill={NEAR}>
      <ellipse cx="0" cy="4" rx="7" ry="6" />
      <circle cx="-8" cy="-5" r="3" />
      <circle cx="-3" cy="-9" r="3" />
      <circle cx="3" cy="-9" r="3" />
      <circle cx="8" cy="-5" r="3" />
    </g>
  );
}

function Tree({ x, y, s }: { x: number; y: number; s: number }) {
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`}>
      <rect x="-3" y="0" width="6" height="12" fill="#6b4f2a" />
      <path d="M0 -40 L18 -12 H-18Z M0 -28 L22 4 H-22Z" fill={NEAR} />
    </g>
  );
}
