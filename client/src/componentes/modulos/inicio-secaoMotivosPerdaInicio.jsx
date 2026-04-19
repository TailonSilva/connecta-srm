import { SecaoResumoRelacionamentoComModalInicio } from './inicio-secaoResumoRelacionamentoComModalInicio';
import '../../recursos/estilos/secaoMotivosPerdaInicio.css';

export function SecaoMotivosPerdaInicio({ itens, titulo = 'Motivos de perda do mes' }) {
  return (
    <div className="secaoMotivosPerdaInicioEscopo">
      <SecaoResumoRelacionamentoComModalInicio
        titulo={titulo}
        colunasPainel={2}
        composicao="Quantidade e valor total das cotacoes recusados por motivo."
        periodo="Mes corrente pelos orcamentos recusados no periodo."
        itens={itens}
        varianteValor="Devolucao"
        mensagemVazia="Nenhum orcamento recusado no mes atual com motivo de perda."
        modalTitulo={titulo}
        modalSubtitulo="Lista completa de motivos de perda das cotacoes recusados no mes corrente."
        ariaAcao="Abrir lista completa dos motivos de perda do mes"
        obterChave={(item) => item.id}
        obterQuantidadeTexto={(item) => `${item.quantidadeOrcamentos} orc.`}
        obterQuantidadePercentual={(item) => item.percentualQuantidade}
      />
    </div>
  );
}

