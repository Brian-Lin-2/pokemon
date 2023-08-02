class Battle {
  constructor() {

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