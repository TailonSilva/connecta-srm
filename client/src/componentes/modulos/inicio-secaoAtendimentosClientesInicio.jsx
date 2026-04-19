import '../../recursos/estilos/secaoAtendimentosClientesInicio.css';
import { SecaoResumoRelacionamentoComModalInicio } from './inicio-secaoResumoRelacionamentoComModalInicio';

export function SecaoAtendimentosClientesInicio({ itens, titulo = 'Atendimentos do mes por fornecedor' }) {
  return (
    <div className="secaoAtendimentosClientesInicioEscopo">
      <SecaoResumoRelacionamentoComModalInicio
        titulo={titulo}
        itens={itens}
        composicao="Quantidade de atendimentos e frequencia por cliente."
        periodo="Mes corrente pela data do atendimento."
        mensagemVazia="Nenhum atendimento registrado no mes atual por cliente."
        modalTitulo={titulo}
        modalSubtitulo="Lista completa de atendimentos por fornecedor no mes corrente."
        colunasPainel={2}
        obterValorTexto={(item) => `${item.quantidadeAtendimentos} atend.`}
        obterValorPercentual={(item) => item.percentualAtendimentos}
        obterQuantidadeTexto={(item) => `${item.quantidadeUsuarios} usuarios`}
        obterQuantidadePercentual={(item) => item.percentualUsuarios}
        ariaAcao="Abrir lista completa de atendimentos por fornecedor no mes"
      />
    </div>
  );
}

