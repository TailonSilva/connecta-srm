import { ModalHistoricoVendasCadastro } from '../comuns/modalHistoricoVendasCadastro';

const abasVendasHistoricoCliente = [
  { id: 'pedidos', label: 'Ordens de Compra' },
  { id: 'itens', label: 'Itens da ordem de compra' }
];

export function ModalHistoricoVendasCliente({
  aberto,
  cliente,
  abaAtiva,
  onSelecionarAba,
  carregando,
  mensagemErro,
  pedidos,
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
      titulo="Vendas do fornecedor"
      subtitulo={cliente?.nomeFantasia || cliente?.razaoSocial || 'Fornecedor nao salvo'}
      filtrosAtivos={filtrosAtivos}
      tituloFiltro="Filtrar ordens de compra"
      ariaFiltro="Filtrar ordens de compra"
      valorPesquisa={valorPesquisa}
      onAlterarPesquisa={onAlterarPesquisa}
      placeholderPesquisa="Pesquisar em vendas..."
      onAbrirFiltros={onAbrirFiltros}
      onFechar={onFechar}
      abas={abasVendasHistoricoCliente}
      abaAtiva={abaAtiva}
      onSelecionarAba={onSelecionarAba}
      abasNoCabecalho
      carregando={carregando}
      mensagemErro={mensagemErro}
      pedidos={pedidos}
      itensPedidos={itensPedidos}
      exibirPedidos
      contextoSalvo={Boolean(cliente?.idCliente)}
      mensagemSemContextoPedidos="Os ordens de compra ficarao disponiveis apos salvar o cliente."
      mensagemSemContextoItens="Os itens das ordens de compra ficarao disponiveis apos salvar o cliente."
      mensagemVazioPedidos="Nenhum ordem de compra encontrado com os filtros informados."
      mensagemVazioItens="Nenhum item de ordem de compra encontrado com os filtros informados."
      exibirProdutoNosItens
      onConsultarPedido={onConsultarPedido}
    />
  );
}

