const pokedex = document.querySelector("#pokedex");

const fetchpokemon = () => {
    const promises = [];
    for (let i = 1; i <= 150; i++) {
        const url = 'https://pokeapi.co/api/v2/pokemon/${i}';
        promises.push(fetch(url).then((res) => res.json()))
    }

    promise.all(promises).then((results) => {
        const pokemon = results.map((data) => ({
            name:data.name,
            id:data.id,
            image:data.sprites["front_default"],
            type:data.types.map((type) => type.type.name).join("|"),
        }));
        displaypokemon(pokemon);
    });
};

const displaypokemon = (pokemon) => {
    console.log(pokemon);
    const pokemonHTMLString = pokemon.map(
        (p) => <li class="card">
    <img class="card-image" scr="${pokemon.image}"/>
    <h2 class="card-title"><span class="id">${pokemon.id}.</span>${pokemon.id}</h2>
    <h4 class="card-subtitle">type: ${pokemon.type}</h4>
    </li>
    )

    .join("");
    pokedex.innerHTML = pokemonHTMLString;
};
fetchpokemon();