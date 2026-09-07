export default function StepCard({ number, title, description, isLast }) {
  return (
    <div className={`border-line py-7 ${!isLast ? "border-b md:border-b-0 md:border-r md:pr-7" : ""}`}>
      <div className="mb-4 font-mono text-[13px] text-blue">{number}</div>
      <h3 className="mb-2.5 text-[18px]">{title}</h3>
      <p className="text-[14.5px] text-muted">{description}</p>
    </div>
  );
}