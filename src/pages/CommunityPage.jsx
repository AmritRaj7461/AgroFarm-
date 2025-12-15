import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const INITIAL_THREADS = [
  {
    id: 1,
    title: "Organic pest control for brinjal borer",
    author: "Ramesh Kumar",
    distance: "12 km away",
    repliesCount: 24,
    tag: "Organic",
    verified: true,
    expert: false,
    bestAnswer: {
      author: "AgroFarm Expert",
      expert: true,
      text:
        "Neem oil (3%) spray every 7 days combined with pheromone traps is highly effective against brinjal borer. Avoid chemical pesticides to protect beneficial insects.",
    },
    replies: [
      {
        author: "Farmer",
        text: "I used neem cake in soil and saw improvement.",
      },
      {
        author: "Verified Farmer",
        verified: true,
        text: "Light traps also help during peak infestation.",
      },
    ],
  },
  {
    id: 2,
    title: "Experience with solar pump subsidy in Bihar",
    author: "Sunita Devi",
    distance: "35 km away",
    repliesCount: 15,
    tag: "Government scheme",
    verified: true,
    expert: false,
    bestAnswer: {
      author: "AgroFarm Expert",
      expert: true,
      text:
        "Apply via PM-KUSUM portal. Ensure land documents and electricity connection proof. Subsidy usually covers 60–70% cost.",
    },
    replies: [],
  },
  {
    id: 3,
    title: "Which wheat variety works best in alluvial soil?",
    author: "Mahesh Patil",
    distance: "20 km away",
    repliesCount: 32,
    tag: "Variety selection",
    verified: false,
    expert: false,
    bestAnswer: {
      author: "AgroFarm Expert",
      expert: true,
      text:
        "HD-2967 and HD-3086 perform exceptionally well in alluvial soils with proper irrigation scheduling.",
    },
    replies: [],
  },
];

export default function CommunityPage() {
  const [threads, setThreads] = useState(INITIAL_THREADS);
  const [activeThread, setActiveThread] = useState(null);
  const [newQuestion, setNewQuestion] = useState("");

  const handlePost = () => {
    if (!newQuestion.trim()) return;
    setThreads([
      {
        id: Date.now(),
        title: newQuestion,
        author: "You",
        distance: "0 km",
        repliesCount: 0,
        tag: "New question",
        verified: false,
        expert: false,
        replies: [],
      },
      ...threads,
    ]);
    setNewQuestion("");
  };

  return (
    <section className="relative flex-1 p-4 md:p-6 overflow-y-auto bg-slate-950 text-slate-100">

      {/* Ambient glow */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2
          w-[600px] h-[600px] bg-emerald-500/10 blur-[160px]" />
      </div>

      {/* Header */}
      <div className="relative rounded-2xl border border-slate-800 bg-slate-900/80 backdrop-blur p-5 flex justify-between items-center">
        <div>
          <p className="text-xs text-emerald-400">🌱 AgroFarm Community</p>
          <h3 className="text-lg font-bold">Farmer Discussion Forum</h3>
        </div>
        <button className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 transition text-sm font-semibold hover:cursor-pointer">
          + Start Discussion
        </button>
      </div>

      <div className="relative mt-6 grid grid-cols-1 lg:grid-cols-3 gap-5">

        {/* THREAD LIST */}
        <div className="lg:col-span-2 space-y-3">
          {threads.map((t) => (
            <motion.div
              key={t.id}
              layout
              onClick={() =>
                setActiveThread(activeThread?.id === t.id ? null : t)
              }
              className="cursor-pointer rounded-2xl border border-slate-800
                bg-slate-900/80 backdrop-blur p-4
                hover:border-emerald-500/50
                hover:shadow-[0_0_25px_rgba(16,185,129,0.15)]
                transition"
            >
              <div className="flex justify-between items-start">
                <div>
                  <p className="font-semibold">{t.title}</p>

                  <div className="flex items-center gap-2 text-xs text-slate-400 mt-1">
                    <span>{t.author}</span>

                    {t.verified && (
                      <span className="px-2 py-0.5 rounded-full text-[10px]
                        bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
                        ✔ Verified Farmer
                      </span>
                    )}

                    {t.expert && (
                      <span className="px-2 py-0.5 rounded-full text-[10px]
                        bg-yellow-500/10 text-yellow-400 border border-yellow-500/30">
                        ⭐ Expert
                      </span>
                    )}

                    <span>• {t.distance}</span>
                  </div>
                </div>

                <div className="text-xs text-slate-400">
                  💬 {t.repliesCount}
                </div>
              </div>

              <span className="inline-block mt-3 px-3 py-1 rounded-full text-[10px]
                bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
                {t.tag}
              </span>

              {/* THREAD DETAILS */}
              <AnimatePresence>
                {activeThread?.id === t.id && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    className="mt-4 pt-4 border-t border-slate-800 space-y-4"
                  >
                    {/* BEST ANSWER */}
                    {t.bestAnswer && (
                      <div className="rounded-xl bg-emerald-500/10 border border-emerald-500/30 p-4">
                        <p className="text-xs text-emerald-400 mb-1">
                          ⭐ Best Answer • AgroFarm AI Verified
                        </p>
                        <p className="text-sm">{t.bestAnswer.text}</p>
                        <p className="mt-2 text-xs text-emerald-300">
                          — {t.bestAnswer.author}
                        </p>
                      </div>
                    )}

                    {/* REPLIES */}
                    {t.replies.map((r, i) => (
                      <div
                        key={i}
                        className="rounded-lg bg-slate-950 border border-slate-800 p-3 text-sm"
                      >
                        <p className="text-xs text-slate-400 mb-1">
                          {r.author}
                          {r.verified && " ✔"}
                        </p>
                        {r.text}
                      </div>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </div>

        {/* ASK QUESTION */}
        <div className="rounded-2xl border border-slate-800 bg-slate-900/80 backdrop-blur p-5 space-y-4">
          <h4 className="font-semibold">Ask the Community</h4>

          <textarea
            value={newQuestion}
            onChange={(e) => setNewQuestion(e.target.value)}
            placeholder="Example: Best fertilizer for paddy in loamy soil, Bihar..."
            className="w-full h-28 rounded-xl bg-slate-950 border border-slate-700
              px-3 py-2 text-sm outline-none
              focus:border-emerald-500 placeholder:text-slate-500"
          />

          <button
            onClick={handlePost}
            className="w-full py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 transition font-semibold hover:cursor-pointer"
          >
            🌱 Post Question
          </button>

          <p className="text-xs text-slate-500">
            Tip: Mention crop, location & season for faster help.
          </p>
        </div>
      </div>
    </section>
  );
}
