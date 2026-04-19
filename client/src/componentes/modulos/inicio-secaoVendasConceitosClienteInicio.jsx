import { SecaoResumoRelacionamentoComModalInicio } from './inicio-secaoResumoRelacionamentoComModalInicio';
import '../../recursos/estilos/secaoVendasConceitosClienteInicio.css';

// Este wrapper separa a sessao por conceito para manter a home modular e permitir ajustes isolados no futuro.
export function SecaoVendasConceitosClienteInicio({
  itens,
  titulo = 'Vendas do mes por conceito de fornecedor'
}) {
  return (
    <div className="secaoVendasConceitosClienteInicioEscopo">
      <SecaoResumoRelacionamentoComModalInicio
        titulo={titulo}
        itens={itens}
        colunasPainel={2}
        composicao="Valor liquido e quantidade de itens por conceito de cliente."
        periodo="Mes corrente pela data de entrada do pedido."
        mensagemVazia="Nenhuma venda registrada no mes atual para conceitos de cliente."
        modalTitulo={titulo}
        modalSubtitulo="Lista completa por conceito de fornecedor no mes corrente."
        ariaAcao="Abrir lista completa das vendas por conceito de fornecedor no mes"
      />
    </div>
  );
}
