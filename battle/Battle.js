class Battle {
  constructor() {
    this.pokemon = {
      "hero": new Pokemon({
        ...PokemonInfo["001"],
        team: "hero",
        hp: 50,
        maxHp: 50,
        xp: 0,
        level: 5,
      }, this),
      "rival": new Pokemon({
        ...PokemonInfo["001"],
        team: "rival",
        hp: 50,
        maxHp: 50,
        xp: 0,
        level: 5,
      }, this),
    }
  }

  createElement() {
    this.element = document.createElement("div");
    this.element.classList.add("Battle");
    this.element.innerHTML = (`
      <div class="heroPokemon">

      </div>

      <div class="rivalPokemon">

      </div>
    `)
  }

  init(container) {
    this.createElement();
    container.appendChild(this.element);
  }
}