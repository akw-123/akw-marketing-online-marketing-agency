import React, { useState } from "react";
import { Phone, Mail, Users, Zap, TrendingUp, CheckCircle, ChevronDown, ChevronUp, ArrowRight, Star } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6 } }
};

const stats = [
  { icon: Users, label: "Satisfied Clients", value: "30+" },
  { icon: TrendingUp, label: "Years of Experience", value: "4+" },
  { icon: Zap, label: "Lightning Fast Results", value: "Proven" },
];

const advantages = [
  {
    title: "Visibility",
    desc: "75% of all leads searching for your services go to the top 3 results. If you're not there, you're invisible.",
  },
  {
    title: "No Wasted Ad Spend",
    desc: "Organic local SEO means no pay-per-click fees or huge ad budgets. You own your rankings.",
  },
  {
    title: "Long-Term Strategy",
    desc: "Once you're in the top 3, you'll usually stay there for years — without additional monthly costs.",
  },
];

const process = [
  { num: "01", title: "Strategy Call", desc: "Book a free call so we can assess your market and current rankings." },
  { num: "02", title: "Onboarding", desc: "We send you simple instructions and get secure access to your Google profile." },
  { num: "03", title: "Execution", desc: "We execute the full strategy, filling your calendar with qualified leads week after week." },
  { num: "04", title: "Track & Scale", desc: "We track relevant data to see what works and do more of it — continuously." },
];

const faqs = [
  { q: "What exactly do you do?", a: "We optimize your Google Business Profile so you rank in the top 3 for the keywords your customers are already searching. More visibility = more calls, more clients." },
  { q: "Which businesses do you work with?", a: "We work with local service businesses that are already doing well and want to scale — contractors, clinics, salons, agencies, and more." },
  { q: "How long before I see results?", a: "Most clients start seeing movement within 30–60 days. Full results typically come in within 2–3 months." },
  { q: "What are the contract terms?", a: "No long-term contracts. If you're ever unhappy, just let us know and we'll part ways on good terms. Simple as that." },
  { q: "How do we get started?", a: "Fill out the application form below or call us directly. If we're a good fit, we'll schedule a strategy call and take it from there." },
];

function FAQItem({ q, a }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="border-b border-stone-200 py-5">
      <button
        className="w-full flex justify-between items-center text-left gap-4"
        onClick={() => setOpen(!open)}
      >
        <span className="text-stone-800 font-medium text-base">{q}</span>
        {open ? <ChevronUp className="w-4 h-4 text-stone-400 flex-shrink-0" /> : <ChevronDown className="w-4 h-4 text-stone-400 flex-shrink-0" />}
      </button>
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="overflow-hidden"
          >
            <p className="text-stone-500 text-sm leading-relaxed mt-3 pr-8">{a}</p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function ContactForm() {
  const [form, setForm] = useState({ name: "", business: "", phone: "", email: "", message: "" });
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
  };

  if (submitted) {
    return (
      <div className="text-center py-12">
        <CheckCircle className="w-12 h-12 text-green-500 mx-auto mb-4" />
        <h3 className="text-xl font-semibold text-stone-900 mb-2">Application Received!</h3>
        <p className="text-stone-500">We'll review your application and reach out within 24–48 hours.</p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-stone-700 mb-1">Your Name *</label>
          <input
            required
            type="text"
            placeholder="John Smith"
            value={form.name}
            onChange={e => setForm({ ...form, name: e.target.value })}
            className="w-full px-4 py-3 rounded-xl border border-stone-200 bg-white text-stone-900 text-sm focus:outline-none focus:ring-2 focus:ring-stone-400"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-stone-700 mb-1">Business Name *</label>
          <input
            required
            type="text"
            placeholder="Your Business"
            value={form.business}
            onChange={e => setForm({ ...form, business: e.target.value })}
            className="w-full px-4 py-3 rounded-xl border border-stone-200 bg-white text-stone-900 text-sm focus:outline-none focus:ring-2 focus:ring-stone-400"
          />
        </div>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-stone-700 mb-1">Phone *</label>
          <input
            required
            type="tel"
            placeholder="+1 (555) 000-0000"
            value={form.phone}
            onChange={e => setForm({ ...form, phone: e.target.value })}
            className="w-full px-4 py-3 rounded-xl border border-stone-200 bg-white text-stone-900 text-sm focus:outline-none focus:ring-2 focus:ring-stone-400"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-stone-700 mb-1">Email *</label>
          <input
            required
            type="email"
            placeholder="you@yourbusiness.com"
            value={form.email}
            onChange={e => setForm({ ...form, email: e.target.value })}
            className="w-full px-4 py-3 rounded-xl border border-stone-200 bg-white text-stone-900 text-sm focus:outline-none focus:ring-2 focus:ring-stone-400"
          />
        </div>
      </div>
      <div>
        <label className="block text-sm font-medium text-stone-700 mb-1">What's your biggest marketing challenge?</label>
        <textarea
          rows={4}
          placeholder="Tell us about your business and what you're struggling with..."
          value={form.message}
          onChange={e => setForm({ ...form, message: e.target.value })}
          className="w-full px-4 py-3 rounded-xl border border-stone-200 bg-white text-stone-900 text-sm focus:outline-none focus:ring-2 focus:ring-stone-400 resize-none"
        />
      </div>
      <button
        type="submit"
        className="w-full bg-stone-900 hover:bg-stone-800 text-white font-semibold py-4 rounded-xl text-sm transition-colors flex items-center justify-center gap-2"
      >
        Send My Application <ArrowRight className="w-4 h-4" />
      </button>
      <p className="text-xs text-stone-400 text-center">We review every application personally. Expect a reply within 24–48 hours.</p>
    </form>
  );
}

export default function MetaAds() {
  return (
    <div className="min-h-screen bg-[#F5F0EB]">
      {/* Minimal Navbar */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-[#F5F0EB]/80 backdrop-blur-xl border-b border-stone-200/50">
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          <a href="/" className="flex items-center gap-2">
            <img
              src="https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/69aa2d66169a7c4374014381/adfe82e85_Logo_official1.png"
              alt="AKW Marketing Logo"
              className="w-8 h-8 rounded-md object-contain"
            />
            <span className="text-lg font-semibold tracking-tight text-stone-900">AKW Marketing</span>
          </a>
          <a href="tel:+15067038558">
            <button className="bg-stone-900 hover:bg-stone-800 text-white rounded-full px-5 h-9 text-sm font-medium flex items-center gap-2 transition-colors">
              <Phone className="w-3.5 h-3.5" />
              +1 506 703 8558
            </button>
          </a>
        </div>
      </nav>

      <div className="pt-24">
        {/* Hero */}
        <section className="max-w-4xl mx-auto px-6 pt-12 pb-8 text-center">
          <motion.div variants={fadeUp} initial="hidden" animate="visible">
            <p className="text-xs font-semibold tracking-widest text-stone-400 uppercase mb-4">Local Business Marketing</p>
            <h1 className="text-4xl md:text-6xl font-bold text-stone-900 leading-tight mb-6">
              The Only Two Things You Need to Know About{" "}
              <span className="italic">Marketing</span>
            </h1>
            <p className="text-lg text-stone-500 max-w-2xl mx-auto mb-8">
              We help local businesses dominate Google search and stay top-of-mind — so the phone keeps ringing, month after month.
            </p>
            <a href="#apply">
              <button className="bg-stone-900 hover:bg-stone-800 text-white font-semibold px-8 py-4 rounded-full text-sm transition-colors inline-flex items-center gap-2">
                Apply Now — It's Free <ArrowRight className="w-4 h-4" />
              </button>
            </a>
          </motion.div>
        </section>

        {/* Video */}
        <section className="max-w-3xl mx-auto px-6 pb-12">
          <motion.div variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }}>
            <div className="rounded-2xl overflow-hidden shadow-lg aspect-video bg-stone-800">
              <iframe
                src="https://www.youtube.com/embed/videoseries?list=PLrMEsRrqkD9W8UraSLHbGCEq_fSUECLzL"
                title="AKW Marketing - Local Business Growth"
                className="w-full h-full"
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            </div>
          </motion.div>
        </section>

        {/* Trust Stats */}
        <section className="max-w-4xl mx-auto px-6 pb-16">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {stats.map((stat, i) => (
              <motion.div
                key={i}
                variants={fadeUp}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="bg-white rounded-2xl border border-stone-200 px-6 py-5 flex items-center gap-3"
              >
                <stat.icon className="w-5 h-5 text-stone-400 flex-shrink-0" />
                <div>
                  <p className="text-xl font-bold text-stone-900">{stat.value}</p>
                  <p className="text-sm text-stone-500">{stat.label}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </section>

        {/* Advantages */}
        <section className="max-w-4xl mx-auto px-6 pb-20">
          <motion.div variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }} className="mb-10 text-center">
            <p className="text-xs font-semibold tracking-widest text-stone-400 uppercase mb-3">The Advantage</p>
            <h2 className="text-3xl md:text-4xl font-bold text-stone-900">
              But, Is This Even <span className="italic">Worth It?</span>
            </h2>
          </motion.div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {advantages.map((adv, i) => (
              <motion.div
                key={i}
                variants={fadeUp}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="bg-white rounded-2xl border border-stone-200 p-6"
              >
                <CheckCircle className="w-5 h-5 text-green-500 mb-3" />
                <h3 className="text-lg font-semibold text-stone-900 mb-2">{adv.title}</h3>
                <p className="text-sm text-stone-500 leading-relaxed">{adv.desc}</p>
              </motion.div>
            ))}
          </div>
        </section>

        {/* Before / After */}
        <section className="max-w-4xl mx-auto px-6 pb-20">
          <motion.div variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }} className="mb-10 text-center">
            <p className="text-xs font-semibold tracking-widest text-stone-400 uppercase mb-3">Before / After</p>
            <h2 className="text-3xl md:text-4xl font-bold text-stone-900">
              The <span className="italic">Difference</span>
            </h2>
          </motion.div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Before */}
            <motion.div variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }} className="bg-white rounded-2xl border border-stone-200 p-6">
              <p className="text-xs font-semibold text-stone-400 uppercase tracking-widest mb-4">Before</p>
              <div className="space-y-3">
                {[
                  { label: "Average Rank", value: "86th", bad: true },
                  { label: "Market Share", value: "1%", bad: true },
                  { label: "Clicks / Month", value: "~5", bad: true },
                  { label: "New Clients / Month", value: "1–2", bad: true },
                ].map((row, i) => (
                  <div key={i} className="flex justify-between items-center py-2 border-b border-stone-100 last:border-0">
                    <span className="text-sm text-stone-500">{row.label}</span>
                    <span className="text-sm font-semibold text-red-400">{row.value}</span>
                  </div>
                ))}
              </div>
            </motion.div>
            {/* After */}
            <motion.div variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }} transition={{ delay: 0.15 }} className="bg-stone-900 rounded-2xl p-6 text-white">
              <p className="text-xs font-semibold text-stone-400 uppercase tracking-widest mb-4">After</p>
              <div className="space-y-3">
                {[
                  { label: "Average Rank", value: "Top 3" },
                  { label: "Market Share", value: "30–60%" },
                  { label: "Clicks / Month", value: "200+" },
                  { label: "New Clients / Month", value: "10–20+" },
                ].map((row, i) => (
                  <div key={i} className="flex justify-between items-center py-2 border-b border-stone-700 last:border-0">
                    <span className="text-sm text-stone-400">{row.label}</span>
                    <span className="text-sm font-semibold text-green-400">{row.value}</span>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>
        </section>

        {/* Process */}
        <section className="max-w-4xl mx-auto px-6 pb-20">
          <motion.div variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }} className="mb-10 text-center">
            <p className="text-xs font-semibold tracking-widest text-stone-400 uppercase mb-3">How Does It Work?</p>
            <h2 className="text-3xl md:text-4xl font-bold text-stone-900">
              It's Pretty <span className="italic">Easy.</span>
            </h2>
          </motion.div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {process.map((step, i) => (
              <motion.div
                key={i}
                variants={fadeUp}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="bg-white rounded-2xl border border-stone-200 p-6"
              >
                <p className="text-3xl font-bold text-stone-200 mb-3">{step.num}</p>
                <h3 className="text-lg font-semibold text-stone-900 mb-2">{step.title}</h3>
                <p className="text-sm text-stone-500 leading-relaxed">{step.desc}</p>
              </motion.div>
            ))}
          </div>
        </section>

        {/* Testimonials */}
        <section className="max-w-4xl mx-auto px-6 pb-20">
          <motion.div variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }} className="mb-10 text-center">
            <p className="text-xs font-semibold tracking-widest text-stone-400 uppercase mb-3">What Clients Say</p>
            <h2 className="text-3xl md:text-4xl font-bold text-stone-900">
              Real Results, Real <span className="italic">Businesses</span>
            </h2>
          </motion.div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { name: "Marc T.", role: "Plumbing Business", quote: "We went from barely any calls to booking out 3 weeks in advance. Incredible." },
              { name: "Sarah L.", role: "Dental Clinic", quote: "AKW got us ranking #1 in our city within 2 months. Our new patient flow doubled." },
              { name: "James R.", role: "HVAC Company", quote: "Best marketing investment we've made. The ROI is undeniable." },
            ].map((t, i) => (
              <motion.div
                key={i}
                variants={fadeUp}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="bg-white rounded-2xl border border-stone-200 p-6"
              >
                <div className="flex gap-0.5 mb-3">
                  {[...Array(5)].map((_, s) => <Star key={s} className="w-4 h-4 fill-yellow-400 text-yellow-400" />)}
                </div>
                <p className="text-sm text-stone-600 leading-relaxed mb-4 italic">"{t.quote}"</p>
                <div>
                  <p className="text-sm font-semibold text-stone-900">{t.name}</p>
                  <p className="text-xs text-stone-400">{t.role}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </section>

        {/* FAQ */}
        <section className="max-w-3xl mx-auto px-6 pb-20">
          <motion.div variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }} className="mb-10 text-center">
            <p className="text-xs font-semibold tracking-widest text-stone-400 uppercase mb-3">FAQs</p>
            <h2 className="text-3xl md:text-4xl font-bold text-stone-900">
              Frequently Asked <span className="italic">Questions</span>
            </h2>
          </motion.div>
          <div className="bg-white rounded-2xl border border-stone-200 px-6 divide-y divide-stone-200">
            {faqs.map((faq, i) => <FAQItem key={i} q={faq.q} a={faq.a} />)}
          </div>
        </section>

        {/* CTA / Application Form */}
        <section id="apply" className="max-w-2xl mx-auto px-6 pb-24">
          <motion.div variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }} className="mb-8 text-center">
            <p className="text-xs font-semibold tracking-widest text-stone-400 uppercase mb-3">Apply Now</p>
            <h2 className="text-3xl md:text-4xl font-bold text-stone-900 mb-3">
              Book Your Free <span className="italic">Strategy Call</span>
            </h2>
            <p className="text-stone-500 text-sm leading-relaxed">
              If this sounds like what your business needs, let's talk. Fill out the form below and we'll review your application personally.
            </p>
          </motion.div>
          <motion.div
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="bg-white rounded-2xl border border-stone-200 p-8"
          >
            <ContactForm />
          </motion.div>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mt-8">
            <a href="tel:+15067038558" className="flex items-center gap-2 text-sm text-stone-500 hover:text-stone-900 transition-colors">
              <Phone className="w-4 h-4" /> +1 506 703 8558
            </a>
            <span className="hidden sm:block text-stone-300">|</span>
            <a href="mailto:contact@akwmarketing.com" className="flex items-center gap-2 text-sm text-stone-500 hover:text-stone-900 transition-colors">
              <Mail className="w-4 h-4" /> contact@akwmarketing.com
            </a>
          </div>
        </section>

        {/* Footer */}
        <footer className="border-t border-stone-200/60 py-8 px-6 text-center">
          <p className="text-xs text-stone-400">
            © {new Date().getFullYear()} AKW Marketing. All rights reserved.
          </p>
        </footer>
      </div>
    </div>
  );
}