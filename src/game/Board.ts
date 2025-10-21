import { Scene } from "phaser";

class GameField {
    private cols: number = 10;
    private rows: number = 20;
    private cellSize: number = 35;
    private width: number = this.cols * this.cellSize;
    private height: number = this.rows * this.cellSize;
    private activeScene: Scene;
    private grid: number[][];

    constructor(scene: Scene) {
        this.activeScene = scene;
        this.grid = Array.from({ length: this.rows }, () =>
            Array.from({ length: this.cols }, () => 0)
        );
    }

    public get Grid() {
        return this.grid;
    }

    public get Cols() { return this.cols; }
    public get Rows() { return this.rows; }
    public get CellSize() { return this.cellSize; }
    public get StartX() { return 1024 / 2 - this.width / 2; }
    public get StartY() { return 768 / 2 - this.height / 2; }

    create(): void {
        this.createField();
        this.createGrid();
    }

    // game area bg
    createField(): void {
        const gameArea = new Phaser.GameObjects.Graphics(this.activeScene)
            .fillStyle(0x222222)
            .fillRect(
                1024 / 2 - this.width / 2,
                768 / 2 - this.height / 2,
                this.width,
                this.height
            );
        this.activeScene.add.existing(gameArea);
    }

    createGrid(): void {
        const startX = this.StartX;
        const startY = this.StartY;

        const grid = new Phaser.GameObjects.Graphics(this.activeScene);
        grid.lineStyle(1, 0x444444, 0.5);

        // Vertical lines
        for (let i = 0; i <= this.cols; i++) {
            const x = startX + i * this.cellSize;
            grid.lineBetween(x, startY, x, startY + this.height);
        }

        // Horizontal lines
        for (let i = 0; i <= this.rows; i++) {
            const y = startY + i * this.cellSize;
            grid.lineBetween(startX, y, startX + this.width, y);
        }

        this.activeScene.add.existing(grid);
    }

    gridDebug(): string {
        let out = "\n";

        for (let r = 0; r < this.rows; r++) {
            const rowVals: string[] = [];
            for (let c = 0; c < this.cols; c++) {
                rowVals.push(String(this.grid[r][c]));
            }
            out += rowVals.join(" ") + "\n";
        }

        return out;
    }

    worldToGrid(x: number, y: number): { x: number; y: number } {
        const gx = Math.floor((x - this.StartX) / this.cellSize);
        const gy = Math.floor((y - this.StartY) / this.cellSize);
        return { x: gx, y: gy };
    }

    gridDebugOverlay(cells: { x: number; y: number }[], mark: string = "X"): string {
        const markSet = new Set<string>();
        for (const c of cells) {
            if (c.x >= 0 && c.x < this.cols && c.y >= 0 && c.y < this.rows) {
                markSet.add(`${c.x},${c.y}`);
            }
        }

        let out = "\n";
        for (let r = 0; r < this.rows; r++) {
            const rowVals: string[] = [];
            for (let c = 0; c < this.cols; c++) {
                const key = `${c},${r}`;
                if (markSet.has(key)) {
                    rowVals.push(mark);
                } else {
                    rowVals.push(String(this.grid[r][c]));
                }
            }
            out += rowVals.join(" ") + "\n";
        }
        return out;
    }
}

export default GameField;
