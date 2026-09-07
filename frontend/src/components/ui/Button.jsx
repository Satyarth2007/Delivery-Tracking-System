export default function Button({ variant = "primary", href, className = "", children, ...props }) {
  const base = "inline-flex items-center rounded-md text-[14.5px] font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed";
  const variants = {
    primary: "bg-blue px-5 py-2.5 font-semibold text-[#0B1220] hover:bg-[#6BA0FF]",
    ghost: "border border-line px-5 py-2.5 text-muted hover:border-muted hover:text-fg",
  };
  const classes = `${base} ${variants[variant]} ${className}`;

  if (href) {
    return <a href={href} className={classes} {...props}>{children}</a>;
  }
  return <button className={classes} {...props}>{children}</button>;
}