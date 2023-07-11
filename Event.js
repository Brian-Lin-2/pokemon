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
      map: this.map
    }), {
      type: "walk",
      direction: this.event.direction,
    }
  }

  init() {
    return new Promise(resolve => {
      this[this.event.type](resolve)
    })
  }
}