export default class PreloadScene extends Phaser.Scene
{
	constructor()
	{
		super({ key: 'PreloadScene' });
	}

	preload()
	{
		this.load.image('cell', 'assets/img/cell.png');
		this.load.image('cross', 'assets/img/cross.png');
		this.load.image('ring', 'assets/img/ring.png');
		this.load.image('restartButton', 'assets/img/restartButton.png');
		this.load.image('winScreen', 'assets/img/winScreen.png');
		this.load.image('loseScreen', 'assets/img/loseScreen.png');
		this.load.spritesheet('confetti', 'assets/img/confettiSpriteSheet.png', {frameWidth: 16, frameHeight: 10, endFrame: 12});
	}

	create()
	{
		console.log("loading main scene..");
		this.scene.start('MainScene');
		
	}
}
