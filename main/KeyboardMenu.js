class KeyboardMenu {
  constructor({ type, name }) {
    this.options = [];
    this.up = null;
    this.down = null;
    this.left = null;
    this.right = null;
    this.confirm = null;
    this.current = 0;
    this.onStart = true;

    // Different text based on type.
    if (type == "battle") {
      this.text = `What will ${name} do?`
    }
    else if (type == "pokeball") {
      this.text = `Do you want to choose ${name}?`
    }
  }

  setOptions(options) {
    this.options = options;

    // Combine all the options together.
    this.element.innerHTML = this.options.map((option, index) => {
      return (`
        <div class="option">
          <button data-button="${index}">
            ${option.label}
          </button>
        </div>
      `)
    }).join("");

    this.element.querySelectorAll("button").forEach(button => {
      button.addEventListener("focus", () => {
        this.prevFocus = button;
      });
    })

    // Allows us to autofocus the first button.
    setTimeout(() => {
      this.element.querySelector("button[data-button]").focus();
    })
  }

  createElement() {
    this.element = document.createElement("div");
    this.element.classList.add("keyboardMenu");

    // Creates textbox once.
    if (this.onStart) {
      this.textBox = document.createElement("div");
      this.textBox.classList.add("textMessage");
      this.onStart = false;
    }
    
    this.textBox.innerHTML = (`<p class="textMessage_p battleMessage">${this.text}</p>`);
    this.textBoxText = this.textBox.querySelector("p");
  }

  end() {
    this.element.remove();
    this.textBoxText.remove();

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

    // Confirmation. handler() will fire off any code associated with the option.
    this.confirm = new KeyPressListener("Enter", () => { this.options[this.current].handler() })
    this.confirm = new KeyPressListener("Space", () => { this.options[this.current].handler() })
  }
}