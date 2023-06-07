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
      hero: new GameObject({
        x: 5,
        y: 6,
        src: "/images/characters/people/red.png"
      }),
      mom: new GameObject({
        x: 7,
        y: 9,
        src: "images/characters/people/mom.png"
      })
    }
  },
  PalletTown: {
    lowerSrc: "/images/maps/PalletTown.png",
    upperSrc: "",
    gameObjects: {
      hero: new GameObject({
        x: utils.grid(3),
        y: utils.grid(6),
        src: "/images/characters/people/red.png"
      })
    }
  },
}