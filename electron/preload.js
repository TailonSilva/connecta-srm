const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('desktop', {
  isElectron: true,
  platform: process.platform,
  obterVersao: () => ipcRenderer.invoke('desktop:obter-versao'),
  verificarAtualizacoes: () => ipcRenderer.invoke('desktop:verificar-atualizacoes'),
  aoAtualizarStatus: (callback) => {
    const listener = (_evento, payload) => callback(payload);
    ipcRenderer.on('desktop:status-atualizacao', listener);

    return () => {
      ipcRenderer.removeListener('desktop:status-atualizacao', listener);
    };
  }
});
