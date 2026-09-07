export default function AudienceCard({ title, description, icon }) {
  return (
    <div className="rounded-2xl border border-line bg-surface p-7">
      <div className="mb-5 flex h-11 w-11 items-center justify-center rounded-[10px] bg-blue/10">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#4C8DFF" strokeWidth="1.8">
          {icon}
        </svg>
      </div>
      <h4 className="mb-2 font-display text-[16.5px] font-semibold">{title}</h4>
      <p className="text-[14px] text-muted">{description}</p>
    </div>
  );
}