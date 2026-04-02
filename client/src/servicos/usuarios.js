import { requisitarApi } from './api';
import { requisitarListaApi } from './listas';

export function listarUsuarios(opcoes) {
  return requisitarListaApi('/usuarios', {
    campoAtivo: 'ativo',
    ...opcoes
  });
}

export function incluirUsuario(payload) {
  return requisitarApi('/usuarios', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(payload)
  });
}

export function atualizarUsuario(idUsuario, payload) {
  return requisitarApi(`/usuarios/${idUsuario}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(payload)
  });
}
