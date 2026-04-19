import '../../recursos/estilos/secaoOrcamentosGrupoProdutosInicio.css';
import { SecaoResumoRelacionamentoComModalInicio } from './inicio-secaoResumoRelacionamentoComModalInicio';

export function SecaoOrcamentosGrupoProdutosInicio({ itens, titulo = 'Cotacoes em aberto por grupo de produtos' }) {
  return (
    <SecaoResumoRelacionamentoComModalInicio
      titulo={titulo}
      classNamePainel="secaoOrcamentosGrupoProdutosInicio"
      composicao="Valor total e quantidade de itens por grupo nas cotacoes em aberto."
      periodo="Posicao atual da carteira de cotacoes em aberto."
      itens={itens}
      colunasPainel={2}
      mensagemVazia="Nenhum orcamento em aberto registrado para grupos de produtos."
      modalTitulo={titulo}
      modalSubtitulo="Lista completa por grupo de produto nas cotacoes em aberto."
      ariaAcao="Abrir lista completa dos cotacoes por grupo de produtos"
    />
  );
}

