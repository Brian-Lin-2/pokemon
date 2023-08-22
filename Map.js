class Map {
  constructor(config) {
    this.overworld = null;

    // We use data from configObjects to create gameObjects.
    // Prevents any mutations in the code.
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
      // Edge case for after rival battle.
      if (playerState.checkpoint["BATTLE_COMPLETE"] && obj.id == "rival") {
        return false;
      }

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

      let instance;
      if (object.type === "Person") {
        instance = new Person(object);
      }
      if (object.type === "Pokeball") {
        instance = new Pokeball(object);
      }
      if (object.type === "GameObject") {
        instance = new GameObject(object);
      }

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
      const result = await eventHandler.init();
      if (result == false) {
        break;
      }
    }

    this.isCutscenePlaying = false;
  }

  interact({ isExit }) {
    const hero = this.gameObjects["hero"];

    // Scans the pixel in front of the hero for an object.
    const nextCoords = utils.nextPosition(hero.x, hero.y, hero.direction);
    const match = Object.values(this.gameObjects).find(object => {
      // Exits have a different interaction.
      if (isExit) { if (!object.id.includes("exit")) return }
      return `${object.x},${object.y}` === `${nextCoords.x},${nextCoords.y}`
    });

    if (!this.isCutscenePlaying && match && match.action.length > 0) {
      const scenario = match.action.find(scenario => {
        return (scenario.required || []).every(cp => {
          return playerState.checkpoint[cp];
        })
      })

      scenario && this.startCutscene(scenario.events);
    }
  }

  stepCutscene() {
    const hero = this.gameObjects["hero"];
    const match = this.cutsceneSpaces[ `${hero.x},${hero.y}`]

    if (!this.isCutscenePlaying && match && match.length > 0) {
      const scenario = match.find(scenario => {
        return (scenario.required || []).every(cp => {
          return playerState.checkpoint[cp];
        })
      })

      scenario && this.startCutscene(scenario.events);
    }
  }
}

// Global variable.
let maps = {
  Demo: {
    lowerSrc: "/images/maps/DemoLower.png",
    upperSrc: "/images/maps/DemoUpper.png",
    configObjects: {
      hero: {
        type: "Person",
        isHero: true,
        x: utils.grid(5),
        y: utils.grid(6),
        direction: "down",
        src: "/images/characters/people/red.png"
      },
      mom: {
        type: "Person",
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
        action: [
          {
            events: [
              { who: "mom", type: "walk", direction: "left" },
            ]
          }
        ]
      },
      pokeball: {
        type: "Pokeball",
        x: utils.grid(3),
        y: utils.grid(9),
        action: [
          {
            required: ["CHOSEN_POKEMON_HERO"],
            events: []
          },
          {
            events: [
              { type: "message", text: "test" },
            ]
          }
        ]
      },
      test: {
        type: "GameObject",
        x: utils.grid(4),
        y: utils.grid(9),
        action: [
          {
            events: [
              { type: "message", text: "test" },
            ]
          }
        ]
      },
      exit_1: {
        type: "GameObject",
        x: utils.grid(5),
        y: utils.grid(9),
        action: [
          {
            events: [
              { type: "message", text: "test" },
              { who: "hero", type: "stand", direction: "up" },
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
      [utils.asGridCoord(5, 10)]: true,
    },
    cutsceneSpaces: {
      [utils.asGridCoord(7,4)]: [
        {
          events: [
            { type: "message", text: "door" }
          ]
        }
      ],
    }
  },
  PalletTown: {
    lowerSrc: "/images/maps/PalletTownLower.png",
    upperSrc: "/images/maps/PalletTownUpper.png",
    configObjects: {
      hero: {
        type: "Person",
        isHero: true,
        x: utils.grid(6),
        y: utils.grid(8),
        direction: "down",
        src: "/images/characters/people/red.png"
      },
      npc1: {
        type: "Person",
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
        action: [
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
        type: "Person",
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
        action: [
          {
            events: [
              { type: "message", text: "Move kiddo.", faceHero:"npc2" },
            ]
          }
        ]
      },
      hero_mailbox: {
        type: "GameObject",
        x: utils.grid(4),
        y: utils.grid(7),
        action: [
          {
            events: [
              { type: "message", text: "RED's Home", interact: "up" },
            ]
          }
        ]
      },
      rival_mailbox: {
        type: "GameObject",
        x: utils.grid(13),
        y: utils.grid(7),
        action: [
          {
            events: [
              { type: "message", text: "BLUE's Home", interact: "up" },
            ]
          }
        ]
      },
      sign_1: {
        type: "GameObject",
        x: utils.grid(9),
        y: utils.grid(11),
        action: [
          {
            events: [
              { type: "message", text: "Pallet Town: The Town of Beginnings.", interact: "up" },
            ]
          }
        ]
      },
      sign_2: {
        type: "GameObject",
        x: utils.grid(16),
        y: utils.grid(16),
        action: [
          {
            events: [
              { type: "message", text: "OAK's Lab", interact: "up" },
            ]
          }
        ]
      },
      sign_3: {
        type: "GameObject",
        x: utils.grid(5),
        y: utils.grid(14),
        action: [
          {
            events: [
              { type: "message", text: "Trainer Tip: You can interact with this sign by pressing space/enter!", interact: "up" },
            ]
          }
        ]
      },
      exit_1: {
        type: "GameObject",
        x: utils.grid(6),
        y: utils.grid(7),
        action: [
          {
            events: [
              { type: "playMusic", name: "heroHome" },
              { type: "changeMap", map: "HeroHome", heroPosition: { x: 3, y: 8, direction: "up" } }
            ]
          }
        ]
      },
      exit_2: {
        type: "GameObject",
        x: utils.grid(15),
        y: utils.grid(7),
        action: [
          {
            events: [
              { type: "playMusic", name: "rivalHome" },
              { type: "changeMap", map: "RivalHome", heroPosition: { x: 4, y: 8, direction: "up" } }
            ]
          }
        ]
      },
      exit_3: {
        type: "GameObject",
        x: utils.grid(16),
        y: utils.grid(13),
        action: [
          {
            events: [
              { type: "playMusic", name: "lab" },
              { type: "changeMap", map: "Lab", heroPosition: { x: 6, y: 12, direction: "up" } }
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
      [utils.asGridCoord(6, 7)]: true,
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
      [utils.asGridCoord(15, 7)]: true,
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
      [utils.asGridCoord(16, 13)]: true,
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
      [utils.asGridCoord(12, 0)]: [
        {
          events: [
            { who: "hero", type: "stand", direction: "up", time: 1000 },
            { type: "message", text: "Ah yes the VOID." },
            { type: "message", text: "You don't remember when it first appeared, but it seems to be spreading." },
            { type: "message", text: "Some mysteries are best left unanswered." },
            { who: "hero", type: "stand", direction: "up", time: 2000 },
            { type: "message", text: "You feel uneasy for some reason." },
            { who: "hero", type: "stand", direction: "down" },
          ]
        }
      ],
      [utils.asGridCoord(13, 0)]: [
        {
          events: [
            { who: "hero", type: "stand", direction: "up", time: 1000 },
            { type: "message", text: "Ah yes the void." },
            { type: "message", text: "You don't remember when it first appeared, but it's been with you all your life." },
            { type: "message", text: "You used to stare at the endless abyss for hours on end." },
            { who: "hero", type: "stand", direction: "up", time: 2000 },
            { type: "message", text: "You suddenly have an urge to go to OAK's Lab." },
            { who: "hero", type: "stand", direction: "down" },
          ]
        }
      ],
    }
  },
  HeroBedroom: {
    lowerSrc: "/images/maps/HeroBedroomLower.png",
    // upperSrc: "/images/maps/HeroBedroomUpper.png",
    upperSrc: "",
    configObjects: {
      hero: {
        type: "Person",
        isHero: true,
        x: utils.grid(3),
        y: utils.grid(6),
        direction: "down",
        src: "/images/characters/people/red.png"
      },
      computer: {
        type: "GameObject",
        x: utils.grid(0),
        y: utils.grid(1),
        action: [
          {
            events: [
              { type: "message", text: "You remember how you lost your past 5 League of Legends games." },
              { type: "message", text: "You're not in the mood to use the computer right now." }
            ]
          }
        ]
      },
      cabinet: {
        type: "GameObject",
        x: utils.grid(2),
        y: utils.grid(1),
        action: [
          {
            events: [
              { type: "message", text: "There's multiple versions of your current outfit." },
            ]
          }
        ]
      },
      bookshelf_left: {
        type: "GameObject",
        x: utils.grid(3),
        y: utils.grid(1),
        action: [
          {
            events: [
              { type: "message", text: "It's full of comic books and manga." },
              { type: "message", text: "Guess you're not much of a reader." },
            ]
          }
        ]
      },
      bookshelf_right: {
        type: "GameObject",
        x: utils.grid(4),
        y: utils.grid(1),
        action: [
          {
            events: [
              { type: "message", text: "It's full of comic books and manga." },
              { type: "message", text: "Guess you're not much of a reader." },
            ]
          }
        ]
      },
      switch: {
        type: "GameObject",
        x: utils.grid(5),
        y: utils.grid(5),
        action: [
          {
            events: [
              { type: "message", text: "It's the switch your dad got you for your 8th birthday." },
              { type: "message", text: "He's went out to get milk 2 years ago." },
            ]
          }
        ]
      },
      info: {
        type: "GameObject",
        x: utils.grid(10),
        y: utils.grid(1),
        action: [
          {
            events: [
              { type: "message", text: "To-Do List:" },
              { type: "message", text: "There's nothing written here." },
            ]
          }
        ]
      },
      exit: {
        type: "GameObject",
        x: utils.grid(8),
        y: utils.grid(2),
        action: [
          {
            events: [
              { type: "changeMap", map: "HeroHome", heroPosition: { x: 9, y: 2, direction: "left" } }
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
      [utils.asGridCoord(8, 2)]: true,
      [utils.asGridCoord(8, 3)]: true,

      // Console.
      [utils.asGridCoord(5, 4)]: true,
      [utils.asGridCoord(5, 5)]: true,

      // Bed.
      [utils.asGridCoord(1, 6)]: true,
    },
  },
  HeroHome: {
    lowerSrc: "/images/maps/HeroHomeLower.png",
    upperSrc: "/images/maps/HeroHomeUpper.png",
    configObjects: {
      hero: {
        type: "Person",
        isHero: true,
        x: utils.grid(9),
        y: utils.grid(2),
        direction:"left",
        src: "/images/characters/people/red.png"
      },
      mom: {
        type: "Person",
        x: utils.grid(7),
        y: utils.grid(4),
        direction:"left",
        src: "images/characters/people/mom.png",
        action: [
          {
            events: [
              { type: "message", text: "Mom: ...Right. All boys leave home someday.", faceHero:"mom" },
              { type: "message", text: "It said so on TV." },
              { type: "message", text: "Oh, yes. PROF. OAK, next door, was looking for you." },
              { who: "mom", type: "stand", direction: "left" },
            ]
          }
        ]
      },
      sink_left: {
        type: "GameObject",
        x: utils.grid(0),
        y: utils.grid(1),
        action: [
          {
            events: [
              { type: "message", text: "You washed your hands with soap." },
            ]
          }
        ]
      },
      sink_right: {
        type: "GameObject",
        x: utils.grid(1),
        y: utils.grid(1),
        action: [
          {
            events: [
              { type: "message", text: "You realize there's only one stove top." },
              { type: "message", text: "You begin questioning everything." },
            ]
          }
        ]
      },
      display: {
        type: "GameObject",
        x: utils.grid(2),
        y: utils.grid(1),
        action: [
          {
            events: [
              { type: "message", text: "This is where your trophies are supposed to be." },
              { type: "message", text: "It's empty." },
            ]
          }
        ]
      },
      trash: {
        type: "GameObject",
        x: utils.grid(3),
        y: utils.grid(1),
        action: [
          {
            events: [
              { type: "message", text: "There's nothing in the trash can." },
            ]
          }
        ]
      },
      tv: {
        type: "GameObject",
        x: utils.grid(5),
        y: utils.grid(1),
        action: [
          {
            events: [
              { type: "message", text: "This is a TV." },
            ]
          }
        ]
      },
      exit_1: {
        type: "GameObject",
        x: utils.grid(10),
        y: utils.grid(2),
        action: [
          {
            events: [
              { type: "changeMap", map: "HeroBedroom", heroPosition: { x: 9, y: 2, direction: "right" } }
            ]
          }
        ]
      },
      exit_2: {
        type: "GameObject",
        x: utils.grid(3),
        y: utils.grid(9),
        action: [
          {
            events: [
              { type: "playMusic", name: "palletTown" },
              { type: "changeMap", map: "PalletTown", heroPosition: { x: 6, y: 8, direction: "down" }  }
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
      [utils.asGridCoord(3, 9)]: true,
      [utils.asGridCoord(4, 9)]: true,
      [utils.asGridCoord(5, 9)]: true,
      [utils.asGridCoord(6, 9)]: true,
      [utils.asGridCoord(7, 9)]: true,
      [utils.asGridCoord(8, 9)]: true,
      [utils.asGridCoord(9, 9)]: true,
      [utils.asGridCoord(10, 9)]: true,

      // Stairs.
      [utils.asGridCoord(10, 2)]: true,
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
  },
  RivalHome: {
    lowerSrc: "/images/maps/RivalHomeLower.png",
    upperSrc: "",
    // upperSrc: "/images/maps/RivalHomeUpper.png",
    configObjects: {
      hero: {
        type: "Person",
        isHero: true,
        x: utils.grid(4),
        y: utils.grid(8),
        direction: "up",
        src: "/images/characters/people/red.png"
      },
      rivalSister: {
        type: "Person",
        x: utils.grid(5),
        y: utils.grid(4),
        direction: "right",
        src: "images/characters/people/sister.png",
        action: [
          {
            events: [
              { type: "message", text: "Daisy: Hi, Red!", faceHero:"rivalSister" },
              { type: "message", text: "My brother, BLUE, is out at Grandpa's LAB." },
              { who: "rivalSister", type: "stand", direction: "right" },
            ]
          }
        ]
      },
      sink_left: {
        type: "GameObject",
        x: utils.grid(0),
        y: utils.grid(1),
        action: [
          {
            events: [
              { type: "message", text: "You try washing your hands, but there was no soap." },
            ]
          }
        ]
      },
      sink_right: {
        type: "GameObject",
        x: utils.grid(1),
        y: utils.grid(1),
        action: [
          {
            events: [
              { type: "message", text: "You question why every house only has one stove top." },
            ]
          }
        ]
      },
      display: {
        type: "GameObject",
        x: utils.grid(2),
        y: utils.grid(1),
        action: [
          {
            events: [
              { type: "message", text: "It's filled to the max with trophies." },
            ]
          }
        ]
      },
      trash: {
        type: "GameObject",
        x: utils.grid(3),
        y: utils.grid(1),
        action: [
          {
            events: [
              { type: "message", text: "There's nothing in the trash can." },
            ]
          }
        ]
      },
      tv: {
        type: "GameObject",
        x: utils.grid(5),
        y: utils.grid(1),
        action: [
          {
            events: [
              { type: "message", text: "This is a TV." },
            ]
          }
        ]
      },
      picture: {
        type: "GameObject",
        x: utils.grid(9),
        y: utils.grid(1),
        action: [
          {
            events: [
              { type: "message", text: "It's a picture of BLUE and his family enjoying a picnic." },
            ]
          }
        ]
      },
      bookshelf_left: {
        type: "GameObject",
        x: utils.grid(11),
        y: utils.grid(1),
        action: [
          {
            events: [
              { type: "message", text: "There are many scholary books written by philosophers and mathematicians." },
              { type: "message", text: "You don't undertand any of it." },
            ]
          }
        ]
      },
      bookshelf_right: {
        type: "GameObject",
        x: utils.grid(12),
        y: utils.grid(1),
        action: [
          {
            events: [
              { type: "message", text: "There are many scholary books written by famous philosophers and mathematicians." },
              { type: "message", text: "You don't undertand any of it." },
            ]
          }
        ]
      },
      exit: {
        type: "GameObject",
        x: utils.grid(4),
        y: utils.grid(9),
        action: [
          {
            events: [
              { type: "playMusic", name: "palletTown" },
              { type: "changeMap", map: "PalletTown", heroPosition: { x: 15, y: 8, direction: "down" } },
            ]
          }
        ]
      },
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
      [utils.asGridCoord(4, 9)]: true,
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
  },
  Lab: {
    lowerSrc: "/images/maps/LabLower.png",
    upperSrc: "",
    // upperSrc: "/images/maps/LabUpper.png",
    configObjects: {
      hero: {
        type: "Person",
        isHero: true,
        x: utils.grid(6),
        y: utils.grid(12),
        direction: "up",
        src: "/images/characters/people/red.png"
      },
      rival: {
        type: "Person",
        x: utils.grid(5),
        y: utils.grid(4),
        direction: "down",
        src: "images/characters/people/blue.png",
        action: [
          {
            required: ["CHOSEN_POKEMON_FINISHED"],
            events: [
              { type: "message", text: "Ha! Your POKÉMON is weak just like you.", faceHero: "rival" },
            ]
          },
          {
            events: [
              { type: "message", text: "Hurry up and choose!", faceHero: "rival" },        
            ]
          }
        ]
      },
      professor: {
        type: "Person",
        x: utils.grid(6),
        y: utils.grid(3),
        direction: "down",
        src: "images/characters/people/professor.png",
        action: [
          {
            required: ["CHOSEN_POKEMON_FINISHED"],
            events: [
              { type: "message", text: "The bonds you create with your POKÉMON will last a lifetime!", faceHero: "professor" },
            ]
          },
          {
            events: [
              { type: "message", text: "Take your time there's no rush.", faceHero:"professor" },             
            ]
          }
        ]
      },
      bulbasaur: {
        type: "Pokeball",
        checkpoint: "CHOSEN_POKEMON_BULBASAUR",
        x: utils.grid(8),
        y: utils.grid(4),
        action: [
          {
            required: ["CHOSEN_POKEMON_FINISHED"],
            events: []
          },
          {
            events: [
              { type: "message", text: "Ah! BULBASAUR is a fine choice." },
              { type: "message", text: "It's a gentle but fierce creature with unwavering loyalty to those it loves." },
              { type: "addPokemon", name: "BULBASAUR", hero: "001" },
              { type: "addCheckpoint", checkpoint: "CHOSEN_POKEMON_BULBASAUR" },
              { type: "message", text: "Red received BULBASAUR from Professor Oak!" },
              { who: "rival", type: "stand", direction: "right" },
              { type: "message", text: "BLUE: Could you have chosen any slower?" },
              { who: "rival", type: "walk", direction: "down" },
              { who: "rival", type: "walk", direction: "down" },
              { who: "rival", type: "walk", direction: "right" },
              { who: "rival", type: "walk", direction: "right" },
              { who: "rival", type: "walk", direction: "right" },
              { who: "rival", type: "walk", direction: "right" },
              { who: "rival", type: "walk", direction: "up" },
              { type: "message", text: "I'll choose this one then. I can sense its potential." },
              { type: "message", text: "BLUE received CHARMANDER from Professor Oak!" },
              { type: "addPokemon", name: "CHARMANDER", rival: "004" },
              { type: "addCheckpoint", checkpoint: "CHOSEN_POKEMON_CHARMANDER" },
              { type: "addCheckpoint", checkpoint: "CHOSEN_POKEMON_FINISHED" },
              { type: "addCheckpoint", checkpoint: "RIVAL_2" },
            ]
          }
        ]
      },
      charmander: {
        type: "Pokeball",
        checkpoint: "CHOSEN_POKEMON_CHARMANDER",
        x: utils.grid(9),
        y: utils.grid(4),
        action: [
          {
            required: ["CHOSEN_POKEMON_FINISHED"],
            events: []
          },
          {
            events: [
              { type: "message", text: "Ah! CHARMANDER is a fine choice." },
              { type: "message", text: "It's a stubborn but strong creature with a powerful sense of justice." },
              { type: "addPokemon", name: "CHARMANDER", hero: "004" },
              { type: "addCheckpoint", checkpoint: "CHOSEN_POKEMON_CHARMANDER" },
              { type: "message", text: "Red received CHARMANDER from Professor Oak!" },
              { who: "rival", type: "stand", direction: "right" },
              { type: "message", text: "BLUE: Could you have chosen any slower?" },
              { who: "rival", type: "walk", direction: "down" },
              { who: "rival", type: "walk", direction: "down" },
              { who: "rival", type: "walk", direction: "right" },
              { who: "rival", type: "walk", direction: "right" },
              { who: "rival", type: "walk", direction: "right" },
              { who: "rival", type: "walk", direction: "right" },
              { who: "rival", type: "walk", direction: "right" },
              { who: "rival", type: "walk", direction: "up" },
              { type: "message", text: "I'll choose this one then. I can sense its potential." },
              { type: "message", text: "BLUE received SQUIRTLE from Professor Oak!" },
              { type: "addPokemon", name: "SQUIRTLE", rival: "007" },
              { type: "addCheckpoint", checkpoint: "CHOSEN_POKEMON_SQUIRTLE" },
              { type: "addCheckpoint", checkpoint: "CHOSEN_POKEMON_FINISHED" },
              { type: "addCheckpoint", checkpoint: "RIVAL_3" },
            ]
          }
        ]
      },
      squirtle: {
        type: "Pokeball",
        checkpoint: "CHOSEN_POKEMON_SQUIRTLE",
        x: utils.grid(10),
        y: utils.grid(4),
        action: [
          {
            required: ["CHOSEN_POKEMON_FINISHED"],
            events: []
          },
          {
            events: [
              { type: "message", text: "Ah! SQUIRTLE is a fine choice." },
              { type: "message", text: "It's a friendly and cheerful creature with a laid-back personality." },
              { type: "addPokemon", name: "SQUIRTLE", hero: "007" },
              { type: "addCheckpoint", checkpoint: "CHOSEN_POKEMON_SQUIRTLE" },
              { type: "message", text: "RED received SQUIRTLE from Professor Oak!" },
              { who: "rival", type: "stand", direction: "right" },
              { type: "message", text: "BLUE: Could you have chosen any slower?" },
              { who: "rival", type: "walk", direction: "down" },
              { who: "rival", type: "walk", direction: "down" },
              { who: "rival", type: "walk", direction: "right" },
              { who: "rival", type: "walk", direction: "right" },
              { who: "rival", type: "walk", direction: "right" },
              { who: "rival", type: "walk", direction: "up" },
              { type: "message", text: "I'll choose this one then. I can sense its potential." },
              { type: "message", text: "BLUE received BULBASAUR from Professor Oak!" },
              { type: "addPokemon", name: "BULBASAUR", rival: "001" },
              { type: "addCheckpoint", checkpoint: "CHOSEN_POKEMON_BULBASAUR" },
              { type: "addCheckpoint", checkpoint: "CHOSEN_POKEMON_FINISHED" },
              { type: "addCheckpoint", checkpoint: "RIVAL_1" },
            ]
          }
        ]
      },
      exit: {
        type: "GameObject",
        x: utils.grid(6),
        y: utils.grid(13),
        action: [
          {
            events: [
              { type: "playMusic", name: "palletTown" },
              { type: "changeMap", map: "PalletTown", heroPosition: { x: 16, y: 14, direction: "down" } }
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
      [utils.asGridCoord(6, 13)]: true,
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
      [utils.asGridCoord(5, 9)]: [
        {
          required: ["BATTLE_COMPLETE"],
          events: [
            { type: "remove", who: "rival" },
          ] 
        },
      ],
      [utils.asGridCoord(6, 9)]: [
        {
          required: ["BATTLE_COMPLETE"],
          events: [
            { type: "remove", who: "rival" },
          ] 
        },
      ],
      [utils.asGridCoord(7, 9)]: [
        {
          required: ["BATTLE_COMPLETE"],
          events: [
            { type: "remove", who: "rival" },
          ] 
        },
      ],
      [utils.asGridCoord(5, 8)]: [
        {
          required: ["RIVAL_1"],
          events: [
            { type: "message", text: "BLUE: Hold on!" },
            { who: "rival", type: "stand", direction: "down" },
            { who: "hero", type: "stand", direction: "up" },
            { who: "rival", type: "walk", direction: "down" },
            { who: "rival", type: "walk", direction: "left" },
            { who: "rival", type: "walk", direction: "left" },
            { who: "rival", type: "walk", direction: "left" },
            { who: "rival", type: "walk", direction: "down" },
            { type: "playMusic", name: "rivalBattle" },
            { type: "message", text: "Let me show you the difference in our skill!" },
            { type: "battle" },
            { type: "playMusic", name: "lab" },
            { type: "message", text: "BLUE: Looks like your POKÉMON have a long way to go!" },
            { type: "message", text: "Smell ya later!" },
            { who: "rival", type: "walk", direction: "right" },
            { who: "rival", type: "walk", direction: "down" },
            { who: "rival", type: "walk", direction: "down" },
            { who: "rival", type: "walk", direction: "down" },
            { who: "rival", type: "walk", direction: "down" },
            { who: "rival", type: "walk", direction: "down" },
            { type: "remove", who: "rival" },
            { type: "addCheckpoint", checkpoint: "BATTLE_COMPLETE" },
            { type: "removeCheckpoint", checkpoint: "RIVAL_1" },
          ]
        },
        {
          required: ["RIVAL_2"],
          events: [
            { type: "message", text: "BLUE: Hold on!" },
            { who: "rival", type: "stand", direction: "down" },
            { who: "hero", type: "stand", direction: "up" },
            { who: "rival", type: "walk", direction: "down" },
            { who: "rival", type: "walk", direction: "left" },
            { who: "rival", type: "walk", direction: "left" },
            { who: "rival", type: "walk", direction: "left" },
            { who: "rival", type: "walk", direction: "left" },
            { who: "rival", type: "walk", direction: "down" },
            { type: "playMusic", name: "rivalBattle" },
            { type: "message", text: "Let me show you the difference in our skill!" },
            { type: "battle" },
            { type: "playMusic", name: "lab" },
            { type: "message", text: "BLUE: Looks like your POKÉMON have a long way to go!" },
            { type: "message", text: "Smell ya later!" },
            { who: "rival", type: "walk", direction: "right" },
            { who: "rival", type: "walk", direction: "down" },
            { who: "rival", type: "walk", direction: "down" },
            { who: "rival", type: "walk", direction: "down" },
            { who: "rival", type: "walk", direction: "down" },
            { who: "rival", type: "walk", direction: "down" },
            { type: "remove", who: "rival" },
            { type: "addCheckpoint", checkpoint: "BATTLE_COMPLETE" },
            { type: "removeCheckpoint", checkpoint: "RIVAL_2" },
          ]
        },
        {
          required: ["RIVAL_3"],
          events: [
            { type: "message", text: "BLUE: Hold on!" },
            { who: "rival", type: "stand", direction: "down" },
            { who: "hero", type: "stand", direction: "up" },
            { who: "rival", type: "walk", direction: "down" },
            { who: "rival", type: "walk", direction: "left" },
            { who: "rival", type: "walk", direction: "left" },
            { who: "rival", type: "walk", direction: "left" },
            { who: "rival", type: "walk", direction: "left" },
            { who: "rival", type: "walk", direction: "left" },
            { who: "rival", type: "walk", direction: "down" },
            { type: "playMusic", name: "rivalBattle" },
            { type: "message", text: "Let me show you the difference in our skill!" },
            { type: "battle" },
            { type: "playMusic", name: "lab" },
            { type: "message", text: "BLUE: Looks like your POKÉMON have a long way to go!" },
            { type: "message", text: "Smell ya later!" },
            { who: "rival", type: "walk", direction: "right" },
            { who: "rival", type: "walk", direction: "down" },
            { who: "rival", type: "walk", direction: "down" },
            { who: "rival", type: "walk", direction: "down" },
            { who: "rival", type: "walk", direction: "down" },
            { who: "rival", type: "walk", direction: "down" },
            { type: "remove", who: "rival" },
            { type: "addCheckpoint", checkpoint: "BATTLE_COMPLETE" },
            { type: "removeCheckpoint", checkpoint: "RIVAL_3" },
          ]
        },
        {
          events: []
        },
      ],
      [utils.asGridCoord(6, 8)]: [
        {
          required: ["RIVAL_1"],
          events: [
            { type: "message", text: "BLUE: Hold on!" },
            { who: "rival", type: "stand", direction: "down" },
            { who: "hero", type: "stand", direction: "up" },
            { who: "rival", type: "walk", direction: "down" },
            { who: "rival", type: "walk", direction: "left" },
            { who: "rival", type: "walk", direction: "left" },
            { who: "rival", type: "walk", direction: "down" },
            { type: "playMusic", name: "rivalBattle" },
            { type: "message", text: "Let me show you the difference in our skill!" },
            { type: "battle" },
            { type: "playMusic", name: "lab" },
            { type: "message", text: "BLUE: Looks like your POKÉMON have a long way to go!" },
            { type: "message", text: "Smell ya later!" },
            { who: "rival", type: "walk", direction: "right" },
            { who: "rival", type: "walk", direction: "down" },
            { who: "rival", type: "walk", direction: "down" },
            { who: "rival", type: "walk", direction: "left" },
            { who: "rival", type: "walk", direction: "down" },
            { who: "rival", type: "walk", direction: "down" },
            { who: "rival", type: "walk", direction: "down" },
            { type: "remove", who: "rival" },
            { type: "addCheckpoint", checkpoint: "BATTLE_COMPLETE" },
            { type: "removeCheckpoint", checkpoint: "RIVAL_1" },
          ]
        },
        {
          required: ["RIVAL_2"],
          events: [
            { type: "message", text: "BLUE: Hold on!" },
            { who: "rival", type: "stand", direction: "down" },
            { who: "hero", type: "stand", direction: "up" },
            { who: "rival", type: "walk", direction: "down" },
            { who: "rival", type: "walk", direction: "left" },
            { who: "rival", type: "walk", direction: "left" },
            { who: "rival", type: "walk", direction: "left" },
            { who: "rival", type: "walk", direction: "down" },
            { type: "playMusic", name: "rivalBattle" },
            { type: "message", text: "Let me show you the difference in our skill!" },
            { type: "battle" },
            { type: "playMusic", name: "lab" },
            { type: "message", text: "BLUE: Looks like your POKÉMON have a long way to go!" },
            { type: "message", text: "Smell ya later!" },
            { who: "rival", type: "walk", direction: "right" },
            { who: "rival", type: "walk", direction: "down" },
            { who: "rival", type: "walk", direction: "down" },
            { who: "rival", type: "walk", direction: "left" },
            { who: "rival", type: "walk", direction: "down" },
            { who: "rival", type: "walk", direction: "down" },
            { who: "rival", type: "walk", direction: "down" },
            { type: "remove", who: "rival" },
            { type: "addCheckpoint", checkpoint: "BATTLE_COMPLETE" },
            { type: "removeCheckpoint", checkpoint: "RIVAL_2" },
          ]
        },
        {
          required: ["RIVAL_3"],
          events: [
            { type: "message", text: "BLUE: Hold on!" },
            { who: "rival", type: "stand", direction: "down" },
            { who: "hero", type: "stand", direction: "up" },
            { who: "rival", type: "walk", direction: "down" },
            { who: "rival", type: "walk", direction: "left" },
            { who: "rival", type: "walk", direction: "left" },
            { who: "rival", type: "walk", direction: "left" },
            { who: "rival", type: "walk", direction: "left" },
            { who: "rival", type: "walk", direction: "down" },
            { type: "playMusic", name: "rivalBattle" },
            { type: "message", text: "Let me show you the difference in our skill!" },
            { type: "battle" },
            { type: "playMusic", name: "lab" },
            { type: "message", text: "BLUE: Looks like your POKÉMON have a long way to go!" },
            { type: "message", text: "Smell ya later!" },
            { who: "rival", type: "walk", direction: "right" },
            { who: "rival", type: "walk", direction: "down" },
            { who: "rival", type: "walk", direction: "down" },
            { who: "rival", type: "walk", direction: "left" },
            { who: "rival", type: "walk", direction: "down" },
            { who: "rival", type: "walk", direction: "down" },
            { who: "rival", type: "walk", direction: "down" },
            { type: "remove", who: "rival" },
            { type: "addCheckpoint", checkpoint: "BATTLE_COMPLETE" },
            { type: "removeCheckpoint", checkpoint: "RIVAL_3" },
          ]
        },
        {
          events: []
        },
      ],
      [utils.asGridCoord(7, 8)]: [
        {
          required: ["RIVAL_1"],
          events: [
            { type: "message", text: "BLUE: Hold on!" },
            { who: "rival", type: "stand", direction: "down" },
            { who: "hero", type: "stand", direction: "up" },
            { who: "rival", type: "walk", direction: "down" },
            { who: "rival", type: "walk", direction: "left" },
            { who: "rival", type: "walk", direction: "down" },
            { type: "playMusic", name: "rivalBattle" },
            { type: "message", text: "Let me show you the difference in our skill!" },
            { type: "battle" },
            { type: "playMusic", name: "lab" },
            { type: "message", text: "BLUE: Looks like your POKÉMON have a long way to go!" },
            { type: "message", text: "Smell ya later!" },
            { who: "rival", type: "walk", direction: "left" },
            { who: "rival", type: "walk", direction: "down" },
            { who: "rival", type: "walk", direction: "down" },
            { who: "rival", type: "walk", direction: "down" },
            { who: "rival", type: "walk", direction: "down" },
            { who: "rival", type: "walk", direction: "down" },
            { type: "remove", who: "rival" },
            { type: "addCheckpoint", checkpoint: "BATTLE_COMPLETE" },
            { type: "removeCheckpoint", checkpoint: "RIVAL_1" },
          ]
        },
        {
          required: ["RIVAL_2"],
          events: [
            { type: "message", text: "BLUE: Hold on!" },
            { who: "rival", type: "stand", direction: "down" },
            { who: "hero", type: "stand", direction: "up" },
            { who: "rival", type: "walk", direction: "down" },
            { who: "rival", type: "walk", direction: "left" },
            { who: "rival", type: "walk", direction: "left" },
            { who: "rival", type: "walk", direction: "down" },
            { type: "playMusic", name: "rivalBattle" },
            { type: "message", text: "Let me show you the difference in our skill!" },
            { type: "battle" },
            { type: "playMusic", name: "lab" },
            { type: "message", text: "BLUE: Looks like your POKÉMON have a long way to go!" },
            { type: "message", text: "Smell ya later!" },
            { who: "rival", type: "walk", direction: "left" },
            { who: "rival", type: "walk", direction: "down" },
            { who: "rival", type: "walk", direction: "down" },
            { who: "rival", type: "walk", direction: "down" },
            { who: "rival", type: "walk", direction: "down" },
            { who: "rival", type: "walk", direction: "down" },
            { type: "remove", who: "rival" },
            { type: "addCheckpoint", checkpoint: "BATTLE_COMPLETE" },
            { type: "removeCheckpoint", checkpoint: "RIVAL_2" },
          ]
        },
        {
          required: ["RIVAL_3"],
          events: [
            { type: "message", text: "BLUE: Hold on!" },
            { who: "rival", type: "stand", direction: "down" },
            { who: "hero", type: "stand", direction: "up" },
            { who: "rival", type: "walk", direction: "down" },
            { who: "rival", type: "walk", direction: "left" },
            { who: "rival", type: "walk", direction: "left" },
            { who: "rival", type: "walk", direction: "left" },
            { who: "rival", type: "walk", direction: "down" },
            { type: "playMusic", name: "rivalBattle" },
            { type: "message", text: "Let me show you the difference in our skill!" },
            { type: "battle" },
            { type: "playMusic", name: "lab" },
            { type: "message", text: "BLUE: Looks like your POKÉMON have a long way to go!" },
            { type: "message", text: "Smell ya later!" },
            { who: "rival", type: "walk", direction: "left" },
            { who: "rival", type: "walk", direction: "down" },
            { who: "rival", type: "walk", direction: "down" },
            { who: "rival", type: "walk", direction: "down" },
            { who: "rival", type: "walk", direction: "down" },
            { who: "rival", type: "walk", direction: "down" },
            { type: "remove", who: "rival" },
            { type: "addCheckpoint", checkpoint: "BATTLE_COMPLETE" },
            { type: "removeCheckpoint", checkpoint: "RIVAL_3" },
          ]
        },
        {
          events: []
        },
      ],
    },
  },
}

// Music. Global variable.
const music = {
  heroHome: new Audio("/audio/hero-home.mp3"),
  rivalHome: new Audio("/audio/rival-home.mp3"),
  palletTown: new Audio("/audio/pallet-town.mp3"),
  lab: new Audio("/audio/lab.mp3"),
  rivalBattle: new Audio("/audio/rival-battle.mp3"),
}

let oldSong;
