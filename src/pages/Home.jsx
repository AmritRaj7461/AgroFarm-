import React, { useState } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import Chatbot from "../components/ChatBot";

/* ---------------- DATA ---------------- */

const CARDS = [ /* ⬅️ KEEP YOUR CARD DATA EXACTLY SAME */
  {
    title: "Sustainable Farming",
    image: "https://images.unsplash.com/photo-1501004318641-b39e6451bec6",
    short: "Future-ready agriculture for people & planet.",
    details: {
      intro:
        "Sustainable farming focuses on producing food while protecting natural resources, improving soil fertility, and ensuring long-term profitability for farmers.",
      points: [
        "Balances productivity and environmental safety",
        "Reduces long-term farming costs",
        "Protects biodiversity",
        "Improves resilience to climate change",
      ],
      impact:
        "Creates a self-sustaining agricultural ecosystem for future generations.",
    },
  },
  {
    title: "Soil Health Management",
    image: "https://images.unsplash.com/photo-1592982537447-7440770cbfc9",
    short: "Healthy soil = healthy crops.",
    details: {
      intro:
        "Soil health is the backbone of agriculture. Sustainable practices enrich soil microbes, nutrients, and organic matter.",
      points: [
        "Compost and organic manure usage",
        "Reduced chemical fertilizers",
        "Improved water retention",
        "Better root growth",
      ],
      impact: "Higher yields with lower fertilizer dependency.",
    },
  },
  {
    title: "Water Conservation",
    image: "https://images.unsplash.com/photo-1625246333195-78d9c38ad449",
    short: "Every drop matters.",
    details: {
      intro:
        "Smart irrigation techniques minimize water wastage while maximizing crop absorption.",
      points: [
        "Drip irrigation systems",
        "Rainwater harvesting",
        "Precision scheduling",
        "Lower groundwater depletion",
      ],
      impact: "Ensures water availability even in drought-prone regions.",
    },
  },
  {
    title: "Crop Rotation",
    image: "https://images.unsplash.com/photo-1605000797499-95a51c5269ae",
    short: "Natural pest & nutrient control.",
    details: {
      intro:
        "Rotating crops prevents soil nutrient depletion and disrupts pest cycles naturally.",
      points: [
        "Legumes enrich nitrogen",
        "Breaks pest cycles",
        "Improves soil structure",
        "Stabilizes yield",
      ],
      impact: "Reduces pesticide use and improves soil fertility.",
    },
  },
  {
    title: "Climate Smart Farming",
    image: "https://images.unsplash.com/photo-1500382017468-9049fed747ef",
    short: "Adaptation for changing climate.",
    details: {
      intro:
        "Climate-smart agriculture helps farmers adapt to unpredictable weather patterns.",
      points: [
        "Weather-based advisories",
        "Resilient crop varieties",
        "Reduced carbon footprint",
        "Risk mitigation strategies",
      ],
      impact: "Protects crops against climate shocks.",
    },
  },
  {
    title: "Economic Sustainability",
    image: "https://images.unsplash.com/photo-1464226184884-fa280b87c399",
    short: "Lower costs, stable income.",
    details: {
      intro:
        "Reducing dependency on external inputs increases farm profitability.",
      points: [
        "Lower fertilizer & pesticide cost",
        "Government scheme access",
        "Market-linked pricing",
        "Stable income",
      ],
      impact: "Improves farmer livelihood and financial security.",
    },
  },
];
const subtitleText =
  "Sustainable Farming for a Better Tomorrow";

function GrowingSubtitle() {
  const letters = subtitleText.split("");

  return (
    <div className="flex justify-center items-end overflow-hidden">
      {letters.map((char, i) => (
        <motion.span
          key={i}
          initial={{ y: 40, opacity: 0 }}
          animate={{
            y: [40, -6, 0],
            opacity: 1,
          }}
          transition={{
            delay: i * 0.05,
            duration: 0.6,
            ease: "easeOut",
          }}
          className="text-emerald-400 text-2xl md:text-3xl font-semibold inline-block"
        >
          {char === " " ? "\u00A0" : char}
        </motion.span>
      ))}

      {/* Blinking cursor */}
      <motion.span
        className="ml-1 w-[2px] h-8 bg-emerald-300 inline-block"
        animate={{ opacity: [0, 1, 0] }}
        transition={{ duration: 1, repeat: Infinity }}
      />
    </div>
  );
}

export default function Home() {
  function TypingText({ text, speed = 120, deleteSpeed = 80, pause = 1200 }) {
    const [displayed, setDisplayed] = useState("");
    const [index, setIndex] = useState(0);
    const [deleting, setDeleting] = useState(false);
    const [cursor, setCursor] = useState(true);

    React.useEffect(() => {
      const cursorBlink = setInterval(() => {
        setCursor((c) => !c);
      }, 500);
      return () => clearInterval(cursorBlink);
    }, []);

    React.useEffect(() => {
      let timeout;

      if (!deleting && index < text.length) {
        timeout = setTimeout(() => {
          setDisplayed((prev) => prev + text[index]);
          setIndex((i) => i + 1);
        }, speed);
      }

      if (!deleting && index === text.length) {
        timeout = setTimeout(() => setDeleting(true), pause);
      }

      if (deleting && index > 0) {
        timeout = setTimeout(() => {
          setDisplayed((prev) => prev.slice(0, -1));
          setIndex((i) => i - 1);
        }, deleteSpeed);
      }

      if (deleting && index === 0) {
        setDeleting(false);
      }

      return () => clearTimeout(timeout);
    }, [index, deleting, text, speed, deleteSpeed, pause]);

    return (
      <span className="inline-flex items-center">
        <span>{displayed}</span>
        <span
          className={`ml-1 font-normal ${cursor ? "opacity-100" : "opacity-0"
            } transition-opacity`}
        >
          |
        </span>
      </span>
    );
  }

  const [active, setActive] = useState(null);

  return (
    <div className="bg-white overflow-x-hidden font-sans">

      {/* ================= HERO VIDEO ================= */}
      <section className="relative h-screen flex items-center justify-center">
        <video
          autoPlay
          muted
          loop
          playsInline
          className="absolute inset-0 w-full h-full object-cover
             blur-[2.5px] brightness-[0.85]"
          src="/Organic Farming.mp4"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-black/60 to-black/80" />

        <motion.div
          initial={{ opacity: 0, y: 60 }}
          animate={{ opacity: 1, y: 0 }}
          className="relative z-10 max-w-6xl text-center px-6"
        >
          <h1 className="text-7xl font-extrabold text-white leading-tight">
            <TypingText text="AgroFarm" />
            <div className="mt-6">
              <GrowingSubtitle />
            </div>
          </h1>


          <p className="mt-10 text-2xl text-gray-200 max-w-3xl mx-auto">
            Turning agriculture into a science-driven, profitable,
            and planet-friendly system.
          </p>

          <div className="mt-16 flex justify-center gap-8">
            <Link to="/signup"
              className="px-16 py-6 bg-emerald-600 text-white text-2xl font-bold rounded-2xl shadow-2xl">
              Get Started
            </Link>
            <Link to="/login"
              className="px-16 py-6 bg-white text-emerald-700 text-2xl font-bold rounded-2xl">
              Login
            </Link>
          </div>
        </motion.div>
      </section>
      { /* ================= WHAT IS SUSTAINABLE FARMING ================= */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-8">
          <motion.div
            className="absolute left-1/2 -translate-x-1/2 -top-24
             w-[600px] h-[600px]
             bg-emerald-300/20 rounded-full blur-[160px]"
            animate={{ scale: [1, 1.1, 1], opacity: [0.4, 0.6, 0.4] }}
            transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
          />
          <motion.h2
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 1, ease: "easeOut" }}
            className="relative text-5xl font-extrabold text-emerald-700 mb-16 text-center"
          >
            What is Sustainable Farming?
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.9, ease: "easeOut" }}
            className="text-xl text-gray-700 max-w-4xl mx-auto text-center leading-relaxed mb-24"
          >
            Sustainable farming is an agricultural approach that focuses on producing food
            efficiently while preserving soil fertility, conserving water, protecting biodiversity,
            and ensuring long-term economic stability for farmers.
            <br /><br />
            Instead of maximizing short-term yield using heavy chemicals, sustainable farming
            emphasizes balance between productivity, environment, and farmer livelihood.
          </motion.p>

          <div className="grid md:grid-cols-3 gap-14">
            {[
              {
                title: "Environmental Sustainability",
                desc:
                  "Maintains soil structure, prevents erosion, conserves water resources, and reduces pollution caused by excessive fertilizers and pesticides."
              },
              {
                title: "Economic Sustainability",
                desc:
                  "Reduces dependency on costly inputs, improves profit margins, and stabilizes farmer income across seasons."
              },
              {
                title: "Social Sustainability",
                desc:
                  "Ensures food security, healthier produce, and better living standards for farming communities."
              },
            ].map((item, i) => (
              <motion.div
                key={i}
                whileHover={{ y: -10 }}
                className="bg-slate-50 rounded-3xl shadow-xl p-10"
              >
                <h3 className="text-2xl font-bold text-emerald-700 mb-4">
                  {item.title}
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  {item.desc}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ================= INTERACTIVE CARDS ================= */}
      <section className="py-20 bg-slate-50">
        <h2 className="text-5xl font-extrabold text-center text-emerald-700 mb-24">
          Foundations of Sustainable Farming
        </h2>

        <div className="max-w-7xl mx-auto px-8 grid md:grid-cols-3 gap-14">
          {CARDS.map((c, i) => (
            <motion.div
              key={i}
              whileHover={{ y: -14, scale: 1.02 }}
              onClick={() => setActive(c)}
              className="cursor-pointer bg-white rounded-[2.5rem]
                         shadow-[0_20px_50px_rgba(0,0,0,0.12)]
                         overflow-hidden transition-all"
            >
              <img src={c.image} className="h-56 w-full object-cover" />
              <div className="p-8">
                <h3 className="text-2xl font-bold text-emerald-700 mb-3">
                  {c.title}
                </h3>
                <p className="text-gray-600">{c.short}</p>
                <p className="mt-5 font-semibold text-emerald-600">
                  Learn more →
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </section>
      <section className="py-20 bg-white">
        <div className="max-w-6xl mx-auto px-8">
          <h2 className="text-5xl font-extrabold text-center text-emerald-700 mb-24">
            Sustainable Farming vs Traditional Farming
          </h2>

          <div className="grid md:grid-cols-2 gap-16">
            <div className="bg-rose-50 rounded-3xl p-10">
              <h3 className="text-2xl font-bold text-rose-700 mb-6">Traditional Farming</h3>
              <ul className="space-y-4 text-gray-700">
                <li>• Heavy chemical fertilizer usage</li>
                <li>• Soil degradation over time</li>
                <li>• High production cost</li>
                <li>• Unstable long-term yield</li>
              </ul>
            </div>

            <div className="bg-emerald-50 rounded-3xl p-10">
              <h3 className="text-2xl font-bold text-emerald-700 mb-6">
                Sustainable Farming
              </h3>
              <ul className="space-y-4 text-gray-700">
                <li>• Soil fertility improvement</li>
                <li>• Efficient water usage</li>
                <li>• Lower input cost</li>
                <li>• Stable and long-term yield</li>
              </ul>
            </div>
          </div>
        </div>
      </section>
      <section className="py-24 bg-emerald-700 text-white">
        <div className="max-w-6xl mx-auto px-8">
          <h2 className="text-5xl font-extrabold mb-16 text-center">
            How AgroFarm Supports Sustainable Farming
          </h2>

          <div className="grid md:grid-cols-4 gap-12">
            {[
              "Analyzes soil health and nutrients",
              "Provides crop-specific recommendations",
              "Suggests water-efficient irrigation plans",
              "Connects farmers to schemes & support",
            ].map((item, i) => (
              <motion.div
                key={i}
                whileHover={{ y: -10 }}
                className="bg-white/10 rounded-3xl p-8 backdrop-blur"
              >
                <p className="text-lg font-semibold">{item}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ================= IMPACT STATS ================= */}
      <section className="py-36 bg-white">
        <div className="max-w-6xl mx-auto px-8 grid md:grid-cols-3 gap-16 text-center">
          {[
            ["💧 60%", "Water Saved"],
            ["🌾 30%", "Yield Improvement"],
            ["💰 25%", "Cost Reduction"],
          ].map(([v, t], i) => (
            <motion.div
              key={i}
              whileHover={{ y: -10 }}
              className="bg-slate-50 rounded-3xl shadow-xl p-12"
            >
              <div className="text-5xl font-extrabold text-emerald-600 mb-4">
                {v}
              </div>
              <p className="text-lg font-semibold text-gray-700">{t}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ================= STORY CTA ================= */}
      <section className="relative py-40 bg-[#f4f8f3] overflow-hidden">

        {/* Soft soil-texture style background */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#eef5ea] via-[#f7faf5] to-[#eef5ea]" />

        {/* Gentle sunlight effect */}
        <motion.div
          className="absolute -top-32 left-1/2 -translate-x-1/2
               w-[600px] h-[600px] bg-yellow-200/30 rounded-full blur-[180px]"
          animate={{ opacity: [0.4, 0.6, 0.4] }}
          transition={{ duration: 10, repeat: Infinity }}
        />

        <div className="relative z-10 max-w-5xl mx-auto px-8 text-center">

          <motion.h2
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="text-4xl md:text-5xl font-extrabold text-green-800 leading-snug"
          >
            Make Informed Farming Decisions
          </motion.h2>

          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="mt-8 text-lg md:text-xl text-green-700 leading-relaxed max-w-4xl mx-auto"
          >
            AgroFarm helps farmers understand their land, improve soil health,
            plan crops wisely, conserve water, and adopt sustainable farming
            practices that increase yield without damaging the environment.
          </motion.p>

          {/* Divider inspired by farm rows */}
          <div className="mt-12 flex justify-center gap-3">
            <span className="w-16 h-[3px] bg-green-600 rounded-full" />
            <span className="w-6 h-[3px] bg-green-400 rounded-full" />
            <span className="w-2 h-[3px] bg-green-300 rounded-full" />
          </div>

          {/* CTA buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3 }}
            className="mt-16 flex flex-col sm:flex-row gap-6 justify-center"
          >
            <Link
              to="/signup"
              className="px-12 py-4 bg-green-700 text-white
                   text-lg font-semibold rounded-xl
                   shadow-md hover:bg-green-800 transition"
            >
              Start Using AgroFarm
            </Link>

            <Link
              to="/login"
              className="px-12 py-4 border-2 border-green-700
                   text-green-700 text-lg font-semibold
                   rounded-xl hover:bg-green-50 transition"
            >
              Explore as Farmer
            </Link>
          </motion.div>
        </div>
      </section>



      {/* ================= MODAL ================= */}
      <AnimatePresence>
        {active && (
          <motion.div
            className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xl
                       flex items-center justify-center px-6"
            onClick={() => setActive(null)}
          >
            <motion.div
              onClick={(e) => e.stopPropagation()}
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white max-w-2xl w-full rounded-3xl overflow-hidden shadow-2xl"
            >
              <img src={active.image} className="h-56 w-full object-cover" />
              <div className="p-8">
                <h2 className="text-3xl font-extrabold text-emerald-700 mb-4">
                  {active.title}
                </h2>
                <p className="text-gray-700 mb-4">
                  {active.details.intro}
                </p>
                <ul className="list-disc ml-6 text-gray-700 mb-4">
                  {active.details.points.map((p, i) => (
                    <li key={i}>{p}</li>
                  ))}
                </ul>
                <p className="font-semibold text-emerald-600">
                  🌱 Impact: {active.details.impact}
                </p>
                <button
                  onClick={() => setActive(null)}
                  className="mt-6 px-6 py-3 bg-emerald-600 text-white rounded-xl font-bold"
                >
                  Close
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ================= FOOTER ================= */}
      <footer className="bg-black text-gray-400 py-14 text-center">
        <h3 className="text-2xl font-extrabold text-emerald-400 mb-2">
          🌱 AgroFarm
        </h3>
        <p>Building the future of sustainable agriculture</p>
        <p className="mt-4 text-sm">© 2025 AgroFarm</p>
      </footer>

      <Chatbot />
    </div>
  );
}
