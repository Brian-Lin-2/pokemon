const utils = {
  // Maps numbers into nice pixel values.
  grid(n) {
    return n * 16;
  },
  asGridCoord(x,y) {
    return `${x*16},${y*16}`
  },
  nextPosition(initialX, initialY, direction) {
    let x = initialX;
    let y = initialY;
    const size = 16;

    if (direction === "left") {
      x -= size;
    } else if (direction === "right") {
      x += size;
    } else if (direction === "up") {
      y -= size;
    } else if (direction === "down") {
      y += size;
    }

    return {x,y};
  },
  oppositeDirection(direction) {
    switch (direction) {
      case "left": return "right";
      case "right": return "left";
      case "up": return "down";
      case "down": return "up";
    }
  },
  wait(ms) {
    return new Promise(resolve => {
      setTimeout(() => {
        resolve()
      }, ms);
    })
  },
  createEvent(name, detail) {
    const event = new CustomEvent(name, { detail });
    document.dispatchEvent(event);
  }
}
