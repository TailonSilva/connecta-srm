const express = require('express');
const { consultarTodos, consultarUm, executar } = require('../configuracoes/banco');
const {
  ehCaminhoImagemLocal,
  ehDataUrlImagem,
  removerArquivoImagem,
  salvarImagemItemCotacao
} = require('../utilitarios/imagens');
const { montarUrlArquivo, obterBaseUrlApi } = require('../utilitarios/urlApi');
const { validarReferenciasAtivasDaEntidade } = require('../utilitarios/validarReferenciasAtivas');
const {
  adicionarFiltroBusca,
  adicionarFiltroIgual,
  adicionarFiltroLista,
  adicionarFiltroPeriodo,
  montarWhere
} = require('../utilitarios/filtrosSql');
const {
  normalizarEntradaFornecedor,
  normalizarSaidaFornecedor,
  normalizarListaSaidaFornecedor
} = require('../utilitarios/compatibilidadeFornecedor');

const rotaCotacoes = express.Router();
const IDS_ETAPAS_COTACAO_FECHADAS = new Set([1, 2, 3, 4]);

rotaCotacoes.get('/', async (requisicao, resposta) => {
  try {
    const clausulas = [];
    const parametros = [];
    const query = normalizarEntradaFornecedor(requisicao.query);

    adicionarFiltroBusca(clausulas, parametros, query.search, [
      'COALESCE(fornecedor.nomeFantasia, fornecedor.razaoSocial)',
      'contato.nome',
      'usuario.nome',
      'compradorFornecedor.nome',
      'compradorCotacao.nome',
      'prazoPagamento.descricao',
      'metodoPagamento.descricao',
      'etapaCotacao.descricao',
      'cotacao.observacao',
      'CAST(cotacao.idCotacao AS TEXT)'
    ]);
    adicionarFiltroIgual(clausulas, parametros, 'cotacao.idFornecedor', query.idFornecedor, Number);
    adicionarFiltroLista(clausulas, parametros, 'cotacao.idUsuario', query.idUsuario, Number);
    adicionarFiltroLista(clausulas, parametros, 'fornecedor.idComprador', query.idCompradorFornecedor, Number);
    adicionarFiltroLista(clausulas, parametros, 'cotacao.idComprador', query.idComprador, Number);
    adicionarFiltroLista(clausulas, parametros, 'cotacao.idEtapaCotacao', query.idsEtapaCotacao, Number);
    adicionarFiltroPeriodo(clausulas, parametros, 'cotacao.dataInclusao', query.dataInclusaoInicio, query.dataInclusaoFim);
    adicionarFiltroPeriodo(clausulas, parametros, 'cotacao.dataFechamento', query.dataFechamentoInicio, query.dataFechamentoFim);

    if (query.escopoIdComprador) {
      clausulas.push('cotacao.idComprador = ?');
      parametros.push(Number(query.escopoIdComprador));
    }

    const registros = await consultarTodos(`
      SELECT
        cotacao.idCotacao
      FROM cotacao
      LEFT JOIN fornecedor ON fornecedor.idFornecedor = cotacao.idFornecedor
      LEFT JOIN contato ON contato.idContato = cotacao.idContato
      LEFT JOIN usuario ON usuario.idUsuario = cotacao.idUsuario
      LEFT JOIN comprador AS compradorFornecedor ON compradorFornecedor.idComprador = fornecedor.idComprador
      LEFT JOIN comprador AS compradorCotacao ON compradorCotacao.idComprador = cotacao.idComprador
      LEFT JOIN prazoPagamento ON prazoPagamento.idPrazoPagamento = cotacao.idPrazoPagamento
      LEFT JOIN metodoPagamento ON metodoPagamento.idMetodoPagamento = prazoPagamento.idMetodoPagamento
      LEFT JOIN etapaCotacao ON etapaCotacao.idEtapaCotacao = cotacao.idEtapaCotacao
      ${montarWhere(clausulas)}
      ORDER BY cotacao.idCotacao DESC
    `, parametros);

    const registrosCompletos = await Promise.all(
      registros.map((registro) => consultarCotacaoCompleto(registro.idCotacao))
    );

    resposta.json(normalizarListaSaidaFornecedor(registrosCompletos.filter(Boolean)));
  } catch (_erro) {
    resposta.status(500).json({ mensagem: 'Ocorreu um erro ao processar a requisicao.' });
  }
});

rotaCotacoes.get('/:id', async (requisicao, resposta) => {
  try {
    const registro = await consultarCotacaoCompleto(Number(requisicao.params.id));

    if (!registro) {
      resposta.status(404).json({ mensagem: 'Registro nao encontrado.' });
      return;
    }

    resposta.json(normalizarSaidaFornecedor(registro));
  } catch (_erro) {
    resposta.status(500).json({ mensagem: 'Ocorreu um erro ao processar a requisicao.' });
  }
});

rotaCotacoes.post('/', async (requisicao, resposta) => {
  try {
    const payload = aplicarAutomacoesFechamentoCotacao(normalizarPayloadCotacao(normalizarEntradaFornecedor(requisicao.body)));
    await validarReferenciasAtivasDaEntidade('cotacao', payload);
    const etapaCotacao = await obterEtapaCotacao(payload.idEtapaCotacao);
    const fornecedor = await obterFornecedor(payload.idFornecedor);
    const mensagemValidacao = validarPayloadCotacao(payload, etapaCotacao);

    if (mensagemValidacao) {
      resposta.status(400).json({ mensagem: mensagemValidacao });
      return;
    }

    await executar('BEGIN TRANSACTION');

    const resultado = await executar(
      `INSERT INTO cotacao (
        idFornecedor,
        idContato,
        idUsuario,
        idComprador,
        idPrazoPagamento,
        idEtapaCotacao,
        dataInclusao,
        dataValidade,
        dataFechamento,
        observacao
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        payload.idFornecedor,
        payload.idContato,
        payload.idUsuario,
        payload.idComprador,
        payload.idPrazoPagamento,
        payload.idEtapaCotacao,
        payload.dataInclusao,
        payload.dataValidade,
        payload.dataFechamento,
        payload.observacao
      ]
    );

    await salvarItensCotacao(resultado.id, payload.itens, fornecedor);
    await salvarCamposCotacao(resultado.id, payload.camposExtras);
    await executar('COMMIT');

    const registro = await consultarCotacaoCompleto(resultado.id);
    resposta.status(201).json(normalizarSaidaFornecedor(registro));
  } catch (_erro) {
    if (_erro.statusCode === 400) {
      resposta.status(400).json({ mensagem: _erro.message });
      return;
    }

    await tentarRollback();
    resposta.status(500).json({ mensagem: 'Nao foi possivel concluir a operacao por violacao de integridade dos dados.' });
  }
});

rotaCotacoes.put('/:id', async (requisicao, resposta) => {
  try {
    const idCotacao = Number(requisicao.params.id);
    const existente = await consultarUm('SELECT * FROM cotacao WHERE idCotacao = ?', [idCotacao]);

    if (!existente) {
      resposta.status(404).json({ mensagem: 'Registro nao encontrado.' });
      return;
    }

    const payload = aplicarAutomacoesFechamentoCotacao(normalizarPayloadCotacao({
      ...existente,
      ...normalizarEntradaFornecedor(requisicao.body)
    }), existente);
    await validarReferenciasAtivasDaEntidade('cotacao', payload);
    const etapaCotacao = await obterEtapaCotacao(payload.idEtapaCotacao);
    const fornecedor = await obterFornecedor(payload.idFornecedor);
    const itensAtuais = await consultarTodos('SELECT imagem FROM itemCotacao WHERE idCotacao = ?', [idCotacao]);
    const mensagemValidacao = validarPayloadCotacao(payload, etapaCotacao);

    if (mensagemValidacao) {
      resposta.status(400).json({ mensagem: mensagemValidacao });
      return;
    }

    if (cotacaoBloqueadoPorOrdemCompraVinculado(existente)) {
      resposta.status(400).json({ mensagem: 'Nao e possivel editar um cotacao com ordem de compra vinculada.' });
      return;
    }

    if (cotacaoEhRecusado(existente)) {
      resposta.status(400).json({ mensagem: 'Nao e possivel editar um cotacao recusado.' });
      return;
    }

    if (
      existente.idOrdemCompraVinculado &&
      String(existente.idEtapaCotacao || '') !== String(payload.idEtapaCotacao || '')
    ) {
      resposta.status(400).json({ mensagem: 'Nao e possivel alterar a etapa de um cotacao com ordem de compra vinculada.' });
      return;
    }

    await executar('BEGIN TRANSACTION');
    await executar(
      `UPDATE cotacao SET
        idFornecedor = ?,
        idContato = ?,
        idUsuario = ?,
        idComprador = ?,
        idPrazoPagamento = ?,
        idEtapaCotacao = ?,
        dataInclusao = ?,
        dataValidade = ?,
        dataFechamento = ?,
        observacao = ?
      WHERE idCotacao = ?`,
      [
        payload.idFornecedor,
        payload.idContato,
        payload.idUsuario,
        payload.idComprador,
        payload.idPrazoPagamento,
        payload.idEtapaCotacao,
        payload.dataInclusao,
        payload.dataValidade,
        payload.dataFechamento,
        payload.observacao,
        idCotacao
      ]
    );

    await executar('DELETE FROM itemCotacao WHERE idCotacao = ?', [idCotacao]);
    await executar('DELETE FROM valorCampoCotacao WHERE idCotacao = ?', [idCotacao]);
    await salvarItensCotacao(idCotacao, payload.itens, fornecedor);
    await salvarCamposCotacao(idCotacao, payload.camposExtras);
    await executar('COMMIT');

    removerImagensItensNaoUtilizadas(
      itensAtuais.map((item) => item.imagem),
      payload.itens.map((item) => item.imagem)
    );

    const registro = await consultarCotacaoCompleto(idCotacao);
    resposta.json(normalizarSaidaFornecedor(registro));
  } catch (_erro) {
    if (_erro.statusCode === 400) {
      resposta.status(400).json({ mensagem: _erro.message });
      return;
    }

    await tentarRollback();
    resposta.status(500).json({ mensagem: 'Nao foi possivel concluir a operacao por violacao de integridade dos dados.' });
  }
});

rotaCotacoes.delete('/:id', async (requisicao, resposta) => {
  try {
    const idCotacao = Number(requisicao.params.id);
    const existente = await consultarUm('SELECT * FROM cotacao WHERE idCotacao = ?', [idCotacao]);
    const itensAtuais = await consultarTodos('SELECT imagem FROM itemCotacao WHERE idCotacao = ?', [idCotacao]);

    if (!existente) {
      resposta.status(404).json({ mensagem: 'Registro nao encontrado.' });
      return;
    }

    if (existente.idOrdemCompraVinculado) {
      resposta.status(400).json({ mensagem: 'Nao e possivel excluir um cotacao com ordem de compra vinculada.' });
      return;
    }

    await executar('BEGIN TRANSACTION');
    await executar('DELETE FROM itemCotacao WHERE idCotacao = ?', [idCotacao]);
    await executar('DELETE FROM valorCampoCotacao WHERE idCotacao = ?', [idCotacao]);
    await executar('DELETE FROM cotacao WHERE idCotacao = ?', [idCotacao]);
    await executar('COMMIT');

    itensAtuais.forEach((item) => {
      if (ehImagemItemCotacaoLocal(item.imagem)) {
        removerArquivoImagem(item.imagem);
      }
    });

    resposta.status(204).send();
  } catch (_erro) {
    await tentarRollback();
    resposta.status(500).json({ mensagem: 'Ocorreu um erro ao processar a requisicao.' });
  }
});

async function consultarCotacaoCompleto(idCotacao) {
  const cotacao = await consultarUm(
    'SELECT * FROM cotacao WHERE idCotacao = ?',
    [idCotacao]
  );

  if (!cotacao) {
    return null;
  }

  const [itens, camposExtras] = await Promise.all([
    consultarTodos(
      `SELECT * FROM itemCotacao WHERE idCotacao = ? ORDER BY idItemCotacao ASC`,
      [idCotacao]
    ),
    consultarTodos(
      `SELECT * FROM valorCampoCotacao WHERE idCotacao = ? ORDER BY idValorCampoCotacao ASC`,
      [idCotacao]
    )
  ]);

  return {
    ...cotacao,
    itens: itens.map(normalizarItemImagem),
    camposExtras
  };
}

function normalizarPayloadCotacao(payload) {
  return {
    idFornecedor: payload.idFornecedor ? Number(payload.idFornecedor) : null,
    idContato: payload.idContato ? Number(payload.idContato) : null,
    idUsuario: payload.idUsuario ? Number(payload.idUsuario) : null,
    idComprador: payload.idComprador ? Number(payload.idComprador) : null,
    idPrazoPagamento: payload.idPrazoPagamento ? Number(payload.idPrazoPagamento) : null,
    idEtapaCotacao: payload.idEtapaCotacao ? Number(payload.idEtapaCotacao) : null,
    dataInclusao: limparTexto(payload.dataInclusao),
    dataValidade: limparTexto(payload.dataValidade),
    dataFechamento: limparTexto(payload.dataFechamento),
    observacao: limparTexto(payload.observacao),
    itens: normalizarItensCotacao(payload.itens),
    camposExtras: normalizarCamposExtras(payload.camposExtras)
  };
}

function aplicarAutomacoesFechamentoCotacao(payload, cotacaoAtual = null) {
  const proximoPayload = {
    ...payload
  };
  const entrouEmEtapaFechada = !etapaCotacaoEhFechada(cotacaoAtual?.idEtapaCotacao)
    && etapaCotacaoEhFechada(proximoPayload.idEtapaCotacao);

  if (entrouEmEtapaFechada && (!proximoPayload.dataFechamento || proximoPayload.dataFechamento === limparTexto(cotacaoAtual?.dataFechamento))) {
    proximoPayload.dataFechamento = obterDataAtualFormatoInput();
  }

  return proximoPayload;
}

function normalizarItensCotacao(itens) {
  if (!Array.isArray(itens)) {
    return [];
  }

  return itens
    .map((item) => ({
      idProduto: item.idProduto ? Number(item.idProduto) : null,
      quantidade: item.quantidade === '' || item.quantidade === null || item.quantidade === undefined
        ? null
        : Number(item.quantidade),
      valorUnitario: item.valorUnitario === '' || item.valorUnitario === null || item.valorUnitario === undefined
        ? null
        : Number(item.valorUnitario),
      valorTotal: item.valorTotal === '' || item.valorTotal === null || item.valorTotal === undefined
        ? null
        : Number(item.valorTotal),
      imagem: normalizarImagemItemPayload(item.imagem),
      observacao: limparTexto(item.observacao),
      referenciaProdutoSnapshot: limparTexto(item.referenciaProdutoSnapshot),
      descricaoProdutoSnapshot: limparTexto(item.descricaoProdutoSnapshot),
      unidadeProdutoSnapshot: limparTexto(item.unidadeProdutoSnapshot)
    }))
    .filter((item) => item.idProduto && item.quantidade && item.valorUnitario !== null);
}

function normalizarCamposExtras(camposExtras) {
  if (!Array.isArray(camposExtras)) {
    return [];
  }

  return camposExtras
    .map((campo) => ({
      idCampoCotacao: campo.idCampoCotacao ? Number(campo.idCampoCotacao) : null,
      valor: limparTexto(campo.valor)
    }))
    .filter((campo) => campo.idCampoCotacao);
}

function validarPayloadCotacao(payload, etapaCotacao) {
  if (!payload.idFornecedor) {
    return 'Selecione o fornecedor da cotacao.';
  }

  if (!payload.idUsuario) {
    return 'Selecione o usuario do registro.';
  }

  if (!payload.idComprador) {
    return 'Selecione o comprador.';
  }

  if (payload.itens.length === 0) {
    return 'Inclua ao menos um item na cotacao.';
  }

  if (etapaCotacaoEhFechada(payload.idEtapaCotacao) && !payload.dataFechamento) {
    return 'Informe a data de fechamento para cotacoes nas etapas Fechado, Fechado sem ordem de compra, Ordem de Compra Excluida ou Recusado.';
  }


  return '';
}

async function salvarItensCotacao(idCotacao, itens, fornecedor) {
  for (const item of itens) {
    const produto = await obterProduto(item.idProduto);
    const resultado = await executar(
      `INSERT INTO itemCotacao (
        idCotacao,
        idProduto,
        quantidade,
        valorUnitario,
        valorTotal,
        imagem,
        observacao,
        referenciaProdutoSnapshot,
        descricaoProdutoSnapshot,
        unidadeProdutoSnapshot
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        idCotacao,
        item.idProduto,
        item.quantidade,
        item.valorUnitario,
        item.valorTotal,
        ehDataUrlImagem(item.imagem) ? null : item.imagem,
        item.observacao,
        item.referenciaProdutoSnapshot || produto?.referencia || null,
        item.descricaoProdutoSnapshot || produto?.descricao || null,
        item.unidadeProdutoSnapshot || produto?.nomeUnidadeMedida || produto?.siglaUnidadeMedida || null
      ]
    );

    if (ehDataUrlImagem(item.imagem)) {
      const caminhoImagem = salvarImagemItemCotacao({
        idCotacao,
        nomeFornecedor: fornecedor?.nomeFantasia || fornecedor?.razaoSocial || `fornecedor-${fornecedor?.idFornecedor || ''}`,
        idItemCotacao: resultado.id,
        valorImagem: item.imagem
      });

      await executar(
        'UPDATE itemCotacao SET imagem = ? WHERE idItemCotacao = ?',
        [caminhoImagem, resultado.id]
      );
    }
  }
}

async function salvarCamposCotacao(idCotacao, camposExtras) {
  for (const campo of camposExtras) {
    await executar(
      `INSERT INTO valorCampoCotacao (
        idCotacao,
        idCampoCotacao,
        valor
      ) VALUES (?, ?, ?)`,
      [idCotacao, campo.idCampoCotacao, campo.valor]
    );
  }
}

async function obterEtapaCotacao(idEtapaCotacao) {
  if (!idEtapaCotacao) {
    return null;
  }

  return consultarUm(
    'SELECT * FROM etapaCotacao WHERE idEtapaCotacao = ?',
    [idEtapaCotacao]
  );
}

async function obterFornecedor(idFornecedor) {
  if (!idFornecedor) {
    return null;
  }

  return consultarUm('SELECT idFornecedor, nomeFantasia, razaoSocial FROM fornecedor WHERE idFornecedor = ?', [idFornecedor]);
}

async function obterProduto(idProduto) {
  if (!idProduto) {
    return null;
  }

  return consultarUm('SELECT * FROM produto WHERE idProduto = ?', [idProduto]);
}

function normalizarImagemItemPayload(valorImagem) {
  if (ehDataUrlImagem(valorImagem)) {
    return valorImagem;
  }

  return desnormalizarCaminhoImagem(valorImagem);
}

function normalizarItemImagem(item) {
  return {
    ...item,
    imagem: normalizarCaminhoImagem(item.imagem)
  };
}

function normalizarCaminhoImagem(valorImagem) {
  if (!ehCaminhoImagemLocal(valorImagem)) {
    return valorImagem || '';
  }

  return montarUrlArquivo(valorImagem);
}

function desnormalizarCaminhoImagem(valorImagem) {
  if (typeof valorImagem !== 'string') {
    return valorImagem || null;
  }

  const prefixoCompleto = `${obterBaseUrlApi()}/api/arquivos/`;
  const prefixoRelativo = '/api/arquivos/';

  if (valorImagem.startsWith(prefixoCompleto)) {
    return valorImagem.slice(prefixoCompleto.length);
  }

  if (valorImagem.startsWith(prefixoRelativo)) {
    return valorImagem.slice(prefixoRelativo.length);
  }

  return valorImagem || null;
}

function removerImagensItensNaoUtilizadas(imagensAtuais, imagensNovas) {
  const imagensMantidas = new Set(
    imagensNovas
      .filter((imagem) => ehImagemItemCotacaoLocal(desnormalizarCaminhoImagem(imagem)))
      .map((imagem) => desnormalizarCaminhoImagem(imagem))
  );

  imagensAtuais.forEach((imagem) => {
    if (ehImagemItemCotacaoLocal(imagem) && !imagensMantidas.has(imagem)) {
      removerArquivoImagem(imagem);
    }
  });
}

function ehImagemItemCotacaoLocal(valorImagem) {
  return ehCaminhoImagemLocal(valorImagem) && String(valorImagem).startsWith('imagens/cotacoes/');
}

function limparTexto(valor) {
  const texto = String(valor || '').trim();
  return texto || null;
}

function etapaCotacaoEhFechada(idEtapaCotacao) {
  return IDS_ETAPAS_COTACAO_FECHADAS.has(Number(idEtapaCotacao));
}

function cotacaoEhRecusado(cotacao) {
  return Number(cotacao?.idEtapaCotacao) === 4;
}

function cotacaoBloqueadoPorOrdemCompraVinculado(cotacao) {
  return Number(cotacao?.idOrdemCompraVinculado) > 0;
}

function obterDataAtualFormatoInput() {
  const hoje = new Date();
  const ano = hoje.getFullYear();
  const mes = String(hoje.getMonth() + 1).padStart(2, '0');
  const dia = String(hoje.getDate()).padStart(2, '0');

  return `${ano}-${mes}-${dia}`;
}

async function tentarRollback() {
  try {
    await executar('ROLLBACK');
  } catch (_erro) {
    return;
  }
}

module.exports = {
  rotaCotacoes
};
