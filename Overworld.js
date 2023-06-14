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

      // Camera for hero.
      const camera = this.map.gameObjects.hero;

      // Update all objects.
      Object.values(this.map.gameObjects).forEach(object => {
        object.update({
          arrow: this.directionInput.direction,
          map: this.map,
        })
      })

      this.map.drawLowerImage(this.ctx, camera);

      // Object.values() converts an object into an array.
      Object.values(this.map.gameObjects).forEach(object => {
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
    this.map.mountObjects();

    this.directionInput = new DirectionInput();
    this.directionInput.init();

    this.startGameLoop();
  }
}