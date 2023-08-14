class Battle {
  constructor() {
    this.trainers = {
      "hero": new Pokemon({
        ...info["001"],
        team: "hero",
        hp: 50,
        maxHp: 50,
        xp: 0,
        level: 5,
      }, this),
      "rival": new Pokemon({
        ...info["004"],
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
      <div>
        <img class="heroHP" src="/images/other/hero-hp.png" alt="heroHP"/>
        <p class="heroLV">5</p>
      </div>

      <div>
        <img class="rivalHP" src="/images/other/rival-hp.png" alt="rivalHP">
        <p class="rivalLV">5</p>
      </div>

      </div>
    `)
  }

  init(container) {
    this.createElement();
    container.appendChild(this.element);

    Object.keys(this.trainers).forEach(key => {
      let trainer = this.trainers[key];
      trainer.id = key;
      trainer.init(this.element);
    })
  }
}