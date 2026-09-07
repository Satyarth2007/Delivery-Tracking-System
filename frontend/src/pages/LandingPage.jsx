import Nav from "../components/layout/Nav.jsx";
import Footer from "../components/layout/Footer.jsx";
import Button from "../components/ui/Button.jsx";
import OtpBox from "../components/ui/OtpBox.jsx";
import FeatureRow from "../components/landing/FeatureRow.jsx";
import PropertyRow from "../components/landing/PropertyRow.jsx";
import AudienceCard from "../components/landing/AudienceCard.jsx";
import ComparisonRow from "../components/landing/ComparisonRow.jsx";

const trustItems = [
  "Customer OTP on every drop-off",
  "OSRM-powered — no per-route API billing",
  "Multi-agent stop clustering",
  "Dispatcher-controlled agent accounts",
];

const properties = [
  { label: "Optimization method", value: "Nearest-neighbor + 2-opt refinement" },
  { label: "Delivery verification", value: "Customer-side OTP with dispute window" },
  { label: "Architecture", value: "Multi-tenant, multi-agent" },
  { label: "Mapping & geocoding", value: "OSRM + OpenStreetMap" },
  { label: "Agent onboarding", value: "Dispatcher-invited only" },
  { label: "Deployment", value: "Free-tier ready across the stack" },
];

const audiences = [
  {
    title: "Local couriers & runners",
    description: "Independent riders juggling a dozen stops a day who need the shortest path, not a warehouse-scale fleet tool.",
    icon: <path d="M5 17h14M5 17a2 2 0 100 4 2 2 0 000-4zm14 0a2 2 0 100 4 2 2 0 000-4zM5 17V7a2 2 0 012-2h6l4 4v8" />,
  },
  {
    title: "Small e-commerce sellers",
    description: "Shipping your own orders locally instead of paying courier aggregators, with proof every package landed.",
    icon: <path d="M3 7l9-4 9 4-9 4-9-4zm0 0v10l9 4 9-4V7M12 11v10" />,
  },
  {
    title: "Grocery & pharmacy delivery",
    description: "Time-sensitive drops where a verified OTP matters as much as speed.",
    icon: <path d="M6 2h12l1 5H5l1-5zm-1 5h14l-1 13a2 2 0 01-2 2H8a2 2 0 01-2-2L5 7z" />,
  },
  {
    title: "Regional logistics operators",
    description: "Small teams running several agents across a city who need routes split and clustered automatically.",
    icon: (
      <>
        <circle cx="9" cy="7" r="4" />
        <path d="M23 21v-2a4 4 0 00-3-3.87" />
        <path d="M16 3.13a4 4 0 010 7.75" />
        <path d="M1 21v-2a4 4 0 013-3.87" />
      </>
    ),
  },
];

const comparisons = [
  { label: "Route planning", before: "Manual guesswork", after: "Optimized in seconds" },
  { label: "Proof of delivery", before: "A photo that can be staged", after: "Customer-verified OTP" },
  { label: "Agent access", before: "Anyone can self-register", after: "Dispatcher-invited only" },
  { label: "Disputes", before: "He-said, she-said", after: "Time-stamped verification record" },
  { label: "Multi-customer stops", before: "One address, one delivery", after: "Multiple packages per stop" },
];

export default function LandingPage() {
  return (
    <>
      <Nav />

      {/* Hero */}
      <header className="mx-auto max-w-[1140px] px-4 pb-[60px] pt-14 sm:px-8 md:pt-[88px]">
        <div className="grid grid-cols-1 items-center gap-10 md:grid-cols-[1.05fr_0.95fr] md:gap-14">
          <div>
            <div className="mb-[18px] text-sm font-medium text-blue">
              For couriers and small delivery teams
            </div>
            <h1 className="mb-[22px] max-w-[560px] text-[32px] leading-[1.1] sm:text-[42px] md:text-[52px] md:leading-[1.08]">
              Routes optimized. Deliveries proven.
            </h1>
            <p className="mb-8 max-w-[460px] text-[16px] text-muted sm:text-[17px]">
              Optimized routes for your fleet. Verified by OTP, not a photo that can be staged.
            </p>
            <div className="mb-10 flex flex-wrap gap-3.5">
              <Button variant="primary" href="/register">Start free</Button>
              <Button variant="ghost" href="#properties">See properties</Button>
            </div>
            <div className="flex items-center gap-2 text-[13px] text-muted">
              <span className="h-[5px] w-[5px] shrink-0 rounded-full bg-green" />
              No card required to try it with your first route
            </div>
          </div>

          <div className="relative aspect-[1/0.92] overflow-hidden rounded-2xl border border-line bg-surface">
            <svg viewBox="0 0 420 390" fill="none" className="h-full w-full">
              <g opacity="0.35">
                <g fill="#333A47">
                  {[30, 70, 110, 150, 190, 230, 270, 310, 350, 390].map((y) =>
                    [30, 70, 110, 150, 190, 230, 270, 310, 350, 390].map((x) => (
                      <circle key={`${x}-${y}`} cx={x} cy={y} r="1.4" />
                    ))
                  )}
                </g>
              </g>
              <path
                d="M 60 300 C 100 220, 90 180, 150 160 C 210 140, 220 100, 280 90 C 320 84, 330 70, 360 55"
                stroke="#4C8DFF" strokeWidth="2.5" strokeDasharray="8 7" className="animate-dash"
              />
              <rect x="46" y="286" width="28" height="28" rx="6" fill="#252B36" stroke="#4C8DFF" strokeWidth="1.5" />
              <path d="M52 300 L60 293 L68 300 M55 300 V308 H65 V300" stroke="#4C8DFF" strokeWidth="1.6" fill="none" strokeLinejoin="round" />
              <circle cx="150" cy="160" r="7" fill="#F0AB4D" className="animate-pulse" />
              <circle cx="150" cy="160" r="12" fill="none" stroke="#F0AB4D" strokeWidth="1.2" opacity="0.4" />
              <circle cx="280" cy="90" r="7" fill="#4C8DFF" />
              <circle cx="360" cy="55" r="13" fill="#1B2029" stroke="#3FBA7C" strokeWidth="1.6" />
              <path d="M354 55 L358.5 60 L367 49" stroke="#3FBA7C" strokeWidth="2.2" fill="none" strokeLinecap="round" strokeLinejoin="round" />
              <g transform="translate(240, 260)">
                <rect width="112" height="42" rx="9" fill="#1B2029" stroke="#333A47" />
                <circle cx="20" cy="21" r="7" fill="#3FBA7C" opacity="0.9" />
                <path d="M17 21 L19.5 23.5 L24 18" stroke="#12151B" strokeWidth="1.6" fill="none" strokeLinecap="round" strokeLinejoin="round" />
                <text x="38" y="18" fill="#9AA3B2" fontFamily="Inter" fontSize="9">Verified with</text>
                <text x="38" y="30" fill="#F0F1F3" fontFamily="IBM Plex Mono" fontSize="11" fontWeight="500">OTP · 4821</text>
              </g>
            </svg>
          </div>
        </div>
      </header>

      {/* Trust strip */}
      <div className="border-y border-line py-[26px]">
        <div className="mx-auto flex max-w-[1140px] flex-wrap justify-center gap-x-8 gap-y-3.5 px-4 text-sm text-muted sm:px-8">
          {trustItems.map((text) => (
            <div className="flex items-center gap-[9px]" key={text}>
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#3FBA7C" strokeWidth="2" className="shrink-0">
                <path d="M20 6L9 17l-5-5" />
              </svg>
              {text}
            </div>
          ))}
        </div>
      </div>

      {/* Route generation animation */}
      <section className="mx-auto max-w-[1140px] px-4 py-16 sm:px-8 md:py-24">
        <div className="mb-12 max-w-[560px]">
          <h2 className="mb-3.5 text-[26px] sm:text-[34px]">Watch the shortest path find itself</h2>
          <p className="text-base text-muted">
            The same six stops, two ways — a naive route that backtracks across town, and what
            2-opt refinement finds instead.
          </p>
        </div>

        <div className="overflow-hidden rounded-2xl border border-line bg-surface">
          <div className="relative">
            <svg viewBox="0 0 420 390" fill="none" className="mx-auto w-full max-w-[560px]">
              <g opacity="0.3">
                <g fill="#333A47">
                  {[30, 70, 110, 150, 190, 230, 270, 310, 350, 390].map((y) =>
                    [30, 70, 110, 150, 190, 230, 270, 310, 350, 390].map((x) => (
                      <circle key={`${x}-${y}`} cx={x} cy={y} r="1.4" />
                    ))
                  )}
                </g>
              </g>

              <path
                d="M60,300 L280,90 L180,280 L360,55 L150,160 L320,220 L60,300"
                pathLength="100"
                className="route-naive"
                stroke="#F1615C"
                strokeWidth="2.5"
                fill="none"
              />

              <path
                d="M60,300 L180,280 L320,220 L360,55 L280,90 L150,160 L60,300"
                pathLength="100"
                className="route-optimized"
                stroke="#3FBA7C"
                strokeWidth="2.5"
                fill="none"
              />

              {[
                [60, 300], [150, 160], [280, 90], [360, 55], [320, 220], [180, 280],
              ].map(([cx, cy], i) => (
                <circle key={i} cx={cx} cy={cy} r="6" fill="#F0F1F3" stroke="#12151B" strokeWidth="2" />
              ))}
            </svg>

            {/* On md+ there's room to float these over the graphic.
                Below md they'd overlap each other and the route lines,
                so they move into normal flow instead — see the block below. */}
            <div className="label-naive absolute left-6 top-6 hidden rounded-lg border border-red/40 bg-red/10 px-3 py-2 text-[13px] text-red md:block">
              Unoptimized — 4.8 km
            </div>
            <div className="label-optimized absolute right-6 top-6 hidden rounded-lg border border-green/40 bg-green/10 px-3 py-2 text-[13px] text-green md:block">
              Optimized — 3.1 km · <span className="font-semibold">−35%</span>
            </div>
          </div>

          {/* Mobile-only: same info, stacked below the graphic instead of floating on top of it */}
          <div className="flex flex-col gap-2 border-t border-line p-4 md:hidden">
            <div className="label-naive rounded-lg border border-red/40 bg-red/10 px-3 py-2 text-[13px] text-red">
              Unoptimized — 4.8 km
            </div>
            <div className="label-optimized rounded-lg border border-green/40 bg-green/10 px-3 py-2 text-[13px] text-green">
              Optimized — 3.1 km · <span className="font-semibold">−35%</span>
            </div>
          </div>
        </div>
      </section>

      {/* Properties */}
      <section id="properties" className="mx-auto max-w-[1140px] px-4 py-16 sm:px-8 md:py-24">
        <div className="mb-12 max-w-[540px]">
          <h2 className="mb-3.5 text-[26px] sm:text-[34px]">What Routify actually is</h2>
          <p className="text-base text-muted">The core properties of the system, at a glance.</p>
        </div>
        <div className="overflow-hidden rounded-2xl border border-line">
          {properties.map((p, i) => (
            <PropertyRow key={p.label} {...p} isLast={i === properties.length - 1} />
          ))}
        </div>
      </section>

      {/* Who can use it */}
      <section id="who" className="mx-auto max-w-[1140px] px-4 py-16 sm:px-8 md:py-24">
        <div className="mb-12 max-w-[540px]">
          <h2 className="mb-3.5 text-[26px] sm:text-[34px]">Who it's built for</h2>
          <p className="text-base text-muted">Small operations that need real routing, not enterprise fleet software.</p>
        </div>
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
          {audiences.map((a) => (
            <AudienceCard key={a.title} {...a} />
          ))}
        </div>
      </section>

      {/* Features */}
      <section id="features" className="mx-auto max-w-[1140px] px-4 py-16 sm:px-8 md:py-24">
        <div className="mb-14 max-w-[540px]">
          <h2 className="mb-3.5 text-[26px] sm:text-[34px]">Built around the part everyone else skips</h2>
          <p className="text-base text-muted">
            Optimizing a route is the easy half. Proving it happened is the part that protects your business.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-5 md:grid-cols-[1.15fr_0.85fr]">
          <div className="flex min-h-[340px] flex-col justify-between rounded-2xl border border-line bg-gradient-to-br from-surface to-surface2 p-6 sm:p-10">
            <div>
              <div className="mb-[22px] inline-flex w-fit items-center gap-[7px] rounded-full border border-green/30 bg-green/10 px-[11px] py-[5px] text-[12.5px] text-green">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#3FBA7C" strokeWidth="2.5">
                  <path d="M20 6L9 17l-5-5" />
                </svg>
                Delivery verification
              </div>
              <h3 className="mb-3 max-w-[380px] text-[22px] sm:text-[25px]">A photo can be staged. An OTP can't.</h3>
              <p className="max-w-[400px] text-[15px] text-muted">
                Every drop-off is confirmed by a code sent straight to the customer — not a
                selfie at the doorstep. If something's disputed, there's a window to flag it
                before the record is final.
              </p>
            </div>
            <div className="mt-7 flex gap-2">
              {["4", "8", "2", "1"].map((d, i) => (
                <OtpBox key={i} digit={d} />
              ))}
            </div>
          </div>

          <div className="flex flex-col gap-5">
            <FeatureRow
              color="blue"
              title="Route optimization engine"
              description="Nearest-neighbor construction with 2-opt refinement, tuned for small fleets rather than warehouse-scale VRP."
              icon={
                <path d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l5.447 2.724A1 1 0 0021 18.618V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
              }
            />
            <FeatureRow
              color="amber"
              title="Multi-agent assignment"
              description="Split one delivery list across several agents, with stops clustered so nobody's crossing town twice."
              icon={
                <>
                  <circle cx="9" cy="7" r="4" />
                  <path d="M23 21v-2a4 4 0 00-3-3.87" />
                  <path d="M16 3.13a4 4 0 010 7.75" />
                  <path d="M1 21v-2a4 4 0 013-3.87" />
                </>
              }
            />
            <FeatureRow
              color="green"
              title="Live map tracking"
              description="Watch the route unfold on an open-map view — no per-load Google Maps billing behind it."
              icon={
                <>
                  <path d="M1 6v16l7-4 8 4 7-4V2l-7 4-8-4z" />
                  <path d="M8 2v16M16 6v16" />
                </>
              }
            />
          </div>
        </div>
      </section>

      {/* Comparison */}
      <section id="compare" className="border-y border-line bg-surface">
        <div className="mx-auto max-w-[1140px] px-4 py-16 sm:px-8 md:py-24">
          <div className="mb-12 max-w-[560px]">
            <h2 className="mb-3.5 text-[26px] sm:text-[34px]">The way deliveries usually go, vs Routify</h2>
            <p className="text-base text-muted">Same fleet, same stops — a different level of proof.</p>
          </div>

          <div className="overflow-hidden rounded-2xl border border-line">
            <div className="hidden grid-cols-[1fr_1fr_1fr] gap-4 border-b border-line bg-ink px-6 py-4 text-[12px] font-semibold uppercase tracking-wide text-muted sm:grid">
              <span></span>
              <span>Without Routify</span>
              <span>With Routify</span>
            </div>
            {comparisons.map((c, i) => (
              <ComparisonRow key={c.label} {...c} isLast={i === comparisons.length - 1} />
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="mx-auto max-w-[1140px] px-4 py-20 text-center sm:px-8 md:py-28">
        <h2 className="mx-auto mb-4 max-w-[620px] text-[24px] sm:text-[32px] md:text-[38px]">
          Stop trusting delivery photos that can be staged.
        </h2>
        <p className="mb-8 text-base text-muted">
          Set up your first delivery list in a few minutes — no card, no commitment.
        </p>
        <Button variant="primary" href="/register">
          Start free
        </Button>
      </section>

      <Footer />
    </>
  );
}