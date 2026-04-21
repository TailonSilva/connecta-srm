import { ModalHistoricoGrade } from '../comuns/modalHistoricoGrade';
import { TabelaHistoricoAtendimentos } from '../comuns/tabelaHistoricoAtendimentos';
import '../../recursos/estilos/modalHistoricoAtendimentosCliente.css';

export function ModalHistoricoAtendimentosFornecedor({
  aberto,
  cliente,
  carregando,
  mensagemErro,
  atendimentos,
  filtrosAtivos,
  valorPesquisa = '',
  onAlterarPesquisa,
  onFechar,
  onAbrirFiltros,
  onConsultarAtendimento
}) {
  return (
    <ModalHistoricoGrade
      aberto={aberto}
      titulo="Atendimentos do fornecedor"
      subtitulo={cliente?.nomeFantasia || cliente?.razaoSocial || 'Fornecedor nao salvo'}
      className="ModalHistoricoAtendimentosFornecedor"
      filtrosAtivos={filtrosAtivos}
      tituloFiltro="Filtrar atendimentos"
      ariaFiltro="Filtrar atendimentos"
      valorPesquisa={valorPesquisa}
      onAlterarPesquisa={onAlterarPesquisa}
      placeholderPesquisa="Pesquisar em atendimentos..."
      onAbrirFiltros={onAbrirFiltros}
      onFechar={onFechar}
    >
      <section className="painelContatosModalCliente ModalHistoricoAtendimentosFornecedorPainel">
        <TabelaHistoricoAtendimentos
          carregando={carregando}
          mensagemErro={mensagemErro}
          atendimentos={atendimentos}
          contextoSalvo={Boolean(cliente?.idCliente)}
          mensagemSemContexto="Os atendimentos ficarao disponiveis apos salvar o cliente."
          mensagemVazia="Nenhum atendimento encontrado com os filtros informados."
          exibirAcoes
          onConsultarAtendimento={onConsultarAtendimento}
        />
      </section>
    </ModalHistoricoGrade>
  );
}

