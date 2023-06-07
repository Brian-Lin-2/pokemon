class Person extends GameObject {
  constructor(config) {
    super(config);

    // Locks them to the grid (can't stop halfway).
    this.movementProgressRemaining = 16;

    this.directionUpdate = {
      "up": ["y", -1],
      "down": ["y", 1],
      "left": ["x", -1],
      "right": ["x", -1],
    }
  }

  update() {
    if (this.movementProgressRemaining > 0) {
      const [property, change] = this.directionUpdate[this.direction];
      this[property] += change;
      this.movementProgressRemaining -= 1;
    }
  }
}