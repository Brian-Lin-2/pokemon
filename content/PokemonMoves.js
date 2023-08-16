let moves = {
  scratch: {
    name: "Scratch",
    success: [
      { type: "message", text: "{POKEMON} uses Scratch!" },
      { type: "change", damage: 5 }
    ]
  },
  tackle: {
    name: "Tackle",
    success: [
      { type: "message", text: "{POKEMON} uses Tackle!" },
      { type: "change", damage: 30 }
    ]
  },
  growl: {
    name: "Growl",
    success: [
      { type: "message", text: "{POKEMON} uses Growl!" },
      { type: "change", debuff: "attack" },
      { type: "message", text: "{TARGET}'s attack dropped!" },
    ]
  },
  leer: {
    name: "Leer",
    success: [
      { type: "message", text: "{POKEMON} uses Leer!" },
      { type: "change", debuff: "defense" },
      { type: "message", text: "{TARGET}'s defense dropped!" },
    ]
  },
  tailWhip: {
    name: "Tail Whip",
    success: [
      { type: "message", text: "{POKEMON} uses Tail Whip!" },
      { type: "change", debuff: "defense" },
      { type: "message", text: "{TARGET}'s defense dropped!" },
    ]
  },
}