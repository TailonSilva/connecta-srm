import { ModalHistoricoVendasCadastro } from '../comuns/modalHistoricoVendasCadastro';

export function ModalHistoricoVendasProduto({
  aberto,
  produto,
  carregando,
  mensagemErro,
  itensPedidos,
  filtrosAtivos,
  valorPesquisa = '',
  onAlterarPesquisa,
  onFechar,
  onAbrirFiltros,
  onConsultarPedido
}) {
  return (
    <ModalHistoricoVendasCadastro
      aberto={aberto}
      titulo="Vendas do produto"
      subtitulo={produto?.referencia ? `REF.: ${produto.referencia} - ${produto?.descricao || ''}`.trim() : produto?.descricao || 'Produto nao salvo'}
      filtrosAtivos={filtrosAtivos}
      tituloFiltro="Filtrar itens"
      ariaFiltro="Filtrar itens"
      valorPesquisa={valorPesquisa}
      onAlterarPesquisa={onAlterarPesquisa}
      placeholderPesquisa="Pesquisar em vendas..."
      onAbrirFiltros={onAbrirFiltros}
      onFechar={onFechar}
      carregando={carregando}
      mensagemErro={mensagemErro}
      itensPedidos={itensPedidos}
      exibirPedidos={false}
      contextoSalvo={Boolean(produto?.idProduto)}
      mensagemSemContextoItens="Os itens das ordens de compra ficarao disponiveis apos salvar o produto."
      mensagemVazioItens="Nenhum item de ordem de compra encontrado com os filtros informados."
      exibirClienteNosItens
      exibirAcaoItens
      onConsultarPedido={onConsultarPedido}
    />
  );
}

