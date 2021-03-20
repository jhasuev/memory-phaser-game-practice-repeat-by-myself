import Scene from "./Scene"

export default {
  type: Phaser.AUTO,
  width: 1280,
  height: 720,
  timeout: 30,
  rows: 2,
  cols: 5,
  cards: [1,2,3,4,5],
  scene: new Scene()
}