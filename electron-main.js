const { app, BrowserWindow } = require('electron');
const path = require('path');
const isDev = require('electron-is-dev');
const { fork } = require('child_process');

let serverProcess;

function createWindow() {
  const win = new BrowserWindow({
    width: 1200,
    height: 800,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
    }
  });

  if (isDev) {
    win.loadURL('http://localhost:3001?dev=true');
    win.webContents.openDevTools();
  } else {
    // In production, we load the index.html from the dist folder
    win.loadFile(path.join(__dirname, 'client/dist/index.html'));
  }
}

app.whenReady().then(() => {
  if (!isDev) {
    // Start the Bun server in the background for production
    // Note: This assumes the user has bun installed on their machine
    // For a fully standalone app, we would bundle the server with pkg or similar
    serverProcess = fork(path.join(__dirname, 'server/index.ts'), [], {
      execPath: 'bun', // Electron needs to know to use bun
      stdio: 'inherit'
    });
  }

  createWindow();

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
});

app.on('window-all-closed', () => {
  if (serverProcess) serverProcess.kill();
  if (process.platform !== 'darwin') {
    app.quit();
  }
});
