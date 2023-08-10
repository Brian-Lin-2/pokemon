class Pokemon {
  // Reference to battle class.
  constructor(config, battle) {
    // This creates the stats.
    Object.keys(config).forEach(key => {
      this[key] = config[key];
    })

    this.battle = battle;
  }
  
  createElement() {

  }

  init() {
    
  }
}