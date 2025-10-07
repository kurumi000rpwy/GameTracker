// app.js
// TODO: Actualizar semillas y reglas de negocio según la versión final del producto.

const STORAGE_KEYS = {
  user: 'pm_user',
  games: 'pm_games',
  reviewsPrefix: 'pm_reviews-'
};

const PLACEHOLDER_COVER = 'assets/cover-generic.svg';

const SEED_GAMES = [
  {
    id: 'game-nebula',
    title: 'Nebula Quest',
    cover: 'https://picsum.photos/seed/nebulaquest/600/400',
    genre: 'RPG',
    platforms: ['pc', 'ps'],
    progress: 48,
    summary: 'Explora galaxias procedurales y descubre civilizaciones perdidas.',
    description:
      'Nebula Quest combina exploración espacial, narrativa ramificada y gestión de recursos. Atraviesa sistemas estelares, establece alianzas con facciones dinámicas y resuelve misterios cósmicos que alterarán el destino de la galaxia.',
    createdAt: '2024-01-12T09:24:00.000Z',
    updatedAt: '2024-01-12T09:24:00.000Z'
  },
  {
    id: 'game-cyber',
    title: 'Cyber Drift',
    cover: 'https://picsum.photos/seed/cyberdrift/600/400',
    genre: 'Acción',
    platforms: ['pc', 'xbox'],
    progress: 65,
    summary: 'Carreras antigravitatorias con batallas neon en circuitos verticales.',
    description:
      'Domina la ciudad vertical de Neo-Lumen en carreras ilegales, desbloquea mejoras modulares para tu vehículo y forma alianzas con clanes rivales en un mundo ciberpunk lleno de secretos.',
    createdAt: '2024-02-18T15:42:00.000Z',
    updatedAt: '2024-03-01T12:15:00.000Z'
  },
  {
    id: 'game-mythic',
    title: 'Mythic Tactics',
    cover: 'https://picsum.photos/seed/mythictactics/600/400',
    genre: 'Estrategia',
    platforms: ['pc', 'switch'],
    progress: 22,
    summary: 'Combina héroes legendarios en batallas tácticas por turnos con climas dinámicos.',
    description:
      'Construye tu escuadrón con héroes mitológicos, domina un sistema de sinergias elementales y supera campañas cooperativas con rejugabilidad infinita gracias al generador de mapas.',
    createdAt: '2024-03-09T11:00:00.000Z',
    updatedAt: '2024-03-15T09:30:00.000Z'
  },
  {
    id: 'game-ocean',
    title: "Ocean's Echo",
    cover: 'https://picsum.photos/seed/oceansecho/600/400',
    genre: 'Aventura',
    platforms: ['ps', 'switch'],
    progress: 10,
    summary: 'Sumérgete en ruinas submarinas y guía a tu tripulación hacia tesoros olvidados.',
    description:
      'Navega un archipiélago cambiante, construye tu base flotante y resuelve acertijos inspirados en la física del agua mientras enfrentas criaturas colosales en profundidades luminosas.',
    createdAt: '2024-04-21T18:10:00.000Z',
    updatedAt: '2024-04-21T18:10:00.000Z'
  },
  {
    id: 'game-sky',
    title: 'Skybound Arena',
    cover: 'https://picsum.photos/seed/skyboundarena/600/400',
    genre: 'Indie',
    platforms: ['pc', 'mobile'],
    progress: 72,
    summary: 'Combates roguelike en islas flotantes con un sistema de combos aéreos.',
    description:
      'Sobrevive a arenas generadas proceduralmente, desbloquea artefactos gravitacionales y comparte desafíos diarios con amigos en esta experiencia cooperativa rápida.',
    createdAt: '2024-05-02T10:05:00.000Z',
    updatedAt: '2024-05-02T10:05:00.000Z'
  }
];

const GENRE_LABELS = {
  RPG: 'RPG',
  Acción: 'Acción',
  Estrategia: 'Estrategia',
  Aventura: 'Aventura',
  Indie: 'Indie'
};

const PLATFORM_LABELS = {
  pc: 'PC',
  ps: 'PlayStation',
  xbox: 'Xbox',
  switch: 'Switch',
  mobile: 'Mobile'
};

const state = {
  games: [],
  filters: {
    search: '',
    genre: 'all',
    platform: 'all',
    sort: 'recent'
  }
};

let currentUser = null;

const statusRegion = document.getElementById('statusRegion');
const yearCopy = document.getElementById('yearCopy');

function qs(selector, scope = document) {
  return scope.querySelector(selector);
}

function qsa(selector, scope = document) {
  return Array.from(scope.querySelectorAll(selector));
}

function uid(prefix = 'id') {
  return `${prefix}-${Math.random().toString(36).slice(2, 8)}-${Date.now().toString(36)}`;
}

function formatPercent(value) {
  return `${Math.round(Number(value) || 0)}%`;
}

function announce(message) {
  if (!statusRegion) return;
  statusRegion.textContent = message;
}

let fallbackDialogBackdrop = null;

function ensureFallbackDialogBackdrop() {
  if (fallbackDialogBackdrop) return fallbackDialogBackdrop;
  const backdrop = document.createElement('div');
  backdrop.className = 'dialog__backdrop-fallback';
  backdrop.hidden = true;
  document.body.append(backdrop);
  fallbackDialogBackdrop = backdrop;
  return backdrop;
}

function openDialog(dialog) {
  if (!dialog) return;

  const fallbackBackdrop = ensureFallbackDialogBackdrop();

  const showWithNativeAPI = () => {
    if (typeof dialog.showModal === 'function') {
      try {
        dialog.showModal();
        return true;
      } catch (error) {
        console.warn('No se pudo abrir el diálogo con showModal, se usará un modo alternativo.', error);
      }
    }
    return false;
  };

  const openedWithNative = showWithNativeAPI();

  if (!openedWithNative) {
    dialog.setAttribute('open', '');
    dialog.dataset.openFallback = 'true';
    fallbackBackdrop.hidden = false;
    document.body.classList.add('is-dialog-open');
    const handleKeydown = (event) => {
      if (event.key === 'Escape') {
        event.preventDefault();
        closeDialog(dialog);
      }
    };
    dialog._fallbackKeyHandler = handleKeydown;
    document.addEventListener('keydown', handleKeydown);
    const handleClick = () => {
      closeDialog(dialog);
    };
    fallbackBackdrop.addEventListener('click', handleClick, { once: true });
  } else {
    dialog.dataset.openFallback = 'false';
  }
}

function closeDialog(dialog, returnValue = '') {
  if (!dialog) return;

  const fallbackBackdrop = ensureFallbackDialogBackdrop();

  if (dialog.dataset.openFallback === 'true') {
    dialog.removeAttribute('open');
    dialog.dataset.openFallback = 'false';
    fallbackBackdrop.hidden = true;
    document.body.classList.remove('is-dialog-open');
    if (dialog._fallbackKeyHandler) {
      document.removeEventListener('keydown', dialog._fallbackKeyHandler);
      delete dialog._fallbackKeyHandler;
    }
    dialog.returnValue = returnValue;
    return;
  }

  if (typeof dialog.close === 'function') {
    try {
      dialog.close(returnValue);
    } catch (error) {
      console.warn('No se pudo cerrar el diálogo con close(), se usará un modo alternativo.', error);
      dialog.removeAttribute('open');
    }
  } else {
    dialog.removeAttribute('open');
  }
  fallbackBackdrop.hidden = true;
  document.body.classList.remove('is-dialog-open');
}

function getStore(key, fallback = null) {
  try {
    const stored = localStorage.getItem(key);
    if (!stored) return fallback;
    return JSON.parse(stored);
  } catch (error) {
    console.error('Error reading storage', error);
    return fallback;
  }
}

function setStore(key, value) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (error) {
    console.error('Error writing storage', error);
    announce('No se pudo guardar la información. Revisa el almacenamiento del navegador.');
  }
}

function removeStore(key) {
  try {
    localStorage.removeItem(key);
  } catch (error) {
    console.error('Error clearing storage', error);
  }
}

function ensureSeedGames() {
  const existing = getStore(STORAGE_KEYS.games, []);
  if (!existing || existing.length === 0) {
    setStore(STORAGE_KEYS.games, SEED_GAMES);
  }
}

function loadGames() {
  state.games = getStore(STORAGE_KEYS.games, []);
}

function buildReviewsIndex() {
  const index = new Map();
  for (const game of state.games) {
    const reviews = getReviewsForGame(game.id);
    const total = reviews.reduce((sum, review) => sum + review.rating, 0);
    const average = reviews.length ? total / reviews.length : 0;
    index.set(game.id, {
      count: reviews.length,
      average,
      latest: reviews
        .slice()
        .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
        .slice(0, 1)[0] || null
    });
  }
  return index;
}

function getReviewsForGame(gameId) {
  return getStore(`${STORAGE_KEYS.reviewsPrefix}${gameId}`, []);
}

function saveReviewsForGame(gameId, reviews) {
  setStore(`${STORAGE_KEYS.reviewsPrefix}${gameId}`, reviews);
}

function renderLibrary() {
  const container = qs('#libraryGrid');
  if (!container) return;
  container.innerHTML = '';

  const reviewsIndex = buildReviewsIndex();
  const filtered = filterGames(state.games, state.filters, reviewsIndex);
  const sorted = sortGames(filtered, state.filters.sort, reviewsIndex);

  if (sorted.length === 0) {
    const empty = document.createElement('p');
    empty.className = 'library__empty';
    empty.textContent = 'Aún no hay juegos que coincidan con tu búsqueda. Agrega uno nuevo.';
    container.append(empty);
  } else {
    for (const game of sorted) {
      const card = createGameCard(game, reviewsIndex.get(game.id));
      container.append(card);
    }
  }

  renderRecentGames(reviewsIndex);
  renderMyReviews();
}

function filterGames(games, filters, reviewsIndex) {
  return games.filter((game) => {
    const matchesSearch = game.title.toLowerCase().includes(filters.search.toLowerCase());
    const matchesGenre = filters.genre === 'all' || game.genre === filters.genre;
    const matchesPlatform =
      filters.platform === 'all' || (Array.isArray(game.platforms) && game.platforms.includes(filters.platform));
    return matchesSearch && matchesGenre && matchesPlatform;
  });
}

function sortGames(games, sortKey, reviewsIndex) {
  const sorted = games.slice();
  if (sortKey === 'rating') {
    sorted.sort((a, b) => {
      const aRating = reviewsIndex.get(a.id)?.average ?? 0;
      const bRating = reviewsIndex.get(b.id)?.average ?? 0;
      return bRating - aRating;
    });
  } else if (sortKey === 'progress') {
    sorted.sort((a, b) => Number(b.progress) - Number(a.progress));
  } else {
    sorted.sort((a, b) => new Date(b.updatedAt || b.createdAt).getTime() - new Date(a.updatedAt || a.createdAt).getTime());
  }
  return sorted;
}

function createGameCard(game, reviewsInfo) {
  const article = document.createElement('article');
  article.className = 'card';
  article.setAttribute('role', 'listitem');

  const media = document.createElement('div');
  media.className = 'card__media';
  const img = document.createElement('img');
  img.src = game.cover || PLACEHOLDER_COVER;
  img.alt = `Portada del juego ${game.title}`;
  media.append(img);

  const header = document.createElement('div');
  header.className = 'card__header';

  const title = document.createElement('h2');
  title.className = 'card__title';
  title.textContent = game.title;
  header.append(title);

  const menuButton = document.createElement('button');
  menuButton.className = 'btn btn-ghost';
  menuButton.type = 'button';
  menuButton.innerHTML = '<svg class="icon" aria-hidden="true"><use href="#icon-dots"></use></svg><span class="sr-only">Menú contextual</span>';
  menuButton.addEventListener('click', () => {
    announce(`Acciones rápidas para ${game.title} próximamente.`);
  });
  header.append(menuButton);

  const body = document.createElement('div');
  body.className = 'card__body';

  const meta = document.createElement('div');
  meta.className = 'card__meta';
  meta.innerHTML = `
    <span class="badge">${GENRE_LABELS[game.genre] || game.genre}</span>
    ${game.platforms
      .map((platform) => `<span class="badge">${PLATFORM_LABELS[platform] || platform}</span>`)
      .join(' ')}
  `;

  const summary = document.createElement('p');
  summary.className = 'card__summary';
  summary.textContent = game.summary || game.description || '';

  const progress = document.createElement('div');
  progress.className = 'progress';
  progress.innerHTML = `
    <span class="progress__label">Progreso: <strong>${formatPercent(game.progress)}</strong></span>
    <div class="progress__track"><div class="progress__bar" style="width:${Math.min(Number(game.progress) || 0, 100)}%"></div></div>
  `;

  const ratingContainer = document.createElement('div');
  ratingContainer.className = 'rating';
  const average = reviewsInfo?.average ?? 0;
  ratingContainer.append(createStaticRating(average));
  const reviewsCount = document.createElement('span');
  reviewsCount.textContent = reviewsInfo?.count ? `${reviewsInfo.count} reseñas` : 'Sin reseñas';
  reviewsCount.className = 'progress__label';
  ratingContainer.append(reviewsCount);

  const actions = document.createElement('div');
  actions.className = 'card__actions';
  const viewButton = document.createElement('button');
  viewButton.type = 'button';
  viewButton.className = 'btn btn-primary';
  viewButton.textContent = 'Ver detalles';
  viewButton.setAttribute('aria-label', `Ver detalles del juego ${game.title} (disponible próximamente)`);
  viewButton.addEventListener('click', () => {
    announce('La página de detalle estará disponible en una próxima versión.');
  });
  actions.append(viewButton);

  body.append(meta, summary, progress, ratingContainer, actions);

  article.append(media, header, body);
  return article;
}

function createStaticRating(value) {
  const wrapper = document.createElement('div');
  wrapper.className = 'rating__stars';
  wrapper.setAttribute('role', 'img');
  wrapper.setAttribute('aria-label', `Valoración promedio ${value.toFixed(1)} de 5`);

  for (let i = 1; i <= 5; i += 1) {
    const star = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    star.setAttribute('class', 'rating__star');
    star.setAttribute('aria-hidden', 'true');
    star.setAttribute('focusable', 'false');
    star.innerHTML = `<use href="#icon-star" />`;
    star.style.color = i <= Math.round(value) ? 'var(--color-accent)' : 'rgba(255, 255, 255, 0.1)';
    wrapper.append(star);
  }

  const label = document.createElement('span');
  label.className = 'sr-only';
  label.textContent = `${value.toFixed(1)} sobre 5`;
  wrapper.append(label);
  return wrapper;
}

function renderRecentGames(reviewsIndex) {
  const list = qs('#recentGamesList');
  if (!list) return;
  list.innerHTML = '';

  const recent = state.games
    .slice()
    .sort((a, b) => new Date(b.updatedAt || b.createdAt).getTime() - new Date(a.updatedAt || a.createdAt).getTime())
    .slice(0, 4);

  if (recent.length === 0) {
    const item = document.createElement('li');
    item.className = 'panel__item';
    item.textContent = 'Agrega tu primer juego para verlo aquí.';
    list.append(item);
    return;
  }

  for (const game of recent) {
    const item = document.createElement('li');
    item.className = 'panel__item';
    const title = document.createElement('strong');
    title.textContent = game.title;
    const meta = document.createElement('small');
    const reviewsInfo = reviewsIndex.get(game.id);
    const avg = reviewsInfo?.average ?? 0;
    meta.textContent = `${formatPercent(game.progress)} completado · ${reviewsInfo?.count || 0} reseñas · Promedio ${avg.toFixed(1)}`;
    item.append(title, meta);
    list.append(item);
  }
}

function renderMyReviews() {
  const list = qs('#myReviewsList');
  if (!list) return;
  list.innerHTML = '';

  if (!currentUser) {
    const item = document.createElement('li');
    item.className = 'panel__item';
    item.textContent = 'Inicia sesión para ver tus reseñas.';
    list.append(item);
    return;
  }

  const allReviews = collectAllReviews().filter((review) => review.userId === currentUser.id);
  if (allReviews.length === 0) {
    const item = document.createElement('li');
    item.className = 'panel__item';
    item.textContent = 'Aún no has dejado reseñas.';
    list.append(item);
    return;
  }

  const sorted = allReviews.sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );

  for (const review of sorted.slice(0, 4)) {
    const item = document.createElement('li');
    item.className = 'panel__item';
    const title = document.createElement('strong');
    const game = state.games.find((g) => g.id === review.gameId);
    title.textContent = game ? game.title : 'Juego desconocido';
    const meta = document.createElement('small');
    meta.textContent = `${new Date(review.createdAt).toLocaleDateString()} · ${review.rating} estrellas`;
    item.append(title, meta);
    list.append(item);
  }
}

function collectAllReviews() {
  const reviews = [];
  for (let index = 0; index < localStorage.length; index += 1) {
    const key = localStorage.key(index);
    if (key && key.startsWith(STORAGE_KEYS.reviewsPrefix)) {
      const stored = getStore(key, []);
      if (Array.isArray(stored)) {
        reviews.push(...stored);
      }
    }
  }
  return reviews;
}

function initFilters() {
  const searchInput = qs('#searchInput');
  const genreFilter = qs('#genreFilter');
  const platformFilter = qs('#platformFilter');
  const sortOrder = qs('#sortOrder');

  if (searchInput) {
    searchInput.addEventListener('input', (event) => {
      state.filters.search = event.target.value.trim();
      renderLibrary();
    });
  }

  if (genreFilter) {
    genreFilter.addEventListener('change', (event) => {
      state.filters.genre = event.target.value;
      renderLibrary();
    });
  }

  if (platformFilter) {
    platformFilter.addEventListener('change', (event) => {
      state.filters.platform = event.target.value;
      renderLibrary();
    });
  }

  if (sortOrder) {
    sortOrder.addEventListener('change', (event) => {
      state.filters.sort = event.target.value;
      renderLibrary();
    });
  }
}

function initAddGameDialog() {
  const dialog = qs('#gameDialog');
  const form = qs('#gameForm');
  const button = qs('#addGameButton');

  if (!dialog || !form || !button) return;

  button.addEventListener('click', () => {
    form.reset();
    openDialog(dialog);
  });

  qsa('[data-close]', dialog).forEach((closeButton) => {
    closeButton.addEventListener('click', () => closeDialog(dialog));
  });

  form.addEventListener('submit', (event) => {
    event.preventDefault();
    const formData = new FormData(form);
    const title = formData.get('title')?.toString().trim();
    const cover = formData.get('cover')?.toString().trim();
    const genre = formData.get('genre')?.toString();
    const summary = formData.get('summary')?.toString().trim();
    const progressValue = Number(formData.get('progress'));
    const platforms = formData.getAll('platforms').map((value) => value.toString());

    if (!title || !genre || !summary) {
      announce('Completa los campos obligatorios para guardar el juego.');
      return;
    }

    const newGame = {
      id: uid('game'),
      title,
      cover: cover || PLACEHOLDER_COVER,
      genre,
      platforms,
      progress: clampNumber(progressValue, 0, 100),
      summary,
      description: summary,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    state.games.push(newGame);
    setStore(STORAGE_KEYS.games, state.games);
    closeDialog(dialog, 'submit');
    renderLibrary();
    announce(`${title} se agregó a la biblioteca.`);
  });
}

function clampNumber(value, min, max) {
  if (Number.isNaN(Number(value))) return min;
  return Math.min(Math.max(Number(value), min), max);
}

function initAuth() {
  const dialog = qs('#authDialog');
  const form = qs('#authForm');
  const authButton = qs('#authButton');
  const logoutButton = qs('#logoutButton');

  if (authButton) {
    authButton.addEventListener('click', () => {
      if (!dialog) return;
      if (currentUser) {
        qs('#usernameInput', dialog).value = currentUser.username;
        qs('#emailInput', dialog).value = currentUser.email;
      }
      openDialog(dialog);
    });
  }

  if (logoutButton) {
    logoutButton.addEventListener('click', () => {
      currentUser = null;
      removeStore(STORAGE_KEYS.user);
      renderUserGreeting();
      renderMyReviews();
      announce('Sesión cerrada.');
    });
  }

  if (dialog) {
    qsa('[data-close]', dialog).forEach((closeButton) => {
      closeButton.addEventListener('click', () => closeDialog(dialog));
    });
  }

  if (form) {
    form.addEventListener('submit', (event) => {
      event.preventDefault();
      const formData = new FormData(form);
      const username = formData.get('username')?.toString().trim();
      const email = formData.get('email')?.toString().trim();
      const password = formData.get('password')?.toString() ?? '';

      clearFieldError('username');
      clearFieldError('email');
      clearFieldError('password');

      let hasError = false;
      if (!username || username.length < 3) {
        setFieldError('username', 'El nombre debe tener al menos 3 caracteres.');
        hasError = true;
      }

      if (!validateEmail(email)) {
        setFieldError('email', 'Ingresa un correo válido.');
        hasError = true;
      }

      if (!validatePassword(password)) {
        setFieldError('password', 'Debe tener mínimo 10 caracteres, con mayúscula, minúscula, número y símbolo.');
        hasError = true;
      }

      if (hasError) {
        announce('Revisa los campos resaltados.');
        return;
      }

      currentUser = {
        id: currentUser?.id || uid('user'),
        username,
        email
      };
      setStore(STORAGE_KEYS.user, currentUser);
      renderUserGreeting();
      renderMyReviews();
      announce(`Hola, ${username}. Tu perfil se guardó correctamente.`);
      closeDialog(dialog, 'submit');
      form.reset();
    });
  }
}

function validateEmail(email) {
  return !!email && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

// javascript: reglas de contraseña para el registro Spectra
function validatePassword(password) {
  return /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^\w\s]).{10,}$/.test(password);
}

function setFieldError(field, message) {
  const hint = qs(`[data-error-for="${field}"]`);
  if (hint) {
    hint.textContent = message;
  }
}

function clearFieldError(field) {
  const hint = qs(`[data-error-for="${field}"]`);
  if (hint) {
    hint.textContent = '';
  }
}

function renderUserGreeting() {
  const greeting = qs('#userGreeting');
  const authButton = qs('#authButton');
  const logoutButton = qs('#logoutButton');

  if (!greeting || !authButton || !logoutButton) return;

  if (currentUser) {
    greeting.textContent = `Hola, ${currentUser.username}`;
    authButton.textContent = 'Editar perfil';
    logoutButton.hidden = false;
  } else {
    greeting.textContent = 'Hola, invitado';
    authButton.textContent = 'Registrarme';
    logoutButton.hidden = true;
  }
}

function restoreUser() {
  const storedUser = getStore(STORAGE_KEYS.user, null);
  if (storedUser) {
    currentUser = storedUser;
    renderUserGreeting();
  } else {
    currentUser = null;
    renderUserGreeting();
  }
}

function setupYear() {
  if (yearCopy) {
    yearCopy.textContent = new Date().getFullYear();
  }
}

function initSidebarToggle() {
  const toggle = qs('#menuToggle');
  const sidebar = qs('#sidebarNav');
  const backdrop = qs('#sidebarBackdrop');

  if (!toggle || !sidebar || !backdrop) return;

  const closeSidebar = () => {
    sidebar.setAttribute('data-state', 'closed');
    sidebar.setAttribute('hidden', '');
    toggle.setAttribute('aria-expanded', 'false');
    backdrop.hidden = true;
    backdrop.setAttribute('data-state', 'hidden');
  };

  const openSidebar = () => {
    sidebar.setAttribute('data-state', 'open');
    sidebar.removeAttribute('hidden');
    toggle.setAttribute('aria-expanded', 'true');
    backdrop.hidden = false;
    backdrop.setAttribute('data-state', 'visible');
  };

  toggle.addEventListener('click', () => {
    const isOpen = sidebar.getAttribute('data-state') === 'open';
    if (isOpen) {
      closeSidebar();
    } else {
      openSidebar();
    }
  });

  backdrop.addEventListener('click', closeSidebar);

  window.addEventListener('resize', () => {
    if (window.matchMedia(`(min-width: ${getComputedStyle(document.documentElement).getPropertyValue('--bp-md')})`).matches) {
      sidebar.removeAttribute('hidden');
      sidebar.removeAttribute('data-state');
      toggle.setAttribute('aria-expanded', 'false');
      backdrop.hidden = true;
    } else if (sidebar.getAttribute('data-state') !== 'open') {
      sidebar.setAttribute('hidden', '');
    }
  });

  if (window.innerWidth < 768) {
    sidebar.setAttribute('hidden', '');
  }
}

function initLibraryPage() {
  initFilters();
  initAddGameDialog();
  renderLibrary();
}

function initRatingControls(scope = document) {
  const controls = qsa('[data-rating-control]', scope);
  controls.forEach((control) => {
    setupRatingControl(control);
  });
}

function setupRatingControl(control) {
  if (control.dataset.ready === 'true') return;

  const name = control.dataset.name || 'rating';
  const hiddenInput = document.createElement('input');
  hiddenInput.type = 'hidden';
  hiddenInput.name = name;
  hiddenInput.required = true;
  hiddenInput.value = control.dataset.value || '0';

  const slider = document.createElement('div');
  slider.className = 'rating__slider';
  slider.setAttribute('role', 'slider');
  slider.setAttribute('aria-label', 'Seleccionar calificación');
  slider.setAttribute('aria-valuemin', '0');
  slider.setAttribute('aria-valuemax', '5');
  slider.setAttribute('aria-valuenow', hiddenInput.value);
  slider.setAttribute('aria-valuetext', `${hiddenInput.value} estrellas`);
  slider.tabIndex = 0;

  const hint = document.createElement('p');
  hint.className = 'rating__hint';
  hint.textContent = 'Selecciona una calificación de 1 a 5';

  const buttons = [];
  for (let value = 1; value <= 5; value += 1) {
    const button = document.createElement('button');
    button.type = 'button';
    button.dataset.value = value;
    button.setAttribute('aria-label', `${value} estrellas`);
    button.innerHTML = `<svg class="rating__star" aria-hidden="true"><use href="#icon-star"></use></svg>`;
    button.addEventListener('click', () => {
      updateRatingValue(value);
    });
    buttons.push(button);
    slider.append(button);
  }

  slider.addEventListener('keydown', (event) => {
    const current = Number(hiddenInput.value) || 0;
    if (event.key === 'ArrowRight' || event.key === 'ArrowUp') {
      event.preventDefault();
      updateRatingValue(Math.min(current + 1, 5));
    }
    if (event.key === 'ArrowLeft' || event.key === 'ArrowDown') {
      event.preventDefault();
      updateRatingValue(Math.max(current - 1, 1));
    }
    if (event.key === 'Home') {
      event.preventDefault();
      updateRatingValue(1);
    }
    if (event.key === 'End') {
      event.preventDefault();
      updateRatingValue(5);
    }
  });

  function updateRatingValue(value) {
    hiddenInput.value = String(value);
    slider.setAttribute('aria-valuenow', hiddenInput.value);
    slider.setAttribute('aria-valuetext', `${hiddenInput.value} estrellas`);
    hint.textContent = `${hiddenInput.value} de 5 estrellas seleccionadas`;
    buttons.forEach((button, index) => {
      if (index < value) {
        button.style.color = 'var(--color-accent)';
      } else {
        button.style.color = 'rgba(255, 255, 255, 0.2)';
      }
    });
    control.dispatchEvent(new CustomEvent('rating-change', { detail: Number(hiddenInput.value) }));
  }

  hiddenInput.setAttribute('value', hiddenInput.value);
  control.append(hiddenInput, slider, hint);
  control.dataset.ready = 'true';
  updateRatingValue(Number(hiddenInput.value) || 0);
}

function initGamePage() {
  const params = new URLSearchParams(window.location.search);
  const gameId = params.get('id');
  const hero = qs('#gameHero');
  const content = qs('#gameContent');
  const meta = qs('#gameMeta');
  const progressForm = qs('#progressForm');
  const progressRange = qs('#progressRange');
  const progressOutput = qs('#progressOutput');
  const reviewsSummary = qs('#reviewsSummary');
  const reviewList = qs('#reviewList');
  const reviewForm = qs('#reviewForm');
  const breadcrumbTitle = qs('#breadcrumbTitle');

  if (!gameId) {
    renderGameNotFound(hero, content, reviewList, reviewsSummary, 'No se encontró el juego solicitado.');
    return;
  }

  const game = state.games.find((item) => item.id === gameId);
  if (!game) {
    renderGameNotFound(hero, content, reviewList, reviewsSummary, 'El juego no está disponible.');
    return;
  }

  breadcrumbTitle.textContent = game.title;

  hero.innerHTML = `
    <div>
      <h1 class="game__title">${game.title}</h1>
      <div class="game__chips">
        <span class="badge">${GENRE_LABELS[game.genre] || game.genre}</span>
        ${game.platforms
          .map((platform) => `<span class="badge">${PLATFORM_LABELS[platform] || platform}</span>`)
          .join('')}
      </div>
    </div>
    <img src="${game.cover || PLACEHOLDER_COVER}" alt="Portada grande del juego ${game.title}" />
  `;

  content.innerHTML = `
    <p class="game__description">${game.description || game.summary || ''}</p>
  `;

  progressRange.value = Number(game.progress) || 0;
  progressOutput.textContent = formatPercent(progressRange.value);

  progressRange.addEventListener('input', (event) => {
    progressOutput.textContent = formatPercent(event.target.value);
  });

  progressForm.addEventListener('submit', (event) => {
    event.preventDefault();
    const newProgress = clampNumber(progressRange.value, 0, 100);
    game.progress = newProgress;
    game.updatedAt = new Date().toISOString();
    setStore(STORAGE_KEYS.games, state.games);
    renderLibrary();
    progressOutput.textContent = formatPercent(newProgress);
    announce('Progreso actualizado.');
  });

  meta.innerHTML = `
    <dt>Agregado</dt>
    <dd>${new Date(game.createdAt).toLocaleDateString()}</dd>
    <dt>Última actualización</dt>
    <dd>${new Date(game.updatedAt || game.createdAt).toLocaleDateString()}</dd>
    <dt>Tiempo jugado</dt>
    <dd>-- h (personaliza desde datos reales)</dd>
  `;

  let reviews = getReviewsForGame(game.id);
  renderReviews(reviews, reviewList, reviewsSummary, game);
  initRatingControls(reviewForm);

  reviewForm.addEventListener('submit', (event) => {
    event.preventDefault();
    const formData = new FormData(reviewForm);
    const rating = Number(formData.get('rating'));
    const text = formData.get('text')?.toString().trim();

    if (!currentUser) {
      announce('Debes registrar un perfil para publicar reseñas.');
      return;
    }

    if (!text || text.length < 10) {
      announce('La reseña debe tener al menos 10 caracteres.');
      return;
    }

    if (!rating || rating < 1) {
      announce('Selecciona una calificación antes de publicar.');
      return;
    }

    const newReview = {
      id: uid('review'),
      gameId: game.id,
      userId: currentUser.id,
      username: currentUser.username,
      rating,
      text,
      createdAt: new Date().toISOString()
    };

    reviews = [...reviews, newReview];
    saveReviewsForGame(game.id, reviews);
    renderReviews(reviews, reviewList, reviewsSummary, game);
    renderLibrary();
    renderMyReviews();
    reviewForm.reset();
    initRatingControls(reviewForm);
    announce('Tu reseña se publicó.');
  });
}

function renderReviews(reviews, list, summary, game) {
  list.innerHTML = '';
  if (!reviews.length) {
    const item = document.createElement('li');
    item.className = 'panel__item';
    item.textContent = 'Aún no hay reseñas. Sé la primera persona en opinar.';
    list.append(item);
    summary.textContent = 'Sin reseñas todavía';
    return;
  }

  const average = reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length;
  summary.textContent = `${reviews.length} reseña(s) · Promedio ${average.toFixed(1)} / 5`;

  for (const review of reviews
    .slice()
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())) {
    const item = document.createElement('li');
    item.className = 'review-card';

    const header = document.createElement('div');
    header.className = 'review-card__header';
    const name = document.createElement('strong');
    name.textContent = review.username || 'Usuario';
    const rating = document.createElement('div');
    rating.className = 'rating';
    rating.append(createStaticRating(review.rating));

    header.append(name, rating);

    const meta = document.createElement('p');
    meta.className = 'review-card__meta';
    meta.textContent = new Date(review.createdAt).toLocaleString();

    const text = document.createElement('p');
    text.className = 'review-card__text';
    text.textContent = review.text;

    item.append(header, meta, text);
    list.append(item);
  }

}

function renderGameNotFound(hero, content, reviewList, summary, message) {
  hero.innerHTML = `<p>${message}</p><p><a class="link" href="index.html">Volver a la biblioteca</a></p>`;
  if (content) {
    content.innerHTML = '';
  }
  if (reviewList) {
    reviewList.innerHTML = '';
  }
  if (summary) {
    summary.textContent = message;
  }
}

function initCommon() {
  ensureSeedGames();
  loadGames();
  restoreUser();
  setupYear();
  initAuth();
  initSidebarToggle();
}

function initApp() {
  initCommon();
  const page = document.body.dataset.page;
  if (page === 'index') {
    initLibraryPage();
  }
  if (page === 'game') {
    initRatingControls();
    initGamePage();
  }
}

initApp();