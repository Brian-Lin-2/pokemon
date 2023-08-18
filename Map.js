class Map {
  constructor(config) {
    this.overworld = null;

    // Fills this with our objectConfigs data onload.
    this.gameObjects = {};

    this.configObjects = config.configObjects;

    this.cutsceneSpaces = config.cutsceneSpaces || {};
    this.walls = config.walls || {};

    this.lowerImage = new Image();
    this.lowerImage.src = config.lowerSrc;

    this.upperImage = new Image();
    this.upperImage.src = config.upperSrc;

    this.isCutscenePlaying = false;
  }

  drawLowerImage(ctx, camera) {
    ctx.drawImage(this.lowerImage, utils.grid(5) - camera.x, utils.grid(4) - camera.y);
  }

  drawUpperImage(ctx, camera) {
    ctx.drawImage(this.upperImage, utils.grid(5) - camera.x, utils.grid(4) - camera.y);
  }

  isSpaceTaken(currentX, currentY, direction) {
    const { x, y } = utils.nextPosition(currentX, currentY, direction);
    
    // Space is taken.
    if (this.walls[`${x},${y}`]) {
      return true;
    }

    // Check for game objects at this position.
    return Object.values(this.gameObjects).find(obj => {
      if (obj.x === x && obj.y === y) {
        return true;
      }

      // Makes sure we can't step on a square an object is moving to.
      if (obj.nextPos && obj.nextPos[0] === x && obj.nextPos[1] === y) {
        return true;
      }

      return false;
    })
  }

  mountObjects() {
    Object.keys(this.configObjects).forEach(key => {
      // Key allows us to identify a specific sprite.
      let object = this.configObjects[key];
      object.id = key;

      // Change later if we have an object that's not a person.
      let instance = new Person(object);

      this.gameObjects[key] = instance;
      this.gameObjects[key].id = key;

      instance.mount(this);
    })
  }

  async startCutscene(events) {
    this.isCutscenePlaying = true;

    // Start a loop of async events and await each one.
    for (let i = 0; i < events.length; i++) {
      const eventHandler = new Event({
        event: events[i],
        map: this,
      })
      await eventHandler.init();
    }

    this.isCutscenePlaying = false;
  }

  interact() {
    const hero = this.gameObjects["hero"];

    // Scans the pixel in front of the hero for an object.
    const nextCoords = utils.nextPosition(hero.x, hero.y, hero.direction);
    const match = Object.values(this.gameObjects).find(object => {
      return `${object.x},${object.y}` === `${nextCoords.x},${nextCoords.y}`
    });

    if (!this.isCutscenePlaying && match && match.talking.length > 0) {
      this.startCutscene(match.talking[0].events);
    }
  }

  stepCutscene() {
    const hero = this.gameObjects["hero"];
    const match = this.cutsceneSpaces[ `${hero.x},${hero.y}`]

    if (!this.isCutscenePlaying && match) {
      this.startCutscene(match[0].events);
    }
  }
}

// Brute force implementation for hero spawn.
// Fix later not the most efficient.
let maps = {
  Demo: {
    lowerSrc: "/images/maps/DemoLower.png",
    upperSrc: "/images/maps/DemoUpper.png",
    configObjects: {
      hero: {
        isHero: true,
        x: utils.grid(5),
        y: utils.grid(6),
        direction: "down",
        src: "/images/characters/people/red.png"
      },
      mom: {
        x: utils.grid(7),
        y: utils.grid(9),
        src: "images/characters/people/mom.png",
        behaviorLoop: [
          { type: "walk", direction: "left" },
          { type: "stand", direction: "left", time: 2000 },
          { type: "walk", direction: "up" },
          { type: "stand", direction: "up", time: 2000 },
          { type: "walk", direction: "right" },
          { type: "stand", direction: "right", time: 2000 },
          { type: "walk", direction: "down" },
          { type: "stand", direction: "down", time: 2000 },
        ],
        talking: [
          {
            events: [
              { type: "message", text: "Mom: ...Right. All boys leave home someday.", faceHero:"mom" },
              { type: "message", text: "It said so on TV." },
              { type: "message", text: "It said so on TV." },
              { type: "message", text: "Oh, yes. PROF. OAK, next door, was looking for you." },
              { type: "stand", direction: "left" },
            ]
          }
        ]
      }
    },
    walls: {
      // Dynamic key equivalent to "num, num": true
      [utils.asGridCoord(7, 6)]: true,
      [utils.asGridCoord(8, 6)]: true,
      [utils.asGridCoord(7, 7)]: true,
      [utils.asGridCoord(8, 7)]: true,
    },
    cutsceneSpaces: {
      [utils.asGridCoord(7,4)]: [
        {
          events: [
            { type: "message", text: "door" }
          ]
        }
      ],
      [utils.asGridCoord(5,10)]: [
        {
          events: [
            { type: "changeMap", map: "HeroHome" }
          ]
        }
      ]
    }
  },
  PalletTown: {
    lowerSrc: "/images/maps/PalletTownLower.png",
    upperSrc: "/images/maps/PalletTownUpper.png",
    configObjects: {
      hero: {
        isHero: true,
        x: utils.grid(6),
        y: utils.grid(8),
        direction: "down",
        src: "/images/characters/people/red.png"
      },
      npc1: {
        x: utils.grid(4),
        y: utils.grid(10),
        src: "/images/characters/people/kid.png",
        behaviorLoop: [
          { type: "walk", direction: "right" },
          { type: "stand", direction: "right", time: 2000 },
          { type: "walk", direction: "right" },
          { type: "stand", direction: "right", time: 2000 },
          { type: "walk", direction: "right" },
          { type: "stand", direction: "right", time: 2000 },
          { type: "walk", direction: "left" },
          { type: "stand", direction: "left", time: 2000 },
          { type: "walk", direction: "left" },
          { type: "stand", direction: "left", time: 2000 },
          { type: "walk", direction: "left" },
          { type: "stand", direction: "left", time: 2000 },
        ],
        talking: [
          // Allows us to store multiple dialogues for specific events.
          {
            events: [
              { type: "message", text: "Hello, I'm four years old!", faceHero:"npc1" },
              { type: "message", text: "You're kind of short! I'm the same height as you!", faceHero:"npc1" },
            ]
          }
        ]
      },
      npc2: {
        x: utils.grid(14),
        y: utils.grid(17),
        src: "/images/characters/people/man.png",
        behaviorLoop: [
          { type: "walk", direction: "right" },
          { type: "stand", direction: "right", time: 2000 },
          { type: "walk", direction: "right" },
          { type: "stand", direction: "right", time: 2000 },
          { type: "walk", direction: "right" },
          { type: "stand", direction: "right", time: 2000 },
          { type: "walk", direction: "left" },
          { type: "stand", direction: "left", time: 2000 },
          { type: "walk", direction: "left" },
          { type: "stand", direction: "left", time: 2000 },
          { type: "walk", direction: "left" },
          { type: "stand", direction: "left", time: 2000 },
        ],
        talking: [
          {
            events: [
              { type: "message", text: "Move kiddo.", faceHero:"npc2" },
            ]
          }
        ]
      }
    },
    walls: {
      // Top Wall.
      [utils.asGridCoord(0, 1)]: true,
      [utils.asGridCoord(1, 1)]: true,
      [utils.asGridCoord(2, 1)]: true,
      [utils.asGridCoord(3, 1)]: true,
      [utils.asGridCoord(4, 1)]: true,
      [utils.asGridCoord(5, 1)]: true,
      [utils.asGridCoord(6, 1)]: true,
      [utils.asGridCoord(7, 1)]: true,
      [utils.asGridCoord(8, 1)]: true,
      [utils.asGridCoord(9, 1)]: true,
      [utils.asGridCoord(10, 1)]: true,
      [utils.asGridCoord(11, 0)]: true,
      [utils.asGridCoord(11, 1)]: true,
      [utils.asGridCoord(12, -1)]: true,
      [utils.asGridCoord(13, -1)]: true,
      [utils.asGridCoord(14, 0)]: true,
      [utils.asGridCoord(14, 1)]: true,
      [utils.asGridCoord(15, 1)]: true,
      [utils.asGridCoord(16, 1)]: true,
      [utils.asGridCoord(17, 1)]: true,
      [utils.asGridCoord(18, 1)]: true,
      [utils.asGridCoord(19, 1)]: true,
      [utils.asGridCoord(20, 1)]: true,
      [utils.asGridCoord(21, 1)]: true,
      [utils.asGridCoord(22, 1)]: true,
      [utils.asGridCoord(23, 1)]: true,

      // Left Wall.
      [utils.asGridCoord(1, 1)]: true,
      [utils.asGridCoord(1, 2)]: true,
      [utils.asGridCoord(1, 3)]: true,
      [utils.asGridCoord(1, 4)]: true,
      [utils.asGridCoord(1, 5)]: true,
      [utils.asGridCoord(1, 6)]: true,
      [utils.asGridCoord(1, 7)]: true,
      [utils.asGridCoord(1, 8)]: true,
      [utils.asGridCoord(1, 9)]: true,
      [utils.asGridCoord(1, 10)]: true,
      [utils.asGridCoord(1, 11)]: true,
      [utils.asGridCoord(1, 12)]: true,
      [utils.asGridCoord(1, 13)]: true,
      [utils.asGridCoord(1, 14)]: true,
      [utils.asGridCoord(1, 15)]: true,
      [utils.asGridCoord(1, 16)]: true,
      [utils.asGridCoord(1, 17)]: true,
      [utils.asGridCoord(1, 18)]: true,
      [utils.asGridCoord(1, 19)]: true,

      // Right Wall.
      [utils.asGridCoord(22, 2)]: true,
      [utils.asGridCoord(22, 3)]: true,
      [utils.asGridCoord(22, 4)]: true,
      [utils.asGridCoord(22, 5)]: true,
      [utils.asGridCoord(22, 6)]: true,
      [utils.asGridCoord(22, 7)]: true,
      [utils.asGridCoord(22, 8)]: true,
      [utils.asGridCoord(22, 9)]: true,
      [utils.asGridCoord(22, 10)]: true,
      [utils.asGridCoord(22, 11)]: true,
      [utils.asGridCoord(22, 12)]: true,
      [utils.asGridCoord(22, 13)]: true,
      [utils.asGridCoord(22, 14)]: true,
      [utils.asGridCoord(22, 15)]: true,
      [utils.asGridCoord(22, 16)]: true,
      [utils.asGridCoord(22, 17)]: true,
      [utils.asGridCoord(22, 18)]: true,
      [utils.asGridCoord(22, 19)]: true,

      // Bottom Wall.
      [utils.asGridCoord(0, 20)]: true,
      [utils.asGridCoord(1, 20)]: true,
      [utils.asGridCoord(2, 20)]: true,
      [utils.asGridCoord(3, 20)]: true,
      [utils.asGridCoord(4, 20)]: true,
      [utils.asGridCoord(5, 20)]: true,
      [utils.asGridCoord(6, 20)]: true,
      [utils.asGridCoord(7, 20)]: true,
      [utils.asGridCoord(8, 20)]: true,
      [utils.asGridCoord(9, 20)]: true,
      [utils.asGridCoord(10, 20)]: true,
      [utils.asGridCoord(11, 20)]: true,
      [utils.asGridCoord(12, 20)]: true,
      [utils.asGridCoord(13, 20)]: true,
      [utils.asGridCoord(14, 20)]: true,
      [utils.asGridCoord(15, 20)]: true,
      [utils.asGridCoord(16, 20)]: true,
      [utils.asGridCoord(17, 20)]: true,
      [utils.asGridCoord(18, 20)]: true,
      [utils.asGridCoord(19, 20)]: true,
      [utils.asGridCoord(20, 20)]: true,
      [utils.asGridCoord(21, 20)]: true,
      [utils.asGridCoord(22, 20)]: true,
      [utils.asGridCoord(23, 20)]: true,

      // Hero Home.
      [utils.asGridCoord(5, 5)]: true,
      [utils.asGridCoord(6, 5)]: true,
      [utils.asGridCoord(7, 5)]: true,
      [utils.asGridCoord(8, 5)]: true,
      [utils.asGridCoord(9, 5)]: true,
      [utils.asGridCoord(5, 6)]: true,
      [utils.asGridCoord(6, 6)]: true,
      [utils.asGridCoord(7, 6)]: true,
      [utils.asGridCoord(8, 6)]: true,
      [utils.asGridCoord(9, 6)]: true,
      [utils.asGridCoord(5, 7)]: true,
      // [utils.asGridCoord(6, 7)]: true,
      [utils.asGridCoord(7, 7)]: true,
      [utils.asGridCoord(8, 7)]: true,
      [utils.asGridCoord(9, 7)]: true,
      [utils.asGridCoord(4, 7)]: true,

      // Rival Home.
      [utils.asGridCoord(14, 5)]: true,
      [utils.asGridCoord(15, 5)]: true,
      [utils.asGridCoord(16, 5)]: true,
      [utils.asGridCoord(17, 5)]: true,
      [utils.asGridCoord(18, 5)]: true,
      [utils.asGridCoord(14, 6)]: true,
      [utils.asGridCoord(15, 6)]: true,
      [utils.asGridCoord(16, 6)]: true,
      [utils.asGridCoord(17, 6)]: true,
      [utils.asGridCoord(18, 6)]: true,
      [utils.asGridCoord(14, 7)]: true,
      // [utils.asGridCoord(15, 7)]: true,
      [utils.asGridCoord(16, 7)]: true,
      [utils.asGridCoord(17, 7)]: true,
      [utils.asGridCoord(18, 7)]: true,
      [utils.asGridCoord(13, 7)]: true,

      // Lab.
      [utils.asGridCoord(13, 10)]: true,
      [utils.asGridCoord(14, 10)]: true,
      [utils.asGridCoord(15, 10)]: true,
      [utils.asGridCoord(16, 10)]: true,
      [utils.asGridCoord(17, 10)]: true,
      [utils.asGridCoord(18, 10)]: true,
      [utils.asGridCoord(19, 10)]: true,
      [utils.asGridCoord(13, 11)]: true,
      [utils.asGridCoord(14, 11)]: true,
      [utils.asGridCoord(15, 11)]: true,
      [utils.asGridCoord(16, 11)]: true,
      [utils.asGridCoord(17, 11)]: true,
      [utils.asGridCoord(18, 11)]: true,
      [utils.asGridCoord(19, 11)]: true,
      [utils.asGridCoord(13, 12)]: true,
      [utils.asGridCoord(14, 12)]: true,
      [utils.asGridCoord(15, 12)]: true,
      [utils.asGridCoord(16, 12)]: true,
      [utils.asGridCoord(17, 12)]: true,
      [utils.asGridCoord(18, 12)]: true,
      [utils.asGridCoord(19, 12)]: true,
      [utils.asGridCoord(13, 13)]: true,
      [utils.asGridCoord(14, 13)]: true,
      [utils.asGridCoord(15, 13)]: true,
      // [utils.asGridCoord(16, 13)]: true,
      [utils.asGridCoord(17, 13)]: true,
      [utils.asGridCoord(18, 13)]: true,
      [utils.asGridCoord(19, 13)]: true,

      // Fences.
      [utils.asGridCoord(5, 11)]: true,
      [utils.asGridCoord(6, 11)]: true,
      [utils.asGridCoord(7, 11)]: true,
      [utils.asGridCoord(8, 11)]: true,
      [utils.asGridCoord(9, 11)]: true,
      [utils.asGridCoord(13, 16)]: true,
      [utils.asGridCoord(14, 16)]: true,
      [utils.asGridCoord(15, 16)]: true,
      [utils.asGridCoord(16, 16)]: true,
      [utils.asGridCoord(17, 16)]: true,
      [utils.asGridCoord(18, 16)]: true,

      // Sign.
      [utils.asGridCoord(5, 14)]: true,

      // Water.
      [utils.asGridCoord(7, 17)]: true,
      [utils.asGridCoord(8, 17)]: true,
      [utils.asGridCoord(9, 17)]: true,
      [utils.asGridCoord(10, 17)]: true,
      [utils.asGridCoord(7, 18)]: true,
      [utils.asGridCoord(8, 18)]: true,
      [utils.asGridCoord(9, 18)]: true,
      [utils.asGridCoord(10, 18)]: true,
      [utils.asGridCoord(7, 19)]: true,
      [utils.asGridCoord(8, 19)]: true,
      [utils.asGridCoord(9, 19)]: true,
      [utils.asGridCoord(10, 19)]: true,
    },
    cutsceneSpaces: {
      [utils.asGridCoord(6, 7)]: [
        {
          events: [
            { type: "changeMap", map: "HeroHome2" }
          ]
        }
      ],
      [utils.asGridCoord(15, 7)]: [
        {
          events: [
            { type: "changeMap", map: "RivalHome" }
          ]
        }
      ],
      [utils.asGridCoord(16, 13)]: [
        {
          events: [
            { type: "changeMap", map: "Lab" }
          ]
        }
      ]
    }
  },
  PalletTown2: {
    lowerSrc: "/images/maps/PalletTownLower.png",
    upperSrc: "/images/maps/PalletTownUpper.png",
    configObjects: {
      hero: {
        isHero: true,
        x: utils.grid(15),
        y: utils.grid(8),
        direction: "down",
        src: "/images/characters/people/red.png"
      },
      npc1: {
        x: utils.grid(4),
        y: utils.grid(10),
        src: "/images/characters/people/kid.png",
        behaviorLoop: [
          { type: "walk", direction: "right" },
          { type: "stand", direction: "right", time: 2000 },
          { type: "walk", direction: "right" },
          { type: "stand", direction: "right", time: 2000 },
          { type: "walk", direction: "right" },
          { type: "stand", direction: "right", time: 2000 },
          { type: "walk", direction: "left" },
          { type: "stand", direction: "left", time: 2000 },
          { type: "walk", direction: "left" },
          { type: "stand", direction: "left", time: 2000 },
          { type: "walk", direction: "left" },
          { type: "stand", direction: "left", time: 2000 },
        ],
        talking: [
          // Allows us to store multiple dialogues for specific events.
          {
            events: [
              { type: "message", text: "Hello, I'm four years old!", faceHero:"npc1" },
              { type: "message", text: "You're kind of short! I'm the same height as you!", faceHero:"npc1" },
            ]
          }
        ]
      },
      npc2: {
        x: utils.grid(14),
        y: utils.grid(17),
        src: "/images/characters/people/man.png",
        behaviorLoop: [
          { type: "walk", direction: "right" },
          { type: "stand", direction: "right", time: 2000 },
          { type: "walk", direction: "right" },
          { type: "stand", direction: "right", time: 2000 },
          { type: "walk", direction: "right" },
          { type: "stand", direction: "right", time: 2000 },
          { type: "walk", direction: "left" },
          { type: "stand", direction: "left", time: 2000 },
          { type: "walk", direction: "left" },
          { type: "stand", direction: "left", time: 2000 },
          { type: "walk", direction: "left" },
          { type: "stand", direction: "left", time: 2000 },
        ],
        talking: [
          {
            events: [
              { type: "message", text: "Move kiddo.", faceHero:"npc2" },
            ]
          }
        ]
      }
    },
    walls: {
      // Top Wall.
      [utils.asGridCoord(0, 1)]: true,
      [utils.asGridCoord(1, 1)]: true,
      [utils.asGridCoord(2, 1)]: true,
      [utils.asGridCoord(3, 1)]: true,
      [utils.asGridCoord(4, 1)]: true,
      [utils.asGridCoord(5, 1)]: true,
      [utils.asGridCoord(6, 1)]: true,
      [utils.asGridCoord(7, 1)]: true,
      [utils.asGridCoord(8, 1)]: true,
      [utils.asGridCoord(9, 1)]: true,
      [utils.asGridCoord(10, 1)]: true,
      [utils.asGridCoord(11, 0)]: true,
      [utils.asGridCoord(11, 1)]: true,
      [utils.asGridCoord(12, -1)]: true,
      [utils.asGridCoord(13, -1)]: true,
      [utils.asGridCoord(14, 0)]: true,
      [utils.asGridCoord(14, 1)]: true,
      [utils.asGridCoord(15, 1)]: true,
      [utils.asGridCoord(16, 1)]: true,
      [utils.asGridCoord(17, 1)]: true,
      [utils.asGridCoord(18, 1)]: true,
      [utils.asGridCoord(19, 1)]: true,
      [utils.asGridCoord(20, 1)]: true,
      [utils.asGridCoord(21, 1)]: true,
      [utils.asGridCoord(22, 1)]: true,
      [utils.asGridCoord(23, 1)]: true,

      // Left Wall.
      [utils.asGridCoord(1, 1)]: true,
      [utils.asGridCoord(1, 2)]: true,
      [utils.asGridCoord(1, 3)]: true,
      [utils.asGridCoord(1, 4)]: true,
      [utils.asGridCoord(1, 5)]: true,
      [utils.asGridCoord(1, 6)]: true,
      [utils.asGridCoord(1, 7)]: true,
      [utils.asGridCoord(1, 8)]: true,
      [utils.asGridCoord(1, 9)]: true,
      [utils.asGridCoord(1, 10)]: true,
      [utils.asGridCoord(1, 11)]: true,
      [utils.asGridCoord(1, 12)]: true,
      [utils.asGridCoord(1, 13)]: true,
      [utils.asGridCoord(1, 14)]: true,
      [utils.asGridCoord(1, 15)]: true,
      [utils.asGridCoord(1, 16)]: true,
      [utils.asGridCoord(1, 17)]: true,
      [utils.asGridCoord(1, 18)]: true,
      [utils.asGridCoord(1, 19)]: true,

      // Right Wall.
      [utils.asGridCoord(22, 2)]: true,
      [utils.asGridCoord(22, 3)]: true,
      [utils.asGridCoord(22, 4)]: true,
      [utils.asGridCoord(22, 5)]: true,
      [utils.asGridCoord(22, 6)]: true,
      [utils.asGridCoord(22, 7)]: true,
      [utils.asGridCoord(22, 8)]: true,
      [utils.asGridCoord(22, 9)]: true,
      [utils.asGridCoord(22, 10)]: true,
      [utils.asGridCoord(22, 11)]: true,
      [utils.asGridCoord(22, 12)]: true,
      [utils.asGridCoord(22, 13)]: true,
      [utils.asGridCoord(22, 14)]: true,
      [utils.asGridCoord(22, 15)]: true,
      [utils.asGridCoord(22, 16)]: true,
      [utils.asGridCoord(22, 17)]: true,
      [utils.asGridCoord(22, 18)]: true,
      [utils.asGridCoord(22, 19)]: true,

      // Bottom Wall.
      [utils.asGridCoord(0, 20)]: true,
      [utils.asGridCoord(1, 20)]: true,
      [utils.asGridCoord(2, 20)]: true,
      [utils.asGridCoord(3, 20)]: true,
      [utils.asGridCoord(4, 20)]: true,
      [utils.asGridCoord(5, 20)]: true,
      [utils.asGridCoord(6, 20)]: true,
      [utils.asGridCoord(7, 20)]: true,
      [utils.asGridCoord(8, 20)]: true,
      [utils.asGridCoord(9, 20)]: true,
      [utils.asGridCoord(10, 20)]: true,
      [utils.asGridCoord(11, 20)]: true,
      [utils.asGridCoord(12, 20)]: true,
      [utils.asGridCoord(13, 20)]: true,
      [utils.asGridCoord(14, 20)]: true,
      [utils.asGridCoord(15, 20)]: true,
      [utils.asGridCoord(16, 20)]: true,
      [utils.asGridCoord(17, 20)]: true,
      [utils.asGridCoord(18, 20)]: true,
      [utils.asGridCoord(19, 20)]: true,
      [utils.asGridCoord(20, 20)]: true,
      [utils.asGridCoord(21, 20)]: true,
      [utils.asGridCoord(22, 20)]: true,
      [utils.asGridCoord(23, 20)]: true,

      // Hero Home.
      [utils.asGridCoord(5, 5)]: true,
      [utils.asGridCoord(6, 5)]: true,
      [utils.asGridCoord(7, 5)]: true,
      [utils.asGridCoord(8, 5)]: true,
      [utils.asGridCoord(9, 5)]: true,
      [utils.asGridCoord(5, 6)]: true,
      [utils.asGridCoord(6, 6)]: true,
      [utils.asGridCoord(7, 6)]: true,
      [utils.asGridCoord(8, 6)]: true,
      [utils.asGridCoord(9, 6)]: true,
      [utils.asGridCoord(5, 7)]: true,
      // [utils.asGridCoord(6, 7)]: true,
      [utils.asGridCoord(7, 7)]: true,
      [utils.asGridCoord(8, 7)]: true,
      [utils.asGridCoord(9, 7)]: true,
      [utils.asGridCoord(4, 7)]: true,

      // Rival Home.
      [utils.asGridCoord(14, 5)]: true,
      [utils.asGridCoord(15, 5)]: true,
      [utils.asGridCoord(16, 5)]: true,
      [utils.asGridCoord(17, 5)]: true,
      [utils.asGridCoord(18, 5)]: true,
      [utils.asGridCoord(14, 6)]: true,
      [utils.asGridCoord(15, 6)]: true,
      [utils.asGridCoord(16, 6)]: true,
      [utils.asGridCoord(17, 6)]: true,
      [utils.asGridCoord(18, 6)]: true,
      [utils.asGridCoord(14, 7)]: true,
      // [utils.asGridCoord(15, 7)]: true,
      [utils.asGridCoord(16, 7)]: true,
      [utils.asGridCoord(17, 7)]: true,
      [utils.asGridCoord(18, 7)]: true,
      [utils.asGridCoord(13, 7)]: true,

      // Lab.
      [utils.asGridCoord(13, 10)]: true,
      [utils.asGridCoord(14, 10)]: true,
      [utils.asGridCoord(15, 10)]: true,
      [utils.asGridCoord(16, 10)]: true,
      [utils.asGridCoord(17, 10)]: true,
      [utils.asGridCoord(18, 10)]: true,
      [utils.asGridCoord(19, 10)]: true,
      [utils.asGridCoord(13, 11)]: true,
      [utils.asGridCoord(14, 11)]: true,
      [utils.asGridCoord(15, 11)]: true,
      [utils.asGridCoord(16, 11)]: true,
      [utils.asGridCoord(17, 11)]: true,
      [utils.asGridCoord(18, 11)]: true,
      [utils.asGridCoord(19, 11)]: true,
      [utils.asGridCoord(13, 12)]: true,
      [utils.asGridCoord(14, 12)]: true,
      [utils.asGridCoord(15, 12)]: true,
      [utils.asGridCoord(16, 12)]: true,
      [utils.asGridCoord(17, 12)]: true,
      [utils.asGridCoord(18, 12)]: true,
      [utils.asGridCoord(19, 12)]: true,
      [utils.asGridCoord(13, 13)]: true,
      [utils.asGridCoord(14, 13)]: true,
      [utils.asGridCoord(15, 13)]: true,
      // [utils.asGridCoord(16, 13)]: true,
      [utils.asGridCoord(17, 13)]: true,
      [utils.asGridCoord(18, 13)]: true,
      [utils.asGridCoord(19, 13)]: true,

      // Fences.
      [utils.asGridCoord(5, 11)]: true,
      [utils.asGridCoord(6, 11)]: true,
      [utils.asGridCoord(7, 11)]: true,
      [utils.asGridCoord(8, 11)]: true,
      [utils.asGridCoord(9, 11)]: true,
      [utils.asGridCoord(13, 16)]: true,
      [utils.asGridCoord(14, 16)]: true,
      [utils.asGridCoord(15, 16)]: true,
      [utils.asGridCoord(16, 16)]: true,
      [utils.asGridCoord(17, 16)]: true,
      [utils.asGridCoord(18, 16)]: true,

      // Sign.
      [utils.asGridCoord(5, 14)]: true,

      // Water.
      [utils.asGridCoord(7, 17)]: true,
      [utils.asGridCoord(8, 17)]: true,
      [utils.asGridCoord(9, 17)]: true,
      [utils.asGridCoord(10, 17)]: true,
      [utils.asGridCoord(7, 18)]: true,
      [utils.asGridCoord(8, 18)]: true,
      [utils.asGridCoord(9, 18)]: true,
      [utils.asGridCoord(10, 18)]: true,
      [utils.asGridCoord(7, 19)]: true,
      [utils.asGridCoord(8, 19)]: true,
      [utils.asGridCoord(9, 19)]: true,
      [utils.asGridCoord(10, 19)]: true,
    },
    cutsceneSpaces: {
      [utils.asGridCoord(6, 7)]: [
        {
          events: [
            { type: "changeMap", map: "HeroHome2" }
          ]
        }
      ],
      [utils.asGridCoord(15, 7)]: [
        {
          events: [
            { type: "changeMap", map: "RivalHome" }
          ]
        }
      ],
      [utils.asGridCoord(16, 13)]: [
        {
          events: [
            { type: "changeMap", map: "Lab" }
          ]
        }
      ]
    }
  },
  PalletTown3: {
    lowerSrc: "/images/maps/PalletTownLower.png",
    upperSrc: "/images/maps/PalletTownUpper.png",
    configObjects: {
      hero: {
        isHero: true,
        x: utils.grid(16),
        y: utils.grid(14),
        direction: "down",
        src: "/images/characters/people/red.png"
      },
      npc1: {
        x: utils.grid(4),
        y: utils.grid(10),
        src: "/images/characters/people/kid.png",
        behaviorLoop: [
          { type: "walk", direction: "right" },
          { type: "stand", direction: "right", time: 2000 },
          { type: "walk", direction: "right" },
          { type: "stand", direction: "right", time: 2000 },
          { type: "walk", direction: "right" },
          { type: "stand", direction: "right", time: 2000 },
          { type: "walk", direction: "left" },
          { type: "stand", direction: "left", time: 2000 },
          { type: "walk", direction: "left" },
          { type: "stand", direction: "left", time: 2000 },
          { type: "walk", direction: "left" },
          { type: "stand", direction: "left", time: 2000 },
        ],
        talking: [
          // Allows us to store multiple dialogues for specific events.
          {
            events: [
              { type: "message", text: "Hello, I'm four years old!", faceHero:"npc1" },
              { type: "message", text: "You're kind of short! I'm the same height as you!", faceHero:"npc1" },
            ]
          }
        ]
      },
      npc2: {
        x: utils.grid(14),
        y: utils.grid(17),
        src: "/images/characters/people/man.png",
        behaviorLoop: [
          { type: "walk", direction: "right" },
          { type: "stand", direction: "right", time: 2000 },
          { type: "walk", direction: "right" },
          { type: "stand", direction: "right", time: 2000 },
          { type: "walk", direction: "right" },
          { type: "stand", direction: "right", time: 2000 },
          { type: "walk", direction: "left" },
          { type: "stand", direction: "left", time: 2000 },
          { type: "walk", direction: "left" },
          { type: "stand", direction: "left", time: 2000 },
          { type: "walk", direction: "left" },
          { type: "stand", direction: "left", time: 2000 },
        ],
        talking: [
          {
            events: [
              { type: "message", text: "Move kiddo.", faceHero:"npc2" },
            ]
          }
        ]
      }
    },
    walls: {
      // Top Wall.
      [utils.asGridCoord(0, 1)]: true,
      [utils.asGridCoord(1, 1)]: true,
      [utils.asGridCoord(2, 1)]: true,
      [utils.asGridCoord(3, 1)]: true,
      [utils.asGridCoord(4, 1)]: true,
      [utils.asGridCoord(5, 1)]: true,
      [utils.asGridCoord(6, 1)]: true,
      [utils.asGridCoord(7, 1)]: true,
      [utils.asGridCoord(8, 1)]: true,
      [utils.asGridCoord(9, 1)]: true,
      [utils.asGridCoord(10, 1)]: true,
      [utils.asGridCoord(11, 0)]: true,
      [utils.asGridCoord(11, 1)]: true,
      [utils.asGridCoord(12, -1)]: true,
      [utils.asGridCoord(13, -1)]: true,
      [utils.asGridCoord(14, 0)]: true,
      [utils.asGridCoord(14, 1)]: true,
      [utils.asGridCoord(15, 1)]: true,
      [utils.asGridCoord(16, 1)]: true,
      [utils.asGridCoord(17, 1)]: true,
      [utils.asGridCoord(18, 1)]: true,
      [utils.asGridCoord(19, 1)]: true,
      [utils.asGridCoord(20, 1)]: true,
      [utils.asGridCoord(21, 1)]: true,
      [utils.asGridCoord(22, 1)]: true,
      [utils.asGridCoord(23, 1)]: true,

      // Left Wall.
      [utils.asGridCoord(1, 1)]: true,
      [utils.asGridCoord(1, 2)]: true,
      [utils.asGridCoord(1, 3)]: true,
      [utils.asGridCoord(1, 4)]: true,
      [utils.asGridCoord(1, 5)]: true,
      [utils.asGridCoord(1, 6)]: true,
      [utils.asGridCoord(1, 7)]: true,
      [utils.asGridCoord(1, 8)]: true,
      [utils.asGridCoord(1, 9)]: true,
      [utils.asGridCoord(1, 10)]: true,
      [utils.asGridCoord(1, 11)]: true,
      [utils.asGridCoord(1, 12)]: true,
      [utils.asGridCoord(1, 13)]: true,
      [utils.asGridCoord(1, 14)]: true,
      [utils.asGridCoord(1, 15)]: true,
      [utils.asGridCoord(1, 16)]: true,
      [utils.asGridCoord(1, 17)]: true,
      [utils.asGridCoord(1, 18)]: true,
      [utils.asGridCoord(1, 19)]: true,

      // Right Wall.
      [utils.asGridCoord(22, 2)]: true,
      [utils.asGridCoord(22, 3)]: true,
      [utils.asGridCoord(22, 4)]: true,
      [utils.asGridCoord(22, 5)]: true,
      [utils.asGridCoord(22, 6)]: true,
      [utils.asGridCoord(22, 7)]: true,
      [utils.asGridCoord(22, 8)]: true,
      [utils.asGridCoord(22, 9)]: true,
      [utils.asGridCoord(22, 10)]: true,
      [utils.asGridCoord(22, 11)]: true,
      [utils.asGridCoord(22, 12)]: true,
      [utils.asGridCoord(22, 13)]: true,
      [utils.asGridCoord(22, 14)]: true,
      [utils.asGridCoord(22, 15)]: true,
      [utils.asGridCoord(22, 16)]: true,
      [utils.asGridCoord(22, 17)]: true,
      [utils.asGridCoord(22, 18)]: true,
      [utils.asGridCoord(22, 19)]: true,

      // Bottom Wall.
      [utils.asGridCoord(0, 20)]: true,
      [utils.asGridCoord(1, 20)]: true,
      [utils.asGridCoord(2, 20)]: true,
      [utils.asGridCoord(3, 20)]: true,
      [utils.asGridCoord(4, 20)]: true,
      [utils.asGridCoord(5, 20)]: true,
      [utils.asGridCoord(6, 20)]: true,
      [utils.asGridCoord(7, 20)]: true,
      [utils.asGridCoord(8, 20)]: true,
      [utils.asGridCoord(9, 20)]: true,
      [utils.asGridCoord(10, 20)]: true,
      [utils.asGridCoord(11, 20)]: true,
      [utils.asGridCoord(12, 20)]: true,
      [utils.asGridCoord(13, 20)]: true,
      [utils.asGridCoord(14, 20)]: true,
      [utils.asGridCoord(15, 20)]: true,
      [utils.asGridCoord(16, 20)]: true,
      [utils.asGridCoord(17, 20)]: true,
      [utils.asGridCoord(18, 20)]: true,
      [utils.asGridCoord(19, 20)]: true,
      [utils.asGridCoord(20, 20)]: true,
      [utils.asGridCoord(21, 20)]: true,
      [utils.asGridCoord(22, 20)]: true,
      [utils.asGridCoord(23, 20)]: true,

      // Hero Home.
      [utils.asGridCoord(5, 5)]: true,
      [utils.asGridCoord(6, 5)]: true,
      [utils.asGridCoord(7, 5)]: true,
      [utils.asGridCoord(8, 5)]: true,
      [utils.asGridCoord(9, 5)]: true,
      [utils.asGridCoord(5, 6)]: true,
      [utils.asGridCoord(6, 6)]: true,
      [utils.asGridCoord(7, 6)]: true,
      [utils.asGridCoord(8, 6)]: true,
      [utils.asGridCoord(9, 6)]: true,
      [utils.asGridCoord(5, 7)]: true,
      // [utils.asGridCoord(6, 7)]: true,
      [utils.asGridCoord(7, 7)]: true,
      [utils.asGridCoord(8, 7)]: true,
      [utils.asGridCoord(9, 7)]: true,
      [utils.asGridCoord(4, 7)]: true,

      // Rival Home.
      [utils.asGridCoord(14, 5)]: true,
      [utils.asGridCoord(15, 5)]: true,
      [utils.asGridCoord(16, 5)]: true,
      [utils.asGridCoord(17, 5)]: true,
      [utils.asGridCoord(18, 5)]: true,
      [utils.asGridCoord(14, 6)]: true,
      [utils.asGridCoord(15, 6)]: true,
      [utils.asGridCoord(16, 6)]: true,
      [utils.asGridCoord(17, 6)]: true,
      [utils.asGridCoord(18, 6)]: true,
      [utils.asGridCoord(14, 7)]: true,
      // [utils.asGridCoord(15, 7)]: true,
      [utils.asGridCoord(16, 7)]: true,
      [utils.asGridCoord(17, 7)]: true,
      [utils.asGridCoord(18, 7)]: true,
      [utils.asGridCoord(13, 7)]: true,

      // Lab.
      [utils.asGridCoord(13, 10)]: true,
      [utils.asGridCoord(14, 10)]: true,
      [utils.asGridCoord(15, 10)]: true,
      [utils.asGridCoord(16, 10)]: true,
      [utils.asGridCoord(17, 10)]: true,
      [utils.asGridCoord(18, 10)]: true,
      [utils.asGridCoord(19, 10)]: true,
      [utils.asGridCoord(13, 11)]: true,
      [utils.asGridCoord(14, 11)]: true,
      [utils.asGridCoord(15, 11)]: true,
      [utils.asGridCoord(16, 11)]: true,
      [utils.asGridCoord(17, 11)]: true,
      [utils.asGridCoord(18, 11)]: true,
      [utils.asGridCoord(19, 11)]: true,
      [utils.asGridCoord(13, 12)]: true,
      [utils.asGridCoord(14, 12)]: true,
      [utils.asGridCoord(15, 12)]: true,
      [utils.asGridCoord(16, 12)]: true,
      [utils.asGridCoord(17, 12)]: true,
      [utils.asGridCoord(18, 12)]: true,
      [utils.asGridCoord(19, 12)]: true,
      [utils.asGridCoord(13, 13)]: true,
      [utils.asGridCoord(14, 13)]: true,
      [utils.asGridCoord(15, 13)]: true,
      // [utils.asGridCoord(16, 13)]: true,
      [utils.asGridCoord(17, 13)]: true,
      [utils.asGridCoord(18, 13)]: true,
      [utils.asGridCoord(19, 13)]: true,

      // Fences.
      [utils.asGridCoord(5, 11)]: true,
      [utils.asGridCoord(6, 11)]: true,
      [utils.asGridCoord(7, 11)]: true,
      [utils.asGridCoord(8, 11)]: true,
      [utils.asGridCoord(9, 11)]: true,
      [utils.asGridCoord(13, 16)]: true,
      [utils.asGridCoord(14, 16)]: true,
      [utils.asGridCoord(15, 16)]: true,
      [utils.asGridCoord(16, 16)]: true,
      [utils.asGridCoord(17, 16)]: true,
      [utils.asGridCoord(18, 16)]: true,

      // Sign.
      [utils.asGridCoord(5, 14)]: true,

      // Water.
      [utils.asGridCoord(7, 17)]: true,
      [utils.asGridCoord(8, 17)]: true,
      [utils.asGridCoord(9, 17)]: true,
      [utils.asGridCoord(10, 17)]: true,
      [utils.asGridCoord(7, 18)]: true,
      [utils.asGridCoord(8, 18)]: true,
      [utils.asGridCoord(9, 18)]: true,
      [utils.asGridCoord(10, 18)]: true,
      [utils.asGridCoord(7, 19)]: true,
      [utils.asGridCoord(8, 19)]: true,
      [utils.asGridCoord(9, 19)]: true,
      [utils.asGridCoord(10, 19)]: true,
    },
    cutsceneSpaces: {
      [utils.asGridCoord(6, 7)]: [
        {
          events: [
            { type: "changeMap", map: "HeroHome2" }
          ]
        }
      ],
      [utils.asGridCoord(15, 7)]: [
        {
          events: [
            { type: "changeMap", map: "RivalHome" }
          ]
        }
      ],
      [utils.asGridCoord(16, 13)]: [
        {
          events: [
            { type: "changeMap", map: "Lab" }
          ]
        }
      ]
    }
  },
  HeroBedroom: {
    lowerSrc: "/images/maps/HeroBedroomLower.png",
    // upperSrc: "/images/maps/HeroBedroomUpper.png",
    upperSrc: "",
    configObjects: {
      hero: {
        type: "person",
        isHero: true,
        x: utils.grid(3),
        y: utils.grid(6),
        direction: "down",
        src: "/images/characters/people/red.png"
      }
    },
    walls: {
      // Top wall.
      [utils.asGridCoord(0, 1)]: true,
      [utils.asGridCoord(1, 1)]: true,
      [utils.asGridCoord(2, 1)]: true,
      [utils.asGridCoord(3, 1)]: true,
      [utils.asGridCoord(4, 1)]: true,
      [utils.asGridCoord(5, 1)]: true,
      [utils.asGridCoord(6, 1)]: true,
      [utils.asGridCoord(7, 1)]: true,
      [utils.asGridCoord(8, 1)]: true,
      [utils.asGridCoord(9, 1)]: true,
      [utils.asGridCoord(10, 1)]: true,

      // Left wall.
      [utils.asGridCoord(-1, 2)]: true,
      [utils.asGridCoord(-1, 3)]: true,
      [utils.asGridCoord(-1, 4)]: true,
      [utils.asGridCoord(-1, 5)]: true,
      [utils.asGridCoord(-1, 6)]: true,
      [utils.asGridCoord(-1, 7)]: true,
      [utils.asGridCoord(-1, 8)]: true,

      // Right wall.
      [utils.asGridCoord(11, 2)]: true,
      [utils.asGridCoord(11, 3)]: true,
      [utils.asGridCoord(11, 4)]: true,
      [utils.asGridCoord(11, 5)]: true,
      [utils.asGridCoord(11, 6)]: true,
      [utils.asGridCoord(11, 7)]: true,
      [utils.asGridCoord(11, 8)]: true,

      // Bottom wall.
      [utils.asGridCoord(1, 9)]: true,
      [utils.asGridCoord(2, 9)]: true,
      [utils.asGridCoord(3, 9)]: true,
      [utils.asGridCoord(4, 9)]: true,
      [utils.asGridCoord(5, 9)]: true,
      [utils.asGridCoord(6, 9)]: true,
      [utils.asGridCoord(7, 9)]: true,
      [utils.asGridCoord(8, 9)]: true,
      [utils.asGridCoord(9, 9)]: true,
      [utils.asGridCoord(10, 9)]: true,

      // Stairs.
      [utils.asGridCoord(7, 2)]: true,
      [utils.asGridCoord(7, 3)]: true,
      [utils.asGridCoord(8, 3)]: true,

      // Console.
      [utils.asGridCoord(5, 4)]: true,
      [utils.asGridCoord(5, 5)]: true,

      // Bed.
      [utils.asGridCoord(1, 6)]: true,
    },
    cutsceneSpaces: {
      [utils.asGridCoord(8, 2)]: [
        {
          events: [
            { type: "changeMap", map: "HeroHome", coords: "8,2" }
          ]
        }
      ]
    },
  },
  HeroBedroom2: {
    lowerSrc: "/images/maps/HeroBedroomLower.png",
    // upperSrc: "/images/maps/HeroBedroomUpper.png",
    upperSrc: "",
    configObjects: {
      hero: {
        type: "person",
        isHero: true,
        x: utils.grid(9),
        y: utils.grid(2),
        direction: "right",
        src: "/images/characters/people/red.png"
      }
    },
    walls: {
      // Top wall.
      [utils.asGridCoord(0, 1)]: true,
      [utils.asGridCoord(1, 1)]: true,
      [utils.asGridCoord(2, 1)]: true,
      [utils.asGridCoord(3, 1)]: true,
      [utils.asGridCoord(4, 1)]: true,
      [utils.asGridCoord(5, 1)]: true,
      [utils.asGridCoord(6, 1)]: true,
      [utils.asGridCoord(7, 1)]: true,
      [utils.asGridCoord(8, 1)]: true,
      [utils.asGridCoord(9, 1)]: true,
      [utils.asGridCoord(10, 1)]: true,

      // Left wall.
      [utils.asGridCoord(-1, 2)]: true,
      [utils.asGridCoord(-1, 3)]: true,
      [utils.asGridCoord(-1, 4)]: true,
      [utils.asGridCoord(-1, 5)]: true,
      [utils.asGridCoord(-1, 6)]: true,
      [utils.asGridCoord(-1, 7)]: true,
      [utils.asGridCoord(-1, 8)]: true,

      // Right wall.
      [utils.asGridCoord(11, 2)]: true,
      [utils.asGridCoord(11, 3)]: true,
      [utils.asGridCoord(11, 4)]: true,
      [utils.asGridCoord(11, 5)]: true,
      [utils.asGridCoord(11, 6)]: true,
      [utils.asGridCoord(11, 7)]: true,
      [utils.asGridCoord(11, 8)]: true,

      // Bottom wall.
      [utils.asGridCoord(1, 9)]: true,
      [utils.asGridCoord(2, 9)]: true,
      [utils.asGridCoord(3, 9)]: true,
      [utils.asGridCoord(4, 9)]: true,
      [utils.asGridCoord(5, 9)]: true,
      [utils.asGridCoord(6, 9)]: true,
      [utils.asGridCoord(7, 9)]: true,
      [utils.asGridCoord(8, 9)]: true,
      [utils.asGridCoord(9, 9)]: true,
      [utils.asGridCoord(10, 9)]: true,

      // Stairs.
      [utils.asGridCoord(7, 2)]: true,
      [utils.asGridCoord(7, 3)]: true,
      [utils.asGridCoord(8, 3)]: true,

      // Console.
      [utils.asGridCoord(5, 4)]: true,
      [utils.asGridCoord(5, 5)]: true,

      // Bed.
      [utils.asGridCoord(1, 6)]: true,
    },
    cutsceneSpaces: {
      [utils.asGridCoord(8, 2)]: [
        {
          events: [
            { type: "changeMap", map: "HeroHome", coords: "8,2" }
          ]
        }
      ]
    },
  },
  HeroHome: {
    lowerSrc: "/images/maps/HeroHomeLower.png",
    upperSrc: "/images/maps/HeroHomeUpper.png",
    configObjects: {
      hero: {
        isHero: true,
        x: utils.grid(9),
        y: utils.grid(2),
        direction:"left",
        src: "/images/characters/people/red.png"
      },
      mom: {
        x: utils.grid(7),
        y: utils.grid(4),
        direction:"left",
        src: "images/characters/people/mom.png",
        talking: [
          {
            events: [
              { type: "message", text: "Mom: ...Right. All boys leave home someday.", faceHero:"mom" },
              { type: "message", text: "It said so on TV." },
              { type: "message", text: "Oh, yes. PROF. OAK, next door, was looking for you." },
              { who: "mom", type: "stand", direction: "left" },
            ]
          }
        ]
      }
    },
    walls: {
      // Top wall.
      [utils.asGridCoord(0, 1)]: true,
      [utils.asGridCoord(1, 1)]: true,
      [utils.asGridCoord(2, 1)]: true,
      [utils.asGridCoord(3, 1)]: true,
      [utils.asGridCoord(4, 1)]: true,
      [utils.asGridCoord(5, 1)]: true,
      [utils.asGridCoord(6, 1)]: true,
      [utils.asGridCoord(7, 1)]: true,
      [utils.asGridCoord(8, 1)]: true,
      [utils.asGridCoord(9, 1)]: true,
      [utils.asGridCoord(10, 1)]: true,

      // Left wall.
      [utils.asGridCoord(-1, 2)]: true,
      [utils.asGridCoord(-1, 3)]: true,
      [utils.asGridCoord(-1, 4)]: true,
      [utils.asGridCoord(-1, 5)]: true,
      [utils.asGridCoord(-1, 6)]: true,
      [utils.asGridCoord(-1, 7)]: true,
      [utils.asGridCoord(-1, 8)]: true,

      // Right wall.
      [utils.asGridCoord(12, 2)]: true,
      [utils.asGridCoord(12, 3)]: true,
      [utils.asGridCoord(12, 4)]: true,
      [utils.asGridCoord(12, 5)]: true,
      [utils.asGridCoord(12, 6)]: true,
      [utils.asGridCoord(12, 7)]: true,
      [utils.asGridCoord(12, 8)]: true,
      [utils.asGridCoord(12, 9)]: true,

      // Bottom wall.
      [utils.asGridCoord(0, 9)]: true,
      [utils.asGridCoord(1, 9)]: true,
      [utils.asGridCoord(2, 9)]: true,
      // [utils.asGridCoord(3, 9)]: true,
      [utils.asGridCoord(4, 9)]: true,
      [utils.asGridCoord(5, 9)]: true,
      [utils.asGridCoord(6, 9)]: true,
      [utils.asGridCoord(7, 9)]: true,
      [utils.asGridCoord(8, 9)]: true,
      [utils.asGridCoord(9, 9)]: true,
      [utils.asGridCoord(10, 9)]: true,

      // Stairs.
      // [utils.asGridCoord(10, 2)]: true,
      [utils.asGridCoord(11, 2)]: true,
      [utils.asGridCoord(10, 3)]: true,
      [utils.asGridCoord(11, 3)]: true,

      // Plants.
      [utils.asGridCoord(0, 7)]: true,
      [utils.asGridCoord(11, 7)]: true,

      // Table.
      [utils.asGridCoord(5, 4)]: true,
      [utils.asGridCoord(5, 5)]: true,
      [utils.asGridCoord(6, 4)]: true,
      [utils.asGridCoord(6, 5)]: true,
    },
    cutsceneSpaces: {
      [utils.asGridCoord(10, 2)]: [
        {
          events: [
            { type: "changeMap", map: "HeroBedroom2" }
          ]
        }
      ],
      [utils.asGridCoord(3, 9)]: [
        {
          events: [
            { type: "changeMap", map: "PalletTown" }
          ]
        }
      ]
    },
  },
  HeroHome2: {
    lowerSrc: "/images/maps/HeroHomeLower.png",
    upperSrc: "/images/maps/HeroHomeUpper.png",
    configObjects: {
      hero: {
        isHero: true,
        x: utils.grid(3),
        y: utils.grid(8),
        direction:"up",
        src: "/images/characters/people/red.png"
      },
      mom: {
        x: utils.grid(7),
        y: utils.grid(4),
        direction:"left",
        src: "images/characters/people/mom.png",
        talking: [
          {
            events: [
              { type: "message", text: "Mom: ...Right. All boys leave home someday.", faceHero:"mom" },
              { type: "message", text: "It said so on TV." },
              { type: "message", text: "Oh, yes. PROF. OAK, next door, was looking for you." },
              { who: "mom", type: "stand", direction: "left" },
            ]
          }
        ]
      }
    },
    walls: {
      // Top wall.
      [utils.asGridCoord(0, 1)]: true,
      [utils.asGridCoord(1, 1)]: true,
      [utils.asGridCoord(2, 1)]: true,
      [utils.asGridCoord(3, 1)]: true,
      [utils.asGridCoord(4, 1)]: true,
      [utils.asGridCoord(5, 1)]: true,
      [utils.asGridCoord(6, 1)]: true,
      [utils.asGridCoord(7, 1)]: true,
      [utils.asGridCoord(8, 1)]: true,
      [utils.asGridCoord(9, 1)]: true,
      [utils.asGridCoord(10, 1)]: true,

      // Left wall.
      [utils.asGridCoord(-1, 2)]: true,
      [utils.asGridCoord(-1, 3)]: true,
      [utils.asGridCoord(-1, 4)]: true,
      [utils.asGridCoord(-1, 5)]: true,
      [utils.asGridCoord(-1, 6)]: true,
      [utils.asGridCoord(-1, 7)]: true,
      [utils.asGridCoord(-1, 8)]: true,

      // Right wall.
      [utils.asGridCoord(12, 2)]: true,
      [utils.asGridCoord(12, 3)]: true,
      [utils.asGridCoord(12, 4)]: true,
      [utils.asGridCoord(12, 5)]: true,
      [utils.asGridCoord(12, 6)]: true,
      [utils.asGridCoord(12, 7)]: true,
      [utils.asGridCoord(12, 8)]: true,
      [utils.asGridCoord(12, 9)]: true,

      // Bottom wall.
      [utils.asGridCoord(0, 9)]: true,
      [utils.asGridCoord(1, 9)]: true,
      [utils.asGridCoord(2, 9)]: true,
      // [utils.asGridCoord(3, 9)]: true,
      [utils.asGridCoord(4, 9)]: true,
      [utils.asGridCoord(5, 9)]: true,
      [utils.asGridCoord(6, 9)]: true,
      [utils.asGridCoord(7, 9)]: true,
      [utils.asGridCoord(8, 9)]: true,
      [utils.asGridCoord(9, 9)]: true,
      [utils.asGridCoord(10, 9)]: true,

      // Stairs.
      // [utils.asGridCoord(10, 2)]: true,
      [utils.asGridCoord(11, 2)]: true,
      [utils.asGridCoord(10, 3)]: true,
      [utils.asGridCoord(11, 3)]: true,

      // Plants.
      [utils.asGridCoord(0, 7)]: true,
      [utils.asGridCoord(11, 7)]: true,

      // Table.
      [utils.asGridCoord(5, 4)]: true,
      [utils.asGridCoord(5, 5)]: true,
      [utils.asGridCoord(6, 4)]: true,
      [utils.asGridCoord(6, 5)]: true,
    },
    cutsceneSpaces: {
      [utils.asGridCoord(10, 2)]: [
        {
          events: [
            { type: "changeMap", map: "HeroBedroom2" }
          ]
        }
      ],
      [utils.asGridCoord(3, 9)]: [
        {
          events: [
            { type: "changeMap", map: "PalletTown" }
          ]
        }
      ]
    },
  },
  RivalHome: {
    lowerSrc: "/images/maps/RivalHomeLower.png",
    upperSrc: "",
    // upperSrc: "/images/maps/RivalHomeUpper.png",
    configObjects: {
      hero: {
        isHero: true,
        x: utils.grid(4),
        y: utils.grid(8),
        direction: "up",
        src: "/images/characters/people/red.png"
      },
      rivalSister: {
        x: utils.grid(5),
        y: utils.grid(4),
        direction: "right",
        src: "images/characters/people/sister.png",
        talking: [
          {
            events: [
              { type: "message", text: "Daisy: Hi, Red!", faceHero:"rivalSister" },
              { type: "message", text: "My brother, BLUE, is out at Grandpa's LAB." },
              { who: "rivalSister", type: "stand", direction: "right" },
            ]
          }
        ]
      }
    },
    walls: {
      // Top wall.
      [utils.asGridCoord(0, 1)]: true,
      [utils.asGridCoord(1, 1)]: true,
      [utils.asGridCoord(2, 1)]: true,
      [utils.asGridCoord(3, 1)]: true,
      [utils.asGridCoord(4, 1)]: true,
      [utils.asGridCoord(5, 1)]: true,
      [utils.asGridCoord(6, 1)]: true,
      [utils.asGridCoord(7, 1)]: true,
      [utils.asGridCoord(8, 1)]: true,
      [utils.asGridCoord(9, 1)]: true,
      [utils.asGridCoord(10, 1)]: true,
      [utils.asGridCoord(11, 1)]: true,
      [utils.asGridCoord(12, 1)]: true,

      // Left wall.
      [utils.asGridCoord(-1, 2)]: true,
      [utils.asGridCoord(-1, 3)]: true,
      [utils.asGridCoord(-1, 4)]: true,
      [utils.asGridCoord(-1, 5)]: true,
      [utils.asGridCoord(-1, 6)]: true,
      [utils.asGridCoord(-1, 7)]: true,
      [utils.asGridCoord(-1, 8)]: true,

      // Right wall.
      [utils.asGridCoord(13, 2)]: true,
      [utils.asGridCoord(13, 3)]: true,
      [utils.asGridCoord(13, 4)]: true,
      [utils.asGridCoord(13, 5)]: true,
      [utils.asGridCoord(13, 6)]: true,
      [utils.asGridCoord(13, 7)]: true,
      [utils.asGridCoord(13, 8)]: true,
      [utils.asGridCoord(13, 9)]: true,

      // Bottom wall.
      [utils.asGridCoord(0, 9)]: true,
      [utils.asGridCoord(1, 9)]: true,
      [utils.asGridCoord(2, 9)]: true,
      [utils.asGridCoord(3, 9)]: true,
      // [utils.asGridCoord(4, 9)]: true,
      [utils.asGridCoord(5, 9)]: true,
      [utils.asGridCoord(6, 9)]: true,
      [utils.asGridCoord(7, 9)]: true,
      [utils.asGridCoord(8, 9)]: true,
      [utils.asGridCoord(9, 9)]: true,
      [utils.asGridCoord(10, 9)]: true,

      // Plants.
      [utils.asGridCoord(0, 8)]: true,
      [utils.asGridCoord(12, 8)]: true,

      // Table.
      [utils.asGridCoord(6, 4)]: true,
      [utils.asGridCoord(6, 5)]: true,
      [utils.asGridCoord(7, 4)]: true,
      [utils.asGridCoord(7, 5)]: true,
    },
    cutsceneSpaces: {
      [utils.asGridCoord(4, 9)]: [
        {
          events: [
            { type: "changeMap", map: "PalletTown2" }
          ]
        }
      ],
    },
  },
  Lab: {
    lowerSrc: "/images/maps/LabLower.png",
    upperSrc: "",
    // upperSrc: "/images/maps/LabUpper.png",
    configObjects: {
      hero: {
        isHero: true,
        x: utils.grid(6),
        y: utils.grid(12),
        direction: "up",
        src: "/images/characters/people/red.png"
      },
      rival: {
        x: utils.grid(5),
        y: utils.grid(4),
        direction: "down",
        src: "images/characters/people/blue.png",
        talking: [
          {
            events: [
              { type: "message", text: "Hurry up and choose!", faceHero:"rival" },             
            ]
          }
        ]
      },
      professor: {
        x: utils.grid(6),
        y: utils.grid(3),
        direction: "down",
        src: "images/characters/people/professor.png",
        talking: [
          {
            events: [
              { type: "message", text: "Take your time there's no rush.", faceHero:"professor" },             
            ]
          }
        ]
      }
    },
    walls: {
      // Top Wall.
      [utils.asGridCoord(0, 1)]: true,
      [utils.asGridCoord(1, 1)]: true,
      [utils.asGridCoord(2, 1)]: true,
      [utils.asGridCoord(3, 1)]: true,
      [utils.asGridCoord(4, 1)]: true,
      [utils.asGridCoord(5, 1)]: true,
      [utils.asGridCoord(6, 1)]: true,
      [utils.asGridCoord(7, 1)]: true,
      [utils.asGridCoord(8, 1)]: true,
      [utils.asGridCoord(9, 1)]: true,
      [utils.asGridCoord(10, 1)]: true,
      [utils.asGridCoord(11, 1)]: true,
      [utils.asGridCoord(12, 1)]: true,

      // Left Wall.
      [utils.asGridCoord(-1, 1)]: true,
      [utils.asGridCoord(-1, 2)]: true,
      [utils.asGridCoord(-1, 3)]: true,
      [utils.asGridCoord(-1, 4)]: true,
      [utils.asGridCoord(-1, 5)]: true,
      [utils.asGridCoord(-1, 6)]: true,
      [utils.asGridCoord(-1, 7)]: true,
      [utils.asGridCoord(-1, 8)]: true,
      [utils.asGridCoord(-1, 9)]: true,
      [utils.asGridCoord(-1, 10)]: true,
      [utils.asGridCoord(-1, 11)]: true,
      [utils.asGridCoord(-1, 12)]: true,

      // Right Wall.
      [utils.asGridCoord(13, 1)]: true,
      [utils.asGridCoord(13, 2)]: true,
      [utils.asGridCoord(13, 3)]: true,
      [utils.asGridCoord(13, 4)]: true,
      [utils.asGridCoord(13, 5)]: true,
      [utils.asGridCoord(13, 6)]: true,
      [utils.asGridCoord(13, 7)]: true,
      [utils.asGridCoord(13, 8)]: true,
      [utils.asGridCoord(13, 9)]: true,
      [utils.asGridCoord(13, 10)]: true,
      [utils.asGridCoord(13, 11)]: true,
      [utils.asGridCoord(13, 12)]: true,

      // Bottom Wall.
      [utils.asGridCoord(0, 13)]: true,
      [utils.asGridCoord(1, 13)]: true,
      [utils.asGridCoord(2, 13)]: true,
      [utils.asGridCoord(3, 13)]: true,
      [utils.asGridCoord(4, 13)]: true,
      [utils.asGridCoord(5, 13)]: true,
      // [utils.asGridCoord(6, 13)]: true,
      [utils.asGridCoord(7, 13)]: true,
      [utils.asGridCoord(8, 13)]: true,
      [utils.asGridCoord(9, 13)]: true,
      [utils.asGridCoord(10, 13)]: true,
      [utils.asGridCoord(11, 13)]: true,
      [utils.asGridCoord(12, 13)]: true,

      // Books.
      [utils.asGridCoord(0, 3)]: true,
      [utils.asGridCoord(0, 4)]: true,

      // Machine.
      [utils.asGridCoord(1, 4)]: true,
      [utils.asGridCoord(2, 4)]: true,
      [utils.asGridCoord(1, 5)]: true,
      [utils.asGridCoord(2, 5)]: true,

      // Table.
      [utils.asGridCoord(8, 4)]: true,
      [utils.asGridCoord(9, 4)]: true,
      [utils.asGridCoord(10, 4)]: true,

      // Bookshelves.
      [utils.asGridCoord(0, 8)]: true,
      [utils.asGridCoord(1, 8)]: true,
      [utils.asGridCoord(2, 8)]: true,
      [utils.asGridCoord(3, 8)]: true,
      [utils.asGridCoord(4, 8)]: true,
      [utils.asGridCoord(8, 8)]: true,
      [utils.asGridCoord(9, 8)]: true,
      [utils.asGridCoord(10, 8)]: true,
      [utils.asGridCoord(11, 8)]: true,
      [utils.asGridCoord(12, 8)]: true,

      // Plants.
      [utils.asGridCoord(0, 12)]: true,
      [utils.asGridCoord(12, 12)]: true,
    },
    cutsceneSpaces: {
      [utils.asGridCoord(6, 13)]: [
        {
          events: [
            { type: "changeMap", map: "PalletTown3" }
          ]
        }
      ],
    },
  },
}
