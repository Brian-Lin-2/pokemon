class TextMessage {
  constructor({ text, onComplete }) {
    this.text = text;
    this.onComplete = onComplete;
    this.element = null;
  }

  createElement() {
    // Create text box.
    this.element = document.createElement("div");
    this.element.classList.add("TextMessage");

    this.element.innerHTML = (`
      <p class="TextMessage_p">${this.text}</p>
      <a class="TextMessage_button">v</a>
    `)

    this.element.querySelector("a").addEventListener("click", () => {
      // Closes the text message.
      this.done();
    });

    this.actionListener = new KeyPressListener("Space", () => {
      // Unbind the listener to stop it from constantly listening.
      this.actionListener.unbind();
      
      this.done();
    })
  }

  done() {
    this.element.remove();
    this.onComplete();
  }

  init(container) {
    this.createElement();
    container.appendChild(this.element);
  }
}
