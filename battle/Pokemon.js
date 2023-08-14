class Pokemon {
  // Reference to battle class.
  constructor(config, battle) {
    // This creates the stats.
    Object.keys(config).forEach(key => {
      this[key] = config[key];
    })

    this.battle = battle;
  }

  get hpPercent() {
    const percent = this.hp / this.maxHp * 100;

    // Makes sure percentage never goes negative.
    return percent > 0 ? percent : 0;
  }
  
  createElement() {
    this.hudElement = document.createElement("div");
    this.hudElement.classList.add("pokemon");

    // Uses data from PokemonInfo.
    this.hudElement.setAttribute("data-pokemon", this.id);

    // Either hero or rival.
    this.hudElement.setAttribute("data-team", this.team);

    this.hudElement.innerHTML = (`
      <p class="pokemon_name">${this.name}</p>
      <p class="pokemon_level"></p>
      <p class="pokemon_currHp"></p>
      <div class="pokemon_sprite_crop>
        <img class="pokemon_sprite" src="${this.icon}" alt="${this.name}" />
      </div>
      <svg viewBox="0 0 42 3" class="pokemon_hp">
      <rect x=0  y=0 width="0%" height=1 fill="#009201" />
      <rect x=0  y=1 width="0%" height=1.75 fill="#19c320" />
      </svg>

      <svg viewBox="0 0 26 3" class="pokemon_xp">
        <rect x=0  y=0 width="0%" height=1 fill="#ffd76a" />
        <rect x=0  y=0 width="0%" height=1 fill="#ffd76a" />
      </svg>
    `);

    this.hpBar = this.hudElement.querySelectorAll(".pokemon_hp > rect");
  }

  update(changes={}) {
    // Update changes to the battle.
    Object.keys(changes).forEach(key => {
      this[key] = changes[key]
    });

    this.hpBar.forEach(rect => rect.style.width = `${this.hpPercent}%`)
  }

  init(container) {
    this.createElement();
    container.appendChild(this.hudElement);
    this.update();
  }
}