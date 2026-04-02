import { requisitarApi } from './api';
import { requisitarListaApi } from './listas';
import { buscarCep } from './clientes';

export function listarEmpresas(opcoes) {
  return requisitarListaApi('/empresas', opcoes);
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

export { buscarCep };
