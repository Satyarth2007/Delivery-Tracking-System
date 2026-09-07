const strokeColors = { blue: "#4C8DFF", amber: "#F0AB4D", green: "#3FBA7C" };
const bgClasses = { blue: "bg-blue/10", amber: "bg-amber/10", green: "bg-green/10" };

export default function FeatureRow({ color, title, description, icon }) {
  return (
    <div className="flex flex-1 gap-[18px] rounded-2xl border border-line bg-surface p-[26px]">
      <div className={`flex h-[38px] w-[38px] shrink-0 items-center justify-center rounded-[9px] ${bgClasses[color]}`}>
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={strokeColors[color]} strokeWidth="1.8">
          {icon}
        </svg>
      </div>
      <div>
        <h4 className="mb-1.5 font-display text-[15.5px] font-semibold">{title}</h4>
        <p className="text-[13.5px] text-muted">{description}</p>
      </div>
    </div>
  );
}