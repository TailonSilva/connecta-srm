import { SecaoResumoRelacionamentoComModalInicio } from './secaoResumoRelacionamentoComModalInicio';

export function SecaoOrcamentosMarcaInicio({ itens, titulo = 'Orcamentos em aberto por marca' }) {
  return (
    <SecaoResumoRelacionamentoComModalInicio
      titulo={titulo}
      conceito="Quantidade de itens e valor total por marca nos orcamentos em aberto, desconsiderando etapas obrigatorias de encerramento."
      itens={itens}
      colunasPainel={2}
      mensagemVazia="Nenhum orcamento em aberto registrado para marcas."
      modalTitulo={titulo}
      modalSubtitulo="Lista completa por marca nos orcamentos em aberto."
      ariaAcao="Abrir lista completa dos orcamentos por marca"
    />
  );
}
