class Overworld {
  constructor(config) {
    this.element = config.element;
    this.canvas = this.element.querySelector(".game-canvas");
    this.ctx = this.canvas.getContext("2d");
  }

  init() {
    const image = new Image();
    image.src = "/images/maps/DemoLower.png";

    image.onload = () => {
      this.ctx.drawImage(image, 0, 0);
    };

    const hero = new Image();
    hero.src = "/images/characters/people/red.png";

    const x = 0;
    const y = 0;

    hero.onload = () => {
      this.ctx.drawImage(
        hero,
        0, // left
        0, // right
        64, // width
        64, // height
        x,
        y,
        32, // width (size)
        32, // height (size)
      );
    }
  };
};