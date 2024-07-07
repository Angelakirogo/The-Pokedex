let pokemons = [];
const poke_container = document.getElementById("poke_container");
const url = "https://pokeapi.co/api/v2/pokemon";
const search = document.getElementById("search");
const form = document.getElementById("form");
const prevButton = document.getElementById("prev");
const nextButton = document.getElementById("next");

let nextUrl = null;
let prevUrl = null;

// Fetch Pokémon with pagination
const fetchPokemons = async (apiUrl) => {
    const res = await fetch(apiUrl);
    const data = await res.json();
    nextUrl = data.next;
    prevUrl = data.previous;
    pokemons = data.results;
    removepokemons();
    pokemons.forEach(async (pokemon) => {
        const res = await fetch(pokemon.url);
        const pokeData = await res.json();
        createPokemonCard(pokeData);
    });
    updateButtons();
};

// Remove all Pokémon cards
const removepokemons = () => {
    const pokemonEls = document.querySelectorAll(".pokemon");
    pokemonEls.forEach((pokemonEl) => pokemonEl.remove());
};

// Create a Pokémon card
function createPokemonCard(pokemon) {
    const pokemonEls = document.createElement("div");
    pokemonEls.classList.add("pokemon", "col-lg-3", "col-md-4", "col-sm-6", "mb-4");
    pokemonEls.setAttribute("data-id", pokemon.id);

    const poke_types = pokemon.types.map((el) => el.type.name).join(", ");
    const name = pokemon.name.charAt(0).toUpperCase() + pokemon.name.slice(1);
    const poke_stat = pokemon.stats.map((el) => el.stat.name);
    const stats = poke_stat.slice(0, 3);
    const base_value = pokemon.stats.map((el) => el.base_stat);
    const base_stat = base_value.slice(0, 3);
    const statHTML = stats.map((stat) => `<li class="names">${stat}</li>`).join("");
    const baseHTML = base_stat.map((base) => `<li class="base">${base}</li>`).join("");

    const pokeInnerHTML = `
        <div class="card h-100">
            <div class="card-body">
                <div class="img-container">
                    <img src="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${pokemon.id}.png" class="card-img-top" alt="${name}"/>
                </div>
                <div class="info">
                    <h5 class="card-title">${name}</h5>
                    <small class="type">Type: ${poke_types}</small>
                </div>
                <div class="stats mt-2">
                    <h6>Stats</h6>
                    <ul>${statHTML}</ul>
                    <ul>${baseHTML}</ul>
                </div>
            </div>
        </div>`;

    pokemonEls.innerHTML = pokeInnerHTML;
    pokemonEls.addEventListener("click", () => {
        showPokemonModal(pokemon.id);
    });

    poke_container.appendChild(pokemonEls);
}

const showPokemonModal = async (id) => {
    const res = await fetch(`${url}/${id}`);
    const pokemon = await res.json();
    const modalContent = document.getElementById("modalContent");

    const poke_types = pokemon.types.map((el) => el.type.name).join(", ");
    const name = pokemon.name.charAt(0).toUpperCase() + pokemon.name.slice(1);
    const poke_stat = pokemon.stats.map((el) => el.stat.name);
    const stats = poke_stat.slice(0, 3);
    const base_value = pokemon.stats.map((el) => el.base_stat);
    const base_stat = base_value.slice(0, 3);
    const statHTML = stats.map((stat) => `<li class="names">${stat}</li>`).join("");
    const baseHTML = base_stat.map((base) => `<li class="base">${base}</li>`).join("");

    const modalInnerHTML = `
        <div class="img-container text-center">
            <img src="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${pokemon.id}.png" class="img-fluid" alt="${name}"/>
        </div>
        <div class="info mt-3">
            <h5 class="text-center">${name}</h5>
            <small class="type d-block text-center">Type: ${poke_types}</small>
        </div>
        <div class="stats mt-3">
            <h6>Stats</h6>
            <ul>${statHTML}</ul>
            <ul>${baseHTML}</ul>
        </div>`;

    modalContent.innerHTML = modalInnerHTML;
    const pokemonModal = new bootstrap.Modal(document.getElementById("pokemonModal"));
    pokemonModal.show();
};


// Event listener for the form
form.addEventListener("submit", (e) => {
    e.preventDefault();
    const searchterm = search.value.trim().toLowerCase();
    if (searchterm) {
        getpokemon(searchterm);
        search.value = "";
    } else {
        fetchPokemons(url);
    }
});

// Fetch Pokémon by name
const getpokemon = async (name) => {
    try {
        const res = await fetch(`${url}/${name}`);
        if (!res.ok) {
            throw new Error("Pokemon not found");
        }
        const pokeData = await res.json();
        removepokemons();
        createPokemonCard(pokeData);
    } catch (error) {
        console.error(error);
        removepokemons();
        poke_container.innerHTML = `<p class="text-center">Pokemon not found</p>`;
    }
};

// Update pagination buttons
const updateButtons = () => {
    prevButton.disabled = !prevUrl;
    nextButton.disabled = !nextUrl;
};

// Event listeners for pagination buttons
prevButton.addEventListener("click", () => {
    if (prevUrl) {
        fetchPokemons(prevUrl);
    }
});

nextButton.addEventListener("click", () => {
    if (nextUrl) {
        fetchPokemons(nextUrl);
    }
});

// Initialize fetch with the initial URL
fetchPokemons(url);
