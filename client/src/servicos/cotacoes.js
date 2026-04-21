import { requisitarApi } from './api';
import { montarParametrosConsulta } from '../utilitarios/montarParametrosConsulta';

export function listarCotacoes(parametros) {
  return requisitarApi(`/cotacoes${montarParametrosConsulta(parametros)}`);
}

export function consultarCotacao(idCotacao) {
  return requisitarApi(`/cotacoes/${idCotacao}`);
}

export function incluirCotacao(payload) {
  return requisitarApi('/cotacoes', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(payload)
  });
}

export function atualizarCotacao(idCotacao, payload) {
  return requisitarApi(`/cotacoes/${idCotacao}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(payload)
  });
}

export function excluirCotacao(idCotacao) {
  return requisitarApi(`/cotacoes/${idCotacao}`, {
    method: 'DELETE'
  });
}
