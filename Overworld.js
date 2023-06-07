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

    const x = 2;
    const y = 5;

    hero.onload = () => {
      this.ctx.drawImage(
        hero,
        0, // left
        0, // right
        64, // width
        64, // height
        x * 16 - 7, // 16 compensates for the map size
        y * 16 - 18,
        32, // width (size)
        32, // height (size)
      );
    }

    const shadow = new Image();
    shadow.src = "/images/characters/shadow.png"

    shadow.onload = () => {
      this.ctx.drawImage(
        shadow,
        0, // left
        0, // right
        32, // width
        32, // height
        x * 16 - 7, // 16 compensates for the map size
        y * 16 - 18,
        32, // width (size)
        32, // height (size)
      );
    };
  };
};