import { FormEvent, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Nav } from "../components/Nav";
import { useAuth } from "../lib/auth";

export function Login() {
  const { signIn } = useAuth();
  const navigate = useNavigate();
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
    if (error) {
      setError(error);
      return;
    }
    navigate("/dashboard/clips");
  };

  return (
    <div className="min-h-screen bg-bone">
      <Nav />
      <div className="mx-auto max-w-sm px-6 py-20">
        <h1 className="font-display text-2xl font-semibold text-soil">Log in</h1>
        <form onSubmit={handleSubmit} className="mt-8 space-y-4">
          <div>
            <label className="font-mono text-xs uppercase tracking-wide text-soil/60">
              Email
            </label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="mt-1 w-full rounded-lg border border-soil/20 bg-white px-4 py-2.5 font-body text-soil outline-none focus:border-redoxide"
            />
          </div>
          <div>
            <label className="font-mono text-xs uppercase tracking-wide text-soil/60">
              Password
            </label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="mt-1 w-full rounded-lg border border-soil/20 bg-white px-4 py-2.5 font-body text-soil outline-none focus:border-redoxide"
            />
          </div>

          {error && <p className="font-body text-sm text-redoxide">{error}</p>}

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-full bg-redoxide px-6 py-3 font-body font-medium text-bone transition hover:bg-redoxide/90 disabled:opacity-60"
          >
            {loading ? "Logging in…" : "Log in"}
          </button>
        </form>

        <p className="mt-6 font-body text-sm text-soil/60">
          Don't have an account?{" "}
          <Link to="/signup" className="text-redoxide underline-offset-4 hover:underline">
            Sign up
          </Link>
        </p>
      </div>
    </div>
  );
}
