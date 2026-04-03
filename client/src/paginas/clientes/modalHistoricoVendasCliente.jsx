import { ModalHistoricoVendasCadastro } from '../../componentes/comuns/modalHistoricoVendasCadastro';

const abasVendasHistoricoCliente = [
  { id: 'pedidos', label: 'Pedidos' },
  { id: 'itens', label: 'Itens do pedido' }
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
      titulo="Vendas do cliente"
      subtitulo={cliente?.nomeFantasia || cliente?.razaoSocial || 'Cliente nao salvo'}
      filtrosAtivos={filtrosAtivos}
      tituloFiltro="Filtrar pedidos"
      ariaFiltro="Filtrar pedidos"
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
      mensagemSemContextoPedidos="Os pedidos ficarao disponiveis apos salvar o cliente."
      mensagemSemContextoItens="Os itens dos pedidos ficarao disponiveis apos salvar o cliente."
      mensagemVazioPedidos="Nenhum pedido encontrado com os filtros informados."
      mensagemVazioItens="Nenhum item de pedido encontrado com os filtros informados."
      exibirProdutoNosItens
      onConsultarPedido={onConsultarPedido}
    />
  );
}
