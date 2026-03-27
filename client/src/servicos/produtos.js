import { requisitarApi } from './api';

export function listarProdutos() {
  return requisitarApi('/produtos');
}

export function listarGruposProduto() {
  return requisitarApi('/gruposProduto');
}

export function listarMarcas() {
  return requisitarApi('/marcas');
}

export function listarUnidadesMedida() {
  return requisitarApi('/unidadesMedida');
}
