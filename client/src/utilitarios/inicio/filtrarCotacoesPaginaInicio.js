export function filtrarCotacoesPaginaInicio(cotacoes, filtros, produtos, opcoes = {}) {
  if (!Array.isArray(cotacoes) || cotacoes.length === 0) {
    return [];
  }

  const nomeInicio = opcoes?.nomeInicio || 'dataInclusaoInicio';
  const nomeFim = opcoes?.nomeFim || 'dataInclusaoFim';
  const campoData = opcoes?.campoData || 'dataInclusao';
  const exigirData = Boolean(opcoes?.exigirData);

  const produtosPorId = new Map(
    (Array.isArray(produtos) ? produtos : []).map((produto) => [String(produto.idProduto), produto])
  );

  return cotacoes.filter((cotacao) => {
    const atendeData = validarPeriodo(cotacao?.[campoData], filtros?.[nomeInicio], filtros?.[nomeFim], exigirData);
    const idsComprador = normalizarValoresFiltro(filtros?.idComprador);
    const idsProduto = normalizarValoresFiltro(filtros?.idProduto);
    const idsGrupo = normalizarValoresFiltro(filtros?.idGrupo);
    const idsMarca = normalizarValoresFiltro(filtros?.idMarca);
    const atendeComprador = idsComprador.length === 0 || idsComprador.includes(String(cotacao?.idComprador || ''));
    const itens = Array.isArray(cotacao?.itens) ? cotacao.itens : [];
    const atendeProduto = idsProduto.length === 0 || itens.some((item) => idsProduto.includes(String(item?.idProduto || '')));
    const atendeGrupo = idsGrupo.length === 0 || itens.some((item) => {
      const produto = produtosPorId.get(String(item?.idProduto || ''));
      return idsGrupo.includes(String(produto?.idGrupo || ''));
    });
    const atendeMarca = idsMarca.length === 0 || itens.some((item) => {
      const produto = produtosPorId.get(String(item?.idProduto || ''));
      return idsMarca.includes(String(produto?.idMarca || ''));
    });

    return atendeData && atendeComprador && atendeProduto && atendeGrupo && atendeMarca;
  });
}

function normalizarValoresFiltro(valores) {
  return Array.isArray(valores)
    ? valores.map((valor) => String(valor || '').trim()).filter(Boolean)
    : [];
}

function validarPeriodo(dataValor, dataInicio, dataFim, exigirData = false) {
  const dataNormalizada = normalizarData(dataValor);

  if (!dataInicio && !dataFim) {
    return exigirData ? Boolean(dataNormalizada) : true;
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