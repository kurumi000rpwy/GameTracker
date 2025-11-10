import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./assets/css/Games.css";

export default function Games() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [games, setGames] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [message, setMessage] = useState("");
  const navigate = useNavigate(); // 👈 para redirigir
  const [user, setUser] = useState(null);

  useEffect(() => {
    fetchGames(page);
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser)); // Guardamos el usuario en el estado
    }
    }, [page]);
  
  async function fetchGames(p) {
    try {
      const res = await fetch(`/api/games?page=${p}`);
      const data = await res.json();

      if (!data.success) {
        setGames([]);
        setMessage(data.message || "No se pudieron cargar los juegos");
        setTotalPages(1);
        return;
      }

      setGames(data.games);
      setTotalPages(data.totalPages);
      setMessage("");
    } catch {
      setMessage("Error al cargar los juegos");
    }
  }

  // 👇 cuando se hace clic en una tarjeta, redirige a /games/:id
  function handleGameClick(id) {
    navigate(`/games/${id}`);
  }
 
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
  return (
    <div className="app">
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

      <main className="main">
        <header className="navbar">
          <div className="nav-left">
            <button
              className="hamburger"
              onClick={() => setSidebarOpen(true)}
            >
              ☰
            </button>
          </div>

          <div className="nav-center">
            <input
              className="search"
              type="text"
              placeholder="Buscar..."
            />
          </div>

          <div className="nav-right">
		{!user ? (
              // 👇 Si NO hay usuario, muestra login y registro
              <>
                <Link to="/login" className="btn auth">Iniciar sesión</Link>
                <Link to="/register" className="btn register">Registro</Link>
              </>
            ) : (
              // 👇 Si hay usuario, muestra su nombre y botón de salir
              <>
                <span className="h3">Hola, {user.username}</span>
                <button onClick={handleLogout} className="btn logout">Cerrar sesión</button>
              </>
            )}
        </div>
        </header>

        <section className="games-section">
          <h1 className="games-title">Explora los juegos</h1>

          <div className="games-grid">
            {games.length > 0 ? (
              games.map((g, i) => (
                <div
                  key={i}
                  className="game-card"
                  onClick={() => handleGameClick(g.title)} //  evento de clic
                >
                  <img
                    src={g.img}
                    alt={g.title}
                  />
                  <h3>{g.title}</h3>
                  <p>{g.genre}</p>
                </div>
              ))
            ) : (
              <p className="games-message">{message || "Cargando juegos..."}</p>
            )}
          </div>

          {games.length > 0 && (
            <div className="pagination">
              <button
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page === 1}
              >
                Anterior
              </button>

              <span>Página {page} de {totalPages}</span>

              <button
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                disabled={page === totalPages}
              >
                Siguiente
              </button>
            </div>
          )}
        </section>
      </main>
    </div>
  );
}
