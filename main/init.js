const init = () => {
  const overworld = new Overworld({
    element: document.querySelector(".game-container")
  });
  overworld.init();
}

init();
