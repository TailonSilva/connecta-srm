import { useEffect, useRef, useState } from 'react';

// Este prefixo padroniza as chaves no `localStorage` e evita colisao com outras informacoes persistidas do sistema.
const PREFIXO_STORAGE_FILTROS = 'crm.filtros';

// Esta funcao centraliza a obtencao do `localStorage` e protege cenarios em que `window` nao existe ou o acesso falha.
function obterStorageLocal() {
  if (typeof window === 'undefined') {
    return null;
  }

  try {
    return window.localStorage;
  } catch (_erro) {
    return null;
  }
}

// Esta copia superficial evita reutilizar a mesma referencia dos filtros padrao ao combinar estados.
function copiarValor(valor) {
  if (Array.isArray(valor)) {
    return [...valor];
  }

  if (valor && typeof valor === 'object') {
    return { ...valor };
  }

  return valor;
}

// A chave inclui o usuario para que cada pessoa tenha seu proprio conjunto de filtros persistidos.
function montarChaveStorage(chave, usuario) {
  const idUsuario = usuario?.idUsuario ? String(usuario.idUsuario) : 'anonimo';
  return `${PREFIXO_STORAGE_FILTROS}.${chave}.usuario.${idUsuario}`;
}

// Esta funcao garante que o estado carregado sempre tenha todas as chaves esperadas pelo filtro padrao.
function combinarComPadrao(filtros, filtrosPadrao) {
  return Object.keys(filtrosPadrao || {}).reduce((resultado, chaveAtual) => {
    // `hasOwnProperty` diferencia ausencia de chave de um valor valido falsy persistido.
    const possuiValorPersistido = filtros && Object.prototype.hasOwnProperty.call(filtros, chaveAtual);
    const valorAlias = possuiValorPersistido ? undefined : obterValorAliasPersistido(filtros, chaveAtual);

    resultado[chaveAtual] = possuiValorPersistido
      ? filtros[chaveAtual]
      : valorAlias !== undefined
        ? valorAlias
      : copiarValor(filtrosPadrao[chaveAtual]);

    return resultado;
  }, {});
}

function obterValorAliasPersistido(filtros, chaveAtual) {
  if (!filtros || typeof filtros !== 'object') {
    return undefined;
  }

  const aliases = {
    idFornecedor: ['idCliente'],
    idComprador: ['idVendedor'],
    idCompradorFornecedor: ['idVendedorFornecedor', 'idVendedorCliente'],
    idVendedorFornecedor: ['idCompradorFornecedor', 'idVendedorCliente'],
    idEtapaCotacao: ['idEtapaOrcamento'],
    idsEtapaCotacao: ['idsEtapaOrcamento'],
    idsEtapaOrcamento: ['idsEtapaCotacao'],
    idCotacao: ['idOrcamento'],
    idOrdemCompra: ['idPedido'],
    idEtapaOrdemCompra: ['idEtapaPedido'],
    idsEtapaOrdemCompra: ['idsEtapaPedido'],
    idEtapaPedido: ['idEtapaOrdemCompra']
  };

  for (const alias of aliases[chaveAtual] || []) {
    if (Object.prototype.hasOwnProperty.call(filtros, alias)) {
      return filtros[alias];
    }
  }

  return undefined;
}

// Esta etapa aplica a combinacao com o padrao e, se houver, uma normalizacao customizada do modulo consumidor.
function normalizarEstado(filtros, filtrosPadrao, normalizarFiltros) {
  const filtrosBase = combinarComPadrao(filtros, filtrosPadrao);

  if (typeof normalizarFiltros !== 'function') {
    return filtrosBase;
  }

  return normalizarFiltros(filtrosBase, filtrosPadrao);
}

// Esta funcao concentra a leitura do `localStorage` e a recuperacao segura quando o JSON estiver invalido.
function carregarFiltros(chaveStorage, filtrosPadrao, normalizarFiltros) {
  const storage = obterStorageLocal();

  if (!storage) {
    return normalizarEstado(filtrosPadrao, filtrosPadrao, normalizarFiltros);
  }

  const valorPersistido = storage.getItem(chaveStorage);

  if (!valorPersistido) {
    return normalizarEstado(filtrosPadrao, filtrosPadrao, normalizarFiltros);
  }

  try {
    return normalizarEstado(JSON.parse(valorPersistido), filtrosPadrao, normalizarFiltros);
  } catch (_erro) {
    storage.removeItem(chaveStorage);
    return normalizarEstado(filtrosPadrao, filtrosPadrao, normalizarFiltros);
  }
}

// Esta funcao escreve o estado atual no `localStorage` quando a persistencia estiver disponivel.
function salvarFiltros(chaveStorage, filtros) {
  const storage = obterStorageLocal();

  if (!storage) {
    return;
  }

  storage.setItem(chaveStorage, JSON.stringify(filtros));
}

// Esta normalizacao transforma qualquer valor simples persistido em string tratada para uso uniforme nos filtros.
export function normalizarValorFiltroPersistido(valor) {
  if (valor === null || valor === undefined) {
    return '';
  }

  return String(valor).trim();
}

// Esta normalizacao garante que filtros de multipla escolha virem sempre um array de strings validas.
export function normalizarListaFiltroPersistido(valores) {
  const listaValores = Array.isArray(valores)
    ? valores
    : valores === null || valores === undefined || valores === ''
      ? []
      : [valores];

  return listaValores
    .map((valor) => normalizarValorFiltroPersistido(valor))
    .filter(Boolean);
}

// Esta funcao usa o formato do filtro padrao para decidir se cada chave deve ser tratada como valor simples ou lista.
export function normalizarFiltrosPorPadrao(filtros, filtrosPadrao) {
  return Object.keys(filtrosPadrao || {}).reduce((resultado, chaveAtual) => {
    resultado[chaveAtual] = Array.isArray(filtrosPadrao[chaveAtual])
      ? normalizarListaFiltroPersistido(filtros?.[chaveAtual])
      : normalizarValorFiltroPersistido(filtros?.[chaveAtual]);

    return resultado;
  }, {});
}

// Este hook persiste filtros por usuario e por tela sem espalhar leitura e escrita de `localStorage` pelas paginas.
// O retorno no formato `[estado, setter]` replica a ergonomia do `useState`, o que facilita adocao nas telas.
export function useFiltrosPersistidos({
  chave,
  usuario,
  filtrosPadrao,
  normalizarFiltros
}) {
  // Guardamos a funcao em um `ref` para acessar a versao mais recente sem transformar todo efeito em dependente de referencia de funcao.
  const normalizarFiltrosRef = useRef(normalizarFiltros);
  // Este `ref` impede que a recarga inicial de filtros seja imediatamente gravada de volta como se fosse uma edicao do usuario.
  const ignorarPersistenciaRef = useRef(false);
  // A chave final depende da tela e do usuario, permitindo isolamento de contexto.
  const chaveStorage = montarChaveStorage(chave, usuario);
  // Serializamos o padrao para detectar mudancas estruturais mesmo quando o objeto vier com nova referencia.
  const assinaturaPadrao = JSON.stringify(filtrosPadrao);

  // Atualizamos o `ref` a cada render para manter a normalizacao sincronizada com a versao mais recente recebida via props.
  normalizarFiltrosRef.current = normalizarFiltros;

  // O inicializador lazy evita reler o `localStorage` em toda renderizacao do componente consumidor.
  const [filtros, definirEstadoFiltros] = useState(() => (
    carregarFiltros(chaveStorage, filtrosPadrao, normalizarFiltrosRef.current)
  ));

  // Este efeito recarrega os filtros quando muda o usuario, a chave logica da tela ou o formato do padrao.
  useEffect(() => {
    ignorarPersistenciaRef.current = true;
    definirEstadoFiltros(carregarFiltros(chaveStorage, filtrosPadrao, normalizarFiltrosRef.current));
  }, [chaveStorage, assinaturaPadrao]);

  // Este efeito persiste no `localStorage` sempre que o estado efetivo dos filtros muda.
  useEffect(() => {
    // A primeira atualizacao apos um recarregamento interno nao deve sobrescrever o valor recem-lido.
    if (ignorarPersistenciaRef.current) {
      ignorarPersistenciaRef.current = false;
      return;
    }

    salvarFiltros(
      chaveStorage,
      normalizarEstado(filtros, filtrosPadrao, normalizarFiltrosRef.current)
    );
  }, [chaveStorage, assinaturaPadrao, filtros, filtrosPadrao]);

  // Este setter aceita valor direto ou funcao, igual ao `useState`, para nao mudar a ergonomia de quem consome o hook.
  function definirFiltros(valorOuFuncao) {
    definirEstadoFiltros((estadoAtual) => {
      const proximoEstado = typeof valorOuFuncao === 'function'
        ? valorOuFuncao(estadoAtual)
        : valorOuFuncao;

      // Normalizamos antes de gravar no estado para garantir consistencia na interface e na persistencia.
      return normalizarEstado(proximoEstado, filtrosPadrao, normalizarFiltrosRef.current);
    });
  }

  // O retorno espelha `useState` de proposito para a troca ser transparente nas paginas.
  return [filtros, definirFiltros];
}
