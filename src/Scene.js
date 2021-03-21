import config from "./config"
import Card from "./Card"

class Scene extends Phaser.Scene {
  constructor(){
    super("Game")
  }

  preload() {
    this.preloadImages()
    this.preloadSounds()
  }

  preloadImages() {
    this.load.image("bg", "assets/img/background.png")
    this.load.image("card", "assets/img/card.png")
    this.load.image("card1", "assets/img/card1.png")
    this.load.image("card2", "assets/img/card2.png")
    this.load.image("card3", "assets/img/card3.png")
    this.load.image("card4", "assets/img/card4.png")
    this.load.image("card5", "assets/img/card5.png")
  }

  preloadSounds() {
    this.load.audio("card", "assets/sounds/card.mp3")
    this.load.audio("complete", "assets/sounds/complete.mp3")
    this.load.audio("success", "assets/sounds/success.mp3")
    this.load.audio("theme", "assets/sounds/theme.mp3")
    this.load.audio("timeout", "assets/sounds/timeout.mp3")
  }

  create() {
    this.createBackground()
    this.createCards()
    this.createTimer()
    this.createInfo()
    this.initSounds()
    this.start()
  }

  start() {
    this.initCards()
    this.initTimeout()
    this.openedCounts = 0
    this.timer.paused = false
    this.running = true
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

  initSounds() {
    this.sounds = {
      "card": this.add.scene.sound.add("card"),
      "complete": this.add.scene.sound.add("complete"),
      "success": this.add.scene.sound.add("success"),
      "theme": this.add.scene.sound.add("theme"),
      "timeout": this.add.scene.sound.add("timeout"),
    }

    this.sounds.theme.play({ volume: .1, loop: true})
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

    this.sounds.card.play()

    if (this.openedCard) {
      if (this.openedCard.card === card.card) {
        // если открытые карты одинаковые
        this.openedCard = null
        this.onSuccess()
      } else {
        // если карты разные
        this.openedCard.close()
        this.openedCard = card
        this.onFail()
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
      this.onPassed()
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
      this.onTimeOver()
    }
  }

  onTimeOver() {
    this.restart()
    this.sounds.timeout.play()
  }

  createInfo() {
    this.scores = 0
    this.scoresCoef = 1
    this.passed = 0

    this.textInfo = this.add.text(10, 310, this.getInfo(), {
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
      `Score: ${this.scores}`,
      `Passed: ${this.passed}`,
    ]

    return info.join("\n")
  }

  onSuccess() {
    this.openedCounts++
    this.addScore()
    this.updateInfo()

    this.sounds.success.play()
  }

  onFail() {
    this.scoresCoef = 1
  }

  onPassed() {
    if (!this.running) return;
    this.running = false

    this.passed += 1
    this.updateInfo()
    this.restart()
    this.sounds.complete.play()
  }

  addScore() {
    this.scores += Math.ceil(10 * this.scoresCoef)
    this.scoresCoef *= 1.5
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