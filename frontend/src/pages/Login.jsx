import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./assets/css/Register.css"; // usa el mismo CSS que ya tienes

export default function Login() {
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [remember, setRemember] = useState(false);
  const [showPwd, setShowPwd] = useState(false);
  const [errors, setErrors] = useState({});
  const [resultMsg, setResultMsg] = useState("");

  const navigate = useNavigate();

  function validate() {
    const newErrors = {};
    if (!identifier.trim()) newErrors.identifier = "Ingresa tu usuario o correo";
    if (!password.trim()) newErrors.password = "Ingresa tu contraseña";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }

  async function handleSubmit(e) {
    e.preventDefault();
    if (!validate()) return;

    try {
      const res = await fetch("https://spectra-8r7j.onrender.com/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
	credentials: "include",
        body: JSON.stringify({ identifier, password, remember }),
      });
      const data = await res.json();

      if (data.success) {
        setResultMsg("Inicio de sesión exitoso ✅");
        localStorage.setItem("user", JSON.stringify(data.user));
        setTimeout(() => {
		if(data.user.username === "adminz" || data.user.email === "adminz@spectra.com"){
			navigate("/adminz");
		}else{
			navigate("/dashboard");
		}

	}, 1000);
      } else {
        setResultMsg(data.message || "Credenciales incorrectas ❌");
      }
    } catch {
      setResultMsg("Error al conectar con el servidor");
    }
  }

  function handleClear() {
    setIdentifier("");
    setPassword("");
    setRemember(false);
    setErrors({});
    setResultMsg("");
  }

  return (
    <main className="container">
      <section className="form-box">
        <header>
          <p className="tag">SPECTRA ID</p>
          <h1>Inicia sesión</h1>
          <p className="subtitle">Accede a tus reseñas y progreso sincronizado.</p>
        </header>

        <form onSubmit={handleSubmit}>
          <div className="field">
            <label htmlFor="identifier">Usuario o correo electrónico</label>
            <input
              id="identifier"
              name="identifier"
              type="text"
              value={identifier}
              onChange={(e) => setIdentifier(e.target.value)}
              placeholder="usuario o nombre@correo.com"
            />
            {errors.identifier && <small className="error">{errors.identifier}</small>}
          </div>

          <div className="field">
            <label htmlFor="password">Contraseña</label>
            <div className="password-box">
              <input
                id="password"
                name="password"
                type={showPwd ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Tu contraseña"
              />
              <button
                type="button"
                className="eye"
                id="togglePwd"
                onClick={() => setShowPwd(!showPwd)}
              >
                {showPwd ? "🙈" : "👁️"}
              </button>
            </div>
            {errors.password && <small className="error">{errors.password}</small>}
          </div>

          <div className="checkbox">
            <input
              id="remember"
              name="remember"
              type="checkbox"
              checked={remember}
              onChange={(e) => setRemember(e.target.checked)}
            />
            <label htmlFor="remember">Recordarme en este equipo</label>
          </div>

          <div className="buttons">
            <button type="button" id="clearBtn" onClick={handleClear}>
              Limpiar
            </button>
            <button type="submit">Ingresar</button>
          </div>

          {resultMsg && <p className="msg">{resultMsg}</p>}
        </form>

        <footer>
          <p>
            ¿No tienes cuenta? <Link to="/register">Crea una aquí</Link>
          </p>
        </footer>
      </section>
    </main>
  );
}
