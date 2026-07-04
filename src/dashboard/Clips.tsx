import { useEffect, useState } from "react";
import { PlayCircle } from "lucide-react";
import { supabase } from "../lib/supabase";

interface CourseVideo {
  id: string;
  title: string;
  description: string | null;
  module: string | null;
  storage_path: string;
}

const BUCKET = "course-clips";

export function Clips() {
  const [videos, setVideos] = useState<CourseVideo[]>([]);
  const [selected, setSelected] = useState<CourseVideo | null>(null);
  const [signedUrl, setSignedUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      const { data, error } = await supabase
        .from("course_videos")
        .select("id, title, description, module, storage_path")
        .order("sort_order", { ascending: true });

      if (error) {
        setError(error.message);
      } else {
        setVideos(data ?? []);
        if (data && data.length > 0) setSelected(data[0]);
      }
      setLoading(false);
    })();
  }, []);

  useEffect(() => {
    if (!selected) return;
    setSignedUrl(null);
    supabase.storage
      .from(BUCKET)
      .createSignedUrl(selected.storage_path, 3600)
      .then(({ data, error }) => {
        if (error) {
          setError(`Couldn't load video: ${error.message}`);
        } else {
          setSignedUrl(data?.signedUrl ?? null);
        }
      });
  }, [selected]);

  if (loading) {
    return <p className="font-mono text-sm text-soil/50">Loading clips…</p>;
  }

  if (error) {
    return <p className="font-body text-sm text-redoxide">{error}</p>;
  }

  if (videos.length === 0) {
    return (
      <div className="rounded-2xl border border-dashed border-soil/20 p-10 text-center">
        <p className="font-display text-lg text-soil">No clips uploaded yet</p>
        <p className="mt-2 font-body text-sm text-soil/60">
          Add rows to the <code className="font-mono">course_videos</code> table and upload the
          matching files to the <code className="font-mono">course-clips</code> storage bucket.
        </p>
      </div>
    );
  }

  return (
    <div className="grid gap-8 lg:grid-cols-[1fr_320px]">
      <div className="overflow-hidden rounded-2xl bg-soil">
        {signedUrl ? (
          <video key={signedUrl} src={signedUrl} controls className="aspect-video w-full" />
        ) : (
          <div className="flex aspect-video items-center justify-center font-mono text-sm text-bone/50">
            Loading video…
          </div>
        )}
        {selected && (
          <div className="bg-bone p-5">
            <p className="font-display text-lg text-soil">{selected.title}</p>
            {selected.description && (
              <p className="mt-1 font-body text-sm text-soil/65">{selected.description}</p>
            )}
          </div>
        )}
      </div>

      <ul className="space-y-1">
        {videos.map((video) => (
          <li key={video.id}>
            <button
              onClick={() => setSelected(video)}
              className={`flex w-full items-start gap-3 rounded-xl px-3 py-3 text-left transition ${
                selected?.id === video.id ? "bg-veldgold/20" : "hover:bg-soil/5"
              }`}
            >
              <PlayCircle
                size={18}
                className={selected?.id === video.id ? "mt-0.5 text-redoxide" : "mt-0.5 text-soil/40"}
              />
              <span>
                {video.module && (
                  <span className="block font-mono text-[10px] uppercase tracking-wide text-soil/45">
                    {video.module}
                  </span>
                )}
                <span className="font-body text-sm text-soil">{video.title}</span>
              </span>
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
