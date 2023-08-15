let moves = {
  scratch: {
    name: "Scratch",
    success: [
      { type: "message", text: "{POKEMON} uses Scratch!" },
      // { type: "animation", animation: "scratch" },
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
      { type: "message", text: "{POKEMON} uses Growl!" },
      // { type: "animation", animation: "growl" },
      { type: "change", debuff: "attack" }
    ]
  },
  leer: {
    name: "Leer",
    success: [
      { type: "message", text: "{POKEMON} uses Leer!" },
      // { type: "animation", animation: "leer" },
      { type: "change", debuff: "defense" }
    ]
  },
  tailWhip: {
    name: "Tail Whip",
    success: [
      { type: "message", text: "{POKEMON} uses Tail Whip!" },
      // { type: "animation", animation: "tailWhip" },
      { type: "change", debuff: "defense" }
    ]
  },
}