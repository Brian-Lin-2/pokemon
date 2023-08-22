class Overworld {
  constructor(config) {
    this.element = config.element;
    this.canvas = this.element.querySelector(".game-canvas");
    this.ctx = this.canvas.getContext("2d");
    this.map = null;

    // Cutscenes.
    this.tutorialCutscene = true;
    this.homeCutscene = true;
    this.rivalHomeCutscene = true;
    this.labCutscene = false;
    this.endCutscene = true;
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
      // Callback function which will prevent an infinite loop.
      requestAnimationFrame(() => {
        step();
      })
    }
    step();
  }

  checkActionInput() {
    // Checks for interactivity with objects. Exits are not included.
    new KeyPressListener("Enter", () => {
      this.map.interact({ isExit: false });
    })

    new KeyPressListener("Space", () => {
      this.map.interact({ isExit: false });
    })

    // Only for exits.
    document.addEventListener("keydown", (e) => {
      if (e.code == "KeyW" || e.code == "KeyS" || e.code == "KeyA" || e.code == "KeyD" ||
          e.code == "ArrowUp" || e.code == "ArrowDown" || e.code == "ArrowLeft" || e.code == "ArrowRight") {
        this.map.interact({ isExit: true });
      }
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

    if (this.tutorialCutscene && map.lowerSrc === "/images/maps/HeroBedroomLower.png") {
      this.map.startCutscene([
        { type: "playMusic", name: "heroHome" },
        { type: "message", text: "Interact: Use Space or Enter." },
        { type: "message", text: "Movement: Use WASD or Arrow Keys." },
        { type: "message", text: "This is the story of a 10 year old boy named RED." },
        { type: "message", text: "He lives in a world filled with mysterious creatures called POKEMON!" },
        { type: "message", text: "Together with his rival, BLUE, he embarks on a journey of a lifetime." },
      ]);

      this.tutorialCutscene = false;
    }

    if (this.homeCutscene && map.lowerSrc === "/images/maps/HeroHomeLower.png") {
      this.map.startCutscene([
        { who: "mom", type: "stand", direction: "left", time: 1000 },
        { type: "message", text: "Mom: Oh!" },
        { who: "mom", type: "stand", direction: "right", time: 500 },
        { type: "message", text: "You're finally up!" },
        { who: "mom", type: "walk", direction: "right" },
        { who: "mom", type: "walk", direction: "up" },
        { who: "mom", type: "walk", direction: "up" },
        { who: "mom", type: "stand", direction: "right" },
        { type: "message", text: "You're going to be late." },
        { type: "message", text: "I can't believe my son is all grown up now." },
        { type: "message", text: "Becoming a POKÉMON trainer just like your father!" },
        { type: "message", text: "Make sure to call me sometimes okay?" },
        { type: "message", text: "Oh right. BLUE was looking for you. He seemed excited." },
        { type: "message", text: "You should go visit him next door." },
        { who: "mom", type: "walk", direction: "left" },
        { who: "mom", type: "walk", direction: "down" },
        { who: "mom", type: "walk", direction: "down" },
        { who: "mom", type: "stand", direction: "left" },
      ]);

      this.homeCutscene = false;
    }

    if (this.rivalHomeCutscene && map.lowerSrc == "/images/maps/RivalHomeLower.png") {
      this.map.startCutscene([
        { who: "rivalSister", type: "walk", direction: "left" },
        { who: "rivalSister", type: "walk", direction: "down" },
        { who: "rivalSister", type: "walk", direction: "down" },
        { who: "rivalSister", type: "walk", direction: "down"},
        { type: "message", text: "DAISY: Hi RED!" },
        { type: "message", text: "You always have such bad timing!" },
        { type: "message", text: "BLUE just left. He went to OAK's Lab." },
        { type: "message", text: "If you hurry, you might catch up to him." },
        { who: "rivalSister", type: "walk", direction: "up" },
        { who: "rivalSister", type: "walk", direction: "up" },
        { who: "rivalSister", type: "walk", direction: "up" },
        { who: "rivalSister", type: "walk", direction: "right"},
      ]);

      this.rivalHomeCutscene = false;
    }

    if (this.labCutscene && map.lowerSrc === "/images/maps/LabLower.png") {
      this.map.startCutscene([
        { who: "hero", type: "walk", direction: "up" },
        { who: "hero", type: "walk", direction: "up" },
        { who: "hero", type: "walk", direction: "up" },
        { who: "hero", type: "walk", direction: "up" },
        { who: "hero", type: "walk", direction: "up" },
        { who: "hero", type: "walk", direction: "up" },
        { who: "hero", type: "walk", direction: "up" },
        { who: "hero", type: "walk", direction: "up" },
        { who: "rival", type: "stand", direction: "up" },
        { type: "message", text: "BLUE: Gramps! I'm fed up with waiting!"},
        { type: "wait", delay: "1000"},
        { who: "professor", type: "message", text: "OAK: BLUE? Let me think..."},
        { who: "professor", type: "message", text: "Oh, that's right I told you to come! Just wait!"},
        { who: "professor", type: "message", text: "Here, RED."},
        { who: "professor", type: "message", text: "There are three POKÉMON here."},
        { who: "professor", type: "message", text: "Haha!"},
        { who: "professor", type: "message", text: "The POKÉMON are held inside these POKÉBALLS."},
        { who: "professor", type: "message", text: "When I was young, I was a serious POKÉMON TRAINER."},
        { who: "professor", type: "message", text: "But now in my old age, I have only these three left."},
        { who: "professor", type: "message", text: "You can have one. Go on, choose!"},
        { who: "rival", type: "message", text: "BLUE: Hey! Gramps! No fair! What about me?"},
        { who: "professor", type: "message", text: "OAK: Be patient, BLUE. You can have one too!"},
      ]);

      this.labCutscene = false;
    }

    if (playerState.checkpoint["CHOSEN_POKEMON_FINISHED"] && this.endCutscene && map.lowerSrc === "/images/maps/PalletTownLower.png") {
      this.map.startCutscene([
        { type: "message", text: "Thank you for playing my website version of Pokémon FireRed and LeafGreen!" },
        { type: "message", text: "This is all I have created so far, but feel free to explore the rest of the map." },
        { type: "message", text: "There are many other interactions and cutscenes in this game." },
      ])

      this.endCutscene = false;
    }
  }

  init() {
    this.startMap(maps.Lab);

    // Hero movement.
    this.directionInput = new DirectionInput();
    this.directionInput.init();

    // Tracks hero input and position.
    this.checkActionInput();
    this.checkHeroPosition();

    // Constantly refreshes the game.
    this.startGameLoop();
  }
}
