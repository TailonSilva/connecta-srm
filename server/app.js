const express = require('express');
const cors = require('cors');
const { entidades } = require('./configuracoes/entidades');
const { rotaAutenticacao } = require('./rotas/autenticacao');
const { rotaAgendamentos } = require('./rotas/agendamentos');
const { rotaAtualizacaoSistema } = require('./rotas/atualizacaoSistema');
const { rotaImportacaoCadastros } = require('./rotas/importacaoCadastros');
const { rotaListagens } = require('./rotas/listagens');
const { rotaCotacoes } = require('./rotas/cotacoes');
const { rotaOrdensCompra } = require('./rotas/ordensCompra');
const { criarRotaCrud } = require('./rotas/crud');
const { diretorioImagens } = require('./utilitarios/imagens');

const app = express();

app.use(cors());
app.use(express.json({ limit: '15mb' }));
app.use('/api/arquivos/imagens', express.static(diretorioImagens));
app.use('/api/auth', rotaAutenticacao);
app.use('/api/agendamentos', rotaAgendamentos);
app.use('/api/atualizacaoSistema', rotaAtualizacaoSistema);
app.use('/api/importacao', rotaImportacaoCadastros);
app.use('/api/listagens', rotaListagens);
app.use('/api/cotacoes', rotaCotacoes);
app.use('/api/orcamentos', rotaCotacoes);
app.use('/api/ordensCompra', rotaOrdensCompra);
app.use('/api/pedidos', rotaOrdensCompra);

entidades.forEach((entidade) => {
  app.use(entidade.rota, criarRotaCrud(entidade));
});

const entidadeFornecedor = entidades.find((entidade) => entidade.nome === 'fornecedor');
const entidadeComprador = entidades.find((entidade) => entidade.nome === 'comprador');
const entidadeConceitoFornecedor = entidades.find((entidade) => entidade.nome === 'conceitoFornecedor');
const entidadeEtapaCotacao = entidades.find((entidade) => entidade.nome === 'etapaCotacao');
const entidadeCampoCotacao = entidades.find((entidade) => entidade.nome === 'campoCotacaoConfiguravel');
const entidadeItemCotacao = entidades.find((entidade) => entidade.nome === 'itemCotacao');
const entidadeValorCampoCotacao = entidades.find((entidade) => entidade.nome === 'valorCampoCotacao');
const entidadeTipoOrdemCompra = entidades.find((entidade) => entidade.nome === 'tipoOrdemCompra');
const entidadeEtapaOrdemCompra = entidades.find((entidade) => entidade.nome === 'etapaOrdemCompra');
const entidadeCampoOrdemCompra = entidades.find((entidade) => entidade.nome === 'campoOrdemCompraConfiguravel');
const entidadeItemOrdemCompra = entidades.find((entidade) => entidade.nome === 'itemOrdemCompra');
const entidadeValorCampoOrdemCompra = entidades.find((entidade) => entidade.nome === 'valorCampoOrdemCompra');

if (entidadeFornecedor) {
  app.use('/api/clientes', criarRotaCrud({ ...entidadeFornecedor, rota: '/api/clientes' }));
}

if (entidadeComprador) {
  app.use('/api/vendedores', criarRotaCrud({ ...entidadeComprador, rota: '/api/vendedores' }));
}

if (entidadeConceitoFornecedor) {
  app.use('/api/conceitosCliente', criarRotaCrud({ ...entidadeConceitoFornecedor, rota: '/api/conceitosCliente' }));
}

if (entidadeEtapaCotacao) {
  app.use('/api/etapasOrcamento', criarRotaCrud({ ...entidadeEtapaCotacao, rota: '/api/etapasOrcamento' }));
}

if (entidadeCampoCotacao) {
  app.use('/api/camposOrcamento', criarRotaCrud({ ...entidadeCampoCotacao, rota: '/api/camposOrcamento' }));
}

if (entidadeItemCotacao) {
  app.use('/api/itensOrcamento', criarRotaCrud({ ...entidadeItemCotacao, rota: '/api/itensOrcamento' }));
}

if (entidadeValorCampoCotacao) {
  app.use('/api/valoresCamposOrcamento', criarRotaCrud({ ...entidadeValorCampoCotacao, rota: '/api/valoresCamposOrcamento' }));
}

if (entidadeTipoOrdemCompra) {
  app.use('/api/tiposPedido', criarRotaCrud({ ...entidadeTipoOrdemCompra, rota: '/api/tiposPedido' }));
}

if (entidadeEtapaOrdemCompra) {
  app.use('/api/etapasPedido', criarRotaCrud({ ...entidadeEtapaOrdemCompra, rota: '/api/etapasPedido' }));
}

if (entidadeCampoOrdemCompra) {
  app.use('/api/camposPedido', criarRotaCrud({ ...entidadeCampoOrdemCompra, rota: '/api/camposPedido' }));
}

if (entidadeItemOrdemCompra) {
  app.use('/api/itensPedido', criarRotaCrud({ ...entidadeItemOrdemCompra, rota: '/api/itensPedido' }));
}

if (entidadeValorCampoOrdemCompra) {
  app.use('/api/valoresCamposPedido', criarRotaCrud({ ...entidadeValorCampoOrdemCompra, rota: '/api/valoresCamposPedido' }));
}

module.exports = app;
