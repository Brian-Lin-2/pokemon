class Overworld {
  constructor(config) {
    this.element = config.element;
    this.canvas = this.element.querySelector(".game-canvas");
    this.ctx = this.canvas.getContext("2d");
    this.map = null;
  }

  startGameLoop() {
    const step = () => {
      // Clears the map.
      this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

      this.map.drawLowerImage(this.ctx);

      // Object.values() converts an object into an array.
      Object.values(this.map.gameObjects).forEach(object => {
        object.update();
        object.sprite.draw(this.ctx);
      })

      this.map.drawUpperImage(this.ctx);

      // Fires after a new frame is loaded.
      requestAnimationFrame(() => {
        step();
      })
    }
    step();
  }

  init() {
    this.map = new Map(maps.PalletTown);
    this.startGameLoop();
  }
}