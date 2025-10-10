import { useState } from "react";
import Dialog from "../Dialog/Dialog";
import { GameManager, GameState } from "../../game/GameManager";

type StartDialogProps = {
    isOpen: boolean;
};

function StartDialog({ isOpen }: StartDialogProps) {
    const [level, setLevel] = useState(1);

    const handlePlay = () => {
        console.log("Play clicked!");
        const manager = GameManager.getInstance();
        console.log("Manager:", manager);
        manager.setState(GameState.PLAYING);
        console.log("State set to PLAYING");
    };

    return (
        <Dialog isOpen={isOpen}>
            <button onClick={handlePlay}>Play</button>
            <div>
                <label>Level</label>
                <button>+</button>
                <input value={level} onChange={() => {}} />
            </div>
        </Dialog>
    );
}

export default StartDialog;
