import { SecaoResumoRelacionamentoComModalInicio } from './inicio-secaoResumoRelacionamentoComModalInicio';
import '../../recursos/estilos/secaoFunilOrcamentosInicio.css';

export function SecaoFunilOrcamentosInicio({ itens, titulo = 'Funil de cotacoes' }) {
  return (
    <div className="secaoFunilOrcamentosInicioEscopo">
      <SecaoResumoRelacionamentoComModalInicio
        titulo={titulo}
        colunasPainel={2}
        composicao="Valor total e quantidade de itens por etapa do funil."
        periodo="Posicao atual das cotacoes em aberto nas etapas consideradas."
        itens={itens}
        mensagemVazia="Nenhuma etapa marcada para considerar no funil ou nenhum orcamento em aberto nessas etapas."
        modalTitulo={titulo}
        modalSubtitulo="Lista completa das etapas consideradas no funil de orcamentos."
        ariaAcao="Abrir lista completa do funil de cotacoes"
        obterChave={(item) => item.idEtapaOrcamento}
        obterQuantidadeTexto={(item) => `${item.quantidadeItens} itens`}
        obterQuantidadePercentual={(item) => item.percentualProdutos}
        obterCorValor={(item) => item.cor || ''}
        obterCorQuantidade={(item) => item.cor || ''}
      />
    </div>
  );
}

