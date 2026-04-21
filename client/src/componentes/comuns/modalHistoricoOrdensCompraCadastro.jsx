import { BotaoAcaoGrade } from './botaoAcaoGrade';
import { GradePadrao } from './gradePadrao';
import { ModalHistoricoGrade } from './modalHistoricoGrade';
import { TabelaHistoricoOrdensCompra } from './tabelaHistoricoOrdensCompra';
import { normalizarPreco } from '../../utilitarios/normalizarPreco';
import '../../recursos/estilos/modalHistoricoOrdensCompraFornecedor.css';

export function ModalHistoricoOrdensCompraCadastro({
  aberto,
  titulo,
  subtitulo,
  filtrosAtivos,
  tituloFiltro,
  ariaFiltro,
  valorPesquisa = '',
  onAlterarPesquisa,
  placeholderPesquisa = 'Pesquisar em ordens de compra...',
  onAbrirFiltros,
  onFechar,
  abas = [],
  abaAtiva = '',
  onSelecionarAba,
  abasNoCabecalho = false,
  carregando,
  mensagemErro,
  ordensCompra = [],
  itensOrdensCompra = [],
  exibirOrdensCompra = true,
  contextoSalvo = true,
  mensagemSemContextoOrdensCompra,
  mensagemSemContextoItens,
  mensagemVazioOrdensCompra,
  mensagemVazioItens,
  exibirFornecedorNosOrdensCompra = false,
  exibirFornecedorNosItens = false,
  exibirProdutoNosItens = false,
  exibirAcoesOrdensCompra = true,
  exibirAcaoItens = false,
  onConsultarOrdemCompra
}) {
  const exibirAbas = exibirOrdensCompra && Array.isArray(abas) && abas.length > 0;
  const exibindoOrdensCompra = exibirOrdensCompra && (!exibirAbas || abaAtiva === 'ordensCompra');

  return (
    <ModalHistoricoGrade
      aberto={aberto}
      titulo={titulo}
      subtitulo={subtitulo}
      className="modalHistoricoOrdensCompraCadastro"
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
      <section className="painelContatosModalFornecedor painelOrdensCompraFornecedor modalHistoricoOrdensCompraFornecedorPainel">
        {exibindoOrdensCompra ? (
          <TabelaHistoricoOrdensCompra
            carregando={carregando}
            mensagemErro={mensagemErro}
            ordensCompra={ordensCompra}
            contextoSalvo={contextoSalvo}
            mensagemSemContexto={mensagemSemContextoOrdensCompra}
            mensagemVazia={mensagemVazioOrdensCompra}
            exibirFornecedor={exibirFornecedorNosOrdensCompra}
            exibirAcoes={exibirAcoesOrdensCompra}
            onConsultarOrdemCompra={onConsultarOrdemCompra}
          />
        ) : (
          <GradePadrao
            className="gradeContatosModal gradeOrdensCompraFornecedor modalHistoricoOrdensCompraFornecedorGrade"
            classNameTabela="tabelaContatosModal tabelaItensOrdensCompraFornecedor"
            classNameMensagem="mensagemTabelaContatosModal"
            cabecalho={(
              <tr>
                <th className="colunaHistoricoData">Inclusao</th>
                <th className="colunaHistoricoData">Entrega</th>
                <th className="colunaHistoricoOrdemCompra">Ordem de Compra</th>
                {exibirFornecedorNosItens ? <th className="colunaHistoricoFornecedor">Fornecedor</th> : null}
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
            temItens={contextoSalvo && itensOrdensCompra.length > 0}
            mensagemCarregando="Carregando itens das ordens de compra..."
            mensagemVazia={contextoSalvo ? mensagemVazioItens : mensagemSemContextoItens}
          >
            {itensOrdensCompra.map((item) => (
              <tr key={item.chave}>
                <td className="colunaHistoricoData">{formatarDataHistoricoOrdemCompra(item.dataInclusao)}</td>
                <td className="colunaHistoricoData">{formatarDataHistoricoOrdemCompra(item.dataEntrega)}</td>
                <td className="colunaHistoricoOrdemCompra">
                  <span className="codigoHistoricoOrdemCompra">{`#${String(item.idOrdemCompra).padStart(4, '0')}`}</span>
                </td>
                {exibirFornecedorNosItens ? <td className="colunaHistoricoFornecedor">{item.nomeFornecedor || 'Fornecedor nao informado'}</td> : null}
                {exibirProdutoNosItens ? <td className="colunaHistoricoReferencia">{item.referenciaProduto || '-'}</td> : null}
                {exibirProdutoNosItens ? <td className="colunaHistoricoDescricao">{item.descricaoProduto || 'Produto nao informado'}</td> : null}
                <td className="colunaHistoricoValor">{normalizarPreco(item.valorUnitario)}</td>
                <td className="colunaHistoricoQuantidade">{item.quantidade}</td>
                <td className="colunaHistoricoValorTotal">{normalizarPreco(item.valorTotal)}</td>
                {exibirAcaoItens ? (
                  <td>
                    <div className="acoesContatoModal">
                      <BotaoAcaoGrade icone="consultar" titulo="Consultar ordem de compra" onClick={() => onConsultarOrdemCompra?.(item.ordemCompra)} />
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

function formatarDataHistoricoOrdemCompra(data) {
  if (!data) {
    return 'Nao informada';
  }

  return new Intl.DateTimeFormat('pt-BR').format(new Date(`${data}T00:00:00`));
}

