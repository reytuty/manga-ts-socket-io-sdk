import { io, Socket } from "socket.io-client";

export class SocketClient {
  private socket: Socket;

  constructor(private serverUrl: string) {
    this.socket = io(serverUrl);

    this.setupListeners();
  }

  private setupListeners(): void {
    this.socket.on("connect", () => {
      console.log("Connected to server");
    });

    this.socket.on("message", (data: string) => {
      console.log("Received message from server:", data);
    });

    this.socket.on("disconnect", () => {
      console.log("Disconnected from server");
    });
  }

  public sendMessage(message: string): void {
    this.socket.emit("message", message);
  }

  public disconnect(): void {
    this.socket.disconnect();
  }
}

// Usage example
const serverUrl = "http://localhost:8000"; // Replace with your server URL
const socketClient = new SocketClient(serverUrl);

// Send a message to the server
socketClient.sendMessage("Hello, server!");
