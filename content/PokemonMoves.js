let moves = {
  scratch: {
    name: "Scratch",
    success: [
      { type: "message", text: "Scratch!" },
      { type: "animation", animation: "scratch" }
    ]
  },
  tackle: {
    name: "Tackle",
    success: [
      { type: "message", text: "Tackle!" },
      { type: "animation", animation: "tackle" }
    ]
  },
  growl: {
    name: "Growl",
    success: [
      { type: "message", text: "Growl!" },
      { type: "animation", animation: "growl" },
      { type: "change", damage: 10 }
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