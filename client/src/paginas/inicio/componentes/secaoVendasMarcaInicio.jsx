import { SecaoGraficosDuplosInicio } from './secaoGraficosDuplosInicio';

export function SecaoVendasMarcaInicio({ itens }) {
  return (
    <SecaoGraficosDuplosInicio
      titulo="Vendas do mes por marca"
      subtitulo=""
      colunasPainel={1}
      modoExibicao="lista"
      ajudaSecao={{
        conceito: 'Quantidade de itens vendidos e valor total por marca nos pedidos com data de entrada no mes atual.'
      }}
      itens={itens}
      mensagemVazia="Nenhuma venda registrada no mes atual para marcas."
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
