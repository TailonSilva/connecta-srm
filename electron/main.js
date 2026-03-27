const { app, BrowserWindow } = require('electron');
const path = require('node:path');

const isDev = !app.isPackaged;
let apiServer;

function startBundledBackend() {
  if (isDev || apiServer) {
    return;
  }

  process.env.CRM_DATA_DIR = path.join(app.getPath('userData'), 'data');

  const serverApp = require(path.join(__dirname, '..', 'server', 'app.js'));
  apiServer = serverApp.listen(3001, () => {
    console.log('CRM backend embutido ativo em http://127.0.0.1:3001');
  });
}

function createWindow() {
  const mainWindow = new BrowserWindow({
    width: 1280,
    height: 840,
    minWidth: 1024,
    minHeight: 720,
    backgroundColor: '#f3efe7',
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      contextIsolation: true,
      nodeIntegration: false
    }
  });

  if (isDev) {
    mainWindow.loadURL('http://127.0.0.1:5173');
    mainWindow.webContents.openDevTools({ mode: 'detach' });
    return;
  }

  mainWindow.loadFile(path.join(__dirname, '..', 'dist', 'web', 'index.html'));
}

app.whenReady().then(() => {
  startBundledBackend();
  createWindow();

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('before-quit', () => {
  if (apiServer) {
    apiServer.close();
  }
});
