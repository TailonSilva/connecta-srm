import { requisitarApi } from './api';
import { requisitarListaApi } from './listas';

export function listarClientes() {
  return requisitarApi('/clientes');
}

export function listarContatos() {
  return requisitarApi('/contatos');
}

export function listarVendedores(opcoes) {
  return requisitarListaApi('/vendedores', opcoes);
}

export function listarRamosAtividade(opcoes) {
  return requisitarListaApi('/ramosAtividade', opcoes);
}

export function incluirRamoAtividade(payload) {
  return requisitarApi('/ramosAtividade', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(payload)
  });
}

export function atualizarRamoAtividade(idRamo, payload) {
  return requisitarApi(`/ramosAtividade/${idRamo}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(payload)
  });
}

export function incluirCliente(payload) {
  return requisitarApi('/clientes', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(payload)
  });
}

export function atualizarCliente(idCliente, payload) {
  return requisitarApi(`/clientes/${idCliente}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(payload)
  });
}

export function incluirContato(payload) {
  return requisitarApi('/contatos', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(payload)
  });
}

export function atualizarContato(idContato, payload) {
  return requisitarApi(`/contatos/${idContato}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(payload)
  });
}

export async function buscarCep(cep) {
  const cepNormalizado = String(cep || '').replace(/\D/g, '');

  if (cepNormalizado.length !== 8) {
    throw new Error('Informe um CEP com 8 digitos.');
  }

  const resposta = await fetch(`https://viacep.com.br/ws/${cepNormalizado}/json/`);
  const dados = await resposta.json();

  if (!resposta.ok || dados.erro) {
    throw new Error('CEP nao encontrado.');
  }

  return dados;
}

export async function buscarCnpj(cnpj) {
  const cnpjNormalizado = String(cnpj || '').replace(/\D/g, '');

  if (cnpjNormalizado.length !== 14) {
    throw new Error('Informe um CNPJ com 14 digitos.');
  }

  const resposta = await fetch(`https://brasilapi.com.br/api/cnpj/v1/${cnpjNormalizado}`);
  const dados = await resposta.json();

  if (!resposta.ok) {
    throw new Error(dados.message || 'CNPJ nao encontrado.');
  }

  return dados;
}
