import { requisitarApi } from './api';

function possuiCampo(registro, campo) {
  return Object.prototype.hasOwnProperty.call(registro, campo);
}

export function registroEstaAtivo(registro, campoAtivo) {
  if (!registro || typeof registro !== 'object') {
    return true;
  }

  if (campoAtivo && possuiCampo(registro, campoAtivo)) {
    return Boolean(registro[campoAtivo]);
  }

  if (possuiCampo(registro, 'ativo')) {
    return Boolean(registro.ativo);
  }

  if (possuiCampo(registro, 'status')) {
    return Boolean(registro.status);
  }

  return true;
}

export function filtrarRegistrosAtivos(registros, { incluirInativos = false, campoAtivo } = {}) {
  if (incluirInativos || !Array.isArray(registros)) {
    return registros;
  }

  return registros.filter((registro) => registroEstaAtivo(registro, campoAtivo));
}

export async function requisitarListaApi(caminho, opcoes = {}) {
  const { configuracao, ...opcoesFiltro } = opcoes;
  const registros = await requisitarApi(caminho, configuracao);

  return filtrarRegistrosAtivos(registros, opcoesFiltro);
}