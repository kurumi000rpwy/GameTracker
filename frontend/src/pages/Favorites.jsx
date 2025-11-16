import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./assets/css/Games.css";

export default function FavoriteGames() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [games, setGames] = useState([]);
  const [message, setMessage] = useState("");
  const navigate = useNavigate();
  const [user, setUser] = useState(null);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");

    if (storedUser) {
      const u = JSON.parse(storedUser);
      setUser(u);
      loadFavorites(u._id);
    }
  }, []);

  async function loadFavorites(userId) {
    try {
      const res = await fetch(`/api/user/${userId}/favorites`, {
        credentials: "include",
      });

      const data = await res.json();

      if (!data.success) {
        setMessage(data.message || "No tienes juegos favoritos");
        setGames([]);
        return;
      }

      setGames(data.favorites);
    } catch (error) {
      console.error("Error:", error);
      setMessage("Error al cargar tus juegos favoritos");
    }
  }

  function handleGameClick(id) {
    navigate(`/games/${id}`);
  }

  async function handleLogout() {
    const res = await fetch("/api/logout", {
      method: "POST",
      credentials: "include",
    });

    const data = await res.json();
    if (data.success) {
      localStorage.removeItem("user");
      setUser(null);
      navigate("/");
    }
  }

  return (
    <div className="app">

      {/* --- SIDEBAR --- */}
      <aside className={`sidebar ${sidebarOpen ? "open" : ""}`}>
        <div className="sidebar-inner">
          <h1 className="logo">SPECTRA</h1>

          <nav className="nav">
            <Link to="/">Inicio</Link>
            <Link to="/games">Explorar Juegos</Link>
            <Link to="/favorites">Mis Favoritos</Link>
            <Link to="/featured">Destacados</Link>
            <Link to="/news">Noticias</Link>
            <Link to="/about">Sobre Nosotros</Link>
          </nav>
        </div>

        <button className="close-drawer" onClick={() => setSidebarOpen(false)}>
          ✖
        </button>
      </aside>

      {sidebarOpen && <div className="overlay" onClick={() => setSidebarOpen(false)} />}

      {/* --- MAIN --- */}
      <main className="main">
        <header className="navbar">

          <button className="hamburger" onClick={() => setSidebarOpen(true)}>
            ☰
          </button>

          <div className="nav-center">
            <input className="search" placeholder="Buscar..." />
          </div>

          <div className="nav-right">
            {!user ? (
              <>
                <Link to="/login" className="btn auth">Iniciar sesión</Link>
                <Link to="/register" className="btn register">Registro</Link>
              </>
            ) : (
              <>
                <span className="h3">Hola, {user.username}</span>
                <button onClick={handleLogout} className="btn logout">
                  Cerrar sesión
                </button>
              </>
            )}
          </div>
        </header>

        {/* ---- FAVORITE GAMES ---- */}
        <section className="games-section">
          <h1 className="games-title">Mis Juegos Favoritos</h1>

          <div className="games-grid">
            {games.length > 0 ? (
              games.map((g) => (
                <div
                  key={g._id}
                  className="game-card"
                  onClick={() => handleGameClick(g.title)}
                >
                  <img src={g.img} alt={g.title} />
                  <h3>{g.title}</h3>
                  <p>{g.genre}</p>
                </div>
              ))
            ) : (
              <p className="games-message">{message}</p>
            )}
          </div>

        </section>
      </main>
    </div>
  );
}
