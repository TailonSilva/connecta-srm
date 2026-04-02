export function filtrarPedidosPaginaInicio(pedidos, filtros, produtos) {
  if (!Array.isArray(pedidos) || pedidos.length === 0) {
    return [];
  }

  const produtosPorId = new Map(
    (Array.isArray(produtos) ? produtos : []).map((produto) => [String(produto.idProduto), produto])
  );

  return pedidos.filter((pedido) => {
    const atendeData = validarPeriodo(pedido?.dataInclusao, filtros?.dataInicio, filtros?.dataFim);
    const idsVendedor = normalizarValoresFiltro(filtros?.idVendedor);
    const idsProduto = normalizarValoresFiltro(filtros?.idProduto);
    const idsGrupo = normalizarValoresFiltro(filtros?.idGrupo);
    const idsMarca = normalizarValoresFiltro(filtros?.idMarca);
    const atendeVendedor = idsVendedor.length === 0 || idsVendedor.includes(String(pedido?.idVendedor || ''));
    const itens = Array.isArray(pedido?.itens) ? pedido.itens : [];
    const atendeProduto = idsProduto.length === 0 || itens.some((item) => idsProduto.includes(String(item?.idProduto || '')));
    const atendeGrupo = idsGrupo.length === 0 || itens.some((item) => {
      const produto = produtosPorId.get(String(item?.idProduto || ''));
      return idsGrupo.includes(String(produto?.idGrupo || ''));
    });
    const atendeMarca = idsMarca.length === 0 || itens.some((item) => {
      const produto = produtosPorId.get(String(item?.idProduto || ''));
      return idsMarca.includes(String(produto?.idMarca || ''));
    });

    return atendeData && atendeVendedor && atendeProduto && atendeGrupo && atendeMarca;
  });
}

function normalizarValoresFiltro(valores) {
  return Array.isArray(valores)
    ? valores.map((valor) => String(valor || '').trim()).filter(Boolean)
    : [];
}

function validarPeriodo(dataValor, dataInicio, dataFim) {
  const dataNormalizada = normalizarData(dataValor);

  if (!dataInicio && !dataFim) {
    return true;
  }

  if (!dataNormalizada) {
    return false;
  }

  if (dataInicio && dataNormalizada < dataInicio) {
    return false;
  }

  if (dataFim && dataNormalizada > dataFim) {
    return false;
  }

  return true;
}

function normalizarData(dataValor) {
  const dataTexto = String(dataValor || '').trim();

  if (!dataTexto) {
    return '';
  }

  const correspondencia = dataTexto.match(/^(\d{4}-\d{2}-\d{2})/);
  return correspondencia ? correspondencia[1] : '';
}