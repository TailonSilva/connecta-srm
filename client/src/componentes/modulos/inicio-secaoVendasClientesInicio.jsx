import '../../recursos/estilos/secaoVendasClientesInicio.css';
import { SecaoResumoRelacionamentoComModalInicio } from './inicio-secaoResumoRelacionamentoComModalInicio';

export function SecaoVendasClientesInicio({ itens, titulo = 'Vendas do mes por fornecedor' }) {
  return (
    <SecaoResumoRelacionamentoComModalInicio
      titulo={titulo}
      classNamePainel="secaoVendasClientesInicio"
      composicao="Valor liquido e quantidade de itens por cliente."
      periodo="Mes corrente pela data de entrada do pedido."
      itens={itens}
      colunasPainel={2}
      mensagemVazia="Nenhuma venda registrada no mes atual por cliente."
      modalTitulo={titulo}
      modalSubtitulo="Lista completa das vendas por fornecedor no mes corrente."
      ariaAcao="Abrir lista completa das vendas por fornecedor no mes"
    />
  );
}

