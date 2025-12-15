import React from "react";
import { motion } from "framer-motion";
import { CROP_CATEGORIES } from "../data/cropCategories";
import { getCropImage } from "../utils/getCropImage";
export default function CategoryStage({ onSelectCategory, onBack }) {
  previewCrops: ["Wheat", "Barley", "Gram", "Mustard"]

  return (
    <motion.section
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="min-h-[70vh] flex flex-col items-center justify-center px-6"
    >
      {/* HEADER */}
      <div className="text-center max-w-2xl mb-10">
        <p className="text-xs uppercase tracking-wide text-emerald-400 mb-2">
          Crop categories
        </p>
        <h2 className="text-3xl font-bold text-white mb-3">
          Select a crop category
        </h2>
        <p className="text-sm text-slate-400">
          Choose the category that best matches your farming plan.
        </p>
      </div>

      {/* CATEGORY GRID */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 w-full max-w-5xl">
        {CROP_CATEGORIES.map((cat) => (
          <motion.div
            key={cat.id}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.97 }}
            onClick={() => onSelectCategory(cat)}
            className="cursor-pointer rounded-2xl border border-slate-700 bg-slate-900/60 backdrop-blur p-6 hover:border-emerald-500 transition"
          >
            <div className="flex items-center gap-3 mb-4">
              <div className="text-3xl">{cat.icon}</div>
              <h3 className="text-lg font-semibold text-white">
                {cat.name}
              </h3>
            </div>

            <p className="text-sm text-slate-400 mb-3">
              {cat.description}
            </p>

            {/* IMAGE PREVIEW STRIP */}
            <div className="mt-4 grid grid-cols-4 gap-2">
              {cat.previewCrops.map((cropName) => (
                <img
                  key={cropName}
                  src={getCropImage(cropName)}
                  alt={cropName}
                  className="h-14 w-full object-cover rounded-lg
                 border border-white/10"
                />
              ))}
            </div>

          </motion.div>
        ))}
      </div>

      {/* BACK */}
      <button
        onClick={onBack}
        className="mt-10 text-xs text-slate-400 underline hover:text-white hover:cursor-pointer"
      >
        ← Back to planning mode
      </button>
    </motion.section>
  );
}
