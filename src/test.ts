import { MangaClient, MangaConfig } from ".";

let config: MangaConfig = {
  ip: "http://18.215.49.140",
  port: "8001",
  appName: "test lib",
  connectTimeout: 10000,
  auth: {
    username: "test2",
    password: "pass2",
  },
};

let mangaClient: MangaClient = new MangaClient(config);

mangaClient.connect().then((r) => {
  console.log("Connected", r);
  mangaClient.addListenerOnMessage("stress.test", (data: any) => {
    console.log("************ stress.test", data);
  });
});
