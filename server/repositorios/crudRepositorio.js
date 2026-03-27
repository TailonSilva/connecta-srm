const { consultarTodos, consultarUm, executar } = require('../configuracoes/banco');

function montarCampos(payload, camposPermitidos) {
  return Object.entries(payload).filter(
    ([campo, valor]) =>
      camposPermitidos.includes(campo) && valor !== undefined
  );
}

async function listarRegistros(entidade) {
  return consultarTodos(
    `SELECT * FROM ${entidade.nome} ORDER BY ${entidade.chavePrimaria} DESC`
  );
}

async function consultarRegistroPorId(entidade, id) {
  return consultarUm(
    `SELECT * FROM ${entidade.nome} WHERE ${entidade.chavePrimaria} = ?`,
    [id]
  );
}

async function inserirRegistro(entidade, payload) {
  const campos = montarCampos(payload, entidade.camposPermitidos);
  const nomes = campos.map(([campo]) => campo);
  const placeholders = nomes.map(() => '?').join(', ');
  const valores = campos.map(([, valor]) => valor);

  const resultado = await executar(
    `INSERT INTO ${entidade.nome} (${nomes.join(', ')}) VALUES (${placeholders})`,
    valores
  );

  return consultarRegistroPorId(entidade, resultado.id);
}

async function atualizarRegistro(entidade, id, payload) {
  const campos = montarCampos(payload, entidade.camposPermitidos);
  const declaracoes = campos.map(([campo]) => `${campo} = ?`);
  const valores = campos.map(([, valor]) => valor);

  await executar(
    `UPDATE ${entidade.nome} SET ${declaracoes.join(', ')} WHERE ${entidade.chavePrimaria} = ?`,
    [...valores, id]
  );

  return consultarRegistroPorId(entidade, id);
}

async function excluirRegistro(entidade, id) {
  return executar(
    `DELETE FROM ${entidade.nome} WHERE ${entidade.chavePrimaria} = ?`,
    [id]
  );
}

module.exports = {
  listarRegistros,
  consultarRegistroPorId,
  inserirRegistro,
  atualizarRegistro,
  excluirRegistro,
  montarCampos
};
