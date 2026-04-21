import '../../recursos/estilos/funilCotacoesGrafico.css';

function formatarMoeda(valor) {
  return Number(valor || 0).toLocaleString('pt-BR', {
    style: 'currency',
    currency: 'BRL'
  });
}

export function FunilCotacoesGrafico({ etapas, totalValor, idEtapaSelecionada, aoSelecionarEtapa, alturaMaxima }) {
  const espacamentoLinhas = etapas.length <= 5 ? 12 : etapas.length === 6 ? 10 : 8;
  const alturaLinha = alturaMaxima && etapas.length
    ? Math.max(26, Math.floor((alturaMaxima - ((etapas.length - 1) * espacamentoLinhas)) / etapas.length))
    : null;
  const escalaLinha = alturaLinha ? Math.min(1, Math.max(0.58, alturaLinha / 54)) : 1;

  return (
    <div
      className="funilCotacoesGrafico"
      role="list"
      aria-label="Etapas do funil de ordensCompra"
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
        const ativa = idEtapaSelecionada === etapa.idEtapaCotacao;

        return (
          <button
            key={etapa.idEtapaCotacao}
            type="button"
            role="listitem"
            className={`funilCotacoesGraficoLinha ${ativa ? 'funilCotacoesGraficoLinhaAtiva' : ''}`}
            style={{
              '--cor-etapa-funil': etapa.cor || '#9506F4',
              '--largura-etapa-funil': `${percentual}%`
            }}
            onClick={() => aoSelecionarEtapa(etapa.idEtapaCotacao)}
            aria-pressed={ativa}
          >
            <span className="funilCotacoesGraficoLinhaBarra">
              <span className="funilCotacoesGraficoLinhaBarraPreenchimento" />
              <span className="funilCotacoesGraficoLinhaRotulo">
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