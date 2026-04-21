import { exportarPdfDesktop } from '../../servicos/desktop';

export async function exportarRelatorioAtendimentosPdf({
  atendimentos,
  chips,
  cards,
  usuarioLogado
}) {
  const html = gerarHtmlRelatorioAtendimentos({
    atendimentos,
    chips,
    cards,
    usuarioLogado
  });

  return exportarPdfDesktop({
    html,
    nomeArquivo: montarNomeArquivoRelatorioAtendimentos()
  });
}

function gerarHtmlRelatorioAtendimentos({ atendimentos, chips, cards, usuarioLogado }) {
  const geradoEm = new Intl.DateTimeFormat('pt-BR', {
    dateStyle: 'short',
    timeStyle: 'short'
  }).format(new Date());

  const resumoFiltros = Array.isArray(chips) && chips.length > 0
    ? chips.map((chip) => `<span class="relatorioAtendimentosPdfChip">${escapeHtml(chip.rotulo)}</span>`).join('')
    : '<span class="relatorioAtendimentosPdfChip">Sem filtros adicionais</span>';

  const cardsHtml = (Array.isArray(cards) ? cards : []).map((card) => `
    <article class="relatorioAtendimentosPdfCard">
      <span>${escapeHtml(card.titulo)}</span>
      <strong>${escapeHtml(card.valor)}</strong>
    </article>
  `).join('');

  const linhasAtendimentos = (Array.isArray(atendimentos) ? atendimentos : []).map((atendimento) => `
    <tr>
      <td>${escapeHtml(formatarData(atendimento.data))}</td>
      <td>${escapeHtml(atendimento.horaInicio || '--:--')}</td>
      <td>${escapeHtml(atendimento.horaFim || '--:--')}</td>
      <td>${escapeHtml(atendimento.nomeFornecedor || 'Fornecedor nao informado')}</td>
      <td>${escapeHtml(atendimento.assunto || 'Sem assunto')}</td>
      <td>${escapeHtml(atendimento.nomeContato || 'Contato nao informado')}</td>
      <td>${escapeHtml(atendimento.nomeCanalAtendimento || 'Nao informado')}</td>
      <td>${escapeHtml(atendimento.nomeUsuario || 'Nao informado')}</td>
    </tr>
  `).join('');

  return `<!DOCTYPE html>
  <html lang="pt-BR">
    <head>
      <meta charset="UTF-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <title>Relatorio de Atendimentos</title>
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
        .relatorioAtendimentosPdf {
          display: grid;
          gap: 20px;
        }
        .relatorioAtendimentosPdfHero {
          display: grid;
          grid-template-columns: minmax(0, 1fr) auto;
          gap: 18px;
          padding: 24px;
          border-radius: 24px;
          background: linear-gradient(135deg, #6B04B8 0%, #9506F4 100%);
          color: #ffffff;
          -webkit-print-color-adjust: exact;
          print-color-adjust: exact;
          break-inside: avoid;
        }
        .relatorioAtendimentosPdfHeroPrincipal {
          display: grid;
          gap: 12px;
          min-width: 0;
        }
        .relatorioAtendimentosPdfHero h1 {
          margin: 0;
          font-size: 28px;
        }
        .relatorioAtendimentosPdfMeta {
          display: grid;
          justify-items: end;
          align-content: start;
          gap: 8px;
          min-width: 220px;
          font-size: 13px;
          text-align: right;
          opacity: 0.95;
        }
        .relatorioAtendimentosPdfMetaItem {
          display: grid;
          gap: 2px;
        }
        .relatorioAtendimentosPdfMetaItem strong {
          font-size: 11px;
          text-transform: uppercase;
          letter-spacing: 0.06em;
          opacity: 0.82;
        }
        .relatorioAtendimentosPdfMetaItem span {
          font-size: 14px;
          font-weight: 700;
        }
        .relatorioAtendimentosPdfChips {
          display: flex;
          flex-wrap: wrap;
          gap: 8px;
        }
        .relatorioAtendimentosPdfChip {
          display: inline-flex;
          align-items: center;
          min-height: 30px;
          padding: 6px 12px;
          border-radius: 999px;
          background: rgba(255, 255, 255, 0.16);
          font-size: 12px;
          font-weight: 600;
        }
        .relatorioAtendimentosPdfCards {
          display: grid;
          grid-template-columns: repeat(4, minmax(0, 1fr));
          gap: 14px;
        }
        .relatorioAtendimentosPdfCard {
          display: grid;
          gap: 8px;
          padding: 18px;
          border-radius: 20px;
          background: #ffffff;
          border: 1px solid rgba(15, 95, 148, 0.12);
          break-inside: avoid;
        }
        .relatorioAtendimentosPdfCard span {
          font-size: 12px;
          text-transform: uppercase;
          letter-spacing: 0.04em;
          color: #5f7890;
          font-weight: 700;
        }
        .relatorioAtendimentosPdfCard strong {
          font-size: 24px;
          color: #6B04B8;
        }
        .relatorioAtendimentosPdfTabela {
          width: 100%;
          border-collapse: collapse;
          background: #ffffff;
          border-radius: 22px;
          overflow: hidden;
        }
        .relatorioAtendimentosPdfTabela th,
        .relatorioAtendimentosPdfTabela td {
          padding: 12px 14px;
          border-bottom: 1px solid rgba(15, 95, 148, 0.08);
          text-align: left;
          font-size: 12px;
          vertical-align: top;
        }
        .relatorioAtendimentosPdfTabela th {
          background: #eff6fb;
          color: #6B04B8;
          font-size: 11px;
          text-transform: uppercase;
          letter-spacing: 0.04em;
          -webkit-print-color-adjust: exact;
          print-color-adjust: exact;
        }
        .relatorioAtendimentosPdfRodape {
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
      <div class="relatorioAtendimentosPdf">
        <header class="relatorioAtendimentosPdfHero">
          <div class="relatorioAtendimentosPdfHeroPrincipal">
            <h1>Relatorio de Atendimentos</h1>
            <div class="relatorioAtendimentosPdfChips">${resumoFiltros}</div>
          </div>
          <div class="relatorioAtendimentosPdfMeta">
            <div class="relatorioAtendimentosPdfMetaItem">
              <strong>Gerado em</strong>
              <span>${escapeHtml(geradoEm)}</span>
            </div>
            <div class="relatorioAtendimentosPdfMetaItem">
              <strong>Usuario</strong>
              <span>${escapeHtml(usuarioLogado?.nome || 'Nao informado')}</span>
            </div>
          </div>
        </header>

        <section class="relatorioAtendimentosPdfCards">${cardsHtml}</section>

        <table class="relatorioAtendimentosPdfTabela">
          <thead>
            <tr>
              <th>Data</th>
              <th>Inicio</th>
              <th>Fim</th>
              <th>Fornecedor</th>
              <th>Assunto</th>
              <th>Contato</th>
              <th>Canal</th>
              <th>Usuario</th>
            </tr>
          </thead>
          <tbody>
            ${linhasAtendimentos}
          </tbody>
        </table>

        <footer class="relatorioAtendimentosPdfRodape">
          <span>Total de atendimentos: ${escapeHtml(String((atendimentos || []).length))}</span>
          <span>Connecta SRM</span>
        </footer>
      </div>
    </body>
  </html>`;
}

function montarNomeArquivoRelatorioAtendimentos() {
  const data = new Date();
  const dataFormatada = [
    data.getFullYear(),
    String(data.getMonth() + 1).padStart(2, '0'),
    String(data.getDate()).padStart(2, '0')
  ].join('-');

  return `Relatorio Atendimentos - ${dataFormatada}.pdf`;
}

function formatarData(valor) {
  if (!valor) {
    return 'Nao informada';
  }

  return new Intl.DateTimeFormat('pt-BR').format(new Date(`${valor}T00:00:00`));
}

function escapeHtml(valor) {
  return String(valor || '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}
