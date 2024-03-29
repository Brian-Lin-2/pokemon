class Person extends GameObject {
  constructor(config) {
    super(config);

    // Locks them to the grid (can't stop halfway).
    this.movingProgressRemaining = 0;
    this.isStanding = false;

    // [x, y]
    this.nextPos = null;

    this.isHero = config.isHero || false;

    this.directionUpdate = {
      "up": ["y", -1],
      "down": ["y", 1],
      "left": ["x", -1],
      "right": ["x", 1],
    }
  }

  update(state) {
    if (this.movingProgressRemaining > 0) {
      this.updatePosition();
    } else {

      // Case 1: User input and arrow is pressed.
      if (!state.map.isCutscenePlaying && this.isHero && state.arrow) {
        this.startBehavior(state, {
          type: "walk",
          direction: state.arrow,
        })
      }

    this.updateSprite(state);
    }
  }

  startBehavior(state, behavior) {
    // Prevents any async code from still running if character was removed.
    if (!this.isMounted) {
      return;
    }

    // Sets character direciton to a specific indicated behavior.
    this.direction = behavior.direction;

    if (behavior.type === "walk") {
      // Stop movement if a collision is active.
      if (state.map.isSpaceTaken(this.x, this.y, this.direction)) {
        // Begins movement again for npcs.
        if (behavior.retry) {
          setTimeout(() => {
            this.startBehavior(state, behavior)
          }, 10)
        }

        return;
      }

      // Walking.
      this.movingProgressRemaining = 16;

      // Caculates our next position.
      const nextPos = utils.nextPosition(this.x, this.y, this.direction);
      this.nextPos = [
        nextPos.x,
        nextPos.y,
      ]

      this.updateSprite(state);
    }

    if (behavior.type === "stand") {
      this.isStanding = true;
      
      setTimeout(() => {
        utils.createEvent("PersonStandComplete", {
          whoId: this.id
        })
      }, behavior.time)

      this.isStanding = false;
    }
  }

  updatePosition() {
      const [property, change] = this.directionUpdate[this.direction];

      // Either x or y gets changed.
      this[property] += change;
      
      this.movingProgressRemaining -= 1;

      if (this.movingProgressRemaining === 0) {
        this.intentPosition = null;

        // Allows us to check the space for any potential cutscenes.
        utils.createEvent("PersonWalkingComplete", {
          whoId: this.id,
        })
      }
  }

  // Changes the direction of the sprite.
  updateSprite() {
    if (this.movingProgressRemaining > 0) {
      this.sprite.setAnimation("walk-" + this.direction);
      return;
    }
    this.sprite.setAnimation("idle-" + this.direction);
  }
}
