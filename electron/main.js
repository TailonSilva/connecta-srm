const { app, BrowserWindow, Menu, dialog, ipcMain } = require('electron');
const fs = require('node:fs');
const http = require('node:http');
const path = require('node:path');

const isDev = !app.isPackaged;
const urlFrontendDev = 'http://localhost:5174';
const nomeDiretorioPersistencia = 'Connecta CRM';
let apiServer;
let mainWindow;
let autoUpdater;
let atualizadorConfigurado = false;

async function aguardarRecursosDocumento(webContents) {
  await webContents.executeJavaScript(`
    Promise.all(
      Array.from(document.images)
        .filter((imagem) => !imagem.complete)
        .map((imagem) => new Promise((resolve) => {
          imagem.addEventListener('load', () => resolve(), { once: true });
          imagem.addEventListener('error', () => resolve(), { once: true });
        }))
    ).then(() => {
      if (document.fonts && document.fonts.ready) {
        return document.fonts.ready;
      }

      return Promise.resolve();
    });
  `, true);
}

async function gerarPdfHtml(html) {
  const janelaPdf = new BrowserWindow({
    show: false,
    width: 1240,
    height: 1754,
    backgroundColor: '#ffffff',
    webPreferences: {
      sandbox: true,
      contextIsolation: true,
      nodeIntegration: false
    }
  });

  try {
    await janelaPdf.loadURL(`data:text/html;charset=utf-8,${encodeURIComponent(html)}`);
    await aguardarRecursosDocumento(janelaPdf.webContents);

    return await janelaPdf.webContents.printToPDF({
      pageSize: 'A4',
      printBackground: true,
      preferCSSPageSize: true,
      margins: {
        top: 0,
        bottom: 0,
        left: 0,
        right: 0
      }
    });
  } finally {
    if (!janelaPdf.isDestroyed()) {
      janelaPdf.close();
    }
  }
}

function montarNomeArquivoPdf(nomeArquivo = 'documento.pdf') {
  const nomeNormalizado = String(nomeArquivo || 'documento.pdf').trim();
  return nomeNormalizado.toLowerCase().endsWith('.pdf') ? nomeNormalizado : `${nomeNormalizado}.pdf`;
}

function notificarStatusAtualizacao(payload) {
  if (!mainWindow || mainWindow.isDestroyed()) {
    return;
  }

  mainWindow.webContents.send('desktop:status-atualizacao', payload);
}

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

function obterDiretorioDadosPersistente() {
  return path.join(app.getPath('appData'), nomeDiretorioPersistencia, 'data');
}

function obterDiretorioBackupsPersistente() {
  return path.join(app.getPath('appData'), nomeDiretorioPersistencia, 'backups');
}

function normalizarListaDiretorios(caminhos) {
  return Array.from(new Set(
    caminhos
      .filter(Boolean)
      .map((caminho) => path.resolve(caminho))
  ));
}

function obterDiretoriosDadosLegados() {
  const base = app.getPath('appData');
  const pastaExecutavel = path.dirname(process.execPath);
  const pastaResources = process.resourcesPath || path.join(pastaExecutavel, 'resources');
  const pastaBaseApp = path.resolve(__dirname, '..', '..');

  return normalizarListaDiretorios([
    path.join(app.getPath('userData'), 'data'),
    path.join(base, app.getName(), 'data'),
    path.join(base, 'connecta-crm', 'data'),
    path.join(base, 'Connecta CRM', 'data'),
    path.join(base, 'CRM Desktop', 'data'),
    path.join(base, 'crm-desktop', 'data'),
    path.join(base, 'crm', 'data'),
    path.join(pastaExecutavel, 'data'),
    path.join(pastaExecutavel, 'resources', 'data'),
    path.join(pastaResources, 'data'),
    path.join(pastaBaseApp, 'data'),
    path.join(process.cwd(), 'data')
  ]);
}

function migrarBancoSeNecessario(diretorioDestino) {
  const caminhoBancoDestino = path.join(diretorioDestino, 'crm.sqlite');

  if (fs.existsSync(caminhoBancoDestino)) {
    return;
  }

  for (const diretorioLegado of obterDiretoriosDadosLegados()) {
    const caminhoLegadoNormalizado = path.resolve(diretorioLegado);
    const caminhoDestinoNormalizado = path.resolve(diretorioDestino);

    if (caminhoLegadoNormalizado === caminhoDestinoNormalizado) {
      continue;
    }

    const caminhoBancoLegado = path.join(caminhoLegadoNormalizado, 'crm.sqlite');

    if (!fs.existsSync(caminhoBancoLegado)) {
      continue;
    }

    fs.cpSync(caminhoLegadoNormalizado, caminhoDestinoNormalizado, {
      recursive: true,
      force: false
    });

    console.log(`Banco migrado automaticamente de ${caminhoLegadoNormalizado} para ${caminhoDestinoNormalizado}.`);
    return;
  }
}

function criarBackupDadosAntesAtualizacao() {
  const diretorioOrigem = obterDiretorioDadosPersistente();
  const caminhoBancoOrigem = path.join(diretorioOrigem, 'crm.sqlite');

  if (!fs.existsSync(caminhoBancoOrigem)) {
    return null;
  }

  const timestamp = new Date().toISOString().replace(/[.:]/g, '-');
  const diretorioBackups = obterDiretorioBackupsPersistente();
  const diretorioDestino = path.join(diretorioBackups, `pre-update-${timestamp}`);

  fs.mkdirSync(diretorioBackups, { recursive: true });
  fs.cpSync(diretorioOrigem, diretorioDestino, {
    recursive: true,
    force: false
  });

  console.log(`Backup de seguranca criado antes da atualizacao em ${diretorioDestino}.`);
  return diretorioDestino;
}

function montarNomeArquivoBackupBanco() {
  const timestamp = new Date().toISOString().replace(/[.:]/g, '-');
  return `Connecta-CRM-backup-${timestamp}.sqlite`;
}

async function salvarBackupBancoManual() {
  const diretorioOrigem = obterDiretorioDadosPersistente();
  const caminhoBancoOrigem = path.join(diretorioOrigem, 'crm.sqlite');

  if (!fs.existsSync(caminhoBancoOrigem)) {
    throw new Error('Nenhum banco de dados foi encontrado para gerar o backup.');
  }

  const janelaBase = mainWindow && !mainWindow.isDestroyed() ? mainWindow : undefined;
  const respostaSalvar = await dialog.showSaveDialog(janelaBase, {
    title: 'Salvar backup do banco de dados',
    defaultPath: path.join(app.getPath('documents'), montarNomeArquivoBackupBanco()),
    filters: [
      { name: 'Banco SQLite', extensions: ['sqlite'] }
    ],
    properties: ['createDirectory', 'showOverwriteConfirmation']
  });

  if (respostaSalvar.canceled || !respostaSalvar.filePath) {
    return {
      sucesso: false,
      cancelado: true,
      mensagem: 'Backup cancelado pelo usuario.'
    };
  }

  await fs.promises.copyFile(caminhoBancoOrigem, respostaSalvar.filePath);

  return {
    sucesso: true,
    cancelado: false,
    caminhoArquivo: respostaSalvar.filePath,
    mensagem: 'Backup do banco salvo com sucesso.'
  };
}

function startBundledBackend() {
  if (apiServer) {
    return;
  }

  const diretorioDadosPersistente = obterDiretorioDadosPersistente();
  fs.mkdirSync(diretorioDadosPersistente, { recursive: true });
  migrarBancoSeNecessario(diretorioDadosPersistente);
  process.env.CRM_DATA_DIR = diretorioDadosPersistente;

  const serverApp = require(path.join(__dirname, '..', 'server', 'app.js'));
  apiServer = serverApp.listen(3001, () => {
    console.log('Connecta CRM backend embutido ativo em http://127.0.0.1:3001');
  });
}

async function obterConfiguracaoAtualizacaoSistema() {
  try {
    const resposta = await fetch('http://127.0.0.1:3001/api/atualizacaoSistema');

    if (!resposta.ok) {
      return null;
    }

    return await resposta.json();
  } catch (_erro) {
    return null;
  }
}

function extrairRepositorioGithub(urlRepositorio) {
  try {
    const url = new URL(String(urlRepositorio || '').trim());

    if (url.hostname !== 'github.com' && url.hostname !== 'www.github.com') {
      return null;
    }

    const segmentos = url.pathname.split('/').filter(Boolean);

    if (segmentos.length < 2) {
      return null;
    }

    return {
      owner: segmentos[0],
      repo: segmentos[1]
    };
  } catch (_erro) {
    return null;
  }
}

async function createWindow() {
  const frontendDevAtivo = isDev ? await verificarServidorAtivo(urlFrontendDev) : false;
  const usarFrontendDev = isDev && frontendDevAtivo;
  const arquivoBuild = path.join(__dirname, '..', 'dist', 'web', 'index.html');

  if (!usarFrontendDev) {
    startBundledBackend();
  }

  mainWindow = new BrowserWindow({
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

function configurarAtualizacaoAutomatica() {
  if (isDev || process.argv.includes('--squirrel-firstrun')) {
    return;
  }

  if (!autoUpdater) {
    ({ autoUpdater } = require('electron-updater'));
  }

  if (atualizadorConfigurado) {
    return;
  }

  atualizadorConfigurado = true;
  autoUpdater.autoDownload = true;
  autoUpdater.autoInstallOnAppQuit = false;

  autoUpdater.on('error', (erro) => {
    console.error('Falha ao verificar atualizacoes:', erro);
    notificarStatusAtualizacao({
      tipo: 'erro',
      mensagem: erro.message || 'Nao foi possivel verificar atualizacoes.'
    });
  });

  autoUpdater.on('checking-for-update', () => {
    notificarStatusAtualizacao({
      tipo: 'verificando',
      mensagem: 'Verificando se existe uma nova versao disponivel...'
    });
  });

  autoUpdater.on('update-available', (info) => {
    notificarStatusAtualizacao({
      tipo: 'atualizacao-disponivel',
      mensagem: `Nova versao ${info.version} encontrada. Baixando atualizacao...`
    });
  });

  autoUpdater.on('update-not-available', () => {
    notificarStatusAtualizacao({
      tipo: 'sem-atualizacao',
      mensagem: 'Voce ja esta na versao mais recente.'
    });
  });

  autoUpdater.on('download-progress', (progresso) => {
    notificarStatusAtualizacao({
      tipo: 'baixando',
      mensagem: `Baixando atualizacao... ${Math.round(progresso.percent || 0)}%`
    });
  });

  autoUpdater.on('update-downloaded', async (info) => {
    notificarStatusAtualizacao({
      tipo: 'atualizacao-baixada',
      mensagem: `A versao ${info.version} foi baixada. Reinicie o sistema para instalar.`
    });

    if (!mainWindow || mainWindow.isDestroyed()) {
      try {
        criarBackupDadosAntesAtualizacao();
      } catch (erro) {
        console.error('Falha ao criar backup antes de instalar a atualizacao:', erro);
      }

      autoUpdater.quitAndInstall();
      return;
    }

    const resposta = await dialog.showMessageBox(mainWindow, {
      type: 'info',
      buttons: ['Reiniciar agora', 'Depois'],
      defaultId: 0,
      cancelId: 1,
      title: 'Atualizacao pronta',
      message: `A versao ${info.version} foi baixada e esta pronta para instalar.`,
      detail: 'O Connecta CRM precisa reiniciar para concluir a atualizacao.'
    });

    if (resposta.response === 0) {
      try {
        criarBackupDadosAntesAtualizacao();
      } catch (erro) {
        console.error('Falha ao criar backup antes de instalar a atualizacao:', erro);
      }

      autoUpdater.quitAndInstall();
    }
  });

}

async function iniciarVerificacaoAtualizacoes() {
  if (isDev || process.argv.includes('--squirrel-firstrun')) {
    return { mensagem: 'A verificacao de atualizacoes so funciona na versao instalada do sistema.' };
  }

  configurarAtualizacaoAutomatica();

  const configuracao = await obterConfiguracaoAtualizacaoSistema();
  const repositorio = extrairRepositorioGithub(configuracao?.urlRepositorio);

  if (!repositorio) {
    throw new Error('Configure um link valido de repositorio ou release do GitHub antes de verificar atualizacoes.');
  }

  autoUpdater.setFeedURL({
    provider: 'github',
    owner: repositorio.owner,
    repo: repositorio.repo
  });

  await autoUpdater.checkForUpdates();

  return {
    mensagem: `Verificacao iniciada para ${repositorio.owner}/${repositorio.repo}.`
  };
}

function registrarEventosDesktop() {
  ipcMain.handle('desktop:obter-versao', () => ({
    versao: app.getVersion()
  }));

  ipcMain.handle('desktop:verificar-atualizacoes', async () => {
    try {
      return {
        sucesso: true,
        ...(await iniciarVerificacaoAtualizacoes())
      };
    } catch (erro) {
      return {
        sucesso: false,
        mensagem: erro.message || 'Nao foi possivel verificar atualizacoes agora.'
      };
    }
  });

  ipcMain.handle('desktop:salvar-backup-banco', async () => {
    try {
      return await salvarBackupBancoManual();
    } catch (erro) {
      return {
        sucesso: false,
        cancelado: false,
        mensagem: erro.message || 'Nao foi possivel gerar o backup do banco de dados.'
      };
    }
  });

  ipcMain.handle('desktop:exportar-pdf', async (_evento, payload = {}) => {
    try {
      const html = String(payload.html || '').trim();

      if (!html) {
        return {
          sucesso: false,
          cancelado: false,
          mensagem: 'Nao foi possivel gerar o documento em PDF sem conteudo.'
        };
      }

      const janelaBase = mainWindow && !mainWindow.isDestroyed() ? mainWindow : undefined;
      const nomeArquivo = montarNomeArquivoPdf(payload.nomeArquivo);
      const respostaSalvar = await dialog.showSaveDialog(janelaBase, {
        title: 'Salvar PDF do orcamento',
        defaultPath: path.join(app.getPath('documents'), nomeArquivo),
        filters: [
          { name: 'Arquivo PDF', extensions: ['pdf'] }
        ],
        properties: ['createDirectory', 'showOverwriteConfirmation']
      });

      if (respostaSalvar.canceled || !respostaSalvar.filePath) {
        return {
          sucesso: false,
          cancelado: true,
          mensagem: 'Exportacao de PDF cancelada pelo usuario.'
        };
      }

      const pdf = await gerarPdfHtml(html);
      await fs.promises.writeFile(respostaSalvar.filePath, pdf);

      return {
        sucesso: true,
        cancelado: false,
        caminhoArquivo: respostaSalvar.filePath,
        mensagem: 'PDF exportado com sucesso.'
      };
    } catch (erro) {
      return {
        sucesso: false,
        cancelado: false,
        mensagem: erro.message || 'Nao foi possivel exportar o PDF do orcamento.'
      };
    }
  });
}

app.whenReady().then(() => {
  createWindow();
  registrarEventosDesktop();

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
