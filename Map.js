class Map {
  constructor(config) {
    this.gameObjects = config.gameObjects;
    this.walls = config.walls || {};

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

  isSpaceTaken(currentX, currentY, direction) {
    const {x,y} = utils.nextPosition(currentX, currentY, direction);
    return this.walls[`${x},${y}`] || false;
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
    },
    walls: {
      // Dynamic key equivalent to "num, num": true
      [utils.asGridCoord(7,6)] : true,
      [utils.asGridCoord(8,6)] : true,
      [utils.asGridCoord(7,7)] : true,
      [utils.asGridCoord(8,7)] : true,
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
      }),
      npc1: new Person({
        x: utils.grid(5),
        y: utils.grid(15),
        src: "/images/characters/people/mom.png"
      }),
      npc2: new Person({
        x: utils.grid(14),
        y: utils.grid(17),
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
      }),
      mom: new Person({
        x: utils.grid(7),
        y: utils.grid(4),
        src: "images/characters/people/mom.png"
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
      }),
      rivalMom: new Person({
        x: utils.grid(5),
        y: utils.grid(4),
        src: "images/characters/people/red.png"
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
      }),
      rival: new Person({
        x: utils.grid(5),
        y: utils.grid(4),
        src: "images/characters/people/mom.png"
      }),
      professor: new Person({
        x: utils.grid(6),
        y: utils.grid(3),
        src: "images/characters/people/red.png"
      })
    }
  },
}