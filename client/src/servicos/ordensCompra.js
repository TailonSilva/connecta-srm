import { requisitarApi } from './api';
import { montarParametrosConsulta } from '../utilitarios/montarParametrosConsulta';

export function listarOrdensCompra(parametros) {
  return requisitarApi(`/ordensCompra${montarParametrosConsulta(parametros)}`);
}

export function consultarOrdemCompra(idOrdemCompra) {
  return requisitarApi(`/ordensCompra/${idOrdemCompra}`);
}

export function incluirOrdemCompra(payload) {
  return requisitarApi('/ordensCompra', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(payload)
  });
}

export function atualizarOrdemCompra(idOrdemCompra, payload) {
  return requisitarApi(`/ordensCompra/${idOrdemCompra}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(payload)
  });
}

export function excluirOrdemCompra(idOrdemCompra) {
  return requisitarApi(`/ordensCompra/${idOrdemCompra}`, {
    method: 'DELETE'
  });
}
