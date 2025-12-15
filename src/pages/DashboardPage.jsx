import React, { useState, useEffect, useRef } from 'react';
import Loader from '../components/Loader';
import { useTranslation } from "react-i18next";

export default function DashboardPage() {
  const [methods, setMethods] = useState([]);
  const [selectedMethod, setSelectedMethod] = useState(null);
  const [hoveredMethodId, setHoveredMethodId] = useState(null);

  const [schemes, setSchemes] = useState([]);
  const [activeSchemeIndex, setActiveSchemeIndex] = useState(0);
  const [selectedScheme, setSelectedScheme] = useState(null);

  // Upcoming events state
  const [events, setEvents] = useState([]);
  const [topEventIndex, setTopEventIndex] = useState(0); // which event is at the top
  const [isEventAnimating, setIsEventAnimating] = useState(false); // for smooth scroll animation
  const eventListRef = useRef(null);
  const eventItemRef = useRef(null);

  const maxUsageValue = selectedMethod
    ? Math.max(...(selectedMethod.usageTrend || []).map((d) => d.value), 1)
    : 1;

  const activeScheme = schemes.length ? schemes[activeSchemeIndex] : null;

  // ----------------- ADOPTION GRAPH DATA -----------------
  // Base historical years (from your DB)
  const baseYears = ['2010', '2015', '2020', '2025'];

  // Average adoption for base years
  const baseAdoption = baseYears.map((year) => {
    if (!methods.length) return { label: year, value: 0 };

    let total = 0;
    methods.forEach((m) => {
      const trend = m.usageTrend || [];
      const point = trend.find((p) => p.label === year);
      total += point ? point.value : 0;
    });

    const avg = total / methods.length;
    return { label: year, value: avg };
  });

  // Build a few *predicted* future years based on last trend
  let predictedPoints = [];
  if (baseAdoption.length >= 2) {
    const last = baseAdoption[baseAdoption.length - 1];
    const prev = baseAdoption[baseAdoption.length - 2];
    const slope = last.value - prev.value; // growth per 5-year step (approx)

    const futureYears = ['2030', '2035', '2040'];

    predictedPoints = futureYears.map((year, idx) => ({
      label: year,
      // slightly damped growth so prediction doesn't explode
      value: Math.max(0, last.value + slope * (idx + 1) * 0.8),
      predicted: true,
    }));
  }

  const adoptionOverview = [
    ...baseAdoption.map((p) => ({ ...p, predicted: false })),
    ...predictedPoints,
  ];

  const maxOverview = Math.max(...adoptionOverview.map((d) => d.value), 1);
  const firstYear = adoptionOverview[0];
  const lastYear = adoptionOverview[adoptionOverview.length - 1];
  const adoptionChange = lastYear.value - firstYear.value;

  // nicer vertical placement
  const CHART_BOTTOM = 34; // move line up from very bottom
  const CHART_TOP = 12;

  const chartPoints = adoptionOverview.map((point, idx) => {
    const count = adoptionOverview.length;
    const xStart = 10;
    const xEnd = 90;

    const x =
      count > 1
        ? xStart + (idx / (count - 1)) * (xEnd - xStart)
        : (xStart + xEnd) / 2;

    const scaled = maxOverview ? point.value / maxOverview : 0;
    const bottomY = CHART_BOTTOM;
    const topY = CHART_TOP;
    const y = bottomY - scaled * (bottomY - topY);

    return {
      x,
      y,
      label: point.label,
      value: point.value,
      predicted: point.predicted,
    };
  });

  let linePath = '';
  if (chartPoints.length) {
    linePath = chartPoints.reduce((acc, p, idx) => {
      if (idx === 0) return `M ${p.x} ${p.y}`;
      return acc + ` L ${p.x} ${p.y}`;
    }, '');
  }

  let areaPath = '';
  if (chartPoints.length) {
    const firstPt = chartPoints[0];
    const lastPt = chartPoints[chartPoints.length - 1];
    const bottomY = CHART_BOTTOM;
    areaPath =
      `M ${firstPt.x} ${bottomY} ` +
      chartPoints.map((p) => `L ${p.x} ${p.y}`).join(' ') +
      ` L ${lastPt.x} ${bottomY} Z`;
  }

  let topMethodName = '';
  let topMethodValue = 0;
  if (methods.length) {
    methods.forEach((m) => {
      const trend = m.usageTrend || [];
      if (!trend.length) return;
      const lastPoint = trend[trend.length - 1];
      if (lastPoint && lastPoint.value > topMethodValue) {
        topMethodValue = lastPoint.value;
        topMethodName = m.name;
      }
    });
  }

  // ---------- API calls ----------
  useEffect(() => {
    fetch('http://localhost:5000/api/methods')
      .then((res) => res.json())
      .then((data) => {
        setMethods(data);
      })
      .catch((err) => {
        console.error('Error fetching methods:', err);
      });
  }, []);

  useEffect(() => {
    fetch('http://localhost:5000/api/schemes')
      .then((res) => res.json())
      .then((data) => {
        setSchemes(data);
        setActiveSchemeIndex(0);
      })
      .catch((err) => {
        console.error('Error fetching schemes:', err);
      });
  }, []);

  useEffect(() => {
    if (!schemes.length) return;
    const id = setInterval(() => {
      setActiveSchemeIndex((prev) => (prev + 1) % schemes.length);
    }, 4500);
    return () => clearInterval(id);
  }, [schemes]);

  useEffect(() => {
    fetch('http://localhost:5000/api/events')
      .then((res) => res.json())
      .then((data) => {
        const normalized = Array.isArray(data) ? data : data?.events || [];
        setEvents(normalized);
        setTopEventIndex(0);
      })
      .catch(() => {
        const fallback = [
          {
            id: 'e1',
            title: 'Soil Health Camp - Block A',
            date: '2025-12-10',
            location: 'KVK Center',
          },
          {
            id: 'e2',
            title: 'Micro-Irrigation Demo',
            date: '2025-12-12',
            location: 'Gram Panchayat Field',
          },
          {
            id: 'e3',
            title: 'Organic Compost Workshop',
            date: '2025-12-18',
            location: 'Community Hall',
          },
          {
            id: 'e4',
            title: 'Crop Insurance Awareness',
            date: '2025-12-22',
            location: 'Market Yard',
          },
        ];
        setEvents(fallback);
        setTopEventIndex(0);
      });
  }, []);

  // Set container height = 2 card heights
  useEffect(() => {
    if (!eventItemRef.current || !eventListRef.current) return;
    const itemHeight = eventItemRef.current.getBoundingClientRect().height;
    const visibleHeight = itemHeight * 2;
    eventListRef.current.style.height = `${visibleHeight}px`;
  }, [events]);

  // Conveyor animation: move by 1 event every 5s
  useEffect(() => {
    if (events.length <= 1) return;

    let timeoutId;
    const intervalId = setInterval(() => {
      setIsEventAnimating(true);

      timeoutId = setTimeout(() => {
        setTopEventIndex((prev) => (prev + 1) % events.length);
        setIsEventAnimating(false);
      }, 600); // scroll animation duration
    }, 5000); // delay between moves

    return () => {
      clearInterval(intervalId);
      if (timeoutId) clearTimeout(timeoutId);
    };
  }, [events.length]);

  // Helpers for visible events
  const totalEvents = events.length;
  const firstIdx = totalEvents ? topEventIndex % totalEvents : 0;
  const secondIdx = totalEvents ? (topEventIndex + 1) % totalEvents : 0;
  const thirdIdx = totalEvents ? (topEventIndex + 2) % totalEvents : 0;

  const visibleEvents =
    totalEvents >= 2
      ? [events[firstIdx], events[secondIdx], events[thirdIdx]] // 3 stacked, top 2 visible
      : totalEvents === 1
        ? [events[0]]
        : [];

  const eventCardHeight = eventItemRef.current
    ? eventItemRef.current.getBoundingClientRect().height
    : 0;

  const goPrevScheme = () => {
    if (!schemes.length) return;
    setActiveSchemeIndex((prev) =>
      prev === 0 ? schemes.length - 1 : prev - 1
    );
  };

  const goNextScheme = () => {
    if (!schemes.length) return;
    setActiveSchemeIndex((prev) => (prev + 1) % schemes.length);
  };

  const { t } = useTranslation();
  return (
    <section className="flex-1 p-4 md:p-6 space-y-5 overflow-y-auto bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100">
      <div className="flex flex-col md:flex-row md:items-center gap-3">
        <div className="flex-1 max-w-2xl">
          <p className="text-[11px] uppercase tracking-wide text-emerald-600 dark:text-emerald-300 flex items-center gap-1">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
            {t("dashboard.headerTag")}
          </p>

          <h2 className="text-xl md:text-2xl font-semibold text-slate-900 dark:text-slate-50 mt-1">
            {t("dashboard.headerTitle")}
          </h2>

          <p className="text-xs md:text-sm text-slate-600 dark:text-slate-300 mt-1">
            {t("dashboard.headerSubtitle")}
          </p>
        </div>

        <div className="flex-1 flex justify-end">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 max-w-xl w-full">

            {/* Methods Card */}
            <div className="rounded-2xl bg-white/80 dark:bg-slate-900/80 backdrop-blur border border-emerald-100 dark:border-emerald-800 px-4 py-2 shadow-sm flex flex-col justify-center">
              <p className="text-[11px] text-emerald-700 dark:text-emerald-300">
                {t("dashboard.methodsToExplore")}
              </p>
              <p className="text-lg font-semibold text-emerald-900 dark:text-emerald-100">
                {methods.length || "—"}
                <span className="text-[11px] font-normal text-emerald-700 dark:text-emerald-300 ml-1">
                  {t("dashboard.coreApproaches")}
                </span>
              </p>
            </div>

            {/* Schemes Card */}
            <div className="rounded-2xl bg-white/80 dark:bg-slate-900/80 backdrop-blur border border-sky-100 dark:border-sky-800 px-4 py-2 shadow-sm flex flex-col justify-center">
              <p className="text-[11px] text-sky-700 dark:text-sky-300">
                {t("dashboard.schemesConnected")}
              </p>
              <p className="text-lg font-semibold text-sky-900 dark:text-sky-100">
                {schemes.length || "—"}
                <span className="text-[11px] font-normal text-sky-700 dark:text-sky-300 ml-1">
                  {t("dashboard.activeSchemes")}
                </span>
              </p>
            </div>

            {/* Spotlight Card */}
            <div className="rounded-2xl bg-amber-50/95 dark:bg-amber-900/40 border border-amber-100 dark:border-amber-700 px-4 py-2 shadow-sm flex flex-col justify-center">
              <p className="text-[11px] text-amber-700 dark:text-amber-200">
                {t("dashboard.spotlight2025")}
              </p>

              {topMethodName ? (
                <p className="text-sm font-semibold text-amber-900 dark:text-amber-100">
                  {topMethodName}
                  <span className="text-[11px] font-normal text-amber-700 dark:text-amber-200 ml-1">
                    ~{Math.round(topMethodValue)}% {t("adoption")}
                  </span>
                </p>
              ) : (
                <p className="text-sm text-amber-900 dark:text-amber-100">
                  {t("dashboard.spotlightLoading")}
                </p>
              )}
            </div>

          </div>
        </div>
      </div>


      {/* METHODS & ADOPTION GRID */}
      <div className="rounded-2xl bg-white/90 dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 p-4 md:p-5 space-y-4 shadow-sm">

        {/* Section Header */}
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-3">
          <div>
            <h3 className="text-sm md:text-base font-semibold text-slate-900 dark:text-slate-50">
              {t("dashboard.exploreMethodsTitle")}
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 max-w-xl">
              {t("dashboard.exploreMethodsSubtitle")}
            </p>
          </div>

          <div className="rounded-xl bg-emerald-50/70 dark:bg-emerald-900/40 border border-emerald-100 dark:border-emerald-700 px-3 py-2 text-[11px] text-emerald-800 dark:text-emerald-200 flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-emerald-500 animate-ping" />
            <span>{t("dashboard.youCanCombine")}</span>
          </div>
        </div>

        {/* GRID */}
        <div className="grid grid-cols-1 lg:grid-cols-[2fr,1.6fr] gap-4 md:gap-5">

          {/* LEFT — Methods Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-2 gap-3 md:gap-4">
            {!methods.length && (
              <>
                <div className="rounded-2xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 h-28 animate-pulse" />
                <div className="rounded-2xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 h-28 animate-pulse" />
              </>
            )}

            {methods.map((method) => (
              <button
                key={method.id}
                onClick={() => setSelectedMethod(method)}
                onMouseEnter={() => setHoveredMethodId(method.id)}
                onMouseLeave={() => setHoveredMethodId(null)}
                className="group relative text-left rounded-2xl border border-slate-200 dark:border-slate-700
              bg-gradient-to-br from-slate-50 via-white to-emerald-50/40
              dark:from-slate-900 dark:via-slate-900 dark:to-emerald-900/20
              hover:from-emerald-50 hover:via-white hover:to-emerald-100/50
              dark:hover:from-slate-900 dark:hover:via-slate-900 dark:hover:to-emerald-900/40
              transition-all duration-300 flex flex-col justify-between p-3 md:p-4 shadow-xs
              hover:shadow-md hover:-translate-y-0.5"
              >
                <div className="absolute inset-x-0 top-0 h-1 rounded-t-2xl bg-gradient-to-r from-emerald-400/0 via-emerald-400/60 to-sky-400/0 opacity-0 group-hover:opacity-100 transition-opacity" />

                <div>
                  <div className="flex items-center justify-between gap-2 mb-2">
                    <p className="text-sm font-semibold text-slate-900 dark:text-slate-50 flex items-center gap-1.5">
                      <span className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-emerald-50 dark:bg-emerald-900/40 text-[11px] text-emerald-700 dark:text-emerald-200 border border-emerald-100 dark:border-emerald-800">
                        {(method.name || "M")[0]}
                      </span>
                      {method.name}
                    </p>
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-50 dark:bg-emerald-900/40 text-emerald-700 dark:text-emerald-200 border border-emerald-100 dark:border-emerald-800">
                      {method.badge}
                    </span>
                  </div>

                  <p className="text-[11px] text-slate-600 dark:text-slate-300 leading-snug">
                    {method.shortLabel}
                  </p>
                </div>

                <div className="mt-3 flex items-center justify-between text-[11px] text-slate-500 dark:text-slate-400">
                  <span className="flex items-center gap-1">
                    <span className="h-2 w-2 rounded-full bg-emerald-400 group-hover:bg-emerald-500 transition-colors" />
                    {hoveredMethodId === method.id
                      ? t("dashboard.methodHoverSeeMore")
                      : t("dashboard.methodHoverLearn")}
                  </span>

                  <span className="text-slate-400 dark:text-slate-300 group-hover:text-emerald-700 dark:group-hover:text-emerald-300 transition-colors">
                    {t("dashboard.methodOpen")}
                  </span>
                </div>

              </button>
            ))}
          </div>


          {/* Adoption graph + Upcoming events */}
          <div className="flex justify-between">

            {/* Adoption graph card – refined */}
            <div className="flex-1 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-4 flex gap-3">

              <div className="flex-1">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <p className="text-xs font-semibold text-slate-900 dark:text-slate-50">
                      {t("dashboard.adoptionOverYears")}
                    </p>

                    <p className="text-[11px] text-slate-600 dark:text-slate-300 mt-0.5 max-w-xs">
                      {t("dashboard.adoptionExplanation", {
                        first: firstYear.label,
                        last: lastYear.label,
                      })}
                    </p>
                  </div>

                  <div className="text-right text-[11px]">
                    <p className="text-emerald-700 dark:text-emerald-300 font-semibold">
                      {Math.round(lastYear.value)}% {t("in")} {lastYear.label}
                    </p>
                    <p className="text-slate-500 dark:text-slate-400">
                      {adoptionChange >= 0 ? "+" : ""}
                      {Math.round(adoptionChange)} pts vs {firstYear.label}
                    </p>

                    {topMethodName && (
                      <p className="mt-1 text-slate-500 dark:text-slate-400">
                        Top method{" "}
                        <span className="font-semibold text-slate-900 dark:text-slate-50">
                          {topMethodName}
                        </span>
                      </p>
                    )}
                  </div>
                </div>

                <div className="relative h-44 flex items-center justify-center mt-2">
                  <div className="w-full max-w-3xl mx-auto">
                    <svg
                      viewBox="-10 6 130 50"
                      className="w-full h-full overflow-visible"
                      preserveAspectRatio="none"
                    >
                      <defs>
                        <linearGradient id="adoptionArea" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="0%" stopColor="#22c55e" stopOpacity="0.3" />
                          <stop offset="100%" stopColor="#22c55e" stopOpacity="0" />
                        </linearGradient>

                        <linearGradient id="adoptionLine" x1="0" y1="0" x2="1" y2="0">
                          <stop offset="0%" stopColor="#4ade80" />
                          <stop offset="50%" stopColor="#22c55e" />
                          <stop offset="100%" stopColor="#16a34a" />
                        </linearGradient>
                      </defs>

                      {/* grid lines */}
                      <line x1="8" y1={CHART_BOTTOM} x2="102" y2={CHART_BOTTOM} stroke="#0f172a" strokeWidth="0.4" opacity="0.35" />
                      <line
                        x1="8"
                        y1={(CHART_BOTTOM + CHART_TOP) / 2}
                        x2="102"
                        y2={(CHART_BOTTOM + CHART_TOP) / 2}
                        stroke="#0f172a"
                        strokeWidth="0.35"
                        strokeDasharray="2 3"
                        opacity="0.25"
                      />

                      {/* area */}
                      {areaPath && (
                        <path d={areaPath} fill="url(#adoptionArea)" opacity="0.75" />
                      )}

                      {/* animated line */}
                      {linePath && (
                        <path
                          d={linePath}
                          fill="none"
                          stroke="url(#adoptionLine)"
                          strokeWidth="1.3"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeDasharray="180"
                          strokeDashoffset="180"
                        >
                          <animate
                            attributeName="stroke-dashoffset"
                            from="180"
                            to="0"
                            dur="1.8s"
                            fill="freeze"
                          />
                        </path>
                      )}

                      {/* points */}
                      {chartPoints.map((p, idx) => (
                        <g key={p.label}>
                          <circle cx={p.x} cy={p.y} r="1.6" fill="#22c55e" />
                          <text
                            x={p.x}
                            y={CHART_BOTTOM + 8}
                            textAnchor="middle"
                            fontSize="3"
                            fill={p.predicted ? "#6b7280" : "#9ca3af"}
                          >
                            {p.label}
                          </text>

                          {idx === chartPoints.length - 1 && (
                            <text
                              x={p.x}
                              y={p.y - 3.5}
                              textAnchor="middle"
                              fontSize="4"
                              fill="#22c55e"
                              fontWeight="bold"
                            >
                              {Math.round(p.value)}%
                            </text>
                          )}
                        </g>
                      ))}
                    </svg>
                  </div>
                </div>

                <div className="flex items-center justify-between text-[10px] text-slate-600 dark:text-slate-400 mt-1">
                  <span className="flex items-center gap-1">
                    <span className="h-2 w-2 rounded-full bg-emerald-500" />
                    {t("dashboard.adoptionAvgAcross")}
                  </span>
                  <span>{t("dashboard.futureProjection")}</span>
                </div>
              </div>
            </div>

            {/* Upcoming events – conveyor */}
            <div className="w-64 ml-3">
              <div className="rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-3 shadow-sm">
                <div className="flex items-center justify-between mb-2">
                  <div>
                    <p className="text-xs font-semibold text-slate-900 dark:text-slate-50">
                      {t("dashboard.upcomingEvents")}
                    </p>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400">
                      {t("dashboard.localWorkshops")}
                    </p>
                  </div>
                  <div className="text-[11px] text-slate-500 dark:text-slate-400">
                    <span className="font-semibold">{events.length}</span>
                  </div>
                </div>

                <div ref={eventListRef} className="relative overflow-hidden">
                  <div
                    style={{
                      transform:
                        isEventAnimating && eventCardHeight
                          ? `translateY(-${eventCardHeight}px)`
                          : "translateY(0)",
                      transition: isEventAnimating ? "transform 0.6s ease" : "none",
                      display: "flex",
                      flexDirection: "column",
                    }}
                  >
                    {visibleEvents.map((ev, idx) => (
                      <div
                        key={ev?.id || `${ev?.title}-${idx}`}
                        ref={idx === 0 ? eventItemRef : null}
                        className="rounded-lg border border-slate-100 dark:border-slate-700 p-2 bg-slate-50 dark:bg-slate-800 mb-2 last:mb-0"
                      >
                        <div className="flex items-start justify-between gap-2">
                          <div className="flex-1">
                            <p className="text-sm font-semibold text-slate-900 dark:text-slate-50">
                              {ev?.title}
                            </p>
                            <p className="text-[11px] text-slate-600 dark:text-slate-300">
                              {ev?.location}
                            </p>
                          </div>
                          <div className="text-[11px] text-slate-500 dark:text-slate-400 text-right">
                            <div>{ev?.date}</div>
                            <div className="mt-1 text-[10px]">{ev?.time || ""}</div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <p className="mt-2 text-[10px] text-slate-500 dark:text-slate-400">
                  {t("dashboard.twoEventsNote")}
                </p>
              </div>
            </div>
          </div>
        </div>
        {/* SCHEMES SECTION */}
        <div className="rounded-2xl bg-white/90 dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 p-4 md:p-5 space-y-4 shadow-sm">

          {/* Header */}
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2">
            <div>
              <h3 className="text-sm md:text-base font-semibold text-slate-900 dark:text-slate-50">
                {t("dashboard.schemesHeaderTitle")}
              </h3>

              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 max-w-2xl">
                {t("dashboard.schemesHeaderSubtitle")}
              </p>
            </div>

            <div className="flex items-center gap-3">
              {/* Pagination Count */}
              <div className="hidden sm:flex items-center text-[11px] text-slate-500 dark:text-slate-400">
                {schemes.length ? (
                  <>
                    <span className="font-semibold text-slate-800 dark:text-slate-100">
                      {activeSchemeIndex + 1}
                    </span>
                    <span className="mx-1">/</span>
                    <span>{schemes.length}</span>
                  </>
                ) : (
                  <Loader />
                )}
              </div>

              {/* Arrows */}
              <div className="flex items-center gap-2">
                <button
                  onClick={goPrevScheme}
                  className="h-8 w-8 rounded-full border border-slate-200 dark:border-slate-700 
            flex items-center justify-center text-slate-600 dark:text-slate-200 
            hover:bg-slate-100 dark:hover:bg-slate-800 text-sm transition-colors"
                >
                  ‹
                </button>

                <button
                  onClick={goNextScheme}
                  className="h-8 w-8 rounded-full border border-slate-200 dark:border-slate-700 
            flex items-center justify-center text-slate-600 dark:text-slate-200 
            hover:bg-slate-100 dark:hover:bg-slate-800 text-sm transition-colors"
                >
                  ›
                </button>
              </div>
            </div>
          </div>

          {/* Loading skeleton */}
          {!schemes.length ? (
            <div className="mt-2 grid grid-cols-1 lg:grid-cols-[2fr,1fr] gap-4 animate-pulse">
              <div className="rounded-2xl bg-slate-100 dark:bg-slate-800 h-40" />
              <div className="space-y-3">
                <div className="rounded-xl bg-slate-100 dark:bg-slate-800 h-16" />
                <div className="rounded-xl bg-slate-100 dark:bg-slate-800 h-16" />
              </div>
            </div>
          ) : (
            <>
              {/* MAIN SCHEME CARD */}
              <div className="flex flex-col lg:flex-row gap-4 items-stretch">

                {/* Clickable Scheme Card */}
                <button
                  onClick={() => activeScheme && setSelectedScheme(activeScheme)}
                  className="group flex-1 flex flex-col lg:flex-row gap-3 text-left rounded-2xl 
            border border-slate-200 dark:border-slate-700 
            bg-gradient-to-br from-slate-50 via-white to-emerald-50/40 
            dark:from-slate-900 dark:via-slate-900 dark:to-emerald-900/20 
            hover:from-emerald-50 hover:via-white hover:to-emerald-100/60 
            dark:hover:from-slate-900 dark:hover:via-slate-900 dark:hover:to-emerald-900/40 
            transition-all duration-300 overflow-hidden shadow-xs hover:shadow-md hover:-translate-y-0.5"
                >
                  {/* Scheme Image */}
                  <div className="w-full lg:w-1/3 h-40 lg:h-auto bg-slate-200 dark:bg-slate-800 
            flex items-center justify-center overflow-hidden relative">
                    {activeScheme.imageUrl ? (
                      <>
                        <img
                          src={activeScheme.imageUrl}
                          alt={activeScheme.name}
                          className="h-full w-full object-fit transform group-hover:scale-[1.03] transition-transform duration-500"
                        />
                        <div className="absolute inset-0 bg-emerald-900/10 group-hover:bg-emerald-900/0 transition-colors" />
                      </>
                    ) : (
                      <div className="h-full w-full bg-slate-300 dark:bg-slate-700 flex items-center justify-center text-xs text-slate-600 dark:text-slate-300">
                        {t("imagePlaceholder")}
                      </div>
                    )}
                  </div>

                  {/* Scheme Details */}
                  <div className="flex-1 p-3 md:p-4 flex flex-col justify-between">
                    <div>
                      <div className="flex items-center justify-between gap-2">
                        <p className="text-sm md:text-base font-semibold text-slate-900 dark:text-slate-50">
                          {activeScheme.name}
                        </p>

                        <span className="text-[10px] px-2 py-0.5 rounded-full 
                  bg-emerald-50 dark:bg-emerald-900/40 
                  text-emerald-700 dark:text-emerald-200 
                  border border-emerald-100 dark:border-emerald-800">
                          {t("dashboard.pmYojana")}
                        </span>
                      </div>

                      <p className="text-[11px] text-emerald-700 dark:text-emerald-300 mt-1">
                        “{activeScheme.tagline}”
                      </p>

                      <p className="text-[11px] text-slate-600 dark:text-slate-300 mt-2">
                        {activeScheme.shortNote}
                      </p>

                      <div className="flex flex-wrap gap-1 mt-2">
                        {activeScheme.focusAreas?.map((area) => (
                          <span
                            key={area}
                            className="text-[10px] px-2 py-0.5 rounded-full
                      bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200
                      border border-slate-200 dark:border-slate-700"
                          >
                            {area}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* Bottom Row */}
                    <div className="mt-3 flex items-center justify-between text-[11px] text-slate-500 dark:text-slate-400">
                      <span className="flex items-center gap-1">
                        <span className="h-2 w-2 rounded-full bg-emerald-400 group-hover:bg-emerald-500 transition-colors" />
                        {t("dashboard.clickForDetails")}
                      </span>

                      <span className="text-slate-400 dark:text-slate-300 group-hover:text-emerald-700 dark:group-hover:text-emerald-300 transition-colors">
                        {t("dashboard.viewDetails")}
                      </span>
                    </div>
                  </div>
                </button>

                {/* RIGHT SIDE INFO CARDS */}
                <div className="w-full lg:w-56 flex flex-col justify-between gap-3 text-xs">
                  {/* Sustainability Card */}
                  <div className="rounded-xl bg-emerald-50 dark:bg-emerald-900/30 border border-emerald-100 dark:border-emerald-700 p-3 shadow-xs">
                    <p className="text-[11px] text-emerald-700 dark:text-emerald-200">
                      {t("dashboard.sustainabilityHelpTitle")}
                    </p>

                    <p className="text-xs text-emerald-900 dark:text-emerald-100 mt-1">
                      {t("dashboard.sustainabilityHelpText")}
                    </p>
                  </div>

                  {/* Note Card */}
                  <div className="rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-3 shadow-xs">
                    <p className="text-[11px] text-slate-700 dark:text-slate-300">
                      {t("dashboard.noteTitle")}
                    </p>

                    <p className="text-xs text-slate-700 dark:text-slate-300 mt-1">
                      {t("dashboard.noteText")}
                    </p>
                  </div>
                </div>
              </div>

              {/* Pagination Dots */}
              <div className="flex items-center justify-center gap-1 mt-1">
                {schemes.map((scheme, index) => (
                  <button
                    key={scheme.id || scheme._id || index}
                    onClick={() => setActiveSchemeIndex(index)}
                    className={`h-1.5 rounded-full transition-all ${index === activeSchemeIndex
                      ? 'w-6 bg-emerald-500'
                      : 'w-2 bg-slate-300 dark:bg-slate-600 hover:bg-slate-400 dark:hover:bg-slate-500'
                      }`}
                  />
                ))}
              </div>
            </>
          )}
        </div>
        {/* FOOTER GRID SECTION */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">

          {/* Card 1 — Getting Started */}
          <div className="rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-4 space-y-2 shadow-sm">
            <p className="text-xs text-slate-500 dark:text-slate-400">{t("dashboard.gettingStarted")}</p>

            <p className="text-sm font-semibold text-slate-900 dark:text-slate-50">
              {t("dashboard.notSureMethod")}
            </p>

            <p className="text-xs text-slate-600 dark:text-slate-300">
              {t("dashboard.startSmall")}
            </p>
          </div>

          {/* Card 2 — Tip */}
          <div className="rounded-2xl bg-emerald-50 dark:bg-emerald-900/30 border border-emerald-100 dark:border-emerald-700 p-4 space-y-2 shadow-sm">
            <p className="text-xs text-emerald-700 dark:text-emerald-200">{t("dashboard.tip")}</p>

            <p className="text-sm font-semibold text-emerald-900 dark:text-emerald-100">
              {t("dashboard.observeField")}
            </p>

            <p className="text-xs text-emerald-800 dark:text-emerald-200">
              {t("dashboard.observeText")}
            </p>
          </div>

          {/* Card 3 — Goal */}
          <div className="rounded-2xl bg-sky-50 dark:bg-sky-900/30 border border-sky-100 dark:border-sky-800 p-4 space-y-2 shadow-sm">
            <p className="text-xs text-sky-700 dark:text-sky-200">{t("dashboard.goal")}</p>

            <p className="text-sm font-semibold text-sky-900 dark:text-sky-100">
              {t("dashboard.goalText")}
            </p>

            <p className="text-xs text-sky-800 dark:text-sky-200">
              {t("dashboard.goalSubtitle")}
            </p>
          </div>
        </div>
      </div>



      {/* ----------------------- METHOD MODAL ----------------------- */}
      {selectedMethod && (
        <div className="fixed inset-0 z-40 flex items-center justify-center bg-black/40 px-3">
          <div className="w-full max-w-4xl rounded-2xl bg-white dark:bg-slate-900 shadow-2xl 
          border border-slate-200 dark:border-slate-700 overflow-hidden animate-[fadeIn_0.18s_ease-out]">

            {/* Modal Header */}
            <div className="flex items-center justify-between px-4 md:px-6 py-3 
            border-b border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800">

              <div>
                <p className="text-[11px] text-slate-500 dark:text-slate-400">
                  {t("sustainableMethod")}
                </p>

                <h3 className="text-base md:text-lg font-semibold text-slate-900 dark:text-slate-50">
                  {selectedMethod.name}
                </h3>
              </div>

              <button
                onClick={() => setSelectedMethod(null)}
                className="text-xs px-3 py-1.5 rounded-full bg-slate-100 dark:bg-slate-800 
              text-slate-700 dark:text-slate-200 hover:bg-slate-200 dark:hover:bg-slate-700 hover:cursor-pointer">
                {t("dashboard.close")}
              </button>
            </div>

            {/* Modal Content */}
            <div className="p-4 md:p-6 space-y-4 max-h-[75vh] overflow-y-auto">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">

                <div className="md:col-span-2 space-y-2">
                  {/* What is this method */}
                  <p className="text-sm font-semibold text-slate-900 dark:text-slate-50">
                    {t("sustainableMethod.whatIsMethod", { method: selectedMethod.name.toLowerCase() })}
                  </p>

                  <p className="text-xs md:text-sm text-slate-700 dark:text-slate-300">
                    {selectedMethod.description}
                  </p>

                  <p className="text-xs text-slate-600 dark:text-slate-400 mt-1">
                    {selectedMethod.highlight}
                  </p>

                  {/* Why this helps */}
                  <div className="mt-2">
                    <p className="text-xs font-semibold text-slate-900 dark:text-slate-50">
                      {t("sustainableMethod.whySupportsSustainability")}
                    </p>

                    <ul className="mt-1 text-xs text-slate-700 dark:text-slate-300 list-disc pl-4 space-y-1">
                      {(selectedMethod.benefits || []).map((b) => (
                        <li key={b}>{b}</li>
                      ))}
                    </ul>
                  </div>
                </div>

                {/* Usage Trend */}
                <div className="rounded-xl bg-slate-50 dark:bg-slate-900 
              border border-slate-200 dark:border-slate-700 p-3 flex flex-col">

                  <p className="text-xs font-semibold text-slate-900 dark:text-slate-50 mb-1">
                    {t("sustainableMethod.adoptionTrendExample")}
                  </p>

                  <p className="text-[11px] text-slate-600 dark:text-slate-400 mb-2">
                    {t("sustainableMethod.adoptionTrendInfo")}
                  </p>

                  <div className="flex-1 flex items-end gap-2 h-32">
                    {(selectedMethod.usageTrend || []).map((point) => {
                      const height = maxUsageValue ? (point.value / maxUsageValue) * 100 : 0;

                      return (
                        <div key={point.label} className="flex flex-col items-center justify-end gap-1 flex-1">
                          <div className="w-full max-w-[24px] rounded-t-lg bg-emerald-100 dark:bg-emerald-900/40 flex items-end justify-center overflow-hidden">
                            <div
                              className="w-full bg-gradient-to-t from-emerald-500 to-emerald-300 
                              dark:from-emerald-500 dark:to-emerald-300 transition-all duration-500"
                              style={{ height: `${height}%` }}
                            />
                          </div>

                          <span className="text-[10px] text-slate-500 dark:text-slate-400">
                            {point.label}
                          </span>

                          <span className="text-[10px] font-medium text-emerald-700 dark:text-emerald-300">
                            {point.value}%
                          </span>
                        </div>
                      );
                    })}
                  </div>

                  <p className="mt-2 text-[10px] text-slate-500 dark:text-slate-400">
                    {t("sustainableMethod.sampleTrendNote")}
                  </p>
                </div>
              </div>

              {/* Practical Ways */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-start">

                {/* Left — Practices */}
                <div className="md:col-span-2 rounded-xl bg-slate-50 dark:bg-slate-900 
              border border-slate-200 dark:border-slate-700 p-3 md:p-4">

                  <p className="text-xs font-semibold text-slate-900 dark:text-slate-50 mb-1">
                    {t("sustainableMethod.practicalWays")}
                  </p>

                  <ul className="mt-1 text-xs text-slate-700 dark:text-slate-300 list-disc pl-4 space-y-1">
                    {(selectedMethod.practices || []).map((p) => (
                      <li key={p}>{p}</li>
                    ))}
                  </ul>

                  <p className="text-[11px] text-slate-600 dark:text-slate-400 mt-2">
                    {t("sustainableMethod.startSmallAdvice")}
                  </p>
                </div>

                {/* Right — Video */}
                <div className="rounded-xl bg-white dark:bg-slate-900 
              border border-slate-200 dark:border-slate-700 p-3 md:p-4 flex flex-col gap-2">

                  <p className="text-xs font-semibold text-slate-900 dark:text-slate-50">
                    {t("sustainableMethod.watchVideo", { method: selectedMethod.name.toLowerCase() })}
                  </p>

                  <p className="text-[11px] text-slate-600 dark:text-slate-400">
                    {t("sustainableMethod.openVideoInfo")}
                  </p>

                  {selectedMethod.videoUrl && (
                    <a
                      href={selectedMethod.videoUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="mt-1 inline-flex items-center justify-center text-xs px-3 py-2 rounded-full bg-red-500 text-white font-medium hover:bg-red-600"
                    >
                      {t("sustainableMethod.openYoutube")}
                    </a>
                  )}

                  <p className="text-[10px] text-slate-500 dark:text-slate-400">
                    {t("sustainableMethod.watchTogetherNote")}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}



      {/* ----------------------- SCHEME MODAL ----------------------- */}
      {selectedScheme && (
        <div className="fixed inset-0 z-40 flex items-center justify-center bg-black/40 px-3">
          <div className="w-full max-w-4xl rounded-2xl bg-white dark:bg-slate-900 shadow-2xl 
          border border-slate-200 dark:border-slate-700 overflow-hidden animate-[fadeIn_0.18s_ease-out]">

            {/* Modal Header */}
            <div className="flex items-center justify-between px-4 md:px-6 py-3 
            border-b border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800">

              <div>
                <p className="text-[11px] text-slate-500 dark:text-slate-400">
                  {t("dashboard.schemeAboutTag")}
                </p>

                <h3 className="text-base md:text-lg font-semibold text-slate-900 dark:text-slate-50">
                  {selectedScheme.name}
                </h3>
              </div>

              <button
                onClick={() => setSelectedScheme(null)}
                className="text-xs px-3 py-1.5 rounded-full bg-slate-100 dark:bg-slate-800 
              text-slate-700 dark:text-slate-200 hover:bg-slate-200 dark:hover:bg-slate-700 hover:cursor-pointer">
                {t("sustainableMethod.close")}
              </button>
            </div>

            {/* Modal Content */}
            <div className="p-4 md:p-6 space-y-4 max-h-[75vh] overflow-y-auto">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">

                {/* Left Text */}
                <div className="md:col-span-2 space-y-2">

                  <p className="text-sm font-semibold text-slate-900 dark:text-slate-50">
                    {t("dashboard.aboutScheme")}
                  </p>

                  <p className="text-xs md:text-sm text-slate-700 dark:text-slate-300">
                    {selectedScheme.tagline}
                  </p>

                  <p className="text-xs text-slate-600 dark:text-slate-400 mt-1">
                    {selectedScheme.howItHelps}
                  </p>

                  {/* Focus Areas */}
                  <div className="mt-2">
                    <p className="text-xs font-semibold text-slate-900 dark:text-slate-50">
                      {t("dashboard.keyFocusAreas")}
                    </p>

                    <div className="flex flex-wrap gap-1 mt-1">
                      {(selectedScheme.focusAreas || []).map((area) => (
                        <span
                          key={area}
                          className="text-[10px] px-2 py-0.5 rounded-full 
                          bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 
                          border border-slate-200 dark:border-slate-700"
                        >
                          {area}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 p-3 flex flex-col gap-2">
                  <p className="text-xs font-semibold text-slate-900 dark:text-slate-50">
                    Visual / logo space
                  </p>
                  <div className="rounded-lg bg-slate-200 dark:bg-slate-700 p-2 flex items-center justify-center h-4- w-40 ml-10">
                    {selectedScheme.logoUrl ? (
                      <img
                        src={selectedScheme.logoUrl}
                        alt={`${selectedScheme.name} logo`}
                        className="max-w-full max-h-40 object-contain rounded-md"
                      />
                    ) : (
                      <span className="text-[11px] text-slate-600 dark:text-slate-300">
                        {t("dashboard.logoNotAvailable")}
                      </span>
                    )}
                  </div>



                  <p className="text-[10px] text-slate-500 dark:text-slate-400">
                    You can place official logos or banners here when integrating with real data.
                  </p>
                </div>

              </div>

              {/* Eligibility & Support */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-start">

                <div className="md:col-span-2 rounded-xl bg-slate-50 dark:bg-slate-900 
              border border-slate-200 dark:border-slate-700 p-3 md:p-4 space-y-2">

                  <p className="text-xs font-semibold text-slate-900 dark:text-slate-50">
                    {t("dashboard.eligibility")}
                  </p>

                  <p className="text-xs text-slate-700 dark:text-slate-300">
                    {selectedScheme.eligibility}
                  </p>

                  <p className="text-xs font-semibold text-slate-900 dark:text-slate-50 mt-2">
                    {t("dashboard.supportProvided")}
                  </p>

                  <p className="text-xs text-slate-700 dark:text-slate-300">
                    {selectedScheme.support}
                  </p>

                  <p className="text-[11px] text-slate-600 dark:text-slate-400 mt-2">
                    {t("dashboard.noteText")}
                  </p>
                </div>

                {/* Learn More */}
                <div className="rounded-xl bg-white dark:bg-slate-900 border p-3 flex flex-col gap-2">
                  <p className="text-xs font-semibold">
                    {t("dashboard.schemeLearnMore")}
                  </p>

                  <a
                    href={selectedScheme.learnMoreUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center justify-center gap-1
               text-xs px-3 py-2 rounded-full
               bg-red-500 text-white hover:bg-emerald-600"
                  >
                    {t("dashboard.openOfficial")}
                  </a>

                  <p className="text-[10px] text-slate-500 dark:text-slate-400">
                    {t("dashboard.noteText")}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>

  );
}