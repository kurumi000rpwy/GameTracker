let currentPage = 1;

async function loadGames(page = 1) {
  const res = await fetch(`/api/games?page=${page}`);
  const data = await res.json();

  const container = document.getElementById('gamesContainer');
  const message = document.getElementById('message');
  const prev = document.getElementById('prevBtn');
  const next = document.getElementById('nextBtn');

  container.innerHTML = '';
  message.textContent = '';

  if (!data.success) {
    message.textContent = data.message;
    prev.disabled = true;
    next.disabled = true;
    return;
  }

  data.games.forEach(game => {
    container.innerHTML += `
      <div class="card">
        <img src="${game.image || './assets/img/placeholder.jpg'}" alt="${game.title}">
        <h3>${game.title}</h3>
        <p>${game.genre}</p>
      </div>
    `;
  });

  prev.disabled = (data.page === 1);
  next.disabled = (data.page === data.totalPages);

  currentPage = data.page;
}

document.getElementById('prevBtn').addEventListener('click', () => loadGames(currentPage - 1));
document.getElementById('nextBtn').addEventListener('click', () => loadGames(currentPage + 1));

loadGames();
