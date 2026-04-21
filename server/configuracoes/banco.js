const path = require('node:path');
const fs = require('node:fs');
const sqlite3 = require('sqlite3').verbose();

const ID_ETAPA_COTACAO_FECHAMENTO = 1;
const ID_ETAPA_COTACAO_FECHADA_SEM_ORDEM_COMPRA = 2;
const ID_ETAPA_COTACAO_ORDEM_COMPRA_EXCLUIDA = 3;
const ID_ETAPA_COTACAO_RECUSADO = 4;
const ID_ETAPA_ORDEM_COMPRA_ENTREGUE = 5;
const ID_TIPO_ORDEM_COMPRA_PADRAO = 1;
const ID_CONCEITO_FORNECEDOR_SEM_CONCEITO = 1;
const ID_STATUS_VISITA_AGENDADO = 1;
const ID_STATUS_VISITA_CONFIRMADO = 2;
const ID_STATUS_VISITA_REALIZADO = 3;
const ID_STATUS_VISITA_CANCELADO = 4;
const ID_STATUS_VISITA_NAO_COMPARECEU = 5;

const diretorioDados = process.env.CRM_DATA_DIR
  ? path.resolve(process.env.CRM_DATA_DIR)
  : path.resolve(__dirname, '..', '..', 'data');

if (!fs.existsSync(diretorioDados)) {
  fs.mkdirSync(diretorioDados, { recursive: true });
}

const caminhoBanco = path.join(diretorioDados, 'srm.sqlite');
const banco = new sqlite3.Database(caminhoBanco);

banco.serialize(() => {
  banco.run('PRAGMA foreign_keys = OFF');

  migrarNomeTabela('conceitoCliente', 'conceitoFornecedor');
  migrarNomeTabela('cliente', 'fornecedor');
  migrarNomeTabela('vendedor', 'comprador');
  migrarNomeColuna('comprador', 'idVendedor', 'idComprador');
  migrarNomeColuna('usuario', 'idVendedor', 'idComprador');
  migrarNomeColuna('fornecedor', 'idVendedor', 'idComprador');
  migrarNomeColuna('cotacao', 'idVendedor', 'idComprador');
  migrarNomeColuna('ordemCompra', 'idVendedor', 'idComprador');
  migrarNomeColuna('atendimento', 'idVendedor', 'idComprador');
  migrarNomeColuna('ordemCompra', 'nomeVendedorSnapshot', 'nomeCompradorSnapshot');
  migrarNomeColuna('agendamento', 'idCliente', 'idFornecedor');
  migrarNomeColuna('tipoAgenda', 'obrigarCliente', 'obrigarFornecedor');
  migrarNomeColuna('empresa', 'codigoPrincipalCliente', 'codigoPrincipalFornecedor');
  migrarNomeColuna('empresa', 'colunasGridClientes', 'colunasGridFornecedores');
  migrarNomeColuna('contato', 'idCliente', 'idFornecedor');
  migrarNomeColuna('atendimento', 'idCliente', 'idFornecedor');
  migrarNomeColuna('produto', 'preco', 'custo');
  executarMigracaoNome(`
    UPDATE empresa
    SET colunasGridProdutos = REPLACE(colunasGridProdutos, '"preco"', '"custo"')
    WHERE colunasGridProdutos LIKE '%"preco"%'
  `);
  executarMigracaoNome(`
    UPDATE empresa
    SET colunasGridProdutos = REPLACE(colunasGridProdutos, '"rotulo":"Preco"', '"rotulo":"Custo"')
    WHERE colunasGridProdutos LIKE '%"rotulo":"Preco"%'
  `);
  migrarNomeTabela('etapaOrcamento', 'etapaCotacao');
  migrarNomeTabela('campoOrcamentoConfiguravel', 'campoCotacaoConfiguravel');
  migrarNomeTabela('orcamento', 'cotacao');
  migrarNomeTabela('itemOrcamento', 'itemCotacao');
  migrarNomeTabela('valorCampoOrcamento', 'valorCampoCotacao');
  migrarNomeColuna('cotacao', 'idCliente', 'idFornecedor');
  migrarNomeColuna('etapaCotacao', 'idEtapaOrcamento', 'idEtapaCotacao');
  migrarNomeColuna('campoCotacaoConfiguravel', 'idCampoOrcamento', 'idCampoCotacao');
  migrarNomeColuna('cotacao', 'idOrcamento', 'idCotacao');
  migrarNomeColuna('cotacao', 'idEtapaOrcamento', 'idEtapaCotacao');
  migrarNomeColuna('itemCotacao', 'idItemOrcamento', 'idItemCotacao');
  migrarNomeColuna('itemCotacao', 'idOrcamento', 'idCotacao');
  migrarNomeColuna('valorCampoCotacao', 'idValorCampoOrcamento', 'idValorCampoCotacao');
  migrarNomeColuna('valorCampoCotacao', 'idOrcamento', 'idCotacao');
  migrarNomeColuna('valorCampoCotacao', 'idCampoOrcamento', 'idCampoCotacao');
  migrarNomeColuna('empresa', 'diasValidadeOrcamento', 'diasValidadeCotacao');
  migrarNomeColuna('empresa', 'etapasFiltroPadraoOrcamento', 'etapasFiltroPadraoCotacao');
  migrarNomeColuna('empresa', 'colunasGridOrcamentos', 'colunasGridCotacoes');
  migrarNomeColuna('empresa', 'graficosPaginaInicialOrcamentos', 'graficosPaginaInicialCotacoes');
  migrarNomeColuna('empresa', 'graficosPaginaInicialVendas', 'graficosPaginaInicialOrdensCompra');
  migrarNomeColuna('etapaCotacao', 'consideraFunilVendas', 'consideraFunilCotacoes');
  migrarNomeColuna('empresa', 'corPrimariaOrcamento', 'corPrimariaCotacao');
  migrarNomeColuna('empresa', 'corSecundariaOrcamento', 'corSecundariaCotacao');
  migrarNomeColuna('empresa', 'corDestaqueOrcamento', 'corDestaqueCotacao');
  migrarNomeColuna('empresa', 'destaqueItemOrcamentoPdf', 'destaqueItemCotacaoPdf');
  migrarNomeColuna('empresa', 'assuntoEmailOrcamento', 'assuntoEmailCotacao');
  migrarNomeColuna('empresa', 'corpoEmailOrcamento', 'corpoEmailCotacao');
  migrarNomeColuna('empresa', 'assinaturaEmailOrcamento', 'assinaturaEmailCotacao');
  migrarNomeTabela('tipoPedido', 'tipoOrdemCompra');
  migrarNomeTabela('etapaPedido', 'etapaOrdemCompra');
  migrarNomeTabela('campoPedidoConfiguravel', 'campoOrdemCompraConfiguravel');
  migrarNomeTabela('pedido', 'ordemCompra');
  migrarNomeTabela('itemPedido', 'itemOrdemCompra');
  migrarNomeTabela('valorCampoPedido', 'valorCampoOrdemCompra');
  migrarNomeColuna('ordemCompra', 'idCliente', 'idFornecedor');
  migrarNomeColuna('ordemCompra', 'nomeClienteSnapshot', 'nomeFornecedorSnapshot');
  migrarNomeColuna('ordemCompra', 'idOrcamento', 'idCotacao');
  migrarNomeColuna('ordemCompra', 'codigoOrcamentoOrigem', 'codigoCotacaoOrigem');
  migrarNomeColuna('tipoOrdemCompra', 'idTipoPedido', 'idTipoOrdemCompra');
  migrarNomeColuna('ordemCompra', 'idPedido', 'idOrdemCompra');
  migrarNomeColuna('ordemCompra', 'idTipoPedido', 'idTipoOrdemCompra');
  migrarNomeColuna('ordemCompra', 'idEtapaPedido', 'idEtapaOrdemCompra');
  migrarNomeColuna('ordemCompra', 'nomeTipoPedidoSnapshot', 'nomeTipoOrdemCompraSnapshot');
  migrarNomeColuna('ordemCompra', 'nomeEtapaPedidoSnapshot', 'nomeEtapaOrdemCompraSnapshot');
  migrarNomeColuna('itemOrdemCompra', 'idItemPedido', 'idItemOrdemCompra');
  migrarNomeColuna('itemOrdemCompra', 'idPedido', 'idOrdemCompra');
  migrarNomeColuna('campoOrdemCompraConfiguravel', 'idCampoPedido', 'idCampoOrdemCompra');
  migrarNomeColuna('valorCampoOrdemCompra', 'idValorCampoPedido', 'idValorCampoOrdemCompra');
  migrarNomeColuna('valorCampoOrdemCompra', 'idPedido', 'idOrdemCompra');
  migrarNomeColuna('valorCampoOrdemCompra', 'idCampoPedido', 'idCampoOrdemCompra');
  migrarNomeColuna('valorCampoOrdemCompra', 'idCampoOrcamento', 'idCampoCotacao');
  migrarNomeColuna('cotacao', 'idPedidoVinculado', 'idOrdemCompraVinculado');
  migrarNomeColuna('empresa', 'diasEntregaPedido', 'diasEntregaOrdemCompra');
  migrarNomeColuna('empresa', 'colunasGridPedidos', 'colunasGridOrdensCompra');

  banco.run('PRAGMA foreign_keys = ON');

  banco.run(`
    CREATE TABLE IF NOT EXISTS ramoAtividade (
      idRamo INTEGER PRIMARY KEY AUTOINCREMENT,
      descricao VARCHAR(150) NOT NULL,
      status BOOLEAN NOT NULL DEFAULT 1
    )
  `);

  banco.run(`
    CREATE TABLE IF NOT EXISTS conceitoFornecedor (
      idConceito INTEGER PRIMARY KEY AUTOINCREMENT,
      descricao VARCHAR(150) NOT NULL,
      status BOOLEAN NOT NULL DEFAULT 1
    )
  `);

  executarMigracaoNome(`
    INSERT OR IGNORE INTO conceitoFornecedor (idConceito, descricao, status)
    SELECT idConceito, descricao, status
    FROM conceitoCliente
  `);
  executarMigracaoNome('DROP TABLE IF EXISTS conceitoCliente');

  banco.run(`
    CREATE TABLE IF NOT EXISTS comprador (
      idComprador INTEGER PRIMARY KEY AUTOINCREMENT,
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
    CREATE TABLE IF NOT EXISTS grupoEmpresa (
      idGrupoEmpresa INTEGER PRIMARY KEY AUTOINCREMENT,
      descricao VARCHAR(150) NOT NULL,
      status BOOLEAN NOT NULL DEFAULT 1
    )
  `);

  banco.run(`
    CREATE TABLE IF NOT EXISTS contatoGrupoEmpresa (
      idContatoGrupoEmpresa INTEGER PRIMARY KEY AUTOINCREMENT,
      idGrupoEmpresa INTEGER NOT NULL,
      nome VARCHAR(150) NOT NULL,
      cargo VARCHAR(100),
      email VARCHAR(150),
      telefone VARCHAR(20),
      whatsapp VARCHAR(20),
      status BOOLEAN NOT NULL DEFAULT 1,
      principal BOOLEAN NOT NULL DEFAULT 0,
      FOREIGN KEY (idGrupoEmpresa) REFERENCES grupoEmpresa (idGrupoEmpresa)
    )
  `);

  banco.run(`
    CREATE TABLE IF NOT EXISTS tamanho (
      idTamanho INTEGER PRIMARY KEY AUTOINCREMENT,
      descricao VARCHAR(80) NOT NULL,
      status BOOLEAN NOT NULL DEFAULT 1
    )
  `);

  banco.run(`
    CREATE TABLE IF NOT EXISTS grupoProdutoTamanho (
      idGrupoProdutoTamanho INTEGER PRIMARY KEY AUTOINCREMENT,
      idGrupo INTEGER NOT NULL,
      idTamanho INTEGER NOT NULL,
      ordem INTEGER NOT NULL DEFAULT 0,
      FOREIGN KEY (idGrupo) REFERENCES grupoProduto (idGrupo) ON DELETE CASCADE,
      FOREIGN KEY (idTamanho) REFERENCES tamanho (idTamanho)
    )
  `);

  banco.run(`
    CREATE UNIQUE INDEX IF NOT EXISTS indiceGrupoProdutoTamanhoUnico
    ON grupoProdutoTamanho (idGrupo, idTamanho)
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
    CREATE TABLE IF NOT EXISTS localAgenda (
      idLocal INTEGER PRIMARY KEY AUTOINCREMENT,
      descricao VARCHAR(150) NOT NULL,
      status BOOLEAN NOT NULL DEFAULT 1
    )
  `);

  banco.run(`
    CREATE TABLE IF NOT EXISTS tipoRecurso (
      idTipoRecurso INTEGER PRIMARY KEY AUTOINCREMENT,
      descricao VARCHAR(150) NOT NULL,
      status BOOLEAN NOT NULL DEFAULT 1
    )
  `);

  banco.run(`
    CREATE TABLE IF NOT EXISTS recurso (
      idRecurso INTEGER PRIMARY KEY AUTOINCREMENT,
      descricao VARCHAR(150) NOT NULL,
      idTipoRecurso INTEGER NOT NULL,
      status BOOLEAN NOT NULL DEFAULT 1,
      FOREIGN KEY (idTipoRecurso) REFERENCES tipoRecurso (idTipoRecurso)
    )
  `);

  banco.run(`
    CREATE TABLE IF NOT EXISTS agendamento (
      idAgendamento INTEGER PRIMARY KEY AUTOINCREMENT,
      data DATE NOT NULL,
      assunto VARCHAR(255),
      horaInicio VARCHAR(5) NOT NULL,
      horaFim VARCHAR(5) NOT NULL,
      idLocal INTEGER,
      idRecurso INTEGER,
      idFornecedor INTEGER,
      idContato INTEGER,
      idUsuario INTEGER NOT NULL,
      idTipoAgenda INTEGER,
      idStatusVisita INTEGER,
      tipo VARCHAR(100),
      status BOOLEAN NOT NULL DEFAULT 1,
      FOREIGN KEY (idLocal) REFERENCES localAgenda (idLocal),
      FOREIGN KEY (idRecurso) REFERENCES recurso (idRecurso),
      FOREIGN KEY (idFornecedor) REFERENCES fornecedor (idFornecedor),
      FOREIGN KEY (idContato) REFERENCES contato (idContato),
      FOREIGN KEY (idUsuario) REFERENCES usuario (idUsuario),
      FOREIGN KEY (idTipoAgenda) REFERENCES tipoAgenda (idTipoAgenda),
      FOREIGN KEY (idStatusVisita) REFERENCES statusVisita (idStatusVisita)
    )
  `);

  banco.run(`
    CREATE TABLE IF NOT EXISTS agendamentoRecurso (
      idAgendamentoRecurso INTEGER PRIMARY KEY AUTOINCREMENT,
      idAgendamento INTEGER NOT NULL,
      idRecurso INTEGER NOT NULL,
      FOREIGN KEY (idAgendamento) REFERENCES agendamento (idAgendamento) ON DELETE CASCADE,
      FOREIGN KEY (idRecurso) REFERENCES recurso (idRecurso)
    )
  `);

  banco.run(`
    CREATE TABLE IF NOT EXISTS agendamentoUsuario (
      idAgendamentoUsuario INTEGER PRIMARY KEY AUTOINCREMENT,
      idAgendamento INTEGER NOT NULL,
      idUsuario INTEGER NOT NULL,
      FOREIGN KEY (idAgendamento) REFERENCES agendamento (idAgendamento) ON DELETE CASCADE,
      FOREIGN KEY (idUsuario) REFERENCES usuario (idUsuario)
    )
  `);

  banco.run(`
    CREATE TABLE IF NOT EXISTS agendamentoStatusUsuario (
      idAgendamentoStatusUsuario INTEGER PRIMARY KEY AUTOINCREMENT,
      idAgendamento INTEGER NOT NULL,
      idUsuario INTEGER NOT NULL,
      idStatusVisita INTEGER NOT NULL,
      FOREIGN KEY (idAgendamento) REFERENCES agendamento (idAgendamento) ON DELETE CASCADE,
      FOREIGN KEY (idUsuario) REFERENCES usuario (idUsuario),
      FOREIGN KEY (idStatusVisita) REFERENCES statusVisita (idStatusVisita)
    )
  `);

  banco.run(`
    CREATE UNIQUE INDEX IF NOT EXISTS indiceAgendamentoStatusUsuarioUnico
    ON agendamentoStatusUsuario (idAgendamento, idUsuario)
  `);

  banco.run(`
    CREATE TABLE IF NOT EXISTS tipoAgenda (
      idTipoAgenda INTEGER PRIMARY KEY AUTOINCREMENT,
      descricao VARCHAR(100) NOT NULL,
      cor VARCHAR(20) NOT NULL DEFAULT '#EC8702',
      obrigarFornecedor BOOLEAN NOT NULL DEFAULT 0,
      obrigarLocal BOOLEAN NOT NULL DEFAULT 0,
      obrigarRecurso BOOLEAN NOT NULL DEFAULT 0,
      ordem INTEGER NOT NULL DEFAULT 0,
      status BOOLEAN NOT NULL DEFAULT 1
    )
  `);

  banco.run(`
    ALTER TABLE tipoAgenda ADD COLUMN cor VARCHAR(20) NOT NULL DEFAULT '#EC8702'
  `, (erro) => {
    if (erro && !String(erro.message || '').includes('duplicate column name')) {
      console.error('Nao foi possivel garantir a coluna cor do tipo de agenda.', erro);
    }
  });

  banco.run(`
    ALTER TABLE tipoAgenda ADD COLUMN obrigarFornecedor BOOLEAN NOT NULL DEFAULT 0
  `, (erro) => {
    if (erro && !String(erro.message || '').includes('duplicate column name')) {
      console.error('Nao foi possivel garantir a coluna obrigarFornecedor do tipo de agenda.', erro);
    }
  });

  banco.run(`
    ALTER TABLE tipoAgenda ADD COLUMN obrigarLocal BOOLEAN NOT NULL DEFAULT 0
  `, (erro) => {
    if (erro && !String(erro.message || '').includes('duplicate column name')) {
      console.error('Nao foi possivel garantir a coluna obrigarLocal do tipo de agenda.', erro);
    }
  });

  banco.run(`
    ALTER TABLE tipoAgenda ADD COLUMN obrigarRecurso BOOLEAN NOT NULL DEFAULT 0
  `, (erro) => {
    if (erro && !String(erro.message || '').includes('duplicate column name')) {
      console.error('Nao foi possivel garantir a coluna obrigarRecurso do tipo de agenda.', erro);
    }
  });

  banco.run(`
    ALTER TABLE tipoAgenda ADD COLUMN ordem INTEGER NOT NULL DEFAULT 0
  `, (erro) => {
    if (erro && !String(erro.message || '').includes('duplicate column name')) {
      console.error('Nao foi possivel garantir a coluna ordem do tipo de agenda.', erro);
    }
  });

  banco.run(`
    UPDATE tipoAgenda
    SET ordem = idTipoAgenda
    WHERE ordem IS NULL OR ordem <= 0
  `, (erro) => {
    if (erro && !String(erro.message || '').includes('no such column')) {
      console.error('Nao foi possivel atualizar a ordem dos tipos de agenda.', erro);
    }
  });

  banco.run(`
    ALTER TABLE agendamento ADD COLUMN assunto VARCHAR(255)
  `, (erro) => {
    if (erro && !String(erro.message || '').includes('duplicate column name')) {
      console.error('Nao foi possivel garantir a coluna assunto do agendamento.', erro);
    }
  });

  banco.run(`
    ALTER TABLE agendamento ADD COLUMN idTipoAgenda INTEGER
  `, (erro) => {
    if (erro && !String(erro.message || '').includes('duplicate column name')) {
      console.error('Nao foi possivel garantir a coluna idTipoAgenda do agendamento.', erro);
    }
  });

  banco.run(`
    ALTER TABLE agendamento ADD COLUMN idStatusVisita INTEGER
  `, (erro) => {
    if (erro && !String(erro.message || '').includes('duplicate column name')) {
      console.error('Nao foi possivel garantir a coluna idStatusVisita do agendamento.', erro);
    }
  });

  banco.run(`
    ALTER TABLE agendamento ADD COLUMN idContato INTEGER
  `, (erro) => {
    if (erro && !String(erro.message || '').includes('duplicate column name')) {
      console.error('Nao foi possivel garantir a coluna idContato do agendamento.', erro);
    }
  });

  banco.all(
    'PRAGMA table_info(agendamento)',
    (erro, colunasAgendamento) => {
      if (erro || !Array.isArray(colunasAgendamento) || colunasAgendamento.length === 0) {
        if (erro) {
          console.error('Nao foi possivel consultar a estrutura da tabela agendamento.', erro);
        }
        return;
      }

      const colunaLocal = colunasAgendamento.find((coluna) => coluna.name === 'idLocal');
      const colunaRecurso = colunasAgendamento.find((coluna) => coluna.name === 'idRecurso');
      const colunaFornecedor = colunasAgendamento.find((coluna) => coluna.name === 'idFornecedor');

      if (!colunaLocal?.notnull && !colunaRecurso?.notnull && !colunaFornecedor?.notnull) {
        return;
      }

      banco.serialize(() => {
        banco.run('PRAGMA foreign_keys = OFF');
        banco.run('DROP TABLE IF EXISTS agendamento_migracao');
        banco.run(`
          CREATE TABLE agendamento_migracao (
            idAgendamento INTEGER PRIMARY KEY AUTOINCREMENT,
            data DATE NOT NULL,
            assunto VARCHAR(255),
            horaInicio VARCHAR(5) NOT NULL,
            horaFim VARCHAR(5) NOT NULL,
            idLocal INTEGER,
            idRecurso INTEGER,
            idFornecedor INTEGER,
            idContato INTEGER,
            idUsuario INTEGER NOT NULL,
            idTipoAgenda INTEGER,
            idStatusVisita INTEGER,
            status BOOLEAN NOT NULL DEFAULT 1,
            tipo VARCHAR(100),
            FOREIGN KEY (idLocal) REFERENCES localAgenda (idLocal),
            FOREIGN KEY (idRecurso) REFERENCES recurso (idRecurso),
            FOREIGN KEY (idFornecedor) REFERENCES fornecedor (idFornecedor),
            FOREIGN KEY (idContato) REFERENCES contato (idContato),
            FOREIGN KEY (idUsuario) REFERENCES usuario (idUsuario),
            FOREIGN KEY (idTipoAgenda) REFERENCES tipoAgenda (idTipoAgenda),
            FOREIGN KEY (idStatusVisita) REFERENCES statusVisita (idStatusVisita)
          )
        `);
        banco.run(`
          INSERT INTO agendamento_migracao (
            idAgendamento,
            data,
            assunto,
            horaInicio,
            horaFim,
            idLocal,
            idRecurso,
            idFornecedor,
            idContato,
            idUsuario,
            idTipoAgenda,
            idStatusVisita,
            status,
            tipo
          )
          SELECT
            idAgendamento,
            data,
            assunto,
            horaInicio,
            horaFim,
            idLocal,
            idRecurso,
            idFornecedor,
            idContato,
            idUsuario,
            idTipoAgenda,
            idStatusVisita,
            status,
            tipo
          FROM agendamento
        `);
        banco.run('DROP TABLE agendamento');
        banco.run('ALTER TABLE agendamento_migracao RENAME TO agendamento');
        banco.run('PRAGMA foreign_keys = ON');
      });
    }
  );

  banco.all(
    'PRAGMA table_info(agendamento)',
    (erro, colunasAgendamento) => {
      if (erro || !Array.isArray(colunasAgendamento) || colunasAgendamento.length === 0) {
        if (erro) {
          console.error('Nao foi possivel consultar a estrutura da tabela agendamento.', erro);
        }
        return;
      }

      const colunaLocal = colunasAgendamento.find((coluna) => coluna.name === 'idLocal');
      const colunaRecurso = colunasAgendamento.find((coluna) => coluna.name === 'idRecurso');
      const colunaFornecedor = colunasAgendamento.find((coluna) => coluna.name === 'idFornecedor');
      const precisaMigrar = Boolean(colunaLocal?.notnull || colunaRecurso?.notnull || colunaFornecedor?.notnull);

      if (!precisaMigrar) {
        return;
      }

      banco.serialize(() => {
        banco.run('PRAGMA foreign_keys = OFF');
        banco.run('DROP TABLE IF EXISTS agendamento_temp');
        banco.run(`
          CREATE TABLE agendamento_temp (
            idAgendamento INTEGER PRIMARY KEY AUTOINCREMENT,
            data DATE NOT NULL,
            assunto VARCHAR(255),
            horaInicio VARCHAR(5) NOT NULL,
            horaFim VARCHAR(5) NOT NULL,
            idLocal INTEGER,
            idRecurso INTEGER,
            idFornecedor INTEGER,
            idContato INTEGER,
            idUsuario INTEGER NOT NULL,
            idTipoAgenda INTEGER,
            idStatusVisita INTEGER,
            tipo VARCHAR(100),
            status BOOLEAN NOT NULL DEFAULT 1,
            FOREIGN KEY (idLocal) REFERENCES localAgenda (idLocal),
            FOREIGN KEY (idRecurso) REFERENCES recurso (idRecurso),
            FOREIGN KEY (idFornecedor) REFERENCES fornecedor (idFornecedor),
            FOREIGN KEY (idContato) REFERENCES contato (idContato),
            FOREIGN KEY (idUsuario) REFERENCES usuario (idUsuario),
            FOREIGN KEY (idTipoAgenda) REFERENCES tipoAgenda (idTipoAgenda),
            FOREIGN KEY (idStatusVisita) REFERENCES statusVisita (idStatusVisita)
          )
        `);
        banco.run(`
          INSERT INTO agendamento_temp (
            idAgendamento,
            data,
            assunto,
            horaInicio,
            horaFim,
            idLocal,
            idRecurso,
            idFornecedor,
            idContato,
            idUsuario,
            idTipoAgenda,
            idStatusVisita,
            tipo,
            status
          )
          SELECT
            idAgendamento,
            data,
            assunto,
            horaInicio,
            horaFim,
            idLocal,
            idRecurso,
            idFornecedor,
            idContato,
            idUsuario,
            idTipoAgenda,
            idStatusVisita,
            tipo,
            status
          FROM agendamento
        `);
        banco.run('DROP TABLE agendamento');
        banco.run('ALTER TABLE agendamento_temp RENAME TO agendamento');
        banco.run('PRAGMA foreign_keys = ON');
      });
    }
  );

  banco.run(`
    CREATE TABLE IF NOT EXISTS metodoPagamento (
      idMetodoPagamento INTEGER PRIMARY KEY AUTOINCREMENT,
      descricao VARCHAR(100) NOT NULL,
      status BOOLEAN NOT NULL DEFAULT 1
    )
  `);

  banco.run(`
    CREATE TABLE IF NOT EXISTS tipoOrdemCompra (
      idTipoOrdemCompra INTEGER PRIMARY KEY AUTOINCREMENT,
      descricao VARCHAR(150) NOT NULL,
      status BOOLEAN NOT NULL DEFAULT 1
    )
  `);

  banco.run(`
    CREATE TABLE IF NOT EXISTS prazoPagamento (
      idPrazoPagamento INTEGER PRIMARY KEY AUTOINCREMENT,
      descricao VARCHAR(150),
      idMetodoPagamento INTEGER NOT NULL,
      prazo1 INTEGER,
      prazo2 INTEGER,
      prazo3 INTEGER,
      prazo4 INTEGER,
      prazo5 INTEGER,
      prazo6 INTEGER,
      status BOOLEAN NOT NULL DEFAULT 1,
      FOREIGN KEY (idMetodoPagamento) REFERENCES metodoPagamento (idMetodoPagamento)
    )
  `);

  banco.run(`
    CREATE TABLE IF NOT EXISTS statusVisita (
      idStatusVisita INTEGER PRIMARY KEY AUTOINCREMENT,
      descricao VARCHAR(100) NOT NULL,
      icone VARCHAR(10),
      ordem INTEGER NOT NULL DEFAULT 0,
      status BOOLEAN NOT NULL DEFAULT 1
    )
  `);

  banco.run(`
    CREATE TABLE IF NOT EXISTS canalAtendimento (
      idCanalAtendimento INTEGER PRIMARY KEY AUTOINCREMENT,
      descricao VARCHAR(100) NOT NULL,
      status BOOLEAN NOT NULL DEFAULT 1
    )
  `);

  banco.run(`
    CREATE TABLE IF NOT EXISTS origemAtendimento (
      idOrigemAtendimento INTEGER PRIMARY KEY AUTOINCREMENT,
      descricao VARCHAR(100) NOT NULL,
      status BOOLEAN NOT NULL DEFAULT 1
    )
  `);

  banco.run(`
    CREATE TABLE IF NOT EXISTS tipoAtendimento (
      idTipoAtendimento INTEGER PRIMARY KEY AUTOINCREMENT,
      descricao VARCHAR(100) NOT NULL,
      status BOOLEAN NOT NULL DEFAULT 1
    )
  `);

  banco.run(`
    ALTER TABLE statusVisita ADD COLUMN icone VARCHAR(10)
  `, (erro) => {
    if (erro && !String(erro.message || '').includes('duplicate column name')) {
      console.error('Nao foi possivel garantir a coluna icone do status da visita.', erro);
    }
  });

  banco.run(`
    ALTER TABLE statusVisita ADD COLUMN ordem INTEGER NOT NULL DEFAULT 0
  `, (erro) => {
    if (erro && !String(erro.message || '').includes('duplicate column name')) {
      console.error('Nao foi possivel garantir a coluna ordem do status da visita.', erro);
    }
  });

  banco.run(`
    UPDATE statusVisita
    SET ordem = idStatusVisita
    WHERE ordem IS NULL OR ordem <= 0
  `, (erro) => {
    if (erro && !String(erro.message || '').includes('no such column')) {
      console.error('Nao foi possivel atualizar a ordem dos status da agenda.', erro);
    }
  });


  banco.run(`
    CREATE TABLE IF NOT EXISTS etapaOrdemCompra (
      idEtapa INTEGER PRIMARY KEY AUTOINCREMENT,
      descricao VARCHAR(150) NOT NULL,
      cor VARCHAR(20) NOT NULL DEFAULT '#EC8702',
      ordem INTEGER NOT NULL DEFAULT 0,
      status BOOLEAN NOT NULL DEFAULT 1
    )
  `);

  banco.run(`
    ALTER TABLE etapaOrdemCompra ADD COLUMN cor VARCHAR(20) NOT NULL DEFAULT '#EC8702'
  `, (erro) => {
    if (erro && !String(erro.message || '').includes('duplicate column name')) {
      console.error('Nao foi possivel garantir a coluna cor da etapa de ordemCompra.', erro);
    }
  });

  banco.run(`
    ALTER TABLE etapaOrdemCompra ADD COLUMN ordem INTEGER NOT NULL DEFAULT 0
  `, (erro) => {
    if (erro && !String(erro.message || '').includes('duplicate column name')) {
      console.error('Nao foi possivel garantir a coluna ordem da etapa de ordemCompra.', erro);
    }
  });

  banco.run(`
    UPDATE etapaOrdemCompra
    SET ordem = idEtapa
    WHERE ordem IS NULL OR ordem <= 0
  `, (erro) => {
    if (erro && !String(erro.message || '').includes('no such column')) {
      console.error('Nao foi possivel atualizar a ordem das etapas de ordemCompra.', erro);
    }
  });

  banco.run(`
    CREATE TABLE IF NOT EXISTS etapaCotacao (
      idEtapaCotacao INTEGER PRIMARY KEY AUTOINCREMENT,
      descricao VARCHAR(150) NOT NULL,
      cor VARCHAR(20) NOT NULL DEFAULT '#EC8702',
      consideraFunilCotacoes BOOLEAN NOT NULL DEFAULT 1,
      ordem INTEGER NOT NULL DEFAULT 0,
      status BOOLEAN NOT NULL DEFAULT 1
    )
  `);


  banco.run(`
    ALTER TABLE etapaCotacao ADD COLUMN ordem INTEGER NOT NULL DEFAULT 0
  `, (erro) => {
    if (erro && !String(erro.message || '').includes('duplicate column name')) {
      console.error('Nao foi possivel garantir a coluna ordem da etapa de cotacao.', erro);
    }
  });

  banco.run(`
    ALTER TABLE etapaCotacao ADD COLUMN consideraFunilCotacoes BOOLEAN NOT NULL DEFAULT 1
  `, (erro) => {
    if (erro && !String(erro.message || '').includes('duplicate column name')) {
      console.error('Nao foi possivel garantir a coluna consideraFunilCotacoes da etapa de cotacao.', erro);
    }
  });

  banco.run(`
    UPDATE etapaCotacao
    SET consideraFunilCotacoes = 1
    WHERE consideraFunilCotacoes IS NULL
  `, (erro) => {
    if (erro && !String(erro.message || '').includes('no such column')) {
      console.error('Nao foi possivel atualizar o campo consideraFunilCotacoes das etapas de cotacao.', erro);
    }
  });

  banco.run(`
    UPDATE etapaCotacao
    SET ordem = idEtapaCotacao
    WHERE ordem IS NULL OR ordem <= 0
  `, (erro) => {
    if (erro && !String(erro.message || '').includes('no such column')) {
      console.error('Nao foi possivel atualizar a ordem das etapas de cotacao.', erro);
    }
  });

  banco.run(`
    CREATE TABLE IF NOT EXISTS campoCotacaoConfiguravel (
      idCampoCotacao INTEGER PRIMARY KEY AUTOINCREMENT,
      titulo VARCHAR(150) NOT NULL,
      descricaoPadrao TEXT,
      status BOOLEAN NOT NULL DEFAULT 1
    )
  `);

  banco.run(`
    CREATE TABLE IF NOT EXISTS campoOrdemCompraConfiguravel (
      idCampoOrdemCompra INTEGER PRIMARY KEY AUTOINCREMENT,
      titulo VARCHAR(150) NOT NULL,
      descricaoPadrao TEXT,
      status BOOLEAN NOT NULL DEFAULT 1
    )
  `);

  banco.run(`
    ALTER TABLE campoCotacaoConfiguravel ADD COLUMN titulo VARCHAR(150)
  `, (erro) => {
    if (erro && !String(erro.message || '').includes('duplicate column name')) {
      console.error('Nao foi possivel garantir a coluna titulo do campo de cotacao.', erro);
    }
  });

  banco.run(`
    ALTER TABLE campoCotacaoConfiguravel ADD COLUMN descricaoPadrao TEXT
  `, (erro) => {
    if (erro && !String(erro.message || '').includes('duplicate column name')) {
      console.error('Nao foi possivel garantir a coluna descricaoPadrao do campo de cotacao.', erro);
    }
  });

  banco.run(`
    UPDATE campoCotacaoConfiguravel
    SET
      titulo = COALESCE(NULLIF(titulo, ''), descricao),
      descricaoPadrao = COALESCE(descricaoPadrao, descricao)
    WHERE descricao IS NOT NULL
  `, (erro) => {
    if (
      erro &&
      !String(erro.message || '').includes('no such column')
    ) {
      console.error('Nao foi possivel migrar os dados legados dos campos de cotacao.', erro);
    }
  });

  banco.run(`
    CREATE TABLE IF NOT EXISTS empresa (
      idEmpresa INTEGER PRIMARY KEY AUTOINCREMENT,
      razaoSocial VARCHAR(255) NOT NULL,
      nomeFantasia VARCHAR(255) NOT NULL,
      slogan VARCHAR(255),
      tipo VARCHAR(20) NOT NULL,
      cnpj VARCHAR(18) NOT NULL,
      inscricaoEstadual VARCHAR(20),
      email VARCHAR(150),
      telefone VARCHAR(20),
      horaInicioManha VARCHAR(5),
      horaFimManha VARCHAR(5),
      horaInicioTarde VARCHAR(5),
      horaFimTarde VARCHAR(5),
      trabalhaSabado BOOLEAN NOT NULL DEFAULT 0,
      horaInicioSabado VARCHAR(5),
      horaFimSabado VARCHAR(5),
      exibirFunilPaginaInicial BOOLEAN NOT NULL DEFAULT 1,
      diasValidadeCotacao INTEGER NOT NULL DEFAULT 7,
      diasEntregaOrdemCompra INTEGER NOT NULL DEFAULT 7,
      codigoPrincipalFornecedor VARCHAR(30) NOT NULL DEFAULT 'codigo',
      etapasFiltroPadraoCotacao TEXT,
      colunasGridFornecedores TEXT,
      colunasGridCotacoes TEXT,
      colunasGridProdutos TEXT,
      colunasGridOrdensCompra TEXT,
      colunasGridAtendimentos TEXT,
      graficosPaginaInicialCotacoes TEXT,
      graficosPaginaInicialOrdensCompra TEXT,
      graficosPaginaInicialAtendimentos TEXT,
      cardsPaginaInicial TEXT,
      corPrimariaCotacao VARCHAR(7) NOT NULL DEFAULT '#111827',
      corSecundariaCotacao VARCHAR(7) NOT NULL DEFAULT '#ef4444',
      corDestaqueCotacao VARCHAR(7) NOT NULL DEFAULT '#f59e0b',
      destaqueItemCotacaoPdf VARCHAR(20) NOT NULL DEFAULT 'descricao',
      assuntoEmailCotacao TEXT,
      corpoEmailCotacao TEXT,
      assinaturaEmailCotacao TEXT,
      logradouro VARCHAR(255),
      numero VARCHAR(10),
      complemento VARCHAR(100),
      bairro VARCHAR(100),
      cidade VARCHAR(100),
      estado CHAR(2),
      cep VARCHAR(10),
      imagem VARCHAR(255),
      dataCriacao TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
    )
  `);

  banco.run(`
    CREATE TABLE IF NOT EXISTS configuracaoAtualizacaoSistema (
      idConfiguracaoAtualizacao INTEGER PRIMARY KEY CHECK (idConfiguracaoAtualizacao = 1),
      urlRepositorio VARCHAR(255) NOT NULL,
      dataAtualizacao DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);

  banco.run(`
    ALTER TABLE empresa ADD COLUMN slogan VARCHAR(255)
  `, (erro) => {
    if (erro && !String(erro.message || '').includes('duplicate column name')) {
      console.error('Nao foi possivel garantir a coluna slogan da empresa.', erro);
    }
  });

  banco.run(`
    ALTER TABLE empresa ADD COLUMN horaInicioManha VARCHAR(5)
  `, (erro) => {
    if (erro && !String(erro.message || '').includes('duplicate column name')) {
      console.error('Nao foi possivel garantir a coluna horaInicioManha da empresa.', erro);
    }
  });

  banco.run(`
    ALTER TABLE empresa ADD COLUMN horaFimManha VARCHAR(5)
  `, (erro) => {
    if (erro && !String(erro.message || '').includes('duplicate column name')) {
      console.error('Nao foi possivel garantir a coluna horaFimManha da empresa.', erro);
    }
  });

  banco.run(`
    ALTER TABLE empresa ADD COLUMN horaInicioTarde VARCHAR(5)
  `, (erro) => {
    if (erro && !String(erro.message || '').includes('duplicate column name')) {
      console.error('Nao foi possivel garantir a coluna horaInicioTarde da empresa.', erro);
    }
  });

  banco.run(`
    ALTER TABLE empresa ADD COLUMN horaFimTarde VARCHAR(5)
  `, (erro) => {
    if (erro && !String(erro.message || '').includes('duplicate column name')) {
      console.error('Nao foi possivel garantir a coluna horaFimTarde da empresa.', erro);
    }
  });

  banco.run(`
    ALTER TABLE empresa ADD COLUMN trabalhaSabado BOOLEAN NOT NULL DEFAULT 0
  `, (erro) => {
    if (erro && !String(erro.message || '').includes('duplicate column name')) {
      console.error('Nao foi possivel garantir a coluna trabalhaSabado da empresa.', erro);
    }
  });

  banco.run(`
    ALTER TABLE empresa ADD COLUMN horaInicioSabado VARCHAR(5)
  `, (erro) => {
    if (erro && !String(erro.message || '').includes('duplicate column name')) {
      console.error('Nao foi possivel garantir a coluna horaInicioSabado da empresa.', erro);
    }
  });

  banco.run(`
    ALTER TABLE empresa ADD COLUMN horaFimSabado VARCHAR(5)
  `, (erro) => {
    if (erro && !String(erro.message || '').includes('duplicate column name')) {
      console.error('Nao foi possivel garantir a coluna horaFimSabado da empresa.', erro);
    }
  });

  banco.run(`
    ALTER TABLE empresa ADD COLUMN exibirFunilPaginaInicial BOOLEAN NOT NULL DEFAULT 1
  `, (erro) => {
    if (erro && !String(erro.message || '').includes('duplicate column name')) {
      console.error('Nao foi possivel garantir a coluna exibirFunilPaginaInicial da empresa.', erro);
    }
  });

  banco.run(`
    ALTER TABLE empresa ADD COLUMN diasValidadeCotacao INTEGER NOT NULL DEFAULT 7
  `, (erro) => {
    if (erro && !String(erro.message || '').includes('duplicate column name')) {
      console.error('Nao foi possivel garantir a coluna diasValidadeCotacao da empresa.', erro);
    }
  });

  banco.run(`
    ALTER TABLE empresa ADD COLUMN diasEntregaOrdemCompra INTEGER NOT NULL DEFAULT 7
  `, (erro) => {
    if (erro && !String(erro.message || '').includes('duplicate column name')) {
      console.error('Nao foi possivel garantir a coluna diasEntregaOrdemCompra da empresa.', erro);
    }
  });

  banco.run(`
    ALTER TABLE empresa ADD COLUMN codigoPrincipalFornecedor VARCHAR(30) NOT NULL DEFAULT 'codigo'
  `, (erro) => {
    if (erro && !String(erro.message || '').includes('duplicate column name')) {
      console.error('Nao foi possivel garantir a coluna codigoPrincipalFornecedor da empresa.', erro);
    }
  });

  banco.run(`
    ALTER TABLE empresa ADD COLUMN etapasFiltroPadraoCotacao TEXT
  `, (erro) => {
    if (erro && !String(erro.message || '').includes('duplicate column name')) {
      console.error('Nao foi possivel garantir a coluna etapasFiltroPadraoCotacao da empresa.', erro);
    }
  });

  banco.run(`
    ALTER TABLE empresa ADD COLUMN colunasGridFornecedores TEXT
  `, (erro) => {
    if (erro && !String(erro.message || '').includes('duplicate column name')) {
      console.error('Nao foi possivel garantir a coluna colunasGridFornecedores da empresa.', erro);
    }
  });

  banco.run(`
    ALTER TABLE empresa ADD COLUMN colunasGridCotacoes TEXT
  `, (erro) => {
    if (erro && !String(erro.message || '').includes('duplicate column name')) {
      console.error('Nao foi possivel garantir a coluna colunasGridCotacoes da empresa.', erro);
    }
  });

  banco.run(`
    ALTER TABLE empresa ADD COLUMN colunasGridProdutos TEXT
  `, (erro) => {
    if (erro && !String(erro.message || '').includes('duplicate column name')) {
      console.error('Nao foi possivel garantir a coluna colunasGridProdutos da empresa.', erro);
    }
  });

  banco.run(`
    ALTER TABLE empresa ADD COLUMN colunasGridOrdensCompra TEXT
  `, (erro) => {
    if (erro && !String(erro.message || '').includes('duplicate column name')) {
      console.error('Nao foi possivel garantir a coluna colunasGridOrdensCompra da empresa.', erro);
    }
  });

  banco.run(`
    ALTER TABLE empresa ADD COLUMN colunasGridAtendimentos TEXT
  `, (erro) => {
    if (erro && !String(erro.message || '').includes('duplicate column name')) {
      console.error('Nao foi possivel garantir a coluna colunasGridAtendimentos da empresa.', erro);
    }
  });

  banco.run(`
    ALTER TABLE empresa ADD COLUMN graficosPaginaInicialCotacoes TEXT
  `, (erro) => {
    if (erro && !String(erro.message || '').includes('duplicate column name')) {
      console.error('Nao foi possivel garantir a coluna graficosPaginaInicialCotacoes da empresa.', erro);
    }
  });

  banco.run(`
    ALTER TABLE empresa ADD COLUMN graficosPaginaInicialOrdensCompra TEXT
  `, (erro) => {
    if (erro && !String(erro.message || '').includes('duplicate column name')) {
      console.error('Nao foi possivel garantir a coluna graficosPaginaInicialOrdensCompra da empresa.', erro);
    }
  });

  banco.run(`
    ALTER TABLE empresa ADD COLUMN graficosPaginaInicialAtendimentos TEXT
  `, (erro) => {
    if (erro && !String(erro.message || '').includes('duplicate column name')) {
      console.error('Nao foi possivel garantir a coluna graficosPaginaInicialAtendimentos da empresa.', erro);
    }
  });

  banco.run(`
    ALTER TABLE empresa ADD COLUMN cardsPaginaInicial TEXT
  `, (erro) => {
    if (erro && !String(erro.message || '').includes('duplicate column name')) {
      console.error('Nao foi possivel garantir a coluna cardsPaginaInicial da empresa.', erro);
    }
  });

  banco.run(`
    ALTER TABLE empresa ADD COLUMN corPrimariaCotacao VARCHAR(7) NOT NULL DEFAULT '#111827'
  `, (erro) => {
    if (erro && !String(erro.message || '').includes('duplicate column name')) {
      console.error('Nao foi possivel garantir a coluna corPrimariaCotacao da empresa.', erro);
    }
  });

  banco.run(`
    ALTER TABLE empresa ADD COLUMN corSecundariaCotacao VARCHAR(7) NOT NULL DEFAULT '#ef4444'
  `, (erro) => {
    if (erro && !String(erro.message || '').includes('duplicate column name')) {
      console.error('Nao foi possivel garantir a coluna corSecundariaCotacao da empresa.', erro);
    }
  });

  banco.run(`
    ALTER TABLE empresa ADD COLUMN corDestaqueCotacao VARCHAR(7) NOT NULL DEFAULT '#f59e0b'
  `, (erro) => {
    if (erro && !String(erro.message || '').includes('duplicate column name')) {
      console.error('Nao foi possivel garantir a coluna corDestaqueCotacao da empresa.', erro);
    }
  });

  banco.run(`
    ALTER TABLE empresa ADD COLUMN destaqueItemCotacaoPdf VARCHAR(20) NOT NULL DEFAULT 'descricao'
  `, (erro) => {
    if (erro && !String(erro.message || '').includes('duplicate column name')) {
      console.error('Nao foi possivel garantir a coluna destaqueItemCotacaoPdf da empresa.', erro);
    }
  });

  banco.run(`
    ALTER TABLE empresa ADD COLUMN assuntoEmailCotacao TEXT
  `, (erro) => {
    if (erro && !String(erro.message || '').includes('duplicate column name')) {
      console.error('Nao foi possivel garantir a coluna assuntoEmailCotacao da empresa.', erro);
    }
  });

  banco.run(`
    ALTER TABLE empresa ADD COLUMN corpoEmailCotacao TEXT
  `, (erro) => {
    if (erro && !String(erro.message || '').includes('duplicate column name')) {
      console.error('Nao foi possivel garantir a coluna corpoEmailCotacao da empresa.', erro);
    }
  });

  banco.run(`
    ALTER TABLE empresa ADD COLUMN assinaturaEmailCotacao TEXT
  `, (erro) => {
    if (erro && !String(erro.message || '').includes('duplicate column name')) {
      console.error('Nao foi possivel garantir a coluna assinaturaEmailCotacao da empresa.', erro);
    }
  });

  banco.run(`
    UPDATE empresa
    SET codigoPrincipalFornecedor = 'codigo'
    WHERE codigoPrincipalFornecedor IS NULL OR TRIM(codigoPrincipalFornecedor) = ''
  `, (erro) => {
    if (erro && !String(erro.message || '').includes('no such column')) {
      console.error('Nao foi possivel normalizar o codigoPrincipalFornecedor da empresa.', erro);
    }
  });

  banco.run(`
    CREATE TABLE IF NOT EXISTS usuario (
      idUsuario INTEGER PRIMARY KEY AUTOINCREMENT,
      nome VARCHAR(150) NOT NULL,
      usuario VARCHAR(80) NOT NULL UNIQUE,
      senha VARCHAR(120) NOT NULL,
      tipo VARCHAR(30) NOT NULL,
      ativo BOOLEAN NOT NULL DEFAULT 1,
      imagem VARCHAR(255),
      idComprador INTEGER,
      FOREIGN KEY (idComprador) REFERENCES comprador (idComprador)
    )
  `);

  banco.run(`
    ALTER TABLE usuario ADD COLUMN imagem VARCHAR(255)
  `, (erro) => {
    if (erro && !String(erro.message || '').includes('duplicate column name')) {
      console.error('Nao foi possivel garantir a coluna imagem do usuario.', erro);
    }
  });

  banco.run(`
    ALTER TABLE usuario ADD COLUMN idComprador INTEGER
  `, (erro) => {
    if (erro && !String(erro.message || '').includes('duplicate column name')) {
      console.error('Nao foi possivel garantir a coluna idComprador do usuario.', erro);
    }
  });

  banco.run(`
    CREATE TABLE IF NOT EXISTS fornecedor (
      idFornecedor INTEGER PRIMARY KEY AUTOINCREMENT,
      idComprador INTEGER NOT NULL,
      idConceito INTEGER NOT NULL DEFAULT 1,
      idRamo INTEGER NOT NULL,
      idGrupoEmpresa INTEGER,
      codigoAlternativo INTEGER,
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
      FOREIGN KEY (idComprador) REFERENCES comprador (idComprador),
      FOREIGN KEY (idConceito) REFERENCES conceitoFornecedor (idConceito),
      FOREIGN KEY (idRamo) REFERENCES ramoAtividade (idRamo),
      FOREIGN KEY (idGrupoEmpresa) REFERENCES grupoEmpresa (idGrupoEmpresa)
    )
  `);

  banco.run(`
    ALTER TABLE fornecedor ADD COLUMN idConceito INTEGER NOT NULL DEFAULT 1
  `, (erro) => {
    if (erro && !String(erro.message || '').includes('duplicate column name')) {
      console.error('Nao foi possivel garantir a coluna idConceito do fornecedor.', erro);
    }
  });

  banco.run(`
    UPDATE fornecedor
    SET idConceito = 1
    WHERE idConceito IS NULL OR CAST(idConceito AS TEXT) = ''
  `, (erro) => {
    if (erro && !String(erro.message || '').includes('no such column')) {
      console.error('Nao foi possivel aplicar o conceito padrao nos fornecedores.', erro);
    }
  });

  banco.run(`
    ALTER TABLE fornecedor ADD COLUMN idGrupoEmpresa INTEGER
  `, (erro) => {
    if (erro && !String(erro.message || '').includes('duplicate column name')) {
      console.error('Nao foi possivel garantir a coluna idGrupoEmpresa do fornecedor.', erro);
    }
  });

  banco.run(`
    ALTER TABLE fornecedor ADD COLUMN codigoAlternativo INTEGER
  `, (erro) => {
    if (erro && !String(erro.message || '').includes('duplicate column name')) {
      console.error('Nao foi possivel garantir a coluna codigoAlternativo do fornecedor.', erro);
    }
  });

  executarMigracaoNome(`
    INSERT OR IGNORE INTO fornecedor (
      idFornecedor,
      idComprador,
      idConceito,
      idRamo,
      idGrupoEmpresa,
      codigoAlternativo,
      razaoSocial,
      nomeFantasia,
      tipo,
      cnpj,
      inscricaoEstadual,
      status,
      email,
      telefone,
      logradouro,
      numero,
      complemento,
      bairro,
      cidade,
      estado,
      cep,
      observacao,
      imagem,
      dataCriacao
    )
    SELECT
      idCliente,
      idComprador,
      idConceito,
      idRamo,
      idGrupoEmpresa,
      codigoAlternativo,
      razaoSocial,
      nomeFantasia,
      tipo,
      cnpj,
      inscricaoEstadual,
      status,
      email,
      telefone,
      logradouro,
      numero,
      complemento,
      bairro,
      cidade,
      estado,
      cep,
      observacao,
      imagem,
      dataCriacao
    FROM cliente
  `);
  executarMigracaoNome('DROP TABLE IF EXISTS cliente');

  banco.run(`
    CREATE TABLE IF NOT EXISTS contato (
      idContato INTEGER PRIMARY KEY AUTOINCREMENT,
      idFornecedor INTEGER NOT NULL,
      nome VARCHAR(150) NOT NULL,
      cargo VARCHAR(100),
      email VARCHAR(150),
      telefone VARCHAR(20),
      whatsapp VARCHAR(20),
      status BOOLEAN NOT NULL DEFAULT 1,
      principal BOOLEAN NOT NULL DEFAULT 0,
      contatoVinculadoGrupo BOOLEAN NOT NULL DEFAULT 0,
      idContatoGrupoEmpresaOrigem INTEGER,
      FOREIGN KEY (idFornecedor) REFERENCES fornecedor (idFornecedor)
    )
  `);

  banco.run(`
    ALTER TABLE contato ADD COLUMN contatoVinculadoGrupo BOOLEAN NOT NULL DEFAULT 0
  `, (erro) => {
    if (erro && !String(erro.message || '').includes('duplicate column name')) {
      console.error('Nao foi possivel garantir a coluna contatoVinculadoGrupo do contato.', erro);
    }
  });

  banco.run(`
    ALTER TABLE contato ADD COLUMN idContatoGrupoEmpresaOrigem INTEGER
  `, (erro) => {
    if (erro && !String(erro.message || '').includes('duplicate column name')) {
      console.error('Nao foi possivel garantir a coluna idContatoGrupoEmpresaOrigem do contato.', erro);
    }
  });

  banco.run(`
    CREATE TABLE IF NOT EXISTS atendimento (
      idAtendimento INTEGER PRIMARY KEY AUTOINCREMENT,
      idAgendamento INTEGER,
      idFornecedor INTEGER NOT NULL,
      idContato INTEGER,
      idUsuario INTEGER NOT NULL,
      assunto VARCHAR(150) NOT NULL,
      descricao TEXT,
      data DATETIME NOT NULL,
      horaInicio VARCHAR(5) NOT NULL,
      horaFim VARCHAR(5) NOT NULL,
      idTipoAtendimento INTEGER,
      idCanalAtendimento INTEGER,
      idOrigemAtendimento INTEGER,
      status BOOLEAN NOT NULL DEFAULT 1,
      dataCriacao TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (idAgendamento) REFERENCES agendamento (idAgendamento),
      FOREIGN KEY (idFornecedor) REFERENCES fornecedor (idFornecedor),
      FOREIGN KEY (idContato) REFERENCES contato (idContato),
      FOREIGN KEY (idUsuario) REFERENCES usuario (idUsuario),
      FOREIGN KEY (idTipoAtendimento) REFERENCES tipoAtendimento (idTipoAtendimento),
      FOREIGN KEY (idCanalAtendimento) REFERENCES canalAtendimento (idCanalAtendimento),
      FOREIGN KEY (idOrigemAtendimento) REFERENCES origemAtendimento (idOrigemAtendimento)
    )
  `);

  banco.run(`
    CREATE TABLE IF NOT EXISTS cotacao (
      idCotacao INTEGER PRIMARY KEY AUTOINCREMENT,
      idFornecedor INTEGER NOT NULL,
      idContato INTEGER,
      idUsuario INTEGER,
      idOrdemCompraVinculado INTEGER,
      idComprador INTEGER,
      idPrazoPagamento INTEGER,
      idEtapaCotacao INTEGER,
      dataInclusao DATE,
      dataValidade DATE,
      dataFechamento DATE,
      observacao TEXT,
      dataCriacao TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (idFornecedor) REFERENCES fornecedor (idFornecedor),
      FOREIGN KEY (idContato) REFERENCES contato (idContato),
      FOREIGN KEY (idUsuario) REFERENCES usuario (idUsuario),
      FOREIGN KEY (idOrdemCompraVinculado) REFERENCES ordemCompra (idOrdemCompra),
      FOREIGN KEY (idComprador) REFERENCES comprador (idComprador),
      FOREIGN KEY (idPrazoPagamento) REFERENCES prazoPagamento (idPrazoPagamento),
      FOREIGN KEY (idEtapaCotacao) REFERENCES etapaCotacao (idEtapaCotacao)
    )
  `);

  banco.run(`
    ALTER TABLE cotacao ADD COLUMN idUsuario INTEGER
  `, (erro) => {
    if (erro && !String(erro.message || '').includes('duplicate column name')) {
      console.error('Nao foi possivel garantir a coluna idUsuario da cotacao.', erro);
    }
  });

  banco.run(`
    ALTER TABLE cotacao ADD COLUMN idComprador INTEGER
  `, (erro) => {
    if (erro && !String(erro.message || '').includes('duplicate column name')) {
      console.error('Nao foi possivel garantir a coluna idComprador da cotacao.', erro);
    }
  });

  banco.run(`
    ALTER TABLE cotacao ADD COLUMN idOrdemCompraVinculado INTEGER
  `, (erro) => {
    if (erro && !String(erro.message || '').includes('duplicate column name')) {
      console.error('Nao foi possivel garantir a coluna idOrdemCompraVinculado da cotacao.', erro);
    }
  });



  banco.run(`
    ALTER TABLE cotacao ADD COLUMN idEtapaCotacao INTEGER
  `, (erro) => {
    if (erro && !String(erro.message || '').includes('duplicate column name')) {
      console.error('Nao foi possivel garantir a coluna idEtapaCotacao da cotacao.', erro);
    }
  });

  banco.run(`
    ALTER TABLE cotacao ADD COLUMN dataInclusao DATE
  `, (erro) => {
    if (erro && !String(erro.message || '').includes('duplicate column name')) {
      console.error('Nao foi possivel garantir a coluna dataInclusao da cotacao.', erro);
    }
  });

  banco.run(`
    ALTER TABLE cotacao ADD COLUMN dataValidade DATE
  `, (erro) => {
    if (erro && !String(erro.message || '').includes('duplicate column name')) {
      console.error('Nao foi possivel garantir a coluna dataValidade da cotacao.', erro);
    }
  });

  banco.run(`
    ALTER TABLE cotacao ADD COLUMN dataFechamento DATE
  `, (erro) => {
    if (erro && !String(erro.message || '').includes('duplicate column name')) {
      console.error('Nao foi possivel garantir a coluna dataFechamento da cotacao.', erro);
    }
  });

  banco.run(`
    UPDATE cotacao
    SET dataInclusao = COALESCE(dataInclusao, date(dataCriacao))
    WHERE dataInclusao IS NULL
  `, (erro) => {
    if (erro) {
      console.error('Nao foi possivel migrar a data de inclusao dos cotacoes.', erro);
    }
  });

  banco.run(`
    UPDATE cotacao
    SET dataFechamento = date('now')
    WHERE idEtapaCotacao IN (${ID_ETAPA_COTACAO_FECHAMENTO}, ${ID_ETAPA_COTACAO_FECHADA_SEM_ORDEM_COMPRA}, ${ID_ETAPA_COTACAO_ORDEM_COMPRA_EXCLUIDA})
      AND (dataFechamento IS NULL OR TRIM(dataFechamento) = '')
  `, (erro) => {
    if (erro && !String(erro.message || '').includes('no such column')) {
      console.error('Nao foi possivel migrar a data de fechamento dos cotacoes.', erro);
    }
  });

  banco.run(`
    UPDATE cotacao
    SET
      idComprador = COALESCE(
        idComprador,
        (
          SELECT fornecedor.idComprador
          FROM fornecedor
          WHERE fornecedor.idFornecedor = cotacao.idFornecedor
        )
      )
    WHERE idFornecedor IS NOT NULL
  `, (erro) => {
    if (erro) {
      console.error('Nao foi possivel migrar comprador dos cotacoes.', erro);
    }
  });

  banco.run(`
    CREATE TABLE IF NOT EXISTS itemCotacao (
      idItemCotacao INTEGER PRIMARY KEY AUTOINCREMENT,
      idCotacao INTEGER NOT NULL,
      idProduto INTEGER NOT NULL,
      quantidade DECIMAL(12, 3) NOT NULL,
      valorUnitario DECIMAL(12, 2) NOT NULL,
      valorTotal DECIMAL(12, 2) NOT NULL,
      imagem VARCHAR(255),
      observacao TEXT,
      referenciaProdutoSnapshot VARCHAR(120),
      descricaoProdutoSnapshot VARCHAR(255),
      unidadeProdutoSnapshot VARCHAR(60),
      FOREIGN KEY (idCotacao) REFERENCES cotacao (idCotacao) ON DELETE CASCADE,
      FOREIGN KEY (idProduto) REFERENCES produto (idProduto)
    )
  `);

  banco.run(`
    ALTER TABLE itemCotacao ADD COLUMN imagem VARCHAR(255)
  `, (erro) => {
    if (erro && !String(erro.message || '').includes('duplicate column name')) {
      console.error('Nao foi possivel garantir a coluna imagem do item da cotacao.', erro);
    }
  });

  banco.run(`
    ALTER TABLE itemCotacao ADD COLUMN referenciaProdutoSnapshot VARCHAR(120)
  `, (erro) => {
    if (erro && !String(erro.message || '').includes('duplicate column name')) {
      console.error('Nao foi possivel garantir a coluna referenciaProdutoSnapshot do item da cotacao.', erro);
    }
  });

  banco.run(`
    ALTER TABLE itemCotacao ADD COLUMN descricaoProdutoSnapshot VARCHAR(255)
  `, (erro) => {
    if (erro && !String(erro.message || '').includes('duplicate column name')) {
      console.error('Nao foi possivel garantir a coluna descricaoProdutoSnapshot do item da cotacao.', erro);
    }
  });

  banco.run(`
    ALTER TABLE itemCotacao ADD COLUMN unidadeProdutoSnapshot VARCHAR(60)
  `, (erro) => {
    if (erro && !String(erro.message || '').includes('duplicate column name')) {
      console.error('Nao foi possivel garantir a coluna unidadeProdutoSnapshot do item da cotacao.', erro);
    }
  });

  banco.run(`
    CREATE TABLE IF NOT EXISTS valorCampoCotacao (
      idValorCampoCotacao INTEGER PRIMARY KEY AUTOINCREMENT,
      idCotacao INTEGER NOT NULL,
      idCampoCotacao INTEGER NOT NULL,
      valor TEXT,
      FOREIGN KEY (idCotacao) REFERENCES cotacao (idCotacao) ON DELETE CASCADE,
      FOREIGN KEY (idCampoCotacao) REFERENCES campoCotacaoConfiguravel (idCampoCotacao)
    )
  `);

  banco.run(`
    CREATE TABLE IF NOT EXISTS ordemCompra (
      idOrdemCompra INTEGER PRIMARY KEY AUTOINCREMENT,
      idCotacao INTEGER,
      idFornecedor INTEGER NOT NULL,
      idContato INTEGER,
      idUsuario INTEGER NOT NULL,
      idComprador INTEGER NOT NULL,
      idPrazoPagamento INTEGER,
      idTipoOrdemCompra INTEGER,
      idEtapaOrdemCompra INTEGER,
      dataInclusao DATE,
      dataEntrega DATE,
      dataValidade DATE,
      observacao TEXT,
      codigoCotacaoOrigem INTEGER,
      nomeFornecedorSnapshot VARCHAR(255),
      nomeContatoSnapshot VARCHAR(255),
      nomeUsuarioSnapshot VARCHAR(150),
      nomeCompradorSnapshot VARCHAR(150),
      nomeMetodoPagamentoSnapshot VARCHAR(150),
      nomePrazoPagamentoSnapshot VARCHAR(255),
      nomeTipoOrdemCompraSnapshot VARCHAR(150),
      nomeEtapaOrdemCompraSnapshot VARCHAR(150),
      dataCriacao TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (idCotacao) REFERENCES cotacao (idCotacao),
      FOREIGN KEY (idFornecedor) REFERENCES fornecedor (idFornecedor),
      FOREIGN KEY (idContato) REFERENCES contato (idContato),
      FOREIGN KEY (idUsuario) REFERENCES usuario (idUsuario),
      FOREIGN KEY (idComprador) REFERENCES comprador (idComprador),
      FOREIGN KEY (idPrazoPagamento) REFERENCES prazoPagamento (idPrazoPagamento),
      FOREIGN KEY (idTipoOrdemCompra) REFERENCES tipoOrdemCompra (idTipoOrdemCompra),
      FOREIGN KEY (idEtapaOrdemCompra) REFERENCES etapaOrdemCompra (idEtapaOrdemCompra)
    )
  `);

  banco.run(`
    CREATE TABLE IF NOT EXISTS itemOrdemCompra (
      idItemOrdemCompra INTEGER PRIMARY KEY AUTOINCREMENT,
      idOrdemCompra INTEGER NOT NULL,
      idProduto INTEGER,
      quantidade DECIMAL(12, 3) NOT NULL,
      valorUnitario DECIMAL(12, 2) NOT NULL,
      valorTotal DECIMAL(12, 2) NOT NULL,
      imagem VARCHAR(255),
      observacao TEXT,
      referenciaProdutoSnapshot VARCHAR(120),
      descricaoProdutoSnapshot VARCHAR(255),
      unidadeProdutoSnapshot VARCHAR(60),
      FOREIGN KEY (idOrdemCompra) REFERENCES ordemCompra (idOrdemCompra) ON DELETE CASCADE,
      FOREIGN KEY (idProduto) REFERENCES produto (idProduto)
    )
  `);

  banco.run(`
    CREATE TABLE IF NOT EXISTS valorCampoOrdemCompra (
      idValorCampoOrdemCompra INTEGER PRIMARY KEY AUTOINCREMENT,
      idOrdemCompra INTEGER NOT NULL,
      idCampoCotacao INTEGER,
      tituloSnapshot VARCHAR(150),
      valor TEXT,
      FOREIGN KEY (idOrdemCompra) REFERENCES ordemCompra (idOrdemCompra) ON DELETE CASCADE,
      FOREIGN KEY (idCampoCotacao) REFERENCES campoCotacaoConfiguravel (idCampoCotacao)
    )
  `);

  banco.run(`
    ALTER TABLE itemOrdemCompra ADD COLUMN imagem VARCHAR(255)
  `, (erro) => {
    if (erro && !String(erro.message || '').includes('duplicate column name')) {
      console.error('Nao foi possivel garantir a coluna imagem do item da ordemCompra.', erro);
    }
  });

  banco.run(`
    ALTER TABLE ordemCompra ADD COLUMN dataEntrega DATE
  `, (erro) => {
    if (erro && !String(erro.message || '').includes('duplicate column name')) {
      console.error('Nao foi possivel garantir a coluna dataEntrega da ordemCompra.', erro);
    }
  });

  banco.run(`
    UPDATE ordemCompra
    SET dataEntrega = COALESCE(dataEntrega, dataValidade)
    WHERE dataEntrega IS NULL
  `, (erro) => {
    if (erro) {
      console.error('Nao foi possivel migrar a data de entrega dos ordensCompra.', erro);
    }
  });

  banco.run(`
    ALTER TABLE ordemCompra ADD COLUMN idCotacao INTEGER
  `, (erro) => {
    if (erro && !String(erro.message || '').includes('duplicate column name')) {
      console.error('Nao foi possivel garantir a coluna idCotacao da ordemCompra.', erro);
    }
  });

  banco.run(`
    ALTER TABLE ordemCompra ADD COLUMN codigoCotacaoOrigem INTEGER
  `, (erro) => {
    if (erro && !String(erro.message || '').includes('duplicate column name')) {
      console.error('Nao foi possivel garantir a coluna codigoCotacaoOrigem da ordemCompra.', erro);
    }
  });

  banco.run(`
    ALTER TABLE ordemCompra ADD COLUMN nomeFornecedorSnapshot VARCHAR(255)
  `, (erro) => {
    if (erro && !String(erro.message || '').includes('duplicate column name')) {
      console.error('Nao foi possivel garantir a coluna nomeFornecedorSnapshot da ordemCompra.', erro);
    }
  });

  banco.run(`
    ALTER TABLE ordemCompra ADD COLUMN nomeContatoSnapshot VARCHAR(255)
  `, (erro) => {
    if (erro && !String(erro.message || '').includes('duplicate column name')) {
      console.error('Nao foi possivel garantir a coluna nomeContatoSnapshot da ordemCompra.', erro);
    }
  });

  banco.run(`
    ALTER TABLE ordemCompra ADD COLUMN nomeUsuarioSnapshot VARCHAR(150)
  `, (erro) => {
    if (erro && !String(erro.message || '').includes('duplicate column name')) {
      console.error('Nao foi possivel garantir a coluna nomeUsuarioSnapshot da ordemCompra.', erro);
    }
  });

  banco.run(`
    ALTER TABLE ordemCompra ADD COLUMN nomeCompradorSnapshot VARCHAR(150)
  `, (erro) => {
    if (erro && !String(erro.message || '').includes('duplicate column name')) {
      console.error('Nao foi possivel garantir a coluna nomeCompradorSnapshot da ordemCompra.', erro);
    }
  });

  banco.run(`
    ALTER TABLE ordemCompra ADD COLUMN nomeMetodoPagamentoSnapshot VARCHAR(150)
  `, (erro) => {
    if (erro && !String(erro.message || '').includes('duplicate column name')) {
      console.error('Nao foi possivel garantir a coluna nomeMetodoPagamentoSnapshot da ordemCompra.', erro);
    }
  });

  banco.run(`
    ALTER TABLE ordemCompra ADD COLUMN nomePrazoPagamentoSnapshot VARCHAR(255)
  `, (erro) => {
    if (erro && !String(erro.message || '').includes('duplicate column name')) {
      console.error('Nao foi possivel garantir a coluna nomePrazoPagamentoSnapshot da ordemCompra.', erro);
    }
  });

  banco.run(`
    ALTER TABLE ordemCompra ADD COLUMN idTipoOrdemCompra INTEGER
  `, (erro) => {
    if (erro && !String(erro.message || '').includes('duplicate column name')) {
      console.error('Nao foi possivel garantir a coluna idTipoOrdemCompra da ordemCompra.', erro);
    }
  });

  banco.run(`
    ALTER TABLE ordemCompra ADD COLUMN nomeTipoOrdemCompraSnapshot VARCHAR(150)
  `, (erro) => {
    if (erro && !String(erro.message || '').includes('duplicate column name')) {
      console.error('Nao foi possivel garantir a coluna nomeTipoOrdemCompraSnapshot da ordemCompra.', erro);
    }
  });

  banco.run(`
    ALTER TABLE ordemCompra ADD COLUMN nomeEtapaOrdemCompraSnapshot VARCHAR(150)
  `, (erro) => {
    if (erro && !String(erro.message || '').includes('duplicate column name')) {
      console.error('Nao foi possivel garantir a coluna nomeEtapaOrdemCompraSnapshot da ordemCompra.', erro);
    }
  });



  banco.run(`
    ALTER TABLE itemOrdemCompra ADD COLUMN referenciaProdutoSnapshot VARCHAR(120)
  `, (erro) => {
    if (erro && !String(erro.message || '').includes('duplicate column name')) {
      console.error('Nao foi possivel garantir a coluna referenciaProdutoSnapshot do item da ordemCompra.', erro);
    }
  });

  banco.run(`
    ALTER TABLE itemOrdemCompra ADD COLUMN descricaoProdutoSnapshot VARCHAR(255)
  `, (erro) => {
    if (erro && !String(erro.message || '').includes('duplicate column name')) {
      console.error('Nao foi possivel garantir a coluna descricaoProdutoSnapshot do item da ordemCompra.', erro);
    }
  });

  banco.run(`
    ALTER TABLE itemOrdemCompra ADD COLUMN unidadeProdutoSnapshot VARCHAR(60)
  `, (erro) => {
    if (erro && !String(erro.message || '').includes('duplicate column name')) {
      console.error('Nao foi possivel garantir a coluna unidadeProdutoSnapshot do item da ordemCompra.', erro);
    }
  });

  banco.run(`
    ALTER TABLE valorCampoOrdemCompra ADD COLUMN tituloSnapshot VARCHAR(150)
  `, (erro) => {
    if (erro && !String(erro.message || '').includes('duplicate column name')) {
      console.error('Nao foi possivel garantir a coluna tituloSnapshot do valor de campo da ordemCompra.', erro);
    }
  });

  banco.run(`
    ALTER TABLE valorCampoOrdemCompra ADD COLUMN idCampoOrdemCompra INTEGER
  `, (erro) => {
    if (erro && !String(erro.message || '').includes('duplicate column name')) {
      console.error('Nao foi possivel garantir a coluna idCampoOrdemCompra do valor de campo da ordemCompra.', erro);
    }
  });

  migrarDadosLegadosCotacao();

  banco.all(
    'PRAGMA table_info(atendimento)',
    (erro, colunasAtendimento) => {
      if (erro || !Array.isArray(colunasAtendimento) || colunasAtendimento.length === 0) {
        if (erro) {
          console.error('Nao foi possivel consultar a estrutura da tabela atendimento.', erro);
        }
        return;
      }

      const possuiIdUsuario = colunasAtendimento.some((coluna) => coluna.name === 'idUsuario');
      const possuiIdComprador = colunasAtendimento.some((coluna) => coluna.name === 'idComprador');

      if (possuiIdUsuario && !possuiIdComprador) {
        return;
      }

      const expressaoIdUsuario = possuiIdUsuario
        ? `COALESCE(
            atendimento.idUsuario,
            (
              SELECT usuario.idUsuario
              FROM usuario
              WHERE usuario.idComprador = atendimento.idComprador
              ORDER BY usuario.idUsuario
              LIMIT 1
            ),
            1
          )`
        : `COALESCE(
            (
              SELECT usuario.idUsuario
              FROM usuario
              WHERE usuario.idComprador = atendimento.idComprador
              ORDER BY usuario.idUsuario
              LIMIT 1
            ),
            1
          )`;

      banco.serialize(() => {
        banco.run('PRAGMA foreign_keys = OFF');
        banco.run('DROP TABLE IF EXISTS atendimento_temp');
        banco.run(`
          CREATE TABLE atendimento_temp (
            idAtendimento INTEGER PRIMARY KEY AUTOINCREMENT,
            idAgendamento INTEGER,
            idFornecedor INTEGER NOT NULL,
            idContato INTEGER,
            idUsuario INTEGER NOT NULL,
            assunto VARCHAR(150) NOT NULL,
            descricao TEXT,
            data DATETIME NOT NULL,
            horaInicio VARCHAR(5) NOT NULL,
            horaFim VARCHAR(5) NOT NULL,
            idTipoAtendimento INTEGER,
            idCanalAtendimento INTEGER,
            idOrigemAtendimento INTEGER,
            status BOOLEAN NOT NULL DEFAULT 1,
            dataCriacao TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (idAgendamento) REFERENCES agendamento (idAgendamento),
            FOREIGN KEY (idFornecedor) REFERENCES fornecedor (idFornecedor),
            FOREIGN KEY (idContato) REFERENCES contato (idContato),
            FOREIGN KEY (idUsuario) REFERENCES usuario (idUsuario),
            FOREIGN KEY (idTipoAtendimento) REFERENCES tipoAtendimento (idTipoAtendimento),
            FOREIGN KEY (idCanalAtendimento) REFERENCES canalAtendimento (idCanalAtendimento),
            FOREIGN KEY (idOrigemAtendimento) REFERENCES origemAtendimento (idOrigemAtendimento)
          )
        `);
        banco.run(`
          INSERT INTO atendimento_temp (
            idAtendimento,
            idAgendamento,
            idFornecedor,
            idContato,
            idUsuario,
            assunto,
            descricao,
            data,
            horaInicio,
            horaFim,
            idTipoAtendimento,
            idCanalAtendimento,
            idOrigemAtendimento,
            status,
            dataCriacao
          )
          SELECT
            atendimento.idAtendimento,
            NULL,
            atendimento.idFornecedor,
            atendimento.idContato,
            ${expressaoIdUsuario},
            atendimento.assunto,
            atendimento.descricao,
            atendimento.data,
            atendimento.horaInicio,
            atendimento.horaFim,
            atendimento.idTipoAtendimento,
            atendimento.idCanalAtendimento,
            atendimento.idOrigemAtendimento,
            atendimento.status,
            atendimento.dataCriacao
          FROM atendimento
        `);
        banco.run('DROP TABLE atendimento');
        banco.run('ALTER TABLE atendimento_temp RENAME TO atendimento');
        banco.run('PRAGMA foreign_keys = ON');
      });
    }
  );

  banco.run(`
    ALTER TABLE atendimento ADD COLUMN idAgendamento INTEGER
  `, (erro) => {
    if (erro && !String(erro.message || '').includes('duplicate column name')) {
      console.error('Nao foi possivel garantir a coluna idAgendamento do atendimento.', erro);
    }
  });

  banco.run(`
    ALTER TABLE atendimento ADD COLUMN idTipoAtendimento INTEGER
  `, (erro) => {
    if (erro && !String(erro.message || '').includes('duplicate column name')) {
      console.error('Nao foi possivel garantir a coluna idTipoAtendimento do atendimento.', erro);
    }
  });

  banco.run(`
    INSERT OR IGNORE INTO agendamentoStatusUsuario (idAgendamento, idUsuario, idStatusVisita)
    SELECT
      agendamentoUsuario.idAgendamento,
      agendamentoUsuario.idUsuario,
      COALESCE(agendamento.idStatusVisita, 1)
    FROM agendamentoUsuario
    INNER JOIN agendamento
      ON agendamento.idAgendamento = agendamentoUsuario.idAgendamento
    WHERE agendamentoUsuario.idUsuario IS NOT NULL
      AND COALESCE(agendamento.idStatusVisita, 0) > 0
  `);

  banco.run(`
    CREATE TABLE IF NOT EXISTS produto (
      idProduto INTEGER PRIMARY KEY AUTOINCREMENT,
      referencia VARCHAR(100) NOT NULL,
      descricao VARCHAR(255) NOT NULL,
      idGrupo INTEGER NOT NULL,
      idMarca INTEGER NOT NULL,
      idUnidade INTEGER NOT NULL,
      custo DECIMAL(10,2) NOT NULL DEFAULT 0,
      imagem VARCHAR(255),
      status BOOLEAN NOT NULL DEFAULT 1,
      dataCriacao TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (idGrupo) REFERENCES grupoProduto (idGrupo),
      FOREIGN KEY (idMarca) REFERENCES marca (idMarca),
      FOREIGN KEY (idUnidade) REFERENCES unidadeMedida (idUnidade)
    )
  `);

  banco.run(`
    CREATE TABLE IF NOT EXISTS produtoFornecedor (
      idProdutoFornecedor INTEGER PRIMARY KEY AUTOINCREMENT,
      idProduto INTEGER NOT NULL,
      idFornecedor INTEGER NOT NULL,
      codigoFornecedor VARCHAR(120) NOT NULL,
      unidadeFornecedor VARCHAR(60) NOT NULL,
      dataCriacao TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (idProduto) REFERENCES produto (idProduto) ON DELETE CASCADE,
      FOREIGN KEY (idFornecedor) REFERENCES fornecedor (idFornecedor),
      UNIQUE (idProduto, idFornecedor)
    )
  `);

  banco.get(
    'SELECT COUNT(*) AS total FROM statusVisita',
    (_erroConsulta, resultado) => {
      if ((resultado?.total || 0) > 0) {
        return;
      }

      const statusPadrao = [
        { idStatusVisita: ID_STATUS_VISITA_AGENDADO, descricao: 'Agendado', icone: '📅', ordem: 1 },
        { idStatusVisita: ID_STATUS_VISITA_CONFIRMADO, descricao: 'Confirmado', icone: '✅', ordem: 2 },
        { idStatusVisita: ID_STATUS_VISITA_REALIZADO, descricao: 'Realizado', icone: '🤝', ordem: 3 },
        { idStatusVisita: ID_STATUS_VISITA_CANCELADO, descricao: 'Cancelado', icone: '❌', ordem: 4 },
        { idStatusVisita: ID_STATUS_VISITA_NAO_COMPARECEU, descricao: 'Nao compareceu', icone: '⚠️', ordem: 5 }
      ];

      statusPadrao.forEach((status) => {
        banco.run(
          'INSERT INTO statusVisita (idStatusVisita, descricao, icone, ordem, status) VALUES (?, ?, ?, ?, ?)',
          [status.idStatusVisita, status.descricao, status.icone, status.ordem, 1]
        );
      });
    }
  );

  banco.get(
    'SELECT COUNT(*) AS total FROM tipoAgenda',
    (_erroConsulta, resultado) => {
      if ((resultado?.total || 0) > 0) {
        return;
      }

      const tiposAgendaPadrao = [
        { descricao: 'Visita', cor: '#BFE3D0', ordem: 1 },
        { descricao: 'Reuniao', cor: '#CFE5FF', ordem: 2 },
        { descricao: 'Ligacao', cor: '#FFE2A8', ordem: 3 },
        { descricao: 'Apresentacao', cor: '#D9EAF7', ordem: 4 }
      ];

      tiposAgendaPadrao.forEach((tipoAgenda) => {
        banco.run(
          'INSERT INTO tipoAgenda (descricao, cor, ordem, status) VALUES (?, ?, ?, ?)',
          [tipoAgenda.descricao, tipoAgenda.cor, tipoAgenda.ordem, 1]
        );
      });
    }
  );

  garantirRegistrosObrigatorios().catch((erro) => {
    console.error('Nao foi possivel garantir os registros obrigatorios de configuracao.', erro);
  });
});

async function garantirRegistrosObrigatorios() {
  await garantirConfiguracaoAtualizacaoSistemaPadrao();
  await removerColunaAbreviacaoDasEtapas();
  await removerColunaSiglaDosRecursos();
  await garantirPrazosPagamentoComDiasOpcionais();
  await garantirUsuarioAdministradorPadrao();
  await garantirConceitosFornecedorObrigatorios();
  await garantirTiposOrdemCompraObrigatorios();
  await garantirEtapasOrdemCompraObrigatorias();
  await garantirEtapasCotacaoObrigatorias();
  await garantirStatusAgendaObrigatorios();
  await garantirTiposAgendaObrigatorios();
}

async function garantirConceitosFornecedorObrigatorios() {
  const conceitoObrigatorio = {
    idConceito: ID_CONCEITO_FORNECEDOR_SEM_CONCEITO,
    descricao: 'Sem Conceito',
    status: 1
  };

  const existente = await consultarUm(
    'SELECT idConceito FROM conceitoFornecedor WHERE idConceito = ?',
    [conceitoObrigatorio.idConceito]
  );

  if (!existente) {
    await executar(
      'INSERT INTO conceitoFornecedor (idConceito, descricao, status) VALUES (?, ?, ?)',
      [conceitoObrigatorio.idConceito, conceitoObrigatorio.descricao, conceitoObrigatorio.status]
    );
  } else {
    await executar(
      'UPDATE conceitoFornecedor SET descricao = ?, status = ? WHERE idConceito = ?',
      [conceitoObrigatorio.descricao, conceitoObrigatorio.status, conceitoObrigatorio.idConceito]
    );
  }

  await executar(
    'UPDATE fornecedor SET idConceito = ? WHERE idConceito IS NULL OR CAST(idConceito AS TEXT) = \'\'',
    [conceitoObrigatorio.idConceito]
  );
}

async function garantirConfiguracaoAtualizacaoSistemaPadrao() {
  const urlRepositorioPadrao = 'https://github.com/TailonSilva/connecta-crm';
  const existente = await consultarUm(
    'SELECT idConfiguracaoAtualizacao FROM configuracaoAtualizacaoSistema WHERE idConfiguracaoAtualizacao = 1'
  );

  if (!existente) {
    await executar(
      `
        INSERT INTO configuracaoAtualizacaoSistema (
          idConfiguracaoAtualizacao,
          urlRepositorio
        ) VALUES (?, ?)
      `,
      [1, urlRepositorioPadrao]
    );
    return;
  }

  await executar(
    `
      UPDATE configuracaoAtualizacaoSistema
      SET urlRepositorio = COALESCE(NULLIF(urlRepositorio, ''), ?)
      WHERE idConfiguracaoAtualizacao = 1
    `,
    [urlRepositorioPadrao]
  );
}

async function garantirUsuarioAdministradorPadrao() {
  const usuarioAdministrador = {
    nome: 'Administrador',
    usuario: 'admin',
    senha: 'admin@123',
    tipo: 'Administrador',
    ativo: 1
  };

  const existente = await consultarUm(
    'SELECT idUsuario FROM usuario WHERE LOWER(TRIM(usuario)) = LOWER(TRIM(?))',
    [usuarioAdministrador.usuario]
  );

  if (!existente) {
    await executar(
      'INSERT INTO usuario (nome, usuario, senha, tipo, ativo) VALUES (?, ?, ?, ?, ?)',
      [
        usuarioAdministrador.nome,
        usuarioAdministrador.usuario,
        usuarioAdministrador.senha,
        usuarioAdministrador.tipo,
        usuarioAdministrador.ativo
      ]
    );
    return;
  }

  await executar(
    'UPDATE usuario SET nome = ?, senha = ?, tipo = ?, ativo = 1 WHERE idUsuario = ?',
    [
      usuarioAdministrador.nome,
      usuarioAdministrador.senha,
      usuarioAdministrador.tipo,
      existente.idUsuario
    ]
  );
}

async function garantirEtapasCotacaoObrigatorias() {
  const etapasObrigatorias = [
    { idEtapaCotacao: ID_ETAPA_COTACAO_FECHAMENTO, descricao: 'Fechado', cor: '#A7E1B8', consideraFunilCotacoes: 1, ordem: 1, status: 1 },
    { idEtapaCotacao: ID_ETAPA_COTACAO_FECHADA_SEM_ORDEM_COMPRA, descricao: 'Fechado sem ordem de compra', cor: '#FDE68A', consideraFunilCotacoes: 1, ordem: 2, status: 1 },
    { idEtapaCotacao: ID_ETAPA_COTACAO_ORDEM_COMPRA_EXCLUIDA, descricao: 'Ordem de Compra Excluida', cor: '#E5E7EB', consideraFunilCotacoes: 0, ordem: 3, status: 1 },
    { idEtapaCotacao: ID_ETAPA_COTACAO_RECUSADO, descricao: 'Recusado', cor: '#E5E7EB', consideraFunilCotacoes: 0, ordem: 4, status: 1 }
  ];

  await executar(
    `UPDATE etapaCotacao
    SET descricao = 'Ordem de Compra Excluida', cor = '#E5E7EB', consideraFunilCotacoes = 0, ordem = 3, status = 1
    WHERE idEtapaCotacao = ?`,
    [ID_ETAPA_COTACAO_ORDEM_COMPRA_EXCLUIDA]
  );

  const etapaRecusadoPorDescricao = await consultarUm(
    `SELECT idEtapaCotacao
    FROM etapaCotacao
    WHERE LOWER(TRIM(descricao)) = 'recusado'
    ORDER BY CASE WHEN idEtapaCotacao = ? THEN 0 ELSE 1 END, idEtapaCotacao
    LIMIT 1`,
    [ID_ETAPA_COTACAO_RECUSADO]
  );

  if (etapaRecusadoPorDescricao && Number(etapaRecusadoPorDescricao.idEtapaCotacao) !== ID_ETAPA_COTACAO_RECUSADO) {
    await executar(
      'UPDATE cotacao SET idEtapaCotacao = ? WHERE idEtapaCotacao = ?',
      [ID_ETAPA_COTACAO_RECUSADO, Number(etapaRecusadoPorDescricao.idEtapaCotacao)]
    );

    await executar(
      `UPDATE etapaCotacao
      SET descricao = 'Recusado (legado)', status = 0, consideraFunilCotacoes = 0
      WHERE idEtapaCotacao = ?`,
      [Number(etapaRecusadoPorDescricao.idEtapaCotacao)]
    );
  }

  for (const etapa of etapasObrigatorias) {
    const existente = await consultarUm(
      'SELECT idEtapaCotacao FROM etapaCotacao WHERE idEtapaCotacao = ?',
      [etapa.idEtapaCotacao]
    );

    if (!existente) {
      await executar(
        'INSERT INTO etapaCotacao (idEtapaCotacao, descricao, cor, consideraFunilCotacoes, ordem, status) VALUES (?, ?, ?, ?, ?, ?)' ,
        [etapa.idEtapaCotacao, etapa.descricao, etapa.cor, etapa.consideraFunilCotacoes, etapa.ordem, etapa.status]
      );
      continue;
    }

    await executar(
      'UPDATE etapaCotacao SET descricao = ?, cor = ?, status = ?, consideraFunilCotacoes = ?, ordem = ? WHERE idEtapaCotacao = ?',
      [etapa.descricao, etapa.cor, etapa.status, etapa.consideraFunilCotacoes, etapa.ordem, etapa.idEtapaCotacao]
    );
  }

  const etapasCancelamentoLegadas = await consultarTodos(
    `SELECT idEtapaCotacao
    FROM etapaCotacao
    WHERE idEtapaCotacao NOT IN (?, ?)
      AND LOWER(TRIM(descricao)) IN ('recusado', 'ordem de compra excluida')`,
    [ID_ETAPA_COTACAO_ORDEM_COMPRA_EXCLUIDA, ID_ETAPA_COTACAO_RECUSADO]
  );

  const idsEtapasLegadas = etapasCancelamentoLegadas
    .map((etapa) => Number(etapa.idEtapaCotacao || 0))
    .filter((idEtapa) => Number.isFinite(idEtapa) && idEtapa > 0);

  if (idsEtapasLegadas.length > 0) {
    const marcadores = idsEtapasLegadas.map(() => '?').join(', ');

    await executar(
      `UPDATE cotacao
      SET idEtapaCotacao = ?
      WHERE idEtapaCotacao IN (${marcadores})`,
      [ID_ETAPA_COTACAO_RECUSADO, ...idsEtapasLegadas]
    );

    await executar(
      `UPDATE etapaCotacao
      SET descricao = 'Etapa de cancelamento legada', status = 0, consideraFunilCotacoes = 0
      WHERE idEtapaCotacao IN (${marcadores})`,
      idsEtapasLegadas
    );
  }

  await executar(
    'UPDATE cotacao SET idEtapaCotacao = ? WHERE idOrdemCompraVinculado IS NULL AND idEtapaCotacao = ?',
    [ID_ETAPA_COTACAO_FECHADA_SEM_ORDEM_COMPRA, ID_ETAPA_COTACAO_FECHAMENTO]
  );
}

async function garantirEtapasOrdemCompraObrigatorias() {
  const etapaObrigatoria = {
    idEtapa: ID_ETAPA_ORDEM_COMPRA_ENTREGUE,
    descricao: 'Entregue',
    cor: '#A7E1B8',
    ordem: 5,
    status: 1
  };

  const existente = await consultarUm(
    'SELECT idEtapa FROM etapaOrdemCompra WHERE idEtapa = ?',
    [etapaObrigatoria.idEtapa]
  );

  if (!existente) {
    await executar(
      'INSERT INTO etapaOrdemCompra (idEtapa, descricao, cor, ordem, status) VALUES (?, ?, ?, ?, ?)',
      [
        etapaObrigatoria.idEtapa,
        etapaObrigatoria.descricao,
        etapaObrigatoria.cor,
        etapaObrigatoria.ordem,
        etapaObrigatoria.status
      ]
    );
    return;
  }

  await executar(
    'UPDATE etapaOrdemCompra SET status = 1, cor = COALESCE(cor, ?), ordem = CASE WHEN ordem IS NULL OR ordem <= 0 THEN ? ELSE ordem END WHERE idEtapa = ?',
    [etapaObrigatoria.cor, etapaObrigatoria.ordem, etapaObrigatoria.idEtapa]
  );
}

async function garantirTiposOrdemCompraObrigatorios() {
  const tiposObrigatorios = [
    { idTipoOrdemCompra: ID_TIPO_ORDEM_COMPRA_PADRAO, descricao: 'Ordem de compra', status: 1 }
  ];

  for (const tipoOrdemCompra of tiposObrigatorios) {
    const existente = await consultarUm(
      'SELECT idTipoOrdemCompra FROM tipoOrdemCompra WHERE idTipoOrdemCompra = ?',
      [tipoOrdemCompra.idTipoOrdemCompra]
    );

    if (!existente) {
      await executar(
        'INSERT INTO tipoOrdemCompra (idTipoOrdemCompra, descricao, status) VALUES (?, ?, ?)',
        [tipoOrdemCompra.idTipoOrdemCompra, tipoOrdemCompra.descricao, tipoOrdemCompra.status]
      );
      continue;
    }

    await executar(
      'UPDATE tipoOrdemCompra SET descricao = ?, status = ? WHERE idTipoOrdemCompra = ?',
      [tipoOrdemCompra.descricao, tipoOrdemCompra.status, tipoOrdemCompra.idTipoOrdemCompra]
    );
  }
}

async function removerColunaAbreviacaoDasEtapas() {
  await migrarTabelaSemAbreviacao(
    'etapaOrdemCompra',
    'idEtapa',
    [
      'idEtapa INTEGER PRIMARY KEY AUTOINCREMENT',
      'descricao VARCHAR(150) NOT NULL',
      "cor VARCHAR(20) NOT NULL DEFAULT '#EC8702'",
      'ordem INTEGER NOT NULL DEFAULT 0',
      'status BOOLEAN NOT NULL DEFAULT 1'
    ],
    ['idEtapa', 'descricao', 'cor', 'ordem', 'status'],
    'idEtapa, descricao, COALESCE(cor, "#EC8702") AS cor, COALESCE(ordem, idEtapa) AS ordem, COALESCE(status, 1) AS status'
  );

  await migrarTabelaSemAbreviacao(
    'etapaCotacao',
    'idEtapaCotacao',
    [
      'idEtapaCotacao INTEGER PRIMARY KEY AUTOINCREMENT',
      'descricao VARCHAR(150) NOT NULL',
      "cor VARCHAR(20) NOT NULL DEFAULT '#EC8702'",
      'consideraFunilCotacoes BOOLEAN NOT NULL DEFAULT 1',
      'ordem INTEGER NOT NULL DEFAULT 0',
      'status BOOLEAN NOT NULL DEFAULT 1'
    ],
    ['idEtapaCotacao', 'descricao', 'cor', 'consideraFunilCotacoes', 'ordem', 'status'],
    'idEtapaCotacao, descricao, COALESCE(cor, "#EC8702") AS cor, COALESCE(consideraFunilCotacoes, 1) AS consideraFunilCotacoes, COALESCE(ordem, idEtapaCotacao) AS ordem, COALESCE(status, 1) AS status'
  );
}

async function migrarTabelaSemAbreviacao(nomeTabela, chavePrimaria, declaracoesColunas, colunasDestino, selecaoColunas) {
  const colunas = await consultarTodos(`PRAGMA table_info(${nomeTabela})`);
  const possuiAbreviacao = colunas.some((coluna) => coluna.name === 'abreviacao');

  if (!possuiAbreviacao) {
    return;
  }

  const nomeTabelaNova = `${nomeTabela}_semAbreviacao`;

  await executar('PRAGMA foreign_keys = OFF');

  try {
    await executar('BEGIN TRANSACTION');
    await executar(`CREATE TABLE ${nomeTabelaNova} (${declaracoesColunas.join(', ')})`);
    await executar(
      `INSERT INTO ${nomeTabelaNova} (${colunasDestino.join(', ')}) SELECT ${selecaoColunas} FROM ${nomeTabela}`
    );
    await executar(`DROP TABLE ${nomeTabela}`);
    await executar(`ALTER TABLE ${nomeTabelaNova} RENAME TO ${nomeTabela}`);
    await executar('COMMIT');
  } catch (erro) {
    await executar('ROLLBACK');
    throw erro;
  } finally {
    await executar('PRAGMA foreign_keys = ON');
  }

  await executar(
    `UPDATE ${nomeTabela} SET ordem = ${chavePrimaria} WHERE ordem IS NULL OR ordem <= 0`
  );
}

async function garantirPrazosPagamentoComDiasOpcionais() {
  const colunas = await consultarTodos('PRAGMA table_info(prazoPagamento)');
  const colunaPrazo1 = colunas.find((coluna) => coluna.name === 'prazo1');

  if (!colunaPrazo1 || Number(colunaPrazo1.notnull) === 0) {
    return;
  }

  await executar('PRAGMA foreign_keys = OFF');

  try {
    await executar('BEGIN TRANSACTION');
    await executar(`
      CREATE TABLE prazoPagamento_diasOpcionais (
        idPrazoPagamento INTEGER PRIMARY KEY AUTOINCREMENT,
        descricao VARCHAR(150),
        idMetodoPagamento INTEGER NOT NULL,
        prazo1 INTEGER,
        prazo2 INTEGER,
        prazo3 INTEGER,
        prazo4 INTEGER,
        prazo5 INTEGER,
        prazo6 INTEGER,
        status BOOLEAN NOT NULL DEFAULT 1,
        FOREIGN KEY (idMetodoPagamento) REFERENCES metodoPagamento (idMetodoPagamento)
      )
    `);
    await executar(`
      INSERT INTO prazoPagamento_diasOpcionais (
        idPrazoPagamento,
        descricao,
        idMetodoPagamento,
        prazo1,
        prazo2,
        prazo3,
        prazo4,
        prazo5,
        prazo6,
        status
      )
      SELECT
        idPrazoPagamento,
        descricao,
        idMetodoPagamento,
        prazo1,
        prazo2,
        prazo3,
        prazo4,
        prazo5,
        prazo6,
        COALESCE(status, 1)
      FROM prazoPagamento
    `);
    await executar('DROP TABLE prazoPagamento');
    await executar('ALTER TABLE prazoPagamento_diasOpcionais RENAME TO prazoPagamento');
    await executar('COMMIT');
  } catch (erro) {
    await executar('ROLLBACK');
    throw erro;
  } finally {
    await executar('PRAGMA foreign_keys = ON');
  }
}

async function removerColunaSiglaDosRecursos() {
  const colunas = await consultarTodos('PRAGMA table_info(recurso)');
  const possuiSigla = colunas.some((coluna) => coluna.name === 'sigla');

  if (!possuiSigla) {
    return;
  }

  const nomeTabelaNova = 'recurso_semSigla';

  await executar('PRAGMA foreign_keys = OFF');

  try {
    await executar('BEGIN TRANSACTION');
    await executar(`
      CREATE TABLE ${nomeTabelaNova} (
        idRecurso INTEGER PRIMARY KEY AUTOINCREMENT,
        descricao VARCHAR(150) NOT NULL,
        idTipoRecurso INTEGER NOT NULL,
        status BOOLEAN NOT NULL DEFAULT 1,
        FOREIGN KEY (idTipoRecurso) REFERENCES tipoRecurso (idTipoRecurso)
      )
    `);
    await executar(`
      INSERT INTO ${nomeTabelaNova} (idRecurso, descricao, idTipoRecurso, status)
      SELECT idRecurso, descricao, idTipoRecurso, COALESCE(status, 1)
      FROM recurso
    `);
    await executar('DROP TABLE recurso');
    await executar(`ALTER TABLE ${nomeTabelaNova} RENAME TO recurso`);
    await executar('COMMIT');
  } catch (erro) {
    await executar('ROLLBACK');
    throw erro;
  } finally {
    await executar('PRAGMA foreign_keys = ON');
  }
}

async function garantirStatusAgendaObrigatorios() {
  const statusObrigatorios = [
    { idStatusVisita: ID_STATUS_VISITA_AGENDADO, descricao: 'Agendado', icone: '📅', ordem: 1, status: 1 },
    { idStatusVisita: ID_STATUS_VISITA_CONFIRMADO, descricao: 'Confirmado', icone: '✅', ordem: 2, status: 1 },
    { idStatusVisita: ID_STATUS_VISITA_REALIZADO, descricao: 'Realizado', icone: '🤝', ordem: 3, status: 1 },
    { idStatusVisita: ID_STATUS_VISITA_CANCELADO, descricao: 'Cancelado', icone: '❌', ordem: 4, status: 1 },
    { idStatusVisita: ID_STATUS_VISITA_NAO_COMPARECEU, descricao: 'Nao compareceu', icone: '⚠️', ordem: 5, status: 1 }
  ];

  for (const statusVisita of statusObrigatorios) {
    const existente = await consultarUm(
      'SELECT idStatusVisita FROM statusVisita WHERE idStatusVisita = ?',
      [statusVisita.idStatusVisita]
    );

    if (!existente) {
      await executar(
        'INSERT INTO statusVisita (idStatusVisita, descricao, icone, ordem, status) VALUES (?, ?, ?, ?, ?)',
        [statusVisita.idStatusVisita, statusVisita.descricao, statusVisita.icone, statusVisita.ordem, statusVisita.status]
      );
      continue;
    }

    await executar(
      'UPDATE statusVisita SET descricao = ?, icone = ?, ordem = COALESCE(ordem, ?), status = ? WHERE idStatusVisita = ?',
      [statusVisita.descricao, statusVisita.icone, statusVisita.ordem, statusVisita.status, statusVisita.idStatusVisita]
    );
  }
}

async function garantirLocaisAgendaObrigatorios() {
  const locais = ['Escritorio', 'Fornecedor', 'Online'];

  for (const descricao of locais) {
    const existente = await consultarUm(
      'SELECT idLocal FROM localAgenda WHERE LOWER(TRIM(descricao)) = LOWER(TRIM(?))',
      [descricao]
    );

    if (!existente) {
      await executar(
        'INSERT INTO localAgenda (descricao, status) VALUES (?, ?)',
        [descricao, 1]
      );
      continue;
    }

    await executar('UPDATE localAgenda SET status = 1 WHERE idLocal = ?', [existente.idLocal]);
  }
}

async function garantirTiposRecursoObrigatorios() {
  const tipos = ['Sala', 'Veiculo', 'Equipamento'];

  for (const descricao of tipos) {
    const existente = await consultarUm(
      'SELECT idTipoRecurso FROM tipoRecurso WHERE LOWER(TRIM(descricao)) = LOWER(TRIM(?))',
      [descricao]
    );

    if (!existente) {
      await executar(
        'INSERT INTO tipoRecurso (descricao, status) VALUES (?, ?)',
        [descricao, 1]
      );
      continue;
    }

    await executar('UPDATE tipoRecurso SET status = 1 WHERE idTipoRecurso = ?', [existente.idTipoRecurso]);
  }
}

async function garantirRecursosObrigatorios() {
  const tipoSala = await consultarUm(
    'SELECT idTipoRecurso FROM tipoRecurso WHERE LOWER(TRIM(descricao)) = LOWER(TRIM(?))',
    ['Sala']
  );
  const tipoVeiculo = await consultarUm(
    'SELECT idTipoRecurso FROM tipoRecurso WHERE LOWER(TRIM(descricao)) = LOWER(TRIM(?))',
    ['Veiculo']
  );
  const tipoEquipamento = await consultarUm(
    'SELECT idTipoRecurso FROM tipoRecurso WHERE LOWER(TRIM(descricao)) = LOWER(TRIM(?))',
    ['Equipamento']
  );

  const recursos = [
    { descricao: 'Sala de reuniao 1', idTipoRecurso: tipoSala?.idTipoRecurso },
    { descricao: 'Carro da empresa', idTipoRecurso: tipoVeiculo?.idTipoRecurso },
    { descricao: 'Notebook comercial', idTipoRecurso: tipoEquipamento?.idTipoRecurso }
  ].filter((recurso) => recurso.idTipoRecurso);

  for (const recurso of recursos) {
    const existente = await consultarUm(
      'SELECT idRecurso FROM recurso WHERE LOWER(TRIM(descricao)) = LOWER(TRIM(?)) AND idTipoRecurso = ?',
      [recurso.descricao, recurso.idTipoRecurso]
    );

    if (!existente) {
      await executar(
        'INSERT INTO recurso (descricao, idTipoRecurso, status) VALUES (?, ?, ?)',
        [recurso.descricao, recurso.idTipoRecurso, 1]
      );
      continue;
    }

    await executar(
      'UPDATE recurso SET descricao = ?, idTipoRecurso = ?, status = 1 WHERE idRecurso = ?',
      [recurso.descricao, recurso.idTipoRecurso, existente.idRecurso]
    );
  }
}

async function garantirTiposAgendaObrigatorios() {
  const tipos = [
    { descricao: 'Visita', cor: '#BFE3D0', ordem: 1, status: 1 },
    { descricao: 'Reuniao', cor: '#CFE5FF', ordem: 2, status: 1 },
    { descricao: 'Ligacao', cor: '#FFE2A8', ordem: 3, status: 1 },
    { descricao: 'Apresentacao', cor: '#D9EAF7', ordem: 4, status: 1 }
  ];

  for (const tipo of tipos) {
    const existente = await consultarUm(
      'SELECT idTipoAgenda FROM tipoAgenda WHERE LOWER(TRIM(descricao)) = LOWER(TRIM(?))',
      [tipo.descricao]
    );

    if (!existente) {
      await executar(
        'INSERT INTO tipoAgenda (descricao, cor, ordem, status) VALUES (?, ?, ?, ?)',
        [tipo.descricao, tipo.cor, tipo.ordem, tipo.status]
      );
      continue;
    }

    await executar(
      'UPDATE tipoAgenda SET cor = ?, ordem = COALESCE(ordem, ?), status = ? WHERE idTipoAgenda = ?',
      [tipo.cor, tipo.ordem, tipo.status, existente.idTipoAgenda]
    );
  }
}

async function garantirCanaisAtendimentoObrigatorios() {
  const canais = ['Telefone', 'WhatsApp', 'E-mail', 'Presencial'];

  for (const descricao of canais) {
    const existente = await consultarUm(
      'SELECT idCanalAtendimento FROM canalAtendimento WHERE LOWER(TRIM(descricao)) = LOWER(TRIM(?))',
      [descricao]
    );

    if (!existente) {
      await executar(
        'INSERT INTO canalAtendimento (descricao, status) VALUES (?, ?)',
        [descricao, 1]
      );
      continue;
    }

    await executar('UPDATE canalAtendimento SET status = 1 WHERE idCanalAtendimento = ?', [existente.idCanalAtendimento]);
  }
}

async function garantirOrigensAtendimentoObrigatorias() {
  const origens = ['Fornecedor', 'Empresa'];

  for (const descricao of origens) {
    const existente = await consultarUm(
      'SELECT idOrigemAtendimento FROM origemAtendimento WHERE LOWER(TRIM(descricao)) = LOWER(TRIM(?))',
      [descricao]
    );

    if (!existente) {
      await executar(
        'INSERT INTO origemAtendimento (descricao, status) VALUES (?, ?)',
        [descricao, 1]
      );
      continue;
    }

    await executar('UPDATE origemAtendimento SET status = 1 WHERE idOrigemAtendimento = ?', [existente.idOrigemAtendimento]);
  }
}

async function garantirMetodosPagamentoObrigatorios() {
  const metodos = ['Pix', 'Boleto', 'Dinheiro', 'Cartao de credito'];

  for (const descricao of metodos) {
    const existente = await consultarUm(
      'SELECT idMetodoPagamento FROM metodoPagamento WHERE LOWER(TRIM(descricao)) = LOWER(TRIM(?))',
      [descricao]
    );

    if (!existente) {
      await executar(
        'INSERT INTO metodoPagamento (descricao, status) VALUES (?, ?)',
        [descricao, 1]
      );
      continue;
    }

    await executar('UPDATE metodoPagamento SET status = 1 WHERE idMetodoPagamento = ?', [existente.idMetodoPagamento]);
  }
}

async function garantirPrazosPagamentoObrigatorios() {
  const metodoPix = await consultarUm(
    'SELECT idMetodoPagamento FROM metodoPagamento WHERE LOWER(TRIM(descricao)) = LOWER(TRIM(?))',
    ['Pix']
  );
  const metodoBoleto = await consultarUm(
    'SELECT idMetodoPagamento FROM metodoPagamento WHERE LOWER(TRIM(descricao)) = LOWER(TRIM(?))',
    ['Boleto']
  );

  const prazos = [
    {
      descricao: 'Pix - 0 dias',
      idMetodoPagamento: metodoPix?.idMetodoPagamento,
      prazo1: 0, prazo2: null, prazo3: null, prazo4: null, prazo5: null, prazo6: null
    },
    {
      descricao: 'Boleto - 28 dias',
      idMetodoPagamento: metodoBoleto?.idMetodoPagamento,
      prazo1: 28, prazo2: null, prazo3: null, prazo4: null, prazo5: null, prazo6: null
    },
    {
      descricao: 'Boleto - 28/56 dias',
      idMetodoPagamento: metodoBoleto?.idMetodoPagamento,
      prazo1: 28, prazo2: 56, prazo3: null, prazo4: null, prazo5: null, prazo6: null
    }
  ].filter((prazo) => prazo.idMetodoPagamento);

  for (const prazo of prazos) {
    const existente = await consultarUm(
      'SELECT idPrazoPagamento FROM prazoPagamento WHERE idMetodoPagamento = ? AND COALESCE(prazo1, -1) = ? AND COALESCE(prazo2, -1) = ? AND COALESCE(prazo3, -1) = ? AND COALESCE(prazo4, -1) = ? AND COALESCE(prazo5, -1) = ? AND COALESCE(prazo6, -1) = ?',
      [
        prazo.idMetodoPagamento,
        prazo.prazo1 ?? -1,
        prazo.prazo2 ?? -1,
        prazo.prazo3 ?? -1,
        prazo.prazo4 ?? -1,
        prazo.prazo5 ?? -1,
        prazo.prazo6 ?? -1
      ]
    );

    if (!existente) {
      await executar(
        'INSERT INTO prazoPagamento (descricao, idMetodoPagamento, prazo1, prazo2, prazo3, prazo4, prazo5, prazo6, status) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)',
        [
          prazo.descricao,
          prazo.idMetodoPagamento,
          prazo.prazo1,
          prazo.prazo2,
          prazo.prazo3,
          prazo.prazo4,
          prazo.prazo5,
          prazo.prazo6,
          1
        ]
      );
      continue;
    }

    await executar('UPDATE prazoPagamento SET status = 1, descricao = ? WHERE idPrazoPagamento = ?', [prazo.descricao, existente.idPrazoPagamento]);
  }
}

async function garantirCamposOrdemCompraObrigatorios() {
  const campos = [
    {
      titulo: 'Pagamento',
      descricaoPadrao: 'Descreva aqui as condicoes de pagamento padrao da ordemCompra.'
    },
    {
      titulo: 'Entrega',
      descricaoPadrao: 'Descreva aqui as condicoes de entrega, conferencia e recebimento da ordemCompra.'
    }
  ];

  for (const campo of campos) {
    const existente = await consultarUm(
      'SELECT idCampoOrdemCompra FROM campoOrdemCompraConfiguravel WHERE LOWER(TRIM(titulo)) = LOWER(TRIM(?))',
      [campo.titulo]
    );

    if (!existente) {
      await executar(
        'INSERT INTO campoOrdemCompraConfiguravel (titulo, descricaoPadrao, status) VALUES (?, ?, ?)',
        [campo.titulo, campo.descricaoPadrao, 1]
      );
      continue;
    }

    await executar(
      'UPDATE campoOrdemCompraConfiguravel SET descricaoPadrao = COALESCE(NULLIF(descricaoPadrao, \'\'), ?), status = 1 WHERE idCampoOrdemCompra = ?',
      [campo.descricaoPadrao, existente.idCampoOrdemCompra]
    );
  }
}

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

function migrarNomeTabela(nomeAntigo, nomeNovo) {
  banco.run(`ALTER TABLE ${nomeAntigo} RENAME TO ${nomeNovo}`, (erro) => {
    if (erro && !erroMigracaoNomeEsperado(erro)) {
      console.error(`Nao foi possivel migrar a tabela ${nomeAntigo} para ${nomeNovo}.`, erro);
    }
  });
}

function migrarNomeColuna(nomeTabela, nomeAntigo, nomeNovo) {
  banco.run(`ALTER TABLE ${nomeTabela} RENAME COLUMN ${nomeAntigo} TO ${nomeNovo}`, (erro) => {
    if (erro && !erroMigracaoNomeEsperado(erro)) {
      console.error(`Nao foi possivel migrar a coluna ${nomeTabela}.${nomeAntigo} para ${nomeNovo}.`, erro);
    }
  });
}

function executarMigracaoNome(sql) {
  banco.run(sql, (erro) => {
    if (erro && !erroMigracaoNomeEsperado(erro)) {
      console.error('Nao foi possivel executar uma migracao de nomenclatura SRM.', erro);
    }
  });
}

function migrarDadosLegadosCotacao() {
  executarMigracaoNome(`
    INSERT OR IGNORE INTO etapaCotacao (idEtapaCotacao, descricao, cor, ordem, consideraFunilCotacoes, status)
    SELECT idEtapaOrcamento, descricao, cor, ordem, consideraFunilCotacoes, status
    FROM etapaOrcamento
  `);
  executarMigracaoNome('DROP TABLE IF EXISTS etapaOrcamento');

  executarMigracaoNome(`
    INSERT OR IGNORE INTO campoCotacaoConfiguravel (idCampoCotacao, titulo, descricaoPadrao, status)
    SELECT idCampoOrcamento, titulo, descricaoPadrao, status
    FROM campoOrcamentoConfiguravel
  `);
  executarMigracaoNome('DROP TABLE IF EXISTS campoOrcamentoConfiguravel');

  executarMigracaoNome(`
    INSERT OR IGNORE INTO cotacao (
      idCotacao,
      idFornecedor,
      idContato,
      idUsuario,
      idOrdemCompraVinculado,
      idComprador,
      idPrazoPagamento,
      idEtapaCotacao,
      dataInclusao,
      dataValidade,
      dataFechamento,
      observacao
    )
    SELECT
      idOrcamento,
      idFornecedor,
      idContato,
      idUsuario,
      idOrdemCompraVinculado,
      idComprador,
      idPrazoPagamento,
      idEtapaOrcamento,
      dataInclusao,
      dataValidade,
      dataFechamento,
      observacao
    FROM orcamento
  `);
  executarMigracaoNome('DROP TABLE IF EXISTS orcamento');

  executarMigracaoNome(`
    INSERT OR IGNORE INTO itemCotacao (
      idItemCotacao,
      idCotacao,
      idProduto,
      quantidade,
      valorUnitario,
      valorTotal,
      imagem,
      observacao,
      referenciaProdutoSnapshot,
      descricaoProdutoSnapshot,
      unidadeProdutoSnapshot
    )
    SELECT
      idItemOrcamento,
      idOrcamento,
      idProduto,
      quantidade,
      valorUnitario,
      valorTotal,
      imagem,
      observacao,
      referenciaProdutoSnapshot,
      descricaoProdutoSnapshot,
      unidadeProdutoSnapshot
    FROM itemOrcamento
  `);
  executarMigracaoNome('DROP TABLE IF EXISTS itemOrcamento');

  executarMigracaoNome(`
    INSERT OR IGNORE INTO valorCampoCotacao (idValorCampoCotacao, idCotacao, idCampoCotacao, valor)
    SELECT idValorCampoOrcamento, idOrcamento, idCampoOrcamento, valor
    FROM valorCampoOrcamento
  `);
  executarMigracaoNome('DROP TABLE IF EXISTS valorCampoOrcamento');
}

function erroMigracaoNomeEsperado(erro) {
  const mensagem = String(erro?.message || '').toLowerCase();
  return (
    mensagem.includes('no such table')
    || mensagem.includes('no such column')
    || mensagem.includes('already exists')
    || mensagem.includes('already another table')
    || mensagem.includes('duplicate column name')
  );
}

module.exports = {
  banco,
  caminhoBanco,
  ID_ETAPA_COTACAO_ORDEM_COMPRA_EXCLUIDA,
  ID_ETAPA_COTACAO_RECUSADO,
  ID_ETAPA_ORDEM_COMPRA_ENTREGUE,
  ID_TIPO_ORDEM_COMPRA_PADRAO,
  consultarUm,
  consultarTodos,
  executar
};
