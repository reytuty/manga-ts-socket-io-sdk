import { MangaClient, MangaConfig } from ".";

let config: MangaConfig = {
  ip: "localhost",
  port: "8000",
  appName: "test",
  connectTimeout: 10000,
  auth: {
    username: "test",
    password: "pass",
  },
};

let mangaClient: MangaClient = new MangaClient(config);

mangaClient.connect().then((r) => {
  mangaClient.addListenerOnMessage(
    "dev.invest.token.order.buyed",
    (data: any) => {
      console.log("************ Alguém comprou algo", data);
    }
  );
});
