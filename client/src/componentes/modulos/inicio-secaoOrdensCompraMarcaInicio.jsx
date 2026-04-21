import { SecaoResumoRelacionamentoComModalInicio } from './inicio-secaoResumoRelacionamentoComModalInicio';
import '../../recursos/estilos/secaoOrdensCompraMarcaInicio.css';

export function SecaoOrdensCompraMarcaInicio({ itens, titulo = 'Ordens de compra do mes por marca' }) {
  return (
    <div className="secaoOrdensCompraMarcaInicioEscopo">
      <SecaoResumoRelacionamentoComModalInicio
        titulo={titulo}
        itens={itens}
        colunasPainel={2}
        composicao="Valor liquido e quantidade de itens por marca."
        periodo="Mes corrente pela data de entrada do pedido."
        mensagemVazia="Nenhuma venda registrada no mes atual para marcas."
        modalTitulo={titulo}
        modalSubtitulo="Lista completa por marca no mes corrente."
        ariaAcao="Abrir lista completa das ordens de compra por marca no mes"
      />
    </div>
  );
}

