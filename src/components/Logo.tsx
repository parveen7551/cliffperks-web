interface LogoProps {
  height?: number;
  showText?: boolean;
}

export default function Logo({ height = 36, showText = false }: LogoProps) {
  const iconH = height;
  const iconW = Math.round(height * (200 / 185));

  return (
    <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem' }}>
      {/* Icon mark */}
      <svg
        width={iconW}
        height={iconH}
        viewBox="0 0 200 185"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
      >
        {/* Orange semicircle — left cliff / sun */}
        <path d="M 2 185 A 76 76 0 0 1 154 185 Z" fill="#F5941D" />

        {/* Dark navy mountain — right peak */}
        <polygon points="44,185 200,185 134,68" fill="#1E2B4A" />

        {/* Red circle — left person */}
        <circle cx="78" cy="44" r="32" fill="#E53030" />

        {/* Blue circle — right person, sits on mountain peak */}
        <circle cx="134" cy="42" r="28" fill="#2B57A4" />
      </svg>

      {showText && (
        <span style={{
          fontSize: `${Math.round(height * 0.55)}px`,
          fontWeight: 800,
          letterSpacing: '-0.03em',
          lineHeight: 1,
        }}>
          <span style={{ color: '#1E2B4A' }}>Cliff</span>
          <span style={{ color: '#F5941D' }}>Perks</span>
        </span>
      )}
    </span>
  );
}
