export default function AuthCard({ title, subtitle, children, footer }) {
  return (
    <div>
      <div className="rounded-2xl border border-line bg-surface p-8">
        <h1 className="mb-1.5 text-[22px]">{title}</h1>
        {subtitle && <p className="mb-6 text-[14px] text-muted">{subtitle}</p>}
        {children}
      </div>
      {footer && <div className="mt-6 text-center text-[13.5px] text-muted">{footer}</div>}
    </div>
  );
}