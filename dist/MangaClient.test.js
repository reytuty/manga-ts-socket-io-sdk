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
const index_1 = require("./index");
const testData = {
    listeners: [],
    receivedData: {},
};
function waitForData(eventName, timeout = 3000, dataReference) {
    return __awaiter(this, void 0, void 0, function* () {
        dataReference = dataReference || testData.receivedData;
        const tryingTimes = timeout / 100;
        return new Promise((resolve, reject) => __awaiter(this, void 0, void 0, function* () {
            let count = 0;
            while (dataReference[eventName] === undefined && count < tryingTimes) {
                yield sleep(100);
                count++;
            }
            resolve(true);
        }));
    });
}
function sleep(time) {
    return __awaiter(this, void 0, void 0, function* () {
        yield new Promise((resolve, reject) => {
            setTimeout(resolve, time);
        });
        return;
    });
}
describe("MangaClient", () => {
    let config = {
        ip: "localhost",
        port: "81",
        appName: "test",
    };
    let mangaClient;
    beforeAll(() => __awaiter(void 0, void 0, void 0, function* () {
        mangaClient = new index_1.MangaClient(config);
        yield mangaClient.connect();
    }));
    it("should be connected", () => {
        sleep(1000);
        expect(mangaClient.isConnected).toBe(true);
    });
});
