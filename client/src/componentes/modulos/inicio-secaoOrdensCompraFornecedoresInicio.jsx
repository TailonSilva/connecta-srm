import '../../recursos/estilos/secaoOrdensCompraFornecedoresInicio.css';
import { SecaoResumoRelacionamentoComModalInicio } from './inicio-secaoResumoRelacionamentoComModalInicio';

export function SecaoOrdensCompraFornecedoresInicio({ itens, titulo = 'Ordens de compra do mes por fornecedor' }) {
  return (
    <SecaoResumoRelacionamentoComModalInicio
      titulo={titulo}
      classNamePainel="secaoOrdensCompraFornecedoresInicio"
      composicao="Valor liquido e quantidade de itens por fornecedor."
      periodo="Mes corrente pela data de entrada do ordemCompra."
      itens={itens}
      colunasPainel={2}
      mensagemVazia="Nenhuma ordemCompra registrada no mes atual por fornecedor."
      modalTitulo={titulo}
      modalSubtitulo="Lista completa das ordens de compra por fornecedor no mes corrente."
      ariaAcao="Abrir lista completa das ordens de compra por fornecedor no mes"
    />
  );
}

