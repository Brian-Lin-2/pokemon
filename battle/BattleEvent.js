class BattleEvent {
  constructor(event, battle) {
    this.event = event;
    this.battle = battle;
  }

  message(resolve) {
    const text = this.event.text
    .replace("{POKEMON}", this.event.trainer?.name)
    .replace("{TARGET}", this.event.target?.name)

    const message = new TextMessage({
      text: text,
      onComplete: () => {
        resolve();
      }
    })

    message.init(this.battle.element);
  }

  async change(resolve) {
    const {trainer, target} = this.event;

    if (this.event.damage) {
      // Modify the target to have less HP.
      target.update({
        hp: target.hp - (trainer.attack * this.event.damage / target.defense),
      })
    }

    if (this.event.debuff) {
      // Less attack.
      if (this.event.debuff === "attack" && target.attack > 0.2) {
        target.update({
          attack: target.attack - 0.2,
        })
      }
      // Less defense.
      else if (this.event.debuff === "defense" && target.defense > 0.2) {
        target.update({
          defense: target.defense - 0.2
        })
      };
    }

    // Animations.
    target.pokemonSprite.classList.add("battle_damage");

    // Wait a little bit.
    await utils.wait(600);

    target.pokemonSprite.classList.remove("battle_damage");

    resolve();
  }

  battleMenu(resolve) {
    const battleMenu = new BattleMenu({
      trainer: this.event.trainer,
      enemy: this.event.enemy,
      onComplete: choice => {
        // Choice is what move to use, who to use it on.
        resolve(choice);
      }
    })

    battleMenu.init(this.battle.element);
  }

  init(resolve) {
    this[this.event.type](resolve);
  }
}