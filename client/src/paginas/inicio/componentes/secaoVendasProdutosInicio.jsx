import { SecaoResumoRelacionamentoComModalInicio } from './secaoResumoRelacionamentoComModalInicio';

export function SecaoVendasProdutosInicio({ itens, titulo = 'Vendas do mes por produto' }) {
  return (
    <SecaoResumoRelacionamentoComModalInicio
      titulo={titulo}
      conceito="Quantidade de itens vendidos e valor total por produto nos pedidos com data de entrada no mes atual."
      itens={itens}
      colunasPainel={2}
      mensagemVazia="Nenhuma venda registrada no mes atual para produtos."
      modalTitulo={titulo}
      modalSubtitulo="Lista completa de produtos vendidos no mes corrente."
      ariaAcao="Abrir lista completa de produtos vendidos no mes"
    />
  );
}
