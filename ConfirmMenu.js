class ConfirmMenu {
  constructor({ heroTeam, rivalTeam, onComplete }) {
    this.heroTeam = heroTeam;
    this.rivalTeam = rivalTeam;
    this.onComplete = onComplete;
  }

  getOptions() {
    return [
      { label: "Yes",
        handler: () => {
          // Global variables from Battle.js
          heroTeam = this.heroTeam;
          rivalTeam = this.rivalTeam;
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
    this.keyboardMenu = new KeyboardMenu();
    this.keyboardMenu.init(this.element);
    this.keyboardMenu.setOptions(this.getOptions());

    container.appendChild(this.element);
  }

}