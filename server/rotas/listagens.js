const express = require('express');
const { consultarTodos } = require('../configuracoes/banco');
const { ehCaminhoImagemLocal } = require('../utilitarios/imagens');
const { montarUrlArquivo } = require('../utilitarios/urlApi');
const {
  adicionarFiltroBusca,
  adicionarFiltroIgual,
  adicionarFiltroLista,
  adicionarFiltroPeriodo,
  montarWhere
} = require('../utilitarios/filtrosSql');
const {
  normalizarEntradaFornecedor,
  normalizarListaSaidaFornecedor
} = require('../utilitarios/compatibilidadeFornecedor');

const rotaListagens = express.Router();

async function listarFornecedores(requisicao, resposta) {
  try {
    const clausulas = [];
    const parametros = [];
    const query = normalizarEntradaFornecedor(requisicao.query);

    adicionarFiltroBusca(clausulas, parametros, query.search, [
      'CAST(fornecedor.idFornecedor AS TEXT)',
      'CAST(fornecedor.codigoAlternativo AS TEXT)',
      'fornecedor.nomeFantasia',
      'fornecedor.razaoSocial',
      'fornecedor.cnpj',
      'fornecedor.cidade',
      'fornecedor.estado',
      'fornecedor.email',
      'grupoEmpresa.descricao',
      'conceitoFornecedor.descricao',
      'contatoPrincipal.nome',
      'contatoPrincipal.email',
      'comprador.nome'
    ]);
    adicionarFiltroLista(clausulas, parametros, 'fornecedor.estado', query.estado);
    adicionarFiltroIgual(clausulas, parametros, 'fornecedor.cidade', query.cidade);
    adicionarFiltroIgual(clausulas, parametros, 'fornecedor.idGrupoEmpresa', query.idGrupoEmpresa, Number);
    adicionarFiltroLista(clausulas, parametros, 'fornecedor.idRamo', query.idRamo, Number);
    adicionarFiltroLista(clausulas, parametros, 'fornecedor.idComprador', query.idComprador, Number);
    adicionarFiltroLista(clausulas, parametros, 'fornecedor.tipo', query.tipo);
    adicionarFiltroLista(clausulas, parametros, 'fornecedor.status', query.status, Number);

    const registros = await consultarTodos(`
      SELECT
        fornecedor.*,
        COALESCE(grupoEmpresa.descricao, '') AS nomeGrupoEmpresa,
        COALESCE(conceitoFornecedor.descricao, '') AS nomeConceito,
        COALESCE(ramoAtividade.descricao, '') AS nomeRamo,
        COALESCE(comprador.nome, '') AS nomeComprador,
        COALESCE(contatoPrincipal.nome, '') AS nomeContatoPrincipal,
        COALESCE(contatoPrincipal.email, '') AS emailContatoPrincipal
      FROM fornecedor
      LEFT JOIN grupoEmpresa ON grupoEmpresa.idGrupoEmpresa = fornecedor.idGrupoEmpresa
      LEFT JOIN conceitoFornecedor ON conceitoFornecedor.idConceito = fornecedor.idConceito
      LEFT JOIN ramoAtividade ON ramoAtividade.idRamo = fornecedor.idRamo
      LEFT JOIN comprador ON comprador.idComprador = fornecedor.idComprador
      LEFT JOIN contato AS contatoPrincipal
        ON contatoPrincipal.idFornecedor = fornecedor.idFornecedor
       AND contatoPrincipal.principal = 1
      ${montarWhere(clausulas)}
      ORDER BY fornecedor.idFornecedor DESC
    `, parametros);

    resposta.json(normalizarListaSaidaFornecedor(registros.map(normalizarRegistroImagemListagem)));
  } catch (_erro) {
    resposta.status(500).json({ mensagem: 'Ocorreu um erro ao processar a requisicao.' });
  }
}

rotaListagens.get('/fornecedores', listarFornecedores);
rotaListagens.get('/clientes', listarFornecedores);

rotaListagens.get('/produtos', async (requisicao, resposta) => {
  try {
    const clausulas = [];
    const parametros = [];
    const query = normalizarEntradaFornecedor(requisicao.query);

    adicionarFiltroBusca(clausulas, parametros, query.search, [
      'CAST(produto.idProduto AS TEXT)',
      'produto.referencia',
      'produto.descricao',
      'CAST(produto.preco AS TEXT)',
      'grupoProduto.descricao',
      'marca.descricao',
      'unidadeMedida.descricao'
    ]);
    adicionarFiltroLista(clausulas, parametros, 'produto.idGrupo', query.idGrupo, Number);
    adicionarFiltroLista(clausulas, parametros, 'produto.idMarca', query.idMarca, Number);
    adicionarFiltroLista(clausulas, parametros, 'produto.idUnidade', query.idUnidade, Number);
    adicionarFiltroLista(clausulas, parametros, 'produto.status', query.status, Number);

    const registros = await consultarTodos(`
      SELECT
        produto.*,
        COALESCE(grupoProduto.descricao, '') AS nomeGrupo,
        COALESCE(marca.descricao, '') AS nomeMarca,
        COALESCE(unidadeMedida.descricao, '') AS nomeUnidade
      FROM produto
      LEFT JOIN grupoProduto ON grupoProduto.idGrupo = produto.idGrupo
      LEFT JOIN marca ON marca.idMarca = produto.idMarca
      LEFT JOIN unidadeMedida ON unidadeMedida.idUnidade = produto.idUnidade
      ${montarWhere(clausulas)}
      ORDER BY produto.idProduto DESC
    `, parametros);

    resposta.json(registros.map(normalizarRegistroImagemListagem));
  } catch (_erro) {
    resposta.status(500).json({ mensagem: 'Ocorreu um erro ao processar a requisicao.' });
  }
});

rotaListagens.get('/atendimentos', async (requisicao, resposta) => {
  try {
    const clausulas = [];
    const parametros = [];
    const query = normalizarEntradaFornecedor(requisicao.query);

    adicionarFiltroBusca(clausulas, parametros, query.search, [
      'atendimento.assunto',
      'atendimento.descricao',
      'fornecedor.nomeFantasia',
      'fornecedor.razaoSocial',
      'contato.nome',
      'tipoAtendimento.descricao',
      'canalAtendimento.descricao',
      'origemAtendimento.descricao',
      'usuario.nome',
      'comprador.nome'
    ]);
    adicionarFiltroIgual(clausulas, parametros, 'atendimento.idFornecedor', query.idFornecedor, Number);
    adicionarFiltroLista(clausulas, parametros, 'atendimento.idUsuario', query.idUsuario, Number);
    adicionarFiltroLista(clausulas, parametros, 'fornecedor.idComprador', query.idCompradorFornecedor, Number);
    adicionarFiltroLista(clausulas, parametros, 'atendimento.idTipoAtendimento', query.idTipoAtendimento, Number);
    adicionarFiltroLista(clausulas, parametros, 'atendimento.idCanalAtendimento', query.idCanalAtendimento, Number);
    adicionarFiltroLista(clausulas, parametros, 'atendimento.idOrigemAtendimento', query.idOrigemAtendimento, Number);
    adicionarFiltroPeriodo(clausulas, parametros, 'atendimento.data', query.dataInicio, query.dataFim);
    adicionarFiltroPeriodo(clausulas, parametros, 'atendimento.horaInicio', query.horaInicioFiltro, query.horaFimFiltro);

    if (query.escopoIdComprador && query.escopoIdUsuario) {
      clausulas.push('(fornecedor.idComprador = ? OR atendimento.idUsuario = ?)');
      parametros.push(Number(query.escopoIdComprador), Number(query.escopoIdUsuario));
    }

    const registros = await consultarTodos(`
      SELECT
        atendimento.*,
        COALESCE(fornecedor.nomeFantasia, fornecedor.razaoSocial, '') AS nomeFornecedor,
        COALESCE(contato.nome, '') AS nomeContato,
        COALESCE(usuario.nome, '') AS nomeUsuario,
        fornecedor.idComprador AS idCompradorFornecedor,
        COALESCE(comprador.nome, '') AS nomeCompradorFornecedor,
        COALESCE(tipoAtendimento.descricao, '') AS nomeTipoAtendimento,
        COALESCE(canalAtendimento.descricao, '') AS nomeCanalAtendimento,
        COALESCE(origemAtendimento.descricao, '') AS nomeOrigemAtendimento
      FROM atendimento
      LEFT JOIN fornecedor ON fornecedor.idFornecedor = atendimento.idFornecedor
      LEFT JOIN contato ON contato.idContato = atendimento.idContato
      LEFT JOIN usuario ON usuario.idUsuario = atendimento.idUsuario
      LEFT JOIN comprador ON comprador.idComprador = fornecedor.idComprador
      LEFT JOIN tipoAtendimento ON tipoAtendimento.idTipoAtendimento = atendimento.idTipoAtendimento
      LEFT JOIN canalAtendimento ON canalAtendimento.idCanalAtendimento = atendimento.idCanalAtendimento
      LEFT JOIN origemAtendimento ON origemAtendimento.idOrigemAtendimento = atendimento.idOrigemAtendimento
      ${montarWhere(clausulas)}
      ORDER BY atendimento.idAtendimento DESC
    `, parametros);

    resposta.json(normalizarListaSaidaFornecedor(registros));
  } catch (_erro) {
    resposta.status(500).json({ mensagem: 'Ocorreu um erro ao processar a requisicao.' });
  }
});

module.exports = {
  rotaListagens
};

function normalizarRegistroImagemListagem(registro) {
  if (!registro) {
    return null;
  }

  return {
    ...registro,
    imagem: normalizarCaminhoImagemListagem(registro.imagem)
  };
}

function normalizarCaminhoImagemListagem(valorImagem) {
  if (!ehCaminhoImagemLocal(valorImagem)) {
    return valorImagem || '';
  }

  return montarUrlArquivo(valorImagem);
}
