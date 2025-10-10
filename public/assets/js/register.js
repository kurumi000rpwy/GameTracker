// Inputs
const form = document.getElementById('form');
const user = document.getElementById('username');
const email = document.getElementById('email');
const pass = document.getElementById('password');
const confirm = document.getElementById('confirm');

const userError = document.getElementById('userError');
const emailError = document.getElementById('emailError');
const passError = document.getElementById('passError');
const confirmError = document.getElementById('confirmError');
const result = document.getElementById('result');

// Mostrar / ocultar contraseña
document.getElementById('togglePwd').onclick = () => {
  pass.type = pass.type === 'password' ? 'text' : 'password';
};
document.getElementById('toggleConfirm').onclick = () => {
  confirm.type = confirm.type === 'password' ? 'text' : 'password';
};

// Validaciones
const userRegex = /^[A-Za-z0-9\-.]{6,19}$/;
const passRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z0-9]).{8,32}$/;

form.addEventListener('submit', e => {
  e.preventDefault();
  let ok = true;

  // Reset errores
  userError.textContent = '';
  emailError.textContent = '';
  passError.textContent = '';
  confirmError.textContent = '';
  result.textContent = '';

  // Validar usuario
  if (!userRegex.test(user.value)) {
    userError.textContent = 'Nombre inválido (6–19 caracteres, sin símbolos raros)';
    ok = false;
  }

  // Validar email
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.value)) {
    emailError.textContent = 'Correo inválido';
    ok = false;
  }

  // Validar contraseña
  if (!passRegex.test(pass.value)) {
    passError.textContent = 'Contraseña insegura';
    ok = false;
  }

  // Confirmar contraseña
  if (pass.value !== confirm.value) {
    confirmError.textContent = 'No coinciden';
    ok = false;
  }

  if (!ok) return;

  result.textContent = 'Formulario validado correctamente ✅';
});

// Botón limpiar
document.getElementById('clearBtn').onclick = () => {
  form.reset();
  result.textContent = '';
  userError.textContent = emailError.textContent = passError.textContent = confirmError.textContent = '';
};
