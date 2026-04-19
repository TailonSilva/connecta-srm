const { consultarTodos, consultarUm, executar } = require('../configuracoes/banco');

async function sincronizarGrupoEmpresaDoFornecedor(idFornecedor, idGrupoEmpresa) {
  if (!idFornecedor) {
    return;
  }

  await removerContatosHerdadosDoFornecedor(idFornecedor);

  if (!idGrupoEmpresa) {
    return;
  }

   const grupoEmpresa = await consultarUm(
    `SELECT idGrupoEmpresa
     FROM grupoEmpresa
     WHERE idGrupoEmpresa = ? AND status = 1`,
    [idGrupoEmpresa]
  );

  if (!grupoEmpresa) {
    return;
  }

  const contatosGrupo = await consultarTodos(
    `SELECT  *
     FROM contatoGrupoEmpresa
     WHERE idGrupoEmpresa = ?`,
    [idGrupoEmpresa]
  );

  for (const contatoGrupo of contatosGrupo) {
    await sincronizarContatoGrupoParaFornecedor(idFornecedor, contatoGrupo);
  }
}

async function sincronizarContatoGrupoParaFornecedoresVinculados(idContatoGrupoEmpresa) {
  if (!idContatoGrupoEmpresa) {
    return;
  }

  const contatoGrupo = await consultarUm(
    `SELECT *
     FROM contatoGrupoEmpresa
     WHERE idContatoGrupoEmpresa = ?`,
    [idContatoGrupoEmpresa]
  );

  if (!contatoGrupo) {
    return;
  }

  const fornecedores = await consultarTodos(
    `SELECT idFornecedor
     FROM fornecedor
     WHERE idGrupoEmpresa = ?`,
    [contatoGrupo.idGrupoEmpresa]
  );

  for (const fornecedor of fornecedores) {
    await sincronizarContatoGrupoParaFornecedor(fornecedor.idFornecedor, contatoGrupo);
  }
}

async function sincronizarGrupoEmpresaParaFornecedoresVinculados(idGrupoEmpresa) {
  if (!idGrupoEmpresa) {
    return;
  }

  const fornecedores = await consultarTodos(
    `SELECT idFornecedor
     FROM fornecedor
     WHERE idGrupoEmpresa = ?`,
    [idGrupoEmpresa]
  );

  for (const fornecedor of fornecedores) {
    await sincronizarGrupoEmpresaDoFornecedor(fornecedor.idFornecedor, idGrupoEmpresa);
  }
}

async function sincronizarContatoGrupoParaFornecedor(idFornecedor, contatoGrupo) {
  const existente = await consultarUm(
    `SELECT idContato
     FROM contato
     WHERE idFornecedor = ? AND idContatoGrupoEmpresaOrigem = ?`,
    [idFornecedor, contatoGrupo.idContatoGrupoEmpresa]
  );

  const payload = [
    contatoGrupo.nome,
    contatoGrupo.cargo || null,
    contatoGrupo.email || null,
    contatoGrupo.telefone || null,
    contatoGrupo.whatsapp || null,
    contatoGrupo.status ? 1 : 0,
    contatoGrupo.principal ? 1 : 0,
    1,
    contatoGrupo.idContatoGrupoEmpresa,
    idFornecedor
  ];

  if (existente?.idContato) {
    await executar(
      `UPDATE contato
       SET nome = ?,
           cargo = ?,
           email = ?,
           telefone = ?,
           whatsapp = ?,
           status = ?,
           principal = ?,
           contatoVinculadoGrupo = ?,
           idContatoGrupoEmpresaOrigem = ?
       WHERE idContato = ?`,
      [...payload.slice(0, 9), existente.idContato]
    );
    return;
  }

  await executar(
    `INSERT INTO contato (
      idFornecedor,
      nome,
      cargo,
      email,
      telefone,
      whatsapp,
      status,
      principal,
      contatoVinculadoGrupo,
      idContatoGrupoEmpresaOrigem
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [
      idFornecedor,
      contatoGrupo.nome,
      contatoGrupo.cargo || null,
      contatoGrupo.email || null,
      contatoGrupo.telefone || null,
      contatoGrupo.whatsapp || null,
      contatoGrupo.status ? 1 : 0,
      contatoGrupo.principal ? 1 : 0,
      1,
      contatoGrupo.idContatoGrupoEmpresa
    ]
  );
}

async function removerContatosHerdadosDoFornecedor(idFornecedor) {
  await executar(
    `UPDATE contato
     SET status = 0,
         principal = 0
     WHERE idFornecedor = ? AND contatoVinculadoGrupo = 1`,
    [idFornecedor]
  );
}

module.exports = {
  sincronizarGrupoEmpresaDoFornecedor,
  sincronizarGrupoEmpresaParaFornecedoresVinculados,
  sincronizarContatoGrupoParaFornecedoresVinculados,
  removerContatosHerdadosDoFornecedor
};
