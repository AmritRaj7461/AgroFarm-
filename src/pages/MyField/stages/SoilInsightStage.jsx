import React, { useEffect } from "react";
import { motion } from "framer-motion";

export default function SoilInsightStage({ onNext }) {
  return (
    <motion.section
      className="relative min-h-screen w-full flex items-center justify-center overflow-hidden
                 bg-gradient-to-br from-[#020617] via-[#020617] to-[#020617]"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      {/* Ambient glow */}
      <div className="absolute -top-32 -left-32 h-[400px] w-[400px] bg-emerald-500/20 blur-[120px]" />
      <div className="absolute bottom-0 right-0 h-[300px] w-[300px] bg-cyan-500/20 blur-[120px]" />

      {/* Main Card */}
      <motion.div
        initial={{ y: 40, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ type: "spring", stiffness: 80, damping: 18 }}
        className="relative z-10 max-w-xl w-full rounded-3xl
                   bg-white/5 backdrop-blur-xl
                   border border-white/10
                   shadow-[0_0_80px_-20px_rgba(16,185,129,0.4)]
                   p-10 text-white"
      >
        {/* Badge */}
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="inline-flex items-center gap-2 px-4 py-1.5
                     rounded-full bg-emerald-500/15
                     text-emerald-300 text-xs mb-6"
        >
          🌱 Smart Soil Intelligence
        </motion.div>

        {/* Heading */}
        <h1 className="text-3xl font-bold leading-tight">
          We’re analyzing your soil & climate
        </h1>

        <p className="mt-3 text-slate-300 text-sm leading-relaxed">
          Based on your location, weather patterns and historical soil data,
          our system suggests the most suitable crop category for
          sustainable yield.
        </p>

        {/* Insight Cards */}
        <div className="mt-8 grid grid-cols-2 gap-4">
          {[
            { label: "Soil Type", value: "Alluvial" },
            { label: "Soil pH", value: "6.6 (Ideal)" },
            { label: "Climate", value: "Sub-tropical" },
            { label: "Rainfall", value: "Moderate" },
          ].map((item, i) => (
            <motion.div
              key={item.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 + i * 0.08 }}
              className="rounded-xl bg-white/5 border border-white/10 p-4"
            >
              <p className="text-xs text-slate-400">{item.label}</p>
              <p className="mt-1 font-semibold text-sm">{item.value}</p>
            </motion.div>
          ))}
        </div>

        {/* Recommendation */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
          className="mt-8 rounded-xl
                     bg-emerald-500/10 border border-emerald-400/30
                     p-5"
        >
          <p className="text-xs text-emerald-300">System Recommendation</p>
          <p className="mt-1 text-lg font-semibold">
            🌾 Rabi Crop Category
          </p>
          <p className="mt-1 text-xs text-emerald-200/80">
            Wheat, Mustard, Barley perform best in your region.
          </p>
        </motion.div>

        {/* CTA */}
        <motion.button
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.97 }}
          onClick={onNext}
          className="mt-8 w-full py-4 rounded-xl
                     bg-emerald-500 text-slate-900
                     font-semibold text-sm
                     shadow-lg shadow-emerald-500/30"
        >
          Continue to Crop Selection →
        </motion.button>
      </motion.div>
    </motion.section>
  );
}
