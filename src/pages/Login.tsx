import { FormEvent, useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { Nav } from "../components/Nav";
import { useAuth } from "../lib/auth";

export function Login() {
  const { signIn } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const from = (location.state as { from?: string })?.from ?? "/steps";
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    const { error } = await signIn(email, password);
    setLoading(false);
    if (error) { setError(error); return; }
    navigate(from, { replace: true });
  };

  return (
    <div className="min-h-screen bg-bone">
      <Nav />
      <div className="mx-auto max-w-sm px-6 py-20">
        <h1 className="font-display text-2xl font-black text-soil mb-2">Member login</h1>
        <p className="font-body text-sm text-soil/50 mb-8">
          New member?{" "}
          <Link to="/signup" className="text-redoxide underline-offset-4 hover:underline">
            Create an account here
          </Link>
        </p>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="font-mono text-[10px] uppercase tracking-wide text-soil/50">Email</label>
            <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)}
              className="mt-1 w-full rounded-xl border border-soil/15 bg-white px-4 py-3 font-body text-sm text-soil outline-none focus:border-redoxide" />
          </div>
          <div>
            <label className="font-mono text-[10px] uppercase tracking-wide text-soil/50">Password</label>
            <input type="password" required value={password} onChange={(e) => setPassword(e.target.value)}
              className="mt-1 w-full rounded-xl border border-soil/15 bg-white px-4 py-3 font-body text-sm text-soil outline-none focus:border-redoxide" />
          </div>
          {error && <p className="font-body text-sm text-red-600">{error}</p>}
          <button type="submit" disabled={loading}
            className="w-full rounded-full bg-soil px-6 py-3 font-display font-black text-redoxide transition hover:bg-shutter disabled:opacity-50">
            {loading ? "Logging in…" : "Log in"}
          </button>
        </form>
      </div>
    </div>
  );
}
