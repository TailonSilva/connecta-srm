import '../../recursos/estilos/secaoAtendimentosUsuariosInicio.css';
import { SecaoResumoRelacionamentoComModalInicio } from './inicio-secaoResumoRelacionamentoComModalInicio';

export function SecaoAtendimentosUsuariosInicio({ itens, titulo = 'Atendimentos do mes por usuario' }) {
  return (
    <div className="secaoAtendimentosUsuariosInicioEscopo">
      <SecaoResumoRelacionamentoComModalInicio
        titulo={titulo}
        itens={itens}
        composicao="Quantidade de atendimentos e de fornecedores atendidos por usuario."
        periodo="Mes corrente pela data do atendimento."
        mensagemVazia="Nenhum atendimento registrado no mes atual por usuario."
        modalTitulo={titulo}
        modalSubtitulo="Lista completa de atendimentos por usuario no mes corrente."
        colunasPainel={2}
        obterValorTexto={(item) => `${item.quantidadeAtendimentos} atend.`}
        obterValorPercentual={(item) => item.percentualAtendimentos}
        obterQuantidadeTexto={(item) => `${item.quantidadeFornecedores} fornecedores`}
        obterQuantidadePercentual={(item) => item.percentualFornecedores}
        ariaAcao="Abrir lista completa de atendimentos por usuario no mes"
      />
    </div>
  );
}

