const express = require('express');
const { consultarUm, executar } = require('../configuracoes/banco');

const rotaAtualizacaoSistema = express.Router();
const urlRepositorioPadrao = 'https://github.com/TailonSilva/connecta-crm';

rotaAtualizacaoSistema.get('/', async (_requisicao, resposta) => {
  try {
    const configuracao = await obterConfiguracaoAtualizacaoSistema();
    resposta.json(configuracao);
  } catch (erro) {
    resposta.status(500).json({ mensagem: 'Nao foi possivel carregar a configuracao de atualizacao.' });
  }
});

rotaAtualizacaoSistema.put('/', async (requisicao, resposta) => {
  try {
    const urlRepositorio = normalizarUrlRepositorio(requisicao.body?.urlRepositorio);

    await executar(
      `
        UPDATE configuracaoAtualizacaoSistema
        SET
          urlRepositorio = ?,
          dataAtualizacao = CURRENT_TIMESTAMP
        WHERE idConfiguracaoAtualizacao = 1
      `,
      [urlRepositorio]
    );

    const configuracao = await obterConfiguracaoAtualizacaoSistema();
    resposta.json(configuracao);
  } catch (erro) {
    if (erro.statusCode === 400) {
      resposta.status(400).json({ mensagem: erro.message });
      return;
    }

    resposta.status(500).json({ mensagem: 'Nao foi possivel salvar a configuracao de atualizacao.' });
  }
});

async function obterConfiguracaoAtualizacaoSistema() {
  const configuracao = await consultarUm(
    `
      SELECT
        idConfiguracaoAtualizacao,
        urlRepositorio,
        dataAtualizacao
      FROM configuracaoAtualizacaoSistema
      WHERE idConfiguracaoAtualizacao = 1
    `
  );

  return configuracao || {
    idConfiguracaoAtualizacao: 1,
    urlRepositorio: urlRepositorioPadrao,
    dataAtualizacao: null
  };
}

function normalizarUrlRepositorio(valor) {
  const urlRepositorio = String(valor || '').trim();

  if (!urlRepositorio) {
    throw criarErroValidacao('Informe o link do repositorio no GitHub.');
  }

  const repositorio = extrairRepositorioGithub(urlRepositorio);

  if (!repositorio) {
    throw criarErroValidacao('Informe um link valido de repositorio ou release do GitHub.');
  }

  return `https://github.com/${repositorio.owner}/${repositorio.repo}`;
}

function extrairRepositorioGithub(urlRepositorio) {
  try {
    const url = new URL(urlRepositorio);

    if (url.hostname !== 'github.com' && url.hostname !== 'www.github.com') {
      return null;
    }

    const segmentos = url.pathname.split('/').filter(Boolean);

    if (segmentos.length < 2) {
      return null;
    }

    return {
      owner: segmentos[0],
      repo: segmentos[1]
    };
  } catch (_erro) {
    return null;
  }
}

function criarErroValidacao(mensagem) {
  const erro = new Error(mensagem);
  erro.statusCode = 400;
  return erro;
}

module.exports = {
  rotaAtualizacaoSistema
};
