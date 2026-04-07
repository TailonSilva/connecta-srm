export function normalizarPreco(valor) {
  const texto = String(valor ?? '').replace(/[^\d,.-]/g, '');

  if (!texto) {
    return '';
  }

  const numero = converterPrecoParaNumero(texto);

  if (numero === null) {
    return texto;
  }

  return numero.toLocaleString('pt-BR', {
    style: 'currency',
    currency: 'BRL',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  });
}

export function normalizarPrecoDigitado(valor) {
  const textoOriginal = String(valor ?? '').trim();
  const negativo = textoOriginal.includes('-');
  const texto = textoOriginal.replace(/[^\d,]/g, '');

  if (!texto) {
    return negativo ? '-' : '';
  }

  const partes = texto.split(',');
  const parteInteira = partes[0].replace(/^0+(?=\d)/, '') || '0';
  const parteDecimal = partes.slice(1).join('').slice(0, 2);
  const terminaComVirgula = texto.endsWith(',');

  if (terminaComVirgula) {
    return `${negativo ? '-' : ''}${parteInteira},`;
  }

  return `${negativo ? '-' : ''}${parteDecimal ? `${parteInteira},${parteDecimal}` : parteInteira}`;
}

export function desformatarPreco(valor) {
  const numero = converterPrecoParaNumero(valor);

  if (numero === null) {
    return '';
  }

  return numero.toLocaleString('pt-BR', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  });
}

export function converterPrecoParaNumero(valor) {
  const texto = String(valor ?? '').trim();

  if (!texto) {
    return null;
  }

  const textoSemMoeda = texto.replace(/[^\d,.-]/g, '');
  const negativo = textoSemMoeda.startsWith('-');
  const ultimaVirgula = textoSemMoeda.lastIndexOf(',');
  const ultimoPonto = textoSemMoeda.lastIndexOf('.');
  const separadorDecimal = Math.max(ultimaVirgula, ultimoPonto);

  let parteInteira = textoSemMoeda;
  let parteDecimal = '';

  if (separadorDecimal >= 0) {
    parteInteira = textoSemMoeda.slice(0, separadorDecimal);
    parteDecimal = textoSemMoeda.slice(separadorDecimal + 1);
  }

  const inteiroNormalizado = parteInteira.replace(/\D/g, '') || '0';
  const decimalNormalizado = parteDecimal.replace(/\D/g, '').slice(0, 2);
  const numeroBase = decimalNormalizado
    ? `${inteiroNormalizado}.${decimalNormalizado}`
    : inteiroNormalizado;
  const numeroTexto = negativo ? `-${numeroBase}` : numeroBase;

  const numero = Number(numeroTexto);

  return Number.isNaN(numero) ? null : numero;
}
