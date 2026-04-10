import { SecaoResumoRelacionamentoComModalInicio } from './secaoResumoRelacionamentoComModalInicio';

export function SecaoVendasGrupoProdutosInicio({ itens, titulo = 'Vendas do mes por grupo de produtos' }) {
  return (
    <SecaoResumoRelacionamentoComModalInicio
      titulo={titulo}
      itens={itens}
      colunasPainel={2}
      conceito="Quantidade de itens vendidos e valor total por grupo de produto nos pedidos com data de entrada no mes atual."
      mensagemVazia="Nenhuma venda registrada no mes atual para grupos de produtos."
      modalTitulo={titulo}
      modalSubtitulo="Lista completa por grupo de produto no mes corrente."
      ariaAcao="Abrir lista completa das vendas por grupo de produtos no mes"
    />
  );
}
