class KeyboardMenu {
  constructor() {
    this.options = [];
    this.up = null;
    this.down = null;
    this.left = null;
    this.right = null;
    this.current = 0;
  }

  setOptions(options) {
    this.options = options;

    // Combine all the options together.
    this.element.innerHTML = this.options.map((option, index) => {
      const autoFocusAttr = index === 0 ? "autofocus" : "";
      return (`
        <div class="option">
          <button ${autoFocusAttr} data-button="${index}">
            ${option.label}
          </button>
        </div>
      `)
    }).join("");

    this.element.querySelectorAll("button").forEach(button => {
      button.addEventListener("focus", () => {
        this.prevFocus = button;
      })
    })
  }

  createElement() {
    this.element = document.createElement("div");
    this.element.classList.add("KeyboardMenu");

    // Text that appears next to move.
    this.textBox = document.createElement("div");
    this.textBox.classList.add("textBox");
    this.textBox.innerHTML = (`<p>What will you do?</p>`);
    this.textBoxText = this.textBox.querySelector("p");
  }

  end() {
    this.element.remove();
    this.textBox.remove();

    // Clean up bindings.
    this.up.unbind();
    this.down.unbind();
    this.left.unbind();
    this.right.unbind();
  }

  // Simple array manipulation.
  selection(a, b, c, d) {
    const nextButton = Array.from(this.element.querySelectorAll("button[data-button]"));

    if (this.current === a) {
      nextButton[b]?.focus();
      this.current = b;
    }
    else if (this.current === c) {
      nextButton[d]?.focus();
      this.current = d;
    }
  }

  init(container) {
    this.createElement();
    container.appendChild(this.element);
    container.appendChild(this.textBox);

    // Arrow Keys.
    this.up = new KeyPressListener("ArrowUp", () => { this.selection(2, 0, 3, 1) });
    this.down = new KeyPressListener("ArrowDown", () => { this.selection(0, 2, 1, 3) });
    this.left = new KeyPressListener("ArrowLeft", () => { this.selection(1, 0, 3, 2) });
    this.right = new KeyPressListener("ArrowRight", () => { this.selection(0, 1, 2, 3) });

    // WASD Keys.
    this.up = new KeyPressListener("KeyW", () => { this.selection(2, 0, 3, 1) });
    this.down = new KeyPressListener("KeyS", () => { this.selection(0, 2, 1, 3) });
    this.left = new KeyPressListener("KeyA", () => { this.selection(1, 0, 3, 2) });
    this.right = new KeyPressListener("KeyD", () => { this.selection(0, 1, 2, 3) });
  }
}