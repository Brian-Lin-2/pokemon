class Event {
  constructor({ map, event }) {
    this.map = map;
    this.event = event;
  }

  // resolve variable indicates when the behavior is done. Triggers the promise.
  stand(resolve) {

  }

  walk(resolve) {
    const person = this.map.gameObjects[ this.event.who ]
    person.startBehavior({
      map: this.map,
    }, {
      type: "walk",
      direction: this.event.direction,
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

  init() {
    return new Promise(resolve => {
      this[this.event.type](resolve)
    })
  }
}