import { app, BrowserWindow, remote } from "electron";
import * as path from "path";
import Signaling from "./signaling";

class Iolite {
  private mainWindow: BrowserWindow | null = null;
  private server: Signaling;
  constructor() {
    app.on("ready", this.createWindow.bind(this));
    app.on("window-all-closed", () => {
      if (process.platform !== "darwin") {
        app.quit();
      }
    });
    app.on("activate", () => {
      if (this.mainWindow === null) {
        this.createWindow();
      }
    });
    this.server = new Signaling(9000);
  }

  private createWindow(): void {
    this.mainWindow = new BrowserWindow({
      height: 600,
      webPreferences: {
        preload: path.join(__dirname, "preload.js"),
      },
      width: 800,
    });
    this.mainWindow.loadFile(path.join(__dirname, "../public/index.html"));
    this.mainWindow.on("closed", () => {
      this.server.close();
      this.mainWindow = null;
    });
    this.mainWindow.webContents.openDevTools();
  }

}


(async () => {
  const iolite = new Iolite();
})();
