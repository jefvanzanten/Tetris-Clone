import styles from "./Dialog.module.css";

type DialogProps = {
    children: React.ReactNode;
    isOpen: boolean;
};

function Dialog({ children, isOpen }: DialogProps) {
    return <>{isOpen && <div className={styles.dialog}>{children}</div>}</>;
}

export default Dialog;
