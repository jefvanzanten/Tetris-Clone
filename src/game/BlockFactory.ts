import { SquareBlock, BlockT, BlockL, BlockLine } from "./BlockShape";

export class BlockFactory {
    private cellSize: number;
    private scene: Phaser.Scene;
    private spawnPosX: number;
    private spawnPosY: number;

    constructor(
        cellsize: number,
        scene: Phaser.Scene,
        gameAreaWidth: number,
        gameAreaHeight: number
    ) {
        this.cellSize = cellsize;
        this.scene = scene;
        this.spawnPosX = 1024 / 2 - gameAreaWidth / 2 + cellsize * 4;
        this.spawnPosY = 768 / 2 - gameAreaHeight / 2;
    }

    createSquareBlock(): SquareBlock {
        const square = new SquareBlock(
            this.cellSize,
            this.scene,
            this.spawnPosX,
            this.spawnPosY
        );
        this.scene.add.existing(square.createShape());
        return square;
    }

    createTBlock() {
        const t_shape = new BlockT(
            this.cellSize,
            this.scene,
            this.spawnPosX,
            this.spawnPosY
        );
        this.scene.add.existing(t_shape.createShape());
        return t_shape;
    }

    createLBlock() {
        const l_shape = new BlockL(
            this.cellSize,
            this.scene,
            this.spawnPosX,
            this.spawnPosY
        );
        this.scene.add.existing(l_shape.createShape());
        return l_shape;
    }

    createReversedLBlock() {}

    createLineBlock() {
        const line_shape = new BlockLine(
            this.cellSize,
            this.scene,
            this.spawnPosX + this.cellSize * 2,
            this.spawnPosY
        );
        this.scene.add.existing(line_shape.createShape());
        return line_shape;
    }

    createZBlock() {}

    createReversedZBlock() {}
}
