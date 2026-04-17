export const TOTAL_COLUNAS_GRID_ORCAMENTOS = 100;
const BASE_LEGADA_COLUNAS_GRID_ORCAMENTOS = 24;
const MAX_SPAN_COLUNA_OCULTA = 19;
const mapaRotulosLegadosColunasGridOrcamentos = new Map([
  ['Codigo Interno do Orcamento', 'Codigo Interno'],
  ['Codigo do Orcamento', 'Codigo Interno'],
  ['Cliente Vinculado ao Orcamento', 'Codigo do Cliente'],
  ['Contato Vinculado ao Orcamento', 'Codigo do Contato'],
  ['Usuario do Registro', 'Codigo do Usuario'],
  ['Vendedor Vinculado', 'Codigo do Vendedor'],
  ['Pedido Vinculado', 'Codigo do Pedido Vinculado'],
  ['Numero do Pedido Vinculado', 'Codigo do Pedido Vinculado'],
  ['Etapa Vinculada ao Orcamento', 'Codigo da Etapa'],
  ['Prazo Vinculado ao Orcamento', 'Codigo do Prazo']
]);

export const colunasGridOrcamentos = [
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
    id: 'idOrcamento',
    rotulo: 'Codigo Interno',
    classe: 'colunaGradeCodigo',
    obrigatoria: false,
    ordemPadrao: 2,
    spanPadrao: 1,
    visivelPadrao: false
  },
  {
    id: 'cliente',
    rotulo: 'Cliente',
    classe: 'colunaGradeTexto',
    obrigatoria: false,
    ordemPadrao: 3,
    spanPadrao: 5,
    visivelPadrao: true
  },
  {
    id: 'idCliente',
    rotulo: 'Codigo do Cliente',
    classe: 'colunaGradeTexto',
    obrigatoria: false,
    ordemPadrao: 4,
    spanPadrao: 4,
    visivelPadrao: false
  },
  {
    id: 'idConceito',
    rotulo: 'Conceito',
    classe: 'colunaGradeTexto',
    obrigatoria: false,
    ordemPadrao: 5,
    spanPadrao: 3,
    visivelPadrao: false
  },
  {
    id: 'contato',
    rotulo: 'Contato',
    classe: 'colunaGradeTexto',
    obrigatoria: false,
    ordemPadrao: 6,
    spanPadrao: 4,
    visivelPadrao: true
  },
  {
    id: 'idContato',
    rotulo: 'Codigo do Contato',
    classe: 'colunaGradeTexto',
    obrigatoria: false,
    ordemPadrao: 7,
    spanPadrao: 4,
    visivelPadrao: false
  },
  {
    id: 'usuario',
    rotulo: 'Usuario',
    classe: 'colunaGradeTexto',
    obrigatoria: false,
    ordemPadrao: 8,
    spanPadrao: 3,
    visivelPadrao: false
  },
  {
    id: 'idUsuario',
    rotulo: 'Codigo do Usuario',
    classe: 'colunaGradeTexto',
    obrigatoria: false,
    ordemPadrao: 9,
    spanPadrao: 3,
    visivelPadrao: false
  },
  {
    id: 'idPedidoVinculado',
    rotulo: 'Codigo do Pedido Vinculado',
    classe: 'colunaGradeCodigo',
    obrigatoria: false,
    ordemPadrao: 10,
    spanPadrao: 1,
    visivelPadrao: false
  },
  {
    id: 'idVendedor',
    rotulo: 'Codigo do Vendedor',
    classe: 'colunaGradeTexto',
    obrigatoria: false,
    ordemPadrao: 11,
    spanPadrao: 4,
    visivelPadrao: false
  },
  {
    id: 'etapa',
    rotulo: 'Etapa',
    classe: 'colunaGradeSelecao',
    obrigatoria: false,
    ordemPadrao: 12,
    spanPadrao: 4,
    visivelPadrao: true
  },
  {
    id: 'idEtapaOrcamento',
    rotulo: 'Codigo da Etapa',
    classe: 'colunaGradeTexto',
    obrigatoria: false,
    ordemPadrao: 13,
    spanPadrao: 4,
    visivelPadrao: false
  },
  {
    id: 'vendedor',
    rotulo: 'Vendedor',
    classe: 'colunaGradeTexto',
    obrigatoria: false,
    ordemPadrao: 14,
    spanPadrao: 4,
    visivelPadrao: true
  },
  {
    id: 'comissao',
    rotulo: 'Comissao',
    classe: 'colunaGradeValor',
    obrigatoria: false,
    ordemPadrao: 15,
    spanPadrao: 2,
    visivelPadrao: false
  },
  {
    id: 'prazoPagamento',
    rotulo: 'Prazo de Pagamento',
    classe: 'colunaGradeTexto',
    obrigatoria: false,
    ordemPadrao: 16,
    spanPadrao: 4,
    visivelPadrao: false
  },
  {
    id: 'idPrazoPagamento',
    rotulo: 'Codigo do Prazo',
    classe: 'colunaGradeTexto',
    obrigatoria: false,
    ordemPadrao: 17,
    spanPadrao: 4,
    visivelPadrao: false
  },
  {
    id: 'metodoPagamento',
    rotulo: 'Metodo de Pagamento',
    classe: 'colunaGradeTexto',
    obrigatoria: false,
    ordemPadrao: 18,
    spanPadrao: 3,
    visivelPadrao: false
  },
  {
    id: 'idMotivoPerda',
    rotulo: 'Motivo de Perda',
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
    id: 'dataValidade',
    rotulo: 'Data de Validade',
    classe: 'colunaGradeTexto',
    obrigatoria: false,
    ordemPadrao: 21,
    spanPadrao: 2,
    visivelPadrao: false
  },
  {
    id: 'dataFechamento',
    rotulo: 'Data de Fechamento',
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

const idsPermitidos = new Set(colunasGridOrcamentos.map((coluna) => coluna.id));
const mapaColunasGridOrcamentos = new Map(
  colunasGridOrcamentos.map((coluna) => [coluna.id, coluna])
);

export function normalizarConfiguracoesColunasGridOrcamentos(valor) {
  const listaNormalizada = normalizarListaConfiguracoes(valor);
  const configuracoesPorId = new Map();

  listaNormalizada.forEach((item, indice) => {
    const id = String(item?.id || '').trim();

    if (!idsPermitidos.has(id)) {
      return;
    }

    const colunaBase = mapaColunasGridOrcamentos.get(id);
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

  const configuracoesNormalizadas = colunasGridOrcamentos.map((coluna, indice) => {
    const configuracao = configuracoesPorId.get(coluna.id);
    const spanPadraoColuna = normalizarSpanDefinicaoColuna(coluna.spanPadrao || 1);
    const spanFixoColuna = normalizarSpanDefinicaoColuna(coluna.spanFixo);

    return {
      ...coluna,
      base: TOTAL_COLUNAS_GRID_ORCAMENTOS,
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
        normalizarBaseConfiguracao(configuracao?.base, TOTAL_COLUNAS_GRID_ORCAMENTOS)
      )
    };
  }).map((coluna) => ({
    ...coluna,
    span: ajustarSpanColunaOculta(coluna.span, coluna.visivel || coluna.obrigatoria, coluna.spanPadrao)
  }));

  return reordenarConfiguracoesColunasGridOrcamentos(configuracoesNormalizadas);
}

export function normalizarColunasGridOrcamentos(valor) {
  return normalizarConfiguracoesColunasGridOrcamentos(valor)
    .filter((coluna) => coluna.visivel)
    .sort(ordenarColunasGridOrcamentos);
}

export function reordenarConfiguracoesColunasGridOrcamentos(configuracoes) {
  const lista = Array.isArray(configuracoes) ? configuracoes.map((coluna) => ({ ...coluna })) : [];
  const visiveis = lista
    .filter((coluna) => coluna.visivel || coluna.obrigatoria)
    .sort(ordenarColunasGridOrcamentos)
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

export function reposicionarConfiguracaoColunaGridOrcamentos(configuracoes, idColuna, ordemDesejada) {
  const lista = Array.isArray(configuracoes) ? configuracoes.map((coluna) => ({ ...coluna })) : [];
  const visiveisOrdenadas = lista
    .filter((coluna) => coluna.visivel || coluna.obrigatoria)
    .sort(ordenarColunasGridOrcamentos);
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
    return reordenarConfiguracoesColunasGridOrcamentos(lista);
  }

  const indiceAtual = colunasReordenaveis.findIndex((coluna) => coluna.id === idColuna);

  if (indiceAtual === -1) {
    return reordenarConfiguracoesColunasGridOrcamentos(lista);
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

function ordenarColunasGridOrcamentos(colunaA, colunaB) {
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

function normalizarSpanColuna(valor, valorPadrao = 1, valorFixo = null, baseConfiguracao = TOTAL_COLUNAS_GRID_ORCAMENTOS) {
  if (Number.isFinite(Number(valorFixo)) && Number(valorFixo) > 0) {
    return Math.min(TOTAL_COLUNAS_GRID_ORCAMENTOS, Math.max(1, Number(valorFixo)));
  }

  const numero = normalizarNumeroInteiro(valor, valorPadrao);
  return converterSpanParaBaseAtual(numero, baseConfiguracao);
}

function normalizarRotuloColuna(valor, valorPadrao = '') {
  const texto = String(valor ?? '').trim();
  const textoNormalizado = mapaRotulosLegadosColunasGridOrcamentos.get(texto) || texto;
  return textoNormalizado || String(valorPadrao || '').trim();
}

function normalizarBaseConfiguracao(valor, valorPadrao = BASE_LEGADA_COLUNAS_GRID_ORCAMENTOS) {
  const numero = Number.parseInt(String(valor ?? '').trim(), 10);
  return Number.isFinite(numero) && numero > 0 ? numero : valorPadrao;
}

function normalizarSpanDefinicaoColuna(valor) {
  if (!Number.isFinite(Number(valor)) || Number(valor) <= 0) {
    return null;
  }

  return converterSpanParaBaseAtual(Number(valor), BASE_LEGADA_COLUNAS_GRID_ORCAMENTOS);
}

function converterSpanParaBaseAtual(valor, baseOrigem = TOTAL_COLUNAS_GRID_ORCAMENTOS) {
  const numero = normalizarNumeroInteiro(valor, 1);

  if (baseOrigem === TOTAL_COLUNAS_GRID_ORCAMENTOS) {
    return Math.min(TOTAL_COLUNAS_GRID_ORCAMENTOS, Math.max(1, numero));
  }

  return Math.min(
    TOTAL_COLUNAS_GRID_ORCAMENTOS,
    Math.max(1, Math.floor((numero * TOTAL_COLUNAS_GRID_ORCAMENTOS) / baseOrigem))
  );
}

function ajustarSpanColunaOculta(span, visivel, spanPadrao) {
  if (visivel) {
    return span;
  }

  const spanNormalizado = normalizarNumeroInteiro(span, spanPadrao || 1);
  return Math.min(MAX_SPAN_COLUNA_OCULTA, Math.max(1, spanNormalizado));
}
