import config from "./config"
import Card from "./Card"

class Scene extends Phaser.Scene {
  constructor(){
    super("Game")
  }

  preload() {
    this.load.image("bg", "assets/img/background.png")
    this.load.image("card", "assets/img/card.png")
    this.load.image("card1", "assets/img/card1.png")
    this.load.image("card2", "assets/img/card2.png")
    this.load.image("card3", "assets/img/card3.png")
    this.load.image("card4", "assets/img/card4.png")
    this.load.image("card5", "assets/img/card5.png")
  }

  create() {
    this.createBackground()
    this.createCards()
    this.createTimer()
    this.createInfo()
    this.start()
  }

  start() {
    this.initCards()
    this.initTimeout()
    this.openedCounts = 0
    this.timer.paused = false
  }

  restart() {
    this.timer.paused = true
    this.moveCardsToEdge(() => {
      this.start()
    })
  }

  moveCardsToEdge(callback) {
    let count = 0
    this.cards.forEach(card => {
      card.move({
        x: config.width + card.width / 2,
        y: config.height + card.height / 2,
        callback: () => {
          if (++count >= this.cards.length) {
            if (callback) {
              callback()
            }
          }
        }
      })
    })
  }

  createBackground() {
    this.add.sprite(0, 0, "bg").setOrigin(0)
  }

  createCards() {
    this.cards = []
    for(let card of config.cards) {
      for(let i = 0; i < 2; i++) {
        this.cards.push(new Card(this, card))
      }
    }

    this.input.on("gameobjectdown", this.onCardClick, this)
  }

  onCardClick(pointer, card) {
    if (card.opened) return;

    if (this.openedCard) {
      if (this.openedCard.card === card.card) {
        // если открытые карты одинаковые
        this.openedCard = null
        this.openedCounts++
      } else {
        // если карты разные
        this.openedCard.close()
        this.openedCard = card
      }
    } else {
      this.openedCard = card
    }

    card.open(() => {
      this.checkWin()
    })
  }

  checkWin() {
    if (this.openedCounts >= config.cards.length) {
      this.restart()
    }
  }

  initCards() {
    let positions = this.getCardsPositions()
    this.cards.forEach(card => {
      card.init(positions.pop())
      card.close()
    })
  }

  createTimer() {
    this.initTimeout()

    this.timer = this.time.addEvent({
      delay: 1000,
      loop: true,
      callback: this.onTimeTick,
      callbackScope: this
    })
  }

  initTimeout() {
    this.timeout = config.timeout
  }

  onTimeTick() {
    this.updateInfo()

    if(--this.timeout < 0) {
      this.restart()
    }
  }

  createInfo() {
    this.textInfo = this.add.text(10, 340, this.getInfo(), {
      "color": "#fff",
      "font": "30px 'CurseCasual'"
    })
  }

  updateInfo() {
    this.textInfo.setText(this.getInfo())
  }

  getInfo() {
    let info = [
      `Time: ${this.timeout}`,
    ]

    return info.join("\n")
  }

  getCardsPositions() {
    let positions = []
    const { width, height } = this.textures.get("card").getSourceImage()
    const spaceBetween = 10
    const cardsWidth = (width + spaceBetween) * config.cols - spaceBetween
    const cardsHeight = (height + spaceBetween) * config.rows - spaceBetween
    const xOffset = (config.width - cardsWidth) / 2
    const yOffset = (config.height - cardsHeight) / 2

    let id = 0
    for (let row = 0; row < config.rows; row++) {
      for (let col = 0; col < config.cols; col++) {
        positions.push({
          width,
          height,
          x: xOffset + (width + spaceBetween) * col + width / 2,
          y: yOffset + (height + spaceBetween) * row + height / 2,
          delay: id++ * 100,
        })
      }
    }

    return Phaser.Utils.Array.Shuffle(positions)
  }
}

export default Scene