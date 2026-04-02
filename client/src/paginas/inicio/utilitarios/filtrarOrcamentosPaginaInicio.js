export function filtrarOrcamentosPaginaInicio(orcamentos, filtros, produtos) {
  if (!Array.isArray(orcamentos) || orcamentos.length === 0) {
    return [];
  }

  const produtosPorId = new Map(
    (Array.isArray(produtos) ? produtos : []).map((produto) => [String(produto.idProduto), produto])
  );

  return orcamentos.filter((orcamento) => {
    const atendeData = validarPeriodo(orcamento?.dataInclusao, filtros?.dataInicio, filtros?.dataFim);
    const atendeVendedor = !filtros?.idVendedor || String(orcamento?.idVendedor || '') === String(filtros.idVendedor);
    const itens = Array.isArray(orcamento?.itens) ? orcamento.itens : [];
    const atendeProduto = !filtros?.idProduto || itens.some((item) => String(item?.idProduto || '') === String(filtros.idProduto));
    const atendeGrupo = !filtros?.idGrupo || itens.some((item) => {
      const produto = produtosPorId.get(String(item?.idProduto || ''));
      return String(produto?.idGrupo || '') === String(filtros.idGrupo);
    });

    return atendeData && atendeVendedor && atendeProduto && atendeGrupo;
  });
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