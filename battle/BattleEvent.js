class BattleEvent {
  constructor(event, battle) {
    this.event = event;
    this.battle = battle;
  }

  message(resolve) {
    const text = this.event.text
    .replace("{POKÉMON}", this.event.trainer?.name)
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
        // Makes sure hp is always a whole number >= 0 and attacks will do at least 1 damage.
        hp: Math.max(Math.round(target.hp - Math.max((trainer.attack * this.event.damage / target.defense), 1)), 0),
      })
    }

    if (this.event.debuff) {
      // Less attack.
      if (this.event.debuff === "attack" && target.attack > 0.1) {
        target.update({
          attack: target.attack - 0.15,
        })
      }
      // Less defense.
      else if (this.event.debuff === "defense" && target.defense > 0.1) {
        target.update({
          defense: target.defense - 0.15,
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
      },
      battle: this.battle,
    })

    battleMenu.init(this.battle.element);
  }

  xp(resolve) {
    let amount = this.event.xp;
    const step = () => {
      if (amount > 0) {
        amount--;
        this.event.pokemon.xp++;
        this.event.pokemon.update();
        requestAnimationFrame(step);
        return;
      }

      resolve();
    }

    requestAnimationFrame(step);
  }

  init(resolve) {
    this[this.event.type](resolve);
  }
}