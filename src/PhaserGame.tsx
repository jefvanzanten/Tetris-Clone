import {
    forwardRef,
    useEffect,
    useLayoutEffect,
    useRef,
    useState,
} from "react";
import StartGame from "./game/main";
import { EventBus } from "./game/EventBus";
import StartDialog from "./components/StartDialog/StartDialog";
import { GameManager, GameState } from "./game/GameManager";

export interface IRefPhaserGame {
    game: Phaser.Game | null;
    scene: Phaser.Scene | null;
}

interface IProps {
    currentActiveScene?: (scene_instance: Phaser.Scene) => void;
}

export const PhaserGame = forwardRef<IRefPhaserGame, IProps>(
    function PhaserGame({ currentActiveScene }, ref) {
        const [isOpen, setIsOpen] = useState(false);
        const [currentScene, setCurrentScene] = useState<string>("");
        const game = useRef<Phaser.Game | null>(null!);

        useLayoutEffect(() => {
            if (game.current === null) {
                game.current = StartGame("game-container");

                if (typeof ref === "function") {
                    ref({ game: game.current, scene: null });
                } else if (ref) {
                    ref.current = { game: game.current, scene: null };
                }
            }

            return () => {
                if (game.current) {
                    game.current.destroy(true);
                    if (game.current !== null) {
                        game.current = null;
                    }
                }
            };
        }, [ref]);

        useEffect(() => {
            const handleSceneReady = (scene_instance: Phaser.Scene) => {
                const sceneName = scene_instance.scene.key;
                setCurrentScene(sceneName);

                if (sceneName === "Game") {
                    const gameState = GameManager.getInstance().getState();
                    setIsOpen(gameState === GameState.WAITING_TO_START);
                }

                if (
                    currentActiveScene &&
                    typeof currentActiveScene === "function"
                ) {
                    currentActiveScene(scene_instance);
                }

                if (typeof ref === "function") {
                    ref({ game: game.current, scene: scene_instance });
                } else if (ref) {
                    ref.current = {
                        game: game.current,
                        scene: scene_instance,
                    };
                }
            };

            EventBus.on("current-scene-ready", handleSceneReady);
            return () => {
                EventBus.off("current-scene-ready", handleSceneReady);
            };
        }, [currentActiveScene, ref]);

        useEffect(() => {
            const handleStateChange = (state: GameState) => {
                console.log("State change:", state, "Current scene:", currentScene);
                if (currentScene === "Game") {
                    setIsOpen(state === GameState.WAITING_TO_START);
                }
            };

            EventBus.on("game-state-changed", handleStateChange);
            return () => {
                EventBus.off("game-state-changed", handleStateChange);
            };
        }, [currentScene]);

        return (
            <>
                <StartDialog isOpen={isOpen} />
                <div id="game-container"></div>;
            </>
        );
    }
);
