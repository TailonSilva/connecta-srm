import { SecaoResumoRelacionamentoComModalInicio } from './secaoResumoRelacionamentoComModalInicio';

export function SecaoDevolucoesInicio({ itens, titulo = 'Devolucoes do mes' }) {
  return (
    <SecaoResumoRelacionamentoComModalInicio
      titulo={titulo}
      colunasPainel={2}
      conceito="Quantidade de devolucoes e valor total por motivo nos pedidos com data de entrada no mes atual, com valores convertidos para leitura positiva."
      itens={itens}
      mensagemVazia="Nenhuma devolucao registrada no mes atual."
      modalTitulo={titulo}
      modalSubtitulo="Lista completa de devolucoes por motivo no mes corrente."
      ariaAcao="Abrir lista completa das devolucoes do mes"
      obterChave={(item) => item.idMotivoDevolucao}
      obterQuantidadeTexto={(item) => `${item.quantidade} dev.`}
      obterQuantidadePercentual={(item) => item.percentualQuantidade}
      varianteValor="Devolucao"
    />
  );
}
