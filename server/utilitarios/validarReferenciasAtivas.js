const { consultarUm } = require('../configuracoes/banco');

const validacoesPorEntidade = {
  usuario: [
    {
      campo: 'idComprador',
      tabela: 'comprador',
      chavePrimaria: 'idComprador',
      colunaAtiva: 'status',
      mensagem: 'Selecione um comprador ativo.'
    }
  ],
  fornecedor: [
    {
      campo: 'idComprador',
      tabela: 'comprador',
      chavePrimaria: 'idComprador',
      colunaAtiva: 'status',
      mensagem: 'Selecione um comprador ativo.'
    },
    {
      campo: 'idConceito',
      tabela: 'conceitoFornecedor',
      chavePrimaria: 'idConceito',
      colunaAtiva: 'status',
      mensagem: 'Selecione um conceito ativo.'
    },
    {
      campo: 'idRamo',
      tabela: 'ramoAtividade',
      chavePrimaria: 'idRamo',
      colunaAtiva: 'status',
      mensagem: 'Selecione um ramo de atividade ativo.'
    },
    {
      campo: 'idGrupoEmpresa',
      tabela: 'grupoEmpresa',
      chavePrimaria: 'idGrupoEmpresa',
      colunaAtiva: 'status',
      mensagem: 'Selecione um grupo de empresa ativo.'
    }
  ],
  contatoGrupoEmpresa: [
    {
      campo: 'idGrupoEmpresa',
      tabela: 'grupoEmpresa',
      chavePrimaria: 'idGrupoEmpresa',
      colunaAtiva: 'status',
      mensagem: 'Selecione um grupo de empresa ativo.'
    }
  ],
  contato: [
    {
      campo: 'idFornecedor',
      tabela: 'fornecedor',
      chavePrimaria: 'idFornecedor',
      colunaAtiva: 'status',
      mensagem: 'Selecione um fornecedor ativo.'
    }
  ],
  produto: [
    {
      campo: 'idGrupo',
      tabela: 'grupoProduto',
      chavePrimaria: 'idGrupo',
      colunaAtiva: 'status',
      mensagem: 'Selecione um grupo de produto ativo.'
    },
    {
      campo: 'idMarca',
      tabela: 'marca',
      chavePrimaria: 'idMarca',
      colunaAtiva: 'status',
      mensagem: 'Selecione uma marca ativa.'
    },
    {
      campo: 'idUnidade',
      tabela: 'unidadeMedida',
      chavePrimaria: 'idUnidade',
      colunaAtiva: 'status',
      mensagem: 'Selecione uma unidade ativa.'
    }
  ],
  produtoFornecedor: [
    {
      campo: 'idProduto',
      tabela: 'produto',
      chavePrimaria: 'idProduto',
      colunaAtiva: 'status',
      mensagem: 'Selecione um produto ativo.'
    },
    {
      campo: 'idFornecedor',
      tabela: 'fornecedor',
      chavePrimaria: 'idFornecedor',
      colunaAtiva: 'status',
      mensagem: 'Selecione um fornecedor ativo.'
    }
  ],
  grupoProdutoTamanho: [
    {
      campo: 'idGrupo',
      tabela: 'grupoProduto',
      chavePrimaria: 'idGrupo',
      colunaAtiva: 'status',
      mensagem: 'Selecione um grupo de produto ativo.'
    },
    {
      campo: 'idTamanho',
      tabela: 'tamanho',
      chavePrimaria: 'idTamanho',
      colunaAtiva: 'status',
      mensagem: 'Selecione um tamanho ativo.'
    }
  ],
  recurso: [
    {
      campo: 'idTipoRecurso',
      tabela: 'tipoRecurso',
      chavePrimaria: 'idTipoRecurso',
      colunaAtiva: 'status',
      mensagem: 'Selecione um tipo de recurso ativo.'
    }
  ],
  prazoPagamento: [
    {
      campo: 'idMetodoPagamento',
      tabela: 'metodoPagamento',
      chavePrimaria: 'idMetodoPagamento',
      colunaAtiva: 'status',
      mensagem: 'Selecione um metodo de pagamento ativo.'
    }
  ],
  atendimento: [
    {
      campo: 'idFornecedor',
      tabela: 'fornecedor',
      chavePrimaria: 'idFornecedor',
      colunaAtiva: 'status',
      mensagem: 'Selecione um fornecedor ativo.'
    },
    {
      campo: 'idContato',
      tabela: 'contato',
      chavePrimaria: 'idContato',
      colunaAtiva: 'status',
      mensagem: 'Selecione um contato ativo.'
    },
    {
      campo: 'idUsuario',
      tabela: 'usuario',
      chavePrimaria: 'idUsuario',
      colunaAtiva: 'ativo',
      mensagem: 'Selecione um usuario ativo.'
    },
    {
      campo: 'idCanalAtendimento',
      tabela: 'canalAtendimento',
      chavePrimaria: 'idCanalAtendimento',
      colunaAtiva: 'status',
      mensagem: 'Selecione um canal de atendimento ativo.'
    },
    {
      campo: 'idTipoAtendimento',
      tabela: 'tipoAtendimento',
      chavePrimaria: 'idTipoAtendimento',
      colunaAtiva: 'status',
      mensagem: 'Selecione um tipo de atendimento ativo.'
    },
    {
      campo: 'idOrigemAtendimento',
      tabela: 'origemAtendimento',
      chavePrimaria: 'idOrigemAtendimento',
      colunaAtiva: 'status',
      mensagem: 'Selecione uma origem de atendimento ativa.'
    }
  ],
  cotacao: [
    {
      campo: 'idFornecedor',
      tabela: 'fornecedor',
      chavePrimaria: 'idFornecedor',
      colunaAtiva: 'status',
      mensagem: 'Selecione um fornecedor ativo.'
    },
    {
      campo: 'idContato',
      tabela: 'contato',
      chavePrimaria: 'idContato',
      colunaAtiva: 'status',
      mensagem: 'Selecione um contato ativo.'
    },
    {
      campo: 'idUsuario',
      tabela: 'usuario',
      chavePrimaria: 'idUsuario',
      colunaAtiva: 'ativo',
      mensagem: 'Selecione um usuario ativo.'
    },
    {
      campo: 'idComprador',
      tabela: 'comprador',
      chavePrimaria: 'idComprador',
      colunaAtiva: 'status',
      mensagem: 'Selecione um comprador ativo.'
    },
    {
      campo: 'idPrazoPagamento',
      tabela: 'prazoPagamento',
      chavePrimaria: 'idPrazoPagamento',
      colunaAtiva: 'status',
      mensagem: 'Selecione um prazo de pagamento ativo.'
    },
    {
      campo: 'idEtapaCotacao',
      tabela: 'etapaCotacao',
      chavePrimaria: 'idEtapaCotacao',
      colunaAtiva: 'status',
      mensagem: 'Selecione uma etapa de cotacao ativa.'
    },
    {
      campo: 'idContato',
      tabela: 'contato',
      chavePrimaria: 'idContato',
      colunaAtiva: 'status',
      mensagem: 'Selecione um contato ativo.'
    },
    {
      campo: 'idUsuario',
      tabela: 'usuario',
      chavePrimaria: 'idUsuario',
      colunaAtiva: 'ativo',
      mensagem: 'Selecione um usuario ativo.'
    },
    {
      campo: 'idComprador',
      tabela: 'comprador',
      chavePrimaria: 'idComprador',
      colunaAtiva: 'status',
      mensagem: 'Selecione um comprador ativo.'
    },
    {
      campo: 'idPrazoPagamento',
      tabela: 'prazoPagamento',
      chavePrimaria: 'idPrazoPagamento',
      colunaAtiva: 'status',
      mensagem: 'Selecione um prazo de pagamento ativo.'
    },
    {
      campo: 'idTipoOrdemCompra',
      tabela: 'tipoOrdemCompra',
      chavePrimaria: 'idTipoOrdemCompra',
      colunaAtiva: 'status',
      mensagem: 'Selecione um tipo de ordem de compra ativa.'
    },
    {
      campo: 'idEtapaOrdemCompra',
      tabela: 'etapaOrdemCompra',
      chavePrimaria: 'idEtapa',
      colunaAtiva: 'status',
      mensagem: 'Selecione uma etapa de ordem de compra ativa.'
    }
  ],
  itemOrdemCompra: [
    {
      campo: 'idProduto',
      tabela: 'produto',
      chavePrimaria: 'idProduto',
      colunaAtiva: 'status',
      mensagem: 'Selecione um produto ativo.'
    }
  ],
  valorCampoOrdemCompra: [
    {
      campo: 'idCampoOrdemCompra',
      tabela: 'campoOrdemCompraConfiguravel',
      chavePrimaria: 'idCampoOrdemCompra',
      colunaAtiva: 'status',
      mensagem: 'Selecione um campo do ordem de compra ativa.'
    },
    {
      campo: 'idCampoCotacao',
      tabela: 'campoCotacaoConfiguravel',
      chavePrimaria: 'idCampoCotacao',
      colunaAtiva: 'status',
      mensagem: 'Selecione um campo da cotacao ativo.'
    }
  ]
};

async function validarReferenciasAtivasDaEntidade(nomeEntidade, payload = {}) {
  const validacoes = validacoesPorEntidade[nomeEntidade] || [];

  for (const validacao of validacoes) {
    const valor = payload[validacao.campo];

    if (valor === undefined || valor === null || valor === '') {
      continue;
    }

    const registro = await consultarUm(
      `SELECT ${validacao.chavePrimaria} AS idRegistro, ${validacao.colunaAtiva} AS ativoRegistro
       FROM ${validacao.tabela}
       WHERE ${validacao.chavePrimaria} = ?`,
      [valor]
    );

    if (!registro || Number(registro.ativoRegistro) !== 1) {
      const erro = new Error(validacao.mensagem);
      erro.statusCode = 400;
      throw erro;
    }
  }
}

module.exports = {
  validarReferenciasAtivasDaEntidade
};
