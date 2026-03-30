const express = require('express');
const { consultarTodos, consultarUm, executar } = require('../configuracoes/banco');
const {
  ehCaminhoImagemLocal,
  ehDataUrlImagem,
  removerArquivoImagem,
  salvarImagemItemOrcamento
} = require('../utilitarios/imagens');
const { validarReferenciasAtivasDaEntidade } = require('../utilitarios/validarReferenciasAtivas');

const rotaOrcamentos = express.Router();

rotaOrcamentos.get('/', async (_requisicao, resposta) => {
  try {
    const registros = await consultarTodos(`
      SELECT
        orcamento.*
      FROM orcamento
      ORDER BY orcamento.idOrcamento DESC
    `);

    const registrosCompletos = await Promise.all(
      registros.map((registro) => consultarOrcamentoCompleto(registro.idOrcamento))
    );

    resposta.json(registrosCompletos.filter(Boolean));
  } catch (_erro) {
    resposta.status(500).json({ mensagem: 'Ocorreu um erro ao processar a requisicao.' });
  }
});

rotaOrcamentos.get('/:id', async (requisicao, resposta) => {
  try {
    const registro = await consultarOrcamentoCompleto(Number(requisicao.params.id));

    if (!registro) {
      resposta.status(404).json({ mensagem: 'Registro nao encontrado.' });
      return;
    }

    resposta.json(registro);
  } catch (_erro) {
    resposta.status(500).json({ mensagem: 'Ocorreu um erro ao processar a requisicao.' });
  }
});

rotaOrcamentos.post('/', async (requisicao, resposta) => {
  try {
    const payload = normalizarPayloadOrcamento(requisicao.body);
    await validarReferenciasAtivasDaEntidade('orcamento', payload);
    const etapaOrcamento = await obterEtapaOrcamento(payload.idEtapaOrcamento);
    const cliente = await obterCliente(payload.idCliente);
    const mensagemValidacao = validarPayloadOrcamento(payload, etapaOrcamento);

    if (mensagemValidacao) {
      resposta.status(400).json({ mensagem: mensagemValidacao });
      return;
    }

    await executar('BEGIN TRANSACTION');

    const resultado = await executar(
      `INSERT INTO orcamento (
        idCliente,
        idContato,
        idUsuario,
        idVendedor,
        comissao,
        idPrazoPagamento,
        idEtapaOrcamento,
        idMotivoPerda,
        dataInclusao,
        dataValidade,
        observacao
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        payload.idCliente,
        payload.idContato,
        payload.idUsuario,
        payload.idVendedor,
        payload.comissao,
        payload.idPrazoPagamento,
        payload.idEtapaOrcamento,
        payload.idMotivoPerda,
        payload.dataInclusao,
        payload.dataValidade,
        payload.observacao
      ]
    );

    await salvarItensOrcamento(resultado.id, payload.itens, cliente);
    await salvarCamposOrcamento(resultado.id, payload.camposExtras);
    await executar('COMMIT');

    const registro = await consultarOrcamentoCompleto(resultado.id);
    resposta.status(201).json(registro);
  } catch (_erro) {
    if (_erro.statusCode === 400) {
      resposta.status(400).json({ mensagem: _erro.message });
      return;
    }

    await tentarRollback();
    resposta.status(500).json({ mensagem: 'Nao foi possivel concluir a operacao por violacao de integridade dos dados.' });
  }
});

rotaOrcamentos.put('/:id', async (requisicao, resposta) => {
  try {
    const idOrcamento = Number(requisicao.params.id);
    const existente = await consultarUm('SELECT * FROM orcamento WHERE idOrcamento = ?', [idOrcamento]);

    if (!existente) {
      resposta.status(404).json({ mensagem: 'Registro nao encontrado.' });
      return;
    }

    const payload = normalizarPayloadOrcamento({
      ...existente,
      ...requisicao.body
    });
    await validarReferenciasAtivasDaEntidade('orcamento', payload);
    const etapaOrcamento = await obterEtapaOrcamento(payload.idEtapaOrcamento);
    const cliente = await obterCliente(payload.idCliente);
    const itensAtuais = await consultarTodos('SELECT imagem FROM itemOrcamento WHERE idOrcamento = ?', [idOrcamento]);
    const mensagemValidacao = validarPayloadOrcamento(payload, etapaOrcamento);

    if (mensagemValidacao) {
      resposta.status(400).json({ mensagem: mensagemValidacao });
      return;
    }

    if (
      existente.idPedidoVinculado &&
      String(existente.idEtapaOrcamento || '') !== String(payload.idEtapaOrcamento || '')
    ) {
      resposta.status(400).json({ mensagem: 'Nao e possivel alterar a etapa de um orcamento com pedido vinculado.' });
      return;
    }

    await executar('BEGIN TRANSACTION');
    await executar(
      `UPDATE orcamento SET
        idCliente = ?,
        idContato = ?,
        idUsuario = ?,
        idVendedor = ?,
        comissao = ?,
        idPrazoPagamento = ?,
        idEtapaOrcamento = ?,
        idMotivoPerda = ?,
        dataInclusao = ?,
        dataValidade = ?,
        observacao = ?
      WHERE idOrcamento = ?`,
      [
        payload.idCliente,
        payload.idContato,
        payload.idUsuario,
        payload.idVendedor,
        payload.comissao,
        payload.idPrazoPagamento,
        payload.idEtapaOrcamento,
        payload.idMotivoPerda,
        payload.dataInclusao,
        payload.dataValidade,
        payload.observacao,
        idOrcamento
      ]
    );

    await executar('DELETE FROM itemOrcamento WHERE idOrcamento = ?', [idOrcamento]);
    await executar('DELETE FROM valorCampoOrcamento WHERE idOrcamento = ?', [idOrcamento]);
    await salvarItensOrcamento(idOrcamento, payload.itens, cliente);
    await salvarCamposOrcamento(idOrcamento, payload.camposExtras);
    await executar('COMMIT');

    removerImagensItensNaoUtilizadas(
      itensAtuais.map((item) => item.imagem),
      payload.itens.map((item) => item.imagem)
    );

    const registro = await consultarOrcamentoCompleto(idOrcamento);
    resposta.json(registro);
  } catch (_erro) {
    if (_erro.statusCode === 400) {
      resposta.status(400).json({ mensagem: _erro.message });
      return;
    }

    await tentarRollback();
    resposta.status(500).json({ mensagem: 'Nao foi possivel concluir a operacao por violacao de integridade dos dados.' });
  }
});

rotaOrcamentos.delete('/:id', async (requisicao, resposta) => {
  try {
    const idOrcamento = Number(requisicao.params.id);
    const existente = await consultarUm('SELECT * FROM orcamento WHERE idOrcamento = ?', [idOrcamento]);
    const itensAtuais = await consultarTodos('SELECT imagem FROM itemOrcamento WHERE idOrcamento = ?', [idOrcamento]);

    if (!existente) {
      resposta.status(404).json({ mensagem: 'Registro nao encontrado.' });
      return;
    }

    if (existente.idPedidoVinculado) {
      resposta.status(400).json({ mensagem: 'Nao e possivel excluir um orcamento com pedido vinculado.' });
      return;
    }

    await executar('BEGIN TRANSACTION');
    await executar('DELETE FROM itemOrcamento WHERE idOrcamento = ?', [idOrcamento]);
    await executar('DELETE FROM valorCampoOrcamento WHERE idOrcamento = ?', [idOrcamento]);
    await executar('DELETE FROM orcamento WHERE idOrcamento = ?', [idOrcamento]);
    await executar('COMMIT');

    itensAtuais.forEach((item) => {
      if (ehCaminhoImagemLocal(item.imagem)) {
        removerArquivoImagem(item.imagem);
      }
    });

    resposta.status(204).send();
  } catch (_erro) {
    await tentarRollback();
    resposta.status(500).json({ mensagem: 'Ocorreu um erro ao processar a requisicao.' });
  }
});

async function consultarOrcamentoCompleto(idOrcamento) {
  const orcamento = await consultarUm(
    'SELECT * FROM orcamento WHERE idOrcamento = ?',
    [idOrcamento]
  );

  if (!orcamento) {
    return null;
  }

  const [itens, camposExtras] = await Promise.all([
    consultarTodos(
      `SELECT * FROM itemOrcamento WHERE idOrcamento = ? ORDER BY idItemOrcamento ASC`,
      [idOrcamento]
    ),
    consultarTodos(
      `SELECT * FROM valorCampoOrcamento WHERE idOrcamento = ? ORDER BY idValorCampoOrcamento ASC`,
      [idOrcamento]
    )
  ]);

  return {
    ...orcamento,
    itens: itens.map(normalizarItemImagem),
    camposExtras
  };
}

function normalizarPayloadOrcamento(payload) {
  return {
    idCliente: payload.idCliente ? Number(payload.idCliente) : null,
    idContato: payload.idContato ? Number(payload.idContato) : null,
    idUsuario: payload.idUsuario ? Number(payload.idUsuario) : null,
    idVendedor: payload.idVendedor ? Number(payload.idVendedor) : null,
    comissao: payload.comissao === '' || payload.comissao === null || payload.comissao === undefined
      ? 0
      : Number(payload.comissao),
    idPrazoPagamento: payload.idPrazoPagamento ? Number(payload.idPrazoPagamento) : null,
    idEtapaOrcamento: payload.idEtapaOrcamento ? Number(payload.idEtapaOrcamento) : null,
    idMotivoPerda: payload.idMotivoPerda ? Number(payload.idMotivoPerda) : null,
    dataInclusao: limparTexto(payload.dataInclusao),
    dataValidade: limparTexto(payload.dataValidade),
    observacao: limparTexto(payload.observacao),
    itens: normalizarItensOrcamento(payload.itens),
    camposExtras: normalizarCamposExtras(payload.camposExtras)
  };
}

function normalizarItensOrcamento(itens) {
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
      observacao: limparTexto(item.observacao)
    }))
    .filter((item) => item.idProduto && item.quantidade && item.valorUnitario !== null);
}

function normalizarCamposExtras(camposExtras) {
  if (!Array.isArray(camposExtras)) {
    return [];
  }

  return camposExtras
    .map((campo) => ({
      idCampoOrcamento: campo.idCampoOrcamento ? Number(campo.idCampoOrcamento) : null,
      valor: limparTexto(campo.valor)
    }))
    .filter((campo) => campo.idCampoOrcamento);
}

function validarPayloadOrcamento(payload, etapaOrcamento) {
  if (!payload.idCliente) {
    return 'Selecione o cliente do orcamento.';
  }

  if (!payload.idUsuario) {
    return 'Selecione o usuario do registro.';
  }

  if (!payload.idVendedor) {
    return 'Selecione o vendedor.';
  }

  if (payload.itens.length === 0) {
    return 'Inclua ao menos um item no orcamento.';
  }

  if (etapaOrcamento?.obrigarMotivoPerda && !payload.idMotivoPerda) {
    return 'Selecione o motivo da perda para esta etapa do orcamento.';
  }

  return '';
}

async function salvarItensOrcamento(idOrcamento, itens, cliente) {
  for (const item of itens) {
    const resultado = await executar(
      `INSERT INTO itemOrcamento (
        idOrcamento,
        idProduto,
        quantidade,
        valorUnitario,
        valorTotal,
        imagem,
        observacao
      ) VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [
        idOrcamento,
        item.idProduto,
        item.quantidade,
        item.valorUnitario,
        item.valorTotal,
        ehDataUrlImagem(item.imagem) ? null : item.imagem,
        item.observacao
      ]
    );

    if (ehDataUrlImagem(item.imagem)) {
      const caminhoImagem = salvarImagemItemOrcamento({
        idOrcamento,
        nomeCliente: cliente?.nomeFantasia || cliente?.razaoSocial || `cliente-${cliente?.idCliente || ''}`,
        idItemOrcamento: resultado.id,
        valorImagem: item.imagem
      });

      await executar(
        'UPDATE itemOrcamento SET imagem = ? WHERE idItemOrcamento = ?',
        [caminhoImagem, resultado.id]
      );
    }
  }
}

async function salvarCamposOrcamento(idOrcamento, camposExtras) {
  for (const campo of camposExtras) {
    await executar(
      `INSERT INTO valorCampoOrcamento (
        idOrcamento,
        idCampoOrcamento,
        valor
      ) VALUES (?, ?, ?)`,
      [idOrcamento, campo.idCampoOrcamento, campo.valor]
    );
  }
}

async function obterEtapaOrcamento(idEtapaOrcamento) {
  if (!idEtapaOrcamento) {
    return null;
  }

  return consultarUm(
    'SELECT * FROM etapaOrcamento WHERE idEtapaOrcamento = ?',
    [idEtapaOrcamento]
  );
}

async function obterCliente(idCliente) {
  if (!idCliente) {
    return null;
  }

  return consultarUm('SELECT idCliente, nomeFantasia, razaoSocial FROM cliente WHERE idCliente = ?', [idCliente]);
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

  return `http://127.0.0.1:3001/api/arquivos/${valorImagem}`;
}

function desnormalizarCaminhoImagem(valorImagem) {
  if (typeof valorImagem !== 'string') {
    return valorImagem || null;
  }

  const prefixoCompleto = 'http://127.0.0.1:3001/api/arquivos/';
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
      .filter((imagem) => ehCaminhoImagemLocal(desnormalizarCaminhoImagem(imagem)))
      .map((imagem) => desnormalizarCaminhoImagem(imagem))
  );

  imagensAtuais.forEach((imagem) => {
    if (ehCaminhoImagemLocal(imagem) && !imagensMantidas.has(imagem)) {
      removerArquivoImagem(imagem);
    }
  });
}

function limparTexto(valor) {
  const texto = String(valor || '').trim();
  return texto || null;
}

async function tentarRollback() {
  try {
    await executar('ROLLBACK');
  } catch (_erro) {
    return;
  }
}

module.exports = {
  rotaOrcamentos
};
