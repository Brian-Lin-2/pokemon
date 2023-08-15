class TurnCycle {
  constructor({ battle, onNewEvent }) {
    this.battle = battle;
    this.onNewEvent = onNewEvent;

    // Current turn: player or enemy.
    this.currentTeam = "player";
  }

  async turn() {
    // Determines the current trainer.
    
  }

  async init() {
    await this.onNewEvent({
      type: "message",
      text: "The battle begins!"
    });

    // Starts the first turn!
    this.turn();
  }
}