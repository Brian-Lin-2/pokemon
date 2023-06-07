class Map {
  constructor(config) {
    this.gameObjects = config.gameObjects;

    this.lowerImage = new Image();
    this.lowerImage.src = config.lowerSrc;

    this.upperImage = new Image();
    this.upperImage.src = config.upperSrc;
  }

  drawLowerImage(ctx) {
    ctx.drawImage(this.lowerImage, 0, 0);
  }

  drawUpperImage(ctx) {
    ctx.drawImage(this.upperImage, 0, 0);
  }
}

// Global variable.
let maps = {
  Demo: {
    lowerSrc: "/images/maps/DemoLower.png",
    upperSrc: "/images/maps/DemoUpper.png",
    gameObjects: {
      hero: new Person({
        isHero: true,
        x: utils.grid(5),
        y: utils.grid(6),
        src: "/images/characters/people/red.png"
      }),
      mom: new Person({
        x: utils.grid(7),
        y: utils.grid(9),
        src: "images/characters/people/mom.png"
      })
    }
  },
  PalletTown: {
    lowerSrc: "/images/maps/PalletTown.png",
    upperSrc: "",
    gameObjects: {
      hero: new Person({
        isHero: true,
        x: utils.grid(3),
        y: utils.grid(6),
        src: "/images/characters/people/red.png"
      })
    }
  },
}