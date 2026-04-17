const express = require('express');
const { consultarTodos } = require('../configuracoes/banco');
const { entidades } = require('../configuracoes/entidades');
const { inserirRegistro } = require('../repositorios/crudRepositorio');

const rotaImportacaoCadastros = express.Router();
const entidadeCliente = entidades.find((entidade) => entidade.nome === 'cliente');
const entidadeProduto = entidades.find((entidade) => entidade.nome === 'produto');

rotaImportacaoCadastros.post('/clientes', async (requisicao, resposta) => {
  const linhas = Array.isArray(requisicao.body?.linhas) ? requisicao.body.linhas : [];
  const idVendedorPadrao = requisicao.body?.idVendedorPadrao ? Number(requisicao.body.idVendedorPadrao) : null;

  if (linhas.length === 0) {
    resposta.status(400).json({ mensagem: 'Informe ao menos uma linha para importar.' });
    return;
  }

  try {
    const resultado = await importarClientes(linhas, { idVendedorPadrao });
    resposta.json(resultado);
  } catch (erro) {
    resposta.status(500).json({ mensagem: erro.message || 'Nao foi possivel importar os clientes.' });
  }
});

rotaImportacaoCadastros.post('/produtos', async (requisicao, resposta) => {
  const linhas = Array.isArray(requisicao.body?.linhas) ? requisicao.body.linhas : [];

  if (linhas.length === 0) {
    resposta.status(400).json({ mensagem: 'Informe ao menos uma linha para importar.' });
    return;
  }

  try {
    const resultado = await importarProdutos(linhas);
    resposta.json(resultado);
  } catch (erro) {
    resposta.status(500).json({ mensagem: erro.message || 'Nao foi possivel importar os produtos.' });
  }
});

async function importarClientes(linhas, opcoes = {}) {
  const [clientesExistentes, vendedores, ramos, grupos] = await Promise.all([
    consultarTodos('SELECT idCliente, cnpj, codigoAlternativo FROM cliente'),
    consultarTodos('SELECT idVendedor, nome, status FROM vendedor'),
    consultarTodos('SELECT idRamo, descricao, status FROM ramoAtividade'),
    consultarTodos('SELECT idGrupoEmpresa, descricao, status FROM grupoEmpresa')
  ]);

  const idsOcupados = new Set(clientesExistentes.map((item) => Number(item.idCliente)).filter(Number.isFinite));
  const cnpjsExistentes = new Set(clientesExistentes.map((item) => normalizarDocumento(item.cnpj)).filter(Boolean));
  const codigosAlternativosExistentes = new Set(clientesExistentes.map((item) => normalizarInteiroTexto(item.codigoAlternativo)).filter(Boolean));
  const vendedoresPorNome = criarIndiceReferencias(vendedores, 'nome', 'idVendedor');
  const ramosPorDescricao = criarIndiceReferencias(ramos, 'descricao', 'idRamo');
  const gruposPorDescricao = criarIndiceReferencias(grupos, 'descricao', 'idGrupoEmpresa');
  const rejeitados = [];
  let importados = 0;

  for (const linha of linhas) {
    const erros = [];
    const pendenciasReferencias = [];
    const identificador = linha.nomeFantasia || linha.razaoSocial || linha.cnpj || `Linha ${linha.linha}`;
    const cnpjNormalizado = normalizarDocumento(linha.cnpj);
    const tipoNormalizado = normalizarTipoPessoa(linha.tipo);
    const statusNormalizado = normalizarStatusTexto(linha.status);
    const codigoAlternativo = validarInteiroImportado(linha.codigoAlternativo, 'Codigo alternativo', erros);
    const codigo = validarInteiroImportado(linha.codigo, 'Codigo', erros);
    const referenciaVendedor = opcoes.idVendedorPadrao
      ? { situacao: 'ativo', id: Number(opcoes.idVendedorPadrao), valorInformado: '' }
      : resolverReferencia(vendedoresPorNome, linha.vendedor);
    const referenciaRamo = resolverReferencia(ramosPorDescricao, linha.ramoAtividade);
    const referenciaGrupo = resolverReferencia(gruposPorDescricao, linha.grupoEmpresa);
    const idVendedor = referenciaVendedor.id;
    const idRamo = referenciaRamo.id;
    const idGrupoEmpresa = referenciaGrupo.id;

    validarObrigatorioTexto(linha.razaoSocial, 'Razao social', erros);
    validarObrigatorioTexto(linha.nomeFantasia, 'Nome fantasia', erros);
    validarObrigatorioTexto(linha.tipo, 'Tipo', erros);
    validarObrigatorioTexto(linha.cnpj, 'CNPJ/CPF', erros);
    validarReferenciaObrigatoria(referenciaVendedor, 'vendedor', 'Vendedor', 'Use o nome exato de um vendedor ativo.', erros, pendenciasReferencias);
    validarReferenciaObrigatoria(referenciaRamo, 'ramoAtividade', 'Ramo de atividade', 'Use a descricao exata de um ramo ativo.', erros, pendenciasReferencias);
    validarReferenciaOpcional(referenciaGrupo, 'grupoEmpresa', 'Grupo de empresa', 'Use a descricao exata de um grupo ativo.', erros, pendenciasReferencias);
    validarTamanho(linha.razaoSocial, 255, 'Razao social', erros);
    validarTamanho(linha.nomeFantasia, 255, 'Nome fantasia', erros);
    validarTamanho(linha.tipo, 20, 'Tipo', erros);
    validarTamanho(linha.cnpj, 18, 'CNPJ/CPF', erros);
    validarTamanho(linha.inscricaoEstadual, 20, 'Inscricao estadual', erros);
    validarTamanho(linha.email, 150, 'Email', erros);
    validarTamanho(linha.telefone, 20, 'Telefone', erros);
    validarTamanho(linha.logradouro, 255, 'Logradouro', erros);
    validarTamanho(linha.numero, 10, 'Numero', erros);
    validarTamanho(linha.complemento, 100, 'Complemento', erros);
    validarTamanho(linha.bairro, 100, 'Bairro', erros);
    validarTamanho(linha.cidade, 100, 'Cidade', erros);
    validarTamanho(linha.cep, 10, 'CEP', erros);
    const documentoValido = validarDocumentoImportado(linha.cnpj, tipoNormalizado, erros);
    validarEstadoImportado(linha.estado, erros);
    validarCepImportado(linha.cep, erros);
    validarEmailImportado(linha.email, erros);
    validarStatusImportado(statusNormalizado, 'Status', erros);

    if (!tipoNormalizado) {
      erros.push('Tipo deve ser Pessoa juridica ou Pessoa fisica.');
    }

    if (documentoValido && cnpjNormalizado && cnpjsExistentes.has(cnpjNormalizado)) {
      erros.push('Ja existe cliente cadastrado com este CNPJ/CPF.');
    }

    if (codigoAlternativo && codigosAlternativosExistentes.has(codigoAlternativo)) {
      erros.push('Ja existe cliente cadastrado com este Codigo alternativo.');
    }

    if (codigo && idsOcupados.has(Number(codigo))) {
      erros.push('O Codigo informado ja esta em uso.');
    }

    if (erros.length > 0) {
      rejeitados.push({
        linha: linha.linha,
        identificador,
        motivos: erros,
        pendenciasReferencias,
        dados: serializarLinhaImportacao(linha)
      });
      continue;
    }

    const idCliente = codigo ? Number(codigo) : obterProximoCodigoDisponivel(idsOcupados);
    const payload = {
      idCliente,
      idVendedor: Number(idVendedor),
      idConceito: 1,
      idRamo: Number(idRamo),
      idGrupoEmpresa: idGrupoEmpresa ? Number(idGrupoEmpresa) : null,
      codigoAlternativo: codigoAlternativo ? Number(codigoAlternativo) : null,
      razaoSocial: String(linha.razaoSocial || '').trim(),
      nomeFantasia: String(linha.nomeFantasia || '').trim(),
      tipo: tipoNormalizado,
      cnpj: formatarDocumentoImportado(linha.cnpj, tipoNormalizado),
      inscricaoEstadual: limparTextoOpcional(linha.inscricaoEstadual),
      status: statusNormalizado,
      email: limparTextoOpcional(linha.email),
      telefone: limparTextoOpcional(linha.telefone),
      logradouro: limparTextoOpcional(linha.logradouro),
      numero: limparTextoOpcional(linha.numero),
      complemento: limparTextoOpcional(linha.complemento),
      bairro: limparTextoOpcional(linha.bairro),
      cidade: limparTextoOpcional(linha.cidade),
      estado: limparTextoOpcional(linha.estado)?.toUpperCase(),
      cep: limparTextoOpcional(linha.cep),
      observacao: limparTextoOpcional(linha.observacao),
      imagem: null
    };

    try {
      await inserirRegistro(entidadeCliente, payload);
      importados += 1;
      idsOcupados.add(idCliente);
      cnpjsExistentes.add(cnpjNormalizado);
      if (codigoAlternativo) {
        codigosAlternativosExistentes.add(codigoAlternativo);
      }
    } catch (erro) {
      rejeitados.push({
        linha: linha.linha,
        identificador,
        motivos: [erro.message || 'Falha ao inserir cliente.'],
        pendenciasReferencias,
        dados: serializarLinhaImportacao(linha)
      });
    }
  }

  return {
    totalRecebido: linhas.length,
    importados,
    rejeitados
  };
}

async function importarProdutos(linhas) {
  const [produtosExistentes, grupos, marcas, unidades] = await Promise.all([
    consultarTodos('SELECT idProduto, referencia FROM produto'),
    consultarTodos('SELECT idGrupo, descricao, status FROM grupoProduto'),
    consultarTodos('SELECT idMarca, descricao, status FROM marca'),
    consultarTodos('SELECT idUnidade, descricao, status FROM unidadeMedida')
  ]);

  const idsOcupados = new Set(produtosExistentes.map((item) => Number(item.idProduto)).filter(Number.isFinite));
  const referenciasExistentes = new Set(produtosExistentes.map((item) => normalizarChave(item.referencia)).filter(Boolean));
  const gruposPorDescricao = criarIndiceReferencias(grupos, 'descricao', 'idGrupo');
  const marcasPorDescricao = criarIndiceReferencias(marcas, 'descricao', 'idMarca');
  const unidadesPorDescricao = criarIndiceReferencias(unidades, 'descricao', 'idUnidade');
  const rejeitados = [];
  let importados = 0;

  for (const linha of linhas) {
    const erros = [];
    const pendenciasReferencias = [];
    const identificador = linha.referencia || linha.descricao || `Linha ${linha.linha}`;
    const referencia = String(linha.referencia || '').trim();
    const codigo = validarInteiroImportado(linha.codigo, 'Codigo', erros);
    const referenciaGrupo = resolverReferencia(gruposPorDescricao, linha.grupoProduto);
    const referenciaMarca = resolverReferencia(marcasPorDescricao, linha.marca);
    const referenciaUnidade = resolverReferencia(unidadesPorDescricao, linha.unidadeMedida);
    const idGrupo = referenciaGrupo.id;
    const idMarca = referenciaMarca.id;
    const idUnidade = referenciaUnidade.id;
    const preco = normalizarDecimal(linha.preco);
    const statusNormalizado = normalizarStatusTexto(linha.status);

    validarObrigatorioTexto(linha.referencia, 'Referencia', erros);
    validarObrigatorioTexto(linha.descricao, 'Descricao', erros);
    validarReferenciaObrigatoria(referenciaGrupo, 'grupoProduto', 'Grupo de produto', 'Use a descricao exata de um grupo ativo.', erros, pendenciasReferencias);
    validarReferenciaObrigatoria(referenciaMarca, 'marca', 'Marca', 'Use a descricao exata de uma marca ativa.', erros, pendenciasReferencias);
    validarReferenciaObrigatoria(referenciaUnidade, 'unidadeMedida', 'Unidade de medida', 'Use a descricao exata de uma unidade ativa.', erros, pendenciasReferencias);
    validarObrigatorioTexto(linha.preco, 'Preco', erros);
    validarTamanho(linha.referencia, 100, 'Referencia', erros);
    validarTamanho(linha.descricao, 255, 'Descricao', erros);
    validarStatusImportado(statusNormalizado, 'Status', erros);

    if (referencia && referenciasExistentes.has(normalizarChave(referencia))) {
      erros.push('Ja existe produto cadastrado com esta Referencia.');
    }

    if (codigo && idsOcupados.has(Number(codigo))) {
      erros.push('O Codigo informado ja esta em uso.');
    }

    if (preco === null || Number.isNaN(preco)) {
      erros.push('Preco invalido. Informe um numero decimal valido.');
    } else if (preco < 0) {
      erros.push('Preco nao pode ser negativo.');
    }

    if (erros.length > 0) {
      rejeitados.push({
        linha: linha.linha,
        identificador,
        motivos: erros,
        pendenciasReferencias,
        dados: serializarLinhaImportacao(linha)
      });
      continue;
    }

    const idProduto = codigo ? Number(codigo) : obterProximoCodigoDisponivel(idsOcupados);
    const payload = {
      idProduto,
      referencia,
      descricao: String(linha.descricao || '').trim(),
      idGrupo: Number(idGrupo),
      idMarca: Number(idMarca),
      idUnidade: Number(idUnidade),
      preco,
      status: statusNormalizado,
      imagem: null
    };

    try {
      await inserirRegistro(entidadeProduto, payload);
      importados += 1;
      idsOcupados.add(idProduto);
      referenciasExistentes.add(normalizarChave(referencia));
    } catch (erro) {
      rejeitados.push({
        linha: linha.linha,
        identificador,
        motivos: [erro.message || 'Falha ao inserir produto.'],
        pendenciasReferencias,
        dados: serializarLinhaImportacao(linha)
      });
    }
  }

  return {
    totalRecebido: linhas.length,
    importados,
    rejeitados
  };
}

function criarIndiceReferencias(registros, campoTexto, campoId) {
  return new Map(
    (registros || [])
      .map((registro) => [
        normalizarChave(registro[campoTexto]),
        {
          id: registro[campoId],
          ativo: Number(registro.status ?? 1) !== 0
        }
      ])
      .filter(([chave]) => chave)
  );
}

function obterProximoCodigoDisponivel(idsOcupados) {
  let codigo = 1;

  while (idsOcupados.has(codigo)) {
    codigo += 1;
  }

  return codigo;
}

function validarObrigatorioTexto(valor, campo, erros) {
  if (!String(valor || '').trim()) {
    erros.push(`${campo} e obrigatorio.`);
  }
}

function validarReferenciaObrigatoria(referencia, campo, rotulo, detalhe, erros, pendenciasReferencias = []) {
  if (!referencia || referencia.situacao === 'vazio') {
    erros.push(`${rotulo} e obrigatorio.`);
    return;
  }

  if (referencia.situacao === 'inativo') {
    erros.push(`${rotulo} "${referencia.valorInformado}" esta com status inativo. ${detalhe}`);
    pendenciasReferencias.push(criarPendenciaReferencia(campo, rotulo, referencia, true));
    return;
  }

  if (referencia.situacao === 'ausente') {
    erros.push(`${rotulo} "${referencia.valorInformado}" nao foi encontrado. ${detalhe}`);
    pendenciasReferencias.push(criarPendenciaReferencia(campo, rotulo, referencia, true));
  }
}

function validarReferenciaOpcional(referencia, campo, rotulo, detalhe, erros, pendenciasReferencias = []) {
  if (!referencia || referencia.situacao === 'vazio' || referencia.situacao === 'ativo') {
    return;
  }

  if (referencia.situacao === 'inativo') {
    erros.push(`${rotulo} "${referencia.valorInformado}" esta com status inativo. ${detalhe}`);
    pendenciasReferencias.push(criarPendenciaReferencia(campo, rotulo, referencia, false));
    return;
  }

  if (referencia.situacao === 'ausente') {
    erros.push(`${rotulo} "${referencia.valorInformado}" nao foi encontrado. ${detalhe}`);
    pendenciasReferencias.push(criarPendenciaReferencia(campo, rotulo, referencia, false));
  }
}

function validarTamanho(valor, maximo, campo, erros) {
  const texto = String(valor || '').trim();

  if (texto && texto.length > maximo) {
    erros.push(`${campo} excede o limite de ${maximo} caracteres.`);
  }
}

function limparTextoOpcional(valor) {
  const texto = String(valor || '').trim();
  return texto || null;
}

function resolverReferencia(indice, valor) {
  const valorInformado = String(valor || '').trim();
  const chave = normalizarChave(valorInformado);

  if (!chave) {
    return { situacao: 'vazio', id: null, valorInformado: '' };
  }

  const registro = indice.get(chave);

  if (!registro) {
    return { situacao: 'ausente', id: null, valorInformado };
  }

  if (!registro.ativo) {
    return { situacao: 'inativo', id: null, valorInformado };
  }

  return { situacao: 'ativo', id: registro.id, valorInformado };
}

function normalizarChave(valor) {
  return String(valor || '').trim().toLowerCase();
}

function normalizarInteiroTexto(valor) {
  const texto = String(valor ?? '').replace(/\D/g, '').trim();
  return texto || '';
}

function normalizarDocumento(valor) {
  return String(valor || '').replace(/\D/g, '').trim();
}

function normalizarStatusTexto(valor) {
  const texto = normalizarChave(valor);

  if (!texto) {
    return 1;
  }

  if (['0', 'inativo', 'false', 'nao'].includes(texto)) {
    return 0;
  }

  if (['1', 'ativo', 'true', 'sim'].includes(texto)) {
    return 1;
  }

  return null;
}

function normalizarTipoPessoa(valor) {
  const texto = normalizarChave(valor);

  if (['pessoa juridica', 'juridica', 'pj', 'juridico'].includes(texto)) {
    return 'Pessoa juridica';
  }

  if (['pessoa fisica', 'fisica', 'pf', 'fisico'].includes(texto)) {
    return 'Pessoa fisica';
  }

  return '';
}

function formatarDocumentoImportado(valor, tipo) {
  const digitos = normalizarDocumento(valor);

  if (tipo === 'Pessoa fisica') {
    return digitos
      .replace(/^(\d{3})(\d)/, '$1.$2')
      .replace(/^(\d{3})\.(\d{3})(\d)/, '$1.$2.$3')
      .replace(/\.(\d{3})(\d)/, '.$1-$2');
  }

  return digitos
    .replace(/^(\d{2})(\d)/, '$1.$2')
    .replace(/^(\d{2})\.(\d{3})(\d)/, '$1.$2.$3')
    .replace(/\.(\d{3})(\d)/, '.$1/$2')
    .replace(/(\d{4})(\d)/, '$1-$2');
}

function normalizarDecimal(valor) {
  const texto = String(valor ?? '').trim();

  if (!texto) {
    return null;
  }

  const normalizado = texto
    .replace(/\s/g, '')
    .replace(/\.(?=\d{3}(?:\D|$))/g, '')
    .replace(',', '.');
  const numero = Number(normalizado);

  return Number.isNaN(numero) ? null : numero;
}

function validarInteiroImportado(valor, campo, erros) {
  const texto = String(valor ?? '').trim();

  if (!texto) {
    return '';
  }

  if (!/^\d+$/.test(texto)) {
    erros.push(`${campo} deve conter apenas numeros inteiros.`);
    return '';
  }

  return texto;
}

function validarDocumentoImportado(valor, tipo, erros) {
  const digitos = normalizarDocumento(valor);

  if (!digitos || !tipo) {
    return false;
  }

  if (tipo === 'Pessoa juridica' && digitos.length !== 14) {
    erros.push('CNPJ/CPF invalido para Pessoa juridica. Informe um CNPJ com 14 digitos.');
    return false;
  }

  if (tipo === 'Pessoa fisica' && digitos.length !== 11) {
    erros.push('CNPJ/CPF invalido para Pessoa fisica. Informe um CPF com 11 digitos.');
    return false;
  }

  return true;
}

function validarEstadoImportado(valor, erros) {
  const texto = String(valor || '').trim();

  if (!texto) {
    return;
  }

  if (!/^[A-Za-z]{2}$/.test(texto)) {
    erros.push('Estado invalido. Informe a UF com 2 letras.');
  }
}

function validarCepImportado(valor, erros) {
  const texto = String(valor || '').trim();

  if (!texto) {
    return;
  }

  const digitos = normalizarDocumento(texto);

  if (digitos.length !== 8) {
    erros.push('CEP invalido. Informe um CEP com 8 digitos.');
  }
}

function validarEmailImportado(valor, erros) {
  const texto = String(valor || '').trim();

  if (!texto) {
    return;
  }

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(texto)) {
    erros.push('Email invalido. Informe um endereco de email valido.');
  }
}

function validarStatusImportado(valor, campo, erros) {
  if (valor === null) {
    erros.push(`${campo} invalido. Use Ativo ou Inativo.`);
  }
}

function criarPendenciaReferencia(campo, rotulo, referencia, obrigatorio) {
  return {
    campo,
    rotulo,
    valorInformado: referencia?.valorInformado || '',
    situacao: referencia?.situacao || 'ausente',
    obrigatorio: Boolean(obrigatorio)
  };
}

function serializarLinhaImportacao(linha) {
  return Object.entries(linha || {}).reduce((acumulador, [chave, valor]) => {
    if (chave === 'temConteudo') {
      return acumulador;
    }

    acumulador[chave] = typeof valor === 'string' ? valor : String(valor ?? '');
    return acumulador;
  }, {});
}

module.exports = {
  rotaImportacaoCadastros
};
