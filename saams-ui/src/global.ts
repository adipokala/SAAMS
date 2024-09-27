export {};

declare global {
    interface Window {
        electronAPI: {
            loginUser: (json: string) => void;
        }
    }
}