const paresAliasFornecedor = [
  ['idCliente', 'idFornecedor'],
  ['nomeCliente', 'nomeFornecedor'],
  ['nomeClienteSnapshot', 'nomeFornecedorSnapshot'],
  ['idVendedor', 'idComprador'],
  ['nomeVendedor', 'nomeComprador'],
  ['nomeVendedorSnapshot', 'nomeCompradorSnapshot'],
  ['idVendedorCliente', 'idCompradorFornecedor'],
  ['nomeVendedorCliente', 'nomeCompradorFornecedor'],
  ['idCompradorCliente', 'idCompradorFornecedor'],
  ['nomeCompradorCliente', 'nomeCompradorFornecedor'],
  ['idVendedorFornecedor', 'idCompradorFornecedor'],
  ['nomeVendedorFornecedor', 'nomeCompradorFornecedor'],
  ['escopoIdVendedor', 'escopoIdComprador'],
  ['idVendedorBloqueado', 'idCompradorBloqueado'],
  ['codigoPrincipalCliente', 'codigoPrincipalFornecedor'],
  ['colunasGridClientes', 'colunasGridFornecedores'],
  ['obrigarCliente', 'obrigarFornecedor']
];

const paresAliasCotacao = [
  ['idOrcamento', 'idCotacao'],
  ['idItemOrcamento', 'idItemCotacao'],
  ['idValorCampoOrcamento', 'idValorCampoCotacao'],
  ['idCampoOrcamento', 'idCampoCotacao'],
  ['idEtapaOrcamento', 'idEtapaCotacao'],
  ['idsEtapaOrcamento', 'idsEtapaCotacao'],
  ['codigoOrcamentoOrigem', 'codigoCotacaoOrigem'],
  ['diasValidadeOrcamento', 'diasValidadeCotacao'],
  ['etapasFiltroPadraoOrcamento', 'etapasFiltroPadraoCotacao'],
  ['colunasGridOrcamentos', 'colunasGridCotacoes'],
  ['graficosPaginaInicialOrcamentos', 'graficosPaginaInicialCotacoes'],
  ['corPrimariaOrcamento', 'corPrimariaCotacao'],
  ['corSecundariaOrcamento', 'corSecundariaCotacao'],
  ['corDestaqueOrcamento', 'corDestaqueCotacao'],
  ['destaqueItemOrcamentoPdf', 'destaqueItemCotacaoPdf'],
  ['assuntoEmailOrcamento', 'assuntoEmailCotacao'],
  ['corpoEmailOrcamento', 'corpoEmailCotacao'],
  ['assinaturaEmailOrcamento', 'assinaturaEmailCotacao']
];

const paresAliasOrdemCompra = [
  ['idPedido', 'idOrdemCompra'],
  ['idItemPedido', 'idItemOrdemCompra'],
  ['idValorCampoPedido', 'idValorCampoOrdemCompra'],
  ['idCampoPedido', 'idCampoOrdemCompra'],
  ['idEtapaPedido', 'idEtapaOrdemCompra'],
  ['idTipoPedido', 'idTipoOrdemCompra'],
  ['idsEtapaPedido', 'idsEtapaOrdemCompra'],
  ['idPedidoVinculado', 'idOrdemCompraVinculado'],
  ['nomeTipoPedidoSnapshot', 'nomeTipoOrdemCompraSnapshot'],
  ['nomeEtapaPedidoSnapshot', 'nomeEtapaOrdemCompraSnapshot'],
  ['diasEntregaPedido', 'diasEntregaOrdemCompra'],
  ['colunasGridPedidos', 'colunasGridOrdensCompra']
];

const paresAlias = [
  ...paresAliasFornecedor,
  ...paresAliasCotacao,
  ...paresAliasOrdemCompra
];

function normalizarEntradaFornecedor(valor) {
  if (!valor || typeof valor !== 'object' || Array.isArray(valor)) {
    return valor;
  }

  const normalizado = { ...valor };

  for (const [legado, atual] of paresAlias) {
    if (normalizado[atual] === undefined && normalizado[legado] !== undefined) {
      normalizado[atual] = normalizado[legado];
    }
  }

  return normalizado;
}

function normalizarSaidaFornecedor(valor) {
  if (!valor || typeof valor !== 'object' || Array.isArray(valor)) {
    return valor;
  }

  const normalizado = { ...valor };

  for (const [legado, atual] of paresAlias) {
    if (normalizado[legado] === undefined && normalizado[atual] !== undefined) {
      normalizado[legado] = normalizado[atual];
    }
  }

  return normalizado;
}

function normalizarListaSaidaFornecedor(lista) {
  return Array.isArray(lista) ? lista.map(normalizarSaidaFornecedor) : lista;
}

module.exports = {
  normalizarEntradaFornecedor,
  normalizarSaidaFornecedor,
  normalizarListaSaidaFornecedor
};
