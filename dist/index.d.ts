export interface MangaConfig {
    ip: string;
    port: string;
    appName: string;
    auth?: {
        username: string;
        password: string;
    };
    connectTimeout?: number;
}
export interface PathValue {
    path: string;
    value: any;
}
export interface Message extends PathValue {
    save: boolean;
}
export declare class MangaClient {
    private config;
    private socket;
    isConnected: boolean;
    appName: string;
    private pathsCache;
    constructor(p_config: MangaConfig);
    private emit;
    private setupSocketListeners;
    set(path: string, value: any, callback?: Function): boolean;
    reset(path: string, value: any, callback?: Function): boolean;
    message(path: string, value: any, callback?: Function, save?: boolean): boolean;
    get(path: string, callback?: Function): boolean;
    delete(path: string, callback?: Function): boolean;
    get paths(): string[];
    private addListener;
    addListenerOnChange(path: string, callback: (data: any) => void): void;
    addListenerOnSet(path: string, callback: (data: any) => void): void;
    addListenerOnMessage(path: string, callback: (data: any) => void): void;
    addListenerOnChangeLenth(path: string, callback: (data: any) => void): void;
    removeAllListenerByPath(path: string): void;
    connect(): Promise<boolean>;
    disconnect(): void;
}
