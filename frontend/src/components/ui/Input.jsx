export default function Input({ label, error, ...props }) {
  return (
    <label className="mb-4 block">
      {label && <span className="mb-1.5 block text-[13px] text-muted">{label}</span>}
      <input
        className={`w-full rounded-md border bg-ink px-3.5 py-2.5 text-[14.5px] text-fg placeholder:text-muted/60 focus:outline-none focus:ring-1 focus:ring-blue ${
          error ? "border-red" : "border-line"
        }`}
        {...props}
      />
      {error && <span className="mt-1.5 block text-[12.5px] text-red">{error}</span>}
    </label>
  );
}