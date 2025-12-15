import React, { useMemo } from "react";
import { motion } from "framer-motion";
import { calculateFieldPlan } from "../utils/calc";

export default function PlannerStage({
  crop,
  area,
  setArea,
  onNext,
  onBack
}) {
  const plan = useMemo(
    () => calculateFieldPlan({ crop, area }),
    [crop, area]
  );

  return (
    <motion.section
      className="min-h-screen px-8 py-10 text-white"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      {/* Header */}
      <div className="mb-10">
        <p className="text-xs text-emerald-400 mb-1">
          🤖 Optimized using soil, climate & market intelligence
        </p>

        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs uppercase tracking-wide text-emerald-400">
              Crop Planner
            </p>
            <h2 className="text-3xl font-bold text-white">{crop.name}</h2>
          </div>

          <button
            onClick={onBack}
            className="text-sm text-white/70 hover:text-white"
          >
            ← Back
          </button>
        </div>
      </div>
      {/* AI Suitability Score */}
      <div className="mb-8">
        <p className="text-xs uppercase tracking-wide text-emerald-400 mb-2">
          AI Suitability Score
        </p>

        <div className="w-full bg-white/10 rounded-full h-3 overflow-hidden">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: "82%" }}
            transition={{ duration: 1 }}
            className="h-full bg-gradient-to-r from-emerald-400 to-lime-400"
          />
        </div>

        <p className="mt-2 text-sm text-emerald-300 font-semibold">
          82% – Highly suitable for your soil & climate
        </p>
      </div>

      {/* Area Slider */}
      <div className="bg-white/5 border border-white/10 rounded-2xl p-6 mb-8">
        <p className="text-sm text-slate-300 mb-2">
          Select land area (acres)
        </p>

        <input
          type="range"
          min="1"
          max="20"
          value={area}
          onChange={(e) => setArea(Number(e.target.value))}
          className="w-full accent-emerald-500"
        />

        <p className="mt-3 text-xl font-semibold text-emerald-400">
          {area} acres
        </p>
      </div>
      {/* Risk Analysis */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
        <RiskCard
          title="Climate Risk"
          value="Low"
          color="emerald"
          note="Weather patterns are favorable"
        />
        <RiskCard
          title="Water Stress"
          value="Medium"
          color="amber"
          note="Ensure irrigation during dry spells"
        />
        <RiskCard
          title="Market Volatility"
          value="Low"
          color="emerald"
          note="Stable mandi demand"
        />
      </div>

      {/* AI Reasoning */}
      <div className="rounded-2xl bg-white/5 border border-white/10 p-6 mb-10">
        <p className="text-xs uppercase tracking-wide text-emerald-400 mb-3">
          Why AI recommends {crop.name}
        </p>

        <ul className="space-y-2 text-sm text-slate-300">
          <li>• Matches soil composition and nutrient profile</li>
          <li>• Suitable for current climate and rainfall pattern</li>
          <li>• Strong yield history in nearby regions</li>
          <li>• Good market demand forecast</li>
        </ul>
      </div>

      {/* LIVE CALCULATIONS */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
        <Stat label="Seeds Required" value={`${plan.seedsRequired} kg`} />
        <Stat
          label="Water Needed"
          value={`${plan.waterRequired.toLocaleString()} L`}
        />
        <Stat
          label="Expected Yield"
          value={`${plan.expectedYield} quintals`}
        />
        <Stat
          label="Revenue"
          value={`₹ ${plan.revenue.toLocaleString()}`}
        />
        <Stat
          label="Estimated Cost"
          value={`₹ ${plan.totalCost.toLocaleString()}`}
        />
        <Stat
          label="Estimated Profit"
          value={`₹ ${plan.profit.toLocaleString()}`}
          highlight
        />

      </div>

      {/* NEXT */}
      <button
        onClick={() => onNext(plan)}
        className="px-6 py-3 rounded-xl bg-emerald-500 hover:bg-emerald-600
                   text-sm font-semibold shadow-lg hover:cursor-pointer"
      >
        View Final Plan →
      </button>
    </motion.section>
  );
}

function Stat({ label, value, highlight }) {
  return (
    <div
      className={`rounded-xl p-5 border ${highlight
        ? "border-emerald-400 bg-emerald-500/10"
        : "border-white/10 bg-white/5"
        }`}
    >
      <p className="text-xs text-slate-400">{label}</p>
      <p className="mt-1 text-lg font-semibold">{value}</p>
    </div>
  );
}
function RiskCard({ title, value, note, color }) {
  const colors = {
    emerald: "border-emerald-400/30 text-emerald-400",
    amber: "border-amber-400/30 text-amber-400",
    rose: "border-rose-400/30 text-rose-400",
  };

  return (
    <div className={`rounded-xl p-5 border bg-white/5 ${colors[color]}`}>
      <p className="text-xs text-slate-400">{title}</p>
      <p className="mt-1 text-lg font-semibold">{value}</p>
      <p className="mt-2 text-xs text-slate-400">{note}</p>
    </div>
  );
}
