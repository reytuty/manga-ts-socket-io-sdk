"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.MangaClient = void 0;
const socket_io_client_1 = require("socket.io-client");
class MangaClient {
    constructor(p_config) {
        this.isConnected = false;
        this.pathsCache = new Map();
        this.config = p_config;
        this.appName = p_config.appName;
        this.socket = (0, socket_io_client_1.io)(`${this.config.ip}:${this.config.port}`);
        const me = this;
        this.setupSocketListeners();
    }
    emit(method, ob, callback) {
        if (!this.isConnected) {
            return false;
        }
        this.socket.emit(method, ob, callback);
        return true;
    }
    setupSocketListeners() {
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
    set(path, value, callback) {
        return this.emit("set", { path, value }, callback);
    }
    reset(path, value, callback) {
        return this.emit("reset", { path, value }, callback);
    }
    message(path, value, callback, save = false) {
        return this.emit("message", { path, value, save }, callback);
    }
    get(path, callback) {
        return this.emit("get", { path }, callback);
    }
    delete(path, callback) {
        return this.emit("delete", { path }, callback);
    }
    get paths() {
        return Array.from(this.pathsCache.keys());
    }
    addListener(path, mode, p_callback) {
        const method = `${path}__${mode}`;
        if (this.pathsCache.has(method)) {
            let info = this.pathsCache.get(method);
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
        this.socket.on(method, p_callback);
        this.pathsCache.set(method, { count: 0 });
        this.socket.emit("addListener", obj);
    }
    addListenerOnChange(path, callback) {
        this.addListener(path, "onChange", (data) => callback(data === null || data === void 0 ? void 0 : data.value));
    }
    addListenerOnSet(path, callback) {
        this.addListener(path, "onSet", (data) => callback(data === null || data === void 0 ? void 0 : data.value));
    }
    addListenerOnChangeLenth(path, callback) {
        this.addListener(path, "onChangeLength", (data) => callback(data === null || data === void 0 ? void 0 : data.value));
    }
    removeAllListenerByPath(path) {
        this.pathsCache.delete(path);
    }
    connect() {
        var _a, _b;
        return __awaiter(this, void 0, void 0, function* () {
            if (this.isConnected)
                return;
            this.socket.connect();
            let timeout = (_b = (_a = this.config) === null || _a === void 0 ? void 0 : _a.connectTimeout) !== null && _b !== void 0 ? _b : 1000;
            while (!this.isConnected && timeout > 0) {
                yield new Promise((resolve) => setTimeout(resolve, 100));
                timeout -= 100;
            }
        });
    }
    disconnect() {
        if (!this.isConnected) {
            return;
        }
        this.socket.disconnect();
    }
}
exports.MangaClient = MangaClient;
