const searchPageButton = document.getElementById("goBackToSearchBtn");
const popularPokemonIDs = [1, 6, 7, 9, 12, 25, 59, 94, 132, 133, 134, 143, 149, 150, 151];
const container = document.getElementById("popularPokemonList");
const loader = document.getElementById("loader");

// Go back to main search page
searchPageButton.addEventListener("click", () => {
  window.location.href = "Main.html";
});

// Check if a Pokemon is in favorites
function checkIfFavorited(pokemonId) {
  const favoritesList = JSON.parse(localStorage.getItem("favorites") || "[]");
  return favoritesList.some(p => p.id === pokemonId);
}

// Add or remove Pokemon from favorites
function togglePokemonFavoriteStatus(id, name, image, types, abilities, iconElement) {
  let favoritesList = JSON.parse(localStorage.getItem("favorites") || "[]");
  const existing = favoritesList.find(p => p.id === id);

  if (existing) {
    favoritesList = favoritesList.filter(p => p.id !== id);
    iconElement.textContent = "♡";
    iconElement.closest(".favorite-btn").classList.remove("favorited");
  } else {
    favoritesList.push({ id, name, image, types, abilities });
    iconElement.textContent = "❤️";
    iconElement.closest(".favorite-btn").classList.add("favorited");
  }

  localStorage.setItem("favorites", JSON.stringify(favoritesList));
}

// Create Pokemon card
function createCard(pokemon) {
  const isFavorited = checkIfFavorited(pokemon.id);
  const types = pokemon.types.map(t => t.type.name);
  const abilities = pokemon.abilities.map(a => a.ability.name);

  const card = document.createElement("div");
  card.className = "pokemon-card";
  card.dataset.id = pokemon.id;
  card.dataset.name = pokemon.name;
  card.dataset.image = pokemon.sprites.front_default;
  card.dataset.types = JSON.stringify(pokemon.types);
  card.dataset.abilities = JSON.stringify(pokemon.abilities);

  card.innerHTML = `
    <img src="${pokemon.sprites.front_default}" alt="${pokemon.name}">
    <h2>${pokemon.name.charAt(0).toUpperCase() + pokemon.name.slice(1)}</h2>
    <p><strong>ID:</strong> ${pokemon.id}</p>
    <p><strong>Types:</strong> ${types.join(", ")}</p>
    <p><strong>Abilities:</strong> ${abilities.join(", ")}</p>
    <button class="favorite-btn ${isFavorited ? "favorited" : ""}">
      <span class="heart-icon">${isFavorited ? "❤️" : "♡"}</span> Favorite
    </button>
  `;

  return card;
}

// Display all popular Pokémon
async function displayPopularPokemons() {
  loader.style.display = "block";
  try {
    const promises = popularPokemonIDs.map(id => fetch(`https://pokeapi.co/api/v2/pokemon/${id}`).then(res => res.json()));
    const pokemons = await Promise.all(promises);

    pokemons.forEach(pokemon => {
      const card = createCard(pokemon);
      container.appendChild(card);
    });
  } catch (error) {
    console.error("Failed to load popular Pokémons:", error);
  }
  loader.style.display = "none";
}

// Handle favorite button click
container.addEventListener("click", event => {
  if (event.target.classList.contains("heart-icon")) {
    const card = event.target.closest(".pokemon-card");
    const id = Number(card.dataset.id);
    const name = card.dataset.name;
    const image = card.dataset.image;
    const types = JSON.parse(card.dataset.types);
    const abilities = JSON.parse(card.dataset.abilities);

    togglePokemonFavoriteStatus(id, name, image, types, abilities, event.target);
  }
});

displayPopularPokemons();
