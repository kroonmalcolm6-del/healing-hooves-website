export function Footer() {
  return (
    <footer className="bg-soil border-t border-white/5">
      <div className="mx-auto max-w-6xl px-6 py-8 font-body text-sm text-bone/30">
        <div className="flex flex-col items-center justify-between gap-3 sm:flex-row text-center sm:text-left">
          <p className="font-display font-black text-base text-redoxide/70">Healing Hooves</p>
          <p>Taught from Excelsior Farm, Nardousberg, Eastern Cape.</p>
        </div>
        <p className="mt-5 text-bone/20 text-center sm:text-left text-xs">
          © {new Date().getFullYear()} Healing Hooves RLM (Pty) Ltd · Confidential
        </p>
      </div>
    </footer>
  );
}
