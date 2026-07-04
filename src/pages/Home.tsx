import { useState } from "react";
import { useSearchParams } from "react-router-dom";
import { Nav } from "../components/Nav";
import { Footer } from "../components/Footer";
import { RotationRing } from "../components/RotationRing";
import { useAuth } from "../lib/auth";
import { supabase } from "../lib/supabase";

const MODULES = [
  {
    title: "Reading the land",
    detail: "Soil, water, and what bare ground is actually telling you before you change anything.",
  },
  {
    title: "Designing your paddock system",
    detail: "Fencing, water points, and how many paddocks your rest period actually requires.",
  },
  {
    title: "Building your grazing chart",
    detail: "Turn a season into a written plan — herd size, paddock order, and rest length on paper.",
  },
  {
    title: "Moving the herd",
    detail: "Reading recovery on the ground and knowing when to move, not just when the calendar says to.",
  },
  {
    title: "Tracking rain and rest",
    detail: "Simple records that tell you whether the plan is working before the next drought does.",
  },
  {
    title: "Case studies from Excelsior Farm",
    detail: "Real seasons, real mistakes, and what changed after several years of planned rest.",
  },
];

const INCLUDED = [
  {
    title: "Recorded course clips",
    detail: "Every module, filmed on the land it's teaching — watch on your own schedule.",
  },
  {
    title: "Your own grazing chart",
    detail: "A planning tool for your paddocks, your herd, and your rotation — not a generic template.",
  },
  {
    title: "Downloadable resources",
    detail: "Worksheets and reference sheets you can print and keep in the bakkie.",
  },
];

export function Home() {
  const [params] = useSearchParams();
  const { user, hasAccess } = useAuth();
  const [checkoutLoading, setCheckoutLoading] = useState(false);
  const [checkoutError, setCheckoutError] = useState<string | null>(null);

  const checkoutRequired = params.get("checkout") === "required";

  const handleBuy = async () => {
    setCheckoutError(null);

    if (!user) {
      window.location.href = "/signup?next=checkout";
      return;
    }

    setCheckoutLoading(true);
    const { data, error } = await supabase.functions.invoke("create-checkout-session");
    setCheckoutLoading(false);

    if (error || !data?.url) {
      setCheckoutError("Couldn't start checkout. Please try again in a moment.");
      return;
    }

    window.location.href = data.url;
  };

  return (
    <div className="min-h-screen bg-bone">
      <Nav />

      {checkoutRequired && (
        <div className="bg-veldgold/20 px-6 py-3 text-center font-body text-sm text-soil">
          You're signed in — finish your purchase below to unlock the dashboard.
        </div>
      )}

      {/* ---------------- Hero ---------------- */}
      <section className="mx-auto grid max-w-6xl gap-12 px-6 py-20 sm:py-28 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
        <div>
          <p className="font-mono text-xs uppercase tracking-[0.2em] text-redoxide">
            Holistic planned grazing — taught from a working Karoo farm
          </p>
          <h1 className="mt-5 font-display text-4xl font-semibold leading-[1.1] text-soil sm:text-5xl lg:text-[3.4rem]">
            Your veld isn't broken.
            <br />
            It's never had a plan to rest.
          </h1>
          <p className="mt-6 max-w-md font-body text-lg leading-relaxed text-soil/75">
            Healing Hooves is a self-paced course in holistic planned grazing — built around the
            same methodology run on Excelsior Farm in the Nardousberg, where it's been used to
            bring degraded Karoo veld back under planned rest and rotation.
          </p>
          <div className="mt-9 flex flex-wrap items-center gap-4">
            <a
              href="#pricing"
              className="rounded-full bg-redoxide px-7 py-3.5 font-body font-medium text-bone shadow-sm transition hover:bg-redoxide/90"
            >
              Get lifetime access
            </a>
            <a href="#curriculum" className="font-body text-sm text-soil/70 underline-offset-4 hover:underline">
              See what's in the course
            </a>
          </div>
        </div>

        <RotationRing />
      </section>

      {/* ---------------- The problem ---------------- */}
      <section className="bg-shutter py-20 text-bone">
        <div className="mx-auto max-w-6xl px-6">
          <h2 className="font-display text-2xl font-semibold sm:text-3xl">
            Same rainfall. Two very different outcomes.
          </h2>
          <p className="mt-3 max-w-2xl font-body text-bone/70">
            The difference usually isn't the weather — it's whether the land ever gets a real
            rest. This is the entire argument the course is built around.
          </p>

          <div className="mt-10 grid gap-4 sm:grid-cols-2">
            <div className="texture-cracked rounded-2xl border border-bone/15 bg-soil/40 p-7">
              <p className="font-mono text-xs uppercase tracking-wide text-bone/50">No plan</p>
              <p className="mt-2 font-display text-xl text-bone">Continuously grazed</p>
              <p className="mt-3 font-body text-sm leading-relaxed text-bone/60">
                Stock stay put, palatable plants get hit again before they recover, bare ground
                spreads, and the next dry spell hits harder than it should.
              </p>
            </div>
            <div className="texture-veld rounded-2xl border border-healed/30 bg-healed/10 p-7">
              <p className="font-mono text-xs uppercase tracking-wide text-veldgold">
                A written plan
              </p>
              <p className="mt-2 font-display text-xl text-bone">Planned grazing</p>
              <p className="mt-3 font-body text-sm leading-relaxed text-bone/70">
                Every paddock gets a real rest before it's grazed again. Litter builds, roots
                deepen, and the land starts catching the rain it gets instead of shedding it.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ---------------- Curriculum ---------------- */}
      <section id="curriculum" className="mx-auto max-w-6xl px-6 py-20">
        <h2 className="font-display text-2xl font-semibold text-soil sm:text-3xl">
          Six modules, in the order you'll actually use them
        </h2>
        <p className="mt-3 max-w-2xl font-body text-soil/70">
          This is the same sequence used to plan a real season — not a topic list shuffled for a
          course outline.
        </p>

        <ol className="mt-10 grid gap-6 sm:grid-cols-2">
          {MODULES.map((mod, i) => (
            <li key={mod.title} className="flex gap-4 border-t border-soil/15 pt-5">
              <span className="font-mono text-sm text-redoxide">{String(i + 1).padStart(2, "0")}</span>
              <div>
                <p className="font-display text-lg text-soil">{mod.title}</p>
                <p className="mt-1 font-body text-sm text-soil/65">{mod.detail}</p>
              </div>
            </li>
          ))}
        </ol>
      </section>

      {/* ---------------- Instructor ---------------- */}
      <section className="border-y border-soil/10 bg-veldgold/10 py-20">
        <div className="mx-auto grid max-w-6xl gap-10 px-6 sm:grid-cols-[auto_1fr] sm:items-center">
          <div className="h-20 w-20 rounded-full bg-shutter sm:h-24 sm:w-24" aria-hidden="true" />
          <div>
            <p className="font-mono text-xs uppercase tracking-wide text-soil/50">
              Your instructor
            </p>
            <p className="mt-1 font-display text-xl text-soil">Roland Kroon</p>
            <p className="mt-2 max-w-2xl font-body text-soil/70">
              A Savory Institute Master Field Professional running a holistic planned grazing
              operation on Excelsior Farm in the Nardousberg. Everything in this course comes
              from land he manages day to day — not a slide deck.
            </p>
          </div>
        </div>
      </section>

      {/* ---------------- What's included ---------------- */}
      <section className="mx-auto max-w-6xl px-6 py-20">
        <h2 className="font-display text-2xl font-semibold text-soil sm:text-3xl">
          What's included
        </h2>
        <div className="mt-10 grid gap-6 sm:grid-cols-3">
          {INCLUDED.map((item) => (
            <div key={item.title} className="rounded-2xl border border-soil/10 p-7">
              <p className="font-display text-lg text-soil">{item.title}</p>
              <p className="mt-2 font-body text-sm leading-relaxed text-soil/65">{item.detail}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ---------------- Pricing ---------------- */}
      <section id="pricing" className="bg-soil py-20 text-bone">
        <div className="mx-auto max-w-xl px-6 text-center">
          <h2 className="font-display text-2xl font-semibold sm:text-3xl">Lifetime access</h2>
          <p className="mt-3 font-body text-bone/70">
            One payment. No subscription. Every clip, the grazing chart tool, and every resource —
            for as long as the course exists.
          </p>

          <p className="mt-8 font-display text-5xl font-semibold">
            R4,500
            <span className="ml-2 font-body text-base font-normal text-bone/50">once-off</span>
          </p>

          <button
            onClick={handleBuy}
            disabled={checkoutLoading || hasAccess}
            className="mt-8 w-full rounded-full bg-redoxide px-7 py-4 font-body font-medium text-bone transition hover:bg-redoxide/90 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {hasAccess
              ? "You already have access"
              : checkoutLoading
              ? "Starting checkout…"
              : "Get lifetime access"}
          </button>

          {checkoutError && <p className="mt-3 text-sm text-veldgold">{checkoutError}</p>}

          <p className="mt-4 font-mono text-xs uppercase tracking-wide text-bone/40">
            Secure payment via Stripe
          </p>
        </div>
      </section>

      <Footer />
    </div>
  );
}
