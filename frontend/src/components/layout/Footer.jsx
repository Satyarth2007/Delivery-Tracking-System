const columns = [
  {
    heading: "Product",
    links: ["Properties", "Features", "Why Routify", "Who it's for"],
  },
  {
    heading: "Company",
    links: ["About", "Contact", "Careers"],
  },
  {
    heading: "Resources",
    links: ["Documentation", "API Reference", "Support"],
  },
  {
    heading: "Legal",
    links: ["Privacy Policy", "Terms of Service"],
  },
];

export default function Footer() {
  return (
    <footer className="border-t border-line">
      <div className="mx-auto max-w-[1140px] px-8 py-16">
        <div className="grid grid-cols-2 gap-10 md:grid-cols-[1.3fr_1fr_1fr_1fr_1fr]">
          <div>
            <div className="mb-3 flex items-center gap-2 font-display text-[19px] font-bold">
              <span className="h-[9px] w-[9px] rounded-full bg-blue" />
              Routify
            </div>
            <p className="max-w-[220px] text-[13.5px] text-muted">
              Route optimization and delivery verification for small logistics teams.
            </p>
          </div>

          {columns.map((col) => (
            <div key={col.heading}>
              <div className="mb-4 text-[13px] font-semibold text-fg">{col.heading}</div>
              <div className="flex flex-col gap-3">
                {col.links.map((link) => (
                  <a key={link} href="#" className="text-[13.5px] text-muted hover:text-fg">
                    {link}
                  </a>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="border-t border-line">
        <div className="mx-auto flex max-w-[1140px] flex-wrap items-center justify-between gap-3 px-8 py-6 text-[13px] text-muted">
          <span>© {new Date().getFullYear()} Routify. All rights reserved.</span>
          <div className="flex gap-5">
            <a href="#" className="hover:text-fg">Twitter</a>
            <a href="#" className="hover:text-fg">LinkedIn</a>
            <a href="#" className="hover:text-fg">GitHub</a>
          </div>
        </div>
      </div>
    </footer>
  );
}