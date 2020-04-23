import log from "electron-log";
import Express from "express";
import {PeerServer} from "peer";

export default class Singaling {
  private server: Express.Express;
  constructor(port: number) {
    this.server = PeerServer({port});
    log.info(port);
    process.on("SIGTERM", this.close.bind(this));
    process.on("SIGINT", this.close.bind(this));
  }

  public close(): void {
    log.info("peer server close.");
    this.server = null;
  }
}
