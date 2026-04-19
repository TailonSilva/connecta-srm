let carregadorXlsx = null;

const configuracoesImportacao = {
  clientes: {
    tipo: 'clientes',
    titulo: 'Importacao de fornecedores',
    nomeArquivo: 'modelo-importacao-clientes.xlsx',
    nomePlanilhaDados: 'Clientes',
    nomePlanilhaInstrucoes: 'Instrucoes',
    colunas: [
      { chave: 'codigo', cabecalho: 'Codigo', obrigatorio: false, tipo: 'Numero inteiro', maximoCaracteres: 10, observacao: 'Opcional. Se vazio, o CRM usa o proximo codigo livre.', exemplo: '105' },
      { chave: 'codigoAlternativo', cabecalho: 'Codigo alternativo', obrigatorio: false, tipo: 'Numero inteiro', maximoCaracteres: 10, observacao: 'Opcional. Usado quando a empresa escolher o codigo alternativo como principal.', exemplo: '9001' },
      { chave: 'razaoSocial', cabecalho: 'Razao social', obrigatorio: true, tipo: 'Texto', maximoCaracteres: 255, observacao: 'Nome juridico ou nome completo.', exemplo: 'Empresa Exemplo LTDA' },
      { chave: 'nomeFantasia', cabecalho: 'Nome fantasia', obrigatorio: true, tipo: 'Texto', maximoCaracteres: 255, observacao: 'Nome comercial exibido na operacao.', exemplo: 'Empresa Exemplo' },
      { chave: 'tipo', cabecalho: 'Tipo', obrigatorio: true, tipo: 'Texto', maximoCaracteres: 20, observacao: 'Aceita apenas Pessoa juridica ou Pessoa fisica.', exemplo: 'Pessoa juridica' },
      { chave: 'cnpj', cabecalho: 'CNPJ/CPF', obrigatorio: true, tipo: 'Texto numerico', maximoCaracteres: 18, observacao: 'Pode ser enviado com ou sem mascara.', exemplo: '12.345.678/0001-90' },
      { chave: 'inscricaoEstadual', cabecalho: 'Inscricao estadual', obrigatorio: false, tipo: 'Texto', maximoCaracteres: 20, observacao: 'Opcional.', exemplo: '123456789' },
      { chave: 'email', cabecalho: 'Email', obrigatorio: false, tipo: 'Texto', maximoCaracteres: 150, observacao: 'Opcional.', exemplo: 'contato@empresaexemplo.com.br' },
      { chave: 'telefone', cabecalho: 'Telefone', obrigatorio: false, tipo: 'Texto numerico', maximoCaracteres: 20, observacao: 'Pode ser enviado com ou sem mascara.', exemplo: '(11) 99999-9999' },
      { chave: 'vendedor', cabecalho: 'Comprador', obrigatorio: true, tipo: 'Texto', maximoCaracteres: 150, observacao: 'Use o nome exato de um comprador ativo. Para Usuario padrao, se vazio, usa o comprador vinculado ao usuario.', exemplo: 'Tailon Silva' },
      { chave: 'ramoAtividade', cabecalho: 'Ramo de atividade', obrigatorio: true, tipo: 'Texto', maximoCaracteres: 150, observacao: 'Use a descricao exata de um ramo ativo.', exemplo: 'Comercio varejista' },
      { chave: 'grupoEmpresa', cabecalho: 'Grupo de empresa', obrigatorio: false, tipo: 'Texto', maximoCaracteres: 150, observacao: 'Opcional. Use a descricao exata de um grupo ativo.', exemplo: 'Grupo Exemplo' },
      { chave: 'logradouro', cabecalho: 'Logradouro', obrigatorio: false, tipo: 'Texto', maximoCaracteres: 255, observacao: 'Opcional.', exemplo: 'Rua das Flores' },
      { chave: 'numero', cabecalho: 'Numero', obrigatorio: false, tipo: 'Texto', maximoCaracteres: 10, observacao: 'Opcional.', exemplo: '120' },
      { chave: 'complemento', cabecalho: 'Complemento', obrigatorio: false, tipo: 'Texto', maximoCaracteres: 100, observacao: 'Opcional.', exemplo: 'Sala 4' },
      { chave: 'bairro', cabecalho: 'Bairro', obrigatorio: false, tipo: 'Texto', maximoCaracteres: 100, observacao: 'Opcional.', exemplo: 'Centro' },
      { chave: 'cidade', cabecalho: 'Cidade', obrigatorio: false, tipo: 'Texto', maximoCaracteres: 100, observacao: 'Opcional.', exemplo: 'Sao Paulo' },
      { chave: 'estado', cabecalho: 'Estado', obrigatorio: false, tipo: 'Texto', maximoCaracteres: 2, observacao: 'Use a sigla da UF com 2 letras.', exemplo: 'SP' },
      { chave: 'cep', cabecalho: 'CEP', obrigatorio: false, tipo: 'Texto numerico', maximoCaracteres: 10, observacao: 'Pode ser enviado com ou sem mascara.', exemplo: '01001-000' },
      { chave: 'observacao', cabecalho: 'Observacao', obrigatorio: false, tipo: 'Texto', maximoCaracteres: 'Livre', observacao: 'Opcional.', exemplo: 'Fornecedor importado da base antiga' },
      { chave: 'status', cabecalho: 'Status', obrigatorio: false, tipo: 'Texto', maximoCaracteres: 8, observacao: 'Aceita Ativo ou Inativo. Se vazio, assume Ativo.', exemplo: 'Ativo' }
    ]
  },
  produtos: {
    tipo: 'produtos',
    titulo: 'Importacao de produtos',
    nomeArquivo: 'modelo-importacao-produtos.xlsx',
    nomePlanilhaDados: 'Produtos',
    nomePlanilhaInstrucoes: 'Instrucoes',
    colunas: [
      { chave: 'codigo', cabecalho: 'Codigo', obrigatorio: false, tipo: 'Numero inteiro', maximoCaracteres: 10, observacao: 'Opcional. Se vazio, o CRM usa o proximo codigo livre.', exemplo: '250' },
      { chave: 'referencia', cabecalho: 'Referencia', obrigatorio: true, tipo: 'Texto', maximoCaracteres: 100, observacao: 'Identificador comercial do produto.', exemplo: 'CAM-001' },
      { chave: 'descricao', cabecalho: 'Descricao', obrigatorio: true, tipo: 'Texto', maximoCaracteres: 255, observacao: 'Descricao principal exibida no CRM.', exemplo: 'Camiseta algodao premium' },
      { chave: 'grupoProduto', cabecalho: 'Grupo de produto', obrigatorio: true, tipo: 'Texto', maximoCaracteres: 150, observacao: 'Use a descricao exata de um grupo ativo.', exemplo: 'Camisetas' },
      { chave: 'marca', cabecalho: 'Marca', obrigatorio: true, tipo: 'Texto', maximoCaracteres: 150, observacao: 'Use a descricao exata de uma marca ativa.', exemplo: 'Marca Exemplo' },
      { chave: 'unidadeMedida', cabecalho: 'Unidade de medida', obrigatorio: true, tipo: 'Texto', maximoCaracteres: 50, observacao: 'Use a descricao exata de uma unidade ativa.', exemplo: 'UN' },
      { chave: 'preco', cabecalho: 'Preco', obrigatorio: true, tipo: 'Numero decimal', maximoCaracteres: 10, observacao: 'Pode usar virgula ou ponto como separador decimal.', exemplo: '79,90' },
      { chave: 'status', cabecalho: 'Status', obrigatorio: false, tipo: 'Texto', maximoCaracteres: 8, observacao: 'Aceita Ativo ou Inativo. Se vazio, assume Ativo.', exemplo: 'Ativo' }
    ]
  }
};

export function obterConfiguracaoImportacaoCadastro(tipo) {
  return configuracoesImportacao[tipo] || null;
}

export async function baixarModeloImportacao(tipo) {
  const configuracao = obterConfiguracaoImportacaoCadastro(tipo);

  if (!configuracao) {
    throw new Error('Tipo de importacao nao suportado.');
  }

  const XLSX = await carregarXlsx();

  const workbook = XLSX.utils.book_new();
  const cabecalhos = configuracao.colunas.map((coluna) => coluna.cabecalho);
  const exemplo = configuracao.colunas.map((coluna) => coluna.exemplo || '');
  const planilhaDados = XLSX.utils.aoa_to_sheet([cabecalhos, exemplo]);
  const planilhaInstrucoes = XLSX.utils.json_to_sheet(
    configuracao.colunas.map((coluna) => ({
      Campo: coluna.cabecalho,
      Obrigatorio: coluna.obrigatorio ? 'Sim' : 'Nao',
      Tipo: coluna.tipo,
      'Maximo de caracteres': coluna.maximoCaracteres,
      Observacao: coluna.observacao,
      Exemplo: coluna.exemplo || ''
    })),
    { header: ['Campo', 'Obrigatorio', 'Tipo', 'Maximo de caracteres', 'Observacao', 'Exemplo'] }
  );

  XLSX.utils.book_append_sheet(workbook, planilhaDados, configuracao.nomePlanilhaDados);
  XLSX.utils.book_append_sheet(workbook, planilhaInstrucoes, configuracao.nomePlanilhaInstrucoes);
  XLSX.writeFile(workbook, configuracao.nomeArquivo);
}

export async function lerArquivoImportacao(tipo, arquivo) {
  const configuracao = obterConfiguracaoImportacaoCadastro(tipo);

  if (!configuracao) {
    throw new Error('Tipo de importacao nao suportado.');
  }

  if (!arquivo) {
    throw new Error('Selecione uma planilha para importar.');
  }

  const buffer = await arquivo.arrayBuffer();
  const XLSX = await carregarXlsx();
  const workbook = XLSX.read(buffer, { type: 'array' });
  const nomePlanilha = workbook.SheetNames[0];

  if (!nomePlanilha) {
    throw new Error('A planilha selecionada nao possui abas validas.');
  }

  const planilha = workbook.Sheets[nomePlanilha];
  const linhasBrutas = XLSX.utils.sheet_to_json(planilha, {
    defval: '',
    raw: false
  });

  const cabecalhosEsperados = configuracao.colunas.map((coluna) => coluna.cabecalho);
  const cabecalhosEncontrados = Object.keys(linhasBrutas[0] || {});
  const cabecalhosAusentes = cabecalhosEsperados.filter((cabecalho) => !cabecalhosEncontrados.includes(cabecalho));

  if (cabecalhosAusentes.length > 0) {
    throw new Error(`Cabecalhos ausentes na planilha: ${cabecalhosAusentes.join(', ')}.`);
  }

  const linhas = linhasBrutas
    .map((linha, indice) => normalizarLinhaPlanilha(configuracao, linha, indice))
    .filter((linha) => linha.temConteudo);

  if (linhas.length === 0) {
    throw new Error('A planilha nao possui linhas preenchidas para importar.');
  }

  return linhas;
}

function normalizarLinhaPlanilha(configuracao, linha, indice) {
  const dados = {};

  configuracao.colunas.forEach((coluna) => {
    dados[coluna.chave] = String(linha[coluna.cabecalho] ?? '').trim();
  });

  const temConteudo = Object.values(dados).some(Boolean);

  return {
    linha: indice + 2,
    ...dados,
    temConteudo
  };
}

async function carregarXlsx() {
  if (!carregadorXlsx) {
    carregadorXlsx = import('xlsx');
  }

  const modulo = await carregadorXlsx;
  return modulo.default?.utils ? modulo.default : modulo;
}