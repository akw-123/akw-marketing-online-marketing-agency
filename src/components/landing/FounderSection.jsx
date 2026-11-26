export default function FounderSection() {
  return (
    <section className="py-20 px-6 border-t border-stone-200/60 bg-stone-50/60">
      <div className="max-w-6xl mx-auto">
        <div className="grid md:grid-cols-2 gap-10 items-center">
          <div className="order-2 md:order-1">
            <span className="inline-flex items-center bg-white border border-stone-200 rounded-full px-4 py-1.5 text-xs font-medium text-stone-600 mb-5">
              Why AKW Marketing
            </span>
            <h2 className="text-3xl md:text-4xl font-bold text-stone-900 tracking-tight mb-5">
              You Talk To The Person Doing The Work
            </h2>
            <p className="text-stone-600 leading-relaxed mb-4">
              Big agencies sell you with a senior strategist, then hand you to a junior account manager with 40 other clients. Here, you work with me, Andre Kadjo.
            </p>
            <p className="text-stone-600 leading-relaxed mb-6">
              I ran this exact playbook on my own site before I sold it to anyone, pages for eight Ontario cities, a completed profile and a citation build. Every client since still gets it run by me, not handed off. Real pages, real fixes, a progress note every week.
            </p>
            <a
              href="/hardest-working-seo-expert-kitchener-waterloo"
              className="inline-flex items-center gap-2 text-stone-900 font-medium hover:text-stone-600 transition-colors"
            >
              Meet the hardest working SEO expert in Kitchener Waterloo
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14" /><path d="m12 5 7 7-7 7" /></svg>
            </a>
            <div className="mt-2">
              <a
                href="/hardest-working-marketing-agency-kitchener-waterloo"
                className="text-sm text-stone-500 hover:text-stone-700 transition-colors"
              >
                Hardest-Working Marketing Agency in Kitchener Waterloo
              </a>
            </div>
          </div>
          <div className="order-1 md:order-2">
            <img
              src="/assets/hero-1570675559675.jpeg"
              alt="Andre Kadjo, founder of AKW Marketing"
              width="400"
              height="400"
              className="w-full max-w-sm mx-auto rounded-2xl shadow-sm"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
