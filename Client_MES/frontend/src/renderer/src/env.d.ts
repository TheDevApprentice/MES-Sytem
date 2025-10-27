/// <reference types="vite/client" />
/// <reference types="@univerjs/vite-plugin/types" />

interface ElectronAPI {
    ipcRenderer: typeof import('electron').ipcRenderer;
    minimize: () => void;
    maximize: () => void;
    close: () => void;
}
