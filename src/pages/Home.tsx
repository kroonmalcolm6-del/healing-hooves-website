import { useState, FormEvent } from "react";
import { Nav } from "../components/Nav";
import { Footer } from "../components/Footer";

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
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [sent, setSent] = useState(false);

  const handleEnquire = async (e: FormEvent) => {
    e.preventDefault();
    const res = await fetch("https://formsubmit.co/ajax/healinghooves@blueskysa.com", {
      method: "POST",
      headers: { "Content-Type": "application/json", Accept: "application/json" },
      body: JSON.stringify({ name, email, message }),
    });
    if (res.ok) setSent(true);
  };

  return (
    <div className="min-h-screen bg-bone">
      <Nav />

      {/* Hero */}
      <section className="bg-soil text-center px-6 py-20">
        <div className="w-24 h-24 rounded-full bg-white border-2 border-redoxide/30 mx-auto mb-6 overflow-hidden flex items-center justify-center">
          <img src="/logo.png" alt="Healing Hooves logo" className="w-full h-full object-cover" onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }} />
        </div>
        <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-redoxide/60 mb-1">Healing Hooves RLM · Est. 2018</p>
        <h1 className="font-display text-3xl font-black text-redoxide mb-1">Healing Hooves</h1>
        <p className="font-mono text-[10px] uppercase tracking-[0.25em] text-bone/30 mb-8">Holistic Management Training</p>
        <p className="font-display text-3xl sm:text-4xl font-black text-bone leading-[1.15] max-w-2xl mx-auto mb-5">
          Regenerative land management,<br />taught from the land.
        </p>
        <p className="font-body text-base leading-relaxed text-bone/55 max-w-xl mx-auto mb-10">
          Healing Hooves RLM was founded in 2018 to provide an enduring conduit for learning
          and development in Regenerative Land Management — premised on the foundations of
          Holistic Management, a framework for dealing with the complexity of nature.
        </p>
        <div className="flex flex-wrap items-center justify-center gap-4">
          <a href="#course" className="rounded-full bg-redoxide px-8 py-3.5 font-display font-black text-soil text-sm transition hover:bg-redoxide/90">The 5-day course</a>
          <a href="#enquire" className="rounded-full border border-bone/20 px-8 py-3.5 font-display font-black text-bone text-sm transition hover:border-bone/50">Enquire Now</a>
        </div>
      </section>

      {/* What is Holistic Management */}
      <section className="px-6 py-20 text-center">
        <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-healed mb-4">The foundation</p>
        <h2 className="font-display text-3xl sm:text-4xl font-black text-soil mb-5">What is Holistic Management?</h2>
        <p className="font-body text-base leading-relaxed text-soil/60 max-w-2xl mx-auto mb-12">
          Holistic Management recognises that everything humans produce or consume comes from nature,
          and that we use economies to manage nature in order to produce everything required for our
          existence. The framework — developed by Allan Savory and refined over decades by
          practitioners worldwide — gives land managers the tools to make decisions that are
          ecologically sound, financially viable, and socially meaningful, all at once.
        </p>
        <div className="grid sm:grid-cols-3 gap-4 max-w-3xl mx-auto">
          {[
            { title: "Planned grazing", body: "Using Holistic Planned Grazing as a framework for profitable and ecologically sensible outcomes — both open-season and closed-season planning, following the Savory Institute Aide Memoire." },
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

      {/* 5-day course */}
      <section id="course" className="px-6 py-20 text-center">
        <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-healed mb-4">Flagship training</p>
        <h2 className="font-display text-3xl sm:text-4xl font-black text-soil mb-4">The 5-day Holistic<br />Management course</h2>
        <p className="font-body text-base leading-relaxed text-soil/60 max-w-2xl mx-auto mb-12">
          Upon completion you will be equipped with every tool you need to begin your regenerative
          journey — from ecological literacy and holistic decision making, through to grazing
          planning, financial planning, and ecological outcome verification.
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

      {/* About Roland */}
      <section id="roland" className="bg-soil px-6 py-20">
        <div className="mx-auto max-w-6xl">
          <div className="grid lg:grid-cols-[1fr_380px] gap-12 items-start">
            <div>
              <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-redoxide/55 mb-4">Your instructor</p>
              <h2 className="font-display text-3xl sm:text-4xl font-black text-redoxide mb-1">Roland Kroon</h2>
              <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-bone/30 mb-10">Savory Institute Master Field Professional</p>
              <div className="space-y-6 font-body text-[15px] leading-[1.9] text-bone/65 mb-12">
                <p>Roland Kroon grew up inside Holistic Management before it had fully found its name. His family farmed across South Africa and Namibia, and it was there, in the late 1960s, that his father first crossed paths with Allan Savory. When his father died in 1976, leaving his mother to manage seven farming properties, the family&apos;s education in land and livestock management became a matter of necessity — and Roland, still a child, was part of the decision-making from the start.</p>
                <p>He returned to farm full-time in 1990, taking over Excelsior — a Karoo property that had been neglected for decades. Since then he has rebuilt it into a thriving cattle operation: 120 grazing paddocks, 68km of pipeline, and more than double the original carrying capacity, alongside a full conversion from sheep to cattle. Excelsior has been EOV certified since 2023, with beef marketed under the Land to Market label.</p>
                <p>Along the way, Roland co-founded and ran the South African Centre for Holistic Management, was invited to speak at the international Holistic Management conference in Snowbird, Utah, and trained directly under figures like Allan Savory, Stan Parsons, Dr Terry McKosker, and Bud Williams. He later completed RCS Australia&apos;s Grazing for Profit, Executive Link, and Masterlink programmes, and spent several years running RCS&apos;s Wealth Creation courses across South Africa.</p>
                <p>One of the projects he is proudest of: designing and running a three-year programme training sheep herders to regenerate a 24,000-hectare unfenced game reserve — believed to be the first reintegration of domestic livestock as a land management tool in a South African game reserve. That work led to co-founding the Herding Academy, where he has taught the Holistic Management curriculum to three cohorts of students.</p>
                <p>Roland is a Savory Institute Master Field Professional — an accreditation shared with a small number of people worldwide. After 45 years in the field, he brings that depth of hands-on, hard-won experience to every course he teaches at Healing Hooves.</p>
              </div>
              <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-bone/25 mb-6">Credentials & experience</p>
              <ul className="grid sm:grid-cols-2 gap-x-10 gap-y-3.5">
                {ROLAND_CREDENTIALS.map((item) => (
                  <li key={item} className="flex gap-3 font-body text-sm text-bone/60">
                    <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-redoxide" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>

            {/* Roland's photo */}
            <div className="lg:sticky lg:top-24">
              <div className="rounded-2xl overflow-hidden border border-bone/10">
                <img src="/roland.jpg" alt="Roland Kroon on Excelsior Farm" className="w-full object-cover" />
              </div>
              <p className="font-mono text-[10px] text-bone/25 mt-3 text-center uppercase tracking-wide">Roland Kroon · Excelsior Farm, Eastern Cape</p>
            </div>
          </div>
        </div>
      </section>

      {/* Enquire Now */}
      <section id="enquire" className="px-6 py-24 text-center">
        <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-healed mb-4">Get in touch</p>
        <h2 className="font-display text-3xl sm:text-4xl font-black text-soil mb-3">Enquire about the course</h2>
        <p className="font-body text-sm text-soil/50 max-w-sm mx-auto mb-10">
          Interested in attending a Holistic Management course? Get in touch and we will be in contact.
        </p>
        {sent ? (
          <div className="max-w-md mx-auto rounded-2xl bg-healed/10 border border-healed/20 p-8">
            <p className="font-display font-black text-xl text-soil mb-2">Thank you</p>
            <p className="font-body text-sm text-soil/60">We have received your enquiry and will be in touch shortly.</p>
          </div>
        ) : (
          <form onSubmit={handleEnquire} className="max-w-md mx-auto space-y-4">
            <input type="text" required placeholder="Your name" value={name} onChange={(e) => setName(e.target.value)}
              className="w-full rounded-xl border border-soil/15 bg-white px-4 py-3 font-body text-sm text-soil outline-none focus:border-redoxide" />
            <input type="email" required placeholder="Your email" value={email} onChange={(e) => setEmail(e.target.value)}
              className="w-full rounded-xl border border-soil/15 bg-white px-4 py-3 font-body text-sm text-soil outline-none focus:border-redoxide" />
            <textarea required placeholder="Tell us about your farm and what you are hoping to achieve" value={message} onChange={(e) => setMessage(e.target.value)} rows={4}
              className="w-full rounded-xl border border-soil/15 bg-white px-4 py-3 font-body text-sm text-soil outline-none focus:border-redoxide resize-none" />
            <button type="submit" className="w-full rounded-full bg-soil px-8 py-4 font-display font-black text-redoxide text-sm transition hover:bg-shutter">
              Send enquiry
            </button>
          </form>
        )}
        <p className="mt-8 font-body text-sm text-soil/40">
          Or email us directly at{" "}
          <a href="mailto:healinghooves@blueskysa.com" className="text-redoxide hover:text-redoxide/70 transition">
            healinghooves@blueskysa.com
          </a>
        </p>
      </section>

      <Footer />
    </div>
  );
}
