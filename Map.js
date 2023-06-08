class Map {
  constructor(config) {
    this.gameObjects = config.gameObjects;

    this.lowerImage = new Image();
    this.lowerImage.src = config.lowerSrc;

    this.upperImage = new Image();
    this.upperImage.src = config.upperSrc;
  }

  drawLowerImage(ctx, camera) {
    ctx.drawImage(this.lowerImage, utils.grid(5) - camera.x, utils.grid(4) - camera.y);
  }

  drawUpperImage(ctx, camera) {
    ctx.drawImage(this.upperImage, utils.grid(5) - camera.x, utils.grid(4) - camera.y);
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
  HeroHome: {
    lowerSrc: "/images/maps/HeroHome.png",
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
  HeroBedroom: {
    lowerSrc: "/images/maps/HeroBedroom.png",
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
  RivalHome: {
    lowerSrc: "/images/maps/RivalHome.png",
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
  Lab: {
    lowerSrc: "/images/maps/Lab.png",
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