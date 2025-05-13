// Get important elements from the HTML
const pokemonListContainer = document.getElementById("PokémonfoundList");
const searchBox = document.getElementById("txtSearch");
const loadingIndicator = document.getElementById("loader");
const favoritesPageButton = document.getElementById("goToFavoritesBtn");
const popularPokemonButton = document.getElementById("goToPopularPokémonsBtn");

// Wait until the page is loaded
document.addEventListener("DOMContentLoaded", () => {
  // Get the search term from the URL or from previous local search
  const queryParams = new URLSearchParams(window.location.search);
  const savedSearch = queryParams.get("q") || localStorage.getItem("lastSearch");

  // If there's a previous search, show results for it
  if (savedSearch) {
    searchBox.value = savedSearch;
    loadingIndicator.style.display = "block";
    searchForPokemon(savedSearch);
  }

  // When the user types something in the search box
  searchBox.addEventListener("input", () => {
    const searchText = searchBox.value.trim();
    const newURL = `${window.location.pathname}?q=${encodeURIComponent(searchText)}`;

    // Update the URL and save the search
    window.history.replaceState({}, "", newURL);
    localStorage.setItem("lastSearch", searchText);

    if (searchText.length > 0) {
      loadingIndicator.style.display = "block";
      searchForPokemon(searchText);
    } else {
      // Clear the results if input is empty
      pokemonListContainer.innerHTML = "";
    }
  });

  // "Go to Favorites " button is clicked
  favoritesPageButton.addEventListener("click", () => {
    window.location.href = "fav.html";
  });

  // "Go to popular pokemon " button is clicked
  popularPokemonButton.addEventListener("click", () => {
    window.location.href = "popular_pokemons.html";
  });

  // When a heart icon is clicked (favorite button)
  pokemonListContainer.addEventListener("click", (event) => {
    if (event.target.classList.contains("heart-icon")) {
      const cardElement = event.target.closest(".pokemon-card");

      const pokemonId = Number(cardElement.dataset.id);
      const pokemonName = cardElement.dataset.name;
      const pokemonImage = cardElement.dataset.image;
      const pokemonTypes = JSON.parse(cardElement.dataset.types);
      const pokemonAbilities = JSON.parse(cardElement.dataset.abilities);

      togglePokemonFavoriteStatus(pokemonId, pokemonName, pokemonImage, pokemonTypes, pokemonAbilities, event.target);
    }
  });
});

// Main function to search Pokemon by name, type, ability
function searchForPokemon(searchText) {
  const nameURL = `https://pokeapi.co/api/v2/pokemon/${searchText.toLowerCase()}`;
  const typeURL = `https://pokeapi.co/api/v2/type/${searchText.toLowerCase()}`;
  const abilityURL = `https://pokeapi.co/api/v2/ability/${searchText.toLowerCase()}`;

  // Try to get Pokemon by name
  fetch(nameURL)
    .then(response => {
      if (!response.ok) throw new Error("Pokémon not found by name");
      return response.json();
    })
    .then(displaySinglePokemon)
    .catch(() => {
      // Try to get Pokémon by type
      fetch(typeURL)
        .then(response => {
          if (!response.ok) throw new Error("No type found");
          return response.json();
        })
        .then(data => {
          const matchingPokemonList = data.pokemon;
          displayMultiplePokemons(matchingPokemonList);
        })
        .catch(() => {
          // Try to get Pokémon by ability
          fetch(abilityURL)
            .then(response => {
              if (!response.ok) throw new Error("No ability found");
              return response.json();
            })
            .then(data => {
              const matchingPokemonList = data.pokemon;
              displayMultiplePokemons(matchingPokemonList);
            })
            .catch(() => {
              // If nothing is found
              pokemonListContainer.innerHTML = `<p>No Pokémon found for "${searchText}".</p>`;
            });
        });
    })
    .finally(() => {
      loadingIndicator.style.display = "none";
    });
}

// Display one Pokemon card
function displaySinglePokemon(pokemon) {
  const isFavorited = checkIfFavorited(pokemon.id);

  pokemonListContainer.innerHTML = `
    <div class="pokemon-card"
         data-id="${pokemon.id}"
         data-name="${pokemon.name}"
         data-image="${pokemon.sprites.front_default}"
         data-types='${JSON.stringify(pokemon.types)}'
         data-abilities='${JSON.stringify(pokemon.abilities)}'>

      <img src="${pokemon.sprites.front_default}" alt="${pokemon.name}">
      <h2>${pokemon.name}</h2>
      <p><strong>ID:</strong> ${pokemon.id}</p>
      <p><strong>Types:</strong> ${pokemon.types.map(type => type.type.name).join(", ")}</p>
      <p><strong>Abilities:</strong> ${pokemon.abilities.map(ability => ability.ability.name).join(", ")}</p>

      <button class="favorite-btn ${isFavorited ? "favorited" : ""}">
        <span class="heart-icon">${isFavorited ? "❤️" : "♡"}</span> Favorite
      </button>
    </div>
  `;
}

// Display a list of 20 Pokemons
function displayMultiplePokemons(pokemonList) {
  const limitedList = pokemonList.slice(0, 20);

  const fetchAllDetails = limitedList.map(p =>
    fetch(p.pokemon.url).then(res => res.json())
  );

  Promise.all(fetchAllDetails).then(allPokemons => {
    pokemonListContainer.innerHTML = allPokemons.map(pokemon => {
      const isFavorited = checkIfFavorited(pokemon.id);

      return `
        <div class="pokemon-card"
             data-id="${pokemon.id}"
             data-name="${pokemon.name}"
             data-image="${pokemon.sprites.front_default}"
             data-types='${JSON.stringify(pokemon.types)}'
             data-abilities='${JSON.stringify(pokemon.abilities)}'>

          <img src="${pokemon.sprites.front_default}" alt="${pokemon.name}">
          <h2>${pokemon.name}</h2>
          <p><strong>ID:</strong> ${pokemon.id}</p>
          <p><strong>Types:</strong> ${pokemon.types.map(t => t.type.name).join(", ")}</p>
          <p><strong>Abilities:</strong> ${pokemon.abilities.map(a => a.ability.name).join(", ")}</p>

          <button class="favorite-btn ${isFavorited ? "favorited" : ""}">
            <span class="heart-icon">${isFavorited ? "❤️" : "♡"}</span> Favorite
          </button>
        </div>
      `;
    }).join("");
  });
}

// Check if Pokemon is in favorites
function checkIfFavorited(pokemonId) {
  const favoritesList = JSON.parse(localStorage.getItem("favorites") || "[]");
  return favoritesList.some(pokemon => pokemon.id === pokemonId);
}

// Add or remove Pokemon from favorites
function togglePokemonFavoriteStatus(id, name, image, types, abilities, iconElement) {
  let favoritesList = JSON.parse(localStorage.getItem("favorites") || "[]");
  const alreadyFavorited = favoritesList.find(p => p.id === id);

  if (alreadyFavorited) {
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
