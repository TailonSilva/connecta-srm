import { BotaoAcaoGrade } from './botaoAcaoGrade';
import { GradePadrao } from './gradePadrao';
import { normalizarPreco } from '../../utilitarios/normalizarPreco';
import '../../recursos/estilos/modalHistoricoVendasCliente.css';

export function TabelaHistoricoPedidos({
  carregando,
  mensagemErro,
  pedidos = [],
  contextoSalvo = true,
  mensagemSemContexto = 'Nenhum contexto disponivel.',
  mensagemVazia = 'Nenhum pedido encontrado.',
  exibirCliente = false,
  exibirTipoPedido = false,
  exibirAcoes = true,
  onConsultarPedido
}) {
  return (
    <GradePadrao
      className="gradeContatosModal gradePedidosCliente modalHistoricoVendasClienteGrade"
      classNameTabela="tabelaContatosModal tabelaPedidosCliente"
      classNameMensagem="mensagemTabelaContatosModal"
      cabecalho={(
        <tr>
          <th className="colunaHistoricoData">Inclusao</th>
          <th className="colunaHistoricoData">Entrega</th>
          <th className="colunaHistoricoPedido">Pedido</th>
          {exibirCliente ? <th className="colunaHistoricoCliente">Cliente</th> : null}
          <th className="colunaHistoricoEtapa">Etapa</th>
          {exibirTipoPedido ? <th className="colunaHistoricoEtapa">Tipo</th> : null}
          <th className="colunaHistoricoVendedor">Vendedor</th>
          <th className="colunaHistoricoPrazoPagamento">Prazo de pagamento</th>
          <th className="colunaHistoricoValorTotal">Total</th>
          {exibirAcoes ? <th className="cabecalhoAcoesContato">Acoes</th> : null}
        </tr>
      )}
      carregando={carregando}
      mensagemErro={mensagemErro}
      temItens={contextoSalvo && pedidos.length > 0}
      mensagemCarregando="Carregando pedidos..."
      mensagemVazia={contextoSalvo ? mensagemVazia : mensagemSemContexto}
    >
      {pedidos.map((pedido) => (
        <tr key={pedido.idPedido}>
          <td className="colunaHistoricoData">{formatarDataHistoricoVenda(pedido.dataInclusao)}</td>
          <td className="colunaHistoricoData">{formatarDataHistoricoVenda(pedido.dataEntrega)}</td>
          <td className="colunaHistoricoPedido">
            <span className="codigoHistoricoPedido">{`#${String(pedido.idPedido).padStart(4, '0')}`}</span>
          </td>
          {exibirCliente ? <td className="colunaHistoricoCliente">{pedido.nomeClienteSnapshot || 'Cliente nao informado'}</td> : null}
          <td className="colunaHistoricoEtapa">{pedido.nomeEtapaPedidoSnapshot || 'Sem etapa'}</td>
          {exibirTipoPedido ? <td className="colunaHistoricoEtapa">{pedido.nomeTipoPedidoSnapshot || 'Nao informado'}</td> : null}
          <td className="colunaHistoricoVendedor">{pedido.nomeVendedorSnapshot || 'Nao informado'}</td>
          <td className="colunaHistoricoPrazoPagamento">{pedido.nomePrazoPagamentoSnapshot || 'Nao informado'}</td>
          <td className="colunaHistoricoValorTotal">{normalizarPreco(pedido.totalPedido)}</td>
          {exibirAcoes ? (
            <td>
              <div className="acoesContatoModal">
                <BotaoAcaoGrade icone="consultar" titulo="Consultar pedido" onClick={() => onConsultarPedido?.(pedido)} />
              </div>
            </td>
          ) : null}
        </tr>
      ))}
    </GradePadrao>
  );
}

function formatarDataHistoricoVenda(data) {
  if (!data) {
    return 'Nao informada';
  }

  return new Intl.DateTimeFormat('pt-BR').format(new Date(`${data}T00:00:00`));
}

