export const TOTAL_COLUNAS_GRID_PEDIDOS = 24;

export const colunasGridPedidos = [
  {
    id: 'codigo',
    rotulo: 'Codigo',
    classe: 'colunaGradeCodigo',
    obrigatoria: false,
    ordemPadrao: 1,
    spanPadrao: 1,
    spanFixo: 1,
    visivelPadrao: true
  },
  {
    id: 'idPedido',
    rotulo: 'Codigo Interno',
    classe: 'colunaGradeCodigo',
    obrigatoria: false,
    ordemPadrao: 2,
    spanPadrao: 1,
    spanFixo: 1,
    visivelPadrao: false
  },
  {
    id: 'idOrcamento',
    rotulo: 'Orcamento de Origem',
    classe: 'colunaGradeCodigo',
    obrigatoria: false,
    ordemPadrao: 3,
    spanPadrao: 1,
    spanFixo: 1,
    visivelPadrao: false
  },
  {
    id: 'codigoOrcamentoOrigem',
    rotulo: 'Codigo do Orcamento de Origem',
    classe: 'colunaGradeCodigo',
    obrigatoria: false,
    ordemPadrao: 4,
    spanPadrao: 1,
    spanFixo: 1,
    visivelPadrao: false
  },
  {
    id: 'cliente',
    rotulo: 'Cliente',
    classe: 'colunaGradeTexto',
    obrigatoria: false,
    ordemPadrao: 5,
    spanPadrao: 5,
    visivelPadrao: true
  },
  {
    id: 'idCliente',
    rotulo: 'Cliente Vinculado',
    classe: 'colunaGradeTexto',
    obrigatoria: false,
    ordemPadrao: 6,
    spanPadrao: 4,
    visivelPadrao: false
  },
  {
    id: 'contato',
    rotulo: 'Contato',
    classe: 'colunaGradeTexto',
    obrigatoria: false,
    ordemPadrao: 7,
    spanPadrao: 4,
    visivelPadrao: true
  },
  {
    id: 'idContato',
    rotulo: 'Contato Vinculado',
    classe: 'colunaGradeTexto',
    obrigatoria: false,
    ordemPadrao: 8,
    spanPadrao: 4,
    visivelPadrao: false
  },
  {
    id: 'usuario',
    rotulo: 'Usuario',
    classe: 'colunaGradeTexto',
    obrigatoria: false,
    ordemPadrao: 9,
    spanPadrao: 3,
    visivelPadrao: false
  },
  {
    id: 'idUsuario',
    rotulo: 'Usuario do Registro',
    classe: 'colunaGradeTexto',
    obrigatoria: false,
    ordemPadrao: 10,
    spanPadrao: 3,
    visivelPadrao: false
  },
  {
    id: 'vendedor',
    rotulo: 'Vendedor',
    classe: 'colunaGradeTexto',
    obrigatoria: false,
    ordemPadrao: 11,
    spanPadrao: 4,
    visivelPadrao: true
  },
  {
    id: 'idVendedor',
    rotulo: 'Vendedor Vinculado',
    classe: 'colunaGradeTexto',
    obrigatoria: false,
    ordemPadrao: 12,
    spanPadrao: 4,
    visivelPadrao: false
  },
  {
    id: 'etapa',
    rotulo: 'Etapa',
    classe: 'colunaGradeSelecao',
    obrigatoria: false,
    ordemPadrao: 13,
    spanPadrao: 4,
    visivelPadrao: true
  },
  {
    id: 'idEtapaPedido',
    rotulo: 'Etapa Vinculada',
    classe: 'colunaGradeTexto',
    obrigatoria: false,
    ordemPadrao: 14,
    spanPadrao: 4,
    visivelPadrao: false
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
    rotulo: 'Prazo Vinculado',
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
    id: 'dataInclusao',
    rotulo: 'Data de Inclusao',
    classe: 'colunaGradeTexto',
    obrigatoria: false,
    ordemPadrao: 19,
    spanPadrao: 2,
    visivelPadrao: false
  },
  {
    id: 'dataEntrega',
    rotulo: 'Data de Entrega',
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
    id: 'observacao',
    rotulo: 'Observacao',
    classe: 'colunaGradeTexto',
    obrigatoria: false,
    ordemPadrao: 22,
    spanPadrao: 5,
    visivelPadrao: false
  },
  {
    id: 'total',
    rotulo: 'Total',
    classe: 'colunaGradeValor',
    obrigatoria: false,
    ordemPadrao: 23,
    spanPadrao: 3,
    visivelPadrao: true
  },
  {
    id: 'acoes',
    rotulo: 'Acoes',
    classe: 'colunaGradeAcoes',
    obrigatoria: true,
    ordemPadrao: 24,
    spanPadrao: 2,
    spanFixo: 2,
    visivelPadrao: true
  }
];

const idsPermitidos = new Set(colunasGridPedidos.map((coluna) => coluna.id));
const mapaColunasGridPedidos = new Map(
  colunasGridPedidos.map((coluna) => [coluna.id, coluna])
);

export function normalizarConfiguracoesColunasGridPedidos(valor) {
  const listaNormalizada = normalizarListaConfiguracoes(valor);
  const configuracoesPorId = new Map();

  listaNormalizada.forEach((item, indice) => {
    const id = String(item?.id || '').trim();

    if (!idsPermitidos.has(id)) {
      return;
    }

    const colunaBase = mapaColunasGridPedidos.get(id);
    const visivel = item.visivel === undefined ? true : Boolean(item.visivel);
    const ordem = normalizarNumeroInteiro(item.ordem, indice + 1);
    const span = normalizarSpanColuna(item.span, colunaBase?.spanPadrao || 1, colunaBase?.spanFixo);
    const configuracaoExistente = configuracoesPorId.get(id);

    configuracoesPorId.set(id, {
      id,
      visivel: item.visivel === undefined ? (configuracaoExistente?.visivel ?? visivel) : visivel,
      ordem: item.ordem === undefined ? (configuracaoExistente?.ordem ?? ordem) : ordem,
      span: item.span === undefined ? (configuracaoExistente?.span ?? span) : span
    });
  });

  const configuracoesNormalizadas = colunasGridPedidos.map((coluna, indice) => {
    const configuracao = configuracoesPorId.get(coluna.id);

    return {
      ...coluna,
      visivel: coluna.obrigatoria ? true : (configuracao?.visivel ?? coluna.visivelPadrao),
      ordem: coluna.obrigatoria || (configuracao?.visivel ?? coluna.visivelPadrao)
        ? normalizarNumeroInteiro(configuracao?.ordem, coluna.ordemPadrao || (indice + 1))
        : null,
      span: normalizarSpanColuna(configuracao?.span, coluna.spanPadrao || 1, coluna.spanFixo)
    };
  });

  return reordenarConfiguracoesColunasGridPedidos(configuracoesNormalizadas);
}

export function normalizarColunasGridPedidos(valor) {
  return normalizarConfiguracoesColunasGridPedidos(valor)
    .filter((coluna) => coluna.visivel)
    .sort(ordenarColunasGridPedidos);
}

export function reordenarConfiguracoesColunasGridPedidos(configuracoes) {
  const lista = Array.isArray(configuracoes) ? configuracoes.map((coluna) => ({ ...coluna })) : [];
  const visiveis = lista
    .filter((coluna) => coluna.visivel || coluna.obrigatoria)
    .sort(ordenarColunasGridPedidos)
    .map((coluna, indice) => ({
      ...coluna,
      visivel: coluna.obrigatoria ? true : Boolean(coluna.visivel),
      ordem: indice + 1
    }));
  const invisiveis = lista
    .filter((coluna) => !coluna.visivel && !coluna.obrigatoria)
    .sort((colunaA, colunaB) => (colunaA.ordemPadrao || 0) - (colunaB.ordemPadrao || 0))
    .map((coluna) => ({
      ...coluna,
      ordem: null
    }));

  return [...visiveis, ...invisiveis];
}

export function reposicionarConfiguracaoColunaGridPedidos(configuracoes, idColuna, ordemDesejada) {
  const lista = Array.isArray(configuracoes) ? configuracoes.map((coluna) => ({ ...coluna })) : [];
  const visiveisOrdenadas = lista
    .filter((coluna) => coluna.visivel || coluna.obrigatoria)
    .sort(ordenarColunasGridPedidos);
  const invisiveis = lista
    .filter((coluna) => !coluna.visivel && !coluna.obrigatoria)
    .sort((colunaA, colunaB) => (colunaA.ordemPadrao || 0) - (colunaB.ordemPadrao || 0))
    .map((coluna) => ({
      ...coluna,
      ordem: null
    }));
  const indiceAtual = visiveisOrdenadas.findIndex((coluna) => coluna.id === idColuna);

  if (indiceAtual === -1) {
    return reordenarConfiguracoesColunasGridPedidos(lista);
  }

  const [colunaReposicionada] = visiveisOrdenadas.splice(indiceAtual, 1);
  const ordemNormalizada = normalizarNumeroInteiro(ordemDesejada, colunaReposicionada.ordem || 1);
  const indiceDestino = Math.max(0, Math.min(visiveisOrdenadas.length, ordemNormalizada - 1));

  visiveisOrdenadas.splice(indiceDestino, 0, colunaReposicionada);

  const visiveisReordenadas = visiveisOrdenadas.map((coluna, indice) => ({
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
        visivel: item.visivel,
        ordem: item.ordem,
        span: item.span
      };
    })
    .filter(Boolean);
}

function ordenarColunasGridPedidos(colunaA, colunaB) {
  if (colunaA.ordem !== colunaB.ordem) {
    return colunaA.ordem - colunaB.ordem;
  }

  return (colunaA.ordemPadrao || 0) - (colunaB.ordemPadrao || 0);
}

function normalizarNumeroInteiro(valor, valorPadrao = 1) {
  const numero = Number.parseInt(String(valor ?? '').trim(), 10);
  return Number.isFinite(numero) && numero > 0 ? numero : valorPadrao;
}

function normalizarSpanColuna(valor, valorPadrao = 1, valorFixo = null) {
  if (Number.isFinite(Number(valorFixo)) && Number(valorFixo) > 0) {
    return Number(valorFixo);
  }

  const numero = normalizarNumeroInteiro(valor, valorPadrao);
  return Math.min(TOTAL_COLUNAS_GRID_PEDIDOS, Math.max(1, numero));
}
