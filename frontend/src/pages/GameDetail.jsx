import React, { useState, useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import "./assets/css/Games.css";

export default function GameDetail() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [game, setGame] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [message, setMessage] = useState("");
  const { id } = useParams();

  useEffect(() => {
    fetchGame();
  }, [id]);

  async function fetchGame() {
    try {
      const res = await fetch(`/api/games/${id}`);
      const data = await res.json();

      if (!data.success) {
        setMessage("No se pudo cargar el juego");
        return;
      }

      setGame(data.game);
      setReviews(data.reviews || []);
    } catch {
      setMessage("Error al obtener la información del juego");
    }
  }

  const renderStars = (rating = 0) => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      stars.push(
        <span key={i} className={i <= rating ? "star filled" : "star"}>
          ★
        </span>
      );
    }
    return stars;
  };

  return (
    <div className="app">
      {/* === SIDEBAR === */}
      <aside className={`sidebar ${sidebarOpen ? "open" : ""}`}>
        <div className="sidebar-inner">
          <div className="sidebar-top">
            <h1 className="logo">SPECTRA</h1>
          </div>

          <nav className="nav">
            <Link to="/">Inicio</Link>
            <Link to="/games">Explorar Juegos</Link>
            <Link to="/featured">Destacados</Link>
            <Link to="/news">Noticias</Link>
            <Link to="/about">Sobre Nosotros</Link>
            <Link to="/support">Soporte</Link>
          </nav>

          <div className="upgrade">
            <p className="upgrade-title">Upgrade Version</p>
            <p className="upgrade-desc">Upgrade now for game interest</p>
            <button className="upgrade-btn">Upgrade Now</button>
          </div>
        </div>

        <button className="close-drawer" onClick={() => setSidebarOpen(false)}>
          ✕
        </button>
      </aside>

      {sidebarOpen && (
        <div className="overlay" onClick={() => setSidebarOpen(false)} />
      )}

      {/* === MAIN CONTENT === */}
      <main className="main">
        <header className="navbar">
          <div className="nav-left">
            <button className="hamburger" onClick={() => setSidebarOpen(true)}>
              ☰
            </button>
          </div>

          <div className="nav-center">
            <input className="search" type="text" placeholder="Buscar..." />
          </div>

          <div className="nav-right">
            <Link to="/login" className="btn auth">
              Iniciar sesión
            </Link>
            <Link to="/register" className="btn register">
              Registro
            </Link>
          </div>
        </header>

        <section className="game-detail-section">
          {!game && !message && <p className="loading">Cargando...</p>}
          {message && <p className="error">{message}</p>}

          {game && (
            <div className="game-detail-card">
              <img
                src={game.image || "/placeholder.jpg"}
                alt={game.title}
                className="game-detail-image"
              />

              <div className="game-detail-info">
                <h1 className="game-detail-title">{game.title}</h1>
                <div className="game-rating">{renderStars(game.rating)}</div>
                <p className="game-genre">
                  🎭 <strong>Género:</strong> {game.genre}
                </p>
                <p className="game-platform">
                  💻 <strong>Plataforma:</strong> {game.platform}
                </p>
                <p className="game-release">
                  📅 <strong>Lanzamiento:</strong> {game.releaseDate}
                </p>
                <p className="game-description">{game.description}</p>
              </div>
            </div>
          )}

          {/* === REVIEWS === */}
          <div className="reviews-section">
            <h2>Reseñas</h2>
            {reviews.length > 0 ? (
              reviews.map((r, i) => (
                <div key={i} className="review-card">
                  <p className="review-user">👤 {r.user}</p>
                  <p className="review-text">{r.comment}</p>
                </div>
              ))
            ) : (
              <p className="no-reviews">Aún no hay reseñas</p>
            )}
          </div>
        </section>
      </main>
    </div>
  );
}	
