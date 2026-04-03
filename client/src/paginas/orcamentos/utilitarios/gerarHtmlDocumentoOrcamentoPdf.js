import { createElement } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import estilosDocumentoOrcamentoPdf from '../../../recursos/estilos/documentoOrcamentoPdf.css?inline';
import { DocumentoOrcamentoPdf } from '../componentes/documentoOrcamentoPdf';

export function gerarHtmlDocumentoOrcamentoPdf(documento) {
  const markup = renderToStaticMarkup(
    createElement(DocumentoOrcamentoPdf, { documento })
  );

  return [
    '<!DOCTYPE html>',
    '<html lang="pt-BR">',
    '<head>',
    '<meta charset="utf-8" />',
    '<meta name="viewport" content="width=device-width, initial-scale=1" />',
    '<title>Orcamento</title>',
    `<style>${estilosDocumentoOrcamentoPdf}</style>`,
    '</head>',
    '<body>',
    markup,
    '</body>',
    '</html>'
  ].join('');
}