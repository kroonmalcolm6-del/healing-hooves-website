import { FormEvent, useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { Nav } from "../components/Nav";
import { useAuth } from "../lib/auth";

export function Signup() {
  const { signUp } = useAuth();
  const navigate = useNavigate();
  const [params] = useSearchParams();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [done, setDone] = useState(false);
  const [loading, setLoading] = useState(false);

  const next = params.get("next");

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    const { error } = await signUp(email, password);
    setLoading(false);
    if (error) {
      setError(error);
      return;
    }
    setDone(true);
  };

  if (done) {
    return (
      <div className="min-h-screen bg-bone">
        <Nav />
        <div className="mx-auto max-w-sm px-6 py-20 text-center">
          <h1 className="font-display text-2xl font-semibold text-soil">Check your email</h1>
          <p className="mt-3 font-body text-soil/70">
            We've sent a confirmation link. Once you've confirmed,{" "}
            <Link
              to={next === "checkout" ? "/?checkout=required" : "/login"}
              className="text-redoxide underline-offset-4 hover:underline"
            >
              log in here
            </Link>
            {next === "checkout" && " to finish your purchase"}.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-bone">
      <Nav />
      <div className="mx-auto max-w-sm px-6 py-20">
        <h1 className="font-display text-2xl font-semibold text-soil">Create an account</h1>
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
              minLength={6}
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
            {loading ? "Creating account…" : "Create account"}
          </button>
        </form>

        <p className="mt-6 font-body text-sm text-soil/60">
          Already have an account?{" "}
          <Link to="/login" className="text-redoxide underline-offset-4 hover:underline">
            Log in
          </Link>
        </p>
      </div>
    </div>
  );
}
