import { useRef } from "react";
import { IRefPhaserGame, PhaserGame } from "./PhaserGame";
import { MainMenu } from "./game/scenes/MainMenu";
import ControlsLayout from "./components/ControlsLayout/ControlsLayout";

function App() {
    //  References to the PhaserGame component (game and scene are exposed)
    const phaserRef = useRef<IRefPhaserGame | null>(null);

    const changeScene = () => {
        if (phaserRef.current) {
            const scene = phaserRef.current.scene as MainMenu;

            if (scene) {
                scene.changeScene();
            }
        }
    };

    // Event emitted from the PhaserGame component
    const currentScene = (scene: Phaser.Scene) => {};

    return (
        <div id="app">
            <header />
            <PhaserGame ref={phaserRef} currentActiveScene={currentScene} />
            <ControlsLayout actionA={() => {}} />
        </div>
    );
}

export default App;
