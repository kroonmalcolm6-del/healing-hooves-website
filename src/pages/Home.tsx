import { useState } from "react";
import { useSearchParams } from "react-router-dom";
import { Nav } from "../components/Nav";
import { Footer } from "../components/Footer";
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

const ROLAND_CREDENTIALS = [
  "Savory Institute Master Field Professional",
  "Trained directly under Allan Savory, Stan Parsons, Dr Terry McKosker & Bud Williams",
  "Co-founder, South African Centre for Holistic Management",
  "Co-founder, the Herding Academy — taught HM curriculum to three cohorts",
  "Speaker at the international Holistic Management conference, Snowbird, Utah",
  "Completed RCS Australia: Grazing for Profit, Executive Link & Masterlink",
  "Ran RCS Wealth Creation courses across South Africa",
  "Excelsior Farm: 120 paddocks, 68km of pipeline, double original carrying capacity",
  "Full conversion from sheep to cattle on Excelsior",
  "EOV certified since 2023 — beef marketed under the Land to Market label",
  "Designed & ran a 3-year programme regenerating a 24,000ha unfenced game reserve",
  "Believed to be the first reintegration of domestic livestock in a SA game reserve",
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
    if (error || !data?.url) { setCheckoutError("Couldn\'t start checkout. Please try again."); return; }
    window.location.href = data.url;
  };

  return (
    <div className="min-h-screen bg-bone">
      <Nav />

      {checkoutRequired && (
        <div className="bg-redoxide/20 px-6 py-3 text-center font-body text-sm text-soil">
          You are signed in — finish your purchase below to unlock the dashboard.
        </div>
      )}

      {/* ── Hero — dark green like app login screen ── */}
      <section className="bg-soil text-center px-6 py-20">
        <div className="w-24 h-24 rounded-full bg-white border-2 border-redoxide/30 mx-auto mb-6 overflow-hidden flex items-center justify-center">
          <img src="/logo.png" alt="Healing Hooves logo" className="w-full h-full object-cover" onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }} />
        </div>
        <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-redoxide/60 mb-1">
          Healing Hooves RLM · Est. 2018
        </p>
        <h1 className="font-display text-3xl font-black text-redoxide mb-1">Healing Hooves</h1>
        <p className="font-mono text-[10px] uppercase tracking-[0.25em] text-bone/30 mb-8">
          Holistic Management Training
        </p>
        <p className="font-display text-3xl sm:text-4xl font-black text-bone leading-[1.15] max-w-2xl mx-auto mb-5">
          Regenerative land management,<br />taught from the land.
        </p>
        <p className="font-body text-base leading-relaxed text-bone/55 max-w-xl mx-auto mb-10">
          Healing Hooves RLM was founded in 2018 to provide an enduring conduit for learning
          and development in Regenerative Land Management — premised on the foundations of
          Holistic Management, a new management framework for dealing with the complexity of nature.
        </p>
        <div className="flex flex-wrap items-center justify-center gap-4">
          <a href="#course" className="rounded-full bg-redoxide px-8 py-3.5 font-display font-black text-soil text-sm transition hover:bg-redoxide/90">
            The 5-day course
          </a>
          <a href="#roland" className="font-body text-sm text-bone/45 border-b border-bone/20 pb-0.5 hover:text-bone/70 transition">
            About Roland →
          </a>
        </div>
      </section>

      {/* ── What is Holistic Management ── */}
      <section className="px-6 py-20 text-center">
        <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-healed mb-4">The foundation</p>
        <h2 className="font-display text-3xl sm:text-4xl font-black text-soil mb-5">What is Holistic Management?</h2>
        <p className="font-body text-base leading-relaxed text-soil/60 max-w-2xl mx-auto mb-12">
          Holistic Management recognises that everything humans produce or consume comes from nature,
          and that we use economies to manage nature in order to produce everything required for our
          existence. The framework — developed by Allan Savory and refined over decades by
          practitioners worldwide — gives land managers the tools to make decisions that are
          ecologically sound, financially viable, and socially meaningful, all at once. Much of this
          work is attributed to the early pioneers: Allan Savory, Terry McKosker, Stan Parsons,
          Norman Kroon, and Malcolm and Wendy Kroon, among others — people who had the courage,
          in the face of withering criticism, to chip away at finding the root cause of the massive
          biodiversity loss evident in our ecosystem.
        </p>
        <div className="grid sm:grid-cols-3 gap-4 max-w-3xl mx-auto">
          {[
            { title: "Planned grazing", body: "Using Holistic Planned Grazing as a framework for profitable and ecologically sensible outcomes — both the open season (growing) and the closed season, following the Savory Institute Aide Memoire." },
            { title: "The E-Chart", body: "The grazing plan converted from a manual chart to an electronic chart. All arithmetic handled for you — the same steps as the manual version, in a fraction of the time." },
            { title: "Ecological literacy", body: "Understanding the four ecosystem processes that determine the health of your land — and learning to read what the land is telling you before you intervene." },
          ].map((c) => (
            <div key={c.title} className="rounded-2xl bg-soil/[0.04] border border-soil/[0.07] p-6 text-left">
              <p className="font-display font-black text-base text-soil mb-2">{c.title}</p>
              <p className="font-body text-sm leading-relaxed text-soil/58">{c.body}</p>
            </div>
          ))}
        </div>
      </section>

      <div className="h-px bg-soil/10 mx-8" />

      {/* ── 5-day course ── */}
      <section id="course" className="px-6 py-20 text-center">
        <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-healed mb-4">Flagship training</p>
        <h2 className="font-display text-3xl sm:text-4xl font-black text-soil mb-4">The 5-day Holistic<br />Management course</h2>
        <p className="font-body text-base leading-relaxed text-soil/60 max-w-2xl mx-auto mb-12">
          Upon completion you will be equipped with absolutely every tool you need to begin your
          regenerative journey — from ecological literacy and holistic decision making, through
          to grazing planning, financial planning, and ecological outcome verification.
        </p>
        <ol className="max-w-xl mx-auto text-left">
          {COURSE_TOPICS.map((topic, i) => (
            <li key={topic.title} className="flex gap-5 border-t border-soil/10 py-4">
              <span className="font-mono text-[10px] text-redoxide min-w-[22px] mt-1 tracking-wide font-bold">{String(i + 1).padStart(2, "0")}</span>
              <div>
                <p className="font-display font-bold text-sm text-soil">{topic.title}</p>
                <p className="font-body text-xs text-soil/52 mt-0.5 leading-relaxed">{topic.detail}</p>
              </div>
            </li>
          ))}
        </ol>
      </section>

      <div className="h-px bg-soil/10 mx-8" />

      {/* ── What is included ── */}
      <section className="px-6 py-20 text-center">
        <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-healed mb-4">Member dashboard</p>
        <h2 className="font-display text-3xl sm:text-4xl font-black text-soil mb-4">What is included</h2>
        <p className="font-body text-base text-soil/60 max-w-lg mx-auto mb-12">
          One payment gives you lifetime access to all three — no subscription, no expiry.
        </p>
        <div className="grid sm:grid-cols-3 gap-4 max-w-3xl mx-auto">
          {[
            { title: "Recorded course clips", body: "Every module filmed on the land it teaches. Watch on your own schedule, as many times as you need." },
            { title: "Your grazing chart", body: "A planning tool for your own paddocks, herd and rotation. Paddock register, move log, and rain records — all in one place." },
            { title: "Downloadable resources", body: "Worksheets, reference sheets, and planning aids you can print and keep in the bakkie." },
          ].map((c) => (
            <div key={c.title} className="rounded-2xl bg-white border border-soil/[0.07] p-6 text-left">
              <div className="w-7 h-7 rounded-full bg-healed/15 mb-4 flex items-center justify-center">
                <div className="w-2.5 h-2.5 rounded-full bg-healed" />
              </div>
              <p className="font-display font-black text-sm text-soil mb-2">{c.title}</p>
              <p className="font-body text-sm leading-relaxed text-soil/55">{c.body}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── About Roland — FULL story, nothing cut ── */}
      <section id="roland" className="bg-soil px-6 py-20 text-center">
        <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-redoxide/55 mb-4">Your instructor</p>
        <h2 className="font-display text-3xl sm:text-4xl font-black text-redoxide mb-1">Roland Kroon</h2>
        <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-bone/30 mb-12">
          Savory Institute Master Field Professional
        </p>

        <div className="max-w-2xl mx-auto text-left space-y-6 font-body text-[15px] leading-[1.9] text-bone/65 mb-14">
          <p>
            Roland Kroon grew up inside Holistic Management before it had fully found its name.
            His family farmed across South Africa and Namibia, and it was there, in the late
            1960s, that his father first crossed paths with Allan Savory. When his father died
            in 1976, leaving his mother to manage seven farming properties, the family&apos;s
            education in land and livestock management became a matter of necessity — and Roland,
            still a child, was part of the decision-making from the start.
          </p>
          <p>
            He returned to farm full-time in 1990, taking over Excelsior — a Karoo property
            that had been neglected for decades. Since then he has rebuilt it into a thriving
            cattle operation: 120 grazing paddocks, 68km of pipeline, and more than double the
            original carrying capacity, alongside a full conversion from sheep to cattle.
            Excelsior has been EOV certified since 2023, with beef marketed under the
            Land to Market label.
          </p>
          <p>
            Along the way, Roland co-founded and ran the South African Centre for Holistic
            Management, was invited to speak at the international Holistic Management conference
            in Snowbird, Utah, and trained directly under figures like Allan Savory, Stan Parsons,
            Dr Terry McKosker, and Bud Williams. He later completed RCS Australia&apos;s
            Grazing for Profit, Executive Link, and Masterlink programmes, and spent several
            years running RCS&apos;s Wealth Creation courses across South Africa.
          </p>
          <p>
            One of the projects he is proudest of: designing and running a three-year programme
            training sheep herders to regenerate a 24,000-hectare unfenced game reserve —
            believed to be the first reintegration of domestic livestock as a land management
            tool in a South African game reserve. That work led to co-founding the Herding
            Academy, where he has taught the Holistic Management curriculum to three cohorts
            of students.
          </p>
          <p>
            Roland is a Savory Institute Master Field Professional — an accreditation shared
            with a small number of people worldwide. After 45 years in the field, he brings
            that depth of hands-on, hard-won experience to every course he teaches at
            Healing Hooves.
          </p>
        </div>

        <div className="max-w-2xl mx-auto">
          <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-bone/25 mb-6 text-center">
            Credentials & experience
          </p>
          <ul className="grid sm:grid-cols-2 gap-x-10 gap-y-3.5 text-left">
            {ROLAND_CREDENTIALS.map((item) => (
              <li key={item} className="flex gap-3 font-body text-sm text-bone/60">
                <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-redoxide" />
                {item}
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* ── Pricing ── */}
      <section id="pricing" className="px-6 py-24 text-center bg-bone">
        <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-healed mb-4">Member access</p>
        <h2 className="font-display text-3xl sm:text-4xl font-black text-soil mb-3">Lifetime access</h2>
        <p className="font-body text-sm text-soil/50 max-w-sm mx-auto mb-8">
          One payment. Every clip, the grazing chart tool, and all downloadable resources —
          no subscription, no expiry.
        </p>
        <p className="font-display text-6xl font-black text-soil mb-1">R4,500</p>
        <p className="font-body text-sm text-soil/35 mb-10">once-off</p>
        <button
          onClick={handleBuy}
          disabled={checkoutLoading || hasAccess}
          className="rounded-full bg-soil px-10 py-4 font-display font-black text-redoxide text-sm transition hover:bg-shutter disabled:cursor-not-allowed disabled:opacity-50"
        >
          {hasAccess ? "You already have access" : checkoutLoading ? "Starting checkout…" : "Get lifetime access"}
        </button>
        {checkoutError && <p className="mt-4 text-xs text-healed">{checkoutError}</p>}
        <p className="mt-5 font-mono text-[10px] uppercase tracking-[0.15em] text-soil/25">
          Secure payment via Stripe
        </p>
      </section>

      {/* ── Contact ── */}
      <section className="bg-soil px-6 py-14 text-center border-t border-redoxide/10">
        <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-bone/30 mb-3">Get in touch</p>
        <a
          href="mailto:healinghooves@blueskysa.com"
          className="font-display font-black text-xl text-redoxide hover:text-redoxide/75 transition"
        >
          healinghooves@blueskysa.com
        </a>
        <p className="font-body text-sm text-bone/35 mt-2">
          Questions about the course, access, or anything else — reach us directly.
        </p>
      </section>

      <Footer />
    </div>
  );
}
