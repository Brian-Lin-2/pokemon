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
          label: "Bag",
          handler: () => {
            // Does something when chosen.
          }
        },
        {
          label: "Pokemon",
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
            // If there's no move, we just leave a blank slot.
            label: move?.name || "",
            handler: () => {
              if (move) {
                this.confirm(move);
              }
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
    // Only two moves for now. 50% chance to use each.
    let randomMove = Math.round(Math.random());
    console.log(randomMove);
    this.confirm(moves[this.trainer.moves[randomMove]])
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