class Overworld {
  constructor(config) {
    this.element = config.element;
    this.canvas = this.element.querySelector(".game-canvas");
    this.ctx = this.canvas.getContext("2d");
  }

  init() {
    // Map.
    const image = new Image();
    image.src = "/images/maps/DemoLower.png";

    image.onload = () => {
      this.ctx.drawImage(image, 0, 0);
    };

    // Places Game Objects.
    const red = new GameObject({
      x: 5,
      y: 6,
      src: "/images/characters/people/red.png"
    })
    
    const mom = new GameObject({
      x: 2,
      y: 6,
      src: "images/characters/people/mom.png"
    })

    // Make async so the sprites can load.
    setTimeout(() => {
      red.sprite.draw(this.ctx);
      mom.sprite.draw(this.ctx);
    }, 200)
  }
};