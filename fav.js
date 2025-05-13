// Wait until the whole page content is loaded 
document.addEventListener("DOMContentLoaded", () => {
    // Get important elements from the HTML
    const backToSearchButton = document.getElementById("goBackToSearchBtn");
    const favoritesContainer = document.getElementById("favoritePokémons");
    const sortDropdown = document.getElementById("sortSelect");
    const downloadButton = document.getElementById("downloadBtn");
  
    // Download favorites list as JSON file
    downloadButton.addEventListener("click", () => {
      const favorites = JSON.parse(localStorage.getItem("favorites") || "[]");
      const jsonFormatted = JSON.stringify(favorites, null, 2); 
      const fileBlob = new Blob([jsonFormatted], { type: "application/json" });
      const tempURL = URL.createObjectURL(fileBlob);
  
      const anchor = document.createElement("a");
      anchor.href = tempURL;
      anchor.download = "favorites.json";
      anchor.click();
  
      URL.revokeObjectURL(tempURL);
    });
  
    // Navigate  to the search page
    backToSearchButton.addEventListener("click", () => {
      window.location.href = "Main.html";
    });
  
    // Load the favorites from localStorage,or an empty list if none exist
    let favorites = JSON.parse(localStorage.getItem("favorites") || "[]");
  
    // Display all favorites on the page
    function renderFavorites() {
      favoritesContainer.innerHTML = ""; // Clear 
  
      const sortBy = sortDropdown.value;
  
      // Sort by ID or Name
      favorites.sort((a, b) => {
        return sortBy === "id" ? a.id - b.id : a.name.localeCompare(b.name);
      });
  
      // If no favorites, show a message
      if (favorites.length === 0) {
        favoritesContainer.innerHTML = "<p>No favorites yet!</p>";
        return;
      }
  
      // show each favorite Pokémon card
      favorites.forEach(pokemon => {
        const card = document.createElement("div");
        card.className = "pokemon-card";
        card.dataset.id = pokemon.id;
  
        card.innerHTML = `
          <img src="${pokemon.image}" alt="${pokemon.name}">
          <h2>${pokemon.name}</h2>
          <p><strong>ID:</strong> ${pokemon.id}</p>
          <p><strong>Type(s):</strong> ${pokemon.types.map(t => t.type.name).join(", ")}</p>
          <p><strong>Abilities:</strong> ${pokemon.abilities.map(a => a.ability.name).join(", ")}</p>
          <button class="remove-btn">❤️ Remove</button>
        `;
  
        favoritesContainer.appendChild(card);
      });
    }
  
    // showing the favorites when the sort option changes
    sortDropdown.addEventListener("change", renderFavorites);
  
    // handle the "Remove" button click for each Pokémon
    favoritesContainer.addEventListener("click", (event) => {
      if (event.target.classList.contains("remove-btn")) {
        const card = event.target.closest(".pokemon-card");
        const pokemonId = Number(card.dataset.id);
  
        // Remove the selected Pokémon from the favorites array
        favorites = favorites.filter(p => p.id !== pokemonId);
  
        // Update localStorage and show the list
        localStorage.setItem("favorites", JSON.stringify(favorites));
        renderFavorites();
      }d
    });
  
    // Initial showing of the favorites list
    renderFavorites();
  });
  
