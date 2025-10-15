import { useState } from "react";
import Dialog from "../Dialog/Dialog";
import { GameManager, GameState } from "../../game/GameManager";
import styles from "./StartDialog.module.css";

type StartDialogProps = {
    isOpen: boolean;
};

function StartDialog({ isOpen }: StartDialogProps) {
    const [level, setLevel] = useState(1);

    const handlePlay = () => {
        console.log("Play clicked!");
        const manager = GameManager.Instance;
        console.log("Manager:", manager);
        manager.CurrentState = GameState.PLAYING;
        console.log("State set to PLAYING");
    };

    const handleIncreaseModifier = () => setLevel(level + 1);
    const handleDecreaseModifier = () => {
        if (level > 0) setLevel(level - 1);
    };

    return (
        <Dialog isOpen={isOpen}>
            <button className={styles["play-btn"]} onClick={handlePlay}>
                Play
            </button>
            <div className={styles["level-container"]}>
                <label className={styles.label}>Level</label>
                <div className={styles["btn-container"]}>
                    <button
                        className={styles.modifier}
                        onClick={handleIncreaseModifier}
                    >
                        +
                    </button>
                    <input
                        className={styles.input}
                        value={level}
                        onChange={() => {}}
                    />
                    <button
                        className={styles.modifier}
                        onClick={handleDecreaseModifier}
                    >
                        -
                    </button>
                </div>
            </div>
        </Dialog>
    );
}

export default StartDialog;
