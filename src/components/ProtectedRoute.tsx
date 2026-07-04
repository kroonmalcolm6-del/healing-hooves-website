import { Navigate } from "react-router-dom";
import { ReactNode } from "react";
import { useAuth } from "../lib/auth";

export function ProtectedRoute({ children }: { children: ReactNode }) {
  const { user, hasAccess, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center font-mono text-sm text-soil/60">
        Checking your access…
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (!hasAccess) {
    return <Navigate to="/?checkout=required" replace />;
  }

  return <>{children}</>;
}
