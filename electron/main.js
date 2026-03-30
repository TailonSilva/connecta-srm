const { app, BrowserWindow, Menu } = require('electron');
const fs = require('node:fs');
const http = require('node:http');
const path = require('node:path');

const isDev = !app.isPackaged;
const urlFrontendDev = 'http://localhost:5174';
let apiServer;

function verificarServidorAtivo(url) {
  return new Promise((resolve) => {
    const requisicao = http.get(url, (resposta) => {
      resposta.resume();
      resolve(resposta.statusCode >= 200 && resposta.statusCode < 500);
    });

    requisicao.on('error', () => resolve(false));
    requisicao.setTimeout(1200, () => {
      requisicao.destroy();
      resolve(false);
    });
  });
}

function startBundledBackend() {
  if (apiServer) {
    return;
  }

  process.env.CRM_DATA_DIR = path.join(app.getPath('userData'), 'data');

  const serverApp = require(path.join(__dirname, '..', 'server', 'app.js'));
  apiServer = serverApp.listen(3001, () => {
    console.log('CRM backend embutido ativo em http://127.0.0.1:3001');
  });
}

async function createWindow() {
  const frontendDevAtivo = isDev ? await verificarServidorAtivo(urlFrontendDev) : false;
  const usarFrontendDev = isDev && frontendDevAtivo;
  const arquivoBuild = path.join(__dirname, '..', 'dist', 'web', 'index.html');

  if (!usarFrontendDev) {
    startBundledBackend();
  }

  const mainWindow = new BrowserWindow({
    width: 1280,
    height: 840,
    minWidth: 1024,
    minHeight: 720,
    backgroundColor: '#f3efe7',
    autoHideMenuBar: true,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      contextIsolation: true,
      nodeIntegration: false
    }
  });

  mainWindow.setMenuBarVisibility(false);
  Menu.setApplicationMenu(null);

  if (usarFrontendDev) {
    mainWindow.loadURL(urlFrontendDev);
    return;
  }

  if (!fs.existsSync(arquivoBuild)) {
    throw new Error('Build web nao encontrado. Execute "npm run build:web" antes de iniciar o Electron sem o Vite.');
  }

  mainWindow.loadFile(arquivoBuild);
}

app.whenReady().then(() => {
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
