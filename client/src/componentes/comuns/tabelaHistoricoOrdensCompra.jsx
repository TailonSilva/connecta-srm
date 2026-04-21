import { BotaoAcaoGrade } from './botaoAcaoGrade';
import { GradePadrao } from './gradePadrao';
import { normalizarPreco } from '../../utilitarios/normalizarPreco';
import '../../recursos/estilos/modalHistoricoOrdensCompraFornecedor.css';

export function TabelaHistoricoOrdensCompra({
  carregando,
  mensagemErro,
  ordensCompra = [],
  contextoSalvo = true,
  mensagemSemContexto = 'Nenhum contexto disponivel.',
  mensagemVazia = 'Nenhum ordem de compra encontrado.',
  exibirFornecedor = false,
  exibirTipoOrdemCompra = false,
  exibirAcoes = true,
  onConsultarOrdemCompra
}) {
  return (
    <GradePadrao
      className="gradeContatosModal gradeOrdensCompraFornecedor modalHistoricoOrdensCompraFornecedorGrade"
      classNameTabela="tabelaContatosModal tabelaOrdensCompraFornecedor"
      classNameMensagem="mensagemTabelaContatosModal"
      cabecalho={(
        <tr>
          <th className="colunaHistoricoData">Inclusao</th>
          <th className="colunaHistoricoData">Entrega</th>
          <th className="colunaHistoricoOrdemCompra">Ordem de Compra</th>
          {exibirFornecedor ? <th className="colunaHistoricoFornecedor">Fornecedor</th> : null}
          <th className="colunaHistoricoEtapa">Etapa</th>
          {exibirTipoOrdemCompra ? <th className="colunaHistoricoEtapa">Tipo</th> : null}
          <th className="colunaHistoricoComprador">Comprador</th>
          <th className="colunaHistoricoPrazoPagamento">Prazo de pagamento</th>
          <th className="colunaHistoricoValorTotal">Total</th>
          {exibirAcoes ? <th className="cabecalhoAcoesContato">Acoes</th> : null}
        </tr>
      )}
      carregando={carregando}
      mensagemErro={mensagemErro}
      temItens={contextoSalvo && ordensCompra.length > 0}
      mensagemCarregando="Carregando ordens de compra..."
      mensagemVazia={contextoSalvo ? mensagemVazia : mensagemSemContexto}
    >
      {ordensCompra.map((ordemCompra) => (
        <tr key={ordemCompra.idOrdemCompra}>
          <td className="colunaHistoricoData">{formatarDataHistoricoOrdemCompra(ordemCompra.dataInclusao)}</td>
          <td className="colunaHistoricoData">{formatarDataHistoricoOrdemCompra(ordemCompra.dataEntrega)}</td>
          <td className="colunaHistoricoOrdemCompra">
            <span className="codigoHistoricoOrdemCompra">{`#${String(ordemCompra.idOrdemCompra).padStart(4, '0')}`}</span>
          </td>
          {exibirFornecedor ? <td className="colunaHistoricoFornecedor">{ordemCompra.nomeFornecedorSnapshot || 'Fornecedor nao informado'}</td> : null}
          <td className="colunaHistoricoEtapa">{ordemCompra.nomeEtapaOrdemCompraSnapshot || 'Sem etapa'}</td>
          {exibirTipoOrdemCompra ? <td className="colunaHistoricoEtapa">{ordemCompra.nomeTipoOrdemCompraSnapshot || 'Nao informado'}</td> : null}
          <td className="colunaHistoricoComprador">{ordemCompra.nomeCompradorSnapshot || 'Nao informado'}</td>
          <td className="colunaHistoricoPrazoPagamento">{ordemCompra.nomePrazoPagamentoSnapshot || 'Nao informado'}</td>
          <td className="colunaHistoricoValorTotal">{normalizarPreco(ordemCompra.totalOrdemCompra)}</td>
          {exibirAcoes ? (
            <td>
              <div className="acoesContatoModal">
                <BotaoAcaoGrade icone="consultar" titulo="Consultar ordem de compra" onClick={() => onConsultarOrdemCompra?.(ordemCompra)} />
              </div>
            </td>
          ) : null}
        </tr>
      ))}
    </GradePadrao>
  );
}

function formatarDataHistoricoOrdemCompra(data) {
  if (!data) {
    return 'Nao informada';
  }

  return new Intl.DateTimeFormat('pt-BR').format(new Date(`${data}T00:00:00`));
}

