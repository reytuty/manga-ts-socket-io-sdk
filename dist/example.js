"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const index_1 = require("./index");
let config = {
    ip: "127.0.0.1",
    port: "8000",
    appName: "test",
    connectTimeout: 10000,
    auth: {
        username: "test",
        password: "pass",
    },
};
let mangaClient;
mangaClient = new index_1.MangaClient(config);
mangaClient.connect().then((r) => {
    console.log("connected", r);
});
