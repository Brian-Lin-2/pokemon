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
            // Refreshes the menu and changes it to the attack menu.
            this.keyboardMenu.setOptions(this.options().attacks)
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
      ],
      attacks: [
        ...this.trainer.moves.map(key => {
          const move = moves[key];
          return {
            label: move.name,
            handler: () => {
              this.confirm(move);
            }
          }
        })
      ]
    }
  }

  confirm(move) {
    this.keyboardMenu?.end();

    this.onComplete({
      move,
      target: this.enemy,
    });
  }

  decide() {
    // Still have to add enemy moves.
    this.confirm(moves[this.trainer.moves[0]])
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