import { SecaoResumoRelacionamentoComModalInicio } from './secaoResumoRelacionamentoComModalInicio';

export function SecaoOrcamentosGrupoProdutosInicio({ itens, titulo = 'Orcamentos em aberto por grupo de produtos' }) {
  return (
    <SecaoResumoRelacionamentoComModalInicio
      titulo={titulo}
      conceito="Quantidade de itens e valor total por grupo de produto nos orcamentos em aberto, desconsiderando etapas obrigatorias de encerramento."
      itens={itens}
      colunasPainel={2}
      mensagemVazia="Nenhum orcamento em aberto registrado para grupos de produtos."
      modalTitulo={titulo}
      modalSubtitulo="Lista completa por grupo de produto nos orcamentos em aberto."
      ariaAcao="Abrir lista completa dos orcamentos por grupo de produtos"
    />
  );
}
