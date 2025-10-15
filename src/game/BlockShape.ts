class BlockShape {
    private _blockSize: number;
    private _container: Phaser.GameObjects.Container;

    protected get Container() {
        return this._container;
    }

    protected get BlockSize() {
        return this._blockSize;
    }

    constructor(
        blockSize: number,
        scene: Phaser.Scene,
        spawnPosX: number,
        spawnPosY: number
    ) {
        this._blockSize = blockSize;
        this._container = new Phaser.GameObjects.Container(
            scene,
            spawnPosX,
            spawnPosY
        );
    }

    createSingleBlock(
        color: number,
        xPos: number,
        yPos: number,
        scene: Phaser.Scene
    ) {
        console.log("single block");
        const rectangle = new Phaser.GameObjects.Graphics(scene)
            .fillStyle(color)
            .fillRect(xPos, yPos, this._blockSize, this._blockSize)
            .lineStyle(0.3, color + 0x777777)
            .strokeRect(xPos, yPos, this._blockSize, this._blockSize);

        return rectangle;
    }

    createShape(): void {}

    createIndicator(): void {
        //
    }

    rotateLeft(): void {
        console.log("rotation");
        const currentRotation = this.Container.rotation;
        console.log(currentRotation);
        this.Container.setRotation(currentRotation + Math.PI / 2);
    }

    rotateRight(): void {
        console.log("rotation");
        const currentRotation = this.Container.rotation;
        console.log(currentRotation);
        this.Container.setRotation(currentRotation + Math.PI * 2);
    }

    move(direction: string) {
        //
    }

    toGround(): void {
        //
    }
}

class SquareBlock extends BlockShape {
    constructor(
        blockSize: number,
        scene: Phaser.Scene,
        spawnPosX: number,
        spawnPosY: number
    ) {
        super(blockSize, scene, spawnPosX, spawnPosY);
    }

    createShape() {
        console.log("square");
        for (let x = 0; x < 2; x++) {
            for (let y = 0; y < 2; y++) {
                const block = this.createSingleBlock(
                    0x772200,
                    x * this.BlockSize,
                    y * this.BlockSize,
                    this.Container.scene
                );
                this.Container.add(block);
            }
        }
        return this.Container;
    }
}

class BlockT extends BlockShape {
    constructor(
        blockSize: number,
        scene: Phaser.Scene,
        spawnPosX: number,
        spawnPosY: number
    ) {
        super(blockSize, scene, spawnPosX, spawnPosY);
    }

    createShape() {
        console.log("T Shape");

        for (let x = 0; x < 3; x++) {
            const block = this.createSingleBlock(
                0x332233,
                x * this.BlockSize,
                0,
                this.Container.scene
            );

            this.Container.add(block);

            if (x == 1) {
                const block = this.createSingleBlock(
                    0x332233,
                    x * this.BlockSize,
                    this.BlockSize,
                    this.Container.scene
                );
                this.Container.add(block);
            }
        }
        return this.Container;
    }
}

class BlockL extends BlockShape {
    constructor(
        blockSize: number,
        scene: Phaser.Scene,
        spawnPosX: number,
        spawnPosY: number
    ) {
        super(blockSize, scene, spawnPosX, spawnPosY);
    }

    createShape() {
        console.log("L Shape");

        for (let y = 0; y < 3; y++) {
            const block = this.createSingleBlock(
                0x332233,
                0,
                y * this.BlockSize,
                this.Container.scene
            );

            this.Container.add(block);

            if (y == 2) {
                const block = this.createSingleBlock(
                    0x332233,
                    this.BlockSize,
                    y * this.BlockSize,
                    this.Container.scene
                );
                this.Container.add(block);
            }
        }
        return this.Container;
    }
}

class BlockLine extends BlockShape {
    constructor(
        blockSize: number,
        scene: Phaser.Scene,
        spawnPosX: number,
        spawnPosY: number
    ) {
        super(blockSize, scene, spawnPosX, spawnPosY);
    }

    createShape() {
        console.log("Line Shape");

        for (let y = 0; y < 4; y++) {
            const block = this.createSingleBlock(
                0x332233,
                0,
                y * this.BlockSize,
                this.Container.scene
            );

            this.Container.add(block);
        }
        return this.Container;
    }
}

export { SquareBlock, BlockT, BlockL, BlockLine };
