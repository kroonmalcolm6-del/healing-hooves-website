import { FormEvent, useEffect, useMemo, useState } from "react";
import {
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { Plus, Trash2 } from "lucide-react";
import { supabase } from "../lib/supabase";
import { useAuth } from "../lib/auth";

interface Paddock {
  id: string;
  name: string;
  size_ha: number | null;
  sort_order: number;
}

interface Move {
  id: string;
  paddock_id: string;
  move_date: string;
  planned_rest_days: number | null;
  notes: string | null;
}

interface RainEntry {
  id: string;
  log_date: string;
  mm: number;
}

export function Charts() {
  const { user } = useAuth();
  const [paddocks, setPaddocks] = useState<Paddock[]>([]);
  const [moves, setMoves] = useState<Move[]>([]);
  const [rain, setRain] = useState<RainEntry[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;
    (async () => {
      const [paddockRes, moveRes, rainRes] = await Promise.all([
        supabase.from("customer_paddocks").select("*").order("sort_order"),
        supabase.from("customer_moves").select("*").order("move_date", { ascending: false }),
        supabase.from("customer_rain_log").select("*").order("log_date", { ascending: true }),
      ]);
      setPaddocks(paddockRes.data ?? []);
      setMoves(moveRes.data ?? []);
      setRain(rainRes.data ?? []);
      setLoading(false);
    })();
  }, [user]);

  const paddockName = (id: string) => paddocks.find((p) => p.id === id)?.name ?? "Unknown paddock";

  if (loading) return <p className="font-mono text-sm text-soil/50">Loading your charts…</p>;

  return (
    <div className="space-y-12">
      <PaddockSection
        paddocks={paddocks}
        userId={user!.id}
        onChange={setPaddocks}
      />
      <RotationSection
        paddocks={paddocks}
        moves={moves}
        userId={user!.id}
        onChange={setMoves}
        paddockName={paddockName}
      />
      <RainSection rain={rain} userId={user!.id} onChange={setRain} />
    </div>
  );
}

// ---------------- Paddocks ----------------

function PaddockSection({
  paddocks,
  userId,
  onChange,
}: {
  paddocks: Paddock[];
  userId: string;
  onChange: (p: Paddock[]) => void;
}) {
  const [name, setName] = useState("");
  const [size, setSize] = useState("");

  const addPaddock = async (e: FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;
    const { data, error } = await supabase
      .from("customer_paddocks")
      .insert({
        user_id: userId,
        name: name.trim(),
        size_ha: size ? Number(size) : null,
        sort_order: paddocks.length,
      })
      .select()
      .single();
    if (!error && data) {
      onChange([...paddocks, data]);
      setName("");
      setSize("");
    }
  };

  const removePaddock = async (id: string) => {
    await supabase.from("customer_paddocks").delete().eq("id", id);
    onChange(paddocks.filter((p) => p.id !== id));
  };

  return (
    <section>
      <h2 className="font-display text-xl text-soil">Your paddocks</h2>
      <p className="mt-1 font-body text-sm text-soil/60">
        Set these up once — the rotation calendar below pulls from this list.
      </p>

      <ul className="mt-5 space-y-2">
        {paddocks.map((p) => (
          <li
            key={p.id}
            className="flex items-center justify-between rounded-lg border border-soil/10 px-4 py-2.5"
          >
            <span className="font-body text-sm text-soil">
              {p.name}
              {p.size_ha != null && <span className="text-soil/45"> — {p.size_ha} ha</span>}
            </span>
            <button onClick={() => removePaddock(p.id)} aria-label={`Remove ${p.name}`}>
              <Trash2 size={15} className="text-soil/40 transition hover:text-redoxide" />
            </button>
          </li>
        ))}
      </ul>

      <form onSubmit={addPaddock} className="mt-4 flex flex-wrap gap-3">
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Paddock name"
          className="rounded-lg border border-soil/20 px-3 py-2 font-body text-sm outline-none focus:border-redoxide"
        />
        <input
          value={size}
          onChange={(e) => setSize(e.target.value)}
          placeholder="Size (ha)"
          type="number"
          step="0.1"
          className="w-32 rounded-lg border border-soil/20 px-3 py-2 font-body text-sm outline-none focus:border-redoxide"
        />
        <button
          type="submit"
          className="flex items-center gap-1.5 rounded-lg bg-shutter px-4 py-2 font-body text-sm font-medium text-bone transition hover:bg-shutter/90"
        >
          <Plus size={15} /> Add paddock
        </button>
      </form>
    </section>
  );
}

// ---------------- Rotation calendar ----------------

function RotationSection({
  paddocks,
  moves,
  userId,
  onChange,
  paddockName,
}: {
  paddocks: Paddock[];
  moves: Move[];
  userId: string;
  onChange: (m: Move[]) => void;
  paddockName: (id: string) => string;
}) {
  const [paddockId, setPaddockId] = useState("");
  const [moveDate, setMoveDate] = useState("");
  const [restDays, setRestDays] = useState("");
  const [notes, setNotes] = useState("");

  const addMove = async (e: FormEvent) => {
    e.preventDefault();
    if (!paddockId || !moveDate) return;
    const { data, error } = await supabase
      .from("customer_moves")
      .insert({
        user_id: userId,
        paddock_id: paddockId,
        move_date: moveDate,
        planned_rest_days: restDays ? Number(restDays) : null,
        notes: notes || null,
      })
      .select()
      .single();
    if (!error && data) {
      onChange([data, ...moves]);
      setPaddockId("");
      setMoveDate("");
      setRestDays("");
      setNotes("");
    }
  };

  return (
    <section>
      <h2 className="font-display text-xl text-soil">Rotation calendar</h2>
      <p className="mt-1 font-body text-sm text-soil/60">
        Log every move — this is what turns a grazing plan into a record you can check the land
        against later.
      </p>

      <form onSubmit={addMove} className="mt-5 flex flex-wrap items-end gap-3">
        <select
          value={paddockId}
          onChange={(e) => setPaddockId(e.target.value)}
          className="rounded-lg border border-soil/20 px-3 py-2 font-body text-sm outline-none focus:border-redoxide"
        >
          <option value="">Paddock…</option>
          {paddocks.map((p) => (
            <option key={p.id} value={p.id}>
              {p.name}
            </option>
          ))}
        </select>
        <input
          type="date"
          value={moveDate}
          onChange={(e) => setMoveDate(e.target.value)}
          className="rounded-lg border border-soil/20 px-3 py-2 font-body text-sm outline-none focus:border-redoxide"
        />
        <input
          type="number"
          placeholder="Planned rest (days)"
          value={restDays}
          onChange={(e) => setRestDays(e.target.value)}
          className="w-44 rounded-lg border border-soil/20 px-3 py-2 font-body text-sm outline-none focus:border-redoxide"
        />
        <input
          placeholder="Notes (optional)"
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          className="min-w-[10rem] flex-1 rounded-lg border border-soil/20 px-3 py-2 font-body text-sm outline-none focus:border-redoxide"
        />
        <button
          type="submit"
          className="flex items-center gap-1.5 rounded-lg bg-shutter px-4 py-2 font-body text-sm font-medium text-bone transition hover:bg-shutter/90"
        >
          <Plus size={15} /> Log move
        </button>
      </form>

      <div className="mt-6 overflow-hidden rounded-xl border border-soil/10">
        <table className="w-full text-left font-body text-sm">
          <thead className="bg-soil/5 text-soil/55">
            <tr>
              <th className="px-4 py-2.5 font-medium">Date</th>
              <th className="px-4 py-2.5 font-medium">Paddock</th>
              <th className="px-4 py-2.5 font-medium">Planned rest</th>
              <th className="px-4 py-2.5 font-medium">Notes</th>
            </tr>
          </thead>
          <tbody>
            {moves.length === 0 && (
              <tr>
                <td colSpan={4} className="px-4 py-6 text-center text-soil/45">
                  No moves logged yet.
                </td>
              </tr>
            )}
            {moves.map((m) => (
              <tr key={m.id} className="border-t border-soil/10">
                <td className="px-4 py-2.5">{m.move_date}</td>
                <td className="px-4 py-2.5">{paddockName(m.paddock_id)}</td>
                <td className="px-4 py-2.5">
                  {m.planned_rest_days != null ? `${m.planned_rest_days} days` : "—"}
                </td>
                <td className="px-4 py-2.5 text-soil/60">{m.notes ?? "—"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}

// ---------------- Rain log ----------------

function RainSection({
  rain,
  userId,
  onChange,
}: {
  rain: RainEntry[];
  userId: string;
  onChange: (r: RainEntry[]) => void;
}) {
  const [logDate, setLogDate] = useState("");
  const [mm, setMm] = useState("");

  const addEntry = async (e: FormEvent) => {
    e.preventDefault();
    if (!logDate || !mm) return;
    const { data, error } = await supabase
      .from("customer_rain_log")
      .insert({ user_id: userId, log_date: logDate, mm: Number(mm) })
      .select()
      .single();
    if (!error && data) {
      onChange([...rain, data].sort((a, b) => a.log_date.localeCompare(b.log_date)));
      setLogDate("");
      setMm("");
    }
  };

  const chartData = useMemo(
    () => rain.map((r) => ({ date: r.log_date.slice(5), mm: r.mm })),
    [rain]
  );

  return (
    <section>
      <h2 className="font-display text-xl text-soil">Rain log</h2>
      <p className="mt-1 font-body text-sm text-soil/60">
        A few minutes a month — but it's the record that tells you whether the rest periods are
        actually long enough.
      </p>

      <form onSubmit={addEntry} className="mt-5 flex flex-wrap items-end gap-3">
        <input
          type="date"
          value={logDate}
          onChange={(e) => setLogDate(e.target.value)}
          className="rounded-lg border border-soil/20 px-3 py-2 font-body text-sm outline-none focus:border-redoxide"
        />
        <input
          type="number"
          step="0.1"
          placeholder="mm"
          value={mm}
          onChange={(e) => setMm(e.target.value)}
          className="w-28 rounded-lg border border-soil/20 px-3 py-2 font-body text-sm outline-none focus:border-redoxide"
        />
        <button
          type="submit"
          className="flex items-center gap-1.5 rounded-lg bg-shutter px-4 py-2 font-body text-sm font-medium text-bone transition hover:bg-shutter/90"
        >
          <Plus size={15} /> Add reading
        </button>
      </form>

      <div className="mt-6 h-64 rounded-xl border border-soil/10 p-4">
        {chartData.length === 0 ? (
          <div className="flex h-full items-center justify-center font-body text-sm text-soil/45">
            Add a reading to see the chart.
          </div>
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#2B242015" />
              <XAxis dataKey="date" tick={{ fontSize: 11, fill: "#2B2420" }} />
              <YAxis tick={{ fontSize: 11, fill: "#2B2420" }} unit="mm" />
              <Tooltip />
              <Line type="monotone" dataKey="mm" stroke="#9A3324" strokeWidth={2} dot={{ r: 3 }} />
            </LineChart>
          </ResponsiveContainer>
        )}
      </div>
    </section>
  );
}
