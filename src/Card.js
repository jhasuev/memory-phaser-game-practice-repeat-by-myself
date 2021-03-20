class Card extends Phaser.GameObjects.Sprite {
  constructor(scene, card) {
    super(scene, 0, 0, "card")
    this.scene = scene
    this.card = card
    this.opened = false
    this.scene.add.existing(this)
    this.setInteractive()

    this.setCardTexture()
  }

  init(position) {
    this.setPosition(this.width / -2, this.height / -2)
    this.depth = position.delay
    this.delay = position.delay
    this.opened = false
    this.setCardTexture()
    this.move(position)
  }

  move(params) {
    this.scene.tweens.add({
      targets: this,
      duration: 250,
      x: params.x,
      y: params.y,
      delay: this.delay,
      ease: "Linear",
      onComplete: () => {
        if (params.callback) {
          params.callback()
        }
      }
    })
  }

  setCardTexture() {
    this.setTexture("card" + (this.opened ? this.card : ""))
  }

  open(callback) {
    if (!this.opened) {
      this.opened = true
      this.flip(callback)
    }
  }

  close(callback) {
    if (this.opened) {
      this.opened = false
      this.flip(callback)
    }
  }

  flip(callback) {
    this.show(() => {
      this.setCardTexture()
      this.hide(callback)
    })
  }

  show(callback) {
    this.scene.tweens.add({
      targets: this,
      duration: 150,
      scaleX: 0,
      ease: "Linear",
      onComplete: () => {
        if (callback) {
          callback()
        }
      }
    })
  }

  hide(callback) {
    this.scene.tweens.add({
      targets: this,
      duration: 150,
      scaleX: 1,
      ease: "Linear",
      onComplete: () => {
        if (callback) {
          callback()
        }
      }
    })
  }

}

export default Card