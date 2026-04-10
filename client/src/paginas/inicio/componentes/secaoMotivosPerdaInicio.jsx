import { SecaoResumoRelacionamentoComModalInicio } from './secaoResumoRelacionamentoComModalInicio';

export function SecaoMotivosPerdaInicio({ itens, titulo = 'Motivos de perda do mes' }) {
  return (
    <SecaoResumoRelacionamentoComModalInicio
      titulo={titulo}
      colunasPainel={2}
      conceito="Quantidade e valor total dos orcamentos recusados no mes atual, agrupados por motivo de perda."
      itens={itens}
      mensagemVazia="Nenhum orcamento recusado no mes atual com motivo de perda."
      modalTitulo={titulo}
      modalSubtitulo="Lista completa de motivos de perda dos orcamentos recusados no mes corrente."
      ariaAcao="Abrir lista completa dos motivos de perda do mes"
      obterChave={(item) => item.id}
      obterQuantidadeTexto={(item) => `${item.quantidadeOrcamentos} orc.`}
      obterQuantidadePercentual={(item) => item.percentualQuantidade}
    />
  );
}
