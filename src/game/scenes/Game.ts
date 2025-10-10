import { EventBus } from "../EventBus";
import { Scene } from "phaser";

export class Game extends Scene {
    camera: Phaser.Cameras.Scene2D.Camera;
    private readonly cellSize: number = 35;
    private readonly gridRows: number = 20;
    private readonly gridCols: number = 10;
    private gameAreaWidth: number;
    private gameAreaHeight: number;
    private sideAreaWidth: number = 1024 / 4;
    private sideAreaHeight: number = 768 / 4;

    constructor() {
        super("Game");
        this.gameAreaWidth = this.gridCols * this.cellSize;
        this.gameAreaHeight = this.gridRows * this.cellSize;
    }

    create() {
        this.camera = this.cameras.main;

        // canvas bg
        const bg = new Phaser.GameObjects.Rectangle(
            this,
            0,
            0,
            1024,
            768,
            0x7700ff
        );
        bg.setOrigin(0);
        this.add.existing(bg);

        // game area bg
        const gameArea = new Phaser.GameObjects.Graphics(this)
            .fillStyle(0x222222)
            .fillRect(
                1024 / 2 - this.gameAreaWidth / 2,
                768 / 2 - this.gameAreaHeight / 2,
                this.gameAreaWidth,
                this.gameAreaHeight
            );
        this.add.existing(gameArea);

        this.createGrid();

        // // Stats area
        // const statsArea = new Phaser.GameObjects.Graphics(this)
        //     .fillStyle(0x222222)
        //     .fillRect(
        //         25,
        //         768 / 2 - this.sideAreaHeight / 2,
        //         this.sideAreaWidth,
        //         this.sideAreaHeight
        //     );
        // this.add.existing(statsArea);

        // // Next piece area
        // const nextArea = new Phaser.GameObjects.Graphics(this)
        //     .fillStyle(0x222222)
        //     .fillRect(
        //         1024 - this.sideAreaWidth - 25,
        //         768 / 2 - this.sideAreaHeight / 2,
        //         this.sideAreaWidth,
        //         this.sideAreaHeight
        //     );
        // this.add.existing(nextArea);

        EventBus.emit("current-scene-ready", this);
    }

    createGrid() {
        const startX = 1024 / 2 - this.gameAreaWidth / 2;
        const startY = 768 / 2 - this.gameAreaHeight / 2;

        const grid = new Phaser.GameObjects.Graphics(this);
        grid.lineStyle(1, 0x444444, 0.5);

        // Vertical lines
        for (let i = 0; i <= this.gridCols; i++) {
            const x = startX + i * this.cellSize;
            grid.lineBetween(x, startY, x, startY + this.gameAreaHeight);
        }

        // Horizontal lines
        for (let i = 0; i <= this.gridRows; i++) {
            const y = startY + i * this.cellSize;
            grid.lineBetween(startX, y, startX + this.gameAreaWidth, y);
        }

        this.add.existing(grid);
    }

    changeScene() {
        this.scene.start("GameOver");
    }
}

