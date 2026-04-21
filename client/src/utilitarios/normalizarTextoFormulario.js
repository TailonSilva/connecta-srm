const CAMPOS_MAIUSCULOS = new Set(['estado']);
const CAMPOS_MINUSCULOS = new Set(['email', 'usuario']);
const CAMPOS_SEM_CAPITALIZACAO = new Set([
  'cnpj',
  'cep',
  'telefone',
  'whatsapp',
  'preco',
  'valorUnitario',
  'valorTotal',
  'quantidade',
  'referencia',
  'inscricaoEstadual',
  'numero',
  'urlRepositorio'
]);
const PREFIXOS_SEM_CAPITALIZACAO = ['prazo'];
const TIPOS_SEM_NORMALIZACAO = new Set([
  'password',
  'number',
  'date',
  'time',
  'datetime-local',
  'month',
  'week',
  'color',
  'url',
  'hidden',
  'file',
  'range'
]);

export function normalizarValorEntradaFormulario(entrada = {}) {
  const origem = entrada?.target || entrada;
  const name = String(origem?.name || '');
  const type = String(origem?.type || 'text').toLowerCase();
  const tagName = String(origem?.tagName || 'INPUT').toUpperCase();
  const value = typeof origem?.value === 'string' ? origem.value : String(origem?.value ?? '');

  if (tagName !== 'INPUT') {
    return value;
  }

  if (CAMPOS_MAIUSCULOS.has(name)) {
    return value.toUpperCase().slice(0, 2);
  }

  if (CAMPOS_MINUSCULOS.has(name) || type === 'email') {
    return value.toLowerCase();
  }

  if (TIPOS_SEM_NORMALIZACAO.has(type) || campoSemCapitalizacao(name)) {
    return value;
  }

  return normalizarTextoCapitalizado(value);
}

export function normalizarTextoCapitalizado(valor) {
  return String(valor || '')
    .toLocaleLowerCase('pt-BR')
    .replace(/(^|[\s\-\/([{'"\\]+)(\p{L})/gu, (match, prefixo, letra) => `${prefixo}${letra.toLocaleUpperCase('pt-BR')}`);
}

function campoSemCapitalizacao(name) {
  return CAMPOS_SEM_CAPITALIZACAO.has(name)
    || PREFIXOS_SEM_CAPITALIZACAO.some((prefixo) => name.startsWith(prefixo));
}