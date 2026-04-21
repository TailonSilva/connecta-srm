export const TOTAL_COLUNAS_GRAFICOS_PAGINA_INICIAL = 10;
const BASE_LEGADA_GRAFICOS_PAGINA_INICIAL = 4;

export const graficosPaginaInicialCotacoes = [
  {
    id: 'funilCotacoes',
    rotulo: 'Funil de cotacoes',
    ajudaConfiguracao: 'Mostra o valor e a quantidade de itens por etapa do funil de cotacoes em aberto.',
    ordemPadrao: 1,
    spanPadrao: 5,
    visivelPadrao: true
  },
  {
    id: 'cotacoesGrupoProdutos',
    rotulo: 'Cotacoes em aberto por grupo de produtos',
    ajudaConfiguracao: 'Mostra o valor e a quantidade de itens das cotacoes em aberto por grupo de produto.',
    ordemPadrao: 2,
    spanPadrao: 5,
    visivelPadrao: true
  },
  {
    id: 'cotacoesMarca',
    rotulo: 'Cotacoes em aberto por marca',
    ajudaConfiguracao: 'Mostra o valor e a quantidade de itens das cotacoes em aberto por marca.',
    ordemPadrao: 3,
    spanPadrao: 5,
    visivelPadrao: true
  },
  {
    id: 'cotacoesProdutos',
    rotulo: 'Cotacoes em aberto por produto',
    ajudaConfiguracao: 'Mostra o valor e a quantidade de itens das cotacoes em aberto por produto.',
    ordemPadrao: 4,
    spanPadrao: 5,
    visivelPadrao: true
  }
];

export const graficosPaginaInicialOrdensCompra = [
  {
    id: 'ordensCompraGrupoProdutos',
    rotulo: 'Ordens de compra do mes por grupo de produtos',
    ajudaConfiguracao: 'Mostra o valor liquido e a quantidade de itens das ordens de compra no mes corrente por grupo de produto.',
    ordemPadrao: 1,
    spanPadrao: 5,
    visivelPadrao: true
  },
  {
    id: 'ordensCompraMarca',
    rotulo: 'Ordens de compra do mes por marca',
    ajudaConfiguracao: 'Mostra o valor liquido e a quantidade de itens das ordens de compra no mes corrente por marca.',
    ordemPadrao: 2,
    spanPadrao: 5,
    visivelPadrao: true
  },
  {
    id: 'ordensCompraUf',
    rotulo: 'Ordens de compra do mes por UF',
    ajudaConfiguracao: 'Mostra o valor liquido e a quantidade de itens das ordens de compra no mes corrente por UF.',
    ordemPadrao: 3,
    spanPadrao: 5,
    visivelPadrao: true
  },
  {
    id: 'ordensCompraFornecedores',
    rotulo: 'Ordens de compra do mes por fornecedor',
    ajudaConfiguracao: 'Mostra o valor liquido e a quantidade de itens das ordens de compra no mes corrente por fornecedor.',
    ordemPadrao: 4,
    spanPadrao: 5,
    visivelPadrao: true
  },
  {
    id: 'ordensCompraConceitosFornecedor',
    rotulo: 'Ordens de compra do mes por conceito de fornecedor',
    ajudaConfiguracao: 'Mostra o valor liquido e a quantidade de itens das ordens de compra no mes corrente por conceito de fornecedor.',
    ordemPadrao: 5,
    spanPadrao: 5,
    visivelPadrao: true
  },
  {
    id: 'ordensCompraProdutos',
    rotulo: 'Ordens de compra do mes por produto',
    ajudaConfiguracao: 'Mostra o valor liquido e a quantidade de itens das ordens de compra no mes corrente por produto.',
    ordemPadrao: 6,
    spanPadrao: 5,
    visivelPadrao: true
  },
  {
    id: 'rankingOrdensCompra',
    rotulo: 'Compradores em destaque',
    ajudaConfiguracao: 'Mostra o ranking de compradores por valor liquido de ordens de compra no mes corrente.',
    ordemPadrao: 7,
    spanPadrao: 5,
    visivelPadrao: true
  }
];

export const graficosPaginaInicialAtendimentos = [
  {
    id: 'atendimentosCanal',
    rotulo: 'Atendimentos do mes por canal',
    ajudaConfiguracao: 'Mostra a quantidade de atendimentos e de fornecedores atendidos por canal no mes corrente.',
    ordemPadrao: 1,
    spanPadrao: 5,
    visivelPadrao: true
  },
  {
    id: 'atendimentosOrigem',
    rotulo: 'Atendimentos do mes por origem',
    ajudaConfiguracao: 'Mostra a quantidade de atendimentos e de fornecedores atendidos por origem no mes corrente.',
    ordemPadrao: 2,
    spanPadrao: 5,
    visivelPadrao: true
  },
  {
    id: 'atendimentosFornecedor',
    rotulo: 'Atendimentos do mes por fornecedor',
    ajudaConfiguracao: 'Mostra a quantidade de atendimentos e a recorrencia por fornecedor no mes corrente.',
    ordemPadrao: 3,
    spanPadrao: 5,
    visivelPadrao: true
  },
  {
    id: 'atendimentosUsuario',
    rotulo: 'Atendimentos do mes por usuario',
    ajudaConfiguracao: 'Mostra a quantidade de atendimentos e de fornecedores atendidos por usuario no mes corrente.',
    ordemPadrao: 4,
    spanPadrao: 5,
    visivelPadrao: true
  },
  {
    id: 'atendimentosTipo',
    rotulo: 'Atendimentos do mes por tipo',
    ajudaConfiguracao: 'Mostra a quantidade de atendimentos e de fornecedores atendidos por tipo de atendimento no mes corrente.',
    ordemPadrao: 5,
    spanPadrao: 5,
    visivelPadrao: true
  }
];

const idsPermitidosGraficosPaginaInicialCotacoes = new Set(
  graficosPaginaInicialCotacoes.map((grafico) => grafico.id)
);
const idsPermitidosGraficosPaginaInicialOrdensCompra = new Set(
  graficosPaginaInicialOrdensCompra.map((grafico) => grafico.id)
);
const idsPermitidosGraficosPaginaInicialAtendimentos = new Set(
  graficosPaginaInicialAtendimentos.map((grafico) => grafico.id)
);

const mapaGraficosPaginaInicialCotacoes = new Map(
  graficosPaginaInicialCotacoes.map((grafico) => [grafico.id, grafico])
);
const mapaGraficosPaginaInicialOrdensCompra = new Map(
  graficosPaginaInicialOrdensCompra.map((grafico) => [grafico.id, grafico])
);
const mapaGraficosPaginaInicialAtendimentos = new Map(
  graficosPaginaInicialAtendimentos.map((grafico) => [grafico.id, grafico])
);

export function normalizarConfiguracoesGraficosPaginaInicialCotacoes(valor) {
  return normalizarConfiguracoesGraficosPaginaInicial(
    valor,
    graficosPaginaInicialCotacoes,
    idsPermitidosGraficosPaginaInicialCotacoes,
    mapaGraficosPaginaInicialCotacoes
  );
}

export function normalizarConfiguracoesGraficosPaginaInicialOrdensCompra(valor) {
  return normalizarConfiguracoesGraficosPaginaInicial(
    valor,
    graficosPaginaInicialOrdensCompra,
    idsPermitidosGraficosPaginaInicialOrdensCompra,
    mapaGraficosPaginaInicialOrdensCompra
  );
}

export function normalizarConfiguracoesGraficosPaginaInicialAtendimentos(valor) {
  return normalizarConfiguracoesGraficosPaginaInicial(
    valor,
    graficosPaginaInicialAtendimentos,
    idsPermitidosGraficosPaginaInicialAtendimentos,
    mapaGraficosPaginaInicialAtendimentos
  );
}

export function reordenarConfiguracoesGraficosPaginaInicialCotacoes(configuracoes) {
  return reordenarConfiguracoesGraficosPaginaInicial(
    configuracoes,
    graficosPaginaInicialCotacoes
  );
}

export function reordenarConfiguracoesGraficosPaginaInicialOrdensCompra(configuracoes) {
  return reordenarConfiguracoesGraficosPaginaInicial(
    configuracoes,
    graficosPaginaInicialOrdensCompra
  );
}

export function reordenarConfiguracoesGraficosPaginaInicialAtendimentos(configuracoes) {
  return reordenarConfiguracoesGraficosPaginaInicial(
    configuracoes,
    graficosPaginaInicialAtendimentos
  );
}

export function reposicionarConfiguracaoGraficosPaginaInicialCotacoes(configuracoes, idGrafico, ordemDesejada) {
  return reposicionarConfiguracaoGraficosPaginaInicial(
    configuracoes,
    idGrafico,
    ordemDesejada,
    graficosPaginaInicialCotacoes
  );
}

export function reposicionarConfiguracaoGraficosPaginaInicialOrdensCompra(configuracoes, idGrafico, ordemDesejada) {
  return reposicionarConfiguracaoGraficosPaginaInicial(
    configuracoes,
    idGrafico,
    ordemDesejada,
    graficosPaginaInicialOrdensCompra
  );
}

export function reposicionarConfiguracaoGraficosPaginaInicialAtendimentos(configuracoes, idGrafico, ordemDesejada) {
  return reposicionarConfiguracaoGraficosPaginaInicial(
    configuracoes,
    idGrafico,
    ordemDesejada,
    graficosPaginaInicialAtendimentos
  );
}

function normalizarConfiguracoesGraficosPaginaInicial(valor, definicoes, idsPermitidos, mapaDefinicoes) {
  const listaNormalizada = normalizarListaConfiguracoes(valor);
  const configuracoesPorId = new Map();

  listaNormalizada.forEach((item, indice) => {
    const id = String(item?.id || '').trim();

    if (!idsPermitidos.has(id)) {
      return;
    }

    const graficoBase = mapaDefinicoes.get(id);
    const configuracaoExistente = configuracoesPorId.get(id);
    const baseConfiguracao = normalizarBaseConfiguracao(item?.base);

    configuracoesPorId.set(id, {
      id,
      base: item?.base === undefined ? (configuracaoExistente?.base ?? baseConfiguracao) : baseConfiguracao,
      rotulo: item?.rotulo === undefined
        ? (configuracaoExistente?.rotulo ?? normalizarRotuloGrafico(item?.rotulo, graficoBase?.rotulo))
        : normalizarRotuloGrafico(item.rotulo, graficoBase?.rotulo),
      visivel: item?.visivel === undefined
        ? (configuracaoExistente?.visivel ?? Boolean(graficoBase?.visivelPadrao))
        : Boolean(item.visivel),
      ordem: item?.ordem === undefined
        ? (configuracaoExistente?.ordem ?? normalizarNumeroInteiro(item?.ordem, indice + 1))
        : normalizarNumeroInteiro(item.ordem, indice + 1),
      span: item?.span === undefined
        ? (configuracaoExistente?.span ?? normalizarSpan(item?.span, graficoBase?.spanPadrao || 5, baseConfiguracao))
        : normalizarSpan(item.span, graficoBase?.spanPadrao || 5, baseConfiguracao)
    });
  });

  const configuracoesNormalizadas = definicoes.map((grafico, indice) => {
    const configuracao = configuracoesPorId.get(grafico.id);

    return {
      ...grafico,
      base: TOTAL_COLUNAS_GRAFICOS_PAGINA_INICIAL,
      rotuloPadrao: grafico.rotulo,
      rotulo: normalizarRotuloGrafico(configuracao?.rotulo, grafico.rotulo),
      visivel: configuracao?.visivel ?? grafico.visivelPadrao,
      ordem: configuracao?.visivel ?? grafico.visivelPadrao
        ? normalizarNumeroInteiro(configuracao?.ordem, grafico.ordemPadrao || (indice + 1))
        : null,
      span: normalizarSpan(
        configuracao?.span,
        grafico.spanPadrao || 5,
        normalizarBaseConfiguracao(configuracao?.base, TOTAL_COLUNAS_GRAFICOS_PAGINA_INICIAL)
      )
    };
  });

  return reordenarConfiguracoesGraficosPaginaInicial(configuracoesNormalizadas, definicoes);
}

function reordenarConfiguracoesGraficosPaginaInicial(configuracoes, definicoes) {
  const lista = Array.isArray(configuracoes)
    ? configuracoes.map((grafico) => ({ ...grafico }))
    : [];
  const visiveis = lista
    .filter((grafico) => grafico.visivel)
    .sort(ordenarConfiguracoesGraficosPaginaInicial)
    .map((grafico, indice) => ({
      ...grafico,
      ordem: indice + 1,
      visivel: true
    }));
  const ocultos = definicoes
    .map((definicao) => lista.find((grafico) => grafico.id === definicao.id))
    .filter(Boolean)
    .filter((grafico) => !grafico.visivel)
    .map((grafico) => ({
      ...grafico,
      ordem: null
    }));

  return [...visiveis, ...ocultos];
}

function reposicionarConfiguracaoGraficosPaginaInicial(configuracoes, idGrafico, ordemDesejada, definicoes) {
  const lista = Array.isArray(configuracoes) ? configuracoes.map((grafico) => ({ ...grafico })) : [];
  const graficoAlvo = lista.find((grafico) => grafico.id === idGrafico);

  if (!graficoAlvo) {
    return reordenarConfiguracoesGraficosPaginaInicial(lista, definicoes);
  }

  const visiveis = lista
    .filter((grafico) => grafico.visivel)
    .sort(ordenarConfiguracoesGraficosPaginaInicial)
    .filter((grafico) => grafico.id !== idGrafico);

  const indiceDestino = Math.min(
    Math.max(normalizarNumeroInteiro(ordemDesejada, 1) - 1, 0),
    visiveis.length
  );

  visiveis.splice(indiceDestino, 0, {
    ...graficoAlvo,
    visivel: true
  });

  const visiveisReindexados = visiveis.map((grafico, indice) => ({
    ...grafico,
    ordem: indice + 1
  }));

  return reordenarConfiguracoesGraficosPaginaInicial([
    ...visiveisReindexados,
    ...lista.filter((grafico) => !grafico.visivel)
  ], definicoes);
}

function ordenarConfiguracoesGraficosPaginaInicial(graficoA, graficoB) {
  const ordemA = graficoA?.ordem == null ? Number.MAX_SAFE_INTEGER : Number(graficoA.ordem || 0);
  const ordemB = graficoB?.ordem == null ? Number.MAX_SAFE_INTEGER : Number(graficoB.ordem || 0);

  if (ordemA !== ordemB) {
    return ordemA - ordemB;
  }

  return String(graficoA?.id || '').localeCompare(String(graficoB?.id || ''));
}

function normalizarListaConfiguracoes(valor) {
  if (Array.isArray(valor)) {
    return valor;
  }

  if (!valor) {
    return [];
  }

  try {
    const lista = JSON.parse(valor);
    return Array.isArray(lista) ? lista : [];
  } catch (_erro) {
    return [];
  }
}

function normalizarNumeroInteiro(valor, fallback = 1) {
  const numero = Number(valor);
  return Number.isInteger(numero) && numero > 0 ? numero : fallback;
}

function normalizarBaseConfiguracao(valor, fallback = TOTAL_COLUNAS_GRAFICOS_PAGINA_INICIAL) {
  const numero = Number(valor);

  if (numero === BASE_LEGADA_GRAFICOS_PAGINA_INICIAL || numero === TOTAL_COLUNAS_GRAFICOS_PAGINA_INICIAL) {
    return numero;
  }

  return fallback;
}

function normalizarSpan(valor, fallback = 5, baseConfiguracao = TOTAL_COLUNAS_GRAFICOS_PAGINA_INICIAL) {
  const numero = Number(valor);

  if (!Number.isFinite(numero) || numero <= 0) {
    return fallback;
  }

  if (baseConfiguracao === BASE_LEGADA_GRAFICOS_PAGINA_INICIAL) {
    return Math.max(
      1,
      Math.min(
        TOTAL_COLUNAS_GRAFICOS_PAGINA_INICIAL,
        Math.floor((numero / BASE_LEGADA_GRAFICOS_PAGINA_INICIAL) * TOTAL_COLUNAS_GRAFICOS_PAGINA_INICIAL)
      )
    );
  }

  return Math.max(1, Math.min(TOTAL_COLUNAS_GRAFICOS_PAGINA_INICIAL, Math.floor(numero)));
}

function normalizarRotuloGrafico(valor, fallback = '') {
  const texto = String(valor || '').trim();
  return texto || fallback;
}
