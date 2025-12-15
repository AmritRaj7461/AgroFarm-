import React, { useRef, useState, useEffect } from "react";
import { useTheme } from "../context/ThemeContext";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import { useContext } from "react";

export default function HeaderBar({ activeItem }) {
  const { theme, toggleTheme } = useTheme();
  const { i18n } = useTranslation();
  const { user, logoutUser } = useContext(AuthContext);
  const navigate = useNavigate();

  const [profileOpen, setProfileOpen] = useState(false);
  const profileRef = useRef(null);
  useEffect(() => {
    function handleClickOutside(e) {
      if (profileRef.current && !profileRef.current.contains(e.target)) {
        setProfileOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const tips = [
    "Use mulching to keep soil moist and reduce weeds.",
    "Rotate crops to improve soil health and break pest cycles.",
    "Collect rainwater to reduce dependency on groundwater.",
    "Add compost regularly to boost soil organic matter.",
    "Grow border trees or hedges to reduce wind and soil erosion.",
  ];

  const [tipIndex, setTipIndex] = useState(0);

  // 🔥 LOGOUT — SINGLE SOURCE OF TRUTH
  const handleLogout = async () => {
    try {
      await fetch("http://localhost:5000/api/auth/logout", {
        method: "POST",
        credentials: "include",
      });
    } catch (err) {
      console.error("Logout failed", err);
    } finally {
      logoutUser();                       // 🔥 clear context
      sessionStorage.clear();
      navigate("/login", { replace: true }); // 🔥 no back navigation
    }
  };
  useEffect(() => {
    const interval = setInterval(() => {
      setTipIndex((prev) => (prev + 1) % tips.length);
    }, 8000);

    return () => clearInterval(interval);
  }, []);

  const getInitial = () => user?.fullName?.[0]?.toUpperCase() || "U";
  const getFirstName = () => user?.fullName?.split(" ")[0] || "User";
  const displayName = () => user?.fullName || "User";

  return (
    <header className="h-16 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between px-4 md:px-6 bg-gradient-to-r from-emerald-50 via-slate-50 to-sky-50 dark:from-slate-950 dark:via-slate-950 dark:to-slate-900 backdrop-blur">

      {/* LEFT SIDE */}
      <div className="flex flex-col gap-1">
        <div className="flex items-center gap-2">
          <span className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-emerald-500/10 border border-emerald-200 dark:border-emerald-700 dark:bg-emerald-900/30 text-[13px]">
            🌱
          </span>
          <p className="text-[11px] font-medium tracking-wide text-emerald-700 dark:text-emerald-300 uppercase">
            AgroFarm Assistant
          </p>
        </div>

        <h2 className="text-base md:text-lg font-semibold text-slate-900 dark:text-slate-50 mt-0.5">
          {activeItem.label}
        </h2>
      </div>

      {/* RIGHT SIDE */}
      <div className="flex items-center gap-3 text-xs">

        {/* 🌐 LANGUAGE TOGGLE BUTTON */}
        <button
          onClick={() => i18n.changeLanguage(i18n.language === "en" ? "hi" : "en")}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-slate-200/80 dark:bg-slate-800/90 border border-slate-300 dark:border-slate-700 dark:text-white text-[11px] hover:cursor-pointer"
        >
          🌐 {i18n.language === "en" ? "हिंदी" : "English"}
        </button>

        {/* Tip bubble */}
        <div className="hidden md:flex items-center gap-2 px-4 py-1.5 rounded-full bg-slate-200/80 dark:bg-slate-800/90 border border-slate-300/70 dark:border-slate-700/70 shadow-sm">
          <span className="text-[14px]">💡</span>
          <div className="flex flex-col leading-tight">
            <span className="text-[11px] text-slate-600 dark:text-slate-300">
              Daily tip
            </span>
            <span className="text-[11px] font-semibold text-slate-800 dark:text-slate-100 truncate">
              {tips[tipIndex]}
            </span>
          </div>
        </div>

        {/* Theme toggle */}
        <button
          onClick={toggleTheme}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-slate-200/80 dark:bg-slate-800/90 border border-slate-300 dark:border-slate-700 text-[11px] hover:cursor-pointer"
        >
          <div className="relative w-9 h-4 rounded-full bg-slate-300 dark:bg-slate-700 flex items-center px-[2px]">
            <div
              className={`h-3 w-3 rounded-full bg-white dark:bg-slate-200 transition-transform ${theme === "dark" ? "translate-x-4" : "translate-x-0"
                }`}
            />
          </div>
          {theme === "light" ? (
            <>
              <span className="text-amber-500 text-sm">☀️</span>
              <span className="text-slate-700">Light</span>
            </>
          ) : (
            <>
              <span className="text-sky-400 text-sm">🌙</span>
              <span className="text-slate-100">Dark</span>
            </>
          )}
        </button>

        {/* Profile */}
        <div className="relative" ref={profileRef}>
          <button
            onClick={() => setProfileOpen((prev) => !prev)}
            className="flex items-center gap-2 px-2.5 py-1.5 rounded-full bg-slate-200/80 dark:bg-slate-800 border border-slate-300/70 dark:border-slate-700/80 hover:cursor-pointer"
          >
            <div className="h-7 w-7 rounded-full bg-emerald-500 text-white flex items-center justify-center text-xs font-semibold">
              {getInitial()}
            </div>

            <div className="hidden sm:flex flex-col items-start">
              <span className="font-medium text-sm text-slate-900 dark:text-slate-50">
                {getFirstName()}
              </span>
              <span className="text-[10px] text-slate-500 dark:text-slate-400">
                My farm
              </span>
            </div>

            <span className="hidden sm:inline text-[10px] text-slate-500 dark:text-slate-400">
              ▾
            </span>
          </button>

          {/* Dropdown */}
          {profileOpen && (
            <div className="absolute right-0 mt-2 w-44 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 shadow-lg py-2 z-30 ">
              <div className="px-3 pb-2 border-b border-slate-100 dark:border-slate-800 mb-1">
                <p className="text-[11px] text-slate-500 dark:text-slate-400">
                  Signed in as
                </p>
                <p className="text-xs font-semibold text-slate-900 dark:text-slate-50">
                  {displayName()}
                </p>

                {user?.email && (
                  <p className="text-[10px] text-slate-400 mt-0.5">{user.email}</p>
                )}
              </div>



              <button
                onClick={handleLogout}
                className="w-full text-left px-3 py-1.5 text-xs text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40 hover:cursor-pointer"
              >
                🚪 Logout
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
