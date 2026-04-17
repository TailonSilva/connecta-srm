export const TOTAL_COLUNAS_GRID_CLIENTES = 100;
const BASE_LEGADA_COLUNAS_GRID_CLIENTES = 24;
const MAX_SPAN_COLUNA_OCULTA = 19;

export const colunasGridClientes = [
  {
    id: 'imagem',
    rotulo: 'Imagem',
    classe: 'colunaGradeMidia',
    obrigatoria: false,
    ordemPadrao: 1,
    spanPadrao: 1,
    visivelPadrao: true
  },
  {
    id: 'codigo',
    rotulo: 'Codigo',
    classe: 'colunaGradeCodigo',
    obrigatoria: false,
    ordemPadrao: 2,
    spanPadrao: 1,
    visivelPadrao: true
  },
  {
    id: 'idCliente',
    rotulo: 'Codigo Interno',
    classe: 'colunaGradeCodigo',
    obrigatoria: false,
    ordemPadrao: 3,
    spanPadrao: 1,
    visivelPadrao: false
  },
  {
    id: 'codigoAlternativo',
    rotulo: 'Codigo Alternativo',
    classe: 'colunaGradeCodigo',
    obrigatoria: false,
    ordemPadrao: 4,
    spanPadrao: 1,
    visivelPadrao: false
  },
  {
    id: 'cliente',
    rotulo: 'Cliente',
    classe: 'colunaGradeTexto',
    obrigatoria: false,
    ordemPadrao: 5,
    spanPadrao: 4,
    visivelPadrao: true
  },
  {
    id: 'razaoSocial',
    rotulo: 'Razao Social',
    classe: 'colunaGradeTexto',
    obrigatoria: false,
    ordemPadrao: 6,
    spanPadrao: 4,
    visivelPadrao: false
  },
  {
    id: 'nomeFantasia',
    rotulo: 'Nome Fantasia',
    classe: 'colunaGradeTexto',
    obrigatoria: false,
    ordemPadrao: 7,
    spanPadrao: 4,
    visivelPadrao: false
  },
  {
    id: 'documento',
    rotulo: 'CNPJ/CPF',
    classe: 'colunaGradeTexto',
    obrigatoria: false,
    ordemPadrao: 8,
    spanPadrao: 3,
    visivelPadrao: true
  },
  {
    id: 'cnpj',
    rotulo: 'CNPJ/CPF do Cadastro',
    classe: 'colunaGradeTexto',
    obrigatoria: false,
    ordemPadrao: 9,
    spanPadrao: 3,
    visivelPadrao: false
  },
  {
    id: 'tipo',
    rotulo: 'Tipo',
    classe: 'colunaGradeTexto',
    obrigatoria: false,
    ordemPadrao: 10,
    spanPadrao: 2,
    visivelPadrao: false
  },
  {
    id: 'inscricaoEstadual',
    rotulo: 'Inscricao Estadual',
    classe: 'colunaGradeTexto',
    obrigatoria: false,
    ordemPadrao: 11,
    spanPadrao: 3,
    visivelPadrao: false
  },
  {
    id: 'idGrupoEmpresa',
    rotulo: 'Grupo de Empresa',
    classe: 'colunaGradeTexto',
    obrigatoria: false,
    ordemPadrao: 12,
    spanPadrao: 3,
    visivelPadrao: false
  },
  {
    id: 'idRamo',
    rotulo: 'Ramo de Atividade',
    classe: 'colunaGradeTexto',
    obrigatoria: false,
    ordemPadrao: 13,
    spanPadrao: 3,
    visivelPadrao: false
  },
  {
    id: 'idConceito',
    rotulo: 'Conceito',
    classe: 'colunaGradeTexto',
    obrigatoria: false,
    ordemPadrao: 14,
    spanPadrao: 3,
    visivelPadrao: false
  },
  {
    id: 'cidade',
    rotulo: 'Cidade',
    classe: 'colunaGradeTexto',
    obrigatoria: false,
    ordemPadrao: 15,
    spanPadrao: 3,
    visivelPadrao: true
  },
  {
    id: 'estado',
    rotulo: 'UF',
    classe: 'colunaGradeSigla',
    obrigatoria: false,
    ordemPadrao: 16,
    spanPadrao: 1,
    visivelPadrao: true
  },
  {
    id: 'cep',
    rotulo: 'CEP',
    classe: 'colunaGradeTexto',
    obrigatoria: false,
    ordemPadrao: 17,
    spanPadrao: 2,
    visivelPadrao: false
  },
  {
    id: 'logradouro',
    rotulo: 'Logradouro',
    classe: 'colunaGradeTexto',
    obrigatoria: false,
    ordemPadrao: 18,
    spanPadrao: 4,
    visivelPadrao: false
  },
  {
    id: 'numero',
    rotulo: 'Numero',
    classe: 'colunaGradeTextoCurto',
    obrigatoria: false,
    ordemPadrao: 19,
    spanPadrao: 1,
    visivelPadrao: false
  },
  {
    id: 'complemento',
    rotulo: 'Complemento',
    classe: 'colunaGradeTexto',
    obrigatoria: false,
    ordemPadrao: 20,
    spanPadrao: 3,
    visivelPadrao: false
  },
  {
    id: 'bairro',
    rotulo: 'Bairro',
    classe: 'colunaGradeTexto',
    obrigatoria: false,
    ordemPadrao: 21,
    spanPadrao: 3,
    visivelPadrao: false
  },
  {
    id: 'contato',
    rotulo: 'Contato',
    classe: 'colunaGradeTexto',
    obrigatoria: false,
    ordemPadrao: 22,
    spanPadrao: 3,
    visivelPadrao: true
  },
  {
    id: 'emailContatoPrincipal',
    rotulo: 'E-mail',
    classe: 'colunaGradeTexto',
    obrigatoria: false,
    ordemPadrao: 23,
    spanPadrao: 3,
    visivelPadrao: true
  },
  {
    id: 'email',
    rotulo: 'E-mail do Cadastro',
    classe: 'colunaGradeTexto',
    obrigatoria: false,
    ordemPadrao: 24,
    spanPadrao: 3,
    visivelPadrao: false
  },
  {
    id: 'telefone',
    rotulo: 'Telefone',
    classe: 'colunaGradeTexto',
    obrigatoria: false,
    ordemPadrao: 25,
    spanPadrao: 2,
    visivelPadrao: false
  },
  {
    id: 'vendedor',
    rotulo: 'Vendedor',
    classe: 'colunaGradeTexto',
    obrigatoria: false,
    ordemPadrao: 26,
    spanPadrao: 2,
    visivelPadrao: true
  },
  {
    id: 'idVendedor',
    rotulo: 'Vendedor do Cadastro',
    classe: 'colunaGradeTexto',
    obrigatoria: false,
    ordemPadrao: 27,
    spanPadrao: 3,
    visivelPadrao: false
  },
  {
    id: 'observacao',
    rotulo: 'Observacao',
    classe: 'colunaGradeTexto',
    obrigatoria: false,
    ordemPadrao: 28,
    spanPadrao: 4,
    visivelPadrao: false
  },
  {
    id: 'dataCriacao',
    rotulo: 'Data de Criacao',
    classe: 'colunaGradeTexto',
    obrigatoria: false,
    ordemPadrao: 29,
    spanPadrao: 2,
    visivelPadrao: false
  },
  {
    id: 'status',
    rotulo: 'Status',
    classe: 'colunaGradeStatus',
    obrigatoria: false,
    ordemPadrao: 30,
    spanPadrao: 1,
    visivelPadrao: true
  },
  {
    id: 'acoes',
    rotulo: 'Acoes',
    classe: 'colunaGradeAcoes',
    obrigatoria: true,
    ordemPadrao: 31,
    spanPadrao: 2,
    visivelPadrao: true
  }
];

const idsPermitidos = new Set(colunasGridClientes.map((coluna) => coluna.id));
const mapaColunasGridClientes = new Map(
  colunasGridClientes.map((coluna) => [coluna.id, coluna])
);

export function normalizarConfiguracoesColunasGridClientes(valor) {
  const listaNormalizada = normalizarListaConfiguracoes(valor);
  const listaTemEmailContatoPrincipal = listaNormalizada.some((item) => item?.id === 'emailContatoPrincipal');
  const configuracoesPorId = new Map();

  listaNormalizada.forEach((item, indice) => {
    const id = normalizarIdConfiguracao(String(item?.id || '').trim(), {
      listaTemEmailContatoPrincipal,
      itemEhObjeto: true
    });

    if (!idsPermitidos.has(id)) {
      return;
    }

    const colunaBase = mapaColunasGridClientes.get(id);
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

  const configuracoesNormalizadas = colunasGridClientes.map((coluna, indice) => {
    const configuracao = configuracoesPorId.get(coluna.id);
    const spanPadraoColuna = normalizarSpanDefinicaoColuna(coluna.spanPadrao || 1);
    const spanFixoColuna = normalizarSpanDefinicaoColuna(coluna.spanFixo);

    return {
      ...coluna,
      base: TOTAL_COLUNAS_GRID_CLIENTES,
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
        normalizarBaseConfiguracao(configuracao?.base, TOTAL_COLUNAS_GRID_CLIENTES)
      )
    };
  }).map((coluna) => ({
    ...coluna,
    span: ajustarSpanColunaOculta(coluna.span, coluna.visivel || coluna.obrigatoria, coluna.spanPadrao)
  }));

  return reordenarConfiguracoesColunasGridClientes(configuracoesNormalizadas);
}

export function normalizarColunasGridClientes(valor) {
  return normalizarConfiguracoesColunasGridClientes(valor)
    .filter((coluna) => coluna.visivel)
    .sort(ordenarColunasGridClientes);
}

export function reordenarConfiguracoesColunasGridClientes(configuracoes) {
  const lista = Array.isArray(configuracoes) ? configuracoes.map((coluna) => ({ ...coluna })) : [];
  const visiveis = lista
    .filter((coluna) => coluna.visivel || coluna.obrigatoria)
    .sort(ordenarColunasGridClientes)
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

export function reposicionarConfiguracaoColunaGridClientes(configuracoes, idColuna, ordemDesejada) {
  const lista = Array.isArray(configuracoes) ? configuracoes.map((coluna) => ({ ...coluna })) : [];
  const visiveisOrdenadas = lista
    .filter((coluna) => coluna.visivel || coluna.obrigatoria)
    .sort(ordenarColunasGridClientes);
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
    return reordenarConfiguracoesColunasGridClientes(lista);
  }

  const indiceAtual = colunasReordenaveis.findIndex((coluna) => coluna.id === idColuna);

  if (indiceAtual === -1) {
    return reordenarConfiguracoesColunasGridClientes(lista);
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
  const listaTemEmailContatoPrincipal = Array.isArray(lista)
    && lista.some((item) => String(item?.id ?? item ?? '').trim() === 'emailContatoPrincipal');

  return lista
    .map((item) => {
      if (typeof item === 'string' || typeof item === 'number') {
        return {
          id: normalizarIdConfiguracao(String(item).trim(), {
            listaTemEmailContatoPrincipal,
            itemEhObjeto: false
          })
        };
      }

      if (!item || typeof item !== 'object') {
        return null;
      }

      return {
        id: normalizarIdConfiguracao(String(item.id || '').trim(), {
          listaTemEmailContatoPrincipal,
          itemEhObjeto: true
        }),
        base: item.base,
        rotulo: item.rotulo,
        visivel: item.visivel,
        ordem: item.ordem,
        span: item.span
      };
    })
    .filter(Boolean);
}

function normalizarIdConfiguracao(id, contexto = {}) {
  const { listaTemEmailContatoPrincipal = false, itemEhObjeto = false } = contexto;

  if (id === 'email') {
    if (itemEhObjeto && listaTemEmailContatoPrincipal) {
      return 'email';
    }

    return 'emailContatoPrincipal';
  }

  return id;
}

function ordenarColunasGridClientes(colunaA, colunaB) {
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

function normalizarSpanColuna(valor, valorPadrao = 1, valorFixo = null, baseConfiguracao = TOTAL_COLUNAS_GRID_CLIENTES) {
  if (Number.isFinite(Number(valorFixo)) && Number(valorFixo) > 0) {
    return Math.min(TOTAL_COLUNAS_GRID_CLIENTES, Math.max(1, Number(valorFixo)));
  }

  const numero = normalizarNumeroInteiro(valor, valorPadrao);
  return converterSpanParaBaseAtual(numero, baseConfiguracao);
}

function normalizarRotuloColuna(valor, valorPadrao = '') {
  const texto = String(valor ?? '').trim();
  return texto || String(valorPadrao || '').trim();
}

function normalizarBaseConfiguracao(valor, valorPadrao = BASE_LEGADA_COLUNAS_GRID_CLIENTES) {
  const numero = Number.parseInt(String(valor ?? '').trim(), 10);
  return Number.isFinite(numero) && numero > 0 ? numero : valorPadrao;
}

function normalizarSpanDefinicaoColuna(valor) {
  if (!Number.isFinite(Number(valor)) || Number(valor) <= 0) {
    return null;
  }

  return converterSpanParaBaseAtual(Number(valor), BASE_LEGADA_COLUNAS_GRID_CLIENTES);
}

function converterSpanParaBaseAtual(valor, baseOrigem = TOTAL_COLUNAS_GRID_CLIENTES) {
  const numero = normalizarNumeroInteiro(valor, 1);

  if (baseOrigem === TOTAL_COLUNAS_GRID_CLIENTES) {
    return Math.min(TOTAL_COLUNAS_GRID_CLIENTES, Math.max(1, numero));
  }

  return Math.min(
    TOTAL_COLUNAS_GRID_CLIENTES,
    Math.max(1, Math.floor((numero * TOTAL_COLUNAS_GRID_CLIENTES) / baseOrigem))
  );
}

function ajustarSpanColunaOculta(span, visivel, spanPadrao) {
  if (visivel) {
    return span;
  }

  const spanNormalizado = normalizarNumeroInteiro(span, spanPadrao || 1);
  return Math.min(MAX_SPAN_COLUNA_OCULTA, Math.max(1, spanNormalizado));
}
