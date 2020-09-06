import { cellState } from '../objects/CellState'

export interface CellEventData {
    cell: Cell
    i?: number
}

export class Cell extends Phaser.GameObjects.Container
{
    state: cellState;
    clickTween: Phaser.Tweens.Tween
    cellImage: Phaser.GameObjects.Image;
    signImage: Phaser.GameObjects.Image;
    yArray: number;
    xArray: number;
    
    constructor(scene: Phaser.Scene, x: number, y: number, state: cellState)
    {
        super(scene, x, y);
        scene.add.existing(this);
        
        this.cellImage = this.scene.add.image(0, 0, 'cell');
        this.signImage = this.scene.add.image(0, 0, 'cell');
        this.signImage.setVisible(false);

        this.add([this.cellImage, this.signImage]);

        this.setSize(this.getBounds().width, this.getBounds().height);
        this.setInteractive();

        this.once('pointerdown', (pointer) =>{
            // console.log(pointer);
            this.scene.events.emit('setSign', {cell: this} as CellEventData);
        });
    }
 
    setSign(sign: cellState)
    {
        this.signImage.setVisible(true);
        if (sign == cellState.cross)
            this.signImage.setTexture('cross');
        if (sign == cellState.ring)
            this.signImage.setTexture('ring')
        const tween = this.scene.add.tween({
            targets: this.signImage,
            scaleX: {from: 0, to: 1},
            scaleY: {from: 0, to: 1},
            ease: "Bounce.easeOut",
            duration: 750
        });     
        this.state = sign;
    }

}