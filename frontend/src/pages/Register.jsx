import React, { useState } from "react";
import "./assets/css/Register.css";

const Register = () => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [showPwd, setShowPwd] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const [errors, setErrors] = useState({});
  const [result, setResult] = useState("");

  const userRegex = /^[A-Za-z0-9\-.]{6,19}$/;
  const passRegex =
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z0-9]).{8,32}$/;

  const handleSubmit = (e) => {
    e.preventDefault();
    const newErrors = {};

    if (!userRegex.test(username)) {
      newErrors.username =
        "Nombre inválido (6–19 caracteres, sin símbolos raros)";
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      newErrors.email = "Correo inválido";
    }

    if (!passRegex.test(password)) {
      newErrors.password = "Contraseña insegura";
    }

    if (password !== confirm) {
      newErrors.confirm = "No coinciden";
    }

    setErrors(newErrors);

    if (Object.keys(newErrors).length === 0) {
      setResult("Registro exitoso ✅");
      // Aquí podrías hacer fetch('/register', { method: 'POST', body: ... })
    } else {
      setResult("");
    }
  };

  const handleClear = () => {
    setUsername("");
    setEmail("");
    setPassword("");
    setConfirm("");
    setErrors({});
    setResult("");
  };

  return (
    <main className="container">
      <section className="form-box">
        <header>
          <p className="tag">SPECTRA ID</p>
          <h1>Crea tu perfil</h1>
          <p className="subtitle">
            Desbloquea tus reseñas y progreso sincronizado.
          </p>
        </header>

        <form id="form" onSubmit={handleSubmit}>
          <div className="field">
            <label htmlFor="username">Nombre de usuario</label>
            <input
              id="username"
              name="username"
              type="text"
              placeholder="Elige un alias"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
            <small className="error">{errors.username}</small>
          </div>

          <div className="field">
            <label htmlFor="email">Correo electrónico</label>
            <input
              id="email"
              name="email"
              type="email"
              placeholder="nombre@ejemplo.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <small className="error">{errors.email}</small>
          </div>

          <div className="field">
            <label htmlFor="password">Contraseña</label>
            <div className="password-box">
              <input
                id="password"
                name="password"
                type={showPwd ? "text" : "password"}
                placeholder="Mínimo 8 caracteres"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <button
                type="button"
                className="eye"
                onClick={() => setShowPwd(!showPwd)}
              >
                {showPwd ? "👁️‍🗨️" : "👁️"}
              </button>
            </div>
            <small className="error">{errors.password}</small>
          </div>

          <div className="field">
            <label htmlFor="confirm">Confirmar contraseña</label>
            <div className="password-box">
              <input
                id="confirm"
                type={showConfirm ? "text" : "password"}
                placeholder="Repite la contraseña"
                value={confirm}
                onChange={(e) => setConfirm(e.target.value)}
              />
              <button
                type="button"
                className="eye"
                onClick={() => setShowConfirm(!showConfirm)}
              >
                {showConfirm ? "👁️‍🗨️" : "👁️"}
              </button>
            </div>
            <small className="error">{errors.confirm}</small>
          </div>

          <div className="checkbox">
            <input id="remember" type="checkbox" />
            <label htmlFor="remember">Recordarme en este equipo</label>
          </div>

          <div className="buttons">
            <button type="button" onClick={handleClear}>
              Limpiar
            </button>
            <button type="submit">Guardar</button>
          </div>

          <p className="msg">{result}</p>
        </form>

        <footer>
          <p>
            ¿Ya tienes cuenta? <a href="#">Inicia sesión</a>
          </p>
        </footer>
      </section>
    </main>
  );
};

export default Register;
