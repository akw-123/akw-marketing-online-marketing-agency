import React from "react";
import { motion } from "framer-motion";
import { ArrowRight, Gift } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function PricingSection() {
  const navigate = useNavigate();

  return (
    <section id="pricing" className="py-20 md:py-28 px-6">
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-10"
        >
          <span className="inline-flex items-center gap-2 bg-white border border-stone-200 rounded-full px-4 py-1.5 text-xs font-medium text-stone-600 mb-6">
            <Gift className="w-3.5 h-3.5" />
            Free Stuff
          </span>
          <h2 className="text-3xl md:text-5xl font-bold text-stone-900 tracking-tight mb-4">
            3 Tips to Rank Higher{" "}
            <span className="italic" style={{ fontFamily: "Georgia, 'Times New Roman', serif" }}>
              on Google
            </span>
          </h2>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.15 }}
          className="bg-stone-900 rounded-3xl p-10 md:p-14 text-center"
        >
          <p className="text-stone-300 text-base md:text-lg leading-relaxed max-w-2xl mx-auto mb-10">
            Get a free video showing you the first three things we do when we start working with a local business to get them ranking in the top 3 on Google Maps. No technical know-how needed. Enter your email and you'll get instant access.
          </p>
          <button
            onClick={() => navigate("/free-analysis")}
            className="inline-flex items-center gap-2 bg-white hover:bg-stone-100 text-stone-900 font-bold px-8 py-4 rounded-full text-base transition-colors"
          >
            Get 3 FREE Tips <ArrowRight className="w-5 h-5" />
          </button>
        </motion.div>
      </div>
    </section>
  );
}