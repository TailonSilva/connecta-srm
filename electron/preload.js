const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('desktop', {
  isElectron: true,
  platform: process.platform,
  obterVersao: () => ipcRenderer.invoke('desktop:obter-versao'),
  salvarBackupBanco: () => ipcRenderer.invoke('desktop:salvar-backup-banco'),
  verificarAtualizacoes: () => ipcRenderer.invoke('desktop:verificar-atualizacoes'),
  exportarPdf: (payload) => ipcRenderer.invoke('desktop:exportar-pdf', payload),
  aoAtualizarStatus: (callback) => {
    const listener = (_evento, payload) => callback(payload);
    ipcRenderer.on('desktop:status-atualizacao', listener);

    return () => {
      ipcRenderer.removeListener('desktop:status-atualizacao', listener);
    };
  }
});
