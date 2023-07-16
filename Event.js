class Event {
  constructor({ map, event }) {
    this.map = map;
    this.event = event;
  }

  // resolve variable indicates when the behavior is done. Triggers the promise.
  stand(resolve) {
    const person = this.map.gameObjects[ this.event.who ]
    person.startBehavior({
      map: this.map,
    }, {
      type: "stand",
      direction: this.event.direction,
      time: this.event.time,
    })

    // Creates a handler to check when a person is done walking, then resolves the event.
    const completeHandler = e => {
      if (e.detail.whoId === this.event.who) {
        document.removeEventListener("PersonStandComplete", completeHandler);
        resolve();
      }
    }

    document.addEventListener("PersonStandComplete", completeHandler)
  }

  walk(resolve) {
    const person = this.map.gameObjects[ this.event.who ]
    person.startBehavior({
      map: this.map,
    }, {
      type: "walk",
      direction: this.event.direction,
      retry: true,
    })

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
    if (this.event.faceHero) {
      const obj = this.map.gameObjects[this.event.faceHero];
      obj.direction = utils.oppositeDirection(this.map.gameObjects["hero"].direction);
    }

    const message = new TextMessage({ text: this.event.text, onComplete: () => resolve() });
    message.init(document.querySelector(".game-container"));
  }

  changeMap(resolve) {
    this.map.overworld.startMap(maps[this.event.map]);
      resolve();
  }

  init() {
    return new Promise(resolve => {
      this[this.event.type](resolve)
    })
  }
}
