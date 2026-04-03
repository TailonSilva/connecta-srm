import { BotaoAcaoGrade } from './botaoAcaoGrade';
import { ModalHistoricoGrade } from './modalHistoricoGrade';
import { normalizarPreco } from '../../utilitarios/normalizarPreco';
import '../../recursos/estilos/modalHistoricoVendasCliente.css';

export function ModalHistoricoVendasCadastro({
  aberto,
  titulo,
  subtitulo,
  filtrosAtivos,
  tituloFiltro,
  ariaFiltro,
  valorPesquisa = '',
  onAlterarPesquisa,
  placeholderPesquisa = 'Pesquisar em vendas...',
  onAbrirFiltros,
  onFechar,
  abas = [],
  abaAtiva = '',
  onSelecionarAba,
  abasNoCabecalho = false,
  carregando,
  mensagemErro,
  pedidos = [],
  itensPedidos = [],
  exibirPedidos = true,
  contextoSalvo = true,
  mensagemSemContextoPedidos,
  mensagemSemContextoItens,
  mensagemVazioPedidos,
  mensagemVazioItens,
  exibirClienteNosPedidos = false,
  exibirClienteNosItens = false,
  exibirProdutoNosItens = false,
  exibirAcaoItens = false,
  onConsultarPedido
}) {
  const exibirAbas = exibirPedidos && Array.isArray(abas) && abas.length > 0;
  const exibindoPedidos = exibirPedidos && (!exibirAbas || abaAtiva === 'pedidos');

  return (
    <ModalHistoricoGrade
      aberto={aberto}
      titulo={titulo}
      subtitulo={subtitulo}
      className="modalHistoricoVendasCadastro"
      filtrosAtivos={filtrosAtivos}
      tituloFiltro={tituloFiltro}
      ariaFiltro={ariaFiltro}
      valorPesquisa={valorPesquisa}
      onAlterarPesquisa={onAlterarPesquisa}
      placeholderPesquisa={placeholderPesquisa}
      onAbrirFiltros={onAbrirFiltros}
      onFechar={onFechar}
      abas={exibirAbas ? abas : []}
      abaAtiva={abaAtiva}
      onSelecionarAba={onSelecionarAba}
      abasNoCabecalho={exibirAbas && abasNoCabecalho}
    >
      <section className="painelContatosModalCliente painelPedidosCliente modalHistoricoVendasClientePainel">
        {exibindoPedidos ? (
          <div className="gradeContatosModal gradePedidosCliente modalHistoricoVendasClienteGrade">
            <table className="tabelaContatosModal tabelaPedidosCliente">
              <thead>
                <tr>
                  <th className="colunaHistoricoData">Inclusao</th>
                  <th className="colunaHistoricoData">Entrega</th>
                  <th className="colunaHistoricoPedido">Pedido</th>
                  {exibirClienteNosPedidos ? <th className="colunaHistoricoCliente">Cliente</th> : null}
                  <th className="colunaHistoricoEtapa">Etapa</th>
                  <th className="colunaHistoricoVendedor">Vendedor</th>
                  <th className="colunaHistoricoPrazoPagamento">Prazo de pagamento</th>
                  <th className="colunaHistoricoValorTotal">Total</th>
                  <th className="cabecalhoAcoesContato">Acoes</th>
                </tr>
              </thead>
              <tbody>
                {carregando ? (
                  <tr>
                    <td colSpan={obterColspanPedidos({ exibirClienteNosPedidos })} className="mensagemTabelaContatosModal">Carregando pedidos...</td>
                  </tr>
                ) : mensagemErro ? (
                  <tr>
                    <td colSpan={obterColspanPedidos({ exibirClienteNosPedidos })} className="mensagemTabelaContatosModal">{mensagemErro}</td>
                  </tr>
                ) : !contextoSalvo ? (
                  <tr>
                    <td colSpan={obterColspanPedidos({ exibirClienteNosPedidos })} className="mensagemTabelaContatosModal">{mensagemSemContextoPedidos}</td>
                  </tr>
                ) : pedidos.length > 0 ? (
                  pedidos.map((pedido) => (
                    <tr key={pedido.idPedido}>
                      <td className="colunaHistoricoData">{formatarDataHistoricoVenda(pedido.dataInclusao)}</td>
                      <td className="colunaHistoricoData">{formatarDataHistoricoVenda(pedido.dataEntrega)}</td>
                      <td className="colunaHistoricoPedido">{`#${String(pedido.idPedido).padStart(4, '0')}`}</td>
                      {exibirClienteNosPedidos ? <td className="colunaHistoricoCliente">{pedido.nomeClienteSnapshot || 'Cliente nao informado'}</td> : null}
                      <td className="colunaHistoricoEtapa">{pedido.nomeEtapaPedidoSnapshot || 'Sem etapa'}</td>
                      <td className="colunaHistoricoVendedor">{pedido.nomeVendedorSnapshot || 'Nao informado'}</td>
                      <td className="colunaHistoricoPrazoPagamento">{pedido.nomePrazoPagamentoSnapshot || 'Nao informado'}</td>
                      <td className="colunaHistoricoValorTotal">{normalizarPreco(pedido.totalPedido)}</td>
                      <td>
                        <div className="acoesContatoModal">
                          <BotaoAcaoGrade icone="consultar" titulo="Consultar pedido" onClick={() => onConsultarPedido?.(pedido)} />
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={obterColspanPedidos({ exibirClienteNosPedidos })} className="mensagemTabelaContatosModal">{mensagemVazioPedidos}</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="gradeContatosModal gradePedidosCliente modalHistoricoVendasClienteGrade">
            <table className="tabelaContatosModal tabelaItensPedidosCliente">
              <thead>
                <tr>
                  <th className="colunaHistoricoData">Inclusao</th>
                  <th className="colunaHistoricoData">Entrega</th>
                  <th className="colunaHistoricoPedido">Pedido</th>
                  {exibirClienteNosItens ? <th className="colunaHistoricoCliente">Cliente</th> : null}
                  {exibirProdutoNosItens ? <th className="colunaHistoricoReferencia">Referencia</th> : null}
                  {exibirProdutoNosItens ? <th className="colunaHistoricoDescricao">Descricao</th> : null}
                  <th className="colunaHistoricoValor">Valor</th>
                  <th className="colunaHistoricoQuantidade">Quantidade</th>
                  <th className="colunaHistoricoValorTotal">Valor total</th>
                  {exibirAcaoItens ? <th className="cabecalhoAcoesContato">Acoes</th> : null}
                </tr>
              </thead>
              <tbody>
                {carregando ? (
                  <tr>
                    <td colSpan={obterColspanItens({ exibirClienteNosItens, exibirProdutoNosItens, exibirAcaoItens })} className="mensagemTabelaContatosModal">Carregando itens dos pedidos...</td>
                  </tr>
                ) : mensagemErro ? (
                  <tr>
                    <td colSpan={obterColspanItens({ exibirClienteNosItens, exibirProdutoNosItens, exibirAcaoItens })} className="mensagemTabelaContatosModal">{mensagemErro}</td>
                  </tr>
                ) : !contextoSalvo ? (
                  <tr>
                    <td colSpan={obterColspanItens({ exibirClienteNosItens, exibirProdutoNosItens, exibirAcaoItens })} className="mensagemTabelaContatosModal">{mensagemSemContextoItens}</td>
                  </tr>
                ) : itensPedidos.length > 0 ? (
                  itensPedidos.map((item) => (
                    <tr key={item.chave}>
                      <td className="colunaHistoricoData">{formatarDataHistoricoVenda(item.dataInclusao)}</td>
                      <td className="colunaHistoricoData">{formatarDataHistoricoVenda(item.dataEntrega)}</td>
                      <td className="colunaHistoricoPedido">{`#${String(item.idPedido).padStart(4, '0')}`}</td>
                      {exibirClienteNosItens ? <td className="colunaHistoricoCliente">{item.nomeCliente || 'Cliente nao informado'}</td> : null}
                      {exibirProdutoNosItens ? <td className="colunaHistoricoReferencia">{item.referenciaProduto || '-'}</td> : null}
                      {exibirProdutoNosItens ? <td className="colunaHistoricoDescricao">{item.descricaoProduto || 'Produto nao informado'}</td> : null}
                      <td className="colunaHistoricoValor">{normalizarPreco(item.valorUnitario)}</td>
                      <td className="colunaHistoricoQuantidade">{item.quantidade}</td>
                      <td className="colunaHistoricoValorTotal">{normalizarPreco(item.valorTotal)}</td>
                      {exibirAcaoItens ? (
                        <td>
                          <div className="acoesContatoModal">
                            <BotaoAcaoGrade icone="consultar" titulo="Consultar pedido" onClick={() => onConsultarPedido?.(item.pedido)} />
                          </div>
                        </td>
                      ) : null}
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={obterColspanItens({ exibirClienteNosItens, exibirProdutoNosItens, exibirAcaoItens })} className="mensagemTabelaContatosModal">{mensagemVazioItens}</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </ModalHistoricoGrade>
  );
}

function formatarDataHistoricoVenda(data) {
  if (!data) {
    return 'Nao informada';
  }

  return new Intl.DateTimeFormat('pt-BR').format(new Date(`${data}T00:00:00`));
}

function obterColspanItens({ exibirClienteNosItens, exibirProdutoNosItens, exibirAcaoItens }) {
  return 6 + (exibirClienteNosItens ? 1 : 0) + (exibirProdutoNosItens ? 2 : 0) + (exibirAcaoItens ? 1 : 0);
}

function obterColspanPedidos({ exibirClienteNosPedidos }) {
  return 8 + (exibirClienteNosPedidos ? 1 : 0);
}
