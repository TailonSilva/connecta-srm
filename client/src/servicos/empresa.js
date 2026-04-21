import { requisitarApi } from './api';
import { requisitarListaApi } from './listas';
import { buscarCep } from './fornecedores';
import { normalizarConfiguracoesColunasGridFornecedores } from '../dados/colunasGridFornecedores';
import { normalizarConfiguracoesColunasGridCotacoes } from '../dados/colunasGridCotacoes';
import { normalizarConfiguracoesColunasGridProdutos } from '../dados/colunasGridProdutos';
import { normalizarConfiguracoesColunasGridOrdensCompra } from '../dados/colunasGridOrdensCompra';
import { normalizarConfiguracoesColunasGridAtendimentos } from '../dados/colunasGridAtendimentos';
import {
  normalizarConfiguracoesGraficosPaginaInicialCotacoes,
  normalizarConfiguracoesGraficosPaginaInicialOrdensCompra,
  normalizarConfiguracoesGraficosPaginaInicialAtendimentos
} from '../dados/graficosPaginaInicial';
import { normalizarConfiguracoesCardsPaginaInicial } from '../dados/cardsPaginaInicial';

export async function listarEmpresas(opcoes) {
  const empresas = await requisitarListaApi('/empresas', opcoes);

  return Array.isArray(empresas)
    ? empresas.map((empresa) => normalizarEmpresa(empresa))
    : [];
}

export function incluirEmpresa(payload) {
  return requisitarApi('/empresas', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(payload)
  });
}

export function atualizarEmpresa(idEmpresa, payload) {
  return requisitarApi(`/empresas/${idEmpresa}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(payload)
  });
}

export function criarPayloadAtualizacaoColunasGrid(chave, colunas) {
  const normalizadores = {
    colunasGridFornecedores: normalizarConfiguracoesColunasGridFornecedores,
    colunasGridCotacoes: normalizarConfiguracoesColunasGridCotacoes,
    colunasGridProdutos: normalizarConfiguracoesColunasGridProdutos,
    colunasGridOrdensCompra: normalizarConfiguracoesColunasGridOrdensCompra,
    colunasGridAtendimentos: normalizarConfiguracoesColunasGridAtendimentos,
    graficosPaginaInicialCotacoes: normalizarConfiguracoesGraficosPaginaInicialCotacoes,
    graficosPaginaInicialOrdensCompra: normalizarConfiguracoesGraficosPaginaInicialOrdensCompra,
    graficosPaginaInicialAtendimentos: normalizarConfiguracoesGraficosPaginaInicialAtendimentos,
    cardsPaginaInicial: normalizarConfiguracoesCardsPaginaInicial
  };

  const normalizar = normalizadores[chave];

  if (!normalizar) {
    throw new Error('Configuracao de grid invalida.');
  }

  return {
    [chave]: JSON.stringify(
      normalizar(colunas).map((coluna) => ({
        id: coluna.id,
        visivel: coluna.visivel !== false,
        ordem: coluna.ordem,
        span: coluna.span,
        rotulo: coluna.rotulo,
        base: coluna.base
      }))
    )
  };
}

export { buscarCep };

function normalizarEmpresa(empresa) {
  if (!empresa) {
    return empresa;
  }

  return {
    ...empresa,
    colunasGridFornecedores: normalizarConfiguracoesColunasGridFornecedores(empresa.colunasGridFornecedores),
    colunasGridCotacoes: normalizarConfiguracoesColunasGridCotacoes(empresa.colunasGridCotacoes),
    colunasGridProdutos: normalizarConfiguracoesColunasGridProdutos(empresa.colunasGridProdutos),
    colunasGridOrdensCompra: normalizarConfiguracoesColunasGridOrdensCompra(empresa.colunasGridOrdensCompra),
    colunasGridAtendimentos: normalizarConfiguracoesColunasGridAtendimentos(empresa.colunasGridAtendimentos),
    graficosPaginaInicialCotacoes: normalizarConfiguracoesGraficosPaginaInicialCotacoes(empresa.graficosPaginaInicialCotacoes),
    graficosPaginaInicialOrdensCompra: normalizarConfiguracoesGraficosPaginaInicialOrdensCompra(empresa.graficosPaginaInicialOrdensCompra),
    graficosPaginaInicialAtendimentos: normalizarConfiguracoesGraficosPaginaInicialAtendimentos(empresa.graficosPaginaInicialAtendimentos),
    cardsPaginaInicial: normalizarConfiguracoesCardsPaginaInicial(empresa.cardsPaginaInicial),
    imagem: adicionarCacheBusterImagem(empresa.imagem)
  };
}

function adicionarCacheBusterImagem(valorImagem) {
  if (typeof valorImagem !== 'string') {
    return '';
  }

  const imagem = valorImagem.trim();

  if (!imagem || !/^https?:\/\//i.test(imagem)) {
    return imagem;
  }

  try {
    const url = new URL(imagem);
    url.searchParams.set('v', Date.now().toString());
    return url.toString();
  } catch (_erro) {
    return imagem;
  }
}
