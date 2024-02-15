import { MangaClient, MangaConfig } from "./index";

const testData: any = {
  listeners: [],
  receivedData: {},
};
async function waitForData(
  eventName: string,
  timeout: number = 3000,
  dataReference?: any
) {
  dataReference = dataReference || testData.receivedData;
  const tryingTimes: number = timeout / 100;
  return new Promise(async (resolve, reject) => {
    let count = 0;
    while (dataReference[eventName] === undefined && count < tryingTimes) {
      await sleep(100);
      count++;
    }
    resolve(true);
  });
}
async function sleep(time: number): Promise<void> {
  await new Promise((resolve, reject) => {
    setTimeout(resolve, time);
  });
  return;
}

describe("MangaClient", () => {
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

  let mangaClient: MangaClient;

  beforeAll(async () => {
    mangaClient = new MangaClient(config);
    await mangaClient.connect();
  });

  it("should be connected", () => {
    sleep(100);
    expect(mangaClient.isConnected).toBe(true);
  });
  it("should stay connected", () => {
    sleep(2000);
    expect(mangaClient.isConnected).toBe(true);
  });
  it("should to disconnect", () => {
    mangaClient.disconnect();
    sleep(100);
    expect(mangaClient.isConnected).toBe(false);
  });
  it("should to connect again", async () => {
    await mangaClient.connect();
    sleep(100);
    expect(mangaClient.isConnected).toBe(true);
  });
  it("should to add a listener", async () => {
    mangaClient.addListenerOnChange("test", (data: any) => {
      console.log("teste recebido", data);
      testData.receivedData["test"] = data;
    });
    sleep(200);
    const data: string = `test ${new Date().toISOString()}`;
    mangaClient.set("test", data);
    await sleep(200);
    expect(testData.receivedData?.test).toBe(data);
  });
});
