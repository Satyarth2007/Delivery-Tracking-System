import { Link } from "react-router-dom";
import Button from "../components/ui/Button.jsx";

export default function NotFoundPage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-ink px-4 text-center">
      <Link to="/" className="mb-10 flex items-center gap-2 font-display text-[19px] font-bold text-fg">
        <span className="h-[9px] w-[9px] rounded-full bg-blue shadow-[0_0_0_3px_rgba(76,141,255,0.2)]" />
        Routify
      </Link>

      {/* A small "lost stop" route graphic instead of a generic 404 illustration */}
      <svg viewBox="0 0 200 140" fill="none" className="mb-8 w-[220px]">
        <g opacity="0.35">
          <g fill="#333A47">
            {[20, 60, 100, 140, 180].map((x) =>
              [20, 60, 100].map((y) => <circle key={`${x}-${y}`} cx={x} cy={y} r="1.4" />)
            )}
          </g>
        </g>
        <path
          d="M 20 100 C 50 70, 60 50, 100 40"
          stroke="#4C8DFF"
          strokeWidth="2.5"
          strokeDasharray="6 6"
          fill="none"
        />
        <circle cx="20" cy="100" r="6" fill="#252B36" stroke="#4C8DFF" strokeWidth="1.5" />
        <circle cx="100" cy="40" r="11" fill="#1B2029" stroke="#F1615C" strokeWidth="1.6" />
        <path d="M95 35 L105 45 M105 35 L95 45" stroke="#F1615C" strokeWidth="2" strokeLinecap="round" />
      </svg>

      <div className="mb-2 font-mono text-[13px] text-blue">404</div>
      <h1 className="mb-3 text-[26px] sm:text-[32px]">This stop isn't on the route</h1>
      <p className="mb-8 max-w-[360px] text-[15px] text-muted">
        The page you're looking for doesn't exist, or may have moved.
      </p>
      <Button variant="primary" href="/">Back to home</Button>
    </div>
  );
}