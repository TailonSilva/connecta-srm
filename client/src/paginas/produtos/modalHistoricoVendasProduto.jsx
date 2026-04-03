import { ModalHistoricoVendasCadastro } from '../../componentes/comuns/modalHistoricoVendasCadastro';

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
      mensagemSemContextoItens="Os itens dos pedidos ficarao disponiveis apos salvar o produto."
      mensagemVazioItens="Nenhum item de pedido encontrado com os filtros informados."
      exibirClienteNosItens
      exibirAcaoItens
      onConsultarPedido={onConsultarPedido}
    />
  );
}
