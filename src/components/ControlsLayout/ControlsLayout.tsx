import { EventBus } from "../../game/EventBus";
import styles from "./ControlsLayout.module.css";

type ControllerActions = {
    // dpadUp: () => void;
    // dpadDown: () => void;
    // dpadLeft: () => void;
    // dpadRight: () => void;
    actionA: () => void;
    // actionB: () => void;
};

function ControlsLayout({ actionA }: ControllerActions) {
    return (
        <div className={styles["controls-layout-container"]}>
            <div className={styles["dpad-container"]}>
                <div className={styles.dpad}>
                    <button
                        className={`${styles["dpad-btn"]} ${styles["dpad-up"]}`}
                        onClick={() => {}}
                    >
                        ↑
                    </button>
                    <div className={styles["dpad-middle"]}>
                        <button
                            className={`${styles["dpad-btn"]} ${styles["dpad-left"]}`}
                            onClick={() => {}}
                        >
                            ←
                        </button>
                        <div className={styles["dpad-center"]}></div>
                        <button
                            className={`${styles["dpad-btn"]} ${styles["dpad-right"]}`}
                            onClick={() => {}}
                        >
                            →
                        </button>
                    </div>
                    <button
                        className={`${styles["dpad-btn"]} ${styles["dpad-down"]}`}
                        onClick={() => {}}
                    >
                        ↓
                    </button>
                </div>
            </div>
            <div className={styles["action-buttons"]}>
                <button
                    className={`${styles["action-btn"]} ${styles["b-button"]}`}
                    onClick={() => {}}
                >
                    B
                </button>
                <button
                    className={`${styles["action-btn"]} ${styles["a-button"]}`}
                    onClick={actionA}
                >
                    A
                </button>
            </div>
        </div>
    );
}

export default ControlsLayout;
