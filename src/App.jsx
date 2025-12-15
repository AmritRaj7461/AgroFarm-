import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import Home from "./pages/Home";

// Auth pages
import Login from "./pages/Auth/Login";
import Signup from "./pages/Auth/Signup";

// Layout
import Layout from "./layout/Layout";

// Protected
import ProtectedRoute from "./components/ProtectedRoute";

// Pages inside layout
import DashboardPage from "./pages/DashboardPage";
import MyFieldPage from "./pages/MyField/MyFieldPage";
import SoilHealthPage from "./pages/SoilHealthPage";
import WeatherAlertsPage from "./pages/WeatherAlertsPage";
import CommunityPage from "./pages/CommunityPage";

const App = () => {
  return (
    <Router>
      <Routes>
        {/* ================= PUBLIC ROUTES ================= */}
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />

        {/* ================= PROTECTED APP ================= */}
        <Route
          path="/app"
          element={
            <ProtectedRoute>
              <Layout />
            </ProtectedRoute>
          }
        >
          <Route index element={<DashboardPage />} />
          <Route path="dashboard" element={<DashboardPage />} />
          <Route path="my-field" element={<MyFieldPage />} />
          <Route path="soil-health" element={<SoilHealthPage />} />
          <Route path="weather-alerts" element={<WeatherAlertsPage />} />
          <Route path="community" element={<CommunityPage />} />
        </Route>
      </Routes>
    </Router>
  );
};

export default App;
