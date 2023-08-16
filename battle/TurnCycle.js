class TurnCycle {
  constructor({ battle, onNewEvent }) {
    this.battle = battle;
    this.onNewEvent = onNewEvent;
  }

  async turn(one, two) {
    // Determines the current trainer. Start with hero.
    const trainer = this.battle.trainers[one];
    const enemy = this.battle.trainers[two];

    const battleMenu = await this.onNewEvent({
      type: "battleMenu",
      trainer,
      enemy,
    })

    // Takes the result of the move (message, change).
    const resultingEvents = battleMenu.move.success;

    for (let i = 0; i < resultingEvents.length; i++) {
      const event = {
        ...resultingEvents[i],
        battleMenu,
        move: battleMenu.moves,
        trainer,
        target: battleMenu.target,
      }
      // Stops the code and makes sure each event completes.
      await this.onNewEvent(event);
    }

    this.currentTeam = this.currentTeam === "player" ? "enemy" : "player";
    
    // Flips to next person.
    this.turn(two, one);
  }

  async init() {
    // await this.onNewEvent({
    //   type: "message",
    //   text: "The battle begins!"
    // });

    // Starts the first turn!
    this.turn("hero", "rival");
  }
}