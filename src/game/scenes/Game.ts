import { EventBus } from "../EventBus";
import { Scene } from "phaser";
import GameManager, { GameState } from "../GameManager";
import { DebugPanel } from "../DebugPanel";
import { BlockFactory } from "../BlockFactory";
import GameField from "../Board";

export class Game extends Scene {
    camera: Phaser.Cameras.Scene2D.Camera;
    private readonly cellSize: number = 35;
    private readonly gridRows: number = 20;
    private readonly gridCols: number = 10;
    private gameAreaWidth: number;
    private gameAreaHeight: number;
    private debugPanel: DebugPanel;
    private blockFactory: BlockFactory;
    private gameField: GameField;

    // private sideAreaWidth: number = 1024 / 4;
    // private sideAreaHeight: number = 768 / 4;

    constructor() {
        super("Game");
        this.gameAreaWidth = this.gridCols * this.cellSize;
        this.gameAreaHeight = this.gridRows * this.cellSize;
        this.gameField = new GameField(this);
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

        this.gameField.create();

        // Single DebugPanel instance
        this.debugPanel = new DebugPanel(this, {
            x: 1024 * 0.05,
            y: 768 * 0.05,
        });
        // State and Grid items
        this.debugPanel.addDebugItem(
            "state",
            "State",
            GameState[GameManager.Instance.CurrentState]
        );
        this.debugPanel.addDebugItem("grid", "Grid", this.gameField.gridDebug());
        // Listen for board updates to refresh grid view
        EventBus.on(
            "board-updated",
            () => this.debugPanel.updateDebugItem("grid", this.gameField.gridDebug()),
            this
        );

        this.blockFactory = new BlockFactory(
            this.cellSize,
            this,
            this.gameAreaWidth,
            this.gameAreaHeight
        );

        GameManager.Instance.setBlockFactory(this.blockFactory);

        EventBus.emit("current-scene-ready", this);
    }

    // Deprecated: single DebugPanel instance used now

    changeScene() {
        this.scene.start("GameOver");
    }

    update() {
        if (GameManager.Instance.CurrentState == GameState.PLAYING)
            GameManager.Instance.update();
    }
}
