import { Link } from "react-router-dom";
import AuthVisual from "./AuthVisual.jsx";

export default function AuthLayout({ children, visualHeadline, visualSubtext }) {
  return (
    <div className="relative flex min-h-screen bg-ink">
      <Link
        to="/"
        className="absolute left-6 top-6 z-20 flex items-center gap-2 font-display text-[17px] font-bold text-fg"
      >
        <span className="h-[9px] w-[9px] rounded-full bg-blue shadow-[0_0_0_3px_rgba(76,141,255,0.2)]" />
        Routify
      </Link>

      <div className="relative hidden w-1/2 border-r border-line bg-surface lg:block">
        <AuthVisual headline={visualHeadline} subtext={visualSubtext} />
      </div>

      <div className="flex w-full flex-col items-center justify-center px-4 py-20 lg:w-1/2">
        <div className="w-full max-w-[400px]">{children}</div>
      </div>
    </div>
  );
}