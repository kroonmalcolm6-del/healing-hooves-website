export function Footer() {
  return (
    <footer className="border-t border-soil/10 bg-shutter">
      <div className="mx-auto max-w-6xl px-6 py-10 font-body text-sm text-bone/70">
        <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
          <p className="font-display text-base text-bone">Healing Hooves</p>
          <p>Taught from Excelsior Farm, Nardousberg, Eastern Cape.</p>
        </div>
        <p className="mt-6 text-bone/50">
          © {new Date().getFullYear()} Healing Hooves. Holistic planned grazing, taught plainly.
        </p>
      </div>
    </footer>
  );
}
