import { callOnce } from "../utils/callOnce"

export const isElectron = (): boolean => {
    // Renderer process
    if (typeof window !== 'undefined' && typeof window.process === 'object' && (window.process as any).type === 'renderer') {
        return true;
    }

    // Main process
    if (typeof process !== 'undefined' && typeof process.versions === 'object' && !!(process.versions as any).electron) {
        return true;
    }

    // Detect the user agent when the `nodeIntegration` option is set to true
    if (typeof navigator === 'object' && typeof navigator.userAgent === 'string' && navigator.userAgent.indexOf('Electron') >= 0) {
        return true;
    }

    return false;
}

export const initializeDesktopApp = callOnce(() => {
    if (isElectron()) {
        const { ipcRenderer } = window.require('electron')
        ipcRenderer.send('checkVersion')
        console.log("Electron found")
    }
})
