export default function ComparisonRow({ label, before, after, isLast }) {
  return (
    <div className={`grid grid-cols-1 gap-2 px-6 py-5 sm:grid-cols-[1fr_1fr_1fr] sm:items-center sm:gap-4 ${!isLast ? "border-b border-line" : ""}`}>
      <span className="text-[13.5px] text-muted">{label}</span>
      <span className="flex items-center gap-2 text-[13.5px] text-red/90">
        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#F1615C" strokeWidth="2.5" className="shrink-0" aria-hidden="true">
          <path d="M18 6L6 18M6 6l12 12" />
        </svg>
        {before}
      </span>
      <span className="flex items-center gap-2 text-[13.5px] font-medium text-fg">
        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#3FBA7C" strokeWidth="2.5" className="shrink-0" aria-hidden="true">
          <path d="M20 6L9 17l-5-5" />
        </svg>
        {after}
      </span>
    </div>
  );
}