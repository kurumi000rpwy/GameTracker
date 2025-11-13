import React, { useState, useEffect } from "react";
import { Link, useParams , useNavigate} from "react-router-dom";
import "./assets/css/Games.css";

export default function GameDetail() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [game, setGame] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [message, setMessage] = useState("");
  const { id } = useParams();
  const [user, setUser] = useState(null);
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");
  const navigate = useNavigate();
  const [isFavorite, setIsFavorite] = useState(false);

  useEffect(() => {
  fetchGame();

    // Buscar usuario en localStorage
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch {
        localStorage.removeItem("user"); // Si hay error, limpiar datos corruptos
      }
    }
  const favs = JSON.parse(localStorage.getItem("favorites") || "[]");
  setIsFavorite(favs.includes(id));
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
  
const toggleFavorite = async () => {
  if (!user) {
    alert("Debes iniciar sesión para añadir a favoritos.");
    return;
  }

  // Verificar IDs válidos
  const userId = user?.username || user?._id;
  const gameId = game?._id || game?.id;

  if (!userId || !gameId) {
    console.error("Faltan IDs:", { userId, gameId });
    alert("No se pudo identificar el usuario o el juego.");
    return;
  }

  try {
    const res = await fetch(`http://localhost:8080/api/favorites/${game._id}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
    });

    const data = await res.json();
    console.log("Respuesta del backend:", data);

    if (data.success) {
      setIsFavorite(data.isFavorite);

      // Guardar localmente la lista de favoritos
      const favs = JSON.parse(localStorage.getItem("favorites") || "[]");
      if (data.isFavorite) {
        localStorage.setItem("favorites", JSON.stringify([...favs, id]));
      } else {
        localStorage.setItem("favorites", JSON.stringify(favs.filter(f => f !== id)));
      }
    } else {
      alert(data.message || "No se pudo actualizar el favorito.");
    }
  } catch (err) {
    console.error("Error al actualizar favorito:", err);
  }
};

async function handleLogout() {
  try {
    const res = await fetch("/api/logout", {
      method: "POST",
      credentials: "include", // para enviar la cookie al backend
    });

    const data = await res.json();
    if (data.success) {
      localStorage.removeItem("user"); // borra el usuario local
      setUser(null);
      navigate("/"); // redirige al inicio
    } else {
      console.error("Error al cerrar sesión:", data.message);
    }
  } catch (error) {
    console.error("Error de red al cerrar sesión:", error);
  }
}
  async function handleReviewSubmit(e) {
  e.preventDefault();
  if (!user) return alert("Debes iniciar sesión para dejar una reseña.");

  console.log({
    username: user?.username,
    gameTitle: game?.title,
    rating,
    comment,
  });

  try {
    const res = await fetch("/api/reviews", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        username: user?.username,
        gameTitle: game?.title,
        rating,
        comment,
      }),
    });

    const data = await res.json();
    console.log("Respuesta del backend:", data);
    if (data.success) {
      setReviews([data.review, ...reviews]);
      setRating(0);
      setComment("");
    } else {
      alert(data.message);
    }
  } catch (err) {
    alert("Error al enviar la reseña");
  }
}
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
           ✖
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
               ☰�
            </button>
          </div>

          <div className="nav-center">
            <input className="search" type="text" placeholder="Buscar..." />
          </div>

          <div className="nav-right">
            {!user ? (
              <>
                <Link to="/login" className="btn auth">
                  Iniciar sesión
                </Link>
                <Link to="/register" className="btn register">
                  Registro
                </Link>
              </>
            ) : (
              <>
                <span className="game-description">Hola, {user.username}</span>
                <button onClick={handleLogout} className="btn logout">
                  Cerrar sesión
                </button>
              </>
            )}
          </div>
        </header>

        <section className="game-detail-section">
          {!game && !message && <p className="loading">Cargando...</p>}
          {message && <p className="error">{message}</p>}

          {game && (
            <div className="game-detail-card">
              <img
                src={game.img || "/placeholder.jpg"}
                alt={game.title}
                className="game-detail-image"
              />

              <div className="game-detail-info">
                <h1 className="game-detail-title">{game.title}</h1>
                <span
                    className={`favorite-btn ${isFavorite ? "active" : ""}`}
                    onClick={toggleFavorite}>
                    ♥
                  </span> 

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

            {user && (
              <form className="review-form" onSubmit={handleReviewSubmit}>
                <div className="review-stars">
                  {[1, 2, 3, 4, 5].map((num) => (
                    <span
                      key={num}
                      className={num <= rating ? "star filled" : "star"}
                      onClick={() => setRating(num)}
                    >
                      ★
                    </span>
                  ))}
                </div>
                <textarea
                  placeholder="Escribe tu reseña..."
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                />
                <button type="submit">Publicar reseña</button>
              </form>
            )}

            {reviews.length > 0 ? (
              reviews.map((r, i) => (
                <div key={i} className="review-card">
                  <p className="review-user">👤 {r.user?.username || "Anónimo"}</p>
                  <div className="review-rating">{renderStars(r.rating)}</div>
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
