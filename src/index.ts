import { io, Socket } from "socket.io-client";

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

export class MangaClient {
  private config: MangaConfig;
  private socket: Socket;
  public isConnected: boolean = false;
  public appName: string;
  private pathsCache: Map<string, { count: number }> = new Map();

  constructor(p_config: MangaConfig) {
    this.config = p_config;
    this.appName = p_config.appName;
    this.socket = io(`${normalizeUrl(this.config.ip)}:${this.config.port}`);

    this.setupSocketListeners();
  }

  private emit(method: string, ob: any, callback?: Function): boolean {
    if (!this.isConnected) {
      return false;
    }
    this.socket.emit(method, ob, callback);
    return true;
  }

  private setupSocketListeners(): void {
    this.socket.on("connect", () => {
      this.isConnected = true;
      if (this.config.auth) {
        const { username, password } = this.config.auth;
        this.socket.emit("authentication", { username, password });
      }
      this.socket.emit("checkin", { name: this.appName });
    });

    this.socket.on("disconnect", () => {
      this.isConnected = false;
      this.pathsCache.clear();
    });
  }

  public set(path: string, value: any, callback?: Function): boolean {
    return this.emit("set", { path, value }, callback);
  }

  public reset(path: string, value: any, callback?: Function): boolean {
    return this.emit("reset", { path, value }, callback);
  }

  public message(
    path: string,
    value: any,
    callback?: Function,
    save: boolean = false
  ): boolean {
    return this.emit("message", { path, value, save }, callback);
  }

  public get(path: string, callback?: Function): boolean {
    return this.emit("get", { path }, callback);
  }

  public delete(path: string, callback?: Function): boolean {
    return this.emit("delete", { path }, callback);
  }

  public get paths(): string[] {
    return Array.from(this.pathsCache.keys());
  }

  private addListener(
    path: string,
    mode: "onChange" | "onSet" | "onChangeLength" | "onMessage",
    p_callback: (data: PathValue) => void
  ): void {
    const method = `${path}__${mode}`;

    if (this.pathsCache.has(method)) {
      let info = this.pathsCache.get(method)!;
      info.count++;
      return;
    }

    const obj = {
      listener: {
        property: path,
        updateMode: mode,
      },
      handler: {
        method,
      },
    };
    let listenerName: string =
      mode === "onMessage" ? "addMessageListener" : "addListener";
    this.socket.on(method, p_callback);
    this.pathsCache.set(method, { count: 0 });
    this.socket.emit(listenerName, obj);
  }

  public addListenerOnChange(
    path: string,
    callback: (data: any) => void
  ): void {
    this.addListener(path, "onChange", (data) => callback(data));
  }

  public addListenerOnSet(path: string, callback: (data: any) => void): void {
    this.addListener(path, "onSet", (data) => callback(data));
  }

  public addListenerOnMessage(
    path: string,
    callback: (data: any) => void
  ): void {
    this.addListener(path, "onMessage", (data) => callback(data));
  }

  public addListenerOnChangeLenth(
    path: string,
    callback: (data: any) => void
  ): void {
    this.addListener(path, "onChangeLength", (data) => callback(data));
  }

  public removeAllListenerByPath(path: string): void {
    this.pathsCache.delete(path);
  }

  public async connect(): Promise<boolean> {
    if (this.isConnected) return true;
    this.socket.connect();
    let timeout: number = this.config?.connectTimeout ?? 1000;
    while (!this.isConnected && timeout > 0) {
      await new Promise((resolve) => setTimeout(resolve, 100));
      timeout -= 100;
    }
    return timeout > 0;
  }

  public disconnect(): void {
    if (!this.isConnected) {
      return;
    }
    this.socket.disconnect();
  }
}
function normalizeUrl(ip: string) {
  if (ip.startsWith("http://") || ip.startsWith("https://")) {
    return ip;
  }
  if (!ip) {
    ip = "localhost";
  }
  return `http://${ip}`;
}
