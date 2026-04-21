export const TOTAL_COLUNAS_GRID_ORDENS_COMPRA = 100;
const BASE_LEGADA_COLUNAS_GRID_ORDENS_COMPRA = 24;
const MAX_SPAN_COLUNA_OCULTA = 19;
const mapaRotulosLegadosColunasGridOrdensCompra = new Map([
  ['Codigo Interno da Ordem de Compra', 'Codigo Interno'],
  ['Fornecedor Vinculado ao Ordem de Compra', 'Codigo do Fornecedor'],
  ['Contato Vinculado ao Ordem de Compra', 'Codigo do Contato'],
  ['Usuario do Registro', 'Codigo do Usuario'],
  ['Comprador Vinculado', 'Codigo do Comprador'],
  ['Etapa Vinculada ao Ordem de Compra', 'Codigo da Etapa'],
  ['Prazo Vinculado ao Ordem de Compra', 'Codigo do Prazo'],
  ['Codigo do Cotacao Vinculado', 'Codigo do Cotacao de Origem'],
  ['Cotacao Vinculado', 'Codigo do Cotacao de Origem']
]);

export const colunasGridOrdensCompra = [
  {
    id: 'codigo',
    rotulo: 'Codigo',
    classe: 'colunaGradeCodigo',
    obrigatoria: false,
    ordemPadrao: 1,
    spanPadrao: 1,
    visivelPadrao: true
  },
  {
    id: 'idOrdemCompra',
    rotulo: 'Codigo Interno',
    classe: 'colunaGradeCodigo',
    obrigatoria: false,
    ordemPadrao: 2,
    spanPadrao: 1,
    visivelPadrao: false
  },
  {
    id: 'idCotacao',
    rotulo: 'Cotacao de Origem',
    classe: 'colunaGradeCodigo',
    obrigatoria: false,
    ordemPadrao: 3,
    spanPadrao: 1,
    visivelPadrao: false
  },
  {
    id: 'codigoCotacaoOrigem',
    rotulo: 'Codigo do Cotacao de Origem',
    classe: 'colunaGradeCodigo',
    obrigatoria: false,
    ordemPadrao: 4,
    spanPadrao: 1,
    visivelPadrao: false
  },
  {
    id: 'fornecedor',
    rotulo: 'Fornecedor',
    classe: 'colunaGradeTexto',
    obrigatoria: false,
    ordemPadrao: 5,
    spanPadrao: 5,
    visivelPadrao: true
  },
  {
    id: 'idFornecedor',
    rotulo: 'Codigo do Fornecedor',
    classe: 'colunaGradeTexto',
    obrigatoria: false,
    ordemPadrao: 6,
    spanPadrao: 4,
    visivelPadrao: false
  },
  {
    id: 'idConceito',
    rotulo: 'Conceito',
    classe: 'colunaGradeTexto',
    obrigatoria: false,
    ordemPadrao: 7,
    spanPadrao: 3,
    visivelPadrao: false
  },
  {
    id: 'contato',
    rotulo: 'Contato',
    classe: 'colunaGradeTexto',
    obrigatoria: false,
    ordemPadrao: 8,
    spanPadrao: 4,
    visivelPadrao: true
  },
  {
    id: 'idContato',
    rotulo: 'Codigo do Contato',
    classe: 'colunaGradeTexto',
    obrigatoria: false,
    ordemPadrao: 9,
    spanPadrao: 4,
    visivelPadrao: false
  },
  {
    id: 'usuario',
    rotulo: 'Usuario',
    classe: 'colunaGradeTexto',
    obrigatoria: false,
    ordemPadrao: 10,
    spanPadrao: 3,
    visivelPadrao: false
  },
  {
    id: 'idUsuario',
    rotulo: 'Codigo do Usuario',
    classe: 'colunaGradeTexto',
    obrigatoria: false,
    ordemPadrao: 11,
    spanPadrao: 3,
    visivelPadrao: false
  },
  {
    id: 'comprador',
    rotulo: 'Comprador',
    classe: 'colunaGradeTexto',
    obrigatoria: false,
    ordemPadrao: 12,
    spanPadrao: 4,
    visivelPadrao: true
  },
  {
    id: 'idComprador',
    rotulo: 'Codigo do Comprador',
    classe: 'colunaGradeTexto',
    obrigatoria: false,
    ordemPadrao: 13,
    spanPadrao: 4,
    visivelPadrao: false
  },
  {
    id: 'etapa',
    rotulo: 'Etapa',
    classe: 'colunaGradeSelecao',
    obrigatoria: false,
    ordemPadrao: 14,
    spanPadrao: 4,
    visivelPadrao: true
  },
  {
    id: 'idEtapaOrdemCompra',
    rotulo: 'Codigo da Etapa',
    classe: 'colunaGradeTexto',
    obrigatoria: false,
    ordemPadrao: 15,
    spanPadrao: 4,
    visivelPadrao: false
  },
  {
    id: 'prazoPagamento',
    rotulo: 'Prazo de Pagamento',
    classe: 'colunaGradeTexto',
    obrigatoria: false,
    ordemPadrao: 17,
    spanPadrao: 4,
    visivelPadrao: false
  },
  {
    id: 'idPrazoPagamento',
    rotulo: 'Codigo do Prazo',
    classe: 'colunaGradeTexto',
    obrigatoria: false,
    ordemPadrao: 18,
    spanPadrao: 4,
    visivelPadrao: false
  },
  {
    id: 'metodoPagamento',
    rotulo: 'Metodo de Pagamento',
    classe: 'colunaGradeTexto',
    obrigatoria: false,
    ordemPadrao: 19,
    spanPadrao: 3,
    visivelPadrao: false
  },
  {
    id: 'dataInclusao',
    rotulo: 'Data de Inclusao',
    classe: 'colunaGradeTexto',
    obrigatoria: false,
    ordemPadrao: 20,
    spanPadrao: 2,
    visivelPadrao: false
  },
  {
    id: 'dataEntrega',
    rotulo: 'Data de Entrega',
    classe: 'colunaGradeTexto',
    obrigatoria: false,
    ordemPadrao: 21,
    spanPadrao: 2,
    visivelPadrao: false
  },
  {
    id: 'dataValidade',
    rotulo: 'Data de Validade',
    classe: 'colunaGradeTexto',
    obrigatoria: false,
    ordemPadrao: 22,
    spanPadrao: 2,
    visivelPadrao: false
  },
  {
    id: 'observacao',
    rotulo: 'Observacao',
    classe: 'colunaGradeTexto',
    obrigatoria: false,
    ordemPadrao: 23,
    spanPadrao: 5,
    visivelPadrao: false
  },
  {
    id: 'total',
    rotulo: 'Total',
    classe: 'colunaGradeValor',
    obrigatoria: false,
    ordemPadrao: 24,
    spanPadrao: 3,
    visivelPadrao: true
  },
  {
    id: 'acoes',
    rotulo: 'Acoes',
    classe: 'colunaGradeAcoes',
    obrigatoria: true,
    ordemPadrao: 25,
    spanPadrao: 2,
    visivelPadrao: true
  }
];

const idsPermitidos = new Set(colunasGridOrdensCompra.map((coluna) => coluna.id));
const mapaColunasGridOrdensCompra = new Map(
  colunasGridOrdensCompra.map((coluna) => [coluna.id, coluna])
);

export function normalizarConfiguracoesColunasGridOrdensCompra(valor) {
  const listaNormalizada = normalizarListaConfiguracoes(valor);
  const configuracoesPorId = new Map();

  listaNormalizada.forEach((item, indice) => {
    const id = String(item?.id || '').trim();

    if (!idsPermitidos.has(id)) {
      return;
    }

    const colunaBase = mapaColunasGridOrdensCompra.get(id);
    const spanPadraoColuna = normalizarSpanDefinicaoColuna(colunaBase?.spanPadrao || 1);
    const spanFixoColuna = normalizarSpanDefinicaoColuna(colunaBase?.spanFixo);
    const baseConfiguracao = normalizarBaseConfiguracao(item.base);
    const visivel = item.visivel === undefined ? true : Boolean(item.visivel);
    const ordem = normalizarNumeroInteiro(item.ordem, indice + 1);
    const span = normalizarSpanColuna(item.span, spanPadraoColuna, spanFixoColuna, baseConfiguracao);
    const configuracaoExistente = configuracoesPorId.get(id);

    configuracoesPorId.set(id, {
      id,
      base: item.base === undefined ? (configuracaoExistente?.base ?? baseConfiguracao) : baseConfiguracao,
      visivel: item.visivel === undefined ? (configuracaoExistente?.visivel ?? visivel) : visivel,
      ordem: item.ordem === undefined ? (configuracaoExistente?.ordem ?? ordem) : ordem,
      span: item.span === undefined ? (configuracaoExistente?.span ?? span) : span,
      rotulo: item.rotulo === undefined
        ? (configuracaoExistente?.rotulo ?? colunaBase?.rotulo)
        : normalizarRotuloColuna(item.rotulo, colunaBase?.rotulo)
    });
  });

  const configuracoesNormalizadas = colunasGridOrdensCompra.map((coluna, indice) => {
    const configuracao = configuracoesPorId.get(coluna.id);
    const spanPadraoColuna = normalizarSpanDefinicaoColuna(coluna.spanPadrao || 1);
    const spanFixoColuna = normalizarSpanDefinicaoColuna(coluna.spanFixo);

    return {
      ...coluna,
      base: TOTAL_COLUNAS_GRID_ORDENS_COMPRA,
      rotuloPadrao: coluna.rotulo,
      rotulo: normalizarRotuloColuna(configuracao?.rotulo, coluna.rotulo),
      spanPadrao: spanPadraoColuna,
      spanFixo: spanFixoColuna,
      visivel: coluna.obrigatoria ? true : (configuracao?.visivel ?? coluna.visivelPadrao),
      ordem: coluna.obrigatoria || (configuracao?.visivel ?? coluna.visivelPadrao)
        ? normalizarNumeroInteiro(configuracao?.ordem, coluna.ordemPadrao || (indice + 1))
        : null,
      span: normalizarSpanColuna(
        configuracao?.span,
        spanPadraoColuna,
        spanFixoColuna,
        normalizarBaseConfiguracao(configuracao?.base, TOTAL_COLUNAS_GRID_ORDENS_COMPRA)
      )
    };
  }).map((coluna) => ({
    ...coluna,
    span: ajustarSpanColunaOculta(coluna.span, coluna.visivel || coluna.obrigatoria, coluna.spanPadrao)
  }));

  return reordenarConfiguracoesColunasGridOrdensCompra(configuracoesNormalizadas);
}

export function normalizarColunasGridOrdensCompra(valor) {
  return normalizarConfiguracoesColunasGridOrdensCompra(valor)
    .filter((coluna) => coluna.visivel)
    .sort(ordenarColunasGridOrdensCompra);
}

export function reordenarConfiguracoesColunasGridOrdensCompra(configuracoes) {
  const lista = Array.isArray(configuracoes) ? configuracoes.map((coluna) => ({ ...coluna })) : [];
  const visiveis = lista
    .filter((coluna) => coluna.visivel || coluna.obrigatoria)
    .sort(ordenarColunasGridOrdensCompra)
    .map((coluna) => ({
      ...coluna,
      visivel: coluna.obrigatoria ? true : Boolean(coluna.visivel)
    }));
  const colunasFixasNoFim = visiveis.filter((coluna) => coluna.id === 'acoes');
  const colunasReordenaveis = visiveis.filter((coluna) => coluna.id !== 'acoes');
  const visiveisReordenadas = [...colunasReordenaveis, ...colunasFixasNoFim].map((coluna, indice) => ({
    ...coluna,
    ordem: indice + 1
  }));
  const invisiveis = lista
    .filter((coluna) => !coluna.visivel && !coluna.obrigatoria)
    .sort((colunaA, colunaB) => (colunaA.ordemPadrao || 0) - (colunaB.ordemPadrao || 0))
    .map((coluna) => ({
      ...coluna,
      ordem: null
    }));

  return [...visiveisReordenadas, ...invisiveis];
}

export function reposicionarConfiguracaoColunaGridOrdensCompra(configuracoes, idColuna, ordemDesejada) {
  const lista = Array.isArray(configuracoes) ? configuracoes.map((coluna) => ({ ...coluna })) : [];
  const visiveisOrdenadas = lista
    .filter((coluna) => coluna.visivel || coluna.obrigatoria)
    .sort(ordenarColunasGridOrdensCompra);
  const colunasFixasNoFim = visiveisOrdenadas.filter((coluna) => coluna.id === 'acoes');
  const colunasReordenaveis = visiveisOrdenadas.filter((coluna) => coluna.id !== 'acoes');
  const invisiveis = lista
    .filter((coluna) => !coluna.visivel && !coluna.obrigatoria)
    .sort((colunaA, colunaB) => (colunaA.ordemPadrao || 0) - (colunaB.ordemPadrao || 0))
    .map((coluna) => ({
      ...coluna,
      ordem: null
    }));
  if (idColuna === 'acoes') {
    return reordenarConfiguracoesColunasGridOrdensCompra(lista);
  }

  const indiceAtual = colunasReordenaveis.findIndex((coluna) => coluna.id === idColuna);

  if (indiceAtual === -1) {
    return reordenarConfiguracoesColunasGridOrdensCompra(lista);
  }

  const [colunaReposicionada] = colunasReordenaveis.splice(indiceAtual, 1);
  const ordemNormalizada = normalizarNumeroInteiro(ordemDesejada, colunaReposicionada.ordem || 1);
  const indiceDestino = Math.max(0, Math.min(colunasReordenaveis.length, ordemNormalizada - 1));

  colunasReordenaveis.splice(indiceDestino, 0, colunaReposicionada);

  const visiveisReordenadas = [...colunasReordenaveis, ...colunasFixasNoFim].map((coluna, indice) => ({
    ...coluna,
    visivel: coluna.obrigatoria ? true : Boolean(coluna.visivel),
    ordem: indice + 1
  }));

  return [...visiveisReordenadas, ...invisiveis];
}

function normalizarListaConfiguracoes(valor) {
  if (Array.isArray(valor)) {
    return normalizarItensConfiguracao(valor);
  }

  if (!valor) {
    return [];
  }

  try {
    const lista = JSON.parse(valor);
    return Array.isArray(lista) ? normalizarItensConfiguracao(lista) : [];
  } catch (_erro) {
    return String(valor)
      .split(',')
      .map((item) => String(item || '').trim())
      .filter(Boolean)
      .map((id) => ({ id }));
  }
}

function normalizarItensConfiguracao(lista) {
  return lista
    .map((item) => {
      if (typeof item === 'string' || typeof item === 'number') {
        return { id: String(item).trim() };
      }

      if (!item || typeof item !== 'object') {
        return null;
      }

      return {
        id: String(item.id || '').trim(),
        base: item.base,
        rotulo: item.rotulo,
        visivel: item.visivel,
        ordem: item.ordem,
        span: item.span
      };
    })
    .filter(Boolean);
}

function ordenarColunasGridOrdensCompra(colunaA, colunaB) {
  if (colunaA.id === 'acoes' && colunaB.id !== 'acoes') {
    return 1;
  }

  if (colunaB.id === 'acoes' && colunaA.id !== 'acoes') {
    return -1;
  }

  if (colunaA.ordem !== colunaB.ordem) {
    return colunaA.ordem - colunaB.ordem;
  }

  return (colunaA.ordemPadrao || 0) - (colunaB.ordemPadrao || 0);
}

function normalizarNumeroInteiro(valor, valorPadrao = 1) {
  const numero = Number.parseInt(String(valor ?? '').trim(), 10);
  return Number.isFinite(numero) && numero > 0 ? numero : valorPadrao;
}

function normalizarSpanColuna(valor, valorPadrao = 1, valorFixo = null, baseConfiguracao = TOTAL_COLUNAS_GRID_ORDENS_COMPRA) {
  if (Number.isFinite(Number(valorFixo)) && Number(valorFixo) > 0) {
    return Math.min(TOTAL_COLUNAS_GRID_ORDENS_COMPRA, Math.max(1, Number(valorFixo)));
  }

  const numero = normalizarNumeroInteiro(valor, valorPadrao);
  return converterSpanParaBaseAtual(numero, baseConfiguracao);
}

function normalizarRotuloColuna(valor, valorPadrao = '') {
  const texto = String(valor ?? '').trim();
  const textoNormalizado = mapaRotulosLegadosColunasGridOrdensCompra.get(texto) || texto;
  return textoNormalizado || String(valorPadrao || '').trim();
}

function normalizarBaseConfiguracao(valor, valorPadrao = BASE_LEGADA_COLUNAS_GRID_ORDENS_COMPRA) {
  const numero = Number.parseInt(String(valor ?? '').trim(), 10);
  return Number.isFinite(numero) && numero > 0 ? numero : valorPadrao;
}

function normalizarSpanDefinicaoColuna(valor) {
  if (!Number.isFinite(Number(valor)) || Number(valor) <= 0) {
    return null;
  }

  return converterSpanParaBaseAtual(Number(valor), BASE_LEGADA_COLUNAS_GRID_ORDENS_COMPRA);
}

function converterSpanParaBaseAtual(valor, baseOrigem = TOTAL_COLUNAS_GRID_ORDENS_COMPRA) {
  const numero = normalizarNumeroInteiro(valor, 1);

  if (baseOrigem === TOTAL_COLUNAS_GRID_ORDENS_COMPRA) {
    return Math.min(TOTAL_COLUNAS_GRID_ORDENS_COMPRA, Math.max(1, numero));
  }

  return Math.min(
    TOTAL_COLUNAS_GRID_ORDENS_COMPRA,
    Math.max(1, Math.floor((numero * TOTAL_COLUNAS_GRID_ORDENS_COMPRA) / baseOrigem))
  );
}

function ajustarSpanColunaOculta(span, visivel, spanPadrao) {
  if (visivel) {
    return span;
  }

  const spanNormalizado = normalizarNumeroInteiro(span, spanPadrao || 1);
  return Math.min(MAX_SPAN_COLUNA_OCULTA, Math.max(1, spanNormalizado));
}
