import '../../recursos/estilos/secaoOrdensCompraUfInicio.css';
import { SecaoResumoRelacionamentoComModalInicio } from './inicio-secaoResumoRelacionamentoComModalInicio';

export function SecaoOrdensCompraUfInicio({ itens, titulo = 'Ordens de compra do mes por UF' }) {
  return (
    <SecaoResumoRelacionamentoComModalInicio
      titulo={titulo}
      classNamePainel="secaoOrdensCompraUfInicio"
      composicao="Valor liquido e quantidade de itens por UF."
      periodo="Mes corrente pela data de entrada do ordemCompra."
      itens={itens}
      colunasPainel={2}
      mensagemVazia="Nenhuma ordemCompra registrada no mes atual por UF."
      modalTitulo={titulo}
      modalSubtitulo="Lista completa das ordens de compra por UF no mes corrente."
      ariaAcao="Abrir lista completa das ordens de compra por UF no mes"
    />
  );
}

