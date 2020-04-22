import { app, BrowserWindow } from "electron";
import * as path from "path";

class Iolite {
  private mainWindow: BrowserWindow | null = null;
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
      this.mainWindow = null;
    });
    this.mainWindow.on("close", () => {
      this.mainWindow.close();
    });
    this.mainWindow.webContents.openDevTools();
  }

}


(async () => {
  const iolite = new Iolite();
})();
