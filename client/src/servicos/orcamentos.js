import { requisitarApi } from './api';

export function listarOrcamentos() {
  return requisitarApi('/orcamentos');
}

export function consultarOrcamento(idOrcamento) {
  return requisitarApi(`/orcamentos/${idOrcamento}`);
}

export function incluirOrcamento(payload) {
  return requisitarApi('/orcamentos', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(payload)
  });
}

export function atualizarOrcamento(idOrcamento, payload) {
  return requisitarApi(`/orcamentos/${idOrcamento}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(payload)
  });
}

export function excluirOrcamento(idOrcamento) {
  return requisitarApi(`/orcamentos/${idOrcamento}`, {
    method: 'DELETE'
  });
}
