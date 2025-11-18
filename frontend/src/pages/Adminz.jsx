import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import "./assets/css/Dashboard.css";

export default function Adminz() {
  const [message, setMessage] = useState("Cargando...");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [user, setUser] = useState(null);

  // Verifica acceso admin
  useEffect(() => {
    fetch("https://spectra-8r7j.onrender.com/api/adminz", { credentials: "include" })
      .then(async (res) => {
        if (!res.ok) {
          const data = await res.json();
          throw new Error(data.error || "Acceso denegado");
        }
        const data = await res.json();
        setMessage(data.message);
      })
      .catch((err) => setMessage(err.message));
  }, []);

  // Obtiene info de usuario
  useEffect(() => {
    fetch("https://spectra-8r7j.onrender.com/api/userinfo", { credentials: "include" })
      .then((res) => res.json())
      .then((data) => {
        if (data.success) setUser(data.user);
      })
      .catch(() => {});
  }, []);

  // Bloquea scroll al abrir menú
  useEffect(() => {
    document.body.style.overflow = sidebarOpen ? "hidden" : "";
    return () => (document.body.style.overflow = "");
  }, [sidebarOpen]);

  return (
    <div className="app">
      {/* Sidebar */}
      <aside className={`sidebar ${sidebarOpen ? "open" : ""}`} aria-hidden={!sidebarOpen}>
        <div className="sidebar-inner">
          <div className="sidebar-top">
            <h1 className="logo">SPECTRA</h1>
          </div>

          <nav className="nav">
            <Link to="/" className="nav a">Inicio</Link>
            <Link to="/adminz/add/game" className="nav a">Agregar Juegos</Link>
            <Link to="/games" className="nav a">Explorar Juegos</Link>
            <Link to="/favorites" className="nav a">Favoritos</Link>
          </nav>
        </div>
        <button
          className="close-drawer"
          onClick={() => setSidebarOpen(false)}
          aria-label="Cerrar menú"
        >
          ×
        </button>
      </aside>

      {/* Overlay */}
      {sidebarOpen && (
        <div
          className="overlay"
          onClick={() => setSidebarOpen(false)}
          aria-hidden="true"
        />
      )}

      {/* Main content */}
      <main className={`main ${sidebarOpen ? "no-scroll" : ""}`}>
        <header className="navbar">
          <div className="nav-left">
            <button
              className="hamburger"
              onClick={() => setSidebarOpen(true)}
              aria-label="Abrir menú"
            >
              ☰
            </button>
          </div>

          <div className="nav-center">
            <input className="search" type="text" placeholder="Buscar..." aria-label="Buscar" />
          </div>
        </header>

        <section className="hero" role="banner">
          <div className="hero-bg" aria-hidden="true" />
          <div className="overlay-dark" aria-hidden="true" />
          <div className="hero-content">
            {user && <h2 className="spectra-title">Bienvenido al panel de control, {user.username}</h2>}
            <Link to="/games" className="cta">Explorar juegos</Link>
          </div>
        </section>
      </main>
    </div>
  );
}


