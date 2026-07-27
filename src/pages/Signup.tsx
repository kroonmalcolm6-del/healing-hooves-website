import { FormEvent, useState } from "react";
import { Link } from "react-router-dom";
import { Eye, EyeOff } from "lucide-react";
import { Nav } from "../components/Nav";
import { useAuth } from "../lib/auth";

export function Signup() {
  const { signUp } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [done, setDone] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    const { error } = await signUp(email, password);
    setLoading(false);
    if (error) { setError(error); return; }
    setDone(true);
  };

  if (done) {
    return (
      <div className="min-h-screen bg-bone">
        <Nav />
        <div className="mx-auto max-w-sm px-6 py-20 text-center">
          <div className="w-14 h-14 rounded-full bg-healed/15 flex items-center justify-center mx-auto mb-6">
            <div className="w-5 h-5 rounded-full bg-healed" />
          </div>
          <h1 className="font-display text-2xl font-black text-soil mb-3">Account created</h1>
          <p className="font-body text-sm leading-relaxed text-soil/60 mb-6">
            Welcome to Healing Hooves. Your account has been created successfully.
            Please wait while the administrator grants you access to the course material —
            you will be able to log in and view the Grazing Plan once your account has been approved.
          </p>
          <p className="font-body text-sm text-soil/40">
            Already approved?{" "}
            <Link to="/login" className="text-redoxide underline-offset-4 hover:underline">
              Log in here
            </Link>
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-bone">
      <Nav />
      <div className="mx-auto max-w-sm px-6 py-20">
        <h1 className="font-display text-2xl font-black text-soil mb-2">Create an account</h1>
        <p className="font-body text-sm text-soil/50 mb-8">
          Already have an account?{" "}
          <Link to="/login" className="text-redoxide underline-offset-4 hover:underline">
            Log in
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
            <div className="relative mt-1">
              <input type={showPassword ? "text" : "password"} required minLength={6} value={password} onChange={(e) => setPassword(e.target.value)}
                className="w-full rounded-xl border border-soil/15 bg-white px-4 py-3 pr-11 font-body text-sm text-soil outline-none focus:border-redoxide" />
              <button type="button" onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-soil/40 hover:text-soil transition">
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>
          {error && <p className="font-body text-sm text-red-600">{error}</p>}
          <button type="submit" disabled={loading}
            className="w-full rounded-full bg-soil px-6 py-3 font-display font-black text-redoxide transition hover:bg-shutter disabled:opacity-50">
            {loading ? "Creating account…" : "Create account"}
          </button>
        </form>
      </div>
    </div>
  );
}
