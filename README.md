# Pokémon Website

## Table of contents

- [Overview](#overview)
- [How It Works](#workings)
- [Resources](#resources)
- [Future Development](#future-development)

## Overview

Overworld:
<br><img width="546" alt="image" src="https://github.com/Brian-Lin-2/pokemon/assets/19761406/64882512-4d44-4d21-8a8c-169c9feca065"><br>

Cutscenes:
<br><img width="546" alt="image" src="https://github.com/Brian-Lin-2/pokemon/assets/19761406/25360e83-7a4d-41fb-b434-66751a16cac4"><br>

Interactions:
<br><img width="546" alt="image" src="https://github.com/Brian-Lin-2/pokemon/assets/19761406/6cc2e059-968a-4a66-9c4a-a50fa0123d2a"><br>

Battles:
<br><img width="546" alt="image" src="https://github.com/Brian-Lin-2/pokemon/assets/19761406/13a3bc7f-7af2-4148-b375-cc413fff78b7"><br>

Created a website clone of the popular game Pokémon FireRed and LeafGreen. Features animations, wall collisions, cutscenes, events, character movement, battles, music, and many more.

## How It Works.

Created a database of overworld maps with game objects (such as sprites). Implemented a game loop which refreshes the screen on every frame tick. This allows our game to run smoothly and update when needed.

Grid based movement was created using arrays (stores the directions) and key inputs. Key inputs are associated with certain values in the array and then the array will update the position of the person object based on the key inputs. This array is then sent to the hero character which then triggers movement on that hero.

Character animations are created by cycling through a sprite sheet based on the animation that is called. The Sprite class plays a simple animation loop of the called animation.

Implemented a dynamic camera by making sure the hero character is always in the center of the screen. Everything is drawn relative to the hero character. Formula is positionX + offsetX - heroPositionX, positionY + offsetY - heroPositionY. This way hero doesn’t really change, but anything that isn’t the hero will be positioned relative to where the hero is.

A wall object is stored in GameObject. Consists of a sequence of strings that represent coordinates the walls are at. When a character moves we calculate its next position and make sure it isn’t a wall. If it is a wall, we stop movement. Revamp directions to be less dependent on arrow keys and to actually check if it’s valid to walk somewhere. Character walls are added on initial load. Character walls are updated by calculating its intent position and ensuring nothing will stop the character from moving there.

Created character behaviors by using a behavior loop identified on map load. GameObject takes in these parameters and starts implementing the behavior through the use of a Promise (the next behavior will only kick off once the current behavior is finished). Behaviors are passed into a new Event class that triggers the certain behavior. Event uses the Person class methods to trigger walking or standing events. We create our own custom events to resolve our Promise when a behavior is complete.

Cutscenes implement the character behaviors codes using an async startCutscene method in Map. It stops all movement when a cutscene is playing and takes in same parameters as behaviors.

Created text messages using a div element positioned on top of the canvas. Triggered through an event. Created a special event listener to only trigger when a held key is lifted. Objects/npcs can be interacted with by checking the next pixel in the direction the character is facing in. Implemented cutscene spaces which can trigger certain events based on the position hero is at. Create map transition using cutscene spaces.

Developed a turned based battle system by creating a battle event. This event will load a battle scene onto the canvas with the specified trainers. HP/EXP bar are filled and depleted based on the Pokémon’s stats. Turn cycles are created by triggering a callback called “onNewEvent” which creates Promises which gives off the illusion of turns. BattleEvent houses all the events called in a battle. BattleMenu allows you to select moves to use to attack, but if the current player is an enemy it chooses a move at random.

## Resources

- [Building a JavaScript RPG Game](https://www.youtube.com/watch?v=nHaiLWUaWWw&t=10s) - This is a great intro to website game development video. Really motivated me to start creating a game on the web!

- [Pizza Legends](https://www.youtube.com/watch?v=fyi4vfbKEeo&list=PLcjhmZ8oLT0r9dSiIK6RB_PuBWlG1KSq_) - This passion project wouldn't have been possible without Drew Conley and his amazing series where he builds a game called "Pizza Legends". He does an amazing job highlighting the process of game development and how to start creating a game on the web. I learned so much about JavaScript thanks to him.

## Future Development

I would like to play around more with Promises and callbacks and really understand how powerful JavaScript can be. In the distant future, I would like to create my own small game using React.
