class Pokeball extends GameObject {
  constructor(config) {
    super(config);
    this.sprite = new Sprite({
      gameObject: this,
      src: "./images/characters/shadow.png",
    })
  }

  update() {
    // Removes the Pokeball.
    this.sprite.src = "";
  }
}