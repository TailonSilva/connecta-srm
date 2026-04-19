import '../../recursos/estilos/secaoAtendimentosCanalInicio.css';
import { SecaoResumoRelacionamentoComModalInicio } from './inicio-secaoResumoRelacionamentoComModalInicio';

export function SecaoAtendimentosCanalInicio({ itens, titulo = 'Atendimentos do mes por canal' }) {
  return (
    <div className="secaoAtendimentosCanalInicioEscopo">
      <SecaoResumoRelacionamentoComModalInicio
        titulo={titulo}
        itens={itens}
        composicao="Quantidade de atendimentos e de fornecedores atendidos por canal."
        periodo="Mes corrente pela data do atendimento."
        mensagemVazia="Nenhum atendimento registrado no mes atual por canal."
        modalTitulo={titulo}
        modalSubtitulo="Lista completa de atendimentos por canal no mes corrente."
        colunasPainel={2}
        obterValorTexto={(item) => `${item.quantidadeAtendimentos} atend.`}
        obterValorPercentual={(item) => item.percentualAtendimentos}
        obterQuantidadeTexto={(item) => `${item.quantidadeClientes} clientes`}
        obterQuantidadePercentual={(item) => item.percentualClientes}
        ariaAcao="Abrir lista completa de atendimentos por canal no mes"
      />
    </div>
  );
}

