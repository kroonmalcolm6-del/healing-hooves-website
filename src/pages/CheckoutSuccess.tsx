import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Nav } from "../components/Nav";
import { useAuth } from "../lib/auth";

// Stripe's success_url points here. The webhook usually lands within a second
// or two, so we poll refreshAccess briefly rather than trusting the redirect alone.
export function CheckoutSuccess() {
  const { hasAccess, refreshAccess } = useAuth();
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    let attempts = 0;
    const interval = setInterval(async () => {
      attempts += 1;
      await refreshAccess();
      if (attempts >= 6) {
        clearInterval(interval);
        setChecking(false);
      }
    }, 1500);
    return () => clearInterval(interval);
  }, [refreshAccess]);

  useEffect(() => {
    if (hasAccess) setChecking(false);
  }, [hasAccess]);

  return (
    <div className="min-h-screen bg-bone">
      <Nav />
      <div className="mx-auto max-w-sm px-6 py-24 text-center">
        {hasAccess ? (
          <>
            <h1 className="font-display text-2xl font-semibold text-soil">You're in</h1>
            <p className="mt-3 font-body text-soil/70">
              Payment confirmed — your dashboard is unlocked.
            </p>
            <Link
              to="/dashboard/clips"
              className="mt-6 inline-block rounded-full bg-redoxide px-6 py-3 font-body font-medium text-bone transition hover:bg-redoxide/90"
            >
              Go to dashboard
            </Link>
          </>
        ) : (
          <>
            <h1 className="font-display text-2xl font-semibold text-soil">
              {checking ? "Confirming payment…" : "Still confirming"}
            </h1>
            <p className="mt-3 font-body text-soil/70">
              {checking
                ? "This usually takes a few seconds."
                : "If this doesn't update shortly, refresh — Stripe can occasionally take a minute to confirm."}
            </p>
          </>
        )}
      </div>
    </div>
  );
}
