import config from "./config"

class Scene extends Phaser.Scene {
  constructor(){
    super("Game")
  }

  preload() {
    this.load.image("bg", "assets/img/background.png")
    this.load.image("card", "assets/img/card.png")
  }

  create() {
    this.render()
  }

  render() {
    this.renderBackground()
    this.renderCards()
  }

  renderBackground() {
    this.add.sprite(0, 0, "bg").setOrigin(0)
  }

  renderCards() {
    let positions = this.getCardsPositions()
    positions.forEach(position => {
      this.add.sprite(position.x, position.y, "card").setOrigin(0)
    })
  }

  getCardsPositions() {
    let positions = []
    const { width, height } = this.textures.get("card").getSourceImage()
    const spaceBetween = 10
    const cardsWidth = (width + spaceBetween) * config.cols - spaceBetween
    const cardsHeight = (height + spaceBetween) * config.rows - spaceBetween
    const xOffset = (config.width - cardsWidth) / 2
    const yOffset = (config.height - cardsHeight) / 2

    for (let row = 0; row < config.rows; row++) {
      for (let col = 0; col < config.cols; col++) {
        positions.push({
          width,
          height,
          x: xOffset + (width + spaceBetween) * col,
          y: yOffset + (height + spaceBetween) * row,
        })
      }
    }

    return positions
  }
}

export default Scene