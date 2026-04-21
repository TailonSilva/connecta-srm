const express = require('express');
const {
  ID_ETAPA_COTACAO_PEDIDO_EXCLUIDO,
  ID_ETAPA_PEDIDO_ENTREGUE,
  consultarTodos,
  consultarUm,
  executar
} = require('../configuracoes/banco');
const {
  ehCaminhoImagemLocal,
  ehDataUrlImagem,
  removerArquivoImagem,
  salvarImagemItemOrdemCompra
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

const rotaOrdensCompra = express.Router();

rotaOrdensCompra.get('/', async (requisicao, resposta) => {
  try {
    const clausulas = [];
    const parametros = [];
    const query = normalizarEntradaFornecedor(requisicao.query);

    adicionarFiltroBusca(clausulas, parametros, query.search, [
      'CAST(ordemCompra.idOrdemCompra AS TEXT)',
      'CAST(ordemCompra.codigoCotacaoOrigem AS TEXT)',
      'ordemCompra.nomeFornecedorSnapshot',
      'ordemCompra.nomeContatoSnapshot',
      'ordemCompra.nomeUsuarioSnapshot',
      'ordemCompra.nomeCompradorSnapshot',
      'ordemCompra.nomePrazoPagamentoSnapshot',
      'ordemCompra.nomeTipoOrdemCompraSnapshot',
      'ordemCompra.nomeEtapaOrdemCompraSnapshot',
      'ordemCompra.observacao'
    ]);
    adicionarFiltroIgual(clausulas, parametros, 'ordemCompra.idFornecedor', query.idFornecedor, Number);
    adicionarFiltroIgual(clausulas, parametros, 'ordemCompra.idUsuario', query.idUsuario, Number);
    adicionarFiltroLista(clausulas, parametros, 'ordemCompra.idComprador', query.idComprador, Number);
    adicionarFiltroLista(clausulas, parametros, 'ordemCompra.idEtapaOrdemCompra', query.idEtapaOrdemCompra, Number);
    adicionarFiltroPeriodo(clausulas, parametros, 'ordemCompra.dataInclusao', query.dataInclusaoInicio, query.dataInclusaoFim);
    adicionarFiltroPeriodo(clausulas, parametros, 'ordemCompra.dataEntrega', query.dataEntregaInicio, query.dataEntregaFim);

    if (query.escopoIdComprador) {
      clausulas.push('ordemCompra.idComprador = ?');
      parametros.push(Number(query.escopoIdComprador));
    }

    const registros = await consultarTodos(`
      SELECT ordemCompra.idOrdemCompra
      FROM ordemCompra
      LEFT JOIN fornecedor ON fornecedor.idFornecedor = ordemCompra.idFornecedor
      ${montarWhere(clausulas)}
      ORDER BY ordemCompra.idOrdemCompra DESC
    `, parametros);

    const registrosCompletos = await Promise.all(
      registros.map((registro) => consultarOrdemCompraCompleto(registro.idOrdemCompra))
    );

    resposta.json(normalizarListaSaidaFornecedor(registrosCompletos.filter(Boolean)));
  } catch (_erro) {
    resposta.status(500).json({ mensagem: 'Ocorreu um erro ao processar a requisicao.' });
  }
});

rotaOrdensCompra.get('/:id', async (requisicao, resposta) => {
  try {
    const registro = await consultarOrdemCompraCompleto(Number(requisicao.params.id));

    if (!registro) {
      resposta.status(404).json({ mensagem: 'Registro nao encontrado.' });
      return;
    }

    resposta.json(normalizarSaidaFornecedor(registro));
  } catch (_erro) {
    resposta.status(500).json({ mensagem: 'Ocorreu um erro ao processar a requisicao.' });
  }
});

rotaOrdensCompra.post('/', async (requisicao, resposta) => {
  try {
    const payload = aplicarAutomacoesOrdemCompra(normalizarPayloadOrdemCompra(normalizarEntradaFornecedor(requisicao.body || {})));
    await validarReferenciasAtivasDaEntidade('ordemCompra', payload);
    const snapshots = await montarSnapshotsOrdemCompra(payload);
    const mensagemValidacao = validarPayloadOrdemCompra(payload);

    if (mensagemValidacao) {
      resposta.status(400).json({ mensagem: mensagemValidacao });
      return;
    }

    await executar('BEGIN TRANSACTION');

    const resultado = await executar(
      `INSERT INTO ordemCompra (
        idCotacao,
        idFornecedor,
        idContato,
        idUsuario,
        idComprador,
        idPrazoPagamento,
        idTipoOrdemCompra,
        idEtapaOrdemCompra,
        dataInclusao,
        dataEntrega,
        dataValidade,
        observacao,
        codigoCotacaoOrigem,
        nomeFornecedorSnapshot,
        nomeContatoSnapshot,
        nomeUsuarioSnapshot,
        nomeCompradorSnapshot,
        nomeMetodoPagamentoSnapshot,
        nomePrazoPagamentoSnapshot,
        nomeTipoOrdemCompraSnapshot,
        nomeEtapaOrdemCompraSnapshot
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        payload.idCotacao,
        payload.idFornecedor,
        payload.idContato,
        payload.idUsuario,
        payload.idComprador,
        payload.idPrazoPagamento,
        payload.idTipoOrdemCompra,
        payload.idEtapaOrdemCompra,
        payload.dataInclusao,
        payload.dataEntrega,
        payload.dataValidade,
        payload.observacao,
        snapshots.codigoCotacaoOrigem,
        snapshots.nomeFornecedorSnapshot,
        snapshots.nomeContatoSnapshot,
        snapshots.nomeUsuarioSnapshot,
        snapshots.nomeCompradorSnapshot,
        snapshots.nomeMetodoPagamentoSnapshot,
        snapshots.nomePrazoPagamentoSnapshot,
        snapshots.nomeTipoOrdemCompraSnapshot,
        snapshots.nomeEtapaOrdemCompraSnapshot
      ]
    );

    await salvarItensOrdemCompra(resultado.id, payload.itens, snapshots.nomeFornecedorSnapshot);
    await salvarCamposOrdemCompra(resultado.id, payload.camposExtras);
    await sincronizarVinculoCotacaoOrdemCompra(null, payload.idCotacao, resultado.id);
    await executar('COMMIT');

    const registro = await consultarOrdemCompraCompleto(resultado.id);
    resposta.status(201).json(normalizarSaidaFornecedor(registro));
  } catch (_erro) {
    if (_erro.statusCode === 400) {
      resposta.status(400).json({ mensagem: _erro.message });
      return;
    }

    console.error('Erro ao incluir ordemCompra:', _erro);
    await tentarRollback();
    resposta.status(500).json({ mensagem: 'Nao foi possivel concluir a operacao por violacao de integridade dos dados.' });
  }
});

rotaOrdensCompra.put('/:id', async (requisicao, resposta) => {
  try {
    const idOrdemCompra = Number(requisicao.params.id);
    const existente = await consultarUm('SELECT * FROM ordemCompra WHERE idOrdemCompra = ?', [idOrdemCompra]);

    if (!existente) {
      resposta.status(404).json({ mensagem: 'Registro nao encontrado.' });
      return;
    }

    const payload = aplicarAutomacoesOrdemCompra(
      normalizarPayloadOrdemCompra({ ...existente, ...normalizarEntradaFornecedor(requisicao.body || {}) }),
      existente
    );
    await validarReferenciasAtivasDaEntidade('ordemCompra', payload);
    const snapshots = await montarSnapshotsOrdemCompra(payload);
    const itensAtuais = await consultarTodos('SELECT imagem FROM itemOrdemCompra WHERE idOrdemCompra = ?', [idOrdemCompra]);
    const mensagemValidacao = validarPayloadOrdemCompra(payload);

    if (mensagemValidacao) {
      resposta.status(400).json({ mensagem: mensagemValidacao });
      return;
    }

    await executar('BEGIN TRANSACTION');

    await executar(
      `UPDATE ordemCompra SET
        idCotacao = ?,
        idFornecedor = ?,
        idContato = ?,
        idUsuario = ?,
        idComprador = ?,
        idPrazoPagamento = ?,
        idTipoOrdemCompra = ?,
        idEtapaOrdemCompra = ?,
        dataInclusao = ?,
        dataEntrega = ?,
        dataValidade = ?,
        observacao = ?,
        codigoCotacaoOrigem = ?,
        nomeFornecedorSnapshot = ?,
        nomeContatoSnapshot = ?,
        nomeUsuarioSnapshot = ?,
        nomeCompradorSnapshot = ?,
        nomeMetodoPagamentoSnapshot = ?,
        nomePrazoPagamentoSnapshot = ?,
        nomeTipoOrdemCompraSnapshot = ?,
        nomeEtapaOrdemCompraSnapshot = ?
      WHERE idOrdemCompra = ?`,
      [
        payload.idCotacao,
        payload.idFornecedor,
        payload.idContato,
        payload.idUsuario,
        payload.idComprador,
        payload.idPrazoPagamento,
        payload.idTipoOrdemCompra,
        payload.idEtapaOrdemCompra,
        payload.dataInclusao,
        payload.dataEntrega,
        payload.dataValidade,
        payload.observacao,
        snapshots.codigoCotacaoOrigem,
        snapshots.nomeFornecedorSnapshot,
        snapshots.nomeContatoSnapshot,
        snapshots.nomeUsuarioSnapshot,
        snapshots.nomeCompradorSnapshot,
        snapshots.nomeMetodoPagamentoSnapshot,
        snapshots.nomePrazoPagamentoSnapshot,
        snapshots.nomeTipoOrdemCompraSnapshot,
        snapshots.nomeEtapaOrdemCompraSnapshot,
        idOrdemCompra
      ]
    );

    await executar('DELETE FROM itemOrdemCompra WHERE idOrdemCompra = ?', [idOrdemCompra]);
    await executar('DELETE FROM valorCampoOrdemCompra WHERE idOrdemCompra = ?', [idOrdemCompra]);
    await salvarItensOrdemCompra(idOrdemCompra, payload.itens, snapshots.nomeFornecedorSnapshot);
    await salvarCamposOrdemCompra(idOrdemCompra, payload.camposExtras);
    await sincronizarVinculoCotacaoOrdemCompra(existente.idCotacao, payload.idCotacao, idOrdemCompra);
    await executar('COMMIT');

    removerImagensItensNaoUtilizadas(
      itensAtuais.map((item) => item.imagem),
      payload.itens.map((item) => item.imagem)
    );

    const registro = await consultarOrdemCompraCompleto(idOrdemCompra);
    resposta.json(normalizarSaidaFornecedor(registro));
  } catch (_erro) {
    if (_erro.statusCode === 400) {
      resposta.status(400).json({ mensagem: _erro.message });
      return;
    }

    console.error('Erro ao atualizar ordemCompra:', _erro);
    await tentarRollback();
    resposta.status(500).json({ mensagem: 'Nao foi possivel concluir a operacao por violacao de integridade dos dados.' });
  }
});

rotaOrdensCompra.delete('/:id', async (requisicao, resposta) => {
  try {
    const idOrdemCompra = Number(requisicao.params.id);
    const existente = await consultarUm('SELECT * FROM ordemCompra WHERE idOrdemCompra = ?', [idOrdemCompra]);
    const itensAtuais = await consultarTodos('SELECT imagem FROM itemOrdemCompra WHERE idOrdemCompra = ?', [idOrdemCompra]);

    if (!existente) {
      resposta.status(404).json({ mensagem: 'Registro nao encontrado.' });
      return;
    }

    await executar('BEGIN TRANSACTION');
    await marcarCotacoesComOrdemCompraExcluido(idOrdemCompra);
    await sincronizarVinculoCotacaoOrdemCompra(existente.idCotacao, null, idOrdemCompra);
    await executar('DELETE FROM itemOrdemCompra WHERE idOrdemCompra = ?', [idOrdemCompra]);
    await executar('DELETE FROM valorCampoOrdemCompra WHERE idOrdemCompra = ?', [idOrdemCompra]);
    await executar('DELETE FROM ordemCompra WHERE idOrdemCompra = ?', [idOrdemCompra]);
    await executar('COMMIT');

    itensAtuais.forEach((item) => {
      if (ehImagemItemOrdemCompraLocal(item.imagem)) {
        removerArquivoImagem(item.imagem);
      }
    });

    resposta.status(204).send();
  } catch (_erro) {
    console.error('Erro ao excluir ordemCompra:', _erro);
    await tentarRollback();
    resposta.status(500).json({ mensagem: 'Ocorreu um erro ao processar a requisicao.' });
  }
});

async function consultarOrdemCompraCompleto(idOrdemCompra) {
  const ordemCompra = await consultarUm('SELECT * FROM ordemCompra WHERE idOrdemCompra = ?', [idOrdemCompra]);

  if (!ordemCompra) {
    return null;
  }

  const [itens, camposExtras] = await Promise.all([
    consultarTodos(
      'SELECT * FROM itemOrdemCompra WHERE idOrdemCompra = ? ORDER BY idItemOrdemCompra ASC',
      [idOrdemCompra]
    ),
    consultarTodos(
      'SELECT * FROM valorCampoOrdemCompra WHERE idOrdemCompra = ? ORDER BY idValorCampoOrdemCompra ASC',
      [idOrdemCompra]
    )
  ]);

  return {
    ...ordemCompra,
    itens: itens.map(normalizarItemImagem),
    camposExtras
  };
}

function normalizarPayloadOrdemCompra(payload = {}) {
  return {
    idCotacao: payload.idCotacao ? Number(payload.idCotacao) : null,
    idFornecedor: payload.idFornecedor ? Number(payload.idFornecedor) : null,
    idContato: payload.idContato ? Number(payload.idContato) : null,
    idUsuario: payload.idUsuario ? Number(payload.idUsuario) : null,
    idComprador: payload.idComprador ? Number(payload.idComprador) : null,
    idPrazoPagamento: payload.idPrazoPagamento ? Number(payload.idPrazoPagamento) : null,
    idTipoOrdemCompra: payload.idTipoOrdemCompra ? Number(payload.idTipoOrdemCompra) : null,
    idEtapaOrdemCompra: payload.idEtapaOrdemCompra ? Number(payload.idEtapaOrdemCompra) : null,
    dataInclusao: limparTexto(payload.dataInclusao),
    dataEntrega: limparTexto(payload.dataEntrega || payload.dataValidade),
    dataValidade: limparTexto(payload.dataValidade),
    observacao: limparTexto(payload.observacao),
    codigoCotacaoOrigem: payload.codigoCotacaoOrigem ? Number(payload.codigoCotacaoOrigem) : null,
    nomeFornecedorSnapshot: limparTexto(payload.nomeFornecedorSnapshot),
    nomeContatoSnapshot: limparTexto(payload.nomeContatoSnapshot),
    nomeUsuarioSnapshot: limparTexto(payload.nomeUsuarioSnapshot),
    nomeCompradorSnapshot: limparTexto(payload.nomeCompradorSnapshot),
    nomeMetodoPagamentoSnapshot: limparTexto(payload.nomeMetodoPagamentoSnapshot),
    nomePrazoPagamentoSnapshot: limparTexto(payload.nomePrazoPagamentoSnapshot),
    nomeTipoOrdemCompraSnapshot: limparTexto(payload.nomeTipoOrdemCompraSnapshot),
    nomeEtapaOrdemCompraSnapshot: limparTexto(payload.nomeEtapaOrdemCompraSnapshot),
    itens: normalizarItensOrdemCompra(payload.itens),
    camposExtras: normalizarCamposOrdemCompra(payload.camposExtras)
  };
}

function aplicarAutomacoesOrdemCompra(payload, ordemCompraAtual = null) {
  const proximoPayload = {
    ...payload
  };
  const entrouNaEtapaEntregue = !etapaOrdemCompraEhEntregue(ordemCompraAtual?.idEtapaOrdemCompra)
    && etapaOrdemCompraEhEntregue(proximoPayload.idEtapaOrdemCompra);

  if (entrouNaEtapaEntregue && (!proximoPayload.dataEntrega || proximoPayload.dataEntrega === limparTexto(ordemCompraAtual?.dataEntrega))) {
    proximoPayload.dataEntrega = obterDataAtualFormatoInput();
  }

  if (etapaOrdemCompraEhEntregue(proximoPayload.idEtapaOrdemCompra) && !proximoPayload.dataEntrega) {
    proximoPayload.dataEntrega = obterDataAtualFormatoInput();
  }

  return proximoPayload;
}

function normalizarItensOrdemCompra(itens) {
  if (!Array.isArray(itens)) {
    return [];
  }

  return itens
    .map((item) => ({
      idProduto: item.idProduto ? Number(item.idProduto) : null,
      quantidade: item.quantidade === '' || item.quantidade === null || item.quantidade === undefined ? null : Number(item.quantidade),
      valorUnitario: item.valorUnitario === '' || item.valorUnitario === null || item.valorUnitario === undefined ? null : Number(item.valorUnitario),
      valorTotal: item.valorTotal === '' || item.valorTotal === null || item.valorTotal === undefined ? null : Number(item.valorTotal),
      imagem: normalizarImagemItemPayload(item.imagem),
      observacao: limparTexto(item.observacao),
      referenciaProdutoSnapshot: limparTexto(item.referenciaProdutoSnapshot),
      descricaoProdutoSnapshot: limparTexto(item.descricaoProdutoSnapshot),
      unidadeProdutoSnapshot: limparTexto(item.unidadeProdutoSnapshot)
    }))
    .filter((item) => item.quantidade && item.valorUnitario !== null);
}

function normalizarCamposOrdemCompra(camposExtras) {
  if (!Array.isArray(camposExtras)) {
    return [];
  }

  return camposExtras
    .map((campo) => ({
      idCampoOrdemCompra: campo.idCampoOrdemCompra ? Number(campo.idCampoOrdemCompra) : null,
      idCampoCotacao: campo.idCampoCotacao ? Number(campo.idCampoCotacao) : null,
      tituloSnapshot: limparTexto(campo.tituloSnapshot || campo.titulo),
      valor: limparTexto(campo.valor)
    }))
    .filter((campo) => campo.idCampoOrdemCompra || campo.idCampoCotacao || campo.tituloSnapshot);
}

function validarPayloadOrdemCompra(payload) {
  if (!payload.idFornecedor) {
    return 'Selecione o fornecedor da ordemCompra.';
  }

  if (!payload.idUsuario) {
    return 'Selecione o usuario do registro.';
  }

  if (!payload.idComprador) {
    return 'Selecione o comprador.';
  }

  if (!payload.idTipoOrdemCompra) {
    return 'Selecione o tipo de ordemCompra.';
  }

  if (!payload.idPrazoPagamento) {
    return 'Selecione o prazo de pagamento.';
  }

  if (payload.itens.length === 0) {
    return 'Inclua ao menos um item na ordemCompra.';
  }

  return '';
}

async function montarSnapshotsOrdemCompra(payload) {
  const [
    fornecedor,
    contato,
    usuario,
    comprador,
    prazo,
    tipoOrdemCompra,
    etapaOrdemCompra,
    cotacao
  ] = await Promise.all([
    obterFornecedor(payload.idFornecedor),
    obterContato(payload.idContato),
    obterUsuario(payload.idUsuario),
    obterComprador(payload.idComprador),
    obterPrazoPagamento(payload.idPrazoPagamento),
    obterTipoOrdemCompra(payload.idTipoOrdemCompra),
    obterEtapaOrdemCompra(payload.idEtapaOrdemCompra),
    obterCotacao(payload.idCotacao)
  ]);

  return {
    codigoCotacaoOrigem: payload.codigoCotacaoOrigem || cotacao?.idCotacao || payload.idCotacao || null,
    nomeFornecedorSnapshot: payload.nomeFornecedorSnapshot || fornecedor?.nomeFantasia || fornecedor?.razaoSocial || null,
    nomeContatoSnapshot: payload.nomeContatoSnapshot || contato?.nome || null,
    nomeUsuarioSnapshot: payload.nomeUsuarioSnapshot || usuario?.nome || null,
    nomeCompradorSnapshot: payload.nomeCompradorSnapshot || comprador?.nome || null,
    nomeMetodoPagamentoSnapshot: payload.nomeMetodoPagamentoSnapshot || prazo?.nomeMetodoPagamento || null,
    nomePrazoPagamentoSnapshot: payload.nomePrazoPagamentoSnapshot || prazo?.descricaoFormatada || null,
    nomeTipoOrdemCompraSnapshot: payload.nomeTipoOrdemCompraSnapshot || tipoOrdemCompra?.descricao || null,
    nomeEtapaOrdemCompraSnapshot: payload.nomeEtapaOrdemCompraSnapshot || etapaOrdemCompra?.descricao || null
  };
}

async function salvarItensOrdemCompra(idOrdemCompra, itens, nomeFornecedor) {
  for (const item of itens) {
    const produto = await obterProduto(item.idProduto);
    const resultado = await executar(
      `INSERT INTO itemOrdemCompra (
        idOrdemCompra,
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
        idOrdemCompra,
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
      const caminhoImagem = salvarImagemItemOrdemCompra({
        idOrdemCompra,
        nomeFornecedor: nomeFornecedor || 'fornecedor',
        idItemOrdemCompra: resultado.id,
        valorImagem: item.imagem
      });

      await executar(
        'UPDATE itemOrdemCompra SET imagem = ? WHERE idItemOrdemCompra = ?',
        [caminhoImagem, resultado.id]
      );
    }
  }
}

async function salvarCamposOrdemCompra(idOrdemCompra, camposExtras) {
  for (const campo of camposExtras) {
    await executar(
      `INSERT INTO valorCampoOrdemCompra (
        idOrdemCompra,
        idCampoOrdemCompra,
        idCampoCotacao,
        tituloSnapshot,
        valor
      ) VALUES (?, ?, ?, ?, ?)`,
      [idOrdemCompra, campo.idCampoOrdemCompra, campo.idCampoCotacao, campo.tituloSnapshot, campo.valor]
    );
  }
}

async function sincronizarVinculoCotacaoOrdemCompra(idCotacaoAnterior, idCotacaoAtual, idOrdemCompra) {
  if (!idCotacaoAtual) {
    await executar(
      'UPDATE cotacao SET idOrdemCompraVinculado = NULL WHERE idOrdemCompraVinculado = ?',
      [idOrdemCompra]
    );
  }

  if (idCotacaoAnterior && String(idCotacaoAnterior) !== String(idCotacaoAtual || '')) {
    await executar(
      'UPDATE cotacao SET idOrdemCompraVinculado = NULL WHERE idCotacao = ? AND idOrdemCompraVinculado = ?',
      [idCotacaoAnterior, idOrdemCompra]
    );
  }

  if (idCotacaoAtual) {
    await executar(
      'UPDATE cotacao SET idOrdemCompraVinculado = ? WHERE idCotacao = ?',
      [idOrdemCompra, idCotacaoAtual]
    );
  }
}

async function marcarCotacoesComOrdemCompraExcluido(idOrdemCompra) {
  const etapaOrdemCompraExcluido = await obterEtapaOrdemCompraExcluido();

  if (!etapaOrdemCompraExcluido?.idEtapaCotacao) {
    return;
  }

  await executar(
    'UPDATE cotacao SET idEtapaCotacao = ? WHERE idOrdemCompraVinculado = ?',
    [etapaOrdemCompraExcluido.idEtapaCotacao, idOrdemCompra]
  );
}

async function obterFornecedor(idFornecedor) {
  if (!idFornecedor) {
    return null;
  }

  return consultarUm('SELECT idFornecedor, nomeFantasia, razaoSocial FROM fornecedor WHERE idFornecedor = ?', [idFornecedor]);
}

async function obterContato(idContato) {
  if (!idContato) {
    return null;
  }

  return consultarUm('SELECT idContato, nome FROM contato WHERE idContato = ?', [idContato]);
}

async function obterUsuario(idUsuario) {
  if (!idUsuario) {
    return null;
  }

  return consultarUm('SELECT idUsuario, nome FROM usuario WHERE idUsuario = ?', [idUsuario]);
}

async function obterComprador(idComprador) {
  if (!idComprador) {
    return null;
  }

  return consultarUm('SELECT idComprador, nome FROM comprador WHERE idComprador = ?', [idComprador]);
}

async function obterPrazoPagamento(idPrazoPagamento) {
  if (!idPrazoPagamento) {
    return null;
  }

  return consultarUm(
    `SELECT
      prazoPagamento.*,
      metodoPagamento.descricao AS nomeMetodoPagamento
    FROM prazoPagamento
    LEFT JOIN metodoPagamento ON metodoPagamento.idMetodoPagamento = prazoPagamento.idMetodoPagamento
    WHERE prazoPagamento.idPrazoPagamento = ?`,
    [idPrazoPagamento]
  ).then((prazo) => {
    if (!prazo) {
      return null;
    }

    const parcelas = [prazo.prazo1, prazo.prazo2, prazo.prazo3, prazo.prazo4, prazo.prazo5, prazo.prazo6]
      .filter((valor) => valor !== null && valor !== undefined && valor !== '')
      .join(' / ');

    return {
      ...prazo,
      descricaoFormatada: prazo.descricao || (parcelas ? `${parcelas} dias` : null)
    };
  });
}

async function obterEtapaOrdemCompra(idEtapaOrdemCompra) {
  if (!idEtapaOrdemCompra) {
    return null;
  }

  return consultarUm(
    `SELECT
      idEtapa AS idEtapaOrdemCompra,
      descricao
    FROM etapaOrdemCompra
    WHERE idEtapa = ?`,
    [idEtapaOrdemCompra]
  );
}

async function obterTipoOrdemCompra(idTipoOrdemCompra) {
  if (!idTipoOrdemCompra) {
    return null;
  }

  return consultarUm(
    `SELECT
      idTipoOrdemCompra,
      descricao
    FROM tipoOrdemCompra
    WHERE idTipoOrdemCompra = ?`,
    [idTipoOrdemCompra]
  );
}

async function obterCotacao(idCotacao) {
  if (!idCotacao) {
    return null;
  }

  return consultarUm('SELECT idCotacao FROM cotacao WHERE idCotacao = ?', [idCotacao]);
}

async function obterEtapaOrdemCompraExcluido() {
  return consultarUm(
    `SELECT idEtapaCotacao, descricao
    FROM etapaCotacao
    WHERE idEtapaCotacao = ?
    LIMIT 1`
    , [ID_ETAPA_COTACAO_PEDIDO_EXCLUIDO]
  );
}

async function obterProduto(idProduto) {
  if (!idProduto) {
    return null;
  }

  return consultarUm(
    `SELECT
      produto.idProduto,
      produto.referencia,
      produto.descricao,
      produto.imagem,
      unidadeMedida.descricao AS nomeUnidadeMedida,
      unidadeMedida.descricao AS siglaUnidadeMedida
    FROM produto
    LEFT JOIN unidadeMedida ON unidadeMedida.idUnidade = produto.idUnidade
    WHERE produto.idProduto = ?`,
    [idProduto]
  );
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

function etapaOrdemCompraEhEntregue(idEtapaOrdemCompra) {
  return Number(idEtapaOrdemCompra) === ID_ETAPA_PEDIDO_ENTREGUE;
}

function obterDataAtualFormatoInput() {
  const hoje = new Date();
  const ano = hoje.getFullYear();
  const mes = String(hoje.getMonth() + 1).padStart(2, '0');
  const dia = String(hoje.getDate()).padStart(2, '0');

  return `${ano}-${mes}-${dia}`;
}

function removerImagensItensNaoUtilizadas(imagensAtuais, imagensNovas) {
  const imagensMantidas = new Set(
    imagensNovas
      .filter((imagem) => ehImagemItemOrdemCompraLocal(desnormalizarCaminhoImagem(imagem)))
      .map((imagem) => desnormalizarCaminhoImagem(imagem))
  );

  imagensAtuais.forEach((imagem) => {
    if (ehImagemItemOrdemCompraLocal(imagem) && !imagensMantidas.has(imagem)) {
      removerArquivoImagem(imagem);
    }
  });
}

function ehImagemItemOrdemCompraLocal(valorImagem) {
  return ehCaminhoImagemLocal(valorImagem) && String(valorImagem).startsWith('imagens/ordensCompra/');
}

function limparTexto(valor) {
  const texto = String(valor || '').trim();
  return texto || null;
}

function normalizarNumeroDecimal(valor, fallback = 0) {
  if (valor === '' || valor === null || valor === undefined) {
    return fallback;
  }

  const numero = Number(valor);
  return Number.isFinite(numero) ? numero : fallback;
}

async function tentarRollback() {
  try {
    await executar('ROLLBACK');
  } catch (_erro) {
    return;
  }
}

module.exports = {
  rotaOrdensCompra
};
