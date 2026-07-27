import { useEffect, useState } from "react";
import { PlayCircle } from "lucide-react";
import { supabase } from "../lib/supabase";
import { Nav } from "../components/Nav";
import { Footer } from "../components/Footer";

interface StepVideo {
  id: string;
  step_number: number;
  title: string;
  description: string | null;
  section: string;
  public_url: string;
  sort_order: number;
}

type Tab = "intro" | "open" | "closed";

export function Steps() {
  const [videos, setVideos] = useState<StepVideo[]>([]);
  const [selected, setSelected] = useState<StepVideo | null>(null);
  const [activeTab, setActiveTab] = useState<Tab>("intro");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    supabase
      .from("steps_videos")
      .select("*")
      .order("sort_order", { ascending: true })
      .then(({ data, error: err }) => {
        if (err) { setError(err.message); setLoading(false); return; }
        setVideos(data ?? []);
        const first = (data ?? []).find((v) => v.section === "intro");
        if (first) setSelected(first);
        setLoading(false);
      });
  }, []);

  const tabVideos = videos.filter((v) => v.section === activeTab);

  const handleTabChange = (tab: Tab) => {
    setActiveTab(tab);
    const first = videos.find((v) => v.section === tab);
    if (first) setSelected(first);
  };

  const tabs: { key: Tab; label: string }[] = [
    { key: "intro", label: "Introduction" },
    { key: "open", label: "Open Season" },
    { key: "closed", label: "Closed Season" },
  ];

  return (
    <div className="min-h-screen bg-bone">
      <Nav />
      <div className="mx-auto max-w-6xl px-6 py-12">
        <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-healed mb-2">Member resources</p>
        <h1 className="font-display text-3xl font-black text-soil mb-1">The 13 Steps</h1>
        <p className="font-body text-sm text-soil/55 mb-8">Work through the Open Season steps first, then the Closed Season steps.</p>

        {error && <div className="rounded-xl bg-red-50 border border-red-200 p-4 mb-6 font-body text-sm text-red-700">Error: {error}</div>}
        {loading && <p className="font-mono text-sm text-soil/50">Loading videos…</p>}
        {!loading && !error && videos.length === 0 && <p className="font-mono text-sm text-soil/50">No videos found.</p>}

        {!loading && videos.length > 0 && (
          <>
            <div className="flex gap-1 border-b border-soil/10 mb-8">
              {tabs.map((tab) => (
                <button key={tab.key} onClick={() => handleTabChange(tab.key)}
                  className={`px-5 py-2.5 font-display font-black text-sm transition rounded-t-lg ${activeTab === tab.key ? "bg-soil text-redoxide" : "text-soil/45 hover:text-soil"}`}>
                  {tab.label}
                </button>
              ))}
            </div>

            <div className="grid gap-8 lg:grid-cols-[1fr_280px]">
              <div>
                <div className="overflow-hidden rounded-2xl bg-soil">
                  {selected?.public_url ? (
                    <video key={selected.id} src={selected.public_url} controls controlsList="nodownload"
                      onContextMenu={(e) => e.preventDefault()} className="aspect-video w-full" />
                  ) : (
                    <div className="flex aspect-video items-center justify-center font-mono text-sm text-bone/50">Select a step</div>
                  )}
                </div>
                {selected && (
                  <div className="mt-4">
                    <p className="font-mono text-[10px] uppercase tracking-wide text-redoxide mb-1">
                      {selected.section === "intro" ? "Introduction" : selected.section === "open" ? `Open Season · Step ${selected.step_number}` : `Closed Season · Step ${selected.step_number}`}
                    </p>
                    <p className="font-display font-black text-xl text-soil">{selected.title}</p>
                  </div>
                )}
              </div>

              <ul className="space-y-1">
                {tabVideos.map((video) => (
                  <li key={video.id}>
                    <button onClick={() => setSelected(video)}
                      className={`flex w-full items-start gap-3 rounded-xl px-3 py-3 text-left transition ${selected?.id === video.id ? "bg-soil" : "hover:bg-soil/5"}`}>
                      <span className={`font-mono text-[10px] mt-1 min-w-[20px] font-bold ${selected?.id === video.id ? "text-redoxide" : "text-soil/35"}`}>
                        {video.section === "intro" ? "▶" : String(video.step_number).padStart(2, "0")}
                      </span>
                      <span className={`font-display font-bold text-sm ${selected?.id === video.id ? "text-redoxide" : "text-soil"}`}>
                        {video.title}
                      </span>
                      {selected?.id !== video.id && <PlayCircle size={14} className="ml-auto mt-0.5 shrink-0 text-soil/20" />}
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          </>
        )}
      </div>
      <Footer />
    </div>
  );
}
