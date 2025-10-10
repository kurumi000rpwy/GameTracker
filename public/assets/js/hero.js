document.addEventListener("DOMContentLoaded", () => {
  // --- SLIDESHOW ---
  const images = [
    "./assets/img/hero/halo.jpg",
    "./assets/img/hero/apex.jpg",
    "./assets/img/hero/hollow.jpg",
    "./assets/img/hero/lol.jpg",
    "./assets/img/hero/cyberpunk.jpg"
  ];

  let current = 0;
  const heroImg = document.getElementById("hero-img");

  setInterval(() => {
    current = (current + 1) % images.length;
    heroImg.style.opacity = 0;
    setTimeout(() => {
      heroImg.src = images[current];
      heroImg.style.opacity = 1;
    }, 1000);
  }, 3000);

  // --- TEXTO ANIMADO ---
  const phrases = [
    "Ve tus videojuegos favoritos",
    "Tu mejor lugar",
    "Donde puedes opinar sobre tus videojuegos"
  ];

  const typedText = document.getElementById("typed-text");
  let phraseIndex = 0;
  let letterIndex = 0;
  let deleting = false;

  function typeEffect() {
    const currentPhrase = phrases[phraseIndex];

    if (!deleting && letterIndex <= currentPhrase.length) {
      typedText.textContent = currentPhrase.substring(0, letterIndex++);
      setTimeout(typeEffect, 100);
    } else if (deleting && letterIndex >= 0) {
      typedText.textContent = currentPhrase.substring(0, letterIndex--);
      setTimeout(typeEffect, 50);
    } else if (!deleting && letterIndex > currentPhrase.length) {
      deleting = true;
      setTimeout(typeEffect, 2000); // espera antes de borrar
    } else if (deleting && letterIndex < 0) {
      deleting = false;
      phraseIndex = (phraseIndex + 1) % phrases.length;
      setTimeout(typeEffect, 200);
    }
  }

  // Iniciar el efecto después de que aparezca "Spectra:"
  setTimeout(typeEffect, 2500);
});
