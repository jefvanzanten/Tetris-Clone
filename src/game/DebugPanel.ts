import { Scene } from "phaser";
import { EventBus } from "./EventBus";
import { GameState } from "./GameManager";
import { IDebugPanel } from "./IDebugPanel";
import { BlockShape } from "./BlockShape";

type DebugItemText = {
    type: "text";
    label: string;
    value: string;
    textObject: Phaser.GameObjects.Text;
};

type DebugItemNode = {
    type: "node";
    node: Phaser.GameObjects.GameObject;
    height: number;
    width: number;
};

interface DebugPanelConfig {
    x: number;
    y: number;
    fontSize?: string;
    fontColor?: string;
    backgroundColor?: number;
    padding?: number;
    lineHeight?: number;
}

export class DebugPanel implements IDebugPanel {
    private static current?: DebugPanel;
    private scene: Scene;
    private config: Required<DebugPanelConfig>;
    private debugItems: Map<string, DebugItemText | DebugItemNode>;
    private background: Phaser.GameObjects.Graphics;
    private container: Phaser.GameObjects.Container;
    private piecePreview?: Phaser.GameObjects.Graphics;
    private readonly piecePreviewSize = { width: 110, height: 110 };
    private currentPiece?: BlockShape;

    constructor(scene: Scene, config: DebugPanelConfig) {
        // Ensure singleton to avoid duplicates during HMR/dev
        if (DebugPanel.current) {
            DebugPanel.current.destroy();
        }
        DebugPanel.current = this;
        this.scene = scene;
        this.config = {
            x: config.x,
            y: config.y,
            fontSize: config.fontSize || "14px",
            fontColor: config.fontColor || "#ffffff",
            backgroundColor: config.backgroundColor || 0x000000,
            padding: config.padding || 10,
            lineHeight: config.lineHeight || 20,
        };

        this.debugItems = new Map();
        this.container = this.scene.add.container(this.config.x, this.config.y);
        this.background = this.scene.add.graphics();
        this.container.add(this.background);

        this.setupEventListeners();

        // Add a built-in node slot for piece preview
        // Create graphics; it will be managed by the container
        this.piecePreview = this.scene.add.graphics();
        this.addNodeItem(
            "piece-preview",
            this.piecePreview,
            this.piecePreviewSize.height,
            this.piecePreviewSize.width
        );
    }

    private setupEventListeners(): void {
        EventBus.on("game-state-changed", this.onGameStateChanged, this);
        EventBus.on("piece-spawned", this.onPieceSpawned, this);
        EventBus.on("piece-rotated", this.onPieceUpdated, this);
        EventBus.on("piece-moved", this.onPieceUpdated, this);
    }

    private onGameStateChanged(state: GameState): void {
        this.updateDebugItem("state", GameState[state]);
    }

    public addDebugItem(key: string, label: string, initialValue: string = ""): void {
        const textObject = this.scene.add.text(0, 0, `${label}: ${initialValue}`,
            { fontFamily: "Arial", fontSize: this.config.fontSize, color: this.config.fontColor });
        this.debugItems.set(key, { type: "text", label, value: initialValue, textObject });
        this.container.add(textObject);
        this.repositionItems();
        this.updateBackground();
    }

    public updateDebugItem(key: string, newValue: string): void {
        const item = this.debugItems.get(key) as DebugItemText | undefined;
        if (item && item.type === "text") {
            item.value = newValue;
            item.textObject.setText(`${item.label}: ${newValue}`);
            this.repositionItems();
            this.updateBackground();
        }
    }

    public removeDebugItem(key: string): void {
        const item = this.debugItems.get(key);
        if (item) {
            if ((item as DebugItemText).type === "text") {
                (item as DebugItemText).textObject.destroy();
            } else {
                this.container.remove((item as DebugItemNode).node, true);
            }
            this.debugItems.delete(key);
            this.repositionItems();
            this.updateBackground();
        }
    }

    public addNodeItem(key: string, node: Phaser.GameObjects.GameObject, height: number, width: number): void {
        const existing = this.debugItems.get(key) as DebugItemNode | undefined;
        if (existing && existing.type === "node") {
            // remove previous node to avoid duplicate rendering
            this.container.remove(existing.node, true);
        }
        this.debugItems.set(key, { type: "node", node, height, width });
        this.container.add(node);
        this.repositionItems();
        this.updateBackground();
    }

    private repositionItems(): void {
        let y = this.config.padding;
        this.debugItems.forEach((item) => {
            if ((item as DebugItemText).type === "text") {
                const txt = (item as DebugItemText).textObject;
                txt.setPosition(this.config.padding, y);
                y += this.config.lineHeight;
            } else {
                const nodeItem = item as DebugItemNode;
                const node: any = nodeItem.node as any;
                if (node && typeof node.setPosition === 'function') {
                    node.setPosition(this.config.padding, y);
                } else {
                    node.x = this.config.padding;
                    node.y = y;
                }
                y += nodeItem.height;
            }
        });
    }

    private updateBackground(): void {
        this.background.clear();

        if (this.debugItems.size === 0) return;

        let maxWidth = 0;
        let totalHeight = this.config.padding; // start with top padding
        this.debugItems.forEach((item) => {
            if ((item as DebugItemText).type === "text") {
                const txt = (item as DebugItemText).textObject;
                maxWidth = Math.max(maxWidth, txt.width);
                totalHeight += this.config.lineHeight;
            } else {
                const nodeItem = item as DebugItemNode;
                maxWidth = Math.max(maxWidth, nodeItem.width);
                totalHeight += (item as DebugItemNode).height;
            }
        });
        totalHeight += this.config.padding; // bottom padding

        const bgWidth = maxWidth + this.config.padding * 2;
        const bgHeight = totalHeight;

        this.background
            .fillStyle(this.config.backgroundColor, 0.7)
            .fillRect(0, 0, bgWidth, bgHeight);
    }

    public setVisible(visible: boolean): void {
        this.container.setVisible(visible);
    }

    public destroy(): void {
        EventBus.off("game-state-changed", this.onGameStateChanged, this);
        EventBus.off("piece-spawned", this.onPieceSpawned, this);
        EventBus.off("piece-rotated", this.onPieceUpdated, this);
        EventBus.off("piece-moved", this.onPieceUpdated, this);
        this.debugItems.forEach((item) => {
            if ((item as DebugItemText).type === "text") {
                (item as DebugItemText).textObject.destroy();
            } else {
                this.container.remove((item as DebugItemNode).node, true);
            }
        });
        this.debugItems.clear();
        this.background.destroy();
        this.container.destroy();
        if (DebugPanel.current === this) DebugPanel.current = undefined;
    }

    private onPieceSpawned(piece: BlockShape): void {
        this.currentPiece = piece;
        this.drawPiecePreview();
    }

    private onPieceUpdated(piece: BlockShape): void {
        if (this.currentPiece === piece) {
            this.drawPiecePreview();
        }
    }

    private drawPiecePreview(): void {
        if (!this.piecePreview) return;
        const g = this.piecePreview;
        g.clear();

        // Background for the preview slot
        g.fillStyle(0x111111, 1).fillRect(0, 0, this.piecePreviewSize.width, this.piecePreviewSize.height);

        const piece = this.currentPiece;
        if (!piece) return;

        const cells = piece.getLocalCellPositions(); // pixel local positions
        const size = piece.CellSize;
        let minX = Infinity, minY = Infinity, maxX = -Infinity, maxY = -Infinity;
        cells.forEach(c => {
            minX = Math.min(minX, c.x);
            minY = Math.min(minY, c.y);
            maxX = Math.max(maxX, c.x + size);
            maxY = Math.max(maxY, c.y + size);
        });

        const contentW = Math.max(1, maxX - minX);
        const contentH = Math.max(1, maxY - minY);
        const scale = Math.min(
            (this.piecePreviewSize.width - 10) / contentW,
            (this.piecePreviewSize.height - 10) / contentH
        );

        const offsetX = (this.piecePreviewSize.width - contentW * scale) / 2;
        const offsetY = (this.piecePreviewSize.height - contentH * scale) / 2;

        g.fillStyle(0xffffff, 1);
        cells.forEach(c => {
            const x = (c.x - minX) * scale + offsetX;
            const y = (c.y - minY) * scale + offsetY;
            g.fillRect(x, y, size * scale, size * scale);
        });
    }
}
