import React, { useState } from "react";
import { Link } from "react-router-dom";
import "./assets/css/AddGame.css";
import "./assets/css/Home.css";

function AddGame() {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    genre: [],
    platform: [],
    img: "",
    releaseDate: "",
  });

  const [message, setMessage] = useState("");

  const genres = [
    "Acción", "Aventura", "Battle Royale", "Disparos", "Mundo abierto", "Rol", "Supervivencia",
    "Deportes", "Carreras", "Estrategia", "Lucha", "Plataforma", "Terror", "Simulación",
    "MOBA", "MMORPG", "Sandbox", "Puzzle", "Shooter táctico", "Casual"
  ];

  const platforms = [
    "PC", "PlayStation 5", "PlayStation 4", "Xbox Series X / S",
    "Nintendo Switch", "Android", "iOS", "Steam Deck"
  ];

  // --- Manejar cambios en inputs normales ---
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  // --- Seleccionar o deseleccionar tarjetas ---
  const toggleSelect = (field, value) => {
    setFormData(prev => {
      const selected = new Set(prev[field]);
      selected.has(value) ? selected.delete(value) : selected.add(value);
      return { ...prev, [field]: Array.from(selected) };
    });
  };

  // --- Enviar formulario ---
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.title || !formData.description || !formData.img) {
      setMessage("⚠️ Faltan campos obligatorios.");
      return;
    }

    try {
      const response = await fetch("http://localhost:8080/adminz/add/game", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (data.success) {
        setMessage("✅ Juego agregado exitosamente.");
        setFormData({
          title: "",
          description: "",
          genre: [],
          platform: [],
          img: "",
          releaseDate: "",
        });
      } else {
        setMessage("❌ " + (data.message || "Error al agregar el juego."));
      }
    } catch (error) {
      console.error(error);
      setMessage("❌ Error de conexión con el servidor.");
    }
  };

  return (
    <div className="addgame-page">
      <header className="navbar">
        <Link to="/" className="logo">SPECTRA</Link>
        <nav>
          <Link to="/">Inicio</Link>
          <Link to="/games">Explorar</Link>
          <Link to="/adminz">Panel</Link>
        </nav>
      </header>

      <main className="container">
        <h1>Agregar un nuevo juego 🎮</h1>

        {message && <p className="message">{message}</p>}

        <form onSubmit={handleSubmit} className="addgame-form">
          <div className="field">
            <label>Título</label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              placeholder="Ej: The Witcher 3"
              required
            />
          </div>

          <div className="field">
            <label>Descripción</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              minLength={16}
              maxLength={1000}
              required
            />
          </div>

          <div className="field">
            <label>Género(s)</label>
            <div className="cards-container">
              {genres.map((g) => (
                <div
                  key={g}
                  className={`card ${formData.genre.includes(g) ? "selected" : ""}`}
                  onClick={() => toggleSelect("genre", g)}
                >
                  {g}
                </div>
              ))}
            </div>
          </div>

          <div className="field">
            <label>Plataforma(s)</label>
            <div className="cards-container">
              {platforms.map((p) => (
                <div
                  key={p}
                  className={`card ${formData.platform.includes(p) ? "selected" : ""}`}
                  onClick={() => toggleSelect("platform", p)}
                >
                  {p}
                </div>
              ))}
            </div>
          </div>

          <div className="field">
            <label>Imagen (URL)</label>
            <input
              type="url"
              name="img"
              value={formData.img}
              onChange={handleChange}
              placeholder="https://..."
              required
            />
          </div>

          <div className="field">
            <label>Fecha de lanzamiento</label>
            <input
              type="date"
              name="releaseDate"
              value={formData.releaseDate}
              onChange={handleChange}
            />
          </div>

          <button type="submit">Agregar juego</button>
        </form>
      </main>
    </div>
  );
}

export default AddGame;
