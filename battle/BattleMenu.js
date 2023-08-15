class BattleMenu {
  constructor({ trainer, enemy, onComplete }) {
    this.trainer = trainer;
    this.enemy = enemy;
    this.onComplete = onComplete;
  }

  options() {
    return {
      home: [
        {
          label: "Attack",
          handler: () => {
            // Does something when chosen.
            console.log("working");
          }
        },
        {
          label: "Item",
          handler: () => {
            // Does something when chosen.
          }
        },
        {
          label: "Bag",
          handler: () => {
            // Does something when chosen.
          }
        },
        {
          label: "Run",
          handler: () => {
            // Does something when chosen.
          }
        }
      ]
    }
  }

  decide() {
    this.onComplete({
      moves: moves[this.trainer.moves[0]],
      target: this.enemy,
    })
  }

  showMenu(container) {
    this.keyboardMenu = new KeyboardMenu();
    this.keyboardMenu.init(container);

    // Creates a player UI.
    this.keyboardMenu.setOptions(this.options().home);
  }

  init(container) {
    if (this.trainer.isHero) {
      // Show UI.
      this.showMenu(container);;
    } else {
      this.decide();
    }
  }
}