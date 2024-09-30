export {};

declare global {
    interface Window {
        electronAPI: {
            loginUser: (json: string) => void,
            onGetIPC: () => dataResponse;
        }
    }

    interface dataResponse {
      id: number,
      name: string,
      code: string
    }
}