import Response from "./model/response";

export {};

declare global {
    interface Window {
        electronAPI: {
            loginUser: (json: string) => Response;
            onGetIPC: () => dataResponse[];
        }
    }

    interface dataResponse {
      id: number,
      name: string,
      code: string
    }
}