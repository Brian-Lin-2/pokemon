class RevealingText {
  constructor(config) {
    // Element we fill.
    this.element = config.element;
    
    this.text = config.text;
    this.menu = config.menu;
    this.button = config.button;
    this.speed = config.speed || 30;

    this.timeout = null;
    this.isDone = false;
  }

  revealOneCharacter(list, type) {
    const next = list.splice(0,1)[0];
    next.span.classList.add("revealed");

    // Fires off the recursion based on the delay we set.
    if (list.length > 0) {
      this.timeout = setTimeout(() => {
        this.revealOneCharacter(list, type);
      }, next.delayAfter)
    } 
    else if (type == "text-message") {
      this.button.classList.add("revealed");
      this.isDone = true;
    }
    else if (type == "confirm-message") {
      console.log("confirm");
    }
  }

  init(type) {
    let characters = [];
    this.text.split("").forEach(character => {
      // Allows us to separate words.
      let span = document.createElement("span");
      span.textContent = character;
      this.element.appendChild(span);

      // Reveals each character.
      characters.push({
        span,
        delayAfter: character === " " ? 0 : this.speed,
      })
    })

    this.revealOneCharacter(characters, type);
  }
}