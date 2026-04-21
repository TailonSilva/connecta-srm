export function normalizarCodigoFornecedorNumerico(valor) {
  return String(valor ?? '').replace(/\D/g, '').trim();
}

export function usarCodigoAlternativoFornecedor(empresa) {
  return String(empresa?.codigoPrincipalFornecedor || '').trim() === 'codigoAlternativo';
}

export function obterCodigoPrincipalFornecedor(fornecedor, empresa) {
  const codigoAlternativo = normalizarCodigoFornecedorNumerico(fornecedor?.codigoAlternativo);

  if (usarCodigoAlternativoFornecedor(empresa) && codigoAlternativo) {
    return codigoAlternativo;
  }

  return normalizarCodigoFornecedorNumerico(fornecedor?.idFornecedor);
}

export function formatarCodigoFornecedor(fornecedor, empresa) {
  const codigo = obterCodigoPrincipalFornecedor(fornecedor, empresa);
  return `#${String(codigo || 0).padStart(4, '0')}`;
}