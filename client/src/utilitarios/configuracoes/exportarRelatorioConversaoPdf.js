import { exportarPdfDesktop } from '../../servicos/desktop';
import { normalizarPreco } from '../normalizarPreco';

export async function exportarRelatorioConversaoPdf({
  cotacoes,
  chips,
  cards,
  usuarioLogado
}) {
  const html = gerarHtmlRelatorioConversao({
    cotacoes,
    chips,
    cards,
    usuarioLogado
  });

  return exportarPdfDesktop({
    html,
    nomeArquivo: montarNomeArquivoRelatorioConversao()
  });
}

function gerarHtmlRelatorioConversao({ cotacoes, chips, cards, usuarioLogado }) {
  const geradoEm = new Intl.DateTimeFormat('pt-BR', {
    dateStyle: 'short',
    timeStyle: 'short'
  }).format(new Date());

  const resumoFiltros = Array.isArray(chips) && chips.length > 0
    ? chips.map((chip) => `<span class="relatorioConversaoPdfChip">${escapeHtml(chip.rotulo)}</span>`).join('')
    : '<span class="relatorioConversaoPdfChip">Sem filtros adicionais</span>';

  const cardsHtml = (Array.isArray(cards) ? cards : []).map((card) => `
    <article class="relatorioConversaoPdfCard">
      <span>${escapeHtml(card.titulo)}</span>
      <strong>${escapeHtml(card.valor)}</strong>
    </article>
  `).join('');

  const linhasCotacoes = (Array.isArray(cotacoes) ? cotacoes : []).map((cotacao) => `
    <tr>
      <td>${escapeHtml(formatarData(cotacao.dataInclusao, 'Nao informada'))}</td>
      <td>${escapeHtml(formatarData(cotacao.dataFechamento, ''))}</td>
      <td>${escapeHtml(formatarCodigoCotacao(cotacao.idCotacao))}</td>
      <td>${escapeHtml(cotacao.nomeFornecedor || 'Nao informado')}</td>
      <td>${escapeHtml(cotacao.nomeContato || '')}</td>
      <td>${escapeHtml(cotacao.nomeEtapaCotacao || 'Sem etapa')}</td>
      <td>${escapeHtml(cotacao.nomeComprador || 'Nao informado')}</td>
      <td>${escapeHtml(normalizarPreco(cotacao.totalCotacao || 0))}</td>
    </tr>
  `).join('');

  return `<!DOCTYPE html>
  <html lang="pt-BR">
    <head>
      <meta charset="UTF-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <title>Relatorio de Conversao</title>
      <style>
        * { box-sizing: border-box; }
        html {
          -webkit-print-color-adjust: exact;
          print-color-adjust: exact;
        }
        @page {
          size: A4 landscape;
          margin: 14mm;
        }
        body {
          margin: 0;
          padding: 32px;
          font-family: "Segoe UI", Arial, sans-serif;
          color: #163247;
          background: #f4f8fb;
          -webkit-print-color-adjust: exact;
          print-color-adjust: exact;
        }
        .relatorioConversaoPdf {
          display: grid;
          gap: 20px;
        }
        .relatorioConversaoPdfHero {
          display: grid;
          grid-template-columns: minmax(0, 1fr) auto;
          gap: 18px;
          padding: 24px;
          border-radius: 24px;
          background: linear-gradient(135deg, #6B04B8 0%, #9506F4 100%);
          color: #ffffff;
          break-inside: avoid;
        }
        .relatorioConversaoPdfHeroPrincipal {
          display: grid;
          gap: 12px;
        }
        .relatorioConversaoPdfHero h1 {
          margin: 0;
          font-size: 28px;
        }
        .relatorioConversaoPdfMeta {
          display: grid;
          justify-items: end;
          align-content: start;
          gap: 8px;
          min-width: 220px;
          font-size: 13px;
          text-align: right;
          opacity: 0.95;
        }
        .relatorioConversaoPdfMetaItem {
          display: grid;
          gap: 2px;
        }
        .relatorioConversaoPdfMetaItem strong {
          font-size: 11px;
          text-transform: uppercase;
          letter-spacing: 0.06em;
          opacity: 0.82;
        }
        .relatorioConversaoPdfMetaItem span {
          font-size: 14px;
          font-weight: 700;
        }
        .relatorioConversaoPdfChips {
          display: flex;
          flex-wrap: wrap;
          gap: 8px;
        }
        .relatorioConversaoPdfChip {
          display: inline-flex;
          align-items: center;
          min-height: 30px;
          padding: 6px 12px;
          border-radius: 999px;
          background: rgba(255, 255, 255, 0.16);
          font-size: 12px;
          font-weight: 600;
        }
        .relatorioConversaoPdfCards {
          display: grid;
          grid-template-columns: repeat(4, minmax(0, 1fr));
          gap: 14px;
        }
        .relatorioConversaoPdfCard {
          display: grid;
          gap: 8px;
          padding: 18px;
          border-radius: 20px;
          background: #ffffff;
          border: 1px solid rgba(15, 95, 148, 0.12);
          break-inside: avoid;
        }
        .relatorioConversaoPdfCard span {
          font-size: 12px;
          text-transform: uppercase;
          letter-spacing: 0.04em;
          color: #5f7890;
          font-weight: 700;
        }
        .relatorioConversaoPdfCard strong {
          font-size: 24px;
          color: #6B04B8;
        }
        .relatorioConversaoPdfTabela {
          width: 100%;
          border-collapse: collapse;
          background: #ffffff;
          border-radius: 22px;
          overflow: hidden;
        }
        .relatorioConversaoPdfTabela th,
        .relatorioConversaoPdfTabela td {
          padding: 12px 14px;
          border-bottom: 1px solid rgba(15, 95, 148, 0.08);
          text-align: left;
          font-size: 12px;
          vertical-align: top;
        }
        .relatorioConversaoPdfTabela th {
          background: #eff6fb;
          color: #6B04B8;
          font-size: 11px;
          text-transform: uppercase;
          letter-spacing: 0.04em;
        }
        .relatorioConversaoPdfRodape {
          display: flex;
          justify-content: space-between;
          gap: 16px;
          font-size: 12px;
          color: #5f7890;
        }
        @media print {
          body {
            padding: 0;
            background: #ffffff;
          }
        }
      </style>
    </head>
    <body>
      <div class="relatorioConversaoPdf">
        <header class="relatorioConversaoPdfHero">
          <div class="relatorioConversaoPdfHeroPrincipal">
            <h1>Relatorio de Conversao</h1>
            <div class="relatorioConversaoPdfChips">${resumoFiltros}</div>
          </div>
          <div class="relatorioConversaoPdfMeta">
            <div class="relatorioConversaoPdfMetaItem">
              <strong>Gerado em</strong>
              <span>${escapeHtml(geradoEm)}</span>
            </div>
            <div class="relatorioConversaoPdfMetaItem">
              <strong>Usuario</strong>
              <span>${escapeHtml(usuarioLogado?.nome || 'Nao informado')}</span>
            </div>
          </div>
        </header>
        <section class="relatorioConversaoPdfCards">${cardsHtml}</section>
        <table class="relatorioConversaoPdfTabela">
          <thead>
            <tr>
              <th>Inclusao</th>
              <th>Fechamento</th>
              <th>Codigo</th>
              <th>Fornecedor</th>
              <th>Contato</th>
              <th>Etapa</th>
              <th>Comprador</th>
              <th>Total</th>
            </tr>
          </thead>
          <tbody>
            ${linhasCotacoes}
          </tbody>
        </table>
        <footer class="relatorioConversaoPdfRodape">
          <span>Total de cotacoes: ${escapeHtml(String((cotacoes || []).length))}</span>
          <span>Connecta SRM</span>
        </footer>
      </div>
    </body>
  </html>`;
}

function montarNomeArquivoRelatorioConversao() {
  const data = new Date();
  const dataFormatada = [
    data.getFullYear(),
    String(data.getMonth() + 1).padStart(2, '0'),
    String(data.getDate()).padStart(2, '0')
  ].join('-');

  return `Relatorio Conversao - ${dataFormatada}.pdf`;
}

function formatarData(valor, fallback = '') {
  if (!valor) {
    return fallback;
  }

  return new Intl.DateTimeFormat('pt-BR').format(new Date(`${valor}T00:00:00`));
}

function formatarCodigoCotacao(idCotacao) {
  return `#${String(idCotacao || '').padStart(4, '0')}`;
}

function escapeHtml(valor) {
  return String(valor || '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}
