const express = require('express');
const cors = require('cors');
const { entidades } = require('./configuracoes/entidades');
const { criarRotaCrud } = require('./rotas/crud');

const app = express();

app.use(cors());
app.use(express.json());

entidades.forEach((entidade) => {
  app.use(entidade.rota, criarRotaCrud(entidade));
});

module.exports = app;
