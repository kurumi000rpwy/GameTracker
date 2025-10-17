// =======================
// Prevención de XSS
// =======================
function sanitizeInput(value) {
  const div = document.createElement('div');
  div.textContent = value;
  return div.innerHTML.trim();
}

// =======================
// Elementos del DOM
// =======================
const form = document.getElementById('loginForm');
const identifier = document.getElementById('identifier');
const password = document.getElementById('password');
const identifierError = document.getElementById('identifierError');
const passwordError = document.getElementById('passwordError');
const result = document.getElementById('result');
const togglePwd = document.getElementById('togglePwd');
const clearBtn = document.getElementById('clearBtn');

// =======================
// Mostrar / Ocultar contraseña
// =======================
togglePwd.addEventListener('click', () => {
  password.type = password.type === 'password' ? 'text' : 'password';
});

// =======================
// Limpiar campos
// =======================
clearBtn.addEventListener('click', () => {
  identifier.value = '';
  password.value = '';
  identifierError.textContent = '';
  passwordError.textContent = '';
  result.textContent = '';
});

// =======================
// Validación y envío
// =======================
form.addEventListener('submit', async (e) => {
  e.preventDefault();

  // Sanitizar valores
  const cleanIdentifier = sanitizeInput(identifier.value);
  const cleanPassword = sanitizeInput(password.value);

  // Limpiar errores previos
  identifierError.textContent = '';
  passwordError.textContent = '';
  result.textContent = '';

  let valid = true;

  // Detectar si es correo o username
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  if (!cleanIdentifier) {
    identifierError.textContent = 'Debes ingresar tu usuario o correo.';
    valid = false;
  } else if (!emailRegex.test(cleanIdentifier) && cleanIdentifier.length < 3) {
    identifierError.textContent = 'Usuario o correo inválido.';
    valid = false;
  }

  if (!cleanPassword) {
    passwordError.textContent = 'Debes ingresar tu contraseña.';
    valid = false;
  }

  if (!valid) return;

  // =======================
  // Envío al servidor
  // =======================
  try {
    const response = await fetch('/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        identifier: cleanIdentifier,
        password: cleanPassword,
      }),
    });

    const data = await response.json();

    if (data.success) {
      result.style.color = 'green';
      result.textContent = 'Inicio de sesión exitoso. Redirigiendo...';
      setTimeout(() => window.location.href = '/dashboard', 1500);
    } else {
      result.style.color = 'red';
      result.textContent = data.message || 'Credenciales incorrectas.';
    }
  } catch (err) {
    result.style.color = 'red';
    result.textContent = 'Error al conectar con el servidor.';
  }
});
