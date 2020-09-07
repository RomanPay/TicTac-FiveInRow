export default class GameOverScene extends Phaser.Scene
{
    isWin: boolean;

    buttonImage: Phaser.GameObjects.Image;
    finishImage: Phaser.GameObjects.Image;
    winParticles: Phaser.GameObjects.Particles.ParticleEmitterManager;
    winEmitter: Phaser.GameObjects.Particles.ParticleEmitter;

    constructor()
    {
        super({ key: 'GameOverScene'});
    }

    init(data)
    {
        this.isWin = data.isWin;
    }

    create()
    {
        console.log("in game over");
        this.buttonImage = this.add.sprite(this.cameras.main.worldView.x + this.cameras.main.width / 2,
             this.cameras.main.worldView.y + this.cameras.main.width / 2, 'restartButton');
        this.buttonImage.setInteractive();
        

        const nameImage = (this.isWin) ? 'winScreen' : 'loseScreen';
        this.finishImage = this.add.sprite(this.cameras.main.width / 2, this.cameras.main.height / 2 - 200, nameImage);
        
        if (this.isWin)
        {
            this.winParticles = this.add.particles('confetti');

            this.winEmitter = this.winParticles.createEmitter({
                frame: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11],
                x: {min: 0, max: this.cameras.main.width},
                y: 0,
                on: true,
                quantity: 50,
                frequency: 500,
                rotate: {start: 0, end: 360},
                speed: 200,
                lifespan: 5000,
                scale: {start: 2, end: 0}
            });
       }
        this.buttonImage.on('pointerdown', () => this.scene.start('MainScene'));
    }
}