import { Scene } from "phaser";
import { EventBus } from "./EventBus";
import { GameState } from "./GameManager";
import { IDebugPanel } from "./IDebugPanel";

interface DebugItem {
    label: string;
    value: string;
    textObject: Phaser.GameObjects.Text;
}

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
    private scene: Scene;
    private config: Required<DebugPanelConfig>;
    private debugItems: Map<string, DebugItem>;
    private background: Phaser.GameObjects.Graphics;
    private container: Phaser.GameObjects.Container;

    constructor(scene: Scene, config: DebugPanelConfig) {
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
    }

    private setupEventListeners(): void {
        EventBus.on("game-state-changed", this.onGameStateChanged, this);
    }

    private onGameStateChanged(state: GameState): void {
        this.updateDebugItem("state", GameState[state]);
    }

    public addDebugItem(key: string, label: string, initialValue: string = ""): void {
        const yOffset = this.debugItems.size * this.config.lineHeight;

        const textObject = this.scene.add.text(
            this.config.padding,
            this.config.padding + yOffset,
            `${label}: ${initialValue}`,
            {
                fontFamily: "Arial",
                fontSize: this.config.fontSize,
                color: this.config.fontColor,
            }
        );

        this.debugItems.set(key, {
            label,
            value: initialValue,
            textObject,
        });

        this.container.add(textObject);
        this.updateBackground();
    }

    public updateDebugItem(key: string, newValue: string): void {
        const item = this.debugItems.get(key);
        if (item) {
            item.value = newValue;
            item.textObject.setText(`${item.label}: ${newValue}`);
            this.updateBackground();
        }
    }

    public removeDebugItem(key: string): void {
        const item = this.debugItems.get(key);
        if (item) {
            item.textObject.destroy();
            this.debugItems.delete(key);
            this.repositionItems();
            this.updateBackground();
        }
    }

    private repositionItems(): void {
        let index = 0;
        this.debugItems.forEach((item) => {
            const yOffset = index * this.config.lineHeight;
            item.textObject.setPosition(
                this.config.padding,
                this.config.padding + yOffset
            );
            index++;
        });
    }

    private updateBackground(): void {
        this.background.clear();

        if (this.debugItems.size === 0) return;

        let maxWidth = 0;
        this.debugItems.forEach((item) => {
            const width = item.textObject.width;
            if (width > maxWidth) maxWidth = width;
        });

        const bgWidth = maxWidth + this.config.padding * 2;
        const bgHeight =
            this.debugItems.size * this.config.lineHeight + this.config.padding * 2;

        this.background
            .fillStyle(this.config.backgroundColor, 0.7)
            .fillRect(0, 0, bgWidth, bgHeight);
    }

    public setVisible(visible: boolean): void {
        this.container.setVisible(visible);
    }

    public destroy(): void {
        EventBus.off("game-state-changed", this.onGameStateChanged, this);
        this.debugItems.forEach((item) => item.textObject.destroy());
        this.debugItems.clear();
        this.background.destroy();
        this.container.destroy();
    }
}
