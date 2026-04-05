export const TOTAL_COLUNAS_GRID_CLIENTES = 24;

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
    spanFixo: 1,
    visivelPadrao: true
  },
  {
    id: 'idCliente',
    rotulo: 'Codigo Interno',
    classe: 'colunaGradeCodigo',
    obrigatoria: false,
    ordemPadrao: 3,
    spanPadrao: 1,
    spanFixo: 1,
    visivelPadrao: false
  },
  {
    id: 'codigoAlternativo',
    rotulo: 'Codigo Alternativo',
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
    id: 'cidade',
    rotulo: 'Cidade',
    classe: 'colunaGradeTexto',
    obrigatoria: false,
    ordemPadrao: 14,
    spanPadrao: 3,
    visivelPadrao: true
  },
  {
    id: 'estado',
    rotulo: 'UF',
    classe: 'colunaGradeSigla',
    obrigatoria: false,
    ordemPadrao: 15,
    spanPadrao: 1,
    visivelPadrao: true
  },
  {
    id: 'cep',
    rotulo: 'CEP',
    classe: 'colunaGradeTexto',
    obrigatoria: false,
    ordemPadrao: 16,
    spanPadrao: 2,
    visivelPadrao: false
  },
  {
    id: 'logradouro',
    rotulo: 'Logradouro',
    classe: 'colunaGradeTexto',
    obrigatoria: false,
    ordemPadrao: 17,
    spanPadrao: 4,
    visivelPadrao: false
  },
  {
    id: 'numero',
    rotulo: 'Numero',
    classe: 'colunaGradeTextoCurto',
    obrigatoria: false,
    ordemPadrao: 18,
    spanPadrao: 1,
    visivelPadrao: false
  },
  {
    id: 'complemento',
    rotulo: 'Complemento',
    classe: 'colunaGradeTexto',
    obrigatoria: false,
    ordemPadrao: 19,
    spanPadrao: 3,
    visivelPadrao: false
  },
  {
    id: 'bairro',
    rotulo: 'Bairro',
    classe: 'colunaGradeTexto',
    obrigatoria: false,
    ordemPadrao: 20,
    spanPadrao: 3,
    visivelPadrao: false
  },
  {
    id: 'contato',
    rotulo: 'Contato',
    classe: 'colunaGradeTexto',
    obrigatoria: false,
    ordemPadrao: 21,
    spanPadrao: 3,
    visivelPadrao: true
  },
  {
    id: 'emailContatoPrincipal',
    rotulo: 'E-mail',
    classe: 'colunaGradeTexto',
    obrigatoria: false,
    ordemPadrao: 22,
    spanPadrao: 3,
    visivelPadrao: true
  },
  {
    id: 'email',
    rotulo: 'E-mail do Cadastro',
    classe: 'colunaGradeTexto',
    obrigatoria: false,
    ordemPadrao: 23,
    spanPadrao: 3,
    visivelPadrao: false
  },
  {
    id: 'telefone',
    rotulo: 'Telefone',
    classe: 'colunaGradeTexto',
    obrigatoria: false,
    ordemPadrao: 24,
    spanPadrao: 2,
    visivelPadrao: false
  },
  {
    id: 'vendedor',
    rotulo: 'Vendedor',
    classe: 'colunaGradeTexto',
    obrigatoria: false,
    ordemPadrao: 25,
    spanPadrao: 2,
    visivelPadrao: true
  },
  {
    id: 'idVendedor',
    rotulo: 'Vendedor do Cadastro',
    classe: 'colunaGradeTexto',
    obrigatoria: false,
    ordemPadrao: 26,
    spanPadrao: 3,
    visivelPadrao: false
  },
  {
    id: 'observacao',
    rotulo: 'Observacao',
    classe: 'colunaGradeTexto',
    obrigatoria: false,
    ordemPadrao: 27,
    spanPadrao: 4,
    visivelPadrao: false
  },
  {
    id: 'dataCriacao',
    rotulo: 'Data de Criacao',
    classe: 'colunaGradeTexto',
    obrigatoria: false,
    ordemPadrao: 28,
    spanPadrao: 2,
    visivelPadrao: false
  },
  {
    id: 'status',
    rotulo: 'Status',
    classe: 'colunaGradeStatus',
    obrigatoria: false,
    ordemPadrao: 29,
    spanPadrao: 1,
    spanFixo: 1,
    visivelPadrao: true
  },
  {
    id: 'acoes',
    rotulo: 'Acoes',
    classe: 'colunaGradeAcoes',
    obrigatoria: true,
    ordemPadrao: 30,
    spanPadrao: 2,
    spanFixo: 2,
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

  const configuracoesNormalizadas = colunasGridClientes.map((coluna, indice) => {
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

export function reposicionarConfiguracaoColunaGridClientes(configuracoes, idColuna, ordemDesejada) {
  const lista = Array.isArray(configuracoes) ? configuracoes.map((coluna) => ({ ...coluna })) : [];
  const visiveisOrdenadas = lista
    .filter((coluna) => coluna.visivel || coluna.obrigatoria)
    .sort(ordenarColunasGridClientes);
  const invisiveis = lista
    .filter((coluna) => !coluna.visivel && !coluna.obrigatoria)
    .sort((colunaA, colunaB) => (colunaA.ordemPadrao || 0) - (colunaB.ordemPadrao || 0))
    .map((coluna) => ({
      ...coluna,
      ordem: null
    }));
  const indiceAtual = visiveisOrdenadas.findIndex((coluna) => coluna.id === idColuna);

  if (indiceAtual === -1) {
    return reordenarConfiguracoesColunasGridClientes(lista);
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
  return Math.min(TOTAL_COLUNAS_GRID_CLIENTES, Math.max(1, numero));
}
