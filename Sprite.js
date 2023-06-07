class Sprite {
  constructor(config) {
    // Set up image.
    this.image = new Image();
    this.image.src = config.src;
    this.image.onload = () => {
      this.isLoaded = true;
    }

    // Shadow.
    this.shadow = new Image();
    this.shadow.src = "/images/characters/shadow.png";
    this.shadow.onload = () => {
      this.isShadowLoaded = true;
    }

    // Configure Animation and Initial State.
    this.animations = config.animations || {
      idleDown: [
        [0, 0]
      ]
    }

    this.currentAnimation = config.currentAnimation || "idleDown";
    this.currentAnimationFrame = 0;
    this.gameObject = config.gameObject;
  }

  draw(ctx) {
    const x = this.gameObject.x * 16 - 7;
    const y = this.gameObject.y * 16 -18;

    this.isShadowLoaded && ctx.drawImage(this.shadow, x, y);

    ctx.drawImage(this.image,
      0, 0, // left, top
      64, 64, // right, bottom
      x, y, // position
      32, 32 // size
    )
  }

}