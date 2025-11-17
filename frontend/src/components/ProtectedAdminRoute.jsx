import React, { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";

export default function ProtectedAdminRoute({ children }) {
  const [authorized, setAuthorized] = useState(null); // null = cargando

  useEffect(() => {
    const checkAdmin = async () => {
      try {
        const res = await fetch("https://spectra-8r7j.onrender.com/api/adminz", {
          credentials: "include", // importante si usas cookies
        });
        if (res.ok) {
          setAuthorized(true);
        } else {
          setAuthorized(false);
        }
      } catch {
        setAuthorized(false);
      }
    };
    checkAdmin();
  }, []);

  if (authorized === null) return <div>Cargando...</div>;
  if (!authorized) return <Navigate to="/dashboard" replace />;

  return children;
}
