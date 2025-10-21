import { EventBus } from "./EventBus";
import { BlockFactory } from "./BlockFactory";
import { BlockShape, MoveDirection } from "./BlockShape";

enum GameState {
    WAITING_TO_START,
    PLAYING,
    PAUSED,
    GAME_OVER,
}

class GameManager {
    private static instance: GameManager;
    private currentState: GameState;
    private blockFactory: BlockFactory;
    private currentBlock: BlockShape;
    private lastFallTime: number = 0;
    private fallInterval: number = 200;

    private constructor() {
        this.currentState = GameState.WAITING_TO_START;
        this.setupEventListeners();
    }

    private setupEventListeners(): void {
        EventBus.on("game-state-changed", this.onStateChanged, this);
    }

    private onStateChanged(state: GameState): void {
        if (state === GameState.PLAYING && this.blockFactory) {
            this.spawnBlock();
        }
    }

    private spawnBlock(): void {
        this.currentBlock = this.blockFactory!.createTBlock();
        EventBus.emit("piece-spawned", this.currentBlock);
    }

    public static get Instance(): GameManager {
        if (!GameManager.instance) {
            GameManager.instance = new GameManager();
        }
        return GameManager.instance;
    }

    public get CurrentState(): GameState {
        return this.currentState;
    }

    public get CurrentBlock(): BlockShape | undefined {
        return this.currentBlock;
    }

    public update() {
        const now = Date.now();

        if (now - this.lastFallTime >= this.fallInterval) {
            this.currentBlock.move(MoveDirection.Down);
            this.lastFallTime = now;
        }

        // TODO: Implementeer collision detection

        // TODO: Check voor userinput en beweeg de block in die richting
    }

    public set CurrentState(state: GameState) {
        console.log("GameManager.setState called with:", state);
        this.currentState = state;
        console.log("Emitting game-state-changed event");
        EventBus.emit("game-state-changed", state);
        console.log("Event emitted");
    }

    public setBlockFactory(factory: BlockFactory): void {
        this.blockFactory = factory;
    }
}

export { GameManager, GameState };
export default GameManager;
