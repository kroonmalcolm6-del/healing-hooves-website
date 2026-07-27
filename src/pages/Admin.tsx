import { useEffect, useState, FormEvent } from "react";
import { Navigate } from "react-router-dom";
import { UserCheck, UserX, Clock, Plus, RefreshCw } from "lucide-react";
import { supabase } from "../lib/supabase";
import { useAuth } from "../lib/auth";
import { Nav } from "../components/Nav";

interface UserRow {
  id: string; email: string; created_at: string;
  has_purchase: boolean; is_pre_approved: boolean;
  purchase: { stripe_session_id: string; created_at: string } | null;
  pre_approval: { note: string; created_at: string } | null;
}
interface PendingRow { email: string; note: string; created_at: string; }

export function Admin() {
  const { user, isAdmin, loading } = useAuth();
  const [users, setUsers] = useState<UserRow[]>([]);
  const [pending, setPending] = useState<PendingRow[]>([]);
  const [loadingData, setLoadingData] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [grantEmail, setGrantEmail] = useState("");
  const [grantNote, setGrantNote] = useState("");
  const [granting, setGranting] = useState(false);
  const [grantMsg, setGrantMsg] = useState<string | null>(null);

  const loadUsers = async () => {
    setLoadingData(true); setError(null);
    const { data, error: err } = await supabase.functions.invoke("admin-action", { body: { action: "list" } });
    if (err || !data) { setError("Could not load users. Deploy the admin-action edge function first."); }
    else { setUsers(data.users ?? []); setPending(data.pendingPreApproved ?? []); }
    setLoadingData(false);
  };

  useEffect(() => { if (!loading && isAdmin) loadUsers(); }, [loading, isAdmin]);

  const handleGrant = async (e: FormEvent) => {
    e.preventDefault();
    if (!grantEmail.trim()) return;
    setGranting(true); setGrantMsg(null);
    const { data, error: err } = await supabase.functions.invoke("admin-action", {
      body: { action: "grant", email: grantEmail.trim(), note: grantNote.trim() || "Manual grant" }
    });
    setGranting(false);
    if (err || !data?.ok) { setGrantMsg("Failed — deploy the edge function first."); }
    else {
      setGrantMsg(data.signedUp ? `Access granted to ${grantEmail}.` : `${grantEmail} pre-approved — access activates when they sign up.`);
      setGrantEmail(""); setGrantNote(""); loadUsers();
    }
  };

  const handleRevoke = async (userId: string, email: string) => {
    if (!confirm(`Revoke access for ${email}?`)) return;
    await supabase.functions.invoke("admin-action", { body: { action: "revoke", userId, email } });
    loadUsers();
  };

  if (loading) return null;
  if (!user) return <Navigate to="/login" replace />;
  if (!isAdmin) return <div className="min-h-screen bg-bone flex items-center justify-center"><p className="font-body text-soil/50">Not authorised.</p></div>;

  const withAccess = users.filter((u) => u.has_purchase || u.is_pre_approved);
  const withoutAccess = users.filter((u) => !u.has_purchase && !u.is_pre_approved);

  return (
    <div className="min-h-screen bg-bone">
      <Nav />
      <div className="mx-auto max-w-4xl px-6 py-12">
        <div className="flex items-center justify-between mb-8">
          <div>
            <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-healed mb-1">Admin</p>
            <h1 className="font-display text-2xl font-black text-soil">Access Management</h1>
          </div>
          <button onClick={loadUsers} className="flex items-center gap-2 font-body text-sm text-soil/50 hover:text-soil transition">
            <RefreshCw size={14} /> Refresh
          </button>
        </div>

        <div className="grid grid-cols-3 gap-4 mb-10">
          {[{ label: "Total accounts", value: users.length }, { label: "Have access", value: withAccess.length }, { label: "Pre-approved (pending signup)", value: pending.length }].map((s) => (
            <div key={s.label} className="rounded-xl bg-white border border-soil/[0.08] p-5">
              <p className="font-mono text-[10px] uppercase tracking-wide text-soil/40 mb-1">{s.label}</p>
              <p className="font-display text-3xl font-black text-soil">{s.value}</p>
            </div>
          ))}
        </div>

        <div className="rounded-2xl bg-soil p-6 mb-10">
          <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-redoxide/70 mb-2">Grant access</p>
          <p className="font-body text-sm text-bone/55 mb-5">Works for existing members or pre-approves people who have not signed up yet.</p>
          <form onSubmit={handleGrant} className="flex flex-wrap gap-3">
            <input type="email" required placeholder="email@example.com" value={grantEmail} onChange={(e) => setGrantEmail(e.target.value)}
              className="flex-1 min-w-[200px] rounded-lg border border-bone/10 bg-bone/5 px-3 py-2.5 font-body text-sm text-bone placeholder:text-bone/30 outline-none focus:border-redoxide" />
            <input type="text" placeholder="Note e.g. Attended May 2025 course" value={grantNote} onChange={(e) => setGrantNote(e.target.value)}
              className="flex-1 min-w-[200px] rounded-lg border border-bone/10 bg-bone/5 px-3 py-2.5 font-body text-sm text-bone placeholder:text-bone/30 outline-none focus:border-redoxide" />
            <button type="submit" disabled={granting}
              className="flex items-center gap-2 rounded-lg bg-redoxide px-5 py-2.5 font-display font-black text-soil text-sm transition hover:bg-redoxide/90 disabled:opacity-50">
              <Plus size={15} /> {granting ? "Granting…" : "Grant access"}
            </button>
          </form>
          {grantMsg && <p className="mt-3 font-body text-sm text-redoxide/80">{grantMsg}</p>}
        </div>

        {error && <div className="rounded-xl bg-red-50 border border-red-200 p-4 mb-6 font-body text-sm text-red-700">{error}</div>}

        {pending.length > 0 && (
          <div className="mb-8">
            <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-soil/40 mb-3">Pre-approved — awaiting signup</p>
            <div className="rounded-xl border border-soil/[0.08] overflow-hidden">
              <table className="w-full text-left font-body text-sm">
                <thead className="bg-soil/[0.03]"><tr>
                  <th className="px-4 py-3 font-medium text-soil/50 text-xs uppercase tracking-wide">Email</th>
                  <th className="px-4 py-3 font-medium text-soil/50 text-xs uppercase tracking-wide">Note</th>
                  <th className="px-4 py-3 font-medium text-soil/50 text-xs uppercase tracking-wide">Date</th>
                  <th className="px-4 py-3" />
                </tr></thead>
                <tbody>
                  {pending.map((p) => (
                    <tr key={p.email} className="border-t border-soil/[0.06]">
                      <td className="px-4 py-3 text-soil">{p.email}</td>
                      <td className="px-4 py-3 text-soil/50">{p.note || "—"}</td>
                      <td className="px-4 py-3 text-soil/45 text-xs">{new Date(p.created_at).toLocaleDateString()}</td>
                      <td className="px-4 py-3 text-right"><button onClick={() => handleRevoke("", p.email)} className="font-body text-xs text-soil/35 hover:text-red-500 transition">Remove</button></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {loadingData ? <p className="font-mono text-sm text-soil/40">Loading users…</p> : (
          <>
            <div className="mb-8">
              <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-soil/40 mb-3">Members with access ({withAccess.length})</p>
              {withAccess.length === 0 ? <p className="font-body text-sm text-soil/40 py-4">No members yet.</p> : (
                <div className="rounded-xl border border-soil/[0.08] overflow-hidden">
                  <table className="w-full text-left font-body text-sm">
                    <thead className="bg-soil/[0.03]"><tr>
                      <th className="px-4 py-3 font-medium text-soil/50 text-xs uppercase tracking-wide">Email</th>
                      <th className="px-4 py-3 font-medium text-soil/50 text-xs uppercase tracking-wide">Type</th>
                      <th className="px-4 py-3 font-medium text-soil/50 text-xs uppercase tracking-wide">Note</th>
                      <th className="px-4 py-3 font-medium text-soil/50 text-xs uppercase tracking-wide">Since</th>
                      <th className="px-4 py-3" />
                    </tr></thead>
                    <tbody>
                      {withAccess.map((u) => {
                        const isManual = u.purchase?.stripe_session_id?.startsWith("manual");
                        const isPaid = u.has_purchase && !isManual;
                        return (
                          <tr key={u.id} className="border-t border-soil/[0.06]">
                            <td className="px-4 py-3 text-soil">{u.email}</td>
                            <td className="px-4 py-3">
                              {isPaid && <span className="inline-flex items-center gap-1 text-xs bg-healed/10 text-healed rounded-full px-2.5 py-0.5"><UserCheck size={11} /> Paid</span>}
                              {isManual && <span className="inline-flex items-center gap-1 text-xs bg-redoxide/10 text-redoxide rounded-full px-2.5 py-0.5"><UserCheck size={11} /> Manual</span>}
                              {!u.has_purchase && u.is_pre_approved && <span className="inline-flex items-center gap-1 text-xs bg-veldgold/20 text-soil/60 rounded-full px-2.5 py-0.5"><Clock size={11} /> Pre-approved</span>}
                            </td>
                            <td className="px-4 py-3 text-soil/45 text-xs max-w-[180px] truncate">{u.pre_approval?.note || "—"}</td>
                            <td className="px-4 py-3 text-soil/40 text-xs">{new Date(u.purchase?.created_at ?? u.pre_approval?.created_at ?? u.created_at).toLocaleDateString()}</td>
                            <td className="px-4 py-3 text-right">
                              <button onClick={() => handleRevoke(u.id, u.email)} className="font-body text-xs text-soil/30 hover:text-red-500 transition flex items-center gap-1 ml-auto">
                                <UserX size={12} /> Revoke
                              </button>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
            <div>
              <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-soil/40 mb-3">Registered — no access ({withoutAccess.length})</p>
              {withoutAccess.length === 0 ? <p className="font-body text-sm text-soil/40 py-4">Everyone has access.</p> : (
                <div className="rounded-xl border border-soil/[0.08] overflow-hidden">
                  <table className="w-full text-left font-body text-sm">
                    <thead className="bg-soil/[0.03]"><tr>
                      <th className="px-4 py-3 font-medium text-soil/50 text-xs uppercase tracking-wide">Email</th>
                      <th className="px-4 py-3 font-medium text-soil/50 text-xs uppercase tracking-wide">Signed up</th>
                      <th className="px-4 py-3" />
                    </tr></thead>
                    <tbody>
                      {withoutAccess.map((u) => (
                        <tr key={u.id} className="border-t border-soil/[0.06]">
                          <td className="px-4 py-3 text-soil/70">{u.email}</td>
                          <td className="px-4 py-3 text-soil/40 text-xs">{new Date(u.created_at).toLocaleDateString()}</td>
                          <td className="px-4 py-3 text-right">
                            <button onClick={() => { setGrantEmail(u.email); window.scrollTo({ top: 0, behavior: "smooth" }); }} className="font-body text-xs text-healed hover:text-healed/70 transition">Grant access</button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
