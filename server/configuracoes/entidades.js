const entidades = [
  {
    nome: 'ramoAtividade',
    rota: '/api/ramosAtividade',
    chavePrimaria: 'idRamo',
    camposObrigatorios: ['descricao'],
    camposPermitidos: ['descricao', 'status']
  },
  {
    nome: 'conceitoFornecedor',
    rota: '/api/conceitosFornecedor',
    chavePrimaria: 'idConceito',
    camposObrigatorios: ['descricao'],
    camposPermitidos: ['descricao', 'status']
  },
  {
    nome: 'comprador',
    rota: '/api/compradores',
    chavePrimaria: 'idComprador',
    camposObrigatorios: ['nome', 'email'],
    camposPermitidos: ['nome', 'email', 'status']
  },
  {
    nome: 'grupoProduto',
    rota: '/api/gruposProduto',
    chavePrimaria: 'idGrupo',
    camposObrigatorios: ['descricao'],
    camposPermitidos: ['descricao', 'status']
  },
  {
    nome: 'grupoEmpresa',
    rota: '/api/gruposEmpresa',
    chavePrimaria: 'idGrupoEmpresa',
    camposObrigatorios: ['descricao'],
    camposPermitidos: ['descricao', 'status']
  },
  {
    nome: 'contatoGrupoEmpresa',
    rota: '/api/contatosGruposEmpresa',
    chavePrimaria: 'idContatoGrupoEmpresa',
    camposObrigatorios: ['idGrupoEmpresa', 'nome'],
    camposPermitidos: [
      'idGrupoEmpresa',
      'nome',
      'cargo',
      'email',
      'telefone',
      'whatsapp',
      'status',
      'principal'
    ]
  },
  {
    nome: 'tamanho',
    rota: '/api/tamanhos',
    chavePrimaria: 'idTamanho',
    camposObrigatorios: ['descricao'],
    camposPermitidos: ['descricao', 'status']
  },
  {
    nome: 'grupoProdutoTamanho',
    rota: '/api/gruposProdutoTamanhos',
    chavePrimaria: 'idGrupoProdutoTamanho',
    camposObrigatorios: ['idGrupo', 'idTamanho', 'ordem'],
    camposPermitidos: ['idGrupo', 'idTamanho', 'ordem']
  },
  {
    nome: 'marca',
    rota: '/api/marcas',
    chavePrimaria: 'idMarca',
    camposObrigatorios: ['descricao'],
    camposPermitidos: ['descricao', 'status']
  },
  {
    nome: 'unidadeMedida',
    rota: '/api/unidadesMedida',
    chavePrimaria: 'idUnidade',
    camposObrigatorios: ['descricao'],
    camposPermitidos: ['descricao', 'status']
  },
  {
    nome: 'localAgenda',
    rota: '/api/locaisAgenda',
    chavePrimaria: 'idLocal',
    camposObrigatorios: ['descricao'],
    camposPermitidos: ['descricao', 'status']
  },
  {
    nome: 'tipoRecurso',
    rota: '/api/tiposRecurso',
    chavePrimaria: 'idTipoRecurso',
    camposObrigatorios: ['descricao'],
    camposPermitidos: ['descricao', 'status']
  },
  {
    nome: 'recurso',
    rota: '/api/recursos',
    chavePrimaria: 'idRecurso',
    camposObrigatorios: ['descricao', 'idTipoRecurso'],
    camposPermitidos: ['descricao', 'idTipoRecurso', 'status']
  },
  {
    nome: 'agendamento',
    rota: '/api/agendamentos',
    chavePrimaria: 'idAgendamento',
    camposObrigatorios: [
      'data',
      'assunto',
      'horaInicio',
      'horaFim',
      'idUsuario',
      'idTipoAgenda',
      'idStatusVisita'
    ],
    camposPermitidos: [
      'data',
      'assunto',
      'horaInicio',
      'horaFim',
      'idLocal',
      'idRecurso',
      'idFornecedor',
      'idContato',
      'idUsuario',
      'tipo',
      'idTipoAgenda',
      'idStatusVisita',
      'status'
    ]
  },
  {
    nome: 'tipoAgenda',
    rota: '/api/tiposAgenda',
    chavePrimaria: 'idTipoAgenda',
    camposObrigatorios: ['descricao', 'cor'],
    camposPermitidos: [
      'descricao',
      'cor',
      'obrigarFornecedor',
      'obrigarLocal',
      'obrigarRecurso',
      'ordem',
      'status'
    ]
  },
  {
    nome: 'statusVisita',
    rota: '/api/statusVisita',
    chavePrimaria: 'idStatusVisita',
    camposObrigatorios: ['descricao'],
    camposPermitidos: ['descricao', 'icone', 'ordem', 'status']
  },
  {
    nome: 'canalAtendimento',
    rota: '/api/canaisAtendimento',
    chavePrimaria: 'idCanalAtendimento',
    camposObrigatorios: ['descricao'],
    camposPermitidos: ['descricao', 'status']
  },
  {
    nome: 'origemAtendimento',
    rota: '/api/origensAtendimento',
    chavePrimaria: 'idOrigemAtendimento',
    camposObrigatorios: ['descricao'],
    camposPermitidos: ['descricao', 'status']
  },
  {
    nome: 'tipoAtendimento',
    rota: '/api/tiposAtendimento',
    chavePrimaria: 'idTipoAtendimento',
    camposObrigatorios: ['descricao'],
    camposPermitidos: ['descricao', 'status']
  },
  {
    nome: 'metodoPagamento',
    rota: '/api/metodosPagamento',
    chavePrimaria: 'idMetodoPagamento',
    camposObrigatorios: ['descricao'],
    camposPermitidos: ['descricao', 'status']
  },
  {
    nome: 'tipoOrdemCompra',
    rota: '/api/tiposOrdemCompra',
    chavePrimaria: 'idTipoOrdemCompra',
    camposObrigatorios: ['descricao'],
    camposPermitidos: ['descricao', 'status']
  },
  {
    nome: 'prazoPagamento',
    rota: '/api/prazosPagamento',
    chavePrimaria: 'idPrazoPagamento',
    camposObrigatorios: ['idMetodoPagamento'],
    camposPermitidos: [
      'descricao',
      'idMetodoPagamento',
      'prazo1',
      'prazo2',
      'prazo3',
      'prazo4',
      'prazo5',
      'prazo6',
      'status'
    ]
  },
  {
    nome: 'etapaOrdemCompra',
    rota: '/api/etapasOrdemCompra',
    chavePrimaria: 'idEtapa',
    camposObrigatorios: ['descricao', 'cor'],
    camposPermitidos: ['descricao', 'cor', 'ordem', 'status']
  },
  {
    nome: 'etapaCotacao',
    rota: '/api/etapasCotacao',
    chavePrimaria: 'idEtapaCotacao',
    camposObrigatorios: ['descricao', 'cor'],
    camposPermitidos: ['descricao', 'cor', 'ordem', 'consideraFunilCotacoes', 'status']
  },
  {
    nome: 'campoCotacaoConfiguravel',
    rota: '/api/camposCotacao',
    chavePrimaria: 'idCampoCotacao',
    camposObrigatorios: ['titulo'],
    camposPermitidos: ['titulo', 'descricao', 'descricaoPadrao', 'status']
  },
  {
    nome: 'campoOrdemCompraConfiguravel',
    rota: '/api/camposOrdemCompra',
    chavePrimaria: 'idCampoOrdemCompra',
    camposObrigatorios: ['titulo'],
    camposPermitidos: ['titulo', 'descricaoPadrao', 'status']
  },
  {
    nome: 'empresa',
    rota: '/api/empresas',
    chavePrimaria: 'idEmpresa',
    camposObrigatorios: ['razaoSocial', 'nomeFantasia', 'tipo', 'cnpj'],
    camposPermitidos: [
      'razaoSocial',
      'nomeFantasia',
      'slogan',
      'tipo',
      'cnpj',
      'inscricaoEstadual',
      'email',
      'telefone',
      'horaInicioManha',
      'horaFimManha',
      'horaInicioTarde',
      'horaFimTarde',
      'trabalhaSabado',
      'horaInicioSabado',
      'horaFimSabado',
      'exibirFunilPaginaInicial',
      'diasValidadeCotacao',
      'diasEntregaOrdemCompra',
      'codigoPrincipalFornecedor',
      'etapasFiltroPadraoCotacao',
      'colunasGridFornecedores',
      'colunasGridCotacoes',
      'colunasGridProdutos',
      'colunasGridOrdensCompra',
      'colunasGridAtendimentos',
      'graficosPaginaInicialCotacoes',
      'graficosPaginaInicialOrdensCompra',
      'graficosPaginaInicialAtendimentos',
      'cardsPaginaInicial',
      'corPrimariaCotacao',
      'corSecundariaCotacao',
      'corDestaqueCotacao',
      'destaqueItemCotacaoPdf',
      'assuntoEmailCotacao',
      'corpoEmailCotacao',
      'assinaturaEmailCotacao',
      'logradouro',
      'numero',
      'complemento',
      'bairro',
      'cidade',
      'estado',
      'cep',
      'imagem'
    ]
  },
  {
    nome: 'usuario',
    rota: '/api/usuarios',
    chavePrimaria: 'idUsuario',
    camposObrigatorios: ['nome', 'usuario', 'senha', 'tipo'],
    camposPermitidos: ['nome', 'usuario', 'senha', 'tipo', 'ativo', 'imagem', 'idComprador']
  },
  {
    nome: 'fornecedor',
    rota: '/api/fornecedores',
    chavePrimaria: 'idFornecedor',
    camposObrigatorios: [
      'idComprador',
      'idConceito',
      'idRamo',
      'razaoSocial',
      'nomeFantasia',
      'tipo',
      'cnpj'
    ],
    camposPermitidos: [
      'idFornecedor',
      'idComprador',
      'idConceito',
      'idGrupoEmpresa',
      'codigoAlternativo',
      'idRamo',
      'razaoSocial',
      'nomeFantasia',
      'tipo',
      'cnpj',
      'inscricaoEstadual',
      'status',
      'email',
      'telefone',
      'logradouro',
      'numero',
      'complemento',
      'bairro',
      'cidade',
      'estado',
      'cep',
      'observacao',
      'imagem'
    ]
  },
  {
    nome: 'contato',
    rota: '/api/contatos',
    chavePrimaria: 'idContato',
    camposObrigatorios: ['idFornecedor', 'nome'],
    camposPermitidos: [
      'idFornecedor',
      'nome',
      'cargo',
      'email',
      'telefone',
      'whatsapp',
      'status',
      'principal'
    ]
  },
  {
    nome: 'produto',
    rota: '/api/produtos',
    chavePrimaria: 'idProduto',
    camposObrigatorios: [
      'referencia',
      'descricao',
      'idGrupo',
      'idMarca',
      'idUnidade',
      'custo'
    ],
    camposPermitidos: [
      'idProduto',
      'referencia',
      'descricao',
      'idGrupo',
      'idMarca',
      'idUnidade',
      'custo',
      'imagem',
      'status'
    ]
  },
  {
    nome: 'produtoFornecedor',
    rota: '/api/produtosFornecedores',
    chavePrimaria: 'idProdutoFornecedor',
    camposObrigatorios: [
      'idProduto',
      'idFornecedor',
      'codigoFornecedor',
      'unidadeFornecedor'
    ],
    camposPermitidos: [
      'idProdutoFornecedor',
      'idProduto',
      'idFornecedor',
      'codigoFornecedor',
      'unidadeFornecedor'
    ]
  },
  {
    nome: 'atendimento',
    rota: '/api/atendimentos',
    chavePrimaria: 'idAtendimento',
    camposObrigatorios: [
      'idFornecedor',
      'idUsuario',
      'idTipoAtendimento',
      'assunto',
      'data',
      'horaInicio',
      'horaFim'
      ],
      camposPermitidos: [
        'idAgendamento',
        'idFornecedor',
        'idContato',
        'idUsuario',
        'assunto',
      'descricao',
      'data',
      'horaInicio',
      'horaFim',
      'idTipoAtendimento',
      'idCanalAtendimento',
      'idOrigemAtendimento'
    ]
  },
  {
    nome: 'cotacao',
    rota: '/api/cotacoes',
    chavePrimaria: 'idCotacao',
    camposObrigatorios: ['idFornecedor'],
    camposPermitidos: [
      'idFornecedor',
      'idContato',
      'idUsuario',
      'idOrdemCompraVinculado',
      'idComprador',
      'idPrazoPagamento',
      'idEtapaCotacao',
      'observacao'
    ]
  },
  {
    nome: 'itemCotacao',
    rota: '/api/itensCotacao',
    chavePrimaria: 'idItemCotacao',
    camposObrigatorios: ['idCotacao', 'idProduto', 'quantidade', 'valorUnitario', 'valorTotal'],
    camposPermitidos: [
      'idCotacao',
      'idProduto',
      'quantidade',
      'valorUnitario',
      'valorTotal',
      'imagem',
      'observacao',
      'referenciaProdutoSnapshot',
      'descricaoProdutoSnapshot',
      'unidadeProdutoSnapshot'
    ]
  },
  {
    nome: 'valorCampoCotacao',
    rota: '/api/valoresCamposCotacao',
    chavePrimaria: 'idValorCampoCotacao',
    camposObrigatorios: ['idCotacao', 'idCampoCotacao'],
    camposPermitidos: ['idCotacao', 'idCampoCotacao', 'valor']
  },
  {
    nome: 'ordemCompra',
    rota: '/api/ordensCompra',
    chavePrimaria: 'idOrdemCompra',
    camposObrigatorios: ['idFornecedor', 'idUsuario', 'idComprador'],
    camposPermitidos: [
      'idCotacao',
      'idFornecedor',
      'idContato',
      'idUsuario',
      'idComprador',
      'idPrazoPagamento',
      'idTipoOrdemCompra',
      'idEtapaOrdemCompra',
      'dataInclusao',
      'dataEntrega',
      'dataValidade',
      'observacao',
      'codigoCotacaoOrigem',
      'nomeFornecedorSnapshot',
      'nomeContatoSnapshot',
      'nomeUsuarioSnapshot',
      'nomeCompradorSnapshot',
      'nomeMetodoPagamentoSnapshot',
      'nomePrazoPagamentoSnapshot',
      'nomeTipoOrdemCompraSnapshot',
      'nomeEtapaOrdemCompraSnapshot'
    ]
  },
  {
    nome: 'itemOrdemCompra',
    rota: '/api/itensOrdemCompra',
    chavePrimaria: 'idItemOrdemCompra',
    camposObrigatorios: ['idOrdemCompra', 'quantidade', 'valorUnitario', 'valorTotal'],
    camposPermitidos: [
      'idOrdemCompra',
      'idProduto',
      'quantidade',
      'valorUnitario',
      'valorTotal',
      'imagem',
      'observacao',
      'referenciaProdutoSnapshot',
      'descricaoProdutoSnapshot',
      'unidadeProdutoSnapshot'
    ]
  },
  {
    nome: 'valorCampoOrdemCompra',
    rota: '/api/valoresCamposOrdemCompra',
    chavePrimaria: 'idValorCampoOrdemCompra',
    camposObrigatorios: ['idOrdemCompra'],
    camposPermitidos: ['idOrdemCompra', 'idCampoOrdemCompra', 'idCampoCotacao', 'tituloSnapshot', 'valor']
  }
];

module.exports = {
  entidades
};
