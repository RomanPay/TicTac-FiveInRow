export default class PreloadScene extends Phaser.Scene {
  constructor() {
    super({ key: 'PreloadScene' })
  }

  preload() {
    this.load.image('cell', 'assets/img/cell.png')
    this.load.image('cross', 'assets/img/cross.png')
    this.load.image('ring', 'assets/img/ring.png')
  }

  create() {
    this.scene.start('MainScene')
  }
}
