import React from "react";
import { motion } from "framer-motion";
import { CROPS_BY_CATEGORY, ALL_CROPS_LOOKUP } from "../data/cropsByCategory";

import { getCropImage } from "../utils/getCropImage";


export default function CropGalleryStage({
  mode,
  systemData,
  category,
  onBack,
  onSelectCrop
}) {
  let crops = [];
  let title = "";
  let subtitle = "";

  if (mode === "ai") {
    if (!systemData || !systemData.crops) {
      return (
        <div className="text-white text-center mt-20">
          No AI crop recommendations available
        </div>
      );
    }

    const normalize = (name) =>
      name.toLowerCase().replace(/\s+/g, "");

    const aiNames = systemData.crops.map(c => normalize(c.name));

    // 1️⃣ Map AI crops to full data
    const enrichedAI = systemData.crops.map((aiCrop) => {
      const fullCrop =
        Object.values(ALL_CROPS_LOOKUP).find(
          c => normalize(c.name) === normalize(aiCrop.name)
        ) || {};

      return {
        ...fullCrop,
        name: aiCrop.name,
        suitability: aiCrop.suitability || 80,
        ai: true,
      };
    });

    // 2️⃣ Add more crops to ensure minimum 5
    const additionalCrops = Object.values(ALL_CROPS_LOOKUP)
      .filter(c => !aiNames.includes(normalize(c.name)))
      .slice(0, Math.max(0, 5 - enrichedAI.length));

    crops = [...enrichedAI, ...additionalCrops];
    title = "AI Recommended Crops";
  }


  if (mode === "manual") {
    if (!category) return null;

    crops = CROPS_BY_CATEGORY[category.id] || [];
    title = category.name;
    subtitle = `${category.season} crops`;
  }


  return (
    <motion.section
      className="min-h-screen w-full px-10 py-10
                 bg-gradient-to-br from-[#020617] via-[#020617] to-[#020617]"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-10">
        <div>
          <p className="text-xs uppercase tracking-wide text-emerald-400">
            {subtitle}
          </p>
          <h2 className="text-3xl font-bold text-white">
            {title}
          </h2>
        </div>

        <button
          onClick={onBack}
          className="text-white/70 hover:text-white text-sm hover:cursor-pointer"
        >
          ← Back
        </button>
      </div>

      {/* EMPTY STATE */}
      {crops.length === 0 && (
        <p className="text-slate-400">
          No crops available for this category yet.
        </p>
      )}

      {/* Crop Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 max-w-7xl">
        {crops.map((crop, i) => (
          <motion.div
            key={`${crop.name}-${i}`}
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
            whileHover={{
              y: -10,
              boxShadow: "0 30px 80px rgba(16,185,129,0.35)"
            }}
            onClick={() => onSelectCrop(crop)}
            className="cursor-pointer rounded-3xl overflow-hidden
                       bg-white/5 border border-white/10
                       backdrop-blur-xl"
          >
            {/* {Images} */}
            <div className="h-44 overflow-hidden">
              <img
                src={getCropImage(crop.name)}
                alt={crop.name}
                loading="lazy"
                className="w-full h-full object-cover"
              />
            </div>
            {/* Content */}
            <div className="p-5 text-white">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold">{crop.name}</h3>

                {crop.ai && (
                  <span className="text-[10px] px-2 py-0.5 rounded-full
                     bg-emerald-500/20 text-emerald-300 border border-emerald-400/30">
                    AI Pick
                  </span>
                )}
              </div>

              <div className="mt-2 text-xs text-slate-300 space-y-1">
                <p>🌱 Duration: {crop.duration || "—"}</p>
                <p>💧 Water: {crop.water || "—"}</p>
              </div>

              <div className="mt-4 text-sm text-emerald-300 font-semibold">
                Plan this crop →
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </motion.section>
  );
}
