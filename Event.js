class Event {
  constructor({ map, event }) {
    this.map = map;
    this.event = event;
  }

  // resolve() indicates when the behavior is done. Triggers the promise to complete.
  stand(resolve) {
    const person = this.map.gameObjects[ this.event.who ]
    person.startBehavior(
      {
        map: this.map,
      },
      {
        type: "stand",
        direction: this.event.direction,
        time: this.event.time,
      }
    )

    // Creates a handler to check when a person is done walking, then resolves the event.
    const completeHandler = (e) => {
      if (e.detail.whoId === this.event.who) {
        document.removeEventListener("PersonStandComplete", completeHandler);
        resolve();
      }
    }

    // Own custom event.
    document.addEventListener("PersonStandComplete", completeHandler)
  }

  walk(resolve) {
    const person = this.map.gameObjects[ this.event.who ]
    person.startBehavior(
      {
        map: this.map,
      },
      {
        type: "walk",
        direction: this.event.direction,
        retry: true,
      }
    )

    // Creates a handler to check when a person is done walking, then resolves the event.
    const completeHandler = e => {
      if (e.detail.whoId === this.event.who) {
        document.removeEventListener("PersonWalkingComplete", completeHandler);
        resolve();
      }
    }

    document.addEventListener("PersonWalkingComplete", completeHandler)
  }

  message(resolve) {
    // Makes only the indicated direction interactable.
    if (this.event.interact && this.map.gameObjects["hero"].direction != this.event.interact) {
      resolve();
      return;
    }

    // Makes the sprite face the hero.
    if (this.event.faceHero) {
      const obj = this.map.gameObjects[this.event.faceHero];
      obj.direction = utils.oppositeDirection(this.map.gameObjects["hero"].direction);
    }

    const message = new TextMessage({ text: this.event.text, onComplete: () => resolve() });
    message.init(document.querySelector(".game-container"), "text-message");
  }

  addPokemon(resolve) {
    // Rival auto chooses a Pokemon.
    if (this.event.rival) {
      rivalTeam = this.event.rival;
      resolve();
    }
    else {
      const menu = new ConfirmMenu({
        name: this.event.name,
        heroTeam: this.event.hero,
        onComplete: (confirm) => {
          resolve(confirm);
        }
      })

      menu.init(document.querySelector(".game-container"));
    }
  }

  wait(resolve) {
    setTimeout(resolve, this.event.delay);
  }

  battle(resolve) {
    const battle = new Battle({
      onComplete: () => {
        resolve();
      },
    });

    battle.init(document.querySelector(".game-container"));
  }

  changeMap(resolve) {    
    // Remove object data from old maps.
    Object.values(this.map.gameObjects).forEach(obj => {
      obj.isMounted = false;
    });

    // Update hero position in data.
    let hero = maps[this.event.map].configObjects.hero;
    hero.x = utils.grid(this.event.heroPosition.x);
    hero.y = utils.grid(this.event.heroPosition.y);
    hero.direction = this.event.heroPosition.direction;

    const sceneTransition = new SceneTransition();
    sceneTransition.init(document.querySelector(".game-container"), () => {
      this.map.overworld.startMap(maps[this.event.map]);
      resolve();
      sceneTransition.fadeOut();
    });
  }

  updateHero(resolve) {
    // Update hero position. Global variable in Map.js
    heroPosition = this.event.heroPosition;
    resolve();
  }

  addCheckpoint(resolve) {
    // Global variable in PlayerState.js.
    playerState.checkpoint[this.event.checkpoint] = true;
    resolve();
  }

  removeCheckpoint(resolve) {
     playerState.checkpoint[this.event.checkpoint] = false;
     resolve();
  }

  init() {
    return new Promise(resolve => {
      this[this.event.type](resolve)
    })
  }
}
