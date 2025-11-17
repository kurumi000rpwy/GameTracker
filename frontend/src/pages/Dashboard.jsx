import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import "./assets/css/Dashboard.css";

function Home() {

  const [user, setUser] = useState(null);

  useEffect(() => {
    // Puedes hacer una petición al backend para validar el token si quieres
    fetch("https://spectra-8r7j.onrender.com/api/userinfo", {
      credentials: "include",
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.success) setUser(data.user);
      })
      .catch(() => {});
  }, [])



  const handleLogout = () => {
    document.cookie = "token=; Max-Age=0"; // borra la cookie
    window.location.href = "/login";
  };
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
    [sidebarOpen]})

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
            <Link to="/featured" className="nav a">Destacados de hoy</Link>
            <Link to="/news" className="nav a">Noticias</Link>
            <Link to="/about" className="nav a">Sobre nosotros</Link>
            <Link to="/support" className="nav a">Soporte</Link>
          </nav>

          <div className="upgrade">
            <p className="upgrade-title">Upgrade Version</p>
            <p className="upgrade-desc">Upgrade now for game interest</p>
            <button className="upgrade-btn">Upgrade Now</button>
          </div>
        </div>

        <button className="close-drawer" onClick={() => setSidebarOpen(false)} aria-label="Cerrar menú">
          �~\~U
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
              �~X�
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
	  {user && <h2 className="spectra-title">Bienvenido, {user.username}</h2>}
            <p className="typing">
              {text}
              <span className="cursor">|</span>
            </p>
            <Link to="/games" className="cta">Ver juegos</Link>
          </div>
        </section>
      </main>
    </div>
  );
}

export default Home;
