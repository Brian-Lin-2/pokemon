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

  get xpPercent() {
    return this.xp / this.maxXp * 100;
  }
  
  createElement() {
    this.hudElement = document.createElement("div");
    this.hudElement.classList.add("pokemon");

    // Uses data from PokemonInfo.
    this.hudElement.setAttribute("data-pokemon", this.id);

    // Either hero or rival.
    this.hudElement.setAttribute("data-team", this.team);

    // Displays the name, level, hp, etc..
    this.hudElement.innerHTML = (`
      <p class="pokemon_name">${this.name}</p>
      <p class="pokemon_level"></p>
      <div class="pokemon_currHp">
        <p class="pokemon_remHp">${this.hp}</p>
        <p>${this.maxHp}</p>
      </div>
      <svg viewBox="0 0 42 3" class="pokemon_hp">
        <rect x=0 y=0 width="0%" height=1 fill="#009201" />
        <rect x=0 y=1 width="0%" height=1.75 fill="#19c320" />
      </svg>

      <svg viewBox="0 0 102 3" class="pokemon_xp">
        <rect x=0 y=0 width="0%" height=1 fill="#305fd7" />
        <rect x=0 y=1 width="0%" height=1.75 fill="#4891f8" />
      </svg>
    `);

    // Actual sprite.
    this.pokemonSprite = document.createElement("img");
    this.pokemonSprite.classList.add("pokemon_sprite");

    if (this.team == "hero") {
      this.pokemonSprite.setAttribute("src", this.backSprite);
    }
    else {
      this.pokemonSprite.setAttribute("src", this.frontSprite);
    }

    this.pokemonSprite.setAttribute("alt", this.name);
    this.pokemonSprite.setAttribute("data-team", this.team);

    this.hpBar = this.hudElement.querySelectorAll(".pokemon_hp > rect");
    this.xpBar = this.hudElement.querySelectorAll(".pokemon_xp > rect");
  }

  update(changes={}) {
    // Update changes to the battle.
    Object.keys(changes).forEach(key => {
      this[key] = changes[key]
    });

    // Updates hp and xp bars.
    this.hpBar.forEach(rect => rect.style.width = `${this.hpPercent}%`)
    this.xpBar.forEach(rect => rect.style.width = `${this.xpPercent}%`)

    let hp = this.hudElement.querySelector(".pokemon_remHp");
    if (hp) { hp.innerText = this.hp }

    // Changes color based on hp. For now there's no healing, so we don't have to worry about increasing health.
    let hpColor = this.hudElement.querySelectorAll(".pokemon_hp rect");
    if (this.hpPercent <= 20) {
      hpColor[0].style.fill = "#a0252b";
      hpColor[1].style.fill = "#fc421d";
    }
    else if (this.hpPercent <= 50) {
      hpColor[0].style.fill = "#b87510";
      hpColor[1].style.fill = "#fcb800";
    }
  }

  fainted() {
    // Add fainting animation.
    this.pokemonSprite.classList.add("pokemon_faint");
  }

  init(container) {
    this.createElement();
    container.appendChild(this.hudElement);
    container.appendChild(this.pokemonSprite);
    this.update();
  }
}