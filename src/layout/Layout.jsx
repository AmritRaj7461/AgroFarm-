import React, { useEffect, useMemo, useState } from "react";
import { Outlet, useNavigate, useLocation } from "react-router-dom";

import Sidebar from "../components/Sidebar";
import HeaderBar from "../components/HeaderBar";

const NAV_ITEMS = [
  { id: "dashboard", label: "Dashboard", path: "/app/dashboard" },
  { id: "my-field", label: "My Field", path: "/app/my-field" },
  { id: "soil-health", label: "Soil Health", path: "/app/soil-health" },
  { id: "weather-alerts", label: "Weather & Alerts", path: "/app/weather-alerts" },
  { id: "community", label: "Community Forum", path: "/app/community" },
];



export default function Layout() {
  const navigate = useNavigate();
  const location = useLocation();

  const [sidebarOpen, setSidebarOpen] = useState(false);

  const [active, setActive] = useState(() => {
    const match = NAV_ITEMS.find((n) => n.path === location.pathname);
    return match ? match.id : "dashboard";
  });

  const pathToId = useMemo(() => {
    const map = {};
    NAV_ITEMS.forEach((n) => (map[n.path] = n.id));
    return map;
  }, []);

  const idToPath = useMemo(() => {
    const map = {};
    NAV_ITEMS.forEach((n) => (map[n.id] = n.path));
    return map;
  }, []);

  useEffect(() => {
    const id = pathToId[location.pathname];
    if (id) {
      setActive(id);
    }
  }, [location.pathname]); // eslint-disable-line react-hooks/exhaustive-deps

  const handleSetActive = (id) => {
    const path = idToPath[id];
    if (path) {
      navigate(path);
    }
  };

  const activeItem = NAV_ITEMS.find((n) => n.id === active) || NAV_ITEMS[0];

  return (
    <div className="flex h-screen w-full overflow-hidden">
      <Sidebar
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        navItems={NAV_ITEMS}
        active={active}
        setActive={handleSetActive}
      />

      {/* MAIN WRAPPER – background was causing the white border */}
      <div className="flex flex-1 flex-col bg-slate-50 dark:bg-slate-950">
        <HeaderBar
          activeItem={activeItem}
          sidebarOpen={sidebarOpen}
          setSidebarOpen={setSidebarOpen}
          setActive={handleSetActive}
        />

        <main className="flex-1 overflow-y-auto px-8 py-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
