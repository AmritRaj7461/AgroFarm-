// src/components/Sidebar.jsx
import React from 'react';

export default function Sidebar({ navItems, active, setActive, isOpen, onClose }) {

  return (
    <aside className="w-64 bg-slate-100 dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 flex flex-col">
      <div className="px-5 py-4 border-b border-slate-200 dark:border-slate-800 flex items-center gap-3">
        <div className="h-10 w-10 rounded-xl bg-emerald-500 flex items-center justify-center text-2xl text-white">
          🌱
        </div>
        <div>
          <h1 className="text-base font-semibold text-slate-900 dark:text-slate-50">AgroFarm</h1>
          <p className="text-xs text-slate-500 dark:text-slate-400">Simple smart farming</p>
        </div>
      </div>

      <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
        {navItems.map(item => {
          const isActive = active === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActive(item.id)}
              className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-sm text-left transition-colors hover:cursor-pointer ${
                isActive
                  ? 'bg-emerald-600 text-emerald-50 border border-emerald-500'
                  : 'text-slate-700 dark:text-slate-200 hover:bg-slate-200/70 dark:hover:bg-slate-800 border border-transparent'
              }`}
            >
              <span>{item.label}</span>
              
            </button>
          );
        })}
      </nav>

      <div className="p-4 border-t border-slate-200 dark:border-slate-800 text-xs space-y-1">
        <p className="text-slate-500 dark:text-slate-400">Today&apos;s quick info</p>
        <div className="flex justify-between">
          <span className="text-slate-700 dark:text-slate-200">Water saving</span>
          <span className="font-semibold text-emerald-700 dark:text-emerald-300">-18%</span>
        </div>
        <div className="flex justify-between">
          <span className="text-slate-700 dark:text-slate-200">Soil health</span>
          <span className="font-semibold text-emerald-700 dark:text-emerald-300">Good</span>
        </div>
      </div>
    </aside>
  );
}
