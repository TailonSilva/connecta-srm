const express = require('express');
const {
  ID_ETAPA_ORDEM_COMPRA_ENTREGUE,
  ID_TIPO_ORDEM_COMPRA_PADRAO
} = require('../configuracoes/banco');
const {
  listarRegistros,
  consultarRegistroPorId,
  inserirRegistro,
  atualizarRegistro,
  excluirRegistro,
  montarCampos
} = require('../repositorios/crudRepositorio');
const { normalizarEntradaFornecedor } = require('../utilitarios/compatibilidadeFornecedor');

function criarMensagemErro(erro) {
  if (erro.code === 'SQLITE_CONSTRAINT') {
    return 'Nao foi possivel concluir a operacao por violacao de integridade dos dados.';
  }

  return 'Ocorreu um erro ao processar a requisicao.';
}

function validarCamposObrigatorios(entidade, corpo) {
  return entidade.camposObrigatorios.filter((campo) => {
    const valor = corpo[campo];
    return valor === undefined || valor === null || valor === '';
  });
}

const etapasCriticasProtegidas = {
  etapaOrdemCompra: new Set([ID_ETAPA_ORDEM_COMPRA_ENTREGUE]),
  etapaCotacao: new Set([1, 2, 3, 4]),
  statusVisita: new Set([1, 2, 3, 4, 5]),
  tipoOrdemCompra: new Set([ID_TIPO_ORDEM_COMPRA_PADRAO])
};

function registroEhRegraCritica(entidade, registro) {
  const regrasDaEntidade = etapasCriticasProtegidas[entidade.nome];

  if (!regrasDaEntidade) {
    return false;
  }

  const idRegistro = Number(registro?.[entidade.chavePrimaria]);
  return Number.isFinite(idRegistro) && regrasDaEntidade.has(idRegistro);
}

function statusSolicitaInativacao(valorStatus) {
  if (valorStatus === undefined) {
    return false;
  }

  if (typeof valorStatus === 'string') {
    const valorNormalizado = valorStatus.trim().toLowerCase();

    if (!valorNormalizado) {
      return false;
    }

    return valorNormalizado === '0' || valorNormalizado === 'false';
  }

  return Number(valorStatus) === 0;
}

function criarMensagemRegraCritica(entidade) {
  return entidade.nome === 'etapaOrdemCompra'
    ? 'A etapa critica de ordem de compra usada pela logica do sistema nao pode ser inativada ou excluida.'
    : entidade.nome === 'etapaCotacao'
      ? 'As etapas obrigatorias de cotacao nao podem ser inativadas ou excluidas.'
      : entidade.nome === 'statusVisita'
        ? 'Os status criticos da agenda nao podem ser inativados ou excluidos.'
        : entidade.nome === 'tipoOrdemCompra'
          ? 'Os tipos de ordem de compra obrigatorios do sistema nao podem ser inativados ou excluidos.'
        : 'Este registro critico nao pode ser inativado ou excluido.';
}

function criarRotaCrud(entidade) {
  const rota = express.Router();

  rota.get('/', async (_requisicao, resposta) => {
    try {
      const registros = await listarRegistros(entidade);
      resposta.json(registros);
    } catch (erro) {
      resposta.status(500).json({ mensagem: criarMensagemErro(erro) });
    }
  });

  rota.get('/:id', async (requisicao, resposta) => {
    try {
      const registro = await consultarRegistroPorId(entidade, requisicao.params.id);

      if (!registro) {
        resposta.status(404).json({ mensagem: 'Registro nao encontrado.' });
        return;
      }

      resposta.json(registro);
    } catch (erro) {
      resposta.status(500).json({ mensagem: criarMensagemErro(erro) });
    }
  });

  rota.post('/', async (requisicao, resposta) => {
    const corpo = normalizarEntradaFornecedor(requisicao.body);
    const camposFaltantes = validarCamposObrigatorios(entidade, corpo);

    if (camposFaltantes.length > 0) {
      resposta.status(400).json({
        mensagem: `Campos obrigatorios nao informados: ${camposFaltantes.join(', ')}.`
      });
      return;
    }

    try {
      const registro = await inserirRegistro(entidade, corpo);
      resposta.status(201).json(registro);
    } catch (erro) {
      if (erro.statusCode === 400) {
        resposta.status(400).json({ mensagem: erro.message });
        return;
      }

      resposta.status(500).json({ mensagem: criarMensagemErro(erro) });
    }
  });

  rota.put('/:id', async (requisicao, resposta) => {
    const corpo = normalizarEntradaFornecedor(requisicao.body);
    const camposAtualizaveis = montarCampos(
      corpo,
      entidade.camposPermitidos
    );

    if (camposAtualizaveis.length === 0) {
      resposta.status(400).json({
        mensagem: 'Informe ao menos um campo valido para atualizacao.'
      });
      return;
    }

    try {
      const registroExistente = await consultarRegistroPorId(
        entidade,
        requisicao.params.id
      );

      if (!registroExistente) {
        resposta.status(404).json({ mensagem: 'Registro nao encontrado.' });
        return;
      }

      if (
        registroEhRegraCritica(entidade, registroExistente)
        && statusSolicitaInativacao(corpo.status)
      ) {
        resposta.status(400).json({ mensagem: criarMensagemRegraCritica(entidade) });
        return;
      }

      const registroAtualizado = await atualizarRegistro(
        entidade,
        requisicao.params.id,
        corpo
      );

      resposta.json(registroAtualizado);
    } catch (erro) {
      if (erro.statusCode === 400) {
        resposta.status(400).json({ mensagem: erro.message });
        return;
      }

      resposta.status(500).json({ mensagem: criarMensagemErro(erro) });
    }
  });

  rota.delete('/:id', async (requisicao, resposta) => {
    try {
      const registroExistente = await consultarRegistroPorId(
        entidade,
        requisicao.params.id
      );

      if (!registroExistente) {
        resposta.status(404).json({ mensagem: 'Registro nao encontrado.' });
        return;
      }

      if (registroEhRegraCritica(entidade, registroExistente)) {
        resposta.status(400).json({ mensagem: criarMensagemRegraCritica(entidade) });
        return;
      }

      await excluirRegistro(entidade, requisicao.params.id);
      resposta.status(204).send();
    } catch (erro) {
      resposta.status(500).json({ mensagem: criarMensagemErro(erro) });
    }
  });

  return rota;
}

module.exports = {
  criarRotaCrud
};
