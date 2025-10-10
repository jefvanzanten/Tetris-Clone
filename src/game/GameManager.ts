import { EventBus } from "./EventBus";

enum GameState {
    WAITING_TO_START,
    PLAYING,
    PAUSED,
    GAME_OVER,
}

class GameManager {
    private static instance: GameManager;
    private currentState: GameState;

    private constructor() {
        this.currentState = GameState.WAITING_TO_START;
    }

    public static getInstance(): GameManager {
        if (!GameManager.instance) {
            GameManager.instance = new GameManager();
        }
        return GameManager.instance;
    }

    public getState(): GameState {
        return this.currentState;
    }

    public setState(state: GameState): void {
        console.log("GameManager.setState called with:", state);
        this.currentState = state;
        console.log("Emitting game-state-changed event");
        EventBus.emit("game-state-changed", state);
        console.log("Event emitted");
    }
}

export { GameManager, GameState };
export default GameManager;
