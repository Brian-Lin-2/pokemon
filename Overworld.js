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

      // Camera for Hero.
      const camera = this.map.gameObjects.hero;

      this.map.drawLowerImage(this.ctx, camera);

      // Object.values() converts an object into an array.
      Object.values(this.map.gameObjects).forEach(object => {
        object.update({
          arrow: this.directionInput.direction
        })
        object.sprite.draw(this.ctx, camera);
      })

      this.map.drawUpperImage(this.ctx, camera);

      // Fires after a new frame is loaded.
      requestAnimationFrame(() => {
        step();
      })
    }
    step();
  }

  init() {
    this.map = new Map(maps.Demo);

    this.directionInput = new DirectionInput();
    this.directionInput.init();

    this.startGameLoop();
  }
}