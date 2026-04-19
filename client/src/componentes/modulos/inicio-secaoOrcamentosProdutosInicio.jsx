import '../../recursos/estilos/secaoOrcamentosProdutosInicio.css';
import { SecaoResumoRelacionamentoComModalInicio } from './inicio-secaoResumoRelacionamentoComModalInicio';

export function SecaoOrcamentosProdutosInicio({ itens, titulo = 'Cotacoes em aberto por produto' }) {
  return (
    <SecaoResumoRelacionamentoComModalInicio
      titulo={titulo}
      classNamePainel="secaoOrcamentosProdutosInicio"
      composicao="Valor total e quantidade de itens por produto nas cotacoes em aberto."
      periodo="Posicao atual da carteira de cotacoes em aberto."
      itens={itens}
      colunasPainel={2}
      mensagemVazia="Nenhum orcamento em aberto registrado para produtos."
      modalTitulo={titulo}
      modalSubtitulo="Lista completa por produto nas cotacoes em aberto."
      ariaAcao="Abrir lista completa dos cotacoes por produto"
    />
  );
}

