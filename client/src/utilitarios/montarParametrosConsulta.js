export function montarParametrosConsulta(parametros = {}) {
  const searchParams = new URLSearchParams();
  const parametrosNormalizados = normalizarAliasesConsulta(parametros);

  Object.entries(parametrosNormalizados).forEach(([chave, valor]) => {
    if (Array.isArray(valor)) {
      valor
        .map((item) => String(item ?? '').trim())
        .filter(Boolean)
        .forEach((item) => searchParams.append(chave, item));
      return;
    }

    const texto = String(valor ?? '').trim();

    if (texto) {
      searchParams.set(chave, texto);
    }
  });

  const query = searchParams.toString();
  return query ? `?${query}` : '';
}

function normalizarAliasesConsulta(parametros = {}) {
  const normalizado = { ...parametros };
  const aliases = [
    ['idFornecedor', 'idFornecedor'],
    ['idComprador', 'idComprador'],
    ['idCompradorFornecedor', 'idCompradorFornecedor'],
    ['idCompradorFornecedor', 'idCompradorFornecedor'],
    ['idEtapaCotacao', 'idEtapaCotacao'],
    ['idsEtapaCotacao', 'idsEtapaCotacao'],
    ['idCotacao', 'idCotacao'],
    ['idOrdemCompra', 'idOrdemCompra'],
    ['idEtapaOrdemCompra', 'idEtapaOrdemCompra'],
    ['idsEtapaOrdemCompra', 'idsEtapaOrdemCompra']
  ];

  for (const [legado, atual] of aliases) {
    if (normalizado[atual] === undefined && normalizado[legado] !== undefined) {
      normalizado[atual] = normalizado[legado];
    }

    if (legado !== atual) {
      delete normalizado[legado];
    }
  }

  return normalizado;
}
