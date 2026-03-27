const entidades = [
  {
    nome: 'ramoAtividade',
    rota: '/api/ramosAtividade',
    chavePrimaria: 'idRamo',
    camposObrigatorios: ['descricao'],
    camposPermitidos: ['descricao', 'status']
  },
  {
    nome: 'vendedor',
    rota: '/api/vendedores',
    chavePrimaria: 'idVendedor',
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
    nome: 'cliente',
    rota: '/api/clientes',
    chavePrimaria: 'idCliente',
    camposObrigatorios: [
      'idVendedor',
      'idRamo',
      'razaoSocial',
      'nomeFantasia',
      'tipo',
      'cnpj'
    ],
    camposPermitidos: [
      'idVendedor',
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
    camposObrigatorios: ['idCliente', 'nome'],
    camposPermitidos: [
      'idCliente',
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
      'preco'
    ],
    camposPermitidos: [
      'referencia',
      'descricao',
      'idGrupo',
      'idMarca',
      'idUnidade',
      'preco',
      'imagem',
      'status'
    ]
  }
];

module.exports = {
  entidades
};
