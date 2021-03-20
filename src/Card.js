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
    this.setPosition(position.x, position.y)
  }

  setCardTexture() {
    this.setTexture("card" + (this.opened ? this.card : ""))
  }

  open(callback) {
    this.opened = true
    this.flip(callback)
  }

  close(callback) {
    this.opened = false
    this.flip(callback)
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