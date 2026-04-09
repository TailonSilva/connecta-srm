import { SecaoGraficosDuplosInicio } from './secaoGraficosDuplosInicio';

export function SecaoDevolucoesInicio({ itens }) {
  return (
    <SecaoGraficosDuplosInicio
      titulo="Devolucoes do mes"
      subtitulo=""
      colunasPainel={1}
      modoExibicao="lista"
      ajudaSecao={{
        conceito: 'Quantidade de devolucoes e valor total por motivo nos pedidos com data de entrada no mes atual, com valores convertidos para leitura positiva.'
      }}
      itens={itens}
      mensagemVazia="Nenhuma devolucao registrada no mes atual."
      tituloValor="Valor"
      tituloQuantidade="Quantidade"
      obterChave={(item) => item.idMotivoDevolucao}
      obterRotulo={(item) => item.descricao}
      obterValorTexto={(item) => item.valor}
      obterValorPercentual={(item) => item.percentualValor}
      obterQuantidadeTexto={(item) => `${item.quantidade} dev.`}
      obterQuantidadePercentual={(item) => item.percentualQuantidade}
      varianteValor="Devolucao"
      obterAjuda={(item) => item.ajuda}
    />
  );
}
