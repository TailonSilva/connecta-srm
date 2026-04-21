import { ModalHistoricoOrdensCompraCadastro } from '../comuns/modalHistoricoOrdensCompraCadastro';

export function ModalHistoricoOrdensCompraProduto({
  aberto,
  produto,
  carregando,
  mensagemErro,
  itensOrdensCompra,
  filtrosAtivos,
  valorPesquisa = '',
  onAlterarPesquisa,
  onFechar,
  onAbrirFiltros,
  onConsultarOrdemCompra
}) {
  return (
    <ModalHistoricoOrdensCompraCadastro
      aberto={aberto}
      titulo="Ordens de compra do produto"
      subtitulo={produto?.referencia ? `REF.: ${produto.referencia} - ${produto?.descricao || ''}`.trim() : produto?.descricao || 'Produto nao salvo'}
      filtrosAtivos={filtrosAtivos}
      tituloFiltro="Filtrar itens"
      ariaFiltro="Filtrar itens"
      valorPesquisa={valorPesquisa}
      onAlterarPesquisa={onAlterarPesquisa}
      placeholderPesquisa="Pesquisar em ordens de compra..."
      onAbrirFiltros={onAbrirFiltros}
      onFechar={onFechar}
      carregando={carregando}
      mensagemErro={mensagemErro}
      itensOrdensCompra={itensOrdensCompra}
      exibirOrdensCompra={false}
      contextoSalvo={Boolean(produto?.idProduto)}
      mensagemSemContextoItens="Os itens das ordens de compra ficarao disponiveis apos salvar o produto."
      mensagemVazioItens="Nenhum item de ordem de compra encontrado com os filtros informados."
      exibirFornecedorNosItens
      exibirAcaoItens
      onConsultarOrdemCompra={onConsultarOrdemCompra}
    />
  );
}

