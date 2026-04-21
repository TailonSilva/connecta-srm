import { SecaoResumoRelacionamentoComModalInicio } from './inicio-secaoResumoRelacionamentoComModalInicio';
import '../../recursos/estilos/secaoCotacoesMarcaInicio.css';

export function SecaoCotacoesMarcaInicio({ itens, titulo = 'Cotacoes em aberto por marca' }) {
  return (
    <div className="secaoCotacoesMarcaInicioEscopo">
      <SecaoResumoRelacionamentoComModalInicio
        titulo={titulo}
        composicao="Valor total e quantidade de itens por marca nas cotacoes em aberto."
        periodo="Posicao atual da carteira de cotacoes em aberto."
        itens={itens}
        colunasPainel={2}
        mensagemVazia="Nenhum cotacao em aberto registrado para marcas."
        modalTitulo={titulo}
        modalSubtitulo="Lista completa por marca nas cotacoes em aberto."
        ariaAcao="Abrir lista completa dos cotacoes por marca"
      />
    </div>
  );
}

