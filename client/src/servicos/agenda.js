import { requisitarApi } from './api';
import { requisitarListaApi } from './listas';

export function listarAgendamentos() {
  return requisitarApi('/agendamentos');
}

export function incluirAgendamento(payload) {
  return requisitarApi('/agendamentos', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(payload)
  });
}

export function atualizarAgendamento(idAgendamento, payload) {
  return requisitarApi(`/agendamentos/${idAgendamento}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(payload)
  });
}

export function atualizarStatusAgendamentoUsuario(idAgendamento, payload) {
  return requisitarApi(`/agendamentos/${idAgendamento}/status-usuario`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(payload)
  });
}

export function excluirAgendamento(idAgendamento) {
  return requisitarApi(`/agendamentos/${idAgendamento}`, {
    method: 'DELETE'
  });
}

export function listarLocaisAgenda(opcoes) {
  return requisitarListaApi('/locaisAgenda', opcoes);
}

export function listarRecursosAgenda(opcoes) {
  return requisitarListaApi('/recursos', opcoes);
}

export function listarTiposRecurso(opcoes) {
  return requisitarListaApi('/tiposRecurso', opcoes);
}

export function listarTiposAgenda(opcoes) {
  return requisitarListaApi('/tiposAgenda', opcoes);
}

export function listarStatusVisita(opcoes) {
  return requisitarListaApi('/statusVisita', opcoes);
}
