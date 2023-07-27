class SceneTransition {
  constructor() {
    this.element = null;
  }

  createElement() {
    this.element = document.createElement("div");
    this.element.classList.add("sceneTransition");
  }

  fadeOut() {
    this.element.classList.add("fade-out");

    this.element.addEventListener("animationend", () => {
      this.element.remove();
    }, { once: true })
  }

  init(container, callback) {
    this.createElement();
    container.appendChild(this.element);

    // Only fires once.
    this.element.addEventListener("animationend", () => {
      callback();
    }, { once: true })
  }
}