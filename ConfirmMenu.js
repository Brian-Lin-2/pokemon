class ConfirmMenu {
  constructor({ name, heroTeam, onComplete }) {
    this.name = name;
    this.heroTeam = heroTeam;
    this.onComplete = onComplete;
  }

  getOptions() {
    return [
      { label: "Yes",
        handler: () => {
          // Global variable from Battle.js
          heroTeam = this.heroTeam
          this.close();
          this.onComplete(true);
        }
      },
      { 
        label: "No",
        handler: () => {
          this.close();
          this.onComplete(false);
        }
      },
    ]
  }

  createElement() {
    this.element = document.createElement("div");
  }

  close() {
    this.keyboardMenu.end();
    this.element.remove();
  }

  init(container) {
    this.createElement();
    this.keyboardMenu = new KeyboardMenu({
      type: "pokeball", name: this.name
    });
    this.keyboardMenu.init(this.element);
    this.keyboardMenu.setOptions(this.getOptions());

    container.appendChild(this.element);
  }

}