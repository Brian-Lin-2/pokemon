let moves = {
  scratch: {
    name: "Scratch",
    success: [
      { type: "message", text: "Scratch!" },
      { type: "animation", animation: "scratch" },
      { type: "change", damage: 10 }
    ]
  },
  tackle: {
    name: "Tackle",
    success: [
      { type: "message", text: "Tackle!" },
      // { type: "animation", animation: "tackle" },
      // { type: "change", damage: 10 }
    ]
  },
  growl: {
    name: "Growl",
    success: [
      { type: "message", text: "Growl!" },
      { type: "animation", animation: "growl" },
    ]
  },
  leer: {
    name: "Leer",
    success: [
      { type: "message", text: "Leer!" },
      { type: "animation", animation: "leer" }
    ]
  },
  tailWhip: {
    name: "Tail Whip",
    success: [
      { type: "message", text: "Tail Whip!" },
      { type: "animation", animation: "tailWhip" }
    ]
  },
}