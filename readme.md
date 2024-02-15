# Manga TS Socket IO SDK

## Example

```
import { MangaClient, MangaConfig } from "manga-ts-socket-io-sdk";

let config: MangaConfig = {
  ip: "127.0.0.1",
  port: "8000",
  appName: "test",
  connectTimeout: 10000,
  auth: {
    username: "test",
    password: "pass",
  },
};

let mangaClient: MangaClient;

mangaClient = new MangaClient(config);
mangaClient.connect().then((r) => {
  console.log("connected", r);
});

```
