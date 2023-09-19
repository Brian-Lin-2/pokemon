class BattleMenu {
  constructor({ trainer, enemy, onComplete, battle }) {
    this.trainer = trainer;
    this.enemy = enemy;
    this.onComplete = onComplete;
    this.battle = battle;
  }

  options() {
    return {
      home: [
        {
          label: "Attack",
          handler: () => {
            // Refreshes the menu and changes it to the attack menu.
            this.keyboardMenu.setOptions(this.options().attacks);
          }
        },
        {
          label: "Bag",
          handler: () => {
            this.message("You skipped shoulder day so you didn't bring your bag.");
          }
        },
        {
          label: "Pokemon",
          handler: () => {
            this.message("You skipped bicep day so you can only hold one POKÉBALL.");
          }
        },
        {
          label: "Run",
          handler: () => {
            this.message("You skipped leg day so you couldn't run away.");
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

  async message(text) {
    this.keyboardMenu.stop();

    await new Promise(resolve => {
      const battleEvent = new BattleEvent({ type: "message", text: text }, this.battle);
      battleEvent.init(resolve);
    });

    this.keyboardMenu.start();
    this.keyboardMenu.current = 0;

    setTimeout(() => {
      this.keyboardMenu.element.querySelector("button[data-button]").focus();
    })
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
    this.confirm(moves[this.trainer.moves[randomMove]]);
  }

  showMenu(container) {
    this.keyboardMenu = new KeyboardMenu({
      type: "battle", name: this.trainer.name
    }
    );
    this.keyboardMenu.init(container);

    // Creates a player UI.
    this.keyboardMenu.setOptions(this.options().home);
  }

  init(container) {
    if (this.trainer.isHero) {
      // Show UI.
      this.showMenu(container);
    } else {
      this.decide();
    }
  }
}