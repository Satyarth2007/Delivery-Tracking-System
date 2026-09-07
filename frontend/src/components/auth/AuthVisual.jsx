export default function AuthVisual({ headline, subtext }) {
  return (
    <div className="relative flex h-full w-full items-center justify-center overflow-hidden px-12">
      <svg viewBox="0 0 600 700" fill="none" className="pointer-events-none absolute inset-0 h-full w-full opacity-[0.15]">
        <g fill="#333A47">
          {[40, 100, 160, 220, 280, 340, 400, 460, 520, 580].map((y) =>
            [40, 100, 160, 220, 280, 340, 400, 460, 520, 580].map((x) => (
              <circle key={`${x}-${y}`} cx={x} cy={y} r="1.4" />
            ))
          )}
        </g>
      </svg>

      <div className="relative z-10 w-full max-w-[380px]">
        {/* One delivery list splitting into three agent routes */}
        <svg viewBox="0 0 380 260" fill="none" className="mb-10 w-full">
          {/* route 1 — agent A */}
          <path
            d="M190,230 L110,175 L60,140 L30,70"
            pathLength="100"
            className="route-split-1"
            stroke="#4C8DFF"
            strokeWidth="2.5"
            fill="none"
          />
          {/* route 2 — agent B */}
          <path
            d="M190,230 L190,150 L190,110 L170,40"
            pathLength="100"
            className="route-split-2"
            stroke="#F0AB4D"
            strokeWidth="2.5"
            fill="none"
          />
          {/* route 3 — agent C */}
          <path
            d="M190,230 L270,175 L320,140 L350,70"
            pathLength="100"
            className="route-split-3"
            stroke="#3FBA7C"
            strokeWidth="2.5"
            fill="none"
          />

          {/* depot — shared origin */}
          <rect x="176" y="216" width="28" height="28" rx="6" fill="#12151B" stroke="#9AA3B2" strokeWidth="1.6" />
          <path
            d="M182 230 L190 222 L198 230 M185 230 V240 H195 V230"
            stroke="#9AA3B2"
            strokeWidth="1.6"
            fill="none"
            strokeLinejoin="round"
          />

          {/* stop markers */}
          <circle cx="60" cy="140" r="5" fill="#4C8DFF" />
          <circle cx="30" cy="70" r="5" fill="#4C8DFF" />
          <circle cx="190" cy="110" r="5" fill="#F0AB4D" />
          <circle cx="170" cy="40" r="5" fill="#F0AB4D" />
          <circle cx="320" cy="140" r="5" fill="#3FBA7C" />
          <circle cx="350" cy="70" r="5" fill="#3FBA7C" />

          {/* per-agent tags */}
          <g transform="translate(14, 48)">
            <rect width="30" height="18" rx="9" fill="#4C8DFF" opacity="0.15" stroke="#4C8DFF" strokeWidth="1" />
            <text x="15" y="13" fill="#4C8DFF" fontFamily="IBM Plex Mono" fontSize="10" textAnchor="middle">A1</text>
          </g>
          <g transform="translate(155, 18)">
            <rect width="30" height="18" rx="9" fill="#F0AB4D" opacity="0.15" stroke="#F0AB4D" strokeWidth="1" />
            <text x="15" y="13" fill="#F0AB4D" fontFamily="IBM Plex Mono" fontSize="10" textAnchor="middle">A2</text>
          </g>
          <g transform="translate(336, 48)">
            <rect width="30" height="18" rx="9" fill="#3FBA7C" opacity="0.15" stroke="#3FBA7C" strokeWidth="1" />
            <text x="15" y="13" fill="#3FBA7C" fontFamily="IBM Plex Mono" fontSize="10" textAnchor="middle">A3</text>
          </g>
        </svg>

        <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-line bg-ink/60 px-4 py-2">
          <div className="flex h-6 w-6 items-center justify-center rounded-full bg-green/15">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#3FBA7C" strokeWidth="3">
              <path d="M20 6L9 17l-5-5" />
            </svg>
          </div>
          <span className="font-mono text-[13px] text-fg">Verified with OTP · 4821</span>
        </div>

        <h2 className="mb-3 text-[28px] leading-tight text-fg">{headline}</h2>
        <p className="max-w-[360px] text-[14.5px] text-muted">{subtext}</p>
      </div>
    </div>
  );
}