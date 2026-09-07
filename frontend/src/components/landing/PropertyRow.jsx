export default function PropertyRow({ label, value, isLast }) {
  return (
    <div className={`flex items-center justify-between px-6 py-5 ${!isLast ? "border-b border-line" : ""}`}>
      <span className="text-[14px] text-muted">{label}</span>
      <span className="text-right text-[14.5px] font-medium text-fg">{value}</span>
    </div>
  );
}