import React, { useEffect, useState } from "react";

export default function Dashboard() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    // Puedes hacer una petición al backend para validar el token si quieres
    fetch("http://localhost:8080/api/userinfo", {
      credentials: "include",
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.success) setUser(data.user);
      })
      .catch(() => {});
  }, []);

  const handleLogout = () => {
    document.cookie = "token=; Max-Age=0"; // borra la cookie
    window.location.href = "/login";
  };

  return (
    <div style={{
      fontFamily: "sans-serif",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      height: "100vh",
    }}>
      <h1>Dashboard</h1>
      {user ? (
        <p>Bienvenido, <strong>{user.username}</strong></p>
      ) : (
        <p>Cargando usuario...</p>
      )}
      <button
        onClick={handleLogout}
        style={{
          marginTop: "1rem",
          padding: "0.5rem 1rem",
          backgroundColor: "#d33",
          color: "#fff",
          border: "none",
          borderRadius: "6px",
          cursor: "pointer",
        }}
      >
        Cerrar sesión
      </button>
    </div>
  );
}
