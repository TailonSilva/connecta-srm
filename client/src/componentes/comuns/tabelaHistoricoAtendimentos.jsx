import { BotaoAcaoGrade } from './botaoAcaoGrade';
import { GradePadrao } from './gradePadrao';
import '../../recursos/estilos/modalHistoricoAtendimentosFornecedor.css';

export function TabelaHistoricoAtendimentos({
  carregando = false,
  mensagemErro = '',
  atendimentos = [],
  contextoSalvo = true,
  mensagemSemContexto = 'Os atendimentos ficarao disponiveis apos salvar o fornecedor.',
  mensagemVazia = 'Nenhum atendimento encontrado com os filtros informados.',
  exibirFornecedor = false,
  exibirAcoes = false,
  onConsultarAtendimento
}) {
  return (
    <GradePadrao
      className="gradeContatosModal gradeAtendimentosFornecedor modalHistoricoAtendimentosFornecedorGrade"
      classNameTabela="tabelaContatosModal tabelaAtendimentosFornecedor"
      classNameMensagem="mensagemTabelaContatosModal"
      cabecalho={(
        <tr>
          <th className="colunaHistoricoAtendimentoData">Data</th>
          <th className="colunaHistoricoAtendimentoHora">Inicio</th>
          <th className="colunaHistoricoAtendimentoHora">Fim</th>
          {exibirFornecedor ? <th className="colunaHistoricoAtendimentoFornecedor">Fornecedor</th> : null}
          <th className="colunaHistoricoAtendimentoAssunto">Assunto</th>
          <th className="colunaHistoricoAtendimentoContato">Contato</th>
          <th className="colunaHistoricoAtendimentoCanal">Canal</th>
          <th className="colunaHistoricoAtendimentoUsuario">Usuario</th>
          {exibirAcoes ? <th className="cabecalhoAcoesContato">Acoes</th> : null}
        </tr>
      )}
      carregando={carregando}
      mensagemErro={mensagemErro}
      temItens={contextoSalvo && atendimentos.length > 0}
      mensagemCarregando="Carregando atendimentos..."
      mensagemVazia={contextoSalvo ? mensagemVazia : mensagemSemContexto}
    >
      {atendimentos.map((atendimento) => (
        <tr key={atendimento.idAtendimento}>
          <td className="colunaHistoricoAtendimentoData">{formatarDataHistorico(atendimento.data)}</td>
          <td className="colunaHistoricoAtendimentoHora">{formatarHoraHistorico(atendimento.horaInicio)}</td>
          <td className="colunaHistoricoAtendimentoHora">{formatarHoraHistorico(atendimento.horaFim)}</td>
          {exibirFornecedor ? <td className="colunaHistoricoAtendimentoFornecedor">{atendimento.nomeFornecedor || 'Fornecedor nao informado'}</td> : null}
          <td className="colunaHistoricoAtendimentoAssunto">{atendimento.assunto || 'Sem assunto'}</td>
          <td className="colunaHistoricoAtendimentoContato">{atendimento.nomeContato || 'Contato nao informado'}</td>
          <td className="colunaHistoricoAtendimentoCanal">{atendimento.nomeCanalAtendimento || 'Nao informado'}</td>
          <td className="colunaHistoricoAtendimentoUsuario">{atendimento.nomeUsuario || 'Nao informado'}</td>
          {exibirAcoes ? (
            <td>
              <div className="acoesContatoModal">
                <BotaoAcaoGrade icone="consultar" titulo="Consultar atendimento" onClick={() => onConsultarAtendimento?.(atendimento)} />
              </div>
            </td>
          ) : null}
        </tr>
      ))}
    </GradePadrao>
  );
}

function formatarDataHistorico(data) {
  if (!data) {
    return 'Nao informada';
  }

  return new Intl.DateTimeFormat('pt-BR').format(new Date(`${data}T00:00:00`));
}

function formatarHoraHistorico(hora) {
  return hora || '--:--';
}
