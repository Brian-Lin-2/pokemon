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

      // Update all objects. Ensures that when we draw the sprites, no visual glitches occur.
      Object.values(this.map.gameObjects).forEach(object => {
        object.update({
          arrow: this.directionInput.direction,
          map: this.map,
        })
      })

      this.map.drawLowerImage(this.ctx, camera);

      // Object.values() converts an object into an array.
      Object.values(this.map.gameObjects).sort((a,b) => {
        // Makes sure characters are layered correctly.
        return a.y - b.y;
      }).forEach(object => {
        object.sprite.draw(this.ctx, camera);
      })

      this.map.drawUpperImage(this.ctx, camera);

      // Fires off step again after the new frame is loaded.
      // Callbcak function which will prevent an infinite loop.
      requestAnimationFrame(() => {
        step();
      })
    }
    step();
  }

  checkActionInput() {
    // Checks for interactiivty with objects.
    new KeyPressListener("Space", () => {
      this.map.interact();
    })
  }

  checkHeroPosition() {
    document.addEventListener("PersonWalkingComplete", e => {
      if (e.detail.whoId === "hero") {
        // Hero's position has changed.
        this.map.stepCutscene();
      }
    })
  }

  startMap(map) {
    this.map = new Map(map);
    this.map.overworld = this;
    this.map.mountObjects();

    if (map.lowerSrc === "/images/maps/HeroHomeLower.png") {
      this.map.startCutscene([
        { who: "mom", type:"stand", direction: "left", time: 1000 },
        { type: "message", text: "Oh!" },
        { who: "mom", type:"stand", direction: "right", time: 500 },
        { type: "message", text: "You're finally up!" },
        { type: "message", text: "You're going to be late." },
        { type: "message", text: "The professor was looking for you." },
        { type: "message", text: "wait..." },
        { who: "mom", type:"walk", direction: "right" },
        { who: "mom", type:"walk", direction: "up" },
        { who: "mom", type:"walk", direction: "up" },
        { who: "mom", type:"stand", direction: "right" },
        { type: "message", text: "Did you wet your bed again?" },
        { type: "message", text: "You were talking about striking down giratina." },
        { type: "message", text: "What a loser haha." },
        { type: "message", text: "Move along now kiddo." },
      ])
    }
  }

  init() {
    this.startMap(maps.HeroBedroom);

    // Hero movement.
    this.directionInput = new DirectionInput();
    this.directionInput.init();

    // Tracks hero input and position.
    this.checkActionInput();
    this.checkHeroPosition();

    // Constantly refreshes the game.
    this.startGameLoop();

    this.map.startCutscene([
      { type: "message", text: "You are challenged by <br /> Loser Trainer Ashley!" },
    ])
  }
}
