import { GradePadrao } from './gradePadrao';
import { normalizarPreco } from '../../utilitarios/normalizarPreco';

export function TabelaHistoricoOrcamentos({
  carregando = false,
  mensagemErro = '',
  orcamentos = [],
  contextoSalvo = true,
  mensagemSemContexto = 'Os orcamentos ficarao disponiveis apos carregar os registros.',
  mensagemVazia = 'Nenhum orcamento encontrado para o periodo informado.'
}) {
  return (
    <GradePadrao
      className="gradeContatosModal modalHistoricoOrcamentosGrade"
      classNameTabela="tabelaContatosModal tabelaHistoricoCotacoes"
      classNameMensagem="mensagemTabelaContatosModal"
      cabecalho={(
        <tr>
          <th className="colunaHistoricoOrcamentoData">Inclusao</th>
          <th className="colunaHistoricoOrcamentoData">Fechamento</th>
          <th className="colunaHistoricoOrcamentoCodigo">Codigo</th>
          <th className="colunaHistoricoOrcamentoCliente">Fornecedor</th>
          <th className="colunaHistoricoOrcamentoContato">Contato</th>
          <th className="colunaHistoricoOrcamentoEtapa">Etapa</th>
          <th className="colunaHistoricoOrcamentoVendedor">Comprador</th>
          <th className="colunaHistoricoOrcamentoTotal">Total</th>
        </tr>
      )}
      carregando={carregando}
      mensagemErro={mensagemErro}
      temItens={contextoSalvo && orcamentos.length > 0}
      mensagemCarregando="Carreganda cotacaos..."
      mensagemVazia={contextoSalvo ? mensagemVazia : mensagemSemContexto}
    >
      {orcamentos.map((orcamento) => (
        <tr key={orcamento.idOrcamento}>
          <td className="colunaHistoricoOrcamentoData">{formatarDataTabela(orcamento.dataInclusao, 'Nao informada')}</td>
          <td className="colunaHistoricoOrcamentoData">{formatarDataTabela(orcamento.dataFechamento, '')}</td>
          <td className="colunaHistoricoOrcamentoCodigo">{`#${String(orcamento.idOrcamento).padStart(4, '0')}`}</td>
          <td className="colunaHistoricoOrcamentoCliente">{orcamento.nomeCliente || 'Nao informado'}</td>
          <td className="colunaHistoricoOrcamentoContato">{orcamento.nomeContato || ''}</td>
          <td className="colunaHistoricoOrcamentoEtapa">{orcamento.nomeEtapaOrcamento || 'Sem etapa'}</td>
          <td className="colunaHistoricoOrcamentoVendedor">{orcamento.nomeVendedor || 'Nao informado'}</td>
          <td className="colunaHistoricoOrcamentoTotal">{normalizarPreco(orcamento.totalOrcamento || 0)}</td>
        </tr>
      ))}
    </GradePadrao>
  );
}

function formatarDataTabela(valor, fallback = '') {
  if (!valor) {
    return fallback;
  }

  return new Intl.DateTimeFormat('pt-BR').format(new Date(`${valor}T00:00:00`));
}
