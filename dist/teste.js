"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const _1 = require(".");
let config = {
    ip: "localhost",
    port: "8000",
    appName: "test",
    connectTimeout: 10000,
    auth: {
        username: "test",
        password: "pass",
    },
};
let mangaClient = new _1.MangaClient(config);
mangaClient.connect().then((r) => {
    mangaClient.addListenerOnMessage("dev.invest.token.order.buyed", (data) => {
        console.log("************ Alguém comprou algo", data);
    });
});
