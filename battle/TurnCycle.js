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

    // Check for winning team.
    const fainted = battleMenu.target.hp <= 0;

    if (fainted) {
      await this.onNewEvent({
        type: "message", text: `${battleMenu.target.name} has fainted!`,
      })

      // Only give XP to player.
      const xp = parseInt(Math.random() * 4) + 35;

      await this.onNewEvent({
        type: "message", text: `${trainer.name} gained ${xp} Exp. Points!`
      })

      if (battleMenu.target.team === "rival") {
        await this.onNewEvent({
          type: "xp",
          xp,
          pokemon: trainer,
        })
      }

      await this.onNewEvent({
        type: "message", text: `${trainer.trainer} won the battle!`
      })

      // Cut to end screen.

      return;
    }

    // Flips to next person.
    this.turn(two, one);
  }

  async init() {
    await this.onNewEvent({
      type: "message",
      text: "Battle Begins!",
    });

    // Starts the first turn!
    this.turn("hero", "rival");
  }
}