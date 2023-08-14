class Pokemon {
  // Reference to battle class.
  constructor(config, battle) {
    // This creates the stats.
    Object.keys(config).forEach(key => {
      this[key] = config[key];
    })

    this.battle = battle;
  }
  
  createElement() {
    this.hudElement = document.createElement("div");
    this.hudElement.classList.add("pokemon");

    // Uses data from PokemonInfo.
    this.hudElement.setAttribute("data-pokemon", this.id);

    // Either hero or rival.
    this.hudElement.setAttribute("data-team", this.team);
    this.hudElement.setAttribute("data-name", this.team);

    this.hudElement.innerHTML = (`
      <p class="pokemon_name">${this.name}</p>
      <p class="pokemon_level"></p>
      <div class="pokemon_sprite_crop>
        <img class="pokemon_sprite" src="${this.icon}" alt="${this.name}" />
      </div>
      <svg viewBox="0 0 26 3" class="pokemon_hp_xp">
        <rect x=0  y=0 width="0%" height=1 fill="#ffd76a" />
        <rect x=0  y=0 width="0%" height=1 fill="#ffd934" />
      </svg>
    `);
  }

  init(container) {
    this.createElement();
    container.appendChild(this.hudElement);
  }
}