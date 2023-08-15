class BattleMenu {
  constructor({ trainer, enemy, onComplete }) {
    this.trainer = trainer;
    this.enemy = enemy;
    this.onComplete = onComplete;
  }

  decide() {
    this.onComplete({
      moves: moves[this.trainer.moves[0]],
      target: this.enemy,
    })
  }

  init(container) {
    this.decide();
  }
}