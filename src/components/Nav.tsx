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
    <header className="sticky top-0 z-50 border-b border-soil/10 bg-bone/95 backdrop-blur-sm">
      <nav className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
        <Link to="/" className="font-display text-xl font-semibold tracking-tight text-soil">
          Healing Hooves
        </Link>

        <div className="flex items-center gap-6 font-body text-sm">
          {user && hasAccess && (
            <Link to="/dashboard/clips" className="text-soil/80 transition hover:text-redoxide">
              Dashboard
            </Link>
          )}

          {!user && (
            <>
              <Link to="/login" className="text-soil/80 transition hover:text-redoxide">
                Log in
              </Link>
              <Link
                to="/#pricing"
                className="rounded-full bg-redoxide px-4 py-2 font-medium text-bone transition hover:bg-redoxide/90"
              >
                Get access
              </Link>
            </>
          )}

          {user && !hasAccess && (
            <Link
              to="/#pricing"
              className="rounded-full bg-redoxide px-4 py-2 font-medium text-bone transition hover:bg-redoxide/90"
            >
              Finish purchase
            </Link>
          )}

          {user && (
            <button
              onClick={handleSignOut}
              className="text-soil/50 transition hover:text-soil"
            >
              Sign out
            </button>
          )}
        </div>
      </nav>
    </header>
  );
}
