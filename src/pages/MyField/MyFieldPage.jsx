import React, { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import DecisionStage from "./stages/DecisionStage";
import CategoryStage from "./stages/CategoryStage";
import CropGalleryStage from "./stages/CropGalleryStage";
import PlannerStage from "./stages/PlannerStage";
import ResultStage from "./stages/ResultStage";

export default function MyFieldPage() {
  const [stage, setStage] = useState("decision");
  const [mode, setMode] = useState(null); // "ai" | "manual"
  const [systemData, setSystemData] = useState(null);

  const [selectedCategory, setSelectedCategory] = useState(null);
  const [selectedCrop, setSelectedCrop] = useState(null);

  const [area, setArea] = useState(2);
  const [planResult, setPlanResult] = useState(null);
  /* ================= LOAD AI DATA ================= */
  useEffect(() => {
    const saved = sessionStorage.getItem("soilHealthSnapshot");
    if (saved) {
      try {
        setSystemData(JSON.parse(saved));
      } catch (err) {
        console.error("Invalid soilHealthSnapshot");
      }
    }
  }, []);

  return (
    <motion.section
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="p-6 space-y-6"
    >

      <AnimatePresence mode="wait">
        {/* ================= DECISION STAGE ================= */}
        {stage === "decision" && (
          <DecisionStage
            systemData={systemData}
            onSystem={() => {
              if (!systemData) {
                alert("Please detect soil & weather data first.");
                return;
              }
              setMode("ai");
              setStage("crop");
            }}

            onManual={() => {
              setMode("manual");
              setStage("category");
            }}
          />

        )}

        {/* ================= CATEGORY (MANUAL ONLY) ================= */}
        {stage === "category" && mode === "manual" && (
          <CategoryStage
            onSelectCategory={(cat) => {
              setSelectedCategory(cat);
              setStage("crop");
            }}
            onBack={() => setStage("decision")}
          />
        )}

        {/* ================= CROP GALLERY ================= */}
        {stage === "crop" && (
          <CropGalleryStage
            mode={mode}
            systemData={systemData}
            category={selectedCategory}
            onSelectCrop={(crop) => {
              setSelectedCrop(crop);
              setStage("planner");
            }}
            onBack={() =>
              setStage(mode === "ai" ? "decision" : "category")
            }
          />
        )}

        {/* ================= PLANNER ================= */}
        {stage === "planner" && selectedCrop && (
          <PlannerStage
            crop={selectedCrop}
            area={area}
            setArea={setArea}
            onNext={(plan) => {
              console.log("PLAN RECEIVED:", plan); // 👈 debugging proof
              setPlanResult(plan);
              setStage("result");
            }}
            onBack={() => setStage("crop")}
          />


        )}

        {/* ================= RESULT ================= */}
        {stage === "result" && (
          <ResultStage
            crop={selectedCrop}
            area={area}
            plan={planResult}
            onRestart={() => {
              setStage("decision");
              setSelectedCrop(null);
              setSelectedCategory(null);
              setMode(null);
              setPlanResult(null);
            }}
          />

        )}
      </AnimatePresence>
    </motion.section>
  );
}
