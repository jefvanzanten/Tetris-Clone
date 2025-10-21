import { EventBus } from "./EventBus";

enum MoveDirection {
    Down,
    Left,
    Right,
}

type Offset = { x: number; y: number };

class BlockShape {
    private _blockSize: number;
    private _container: Phaser.GameObjects.Container;
    protected offsets: Offset[] = [];
    private _blocks: Phaser.GameObjects.Graphics[] = [];

    protected get Container() {
        return this._container;
    }

    protected get BlockSize() {
        return this._blockSize;
    }

    public get Position() {
        return { x: this._container.x, y: this._container.y };
    }

    public get CellSize() {
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
        _xPos: number,
        _yPos: number,
        scene: Phaser.Scene
    ) {
        const rectangle = new Phaser.GameObjects.Graphics(scene)
            .fillStyle(color)
            // draw at local (0,0); we'll position the Graphics itself
            .fillRect(0, 0, this._blockSize, this._blockSize)
            .lineStyle(0.3, color + 0x777777)
            .strokeRect(0, 0, this._blockSize, this._blockSize);

        return rectangle as Phaser.GameObjects.Graphics;
    }

    protected createBlocksFromOffsets(color: number): void {
        this._blocks = [];
        for (const off of this.offsets) {
            const block = this.createSingleBlock(
                color,
                0,
                0,
                this.Container.scene
            );
            block.setPosition(off.x * this.BlockSize, off.y * this.BlockSize);
            this.Container.add(block);
            this._blocks.push(block);
        }
    }

    protected updateChildPositionsFromOffsets(): void {
        for (let i = 0; i < this._blocks.length && i < this.offsets.length; i++) {
            const off = this.offsets[i];
            const block = this._blocks[i];
            block.setPosition(off.x * this.BlockSize, off.y * this.BlockSize);
        }
    }

    public getLocalCellPositions(): { x: number; y: number }[] {
        return this.offsets.map((o) => ({
            x: o.x * this.BlockSize,
            y: o.y * this.BlockSize,
        }));
    }

    createShape(): void {}

    createIndicator(): void {
        //
    }

    rotateLeft(): void {
        if (this.offsets.length === 0) return;
        this.offsets = this.offsets.map((o) => ({ x: -o.y, y: o.x }));
        this.updateChildPositionsFromOffsets();
        EventBus.emit("piece-rotated", this);
    }

    rotateRight(): void {
        if (this.offsets.length === 0) return;
        this.offsets = this.offsets.map((o) => ({ x: o.y, y: -o.x }));
        this.updateChildPositionsFromOffsets();
        EventBus.emit("piece-rotated", this);
    }

    move(direction: MoveDirection) {
        switch (direction) {
            case MoveDirection.Down: {
                this.Container.setPosition(
                    this.Container.x,
                    this.Container.y + this.BlockSize
                );
                EventBus.emit("piece-moved", this);
                break;
            }
        }
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
        this.offsets = [
            { x: 0, y: 0 },
            { x: 1, y: 0 },
            { x: 0, y: 1 },
            { x: 1, y: 1 },
        ];
        this.createBlocksFromOffsets(0x772200);
        return this.Container;
    }

    rotateLeft(): void {
        // no-op for square (O piece)
    }

    rotateRight(): void {
        // no-op for square (O piece)
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
        this.offsets = [
            { x: -1, y: 0 },
            { x: 0, y: 0 },
            { x: 1, y: 0 },
            { x: 0, y: 1 },
        ];
        this.createBlocksFromOffsets(0x332233);
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
        this.offsets = [
            { x: 0, y: -1 },
            { x: 0, y: 0 },
            { x: 0, y: 1 },
            { x: 1, y: 1 },
        ];
        this.createBlocksFromOffsets(0x332233);
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
        this.offsets = [
            { x: -1, y: 0 },
            { x: 0, y: 0 },
            { x: 1, y: 0 },
            { x: 2, y: 0 },
        ];
        this.createBlocksFromOffsets(0x332233);
        return this.Container;
    }
}

export { BlockShape, BlockT, BlockL, BlockLine, SquareBlock, MoveDirection };
