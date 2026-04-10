import { SecaoResumoRelacionamentoComModalInicio } from './secaoResumoRelacionamentoComModalInicio';

export function SecaoVendasMarcaInicio({ itens, titulo = 'Vendas do mes por marca' }) {
  return (
    <SecaoResumoRelacionamentoComModalInicio
      titulo={titulo}
      itens={itens}
      colunasPainel={2}
      conceito="Quantidade de itens vendidos e valor total por marca nos pedidos com data de entrada no mes atual."
      mensagemVazia="Nenhuma venda registrada no mes atual para marcas."
      modalTitulo={titulo}
      modalSubtitulo="Lista completa por marca no mes corrente."
      ariaAcao="Abrir lista completa das vendas por marca no mes"
    />
  );
}
