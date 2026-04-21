function obterDesktopApi() {
  if (typeof window === 'undefined') {
    return null;
  }

  return window.desktop || null;
}

export function desktopTemExportacaoPdf() {
  return typeof obterDesktopApi()?.exportarPdf === 'function';
}

function exportarPdfNavegador({ html, nomeArquivo }) {
  if (typeof window === 'undefined') {
    return {
      sucesso: false,
      cancelado: false,
      mensagem: 'Nao foi possivel abrir a impressao do PDF neste ambiente.'
    };
  }

  const janelaImpressao = window.open('about:blank', '_blank');

  if (!janelaImpressao) {
    return {
      sucesso: false,
      cancelado: false,
      mensagem: 'O navegador bloqueou a abertura da janela de impressao. Libere pop-ups e tente novamente.'
    };
  }

  const tituloDocumento = String(nomeArquivo || 'cotacao.pdf').replace(/\.pdf$/i, '');
  const htmlDocumento = html.replace('<title>Cotacao</title>', `<title>${tituloDocumento}</title>`);
  const blobDocumento = new Blob([htmlDocumento], { type: 'text/html;charset=utf-8' });
  const urlDocumento = window.URL.createObjectURL(blobDocumento);

  if ('opener' in janelaImpressao) {
    janelaImpressao.opener = null;
  }

  const liberarUrlDocumento = () => {
    window.setTimeout(() => {
      window.URL.revokeObjectURL(urlDocumento);
    }, 1000);
  };

  const acionarImpressao = () => {
    janelaImpressao.focus();
    janelaImpressao.print();
  };

  janelaImpressao.addEventListener('afterprint', liberarUrlDocumento, { once: true });
  janelaImpressao.addEventListener('beforeunload', liberarUrlDocumento, { once: true });
  janelaImpressao.addEventListener('load', () => window.setTimeout(acionarImpressao, 250), { once: true });
  janelaImpressao.location.replace(urlDocumento);

  return {
    sucesso: true,
    cancelado: false,
    mensagem: 'Janela de impressao aberta. Escolha Salvar como PDF no navegador.'
  };
}

export async function exportarPdfDesktop({ html, nomeArquivo }) {
  const desktop = obterDesktopApi();

  if (typeof desktop?.exportarPdf === 'function') {
    return desktop.exportarPdf({ html, nomeArquivo });
  }

  return exportarPdfNavegador({ html, nomeArquivo });
}