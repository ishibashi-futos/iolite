import log from "electron-log";
import {networkInterfaces} from "os";
import {Server} from "ws";
import WebSocket = require("ws");

export default class WebSocketService {
  private server: Server;
  constructor(port: number) {
    this.server = new Server({port});
    this.server.on("connection", this.connection.bind(this));
    log.info(`startup server within ${port}`);
    getIpAddress().forEach((address) => {
      log.info(`http://${address}:${port}`);
    });
  }

  private connection(ws: WebSocket): void {
    ws.on("message", (message: string) => {
      this.server.clients.forEach((client) => {
        if (!isSame(ws, client)) {
          client.send(message);
        }
      });
    });
  }
}

const isSame = (ws1: WebSocket, ws2: WebSocket): boolean => {
  return ws1 === ws2;
};

const getIpAddress = (): string[] => {
  const interfaces = networkInterfaces();
  const address = new Array();
  for (const deviceName of Object.keys(interfaces)) {
    const devices = interfaces[deviceName];
    devices.forEach((device) => {
      if (device.internal || device.family !== "IPv4") {
        return;
      }
      address.push(device.address);
    });
  }
  return address;
};
