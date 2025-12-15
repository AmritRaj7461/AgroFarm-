import React from "react";
import { motion } from "framer-motion";
import { exportPlanPdf } from "../utils/exportPlanPdf";

export default function ResultStage({ crop, area, plan, onRestart }) {
  return (
    <motion.section
      className="min-h-screen px-8 py-12 text-white"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      {/* PDF CONTENT */}
      <div
        id="plan-pdf"
        className="pdf-safe max-w-4xl mx-auto rounded-3xl p-8"
      >
        <p className="text-xs uppercase tracking-wide text-emerald-400 mb-2">
          Final Crop Plan
        </p>

        <h2 className="text-3xl font-bold mb-6">
          {crop.name} Farming Plan
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm">
          <Info label="Crop" value={crop.name} />
          <Info label="Area" value={`${area} acres`} />
          <Info label="Duration" value={crop.duration || "—"} />
          <Info label="Water Requirement" value={crop.water || "—"} />
          <Info label="Expected Yield" value={`${plan?.expectedYield ?? "—"} quintals`} />
          <Info label="Estimated Profit" value={`₹ ${plan?.profit?.toLocaleString() ?? "—"}`} />
        </div>

        <div className="mt-6 text-xs text-slate-400">
          🤖 Optimized using soil, climate & market intelligence  
          <br />
          Generated on: {new Date().toLocaleDateString()}
        </div>
      </div>

      {/* ACTIONS */}
      <div className="flex justify-center gap-4 mt-10">
        <button
          onClick={() =>
            exportPlanPdf(
              "plan-pdf",
              `${crop.name}_Farming_Plan.pdf`
            )
          }
          className="px-6 py-3 rounded-xl bg-emerald-500 hover:bg-emerald-600
                     text-sm font-semibold shadow-lg"
        >
          Export PDF
        </button>

        <button
          onClick={onRestart}
          className="px-6 py-3 rounded-xl border border-white/20
                     text-sm text-white/80 hover:text-white hover:cursor-pointer"
        >
          Start New Plan
        </button>
      </div>
    </motion.section>
  );
}

function Info({ label, value }) {
  return (
    <div className="rounded-xl bg-white/5 border border-white/10 p-4">
      <p className="text-xs text-slate-400">{label}</p>
      <p className="mt-1 text-lg font-semibold">{value}</p>
    </div>
  );
}
