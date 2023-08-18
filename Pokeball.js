class Pokeball extends GameObject {
  constructor(config) {
    super(config);
    this.sprite = new this.sprite({
      gameObject: this,
      src: "",
      
    })
  }
}