import { SecaoResumoRelacionamentoComModalInicio } from './inicio-secaoResumoRelacionamentoComModalInicio';
import '../../recursos/estilos/secaoOrdensCompraGrupoProdutosInicio.css';

export function SecaoOrdensCompraGrupoProdutosInicio({ itens, titulo = 'Ordens de compra do mes por grupo de produtos' }) {
  return (
    <div className="secaoOrdensCompraGrupoProdutosInicioEscopo">
      <SecaoResumoRelacionamentoComModalInicio
        titulo={titulo}
        itens={itens}
        colunasPainel={2}
        composicao="Valor liquido e quantidade de itens por grupo de produto."
        periodo="Mes corrente pela data de entrada do pedido."
        mensagemVazia="Nenhuma venda registrada no mes atual para grupos de produtos."
        modalTitulo={titulo}
        modalSubtitulo="Lista completa por grupo de produto no mes corrente."
        ariaAcao="Abrir lista completa das ordens de compra por grupo de produtos no mes"
      />
    </div>
  );
}

