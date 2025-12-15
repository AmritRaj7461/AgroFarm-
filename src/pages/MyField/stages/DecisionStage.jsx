import React from "react";
import { motion } from "framer-motion";

const cardVariants = {
  hidden: { opacity: 0, y: 40 },
  show: i => ({
    opacity: 1,
    y: 0,
    transition: {
      delay: i * 0.15,
      type: "spring",
      stiffness: 80,
      damping: 18
    }
  })
};

export default function DecisionStage({ onSystem, onManual }) {
  return (
    <motion.section
      className="relative min-h-screen w-full flex items-center justify-center
                 bg-gradient-to-br from-[#020617] via-[#020617] to-[#020617]"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      {/* Ambient lights */}
      <div className="absolute top-1/4 left-0 h-64 w-64 bg-emerald-500/20 blur-[120px]" />
      <div className="absolute bottom-0 right-1/4 h-64 w-64 bg-sky-500/20 blur-[120px]" />

      <div className="relative z-10 max-w-5xl w-full px-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <p className="text-xs text-emerald-400 tracking-wide uppercase">
            Choose your planning mode
          </p>
          <h2 className="mt-2 text-3xl font-bold text-white">
            How would you like to select crops?
          </h2>
          <p className="mt-3 text-slate-300 text-sm max-w-xl mx-auto">
            You can follow our intelligent recommendation based on soil & climate,
            or explore crops manually using your own farming experience.
          </p>
        </motion.div>

        {/* Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* System Recommendation */}
          <motion.div
            custom={0}
            variants={cardVariants}
            initial="hidden"
            animate="show"
            whileHover={{ y: -6, scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={onSystem}
            className="group cursor-pointer rounded-3xl p-8
                       bg-gradient-to-br from-emerald-500/15 to-emerald-500/5
                       border border-emerald-400/30
                       backdrop-blur-xl
                       shadow-[0_0_60px_-15px_rgba(16,185,129,0.5)]
                       transition-all"
          >
            <div className="flex items-center justify-between">
              <span className="text-3xl">🤖</span>
              <span className="text-xs px-3 py-1 rounded-full
                               bg-emerald-500/20 text-emerald-300">
                Recommended
              </span>
            </div>

            <h3 className="mt-6 text-xl font-semibold text-white">
              System Suggested Crops
            </h3>

            <p className="mt-2 text-sm text-emerald-100/80">
              Based on soil composition, climate zone, rainfall patterns
              and regional agricultural data.
            </p>

            <ul className="mt-5 space-y-2 text-sm text-emerald-200">
              <li>• Optimized for your region</li>
              <li>• Climate-safe recommendations</li>
              <li>• Higher yield probability</li>
            </ul>

            <div className="mt-8 text-sm font-semibold text-emerald-300">
              Continue with AI recommendation →
            </div>
          </motion.div>

          {/* Manual Selection */}
          <motion.div
            custom={1}
            variants={cardVariants}
            initial="hidden"
            animate="show"
            whileHover={{ y: -6, scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={onManual}
            className="group cursor-pointer rounded-3xl p-8
                       bg-white/5
                       border border-white/10
                       backdrop-blur-xl
                       shadow-[0_0_60px_-20px_rgba(255,255,255,0.15)]
                       transition-all"
          >
            <div className="flex items-center justify-between">
              <span className="text-3xl">🧠</span>
              <span className="text-xs px-3 py-1 rounded-full
                               bg-white/10 text-slate-300">
                Expert Mode
              </span>
            </div>

            <h3 className="mt-6 text-xl font-semibold text-white">
              Manual Crop Selection
            </h3>

            <p className="mt-2 text-sm text-slate-300">
              Choose crop categories yourself if you know your soil,
              irrigation capacity and local market well.
            </p>

            <ul className="mt-5 space-y-2 text-sm text-slate-300">
              <li>• Full control over crop choice</li>
              <li>• Explore all crop categories</li>
              <li>• Ideal for experienced farmers</li>
            </ul>

            <div className="mt-8 text-sm font-semibold text-slate-200">
              Choose crops manually →
            </div>
          </motion.div>
        </div>
      </div>
    </motion.section>
  );
}
