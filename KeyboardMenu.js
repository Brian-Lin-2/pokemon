class KeyboardMenu {
  constructor() {
    this.options = [];
    this.up = null;
    this.down = null;
    this.prevFocus = null;
  }

  setOptions(options) {
    this.options = options;

    // Combine all the options together.
    this.element.innerHTML = this.options.map((option, index) => {
      const disabledAttr = option.disabled? "disabled" : "";
      return (`
        <div class="option">
          <button ${disabledAttr} data-button="${index}">
            ${option.label}
          </button>
        </div>
      `)
    }).join("")
  }

  createElement() {
    this.element = document.createElement("div");
    this.element.classList.add("KeyboardMenu");
  }

  init(container) {
    this.createElement();
    container.appendChild(this.element);
  }
}