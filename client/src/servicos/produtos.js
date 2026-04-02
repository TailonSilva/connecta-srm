import { requisitarApi } from './api';
import { requisitarListaApi } from './listas';

export function listarProdutos() {
  return requisitarApi('/produtos');
}

export function incluirProduto(payload) {
  return requisitarApi('/produtos', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(payload)
  });
}

export function atualizarProduto(idProduto, payload) {
  return requisitarApi(`/produtos/${idProduto}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(payload)
  });
}

export function listarGruposProduto(opcoes) {
  return requisitarListaApi('/gruposProduto', opcoes);
}

export function listarMarcas(opcoes) {
  return requisitarListaApi('/marcas', opcoes);
}

export function listarUnidadesMedida(opcoes) {
  return requisitarListaApi('/unidadesMedida', opcoes);
}
