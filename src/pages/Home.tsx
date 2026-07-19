import { useState } from "react";
import { useSearchParams } from "react-router-dom";
import { Nav } from "../components/Nav";
import { Footer } from "../components/Footer";
import { RotationRing } from "../components/RotationRing";
import { useAuth } from "../lib/auth";
import { supabase } from "../lib/supabase";

const COURSE_TOPICS = [
  { title: "Summary of the state of the world", detail: "What we are doing is not working — and why the root cause is how we manage nature." },
  { title: "Holistic Management key insights", detail: "The framework that changes how you make every decision on the land." },
  { title: "Ecosystem processes — ecological literacy", detail: "The four processes that determine whether your land is moving toward or away from function." },
  { title: "Holistic decision making and your holistic context", detail: "Defining what you are actually managing toward — and why most plans fail without this." },
  { title: "Management tools", detail: "The tools at your disposal and their likely impact on your ecosystem processes." },
  { title: "Low-stress livestock management", detail: "How the way you handle animals affects land, production, and people." },
  { title: "Introduction to ruminant nutrition", detail: "We manage microbes, not mammals. What this means in practice." },
  { title: "Holistic planned grazing — case study", detail: "Working through a real grazing plan, step by step, from Excelsior." },
  { title: "Holistic financial planning", detail: "Profit and ecology managed together, not traded off against each other." },
  { title: "Stock days per hectare", detail: "Using SDH as a tool for carrying capacity — and for predicting droughts before they hit." },
  { title: "Ecological outcome verification", detail: "How to know whether what you are doing is actually working." },
  { title: "Introduction to the carbon market", detail: "The opportunity and the reality of carbon credits for grazing lands." },
];

const ROLAND_HIGHLIGHTS = [
  "Savory Institute Master Field Professional",
  "Trained under Allan Savory, Stan Parsons, Dr Terry McKosker & Bud Williams",
  "Co-founder of the South African Centre for Holistic Management",
  "Co-founder of the Herding Academy",
  "Speaker at the international Holistic Management conference, Snowbird Utah",
  "Excelsior Farm: 120 paddocks, EOV certified, Land to Market beef",
  "Completed RCS Australia's Grazing for Profit, Executive Link & Masterlink",
];

export function Home() {
  const [params] = useSearchParams();
  const { user, hasAccess } = useAuth();
  const [checkoutLoading, setCheckoutLoading] = useState(false);
  const [checkoutError, setCheckoutError] = useState<string | null>(null);

  const checkoutRequired = params.get("checkout") === "required";

  const handleBuy = async () => {
    setCheckoutError(null);
    if (!user) { window.location.href = "/signup?next=checkout"; return; }
    setCheckoutLoading(true);
    const { data, error } = await supabase.functions.invoke("create-checkout-session");
    setCheckoutLoading(false);
    if (error || !data?.url) { setCheckoutError("Couldn't start checkout. Please try again."); return; }
    window.location.href = data.url;
  };

  return (
    <div className="min-h-screen bg-bone">
      <Nav />

      {checkoutRequired && (
        <div className="bg-veldgold/20 px-6 py-3 text-center font-body text-sm text-soil">
          You are signed in — finish your purchase below to unlock the dashboard.
        </div>
      )}

      {/* Hero */}
      <section className="mx-auto grid max-w-6xl gap-12 px-6 py-20 sm:py-28 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
        <div>
          <p className="font-mono text-xs uppercase tracking-[0.2em] text-redoxide">
            Healing Hooves RLM — Holistic Management training
          </p>
          <h1 className="mt-5 font-display text-4xl font-semibold leading-[1.1] text-soil sm:text-5xl lg:text-[3.4rem]">
            Regenerative land management,<br />taught from the land.
          </h1>
          <p className="mt-6 max-w-md font-body text-lg leading-relaxed text-soil/75">
            Healing Hooves RLM was founded in 2018 to provide an enduring conduit for learning
            and development in Regenerative Land Management. All our work is premised on the
            foundations of Holistic Management — a framework for dealing with the complexity of nature.
          </p>
          <div className="mt-9 flex flex-wrap items-center gap-4">
            <a href="#course" className="rounded-full bg-redoxide px-7 py-3.5 font-body font-medium text-bone shadow-sm transition hover:bg-redoxide/90">
              The 5-day course
            </a>
            <a href="#roland" className="font-body text-sm text-soil/70 underline-offset-4 hover:underline">
              About Roland
            </a>
          </div>
        </div>
        <RotationRing />
      </section>

      {/* What is Holistic Management */}
      <section className="bg-shutter py-20 text-bone">
        <div className="mx-auto max-w-6xl px-6">
          <h2 className="font-display text-2xl font-semibold sm:text-3xl">What is Holistic Management?</h2>
          <p className="mt-4 max-w-3xl font-body text-lg leading-relaxed text-bone/80">
            Holistic Management recognises that everything humans produce or consume comes from nature,
            and that we use economies to manage nature in order to produce everything required for our
            existence. The framework — developed by Allan Savory and refined over decades by
            practitioners worldwide — gives land managers the tools to make decisions that are
            ecologically sound, financially viable, and socially meaningful, all at once.
          </p>
          <div className="mt-10 grid gap-4 sm:grid-cols-3">
            <div className="rounded-2xl border border-bone/10 bg-bone/5 p-6">
              <p className="font-display text-lg text-bone">Planned grazing</p>
              <p className="mt-2 font-body text-sm leading-relaxed text-bone/65">
                Using Holistic Planned Grazing as a framework to ensure profitable and ecologically
                sensible outcomes — both open-season and closed-season planning.
              </p>
            </div>
            <div className="rounded-2xl border border-bone/10 bg-bone/5 p-6">
              <p className="font-display text-lg text-bone">The E-Chart</p>
              <p className="mt-2 font-body text-sm leading-relaxed text-bone/65">
                The grazing plan converted from a manual chart to an electronic chart — all arithmetic
                handled for you, following the exact same steps in a fraction of the time.
              </p>
            </div>
            <div className="rounded-2xl border border-bone/10 bg-bone/5 p-6">
              <p className="font-display text-lg text-bone">Ecological literacy</p>
              <p className="mt-2 font-body text-sm leading-relaxed text-bone/65">
                Understanding the four ecosystem processes that determine the health of your land —
                and learning to read what the land is telling you before you intervene.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 5-day course */}
      <section id="course" className="mx-auto max-w-6xl px-6 py-20">
        <p className="font-mono text-xs uppercase tracking-[0.2em] text-redoxide">Flagship training</p>
        <h2 className="mt-3 font-display text-2xl font-semibold text-soil sm:text-3xl">The 5-day Holistic Management course</h2>
        <p className="mt-3 max-w-2xl font-body text-soil/70">
          Upon completion you will be equipped with every tool you need to begin your regenerative
          journey — from ecological literacy and decision making, through to grazing planning,
          financial planning, and ecological outcome verification.
        </p>
        <ol className="mt-10 grid gap-5 sm:grid-cols-2">
          {COURSE_TOPICS.map((topic, i) => (
            <li key={topic.title} className="flex gap-4 border-t border-soil/15 pt-5">
              <span className="font-mono text-sm text-redoxide">{String(i + 1).padStart(2, "0")}</span>
              <div>
                <p className="font-display text-base text-soil">{topic.title}</p>
                <p className="mt-1 font-body text-sm text-soil/65">{topic.detail}</p>
              </div>
            </li>
          ))}
        </ol>
      </section>

      {/* About Roland */}
      <section id="roland" className="border-y border-soil/10 bg-veldgold/10 py-20">
        <div className="mx-auto max-w-6xl px-6">
          <p className="font-mono text-xs uppercase tracking-[0.2em] text-redoxide">Your instructor</p>
          <h2 className="mt-3 font-display text-2xl font-semibold text-soil sm:text-3xl">Roland Kroon</h2>
          <div className="mt-6 grid gap-10 lg:grid-cols-[1fr_320px]">
            <div className="space-y-4 font-body leading-relaxed text-soil/75">
              <p>
                Roland Kroon grew up inside Holistic Management before it had fully found its name.
                His family farmed across South Africa and Namibia, and it was there, in the late 1960s,
                that his father first crossed paths with Allan Savory. When his father died in 1976,
                leaving his mother to manage seven farming properties, the family's education in land
                and livestock management became a matter of necessity — and Roland, still a child,
                was part of the decision-making from the start.
              </p>
              <p>
                He returned to farm full-time in 1990, taking over Excelsior — a Karoo property that
                had been neglected for decades. Since then he has rebuilt it into a thriving cattle
                operation: 120 grazing paddocks, 68km of pipeline, and more than double the original
                carrying capacity, alongside a full conversion from sheep to cattle. Excelsior has been
                EOV certified since 2023, with beef marketed under the Land to Market label.
              </p>
              <p>
                One of the projects he is proudest of: designing and running a three-year programme
                training sheep herders to regenerate a 24,000-hectare unfenced game reserve — believed
                to be the first reintegration of domestic livestock as a land management tool in a
                South African game reserve. That work led to co-founding the Herding Academy.
              </p>
              <p>
                Roland is a Savory Institute Master Field Professional — an accreditation shared with
                a small number of people worldwide. After 45 years in the field, he brings that depth
                of hands-on, hard-won experience to every course he teaches at Healing Hooves.
              </p>
            </div>
            <ul className="space-y-3">
              {ROLAND_HIGHLIGHTS.map((item) => (
                <li key={item} className="flex gap-3 font-body text-sm text-soil/75">
                  <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-redoxide" />
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* What is included */}
      <section className="mx-auto max-w-6xl px-6 py-20">
        <p className="font-mono text-xs uppercase tracking-[0.2em] text-redoxide">Member dashboard</p>
        <h2 className="mt-3 font-display text-2xl font-semibold text-soil sm:text-3xl">What is included with access</h2>
        <div className="mt-8 grid gap-5 sm:grid-cols-3">
          <div className="rounded-2xl border border-soil/10 p-6">
            <p className="font-display text-lg text-soil">Recorded course clips</p>
            <p className="mt-2 font-body text-sm leading-relaxed text-soil/65">Every module filmed on the land it is teaching. Watch on your own schedule, as many times as you need.</p>
          </div>
          <div className="rounded-2xl border border-soil/10 p-6">
            <p className="font-display text-lg text-soil">Your grazing chart</p>
            <p className="mt-2 font-body text-sm leading-relaxed text-soil/65">A planning tool for your own paddocks, your own herd, and your own rotation. Paddock register, move log, and rain records.</p>
          </div>
          <div className="rounded-2xl border border-soil/10 p-6">
            <p className="font-display text-lg text-soil">Downloadable resources</p>
            <p className="mt-2 font-body text-sm leading-relaxed text-soil/65">Worksheets, reference sheets, and planning aids you can print and keep in the bakkie.</p>
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section id="pricing" className="bg-soil py-20 text-bone">
        <div className="mx-auto max-w-xl px-6 text-center">
          <h2 className="font-display text-2xl font-semibold sm:text-3xl">Lifetime access</h2>
          <p className="mt-3 font-body text-bone/70">One payment. No subscription. Every clip, the grazing chart tool, and every resource.</p>
          <p className="mt-8 font-display text-5xl font-semibold">
            R4,500<span className="ml-2 font-body text-base font-normal text-bone/50">once-off</span>
          </p>
          <button
            onClick={handleBuy}
            disabled={checkoutLoading || hasAccess}
            className="mt-8 w-full rounded-full bg-redoxide px-7 py-4 font-body font-medium text-bone transition hover:bg-redoxide/90 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {hasAccess ? "You already have access" : checkoutLoading ? "Starting checkout..." : "Get lifetime access"}
          </button>
          {checkoutError && <p className="mt-3 text-sm text-veldgold">{checkoutError}</p>}
          <p className="mt-4 font-mono text-xs uppercase tracking-wide text-bone/40">Secure payment via Stripe</p>
        </div>
      </section>

      <Footer />
    </div>
  );
}
