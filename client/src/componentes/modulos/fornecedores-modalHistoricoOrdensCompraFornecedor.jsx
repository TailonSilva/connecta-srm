import { ModalHistoricoOrdensCompraCadastro } from '../comuns/modalHistoricoOrdensCompraCadastro';

const abasOrdensCompraHistoricoFornecedor = [
  { id: 'ordensCompra', label: 'Ordens de Compra' },
  { id: 'itens', label: 'Itens da ordem de compra' }
];

export function ModalHistoricoOrdensCompraFornecedor({
  aberto,
  fornecedor,
  abaAtiva,
  onSelecionarAba,
  carregando,
  mensagemErro,
  ordensCompra,
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
      titulo="Ordens de compra do fornecedor"
      subtitulo={fornecedor?.nomeFantasia || fornecedor?.razaoSocial || 'Fornecedor nao salvo'}
      filtrosAtivos={filtrosAtivos}
      tituloFiltro="Filtrar ordens de compra"
      ariaFiltro="Filtrar ordens de compra"
      valorPesquisa={valorPesquisa}
      onAlterarPesquisa={onAlterarPesquisa}
      placeholderPesquisa="Pesquisar em ordens de compra..."
      onAbrirFiltros={onAbrirFiltros}
      onFechar={onFechar}
      abas={abasOrdensCompraHistoricoFornecedor}
      abaAtiva={abaAtiva}
      onSelecionarAba={onSelecionarAba}
      abasNoCabecalho
      carregando={carregando}
      mensagemErro={mensagemErro}
      ordensCompra={ordensCompra}
      itensOrdensCompra={itensOrdensCompra}
      exibirOrdensCompra
      contextoSalvo={Boolean(fornecedor?.idFornecedor)}
      mensagemSemContextoOrdensCompra="Os ordens de compra ficarao disponiveis apos salvar o fornecedor."
      mensagemSemContextoItens="Os itens das ordens de compra ficarao disponiveis apos salvar o fornecedor."
      mensagemVazioOrdensCompra="Nenhum ordem de compra encontrado com os filtros informados."
      mensagemVazioItens="Nenhum item de ordem de compra encontrado com os filtros informados."
      exibirProdutoNosItens
      onConsultarOrdemCompra={onConsultarOrdemCompra}
    />
  );
}

