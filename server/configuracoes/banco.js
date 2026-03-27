const path = require('node:path');
const fs = require('node:fs');
const sqlite3 = require('sqlite3').verbose();

const diretorioDados = process.env.CRM_DATA_DIR
  ? path.resolve(process.env.CRM_DATA_DIR)
  : path.resolve(__dirname, '..', '..', 'data');

if (!fs.existsSync(diretorioDados)) {
  fs.mkdirSync(diretorioDados, { recursive: true });
}

const caminhoBanco = path.join(diretorioDados, 'crm.sqlite');
const banco = new sqlite3.Database(caminhoBanco);

banco.serialize(() => {
  banco.run('PRAGMA foreignKeys = ON');

  banco.run(`
    CREATE TABLE IF NOT EXISTS ramoAtividade (
      idRamo INTEGER PRIMARY KEY AUTOINCREMENT,
      descricao VARCHAR(150) NOT NULL,
      status BOOLEAN NOT NULL DEFAULT 1
    )
  `);

  banco.run(`
    CREATE TABLE IF NOT EXISTS vendedor (
      idVendedor INTEGER PRIMARY KEY AUTOINCREMENT,
      nome VARCHAR(150) NOT NULL,
      email VARCHAR(150) NOT NULL,
      status BOOLEAN NOT NULL DEFAULT 1
    )
  `);

  banco.run(`
    CREATE TABLE IF NOT EXISTS grupoProduto (
      idGrupo INTEGER PRIMARY KEY AUTOINCREMENT,
      descricao VARCHAR(150) NOT NULL,
      status BOOLEAN NOT NULL DEFAULT 1
    )
  `);

  banco.run(`
    CREATE TABLE IF NOT EXISTS marca (
      idMarca INTEGER PRIMARY KEY AUTOINCREMENT,
      descricao VARCHAR(150) NOT NULL,
      status BOOLEAN NOT NULL DEFAULT 1
    )
  `);

  banco.run(`
    CREATE TABLE IF NOT EXISTS unidadeMedida (
      idUnidade INTEGER PRIMARY KEY AUTOINCREMENT,
      descricao VARCHAR(50) NOT NULL,
      status BOOLEAN NOT NULL DEFAULT 1
    )
  `);

  banco.run(`
    CREATE TABLE IF NOT EXISTS cliente (
      idCliente INTEGER PRIMARY KEY AUTOINCREMENT,
      idVendedor INTEGER NOT NULL,
      idRamo INTEGER NOT NULL,
      razaoSocial VARCHAR(255) NOT NULL,
      nomeFantasia VARCHAR(255) NOT NULL,
      tipo VARCHAR(20) NOT NULL,
      cnpj VARCHAR(18) NOT NULL,
      inscricaoEstadual VARCHAR(20),
      status BOOLEAN NOT NULL DEFAULT 1,
      email VARCHAR(150),
      telefone VARCHAR(20),
      logradouro VARCHAR(255),
      numero VARCHAR(10),
      complemento VARCHAR(100),
      bairro VARCHAR(100),
      cidade VARCHAR(100),
      estado CHAR(2),
      cep VARCHAR(10),
      observacao TEXT,
      imagem VARCHAR(255),
      dataCriacao TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (idVendedor) REFERENCES vendedor (idVendedor),
      FOREIGN KEY (idRamo) REFERENCES ramoAtividade (idRamo)
    )
  `);

  banco.run(`
    CREATE TABLE IF NOT EXISTS contato (
      idContato INTEGER PRIMARY KEY AUTOINCREMENT,
      idCliente INTEGER NOT NULL,
      nome VARCHAR(150) NOT NULL,
      cargo VARCHAR(100),
      email VARCHAR(150),
      telefone VARCHAR(20),
      whatsapp VARCHAR(20),
      status BOOLEAN NOT NULL DEFAULT 1,
      principal BOOLEAN NOT NULL DEFAULT 0,
      FOREIGN KEY (idCliente) REFERENCES cliente (idCliente)
    )
  `);

  banco.run(`
    CREATE TABLE IF NOT EXISTS produto (
      idProduto INTEGER PRIMARY KEY AUTOINCREMENT,
      referencia VARCHAR(100) NOT NULL,
      descricao VARCHAR(255) NOT NULL,
      idGrupo INTEGER NOT NULL,
      idMarca INTEGER NOT NULL,
      idUnidade INTEGER NOT NULL,
      preco DECIMAL(10,2) NOT NULL DEFAULT 0,
      imagem VARCHAR(255),
      status BOOLEAN NOT NULL DEFAULT 1,
      dataCriacao TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (idGrupo) REFERENCES grupoProduto (idGrupo),
      FOREIGN KEY (idMarca) REFERENCES marca (idMarca),
      FOREIGN KEY (idUnidade) REFERENCES unidadeMedida (idUnidade)
    )
  `);
});

function consultarTodos(sql, parametros = []) {
  return new Promise((resolve, reject) => {
    banco.all(sql, parametros, (erro, linhas) => {
      if (erro) {
        reject(erro);
        return;
      }

      resolve(linhas);
    });
  });
}

function consultarUm(sql, parametros = []) {
  return new Promise((resolve, reject) => {
    banco.get(sql, parametros, (erro, linha) => {
      if (erro) {
        reject(erro);
        return;
      }

      resolve(linha || null);
    });
  });
}

function executar(sql, parametros = []) {
  return new Promise((resolve, reject) => {
    banco.run(sql, parametros, function aoExecutar(erro) {
      if (erro) {
        reject(erro);
        return;
      }

      resolve({ id: this.lastID, alteracoes: this.changes });
    });
  });
}

module.exports = {
  banco,
  caminhoBanco,
  consultarUm,
  consultarTodos,
  executar
};
