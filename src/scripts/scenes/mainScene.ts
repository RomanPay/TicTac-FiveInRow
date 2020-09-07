import { Cell, CellEventData} from '../objects/Cell'
import { cellState } from '../objects/CellState';
// import { Input } from 'phaser';

const NUM_EXPAND_BOARDS = 1;
const OVER_CELL = 3;
const CELL_BEFOR_EXPAND = 5;

export default class MainScene extends Phaser.Scene
{
    numTurns: number = 0;
    cell : Cell;
    cellsArray: Cell[][];
    numCell: number =  CELL_BEFOR_EXPAND + NUM_EXPAND_BOARDS * OVER_CELL * 2;
    playerSign: cellState;
    botSign: cellState;
    minIndex: number;
    maxIndex: number;    

    checkMatrix =[
        {x: 0, y: 1},
        {x: 1, y: 1},
        {x: 1, y: 0},
        {x: 1, y: -1},
        {x: 0, y: -1},
        {x: -1, y: -1},
        {x: -1, y: 0},
        {x: -1, y: 1}
    ];

    constructor()
    {
        super({ key: 'MainScene' })
        this.cellsArray =  Array.from(Array(this.numCell), () => new Array(this.numCell));
    }

    onClick(data: CellEventData)
    {
        if (this.numTurns >= 15)
        {
            this.minIndex = 0;
            this.maxIndex = 10;
            this.unfoldBoard();
        }

        const cell = data.cell;
        
        if (cell.state == cellState.free)
        {
            cell.setSign(this.playerSign);
            if (this.checkWin(cell.xArray, cell.yArray, this.playerSign))
                this.gameOver(this.playerSign);
            this.moveBot();
            if (this.checkWin(cell.xArray, cell.yArray, this.botSign))
            {
                this.gameOver(this.botSign);
            }
        }
    }

    gameOver(sign: cellState)
    {
        setTimeout(() => {
            this.scene.start('GameOverScene'), {isWin: sign == this.playerSign}
        });
    }

    checkWin(x: number, y: number, sign: cellState)
    {
        this.numTurns++;
        let numSigns: number = 0;

        for (let i = this.minIndex; i <= this.maxIndex; i++)
        {
            for (let j = this.minIndex; j <= this.maxIndex; j++)
            {
                for (let direction of this.checkMatrix)
                {
                    let y = i;
                    let x = j;
                    numSigns = 0;
                    while (this.checkEdge(y, x) && this.cellsArray[y][x].state == sign)
                    {
                        numSigns++;
                        if (numSigns == 5)
                             return (true);
                        y += direction.y;
                        x += direction.x;
                    }
                }
            }
        }
        return (false);
    }

    checkEdge(i: number, j: number)
    {
        if (i > this.maxIndex)
            return false;
        if (i < this.minIndex)
            return false;
        if (j > this.maxIndex)
            return false;
        if (j < this.minIndex)
            return false;
        return true;
    }

    checkDirection(x: number, y: number, direction: {x : number, y: number,}, sign: cellState)
    {
        let numSigns: number = 0;

        while (this.checkEdge(y, x) && this.cellsArray[y][x].state == sign)
        {
            numSigns++;
            y += direction.y;
            x += direction.x;
        }
        if (numSigns == 0)
            return 0;
        if (!this.checkEdge(y, x))
            numSigns--;    
        return (numSigns);
    }

    moveBot()
    {
        let numSigns: number = 0;
        let numSignsBot: number = 0;
        let numSignsPlayer: number = 0;
        let cellPlayer: Cell | null = null;
        let cellBot: Cell | null = null;

        for (let y = this.minIndex; y <= this.maxIndex; y++)
        {
            for (let x = this.minIndex; x <= this.maxIndex; x++)
            {
                for (let direction of this.checkMatrix)
                {
                    numSigns = this.checkDirection(x, y, direction, this.botSign);
                    let nextX = x + numSigns * direction.x;
                    let nextY = y + numSigns * direction.y;
                    if (numSigns > numSignsBot && this.cellsArray[nextY][nextX].state == cellState.free)
                    {
                        numSignsBot = numSigns;
                        cellBot = this.cellsArray[nextY][nextX];
                    }

                    numSigns = this.checkDirection(x, y, direction, this.playerSign);
                    nextX = x + numSigns * direction.x;
                    nextY = y + numSigns * direction.y;
                    if (numSigns > numSignsPlayer && this.cellsArray[nextY][nextX].state == cellState.free)
                    {
                        numSignsPlayer = numSigns;
                        cellPlayer = this.cellsArray[nextY][nextX];
                    }
                }
            }
        }

        if (numSignsBot == 4 && cellBot)
        {
            cellBot.setSign(this.botSign);
            return;
        }

        if (numSignsPlayer >= 3 && cellPlayer)
        {
            cellPlayer.setSign(this.botSign);
            return;
        }

        if (numSignsBot != 0 && cellBot)
        {
            cellBot.setSign(this.botSign);
            return;
        }

        if (numSignsBot == 0)
        {
            let arr: Cell[] = [];

            for (let i = this.minIndex; i <= this.maxIndex; i++)
            {
                for (let j = this.minIndex; j <= this.maxIndex; j++)
                {
                    if (this.cellsArray[i][j].state == cellState.free)
                        arr.push(this.cellsArray[i][j]);
                };
            };

            arr = Phaser.Math.RND.shuffle(arr);
            arr[0].setSign(this.botSign);
        }
    }

    create() 
    {
        this.numTurns = 0;
        this.minIndex = 3;
        this.maxIndex = 7;
        this.playerSign = cellState.cross;
        this.botSign = cellState.ring;

        console.log("start main scene")

        this.events.on('setSign', (data: CellEventData) => this.onClick(data));

        for (let i = 0; i < this.numCell; i++)
        {
            for (let j = 0; j < this.numCell; j++)
            {
                this.cell = new Cell(this, 0, 0, cellState.free);
                this.cell.setPosition(
                    this.cameras.main.centerX - this.cell.displayWidth * this.numCell / 2.2 + (j *  this.cell.displayWidth),
                    this.cameras.main.centerY - this.cell.displayHeight * this.numCell / 2.2 + (i * this.cell.displayHeight)
                );
                this.cell.yArray = i;
                this.cell.xArray = j;
                this.cellsArray[i][j] = this.cell;
            }
        }
    }

    unfoldBoard()
    {
        this.cameras.main.zoomTo(0.461, 900);
    }
}