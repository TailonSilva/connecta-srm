import { requisitarApi } from './api';

export function listarClientes() {
  return requisitarApi('/clientes');
}

export function listarContatos() {
  return requisitarApi('/contatos');
}

export function listarVendedores() {
  return requisitarApi('/vendedores');
}
