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
      "idle-down": [ [0, 0] ],
      "walk-down": [ [1,0], [0,0], [3,0], [2,0] ]
    }

    this.currentAnimation = config.currentAnimation || "walk-down";
    this.currentAnimationFrame = 0;

    this.animationFrameLimit = 16;
    this.animationFrameProgress = this.animationFrameLimit;

    this.gameObject = config.gameObject;
  }

  get frame() {
    return this.animations[this.currentAnimation][this.currentAnimationFrame];
  }

  updateAnimationProgress() {
    if (this.animationFrameProgress > 0) {
      this.animationFrameProgress -= 1;
      return;
    }

    this.animationFrameProgress = this.animationFrameLimit;

    // Move to the next animation cycle.
    this.currentAnimationFrame += 1;

    if (this.frame === undefined) {
      this.currentAnimationFrame = 0;
    }
  }

  draw(ctx) {
    const x = this.gameObject.x - 7;
    const y = this.gameObject.y -18;

    this.isShadowLoaded && ctx.drawImage(this.shadow, x, y);

    const [frameX, frameY] = this.frame;

    ctx.drawImage(this.image,
      frameX * 64, frameY * 64, // left, top
      64, 64, // right, bottom
      x, y, // position
      32, 32 // size
    )

    this.updateAnimationProgress();
  }
}
