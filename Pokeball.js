class Pokeball extends GameObject {
  constructor(config) {
    super(config);
    this.checkpoint = config.checkpoint;
    this.sprite = new Sprite({
      gameObject: this,
      src: "./images/other/pokeball.png",
    })
  }

  update() {
    // Removes the Pokeball based on the corresponding checkpoint.
    if (playerState.checkpoint[this.checkpoint]) {
      this.sprite.image.src = "";
      this.sprite.shadow.src = "";
    }
  }
}