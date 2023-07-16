class DirectionInput {
  constructor() {
    this.heldDirections = [];

    this.map = {
      "ArrowUp": "up",
      "KeyW": "up",
      "ArrowLeft": "left",
      "KeyA": "left",
      "ArrowDown": "down",
      "KeyS": "down",
      "ArrowRight": "right",
      "KeyD": "right",
    }
  }

  get direction() {
    return this.heldDirections[0];
  }

  init() {
    document.addEventListener("keydown", (e) => {
      // Only logs necessary keys.
      const dir = this.map[e.code];
      if (dir && this.heldDirections.indexOf(dir) === -1) {
        this.heldDirections.unshift(dir);
      }
    })

    document.addEventListener("keyup", (e) => {
      const dir = this.map[e.code];
      const index = this.heldDirections.indexOf(dir);
      if (index > -1) {
        this.heldDirections.splice(index, 1);
      }
    })
  }
}
