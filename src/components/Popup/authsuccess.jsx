import React, { useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";

const OAuthSuccess = () => {
  const navigate = useNavigate();
  const hasRun = useRef(false);   // guard

  useEffect(() => {
    // Prevent double execution (React 18 StrictMode)
    if (hasRun.current) return;
    hasRun.current = true;

    try {
      const params = new URLSearchParams(window.location.search);

      const token = params.get("token");
      const userStr = params.get("user");

      console.log("OAuth params:", { token, userStr });

      if (!token || !userStr) {
        navigate("/login", { replace: true });
        return;
      }

      const user = JSON.parse(decodeURIComponent(userStr));

      // Save auth data
      localStorage.setItem("token", token);
      localStorage.setItem("user",
        JSON.stringify({
          data: user
        })
      );

      // Notify app (Navbar, contexts, etc.)
      window.dispatchEvent(new Event("auth-change"));

      // Redirect after successful login
      navigate("/account", { replace: true });

    } catch (error) {
      console.error("OAuthSuccess error:", error);
      navigate("/login", { replace: true });
    }

  }, [navigate]);

  return <div style={{ padding: 20 }}>Logging in with Google...</div>;
};

export default OAuthSuccess;
