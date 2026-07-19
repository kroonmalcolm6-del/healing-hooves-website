import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../lib/auth";

export function Nav() {
  const { user, hasAccess, signOut } = useAuth();
  const navigate = useNavigate();

  const handleSignOut = async () => {
    await signOut();
    navigate("/");
  };

  return (
    <header className="sticky top-0 z-50 bg-soil border-b border-white/5">
      <nav className="mx-auto flex max-w-6xl items-center justify-between px-6 py-3.5">
        <Link to="/" className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-full bg-white border border-redoxide/20 overflow-hidden flex items-center justify-center flex-shrink-0">
            <img src="/logo.png" alt="Healing Hooves" className="w-full h-full object-cover" onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }} />
          </div>
          <span className="font-display text-base font-black text-redoxide">Healing Hooves</span>
        </Link>

        <div className="flex items-center gap-5 font-body text-sm">
          <Link to="/steps" className="text-bone/50 transition hover:text-bone/80">
            The 13 Steps
          </Link>

          {user && hasAccess && (
            <Link to="/dashboard/clips" className="text-bone/50 transition hover:text-bone/80">
              Dashboard
            </Link>
          )}

          {!user && (
            <>
              <Link to="/login" className="text-bone/50 transition hover:text-bone/80">
                Log in
              </Link>
              <Link
                to="/#pricing"
                className="rounded-full bg-redoxide px-4 py-2 font-display font-black text-soil text-xs transition hover:bg-redoxide/90"
              >
                Get access
              </Link>
            </>
          )}

          {user && !hasAccess && (
            <Link
              to="/#pricing"
              className="rounded-full bg-redoxide px-4 py-2 font-display font-black text-soil text-xs transition hover:bg-redoxide/90"
            >
              Finish purchase
            </Link>
          )}

          {user && (
            <button
              onClick={handleSignOut}
              className="text-bone/35 transition hover:text-bone/60 text-xs"
            >
              Sign out
            </button>
          )}
        </div>
      </nav>
    </header>
  );
}
