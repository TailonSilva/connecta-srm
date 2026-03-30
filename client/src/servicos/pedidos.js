import { requisitarApi } from './api';

export function listarPedidos() {
  return requisitarApi('/pedidos');
}

export function consultarPedido(idPedido) {
  return requisitarApi(`/pedidos/${idPedido}`);
}

export function incluirPedido(payload) {
  return requisitarApi('/pedidos', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(payload)
  });
}

export function atualizarPedido(idPedido, payload) {
  return requisitarApi(`/pedidos/${idPedido}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(payload)
  });
}

export function excluirPedido(idPedido) {
  return requisitarApi(`/pedidos/${idPedido}`, {
    method: 'DELETE'
  });
}
