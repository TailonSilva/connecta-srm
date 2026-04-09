import { SecaoGraficosDuplosInicio } from './secaoGraficosDuplosInicio';

export function SecaoVendasGrupoProdutosInicio({ itens }) {
  return (
    <SecaoGraficosDuplosInicio
      titulo="Vendas do mes por grupo de produtos"
      subtitulo=""
      colunasPainel={1}
      modoExibicao="lista"
      ajudaSecao={{
        conceito: 'Quantidade de itens vendidos e valor total por grupo de produto nos pedidos com data de entrada no mes atual.'
      }}
      itens={itens}
      mensagemVazia="Nenhuma venda registrada no mes atual para grupos de produtos."
      tituloValor="Valor"
      tituloQuantidade="Quantidade"
      obterChave={(item) => item.id}
      obterRotulo={(item) => item.descricao}
      obterValorTexto={(item) => item.valor}
      obterValorPercentual={(item) => item.percentualValor}
      obterQuantidadeTexto={(item) => `${item.quantidadeItens} itens`}
      obterQuantidadePercentual={(item) => item.percentualQuantidade}
      obterAjuda={(item) => item.ajuda}
    />
  );
}
