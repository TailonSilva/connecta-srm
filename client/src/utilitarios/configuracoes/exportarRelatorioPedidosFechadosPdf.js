import { exportarPdfDesktop } from '../../servicos/desktop';
import { normalizarPreco } from '../normalizarPreco';

export async function exportarRelatorioPedidosFechadosPdf({
  pedidos,
  chips,
  cards,
  usuarioLogado
}) {
  const html = gerarHtmlRelatorioPedidosFechados({
    pedidos,
    chips,
    cards,
    usuarioLogado
  });

  return exportarPdfDesktop({
    html,
    nomeArquivo: montarNomeArquivoRelatorio()
  });
}

function gerarHtmlRelatorioPedidosFechados({ pedidos, chips, cards, usuarioLogado }) {
  const geradoEm = new Intl.DateTimeFormat('pt-BR', {
    dateStyle: 'short',
    timeStyle: 'short'
  }).format(new Date());

  const resumoFiltros = Array.isArray(chips) && chips.length > 0
    ? chips.map((chip) => `<span class="relatorioPedidosFechadosPdfChip">${escapeHtml(chip.rotulo)}</span>`).join('')
    : '<span class="relatorioPedidosFechadosPdfChip">Sem filtros adicionais</span>';

  const cardsHtml = (Array.isArray(cards) ? cards : []).map((card) => `
    <article class="relatorioPedidosFechadosPdfCard">
      <span>${escapeHtml(card.titulo)}</span>
      <strong>${escapeHtml(card.valor)}</strong>
    </article>
  `).join('');

  const linhasPedidos = (Array.isArray(pedidos) ? pedidos : []).map((pedido) => `
    <tr>
      <td>${escapeHtml(formatarData(pedido.dataInclusao))}</td>
      <td>${escapeHtml(formatarData(pedido.dataEntrega))}</td>
      <td>${escapeHtml(formatarCodigoPedido(pedido.idPedido))}</td>
      <td>${escapeHtml(pedido.nomeClienteSnapshot || 'Fornecedor nao informado')}</td>
      <td>${escapeHtml(pedido.nomeEtapaPedidoSnapshot || 'Sem etapa')}</td>
      <td>${escapeHtml(pedido.nomeVendedorSnapshot || 'Nao informado')}</td>
      <td>${escapeHtml(pedido.nomePrazoPagamentoSnapshot || 'Nao informado')}</td>
      <td>${escapeHtml(formatarQuantidade(pedido.quantidadeTotalPedido))}</td>
      <td>${escapeHtml(normalizarPreco(pedido.totalPedido || 0))}</td>
    </tr>
  `).join('');

  return `<!DOCTYPE html>
  <html lang="pt-BR">
    <head>
      <meta charset="UTF-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <title>Relatorio de Vendas</title>
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
        .relatorioPedidosFechadosPdf {
          display: grid;
          gap: 20px;
        }
        .relatorioPedidosFechadosPdfHero {
          display: grid;
          grid-template-columns: minmax(0, 1fr) auto;
          gap: 18px;
          padding: 24px;
          border-radius: 24px;
          background: linear-gradient(135deg, #9A5700 0%, #EC8702 100%);
          color: #ffffff;
          -webkit-print-color-adjust: exact;
          print-color-adjust: exact;
          break-inside: avoid;
        }
        .relatorioPedidosFechadosPdfHeroPrincipal {
          display: grid;
          gap: 12px;
          min-width: 0;
        }
        .relatorioPedidosFechadosPdfHero h1 {
          margin: 0;
          font-size: 28px;
        }
        .relatorioPedidosFechadosPdfMeta {
          display: grid;
          justify-items: end;
          align-content: start;
          gap: 8px;
          min-width: 220px;
          font-size: 13px;
          text-align: right;
          opacity: 0.95;
        }
        .relatorioPedidosFechadosPdfMetaItem {
          display: grid;
          gap: 2px;
        }
        .relatorioPedidosFechadosPdfMetaItem strong {
          font-size: 11px;
          text-transform: uppercase;
          letter-spacing: 0.06em;
          opacity: 0.82;
        }
        .relatorioPedidosFechadosPdfMetaItem span {
          font-size: 14px;
          font-weight: 700;
        }
        .relatorioPedidosFechadosPdfChips {
          display: flex;
          flex-wrap: wrap;
          gap: 8px;
        }
        .relatorioPedidosFechadosPdfChip {
          display: inline-flex;
          align-items: center;
          min-height: 30px;
          padding: 6px 12px;
          border-radius: 999px;
          background: rgba(255, 255, 255, 0.16);
          font-size: 12px;
          font-weight: 600;
        }
        .relatorioPedidosFechadosPdfCards {
          display: grid;
          grid-template-columns: repeat(4, minmax(0, 1fr));
          gap: 14px;
        }
        .relatorioPedidosFechadosPdfCard {
          display: grid;
          gap: 8px;
          padding: 18px;
          border-radius: 20px;
          background: #ffffff;
          border: 1px solid rgba(15, 95, 148, 0.12);
          break-inside: avoid;
        }
        .relatorioPedidosFechadosPdfCard span {
          font-size: 12px;
          text-transform: uppercase;
          letter-spacing: 0.04em;
          color: #5f7890;
          font-weight: 700;
        }
        .relatorioPedidosFechadosPdfCard strong {
          font-size: 24px;
          color: #9A5700;
        }
        .relatorioPedidosFechadosPdfTabela {
          width: 100%;
          border-collapse: collapse;
          background: #ffffff;
          border-radius: 22px;
          overflow: hidden;
          break-inside: auto;
        }
        .relatorioPedidosFechadosPdfTabela th,
        .relatorioPedidosFechadosPdfTabela td {
          padding: 12px 14px;
          border-bottom: 1px solid rgba(15, 95, 148, 0.08);
          text-align: left;
          font-size: 12px;
          vertical-align: top;
        }
        .relatorioPedidosFechadosPdfTabela th {
          background: #eff6fb;
          color: #9A5700;
          font-size: 11px;
          text-transform: uppercase;
          letter-spacing: 0.04em;
          -webkit-print-color-adjust: exact;
          print-color-adjust: exact;
        }
        .relatorioPedidosFechadosPdfRodape {
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
      <div class="relatorioPedidosFechadosPdf">
        <header class="relatorioPedidosFechadosPdfHero">
          <div class="relatorioPedidosFechadosPdfHeroPrincipal">
            <h1>Relatorio de Vendas</h1>
            <div class="relatorioPedidosFechadosPdfChips">${resumoFiltros}</div>
          </div>
          <div class="relatorioPedidosFechadosPdfMeta">
            <div class="relatorioPedidosFechadosPdfMetaItem">
              <strong>Gerado em</strong>
              <span>${escapeHtml(geradoEm)}</span>
            </div>
            <div class="relatorioPedidosFechadosPdfMetaItem">
              <strong>Usuario</strong>
              <span>${escapeHtml(usuarioLogado?.nome || 'Nao informado')}</span>
            </div>
          </div>
        </header>

        <section class="relatorioPedidosFechadosPdfCards">${cardsHtml}</section>

        <table class="relatorioPedidosFechadosPdfTabela">
          <thead>
            <tr>
              <th>Inclusao</th>
              <th>Entrega</th>
              <th>Ordem de Compra</th>
              <th>Fornecedor</th>
              <th>Etapa</th>
              <th>Comprador</th>
              <th>Prazo</th>
              <th>Quantidade</th>
              <th>Total</th>
            </tr>
          </thead>
          <tbody>
            ${linhasPedidos}
          </tbody>
        </table>

        <footer class="relatorioPedidosFechadosPdfRodape">
          <span>Total de pedidos: ${escapeHtml(String((pedidos || []).length))}</span>
          <span>Connecta CRM</span>
        </footer>
      </div>
    </body>
  </html>`;
}

function montarNomeArquivoRelatorio() {
  const data = new Date();
  const dataFormatada = [
    data.getFullYear(),
    String(data.getMonth() + 1).padStart(2, '0'),
    String(data.getDate()).padStart(2, '0')
  ].join('-');

  return `Relatorio Ordens de Compra Fechados - ${dataFormatada}.pdf`;
}

function formatarData(valor) {
  if (!valor) {
    return 'Nao informada';
  }

  return new Intl.DateTimeFormat('pt-BR').format(new Date(`${valor}T00:00:00`));
}

function formatarCodigoPedido(idPedido) {
  return `#${String(idPedido || '').padStart(4, '0')}`;
}

function formatarQuantidade(valor) {
  return Number(valor || 0).toLocaleString('pt-BR', {
    minimumFractionDigits: 0,
    maximumFractionDigits: 2
  });
}

function escapeHtml(valor) {
  return String(valor || '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}
