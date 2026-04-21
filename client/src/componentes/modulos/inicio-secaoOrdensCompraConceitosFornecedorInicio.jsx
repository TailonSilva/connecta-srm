import { SecaoResumoRelacionamentoComModalInicio } from './inicio-secaoResumoRelacionamentoComModalInicio';
import '../../recursos/estilos/secaoOrdensCompraConceitosFornecedorInicio.css';

// Este wrapper separa a sessao por conceito para manter a home modular e permitir ajustes isolados no futuro.
export function SecaoOrdensCompraConceitosFornecedorInicio({
  itens,
  titulo = 'Ordens de compra do mes por conceito de fornecedor'
}) {
  return (
    <div className="secaoOrdensCompraConceitosFornecedorInicioEscopo">
      <SecaoResumoRelacionamentoComModalInicio
        titulo={titulo}
        itens={itens}
        colunasPainel={2}
        composicao="Valor liquido e quantidade de itens por conceito de fornecedor."
        periodo="Mes corrente pela data de entrada do ordemCompra."
        mensagemVazia="Nenhuma ordemCompra registrada no mes atual para conceitos de fornecedor."
        modalTitulo={titulo}
        modalSubtitulo="Lista completa por conceito de fornecedor no mes corrente."
        ariaAcao="Abrir lista completa das ordens de compra por conceito de fornecedor no mes"
      />
    </div>
  );
}
