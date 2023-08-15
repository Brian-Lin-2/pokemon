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
    const {trainer, target, damage} = this.event;

    if (damage) {
      // Modify the target to have less HP.
      target.update({
        hp: target.hp - damage,
      })

      // Animations.
      target.pokemonSprite.classList.add("battle_damage");
    }

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