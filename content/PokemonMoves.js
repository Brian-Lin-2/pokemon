let moves = {
  scratch: {
    name: "Scratch",
    success: [
      { type: "message", text: "{POKÉMON} uses Scratch!" },
      { type: "change", damage: 30 }
    ]
  },
  tackle: {
    name: "Tackle",
    success: [
      { type: "message", text: "{POKÉMON} uses Tackle!" },
      { type: "change", damage: 5 }
    ]
  },
  growl: {
    name: "Growl",
    success: [
      { type: "message", text: "{POKÉMON} uses Growl!" },
      { type: "change", debuff: "attack" },
      { type: "message", text: "{TARGET}'s attack dropped!" },
    ]
  },
  tailWhip: {
    name: "Tail Whip",
    success: [
      { type: "message", text: "{POKÉMON} uses Tail Whip!" },
      { type: "change", debuff: "defense" },
      { type: "message", text: "{TARGET}'s defense dropped!" },
    ]
  },
}