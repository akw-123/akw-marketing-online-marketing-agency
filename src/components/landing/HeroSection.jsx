import React from "react";
import { motion } from "framer-motion";
import { Users, Clock, Zap } from "lucide-react";

export default function HeroSection() {
  const stats = [
    { icon: Users, label: "32+ Satisfied Clients" },
    { icon: Clock, label: "4+ Years of Experience" },
    { icon: Zap, label: "Lightning Fast Results" },
  ];

  return (
    <section className="pt-28 pb-16 md:pt-36 md:pb-24 px-6">
      <div className="max-w-7xl mx-auto">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
          >
            <div className="flex items-center gap-2 mb-6">
              <span className="relative flex h-2.5 w-2.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-green-500"></span>
              </span>
              <span className="text-sm text-stone-500">Available Worldwide</span>
            </div>

            <h1 className="text-4xl md:text-5xl lg:text-[3.5rem] font-bold text-stone-900 leading-[1.1] tracking-tight">
              Top 3{" "}
              <span className="font-normal">on Google within 90 Days,</span>
              <br />
              <span
                className="font-bold italic text-stone-900"
                style={{ fontFamily: "Georgia, 'Times New Roman', serif" }}
              >
                Guaranteed.
              </span>
            </h1>

            <p className="mt-6 text-stone-600 leading-relaxed max-w-lg">
              <strong className="text-stone-800">75% of all search requests go to the top 3 results on Google Maps</strong>.
              <br /><br />
              And if you're not in the top 3, you're essentially invisible.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="relative"
          >
            <div className="rounded-2xl overflow-hidden shadow-2xl shadow-stone-900/20">
              <script src="https://fast.wistia.com/player.js" async></script>
              <script src="https://fast.wistia.com/embed/g8bkx9vdzr.js" async type="module"></script>
              <style>{`wistia-player[media-id='g8bkx9vdzr']:not(:defined) { background: center / contain no-repeat url('https://fast.wistia.com/embed/medias/g8bkx9vdzr/swatch'); display: block; filter: blur(5px); padding-top:56.25%; }`}</style>
              <wistia-player media-id="g8bkx9vdzr" aspect="1.7777777777777777"></wistia-player>
            </div>
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.5 }}
          className="mt-12 grid grid-cols-1 sm:grid-cols-3 gap-4"
        >
          {stats.map(({ icon: Icon, label }) => (
            <div
              key={label}
              className="flex items-center gap-3 bg-white/60 backdrop-blur-sm border border-stone-200/60 rounded-xl px-5 py-4"
            >
              <Icon className="w-5 h-5 text-stone-400" />
              <span className="text-sm font-medium text-stone-700">{label}</span>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}