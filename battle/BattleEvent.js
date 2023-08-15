class BattleEvent {
  constructor(event, battle) {
    this.event = event;
    this.battle = battle;
  }

  message(resolve) {
    const message = new TextMessage({
      text: this.event.text,
      onComplete: () => {
        resolve();
      }
    })

    message.init(this.battle.element);
  }

  battleMenu(resolve) {
    console.log(this.event.trainer);
    console.log(this.event.enemy);
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