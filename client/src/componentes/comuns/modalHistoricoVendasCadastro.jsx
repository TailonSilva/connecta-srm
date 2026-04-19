import { BotaoAcaoGrade } from './botaoAcaoGrade';
import { GradePadrao } from './gradePadrao';
import { ModalHistoricoGrade } from './modalHistoricoGrade';
import { TabelaHistoricoPedidos } from './tabelaHistoricoPedidos';
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
  exibirAcoesPedidos = true,
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
          <TabelaHistoricoPedidos
            carregando={carregando}
            mensagemErro={mensagemErro}
            pedidos={pedidos}
            contextoSalvo={contextoSalvo}
            mensagemSemContexto={mensagemSemContextoPedidos}
            mensagemVazia={mensagemVazioPedidos}
            exibirCliente={exibirClienteNosPedidos}
            exibirAcoes={exibirAcoesPedidos}
            onConsultarPedido={onConsultarPedido}
          />
        ) : (
          <GradePadrao
            className="gradeContatosModal gradePedidosCliente modalHistoricoVendasClienteGrade"
            classNameTabela="tabelaContatosModal tabelaItensPedidosCliente"
            classNameMensagem="mensagemTabelaContatosModal"
            cabecalho={(
              <tr>
                <th className="colunaHistoricoData">Inclusao</th>
                <th className="colunaHistoricoData">Entrega</th>
                <th className="colunaHistoricoPedido">Ordem de Compra</th>
                {exibirClienteNosItens ? <th className="colunaHistoricoCliente">Fornecedor</th> : null}
                {exibirProdutoNosItens ? <th className="colunaHistoricoReferencia">Referencia</th> : null}
                {exibirProdutoNosItens ? <th className="colunaHistoricoDescricao">Descricao</th> : null}
                <th className="colunaHistoricoValor">VALOR UN</th>
                <th className="colunaHistoricoQuantidade">QTD</th>
                <th className="colunaHistoricoValorTotal">Valor total</th>
                {exibirAcaoItens ? <th className="cabecalhoAcoesContato">Acoes</th> : null}
              </tr>
            )}
            carregando={carregando}
            mensagemErro={mensagemErro}
            temItens={contextoSalvo && itensPedidos.length > 0}
            mensagemCarregando="Carregando itens das ordens de compra..."
            mensagemVazia={contextoSalvo ? mensagemVazioItens : mensagemSemContextoItens}
          >
            {itensPedidos.map((item) => (
              <tr key={item.chave}>
                <td className="colunaHistoricoData">{formatarDataHistoricoVenda(item.dataInclusao)}</td>
                <td className="colunaHistoricoData">{formatarDataHistoricoVenda(item.dataEntrega)}</td>
                <td className="colunaHistoricoPedido">
                  <span className="codigoHistoricoPedido">{`#${String(item.idPedido).padStart(4, '0')}`}</span>
                </td>
                {exibirClienteNosItens ? <td className="colunaHistoricoCliente">{item.nomeCliente || 'Fornecedor nao informado'}</td> : null}
                {exibirProdutoNosItens ? <td className="colunaHistoricoReferencia">{item.referenciaProduto || '-'}</td> : null}
                {exibirProdutoNosItens ? <td className="colunaHistoricoDescricao">{item.descricaoProduto || 'Produto nao informado'}</td> : null}
                <td className="colunaHistoricoValor">{normalizarPreco(item.valorUnitario)}</td>
                <td className="colunaHistoricoQuantidade">{item.quantidade}</td>
                <td className="colunaHistoricoValorTotal">{normalizarPreco(item.valorTotal)}</td>
                {exibirAcaoItens ? (
                  <td>
                    <div className="acoesContatoModal">
                      <BotaoAcaoGrade icone="consultar" titulo="Consultar ordem de compra" onClick={() => onConsultarPedido?.(item.pedido)} />
                    </div>
                  </td>
                ) : null}
              </tr>
            ))}
          </GradePadrao>
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

