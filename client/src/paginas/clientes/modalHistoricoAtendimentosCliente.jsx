import { BotaoAcaoGrade } from '../../componentes/comuns/botaoAcaoGrade';
import { ModalHistoricoGrade } from '../../componentes/comuns/modalHistoricoGrade';
import '../../recursos/estilos/modalHistoricoAtendimentosCliente.css';

export function ModalHistoricoAtendimentosCliente({
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
      titulo="Atendimentos do cliente"
      subtitulo={cliente?.nomeFantasia || cliente?.razaoSocial || 'Cliente nao salvo'}
      className="modalHistoricoAtendimentosCliente"
      filtrosAtivos={filtrosAtivos}
      tituloFiltro="Filtrar atendimentos"
      ariaFiltro="Filtrar atendimentos"
      valorPesquisa={valorPesquisa}
      onAlterarPesquisa={onAlterarPesquisa}
      placeholderPesquisa="Pesquisar em atendimentos..."
      onAbrirFiltros={onAbrirFiltros}
      onFechar={onFechar}
    >
      <section className="painelContatosModalCliente modalHistoricoAtendimentosClientePainel">
        <div className="gradeContatosModal gradeAtendimentosCliente modalHistoricoAtendimentosClienteGrade">
          <table className="tabelaContatosModal tabelaAtendimentosCliente">
            <thead>
              <tr>
                <th className="colunaHistoricoAtendimentoData">Data</th>
                <th className="colunaHistoricoAtendimentoHora">Inicio</th>
                <th className="colunaHistoricoAtendimentoHora">Fim</th>
                <th className="colunaHistoricoAtendimentoAssunto">Assunto</th>
                <th className="colunaHistoricoAtendimentoContato">Contato</th>
                <th className="colunaHistoricoAtendimentoCanal">Canal</th>
                <th className="colunaHistoricoAtendimentoUsuario">Usuario</th>
                <th className="cabecalhoAcoesContato">Acoes</th>
              </tr>
            </thead>
            <tbody>
              {carregando ? (
                <tr>
                  <td colSpan={8} className="mensagemTabelaContatosModal">Carregando atendimentos...</td>
                </tr>
              ) : mensagemErro ? (
                <tr>
                  <td colSpan={8} className="mensagemTabelaContatosModal">{mensagemErro}</td>
                </tr>
              ) : !cliente?.idCliente ? (
                <tr>
                  <td colSpan={8} className="mensagemTabelaContatosModal">Os atendimentos ficarao disponiveis apos salvar o cliente.</td>
                </tr>
              ) : atendimentos.length > 0 ? (
                atendimentos.map((atendimento) => (
                  <tr key={atendimento.idAtendimento}>
                    <td className="colunaHistoricoAtendimentoData">{formatarDataHistoricoCliente(atendimento.data)}</td>
                    <td className="colunaHistoricoAtendimentoHora">{formatarHoraHistoricoCliente(atendimento.horaInicio)}</td>
                    <td className="colunaHistoricoAtendimentoHora">{formatarHoraHistoricoCliente(atendimento.horaFim)}</td>
                    <td className="colunaHistoricoAtendimentoAssunto">{atendimento.assunto || 'Sem assunto'}</td>
                    <td className="colunaHistoricoAtendimentoContato">{atendimento.nomeContato || 'Contato nao informado'}</td>
                    <td className="colunaHistoricoAtendimentoCanal">{atendimento.nomeCanalAtendimento || 'Nao informado'}</td>
                    <td className="colunaHistoricoAtendimentoUsuario">{atendimento.nomeUsuario || 'Nao informado'}</td>
                    <td>
                      <div className="acoesContatoModal">
                        <BotaoAcaoGrade icone="consultar" titulo="Consultar atendimento" onClick={() => onConsultarAtendimento(atendimento)} />
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={8} className="mensagemTabelaContatosModal">Nenhum atendimento encontrado com os filtros informados.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </section>
    </ModalHistoricoGrade>
  );
}

function formatarDataHistoricoCliente(data) {
  if (!data) {
    return 'Nao informada';
  }

  return new Intl.DateTimeFormat('pt-BR').format(new Date(`${data}T00:00:00`));
}

function formatarHoraHistoricoCliente(hora) {
  return hora || '--:--';
}