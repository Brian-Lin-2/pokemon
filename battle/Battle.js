class Battle {
  constructor({ onComplete }) {
    this.onComplete = onComplete;

    this.trainers = {
      "hero": new Pokemon({
        ...info[heroTeam],
        team: "hero",
        trainer: "Red",
        hp: 22,
        maxHp: 22,
        xp: 0,
        maxXp: 50,
        level: 5,
        isHero: true,
      }, this),
      "rival": new Pokemon({
        ...info[rivalTeam],
        team: "rival",
        trainer: "Blue",
        hp: 33,
        maxHp: 33,
        xp: 0,
        maxXp: 50,
        level: 5,
      }, this),
    }
  }

  createElement() {
    this.element = document.createElement("div");
    this.element.classList.add("Battle");
    this.element.innerHTML = (`
      <div>
        <img class="hero_hp" src="/images/other/hero-hp.png" alt="heroHP"/>
        <p class="hero_lv">5</p>
      </div>

      <div>
        <img class="rival_hp" src="/images/other/rival-hp.png" alt="rivalHP">
        <p class="rival_lv">5</p>
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

    // Create a simple turn cycle system.
    // Waits for little events before continuing the cycle.
    this.turnCycle = new TurnCycle({
      battle: this,
      onNewEvent: event => {
        return new Promise(resolve => {
          const battleEvent = new BattleEvent(event, this);
          battleEvent.init(resolve);
        })
      },
      endBattle: () => {
        this.element.remove();
        this.onComplete();
      }
    })

    // Starts the first turn!
    this.turnCycle.init();
  }
}

let heroTeam = "001";
let rivalTeam = "004";
