import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import "./assets/css/Home.css";

function Home() {
  const phrases = [
    "Tu mejor lugar para videojuegos",
    "Comparte tus mejores juegos",
    "Conecta con tus amigos",
    "Descubre nuevos títulos",
    "Vive la experiencia gamer",
    "Vuelve cada día por más",
  ];

  const [text, setText] = useState("");
  const [index, setIndex] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Typing effect
  useEffect(() => {
    const current = phrases[index];
    let speed = isDeleting ? 40 : 90;

    const timeout = setTimeout(() => {
      if (!isDeleting && text.length < current.length) {
        setText(current.substring(0, text.length + 1));
      } else if (isDeleting && text.length > 0) {
        setText(current.substring(0, text.length - 1));
      } else if (!isDeleting && text.length === current.length) {
        setTimeout(() => setIsDeleting(true), 900);
      } else if (isDeleting && text.length === 0) {
        setIsDeleting(false);
        setIndex((prev) => (prev + 1) % phrases.length);
      }
    }, speed);

    return () => clearTimeout(timeout);
  }, [text, isDeleting, index, phrases]);

  // Lock body scroll when sidebar open
  useEffect(() => {
    document.body.style.overflow = sidebarOpen ? "hidden" : "";
    return () => (document.body.style.overflow = "");
  }, [sidebarOpen]);

  return (
    <div className="app">
      {/* Sidebar */}
      <aside className={`sidebar ${sidebarOpen ? "open" : ""}`} aria-hidden={!sidebarOpen && window.innerWidth < 769}>
        <div className="sidebar-inner">
          <div className="sidebar-top">
            <h1 className="logo">SPECTRA</h1>
          </div>

          <nav className="nav">
            <Link to="/" className="nav a">Inicio</Link>
            <Link to="/games" className="nav a">Explorar Juegos</Link>
            <Link to="/favorites" className="nav a">Favoritos</Link>
          </nav>
        </div>

        <button className="close-drawer" onClick={() => setSidebarOpen(false)} aria-label="Cerrar menú">
          ✕
        </button>
      </aside>

      {/* Overlay (mobile) */}
      {sidebarOpen && <div className="overlay" onClick={() => setSidebarOpen(false)} aria-hidden="true" />}

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

          <div className="nav-right">
            <Link to="/login" className="btn login">Iniciar sesi�n</Link>
            <Link to="/register" className="btn register">Registrarse</Link>
          </div>
        </header>

        <section className="hero" role="banner">
          <div className="hero-bg" aria-hidden="true" />
          <div className="overlay-dark" aria-hidden="true" />
          <div className="hero-content">
            <h2 className="spectra-title">Spectra</h2>
            <p className="typing">
              {text}
              <span className="cursor">|</span>
            </p>
            <Link to="/games" className="cta">Explorar Juegos</Link>
          </div>
        </section>
      </main>
    </div>
  );
}

export default Home;
