import '../../recursos/estilos/secaoAtendimentosOrigemInicio.css';
import { SecaoResumoRelacionamentoComModalInicio } from './inicio-secaoResumoRelacionamentoComModalInicio';

export function SecaoAtendimentosOrigemInicio({ itens, titulo = 'Atendimentos do mes por origem' }) {
  return (
    <div className="secaoAtendimentosOrigemInicioEscopo">
      <SecaoResumoRelacionamentoComModalInicio
        titulo={titulo}
        itens={itens}
        composicao="Quantidade de atendimentos e de fornecedores atendidos por origem."
        periodo="Mes corrente pela data do atendimento."
        mensagemVazia="Nenhum atendimento registrado no mes atual por origem."
        modalTitulo={titulo}
        modalSubtitulo="Lista completa de atendimentos por origem no mes corrente."
        colunasPainel={2}
        obterValorTexto={(item) => `${item.quantidadeAtendimentos} atend.`}
        obterValorPercentual={(item) => item.percentualAtendimentos}
        obterQuantidadeTexto={(item) => `${item.quantidadeClientes} clientes`}
        obterQuantidadePercentual={(item) => item.percentualClientes}
        ariaAcao="Abrir lista completa de atendimentos por origem no mes"
      />
    </div>
  );
}

