import '../../recursos/estilos/funilVendasGrafico.css';

function formatarMoeda(valor) {
  return Number(valor || 0).toLocaleString('pt-BR', {
    style: 'currency',
    currency: 'BRL'
  });
}

export function FunilVendasGrafico({ etapas, totalValor, idEtapaSelecionada, aoSelecionarEtapa, alturaMaxima }) {
  const espacamentoLinhas = etapas.length <= 5 ? 12 : etapas.length === 6 ? 10 : 8;
  const alturaLinha = alturaMaxima && etapas.length
    ? Math.max(26, Math.floor((alturaMaxima - ((etapas.length - 1) * espacamentoLinhas)) / etapas.length))
    : null;
  const escalaLinha = alturaLinha ? Math.min(1, Math.max(0.58, alturaLinha / 54)) : 1;

  return (
    <div
      className="funilVendasGrafico"
      role="list"
      aria-label="Etapas do funil de vendas"
      style={{
        '--funil-quantidade-etapas': etapas.length,
        '--funil-altura-maxima': alturaMaxima ? `${alturaMaxima}px` : 'auto',
        '--funil-altura-linha': alturaLinha ? `${alturaLinha}px` : null,
        '--funil-escala-linha': escalaLinha,
        '--funil-espacamento-linhas': `${espacamentoLinhas}px`
      }}
    >
      {etapas.map((etapa) => {
        const percentual = totalValor > 0
          ? Math.round((Number(etapa.valorTotal || 0) / totalValor) * 100)
          : 0;
        const ativa = idEtapaSelecionada === etapa.idEtapaOrcamento;

        return (
          <button
            key={etapa.idEtapaOrcamento}
            type="button"
            role="listitem"
            className={`funilVendasGraficoLinha ${ativa ? 'funilVendasGraficoLinhaAtiva' : ''}`}
            style={{
              '--cor-etapa-funil': etapa.cor || '#1791e2',
              '--largura-etapa-funil': `${percentual}%`
            }}
            onClick={() => aoSelecionarEtapa(etapa.idEtapaOrcamento)}
            aria-pressed={ativa}
          >
            <span className="funilVendasGraficoLinhaBarra">
              <span className="funilVendasGraficoLinhaBarraPreenchimento" />
              <span className="funilVendasGraficoLinhaRotulo">
                <strong>{etapa.descricao}</strong>
                <small>{formatarMoeda(etapa.valorTotal)}</small>
              </span>
            </span>
          </button>
        );
      })}
    </div>
  );
}