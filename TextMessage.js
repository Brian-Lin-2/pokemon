class TextMessage {
  constructor({ text, onComplete }) {
    this.text = text;
    this.onComplete = onComplete;
    this.element = null;
  }

  createElement(type) {
    // Create text box.
    this.element = document.createElement("div");
    this.element.classList.add("textMessage");

    this.element.innerHTML = (`
      <p class="textMessage_p"></p>
      <a class="textMessage_button">v</a>
    `)

    this.revealingText = new RevealingText({
      element: this.element.querySelector(".textMessage_p"),
      text: this.text,
      button: this.element.querySelector(".textMessage_button"),
    })

    this.actionListener = new KeyPressListener("Space", () => {
      this.done();
    });

    this.actionListener_2 = new KeyPressListener("Enter", () => {
      this.done();
    });
  }

  done() {
    if (this.revealingText.isDone) {
      this.element.remove();
      
      // Unbind the listener to stop it from constantly listening.
      this.actionListener.unbind();
      this.actionListener_2.unbind();
      this.onComplete();
    }
  }

  init(container, type) {
    this.createElement(type);
    container.appendChild(this.element);
    this.revealingText.init(type);
  }
}
