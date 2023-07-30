class GameObject {
  constructor(config) {
    this.id = null;
    this.isMounted = false;
    this.x = config.x || 0;
    this.y = config.y || 0;
    this.direction = config.direction || "down";
    this.sprite = new Sprite({
      gameObject: this,
      src: config.src || "images/characters/people/red.png",
    });
    this.behaviorLoop = config.behaviorLoop || [];

    // Tracks which behavior we're on.
    this.behaviorLoopIndex = 0;

    this.talking = config.talking || [];
  }

  mount(map) {
    this.isMounted = true;

    // If there's a behavior, kick off after a short delay.
    setTimeout(() => {
      this.doBehaviorEvent(map);
    }, 10)
  }

  update() {}

  async doBehaviorEvent(map) {
    // Edge cases.
    if (map.isCutscenePlaying || this.behaviorLoop.length === 0 || this.isStanding) {
      return;
    }

    // Behavior determined by specific sprite from Map.
    let eventConfig = this.behaviorLoop[this.behaviorLoopIndex];
    eventConfig.who = this.id;

    const eventHandler = new Event({ map, event: eventConfig });

    // Gives us a nice delay before the next behavior is fired.
    await eventHandler.init();
    // console.log("Waiting...");

    // Transitions into next event.
    this.behaviorLoopIndex++;
    if (this.behaviorLoopIndex === this.behaviorLoop.length) {
      this.behaviorLoopIndex = 0;
    }

    // Repeat loop.
    this.doBehaviorEvent(map);
  }
}
