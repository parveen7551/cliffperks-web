'use client';

/* ── GE Appliances ────────────────────────────────────── */
export function GECard() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.5rem' }}>
      <svg width="80" height="80" viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg">
        {/* Outer navy disc */}
        <circle cx="40" cy="40" r="38" fill="#1B3A7A" />
        {/* Subtle inner ring */}
        <circle cx="40" cy="40" r="31" fill="none" stroke="rgba(255,255,255,0.2)" strokeWidth="1" />
        {/* Corner flourish arcs */}
        <path d="M40 9 C32 12 27 18 27 18" stroke="rgba(255,255,255,0.28)" strokeWidth="1.5" strokeLinecap="round" fill="none" />
        <path d="M40 9 C48 12 53 18 53 18" stroke="rgba(255,255,255,0.28)" strokeWidth="1.5" strokeLinecap="round" fill="none" />
        <path d="M40 71 C32 68 27 62 27 62" stroke="rgba(255,255,255,0.28)" strokeWidth="1.5" strokeLinecap="round" fill="none" />
        <path d="M40 71 C48 68 53 62 53 62" stroke="rgba(255,255,255,0.28)" strokeWidth="1.5" strokeLinecap="round" fill="none" />
        {/* "ge" italic script */}
        <text x="22" y="49" fontFamily="Georgia,'Times New Roman',serif" fontStyle="italic" fontSize="28" fontWeight="bold" fill="white">ge</text>
      </svg>
      <span style={{ fontWeight: 800, fontSize: '0.75rem', letterSpacing: '0.1em', color: '#1B3A7A', textTransform: 'uppercase' }}>
        GE Appliances Store
      </span>
    </div>
  );
}

/* ── Vitamix ──────────────────────────────────────────── */
export function VitamixCard() {
  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.625rem' }}>
      {/* Pinwheel icon — 6 static pre-rotated blades */}
      <svg width="38" height="38" viewBox="0 0 38 38" fill="none" xmlns="http://www.w3.org/2000/svg">
        <g transform="translate(19,19)">
          <path d="M0 0 C3-5 5-13 2-17 C6-12 14-8 17-2" stroke="#9ca3af" strokeWidth="4.5" strokeLinecap="round" fill="none" />
          <path d="M0 0 C5 3 13 5 17 2 C12 6 8 14 2 17" stroke="#9ca3af" strokeWidth="4.5" strokeLinecap="round" fill="none" />
          <path d="M0 0 C3 5 5 13 2 17 C-2 12-8 8-2 2" stroke="#9ca3af" strokeWidth="4.5" strokeLinecap="round" fill="none" />
          <path d="M0 0 C-3 5-5 13-2 17 C-6 12-14 8-17 2" stroke="#9ca3af" strokeWidth="4.5" strokeLinecap="round" fill="none" />
          <path d="M0 0 C-5-3-13-5-17-2 C-12-6-8-14-2-17" stroke="#9ca3af" strokeWidth="4.5" strokeLinecap="round" fill="none" />
          <path d="M0 0 C-3-5-5-13-2-17 C2-12 8-8 2-2" stroke="#9ca3af" strokeWidth="4.5" strokeLinecap="round" fill="none" />
          <circle r="4" fill="#9ca3af" />
        </g>
      </svg>
      {/* Wordmark */}
      <svg width="96" height="34" viewBox="0 0 96 34" fill="none" xmlns="http://www.w3.org/2000/svg">
        <text x="0" y="26" fontFamily="Arial,Helvetica,sans-serif" fontWeight="900" fontSize="28" fill="#C8102E" letterSpacing="-0.5">Vitamix</text>
        <text x="91" y="26" fontFamily="Arial,Helvetica,sans-serif" fontWeight="900" fontSize="28" fill="#C8102E">.</text>
      </svg>
    </div>
  );
}

/* ── HexClad ──────────────────────────────────────────── */
export function HexCladCard() {
  /*
   * Regular hexagon pre-computed for cx=55 cy=46 r=38 (110×110 viewBox)
   * Points rounded to 1 dp to keep the SVG attribute strings stable.
   * outer hex (r=38): 88.9,27 88.9,65 55,84 21.1,65 21.1,27 55,8
   * inner hex (r=29):  80,31.5 80,60.5 55,75 30,60.5 30,31.5 55,17
   */
  return (
    <svg width="110" height="110" viewBox="0 0 110 110" fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* Outer hexagon */}
      <polygon points="88.9,27 88.9,65 55,84 21.1,65 21.1,27 55,8" stroke="#111" strokeWidth="4" fill="none" strokeLinejoin="round" />
      {/* Inner hexagon */}
      <polygon points="80,31.5 80,60.5 55,75 30,60.5 30,31.5 55,17" stroke="#111" strokeWidth="2.5" fill="none" strokeLinejoin="round" />
      {/* HC monogram */}
      <text x="55" y="56" textAnchor="middle" fontFamily="'Arial Black',Arial,sans-serif" fontWeight="900" fontSize="22" fill="#111" letterSpacing="-1">HC</text>
      {/* HEXCLAD wordmark */}
      <text x="55" y="101" textAnchor="middle" fontFamily="'Arial Black',Arial,sans-serif" fontWeight="900" fontSize="15" fill="#111" letterSpacing="2">HEXCLAD</text>
    </svg>
  );
}
