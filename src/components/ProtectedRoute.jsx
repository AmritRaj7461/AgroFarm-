import { useContext, useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import api from "../api/api";
import Loader from "./Loader";

export default function ProtectedRoute({ children }) {
  const { user, loginUser } = useContext(AuthContext);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    async function checkAuth() {
      const delay = new Promise((resolve) => setTimeout(resolve, 2000)); // 2 sec delay

      try {
        const res = await api.get("/auth/me");
        await delay;  // wait for delay + API
        loginUser(res.data);
      } catch {
        await delay;  // still wait 2 sec even on error
        return setLoading(false);
      }

      setLoading(false);
    }

    checkAuth();
  }, []);

  if (loading) return <Loader />

  return user ? children : <Navigate to="/login" />;
}
