import React from "react";
import { motion } from "framer-motion";
import { Star, Quote } from "lucide-react";

const testimonials = [
  {
    name: "James Henderson",
    role: "Plumbing Company Owner",
    text: "We went from page 5 to the top 3 in just 8 weeks. Our calls tripled and we had to hire two new technicians to keep up with the demand.",
    avatar: "JH",
  },
  {
    name: "Andre",
    role: "Dental Practice Manager",
    text: "ProfResults delivered exactly what they promised. We're now ranking #1 for our main keyword and new patient appointments have skyrocketed.",
    avatar: "A",
  },
  {
    name: "David Chen",
    role: "Real Estate Agent",
    text: "I was skeptical at first, but the results speak for themselves. My Google Maps listing now generates 40+ leads per month consistently.",
    avatar: "DC",
  },
];

export default function TestimonialsSection() {
  return (
    <section id="testimonials" className="py-20 md:py-28 px-6">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-14"
        >
          <span className="inline-flex items-center gap-2 bg-white border border-stone-200 rounded-full px-4 py-1.5 text-xs font-medium text-stone-600 mb-6">
            Testimonials
          </span>
          <h2 className="text-3xl md:text-4xl font-bold text-stone-900 tracking-tight">
            What Our{" "}
            <span
              className="italic font-bold"
              style={{ fontFamily: "Georgia, 'Times New Roman', serif" }}
            >
              Clients
            </span>{" "}
            Say
          </h2>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-6">
          {testimonials.map((t, idx) => (
            <motion.div
              key={t.name}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: idx * 0.15 }}
              className="bg-white/70 backdrop-blur-sm border border-stone-200/60 rounded-2xl p-8 hover:shadow-lg hover:shadow-stone-200/50 transition-all duration-300 relative"
            >
              <Quote className="w-8 h-8 text-stone-100 absolute top-6 right-6" />
              <div className="flex gap-1 mb-4">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />
                ))}
              </div>
              <p className="text-sm text-stone-600 leading-relaxed mb-6">
                "{t.text}"
              </p>
              <div className="flex items-center gap-3 pt-4 border-t border-stone-100">
                <div className="w-10 h-10 rounded-full bg-stone-900 flex items-center justify-center text-white text-xs font-bold">
                  {t.avatar}
                </div>
                <div>
                  <p className="text-sm font-semibold text-stone-900">{t.name}</p>
                  <p className="text-xs text-stone-400">{t.role}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}