class Audio {
  constructor() {
    this.palletTown = new Audio("/audio/pallet-town.mp3");
  }

  // Global function.
  playMusic(music) {
    const UserInteracted = setInterval(()=>{
      music.play()
      .then(()=>{
        clearInterval(UserInteracted);
      })
      .catch(()=>{
      });     
    },1000)
  }
}
