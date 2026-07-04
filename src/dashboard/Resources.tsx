import { useEffect, useState } from "react";
import { Download } from "lucide-react";
import { supabase } from "../lib/supabase";

interface CourseResource {
  id: string;
  title: string;
  description: string | null;
  storage_path: string;
}

const BUCKET = "course-resources";

export function Resources() {
  const [resources, setResources] = useState<CourseResource[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      const { data, error } = await supabase
        .from("course_resources")
        .select("id, title, description, storage_path")
        .order("created_at", { ascending: true });

      if (error) setError(error.message);
      else setResources(data ?? []);
      setLoading(false);
    })();
  }, []);

  const handleDownload = async (resource: CourseResource) => {
    const { data, error } = await supabase.storage
      .from(BUCKET)
      .createSignedUrl(resource.storage_path, 60);

    if (error || !data?.signedUrl) {
      setError(`Couldn't download ${resource.title}.`);
      return;
    }
    window.open(data.signedUrl, "_blank");
  };

  if (loading) return <p className="font-mono text-sm text-soil/50">Loading resources…</p>;
  if (error) return <p className="font-body text-sm text-redoxide">{error}</p>;

  if (resources.length === 0) {
    return (
      <div className="rounded-2xl border border-dashed border-soil/20 p-10 text-center">
        <p className="font-display text-lg text-soil">No resources uploaded yet</p>
        <p className="mt-2 font-body text-sm text-soil/60">
          Add rows to <code className="font-mono">course_resources</code> and upload files to the{" "}
          <code className="font-mono">course-resources</code> storage bucket.
        </p>
      </div>
    );
  }

  return (
    <ul className="space-y-3">
      {resources.map((resource) => (
        <li
          key={resource.id}
          className="flex items-center justify-between gap-4 rounded-xl border border-soil/10 p-5"
        >
          <div>
            <p className="font-display text-base text-soil">{resource.title}</p>
            {resource.description && (
              <p className="mt-1 font-body text-sm text-soil/60">{resource.description}</p>
            )}
          </div>
          <button
            onClick={() => handleDownload(resource)}
            className="flex shrink-0 items-center gap-2 rounded-full border border-soil/20 px-4 py-2 font-body text-sm text-soil transition hover:border-redoxide hover:text-redoxide"
          >
            <Download size={15} /> Download
          </button>
        </li>
      ))}
    </ul>
  );
}
