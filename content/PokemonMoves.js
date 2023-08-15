let moves = {
  scratch: {
    name: "Scratch",
    success: [
      { type: "message", text: "{POKEMON} uses Scratch!" },
      { type: "animation", animation: "scratch" },
      { type: "change", damage: 5 }
    ]
  },
  tackle: {
    name: "Tackle",
    success: [
      { type: "message", text: "{POKEMON} uses Tackle!" },
      // { type: "animation", animation: "tackle" },
      { type: "change", damage: 5 }
    ]
  },
  growl: {
    name: "Growl",
    success: [
      { type: "message", text: "Growl!" },
      // { type: "animation", animation: "growl" },
    ]
  },
  leer: {
    name: "Leer",
    success: [
      { type: "message", text: "Leer!" },
      // { type: "animation", animation: "leer" },
    ]
  },
  tailWhip: {
    name: "Tail Whip",
    success: [
      { type: "message", text: "Tail Whip!" },
      // { type: "animation", animation: "tailWhip" },
    ]
  },
}