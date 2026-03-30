# CRM Desktop

CRM desktop com `Electron`, `React + Vite`, `Express` e `SQLite`, com backend local, banco embarcado e interface em portugues.

O projeto ja possui autenticacao, controle de acesso por perfil, agenda semanal interativa, cadastros principais de clientes e produtos, tela de configuracoes com diversos cadastros auxiliares e estrutura pronta para expansao de modulos como `Atendimentos`, `Orcamentos` e `Pedidos`.

## Stack

- `Electron` para a aplicacao desktop
- `React 19 + Vite` para a interface
- `Express 5` para a API local
- `SQLite` para persistencia embarcada

## Estrutura principal

- `client/`: aplicacao React
- `client/src/componentes/`: componentes reutilizaveis da interface
- `client/src/paginas/`: paginas do sistema
- `client/src/servicos/`: comunicacao com a API
- `client/src/utilitarios/`: funcoes auxiliares e regras compartilhadas do frontend
- `client/src/recursos/`: estilos e recursos visuais
- `electron/`: processo principal e preload do desktop
- `server/app.js`: configuracao principal da API Express
- `server/index.js`: inicializacao do servidor
- `server/rotas/`: rotas customizadas e autenticacao
- `server/configuracoes/`: banco SQLite, entidades e infraestrutura compartilhada
- `server/scripts/`: scripts utilitarios, incluindo populacao do banco
- `data/crm.sqlite`: arquivo local do banco

## Convencoes do projeto

- O projeto deve usar portugues em textos, nomes internos e documentacao sempre que nao houver conflito com APIs externas
- Todo identificador definido pelo projeto deve usar `camelCase`
- Componentes, utilitarios, servicos e estilos devem ser reaproveitados ao maximo
- Todo botao deve sair do componente reutilizavel padrao do projeto
- Os estilos padrao de botao sao `primario`, `secundario`, `complementar` e `perigo`
- O projeto usa botoes com texto, icone + texto e somente icone, conforme o contexto
- Cabecalhos de paginas e modais de configuracao priorizam botoes somente com icone
- Grades principais devem usar estrutura semantica real de tabela
- Acoes de linha devem usar o componente central de acoes da interface
- Selos de codigo devem usar o componente padrao de codigo do projeto
- Funcoes reutilizaveis do frontend devem ficar em `client/src/utilitarios`
- Toda alteracao estrutural no banco deve ser acompanhada de ajuste nesta documentacao

## Componentes e padroes reutilizaveis

Padroes hoje centralizados no frontend:

- `Botao`: botoes primarios, secundarios, complementares, perigo e somente icone
- `GradePadrao`: grades principais com cabecalho fixo e rolagem na lista
- `AcoesRegistro`: acoes padrao de linha
- `CodigoRegistro`: selo visual de codigo
- `CampoImagemPadrao`: upload e preview de imagem
- `ModalFiltros`: modal generico de filtros
- `CampoSelecaoMultiplaModal`: selecao multipla com botao-resumo e modal com checkbox

Utilitarios importantes:

- `normalizarTelefone.js`: padroniza telefone no formato brasileiro
- `normalizarPreco.js`: trata exibicao e digitacao de preco em real
- `obterPrimeiroCodigoDisponivel.js`: encontra o primeiro codigo livre para novos registros

## Modulos ja implementados

### Login e sessao

- Tela de login com marca da empresa
- Validacao de `usuario` e `senha` via API local
- Sessao persistida no frontend
- Rodape da barra lateral com dados do usuario logado

### Perfis de acesso

Perfis disponiveis:

- `Administrador`
- `Gestor`
- `Usuario padrao`

Regras atualmente aplicadas no frontend:

- `Usuario padrao` nao pode alterar configuracoes
- `Usuario padrao` nao acessa `Empresa` nem `Usuarios` na tela de configuracoes
- `Usuario padrao` consulta produtos, sem incluir, editar, importar ou inativar
- `Usuario padrao` enxerga apenas clientes do vendedor vinculado a ele
- Ao incluir cliente, `Usuario padrao` ja recebe o vendedor fixado e bloqueado
- Na agenda, `Usuario padrao` nao pode excluir agendamentos

Observacao:

- As restricoes de permissao estao principalmente no frontend
- O backend ainda nao implementa uma camada completa de autorizacao por perfil

### Clientes

- Tela com grade, pesquisa e filtro
- Modal em abas para incluir, editar e consultar
- Abas atuais: `Dados gerais`, `Endereco`, `Observacoes`, `Contato`, `Atendimento` e `Vendas`
- Thumbnail com codigo do cliente
- Integracao publica para consulta de `CEP`
- Integracao publica para consulta de `CNPJ`
- Aba de contatos com grade propria e modal dedicado para incluir e editar contato
- Inativacao persiste no banco

Filtros de clientes:

- `Estado`
- `Cidade`
- `Ramo de atividade`
- `Vendedor`
- `Tipo`
- `Ativo`

### Produtos

- Tela com grade, pesquisa e filtro
- Modal no mesmo padrao de clientes
- Modo incluir, editar e consultar
- Codigo automatico ao incluir
- Upload de imagem no padrao reutilizavel do projeto
- Campo de preco com mascara e digitacao amigavel em real
- Inativacao persiste no banco

Filtros de produtos:

- `Grupo`
- `Marca`
- `Unidade`
- `Ativo`

### Agenda

- Agenda semanal de segunda a sexta
- Grade de `15 em 15 minutos`
- Expansao automatica da faixa horaria quando houver agendamento fora do expediente padrao
- Horario padrao baseado na configuracao de expediente da empresa
- Intervalo sem expediente com destaque visual leve
- Selecao de faixa por arraste
- Duplo clique na grade para incluir em um horario especifico
- Botao de incluir que usa a faixa selecionada
- Clique simples no card seleciona
- Duplo clique no card abre edicao
- Tooltip no hover com detalhes completos
- Cards coloridos conforme o tipo de agenda
- Suporte visual a conflitos de horario, dividindo o espaco em vez de sobrepor
- Copiar e colar agendamento com `Ctrl+C` e `Ctrl+V`

Comportamento de copia na agenda:

- Seleciona um card com um clique
- `Ctrl+C` copia o agendamento selecionado
- `Ctrl+V` cola na celula ou faixa de horario selecionada
- Se o destino for uma faixa, a copia usa aquela faixa
- Se o destino for apenas um horario, mantem a duracao original do agendamento copiado

Campos atuais do agendamento:

- `Assunto`
- `Dia`
- `Tipo`
- `Local`
- `Horario de inicio`
- `Horario de fim`
- `Cliente`
- `Contato do cliente`
- `Recursos` com selecao multipla
- `Usuarios` com selecao multipla
- `Status da visita`

Regras atuais do agendamento:

- `Status` e `Usuario` sao obrigatorios
- `Contato do cliente` e obrigatorio quando houver cliente
- `Cliente`, `Local` e `Recurso` podem se tornar obrigatorios conforme o `Tipo de agenda`
- Um agendamento pode ter varios recursos e varios usuarios vinculados

Filtros da agenda:

- `Usuario` com selecao multipla
- `Vendedor`
- `Cliente`
- `Local`
- `Recurso` com selecao multipla
- `Status`

Regra dos filtros multiplos:

- Se selecionar um item, a agenda traz todas as ocorrencias em que ele participa
- Se selecionar varios usuarios ou varios recursos, a agenda traz apenas os agendamentos em que todos os selecionados aparecem juntos

### Configuracoes

A tela de configuracoes usa cards grandes e modais padrao. Hoje ela cobre:

- `Empresa`
- `Usuarios`
- `Ramos de atividade`
- `Vendedores`
- `Grupos de produto`
- `Marcas`
- `Unidades`
- `Forma de pagamento` foi substituido por `Prazos de pagamento`
- `Metodos de pagamento`
- `Prazos de pagamento`
- `Motivo da perda`
- `Etapas do pedido`
- `Etapas do orcamento`
- `Locais da agenda`
- `Tipos de recurso`
- `Recursos`
- `Tipos de agenda`
- `Status da visita`

Observacao:

- Alguns titulos antigos podem ter sido substituidos visualmente para refletir melhor o processo comercial

### Empresa

O cadastro de empresa tem modal proprio com abas:

- `Dados gerais`
- `Endereco`
- `Agenda`

Campos de destaque:

- `Razao social`
- `Nome fantasia`
- `Slogan`
- `Documento`
- `Imagem`
- Endereco completo
- Horarios de expediente da manha e da tarde
- Flag para trabalho aos sabados
- Horarios de sabado quando aplicavel

Esses dados sao usados em:

- Tela de login
- Barra lateral
- Faixa horaria padrao da agenda

### Usuarios

Usuarios possuem:

- foto
- nome
- usuario
- senha
- tipo
- ativo
- vendedor vinculado

Regra importante:

- `Usuario padrao` deve obrigatoriamente estar vinculado a um vendedor

## Banco de dados

### Regras gerais

- Banco utilizado: `SQLite`
- Arquivo local: `data/crm.sqlite`
- Chaves primarias usam inteiros autoincrementais
- Campos booleanos usam `0` e `1`
- O projeto faz migracoes simples no startup com `ALTER TABLE` e recriacao de tabelas quando necessario

### Tabelas principais do sistema

Cadastros comerciais:

- `ramoAtividade`
- `vendedor`
- `grupoProduto`
- `marca`
- `unidadeMedida`
- `cliente`
- `contato`
- `produto`

Cadastros da empresa e acesso:

- `empresa`
- `usuario`

Cadastros de configuracao comercial:

- `metodoPagamento`
- `prazoPagamento`
- `motivoPerda`
- `etapaPedido`
- `etapaOrcamento`

Cadastros da agenda:

- `localAgenda`
- `tipoRecurso`
- `recurso`
- `tipoAgenda`
- `statusVisita`
- `agendamento`
- `agendamentoRecurso`
- `agendamentoUsuario`

### Campos de destaque por tabela

#### `empresa`

- dados gerais de empresa
- `slogan`
- `imagem`
- endereco
- expediente da manha e da tarde
- configuracao de sabado

#### `usuario`

- `nome`
- `usuario`
- `senha`
- `tipo`
- `ativo`
- `imagem`
- `idVendedor`

#### `cliente`

- vendedor, ramo, documento, endereco, observacao e imagem
- `tipo` pode ser `Fisico` ou `Juridico`

#### `contato`

- nome, cargo, email, telefone, whatsapp, ativo e principal

#### `produto`

- referencia, descricao, grupo, marca, unidade, preco, imagem e ativo

#### `prazoPagamento`

- metodo
- `prazo1` ate `prazo6`
- descricao montada a partir do metodo e dos dias

#### `tipoAgenda`

- `descricao`
- `cor`
- `obrigarCliente`
- `obrigarLocal`
- `obrigarRecurso`
- `status`

#### `statusVisita`

- `descricao`
- `icone` com emoji
- `status`

#### `agendamento`

- `data`
- `assunto`
- `horaInicio`
- `horaFim`
- `idLocal`
- `idCliente`
- `idContato`
- `idUsuario` legado e principal
- `idTipoAgenda`
- `idStatusVisita`
- `tipo`
- `status`

Relacionamentos extras do agendamento:

- `agendamentoRecurso`: varios recursos por agendamento
- `agendamentoUsuario`: varios usuarios por agendamento

## API

### CRUD generico

As tabelas registradas em `server/configuracoes/entidades.js` recebem automaticamente:

| Operacao | Metodo | Padrao da rota |
| --- | --- | --- |
| Listar todos | `GET` | `/api/recurso` |
| Consultar um | `GET` | `/api/recurso/:id` |
| Incluir novo | `POST` | `/api/recurso` |
| Atualizar | `PUT` | `/api/recurso/:id` |
| Excluir | `DELETE` | `/api/recurso/:id` |

Rotas cadastradas atualmente:

- `/api/ramosAtividade`
- `/api/vendedores`
- `/api/gruposProduto`
- `/api/marcas`
- `/api/unidadesMedida`
- `/api/locaisAgenda`
- `/api/tiposRecurso`
- `/api/recursos`
- `/api/tiposAgenda`
- `/api/statusVisita`
- `/api/metodosPagamento`
- `/api/prazosPagamento`
- `/api/motivosPerda`
- `/api/etapasPedido`
- `/api/etapasOrcamento`
- `/api/empresas`
- `/api/usuarios`
- `/api/clientes`
- `/api/contatos`
- `/api/produtos`

### Rotas customizadas

- `POST /api/login`: autenticacao
- `/api/agendamentos`: CRUD customizado para agendamento, com suporte a multiplos recursos e multiplos usuarios

## Integracoes externas

Hoje o frontend usa APIs publicas para:

- `CEP`: `ViaCEP`
- `CNPJ`: `BrasilAPI`

Essas integracoes sao usadas no cadastro de clientes para preencher dados automaticamente.

## Seeds e dados de teste

O script `npm run popular:banco` recria dados de teste e hoje gera principalmente:

- cadastros base comerciais
- etapas padrao de orcamento em formato de funil
- clientes e contatos de exemplo
- produtos de exemplo

Os dados de teste usam:

- links publicos para imagens
- cidades reais do Brasil
- dados coerentes para validacao visual da interface

## Como rodar

1. Instale as dependencias com `npm install`
2. Use os scripts conforme o fluxo desejado

### Desenvolvimento

- `npm run dev`: sobe backend, frontend web e Electron juntos
- `npm run dev:webapp`: sobe backend e frontend web juntos
- `npm run dev:backend`: sobe somente o backend Express com `nodemon`
- `npm run dev:web`: sobe somente o frontend web com Vite
- `npm run dev:electron`: abre somente o Electron, aguardando backend e frontend

### Inicializacao manual

- `npm run start:backend`: inicia o backend sem `nodemon`
- `npm run start:web`: inicia o frontend web
- `npm run start:electron`: abre o app no Electron

### Build

- `npm run build`: gera a build web
- `npm run build:web`: gera a build web em `dist/web`
- `npm run build:electron`: gera a build web e empacota o Electron em `dist/electron`

### Popular banco

- `npm run popular:banco`: limpa e popula o banco com dados de teste

## Paleta visual atual

Variaveis CSS principais:

| Papel | Variavel | Hex |
| Azul principal | `--corPrimaria` | `#1791E2` |
| Azul forte | `--corPrimariaForte` | `#0D78C8` |
| Azul suave | `--corPrimariaSuave` | `#5BBDF5` |
| Fundo | `--corFundo` | `#EEF4F9` |
| Superficie | `--corSuperficie` | `#FFFFFF` |
| Superficie suave | `--corSuperficieSuave` | `#DFE9F1` |
| Borda | `--corBorda` | `#C8D5DF` |
| Texto | `--corTexto` | `#3C4A57` |
| Texto suave | `--corTextoSuave` | `#7A8894` |

## Estado atual da navegacao

Paginas hoje presentes no painel:

- `Pagina inicial`
- `Agenda`
- `Atendimentos`
- `Clientes`
- `Produtos`
- `Orcamentos`
- `Pedidos`
- `Configuracoes`

Algumas dessas paginas ainda estao em estrutura base, prontas para evolucao futura.
