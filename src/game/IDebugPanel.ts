export interface IDebugPanel {
    addDebugItem(key: string, label: string, initialValue: string): void;
    updateDebugItem(key: string, newValue: string): void;
    removeDebugItem(key: string): void;
    setVisible(visible: boolean): void;
    destroy(): void;
}
