import { createElement } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import estilosDocumentoCotacaoPdf from '../../recursos/estilos/documentoOrcamentoPdf.css?inline';
import { DocumentoCotacaoPdf } from '../../componentes/cotacoes/documentoCotacaoPdf';

export function gerarHtmlDocumentoCotacaoPdf(documento) {
  const markup = renderToStaticMarkup(
    createElement(DocumentoCotacaoPdf, { documento })
  );

  return [
    '<!DOCTYPE html>',
    '<html lang="pt-BR">',
    '<head>',
    '<meta charset="utf-8" />',
    '<meta name="viewport" content="width=device-width, initial-scale=1" />',
    '<title>Orcamento</title>',
    `<style>${estilosDocumentoCotacaoPdf}</style>`,
    '</head>',
    '<body>',
    markup,
    '</body>',
    '</html>'
  ].join('');
}
