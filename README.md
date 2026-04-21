
# Connecta SRM


Connecta SRM — Central de Fornecedores e Cotações, desenvolvido com `Electron`, `React + Vite`, `Express` e `SQLite`. Backend local, banco embarcado, interface em português e distribuição via `GitHub Releases`.

Hoje o projeto ja atende um cenario real de desktop comercial, com login, controle por perfil, agenda semanal, pagina inicial com indicadores, cadastros principais, modulo de atendimentos, cotacoes, ordens de compra, configuracoes auxiliares e atualizacao automatica do aplicativo.

## Stack

- `Electron` para a aplicacao desktop
- `React 19 + Vite` para a interface
- `Express 5` para a API local
- `SQLite` para persistencia embarcada
- `electron-builder` para empacotamento e publicacao
- `electron-updater` para auto-update via GitHub Releases


## Identidade atual

- Nome do aplicativo: `Connecta SRM`
- Nome técnico do pacote: `connecta-srm`
- Instalador Windows: `Connecta-SRM-Setup-x.y.z.exe`
- Repositório de releases e update: `TailonSilva/connecta-srm`
- `appId` atual: `com.srm.desktop`

## Migração CRM para SRM

- O conceito de negócio exibido ao usuário passa a ser `Fornecedor`/`Fornecedores`
- A primeira etapa da migração altera textos de interface, manuais, relatórios, PDFs e documentação funcional
- O backend passa a usar `fornecedor` como contrato técnico principal, incluindo tabela `fornecedor`, tabela `conceitoFornecedor`, campos como `idFornecedor`, `nomeFornecedorSnapshot`, `codigoPrincipalFornecedor`, `colunasGridFornecedores`, rotas `/api/fornecedores`, `/api/conceitosFornecedor`, `/api/listagens/fornecedores` e importação `/api/importacao/fornecedores`
- O startup do banco migra automaticamente nomes legados como `cliente`, `conceitoCliente`, `idCliente`, `nomeClienteSnapshot`, `codigoPrincipalCliente`, `colunasGridClientes` e `obrigarCliente` para a nomenclatura de fornecedor
- Por compatibilidade temporária, o backend ainda aceita aliases antigos em payloads e query strings, além de manter rotas legadas `/api/clientes`, `/api/conceitosCliente`, `/api/listagens/clientes` e `/api/importacao/clientes`
- O frontend ja migrou os nomes dos JSX principais de fornecedores, incluindo `paginaFornecedores.jsx`, `fornecedores-modalFornecedor.jsx`, `fornecedores-listaFornecedores.jsx`, `fornecedores-corpoFornecedores.jsx`, `fornecedores-cabecalhoFornecedores.jsx` e `fornecedores-modalManualFornecedores.jsx`
- O CSS raiz da pagina tambem acompanha o dominio atual em `paginaFornecedores.css`
- Nomes internos legados como `ModalBuscaClientes`, `codigoCliente.js`, props `clientes`, campos `idCliente` e alguns helpers com sufixo `Cliente` seguem por compatibilidade tecnica e devem aceitar alias de fornecedor quando usados em modais compartilhados
- O conceito de negócio `Orcamento` passa a ser exibido ao usuário como `Cotacao`
- O backend passa a usar `cotacao` como contrato técnico principal, incluindo tabelas `cotacao`, `itemCotacao`, `valorCampoCotacao`, `etapaCotacao`, `campoCotacaoConfiguravel`, campos como `idCotacao`, `idEtapaCotacao`, `idCampoCotacao`, `codigoCotacaoOrigem`, rotas `/api/cotacoes`, `/api/etapasCotacao`, `/api/camposCotacao`, `/api/itensCotacao` e `/api/valoresCamposCotacao`
- O startup do banco migra automaticamente nomes legados como `orcamento`, `itemOrcamento`, `valorCampoOrcamento`, `etapaOrcamento`, `campoOrcamentoConfiguravel`, `idOrcamento`, `idEtapaOrcamento`, `idCampoOrcamento`, `codigoOrcamentoOrigem`, `diasValidadeOrcamento`, `colunasGridOrcamentos` e campos de layout/e-mail para a nomenclatura de cotação
- Por compatibilidade temporária, o backend ainda aceita aliases antigos e mantém rotas legadas `/api/orcamentos`, `/api/etapasOrcamento`, `/api/camposOrcamento`, `/api/itensOrcamento` e `/api/valoresCamposOrcamento`
- O frontend ja migrou os nomes dos JSX principais de cotacao e ordem de compra, como `paginaCotacoes.jsx`, `cotacoes-modalCotacao.jsx`, `paginaOrdensCompra.jsx`, `ordensCompra-modalOrdemCompra.jsx` e `documentoCotacaoPdf.jsx`; nomes internos legados como `idOrcamento`, `idPedido`, `tipoPedido`, `etapaPedido` e alguns servicos/utilitarios antigos seguem por compatibilidade e devem ser migrados em etapas proprias
- Na interface, o usuario deve ver `Cotacao` no lugar de `Orcamento` e `Ordem de compra` no lugar de `Pedido` ou `Venda`
- Os conceitos de `Devolucao`, `Motivo da perda` e `Comissao` foram removidos do escopo funcional atual; devem ser citados apenas como legado removido e nao devem voltar para telas, modais, relatorios, cards ou seeds
- Modais operacionais renomeados para fornecedores, cotacoes e ordens de compra devem manter as classes estruturais base (`modalCliente`, `cabecalhoModalCliente`, `abasModalCliente`, `abaModalCliente`, `corpoModalCliente`) enquanto o CSS base legado ainda for compartilhado
- Modais que recebem lista de fornecedores devem aceitar temporariamente tanto `fornecedores` quanto `clientes` para evitar quebra nos fluxos compartilhados de busca, atendimento, agenda, cotacao, ordem de compra, produto e relatorios

## Estrutura principal

- `client/`: aplicacao React
- `client/src/componentes/`: componentes reutilizaveis da interface
- `client/src/componentes/modulos/`: componentes ligados a dominios especificos do sistema, nomeados com prefixo explicito do modulo
- `client/src/dados/`: catalogos e definicoes estaticas do frontend mantidos em `.js`, sem misturar com regras utilitarias
- `client/src/idex.html`: pagina estatica de ordens de compra em arquivo unico para apresentacao comercial da ferramenta
- `client/src/paginas/`: apenas os componentes-raiz que renderizam cada pagina do sistema
- `client/src/servicos/`: comunicacao com a API
- `client/src/hooks/`: hooks reutilizaveis para regras globais e comportamentos compartilhados do frontend
- `client/src/utilitarios/`: funcoes auxiliares e regras compartilhadas do frontend
- `client/src/recursos/`: estilos e recursos visuais
- `electron/`: processo principal e preload do desktop
- `docs/`: documentacao tecnica complementar do projeto
- `server/app.js`: configuracao principal da API Express
- `server/index.js`: inicializacao do servidor
- `server/rotas/`: rotas customizadas e autenticacao
- `server/configuracoes/`: banco SQLite, entidades e infraestrutura compartilhada
- `server/scripts/`: scripts utilitarios, incluindo populacao do banco

## Convencoes do projeto

- O projeto usa portugues em textos, nomes internos e documentacao sempre que nao houver conflito com APIs externas
- Todo identificador definido pelo projeto deve usar `camelCase`
- Componentes, utilitarios, servicos e estilos devem ser reaproveitados ao maximo
- O projeto deve priorizar arquitetura modular: novas telas, fluxos e comportamentos devem nascer em partes pequenas, separadas e reutilizaveis sempre que possivel
- Antes de adicionar logica nova dentro de pagina, modal grande ou componente-raiz, deve-se avaliar se essa responsabilidade pertence melhor a um `componente`, `hook`, `utilitario` ou arquivo de `dados`
- Paginas devem orquestrar o modulo e compor blocos reutilizaveis, evitando concentrar renderizacao, regras de negocio, atalhos, efeitos e formatacoes no mesmo arquivo
- Pastas dentro de `client/src/paginas/` nao devem mais criar subestruturas locais chamadas `componentes`, `utilitarios`, `hooks` ou `dados`
- A partir de agora, tudo que for `componente` deve viver em `client/src/componentes/`, tudo que for `hook` em `client/src/hooks/`, tudo que for `utilitario` em `client/src/utilitarios/` e tudo que for `dado` em `client/src/dados/`
- A pasta `client/src/paginas/` deve conter apenas os componentes-raiz `paginaX.jsx`; modais, listas, cabecalhos, secoes, cards e demais blocos de tela deixam de morar em subpastas de pagina
- Componentes ligados a um dominio especifico, mas que nao sao pagina-raiz nem componente comum, devem ficar em `client/src/componentes/modulos/`
- Componentes de `modulos` devem usar prefixo explicito do dominio no nome do arquivo, como `fornecedores-modalFornecedor.jsx`, `cotacoes-modalCotacao.jsx`, `ordensCompra-modalOrdemCompra.jsx` e `inicio-secaoRankingInicio.jsx`
- Quando um arquivo nascer por causa de uma pagina especifica, ele ainda deve ficar na pasta global da sua categoria, preferencialmente seguindo o prefixo do dominio para manter rastreabilidade sem voltar a criar ilhas locais dentro de `paginas`
- Estruturas antigas desse tipo dentro de paginas passam a ser consideradas legado e devem ser migradas aos poucos sempre que o modulo receber manutencao relevante
- Componentes devem focar em interface e composicao visual, evitando acumular regra transversal quando ela puder ser reutilizada em outra camada
- Hooks devem concentrar comportamentos com ciclo de vida React, estado, efeitos colaterais, listeners e sincronizacao com DOM ou eventos globais
- Utilitarios devem concentrar funcoes puras, normalizacao, formatacao, calculos e regras sem dependencia direta de renderizacao React
- Arquivos de `dados` devem concentrar catalogos e definicoes estaticas do frontend, separados das funcoes que processam esses dados
- Sempre que uma regra ou estrutura puder ser reaproveitada em mais de um ponto do sistema, a implementacao compartilhada deve ser preferida em vez de duplicacao local
- Toda nova funcao, hook, componente, utilitario ou estrutura relevante criada no projeto deve ser documentada no proprio codigo de forma detalhada
- A documentacao inline no codigo deve explicar com clareza o que aquele trecho faz, por que ele existe e por que foi implementado daquela forma
- Sempre que fizer sentido, os comentarios tambem devem deixar explicito de onde vem a dependencia consumida, qual parte do fluxo usa aquele trecho e qual o impacto dele no comportamento da aplicacao
- Comentarios internos devem ser escritos de forma estavel para manutencao, sem depender de numero de linha ou referencias frageis que possam quebrar quando o arquivo crescer
- O padrao preferencial de comentario inline do projeto e usar comentarios curtos, objetivos e com uma ideia por linha, posicionados imediatamente acima do trecho que esta sendo explicado
- Todo botao deve sair do componente reutilizavel padrao do projeto
- Os estilos padrao de botao sao `primario`, `secundario`, `complementar` e `perigo`
- A aba `Empresa` tambem concentra parametros de comunicacao, incluindo a nova aba `E-mail` para templates comerciais configuraveis de cotacao com tags de fornecedor, itens, observacao e campos personalizados
- Grades principais usam estrutura semantica real de tabela
- Acoes de linha usam o componente central de acoes da interface
- Selos de codigo usam o componente padrao de codigo do projeto
- Funcoes reutilizaveis do frontend ficam em `client/src/utilitarios`
- Arquivos orientados a dados fixos do frontend, como listas base de paginas, cards, graficos e definicoes estruturais de grade, devem ficar em `client/src/dados`
- Regras globais de UX, atalhos, foco e helpers transversais da aplicacao devem ser extraidos de componentes-raiz quando fizer sentido e concentrados em `client/src/utilitarios`
- Quando um comportamento global depender de ciclo de vida React, listeners ou efeitos colaterais, a logica deve preferencialmente viver em `client/src/hooks/` e nao permanecer inchando componentes-raiz como `App.jsx`
- O `App.jsx` deve permanecer enxuto e focado em composicao da casca da aplicacao; sessoes, atalhos globais, foco automatico, polling de avisos e outras responsabilidades transversais devem ser extraidos para `hooks`, `utilitarios` ou componentes-container
- Servicos auxiliares de listagem usados por campos de busca e selecao retornam apenas registros ativos por padrao; listas principais de entidades continuam completas e modais de busca reutilizaveis filtram inativos automaticamente
- Campos de formulario com botoes laterais de busca, consulta ou cadastro devem usar os contêineres compartilhados de acao do formulario para manter o botao ao lado do input/select sem quebrar a grade
- Selects de contato devem exibir o rotulo no formato `Nome - Cargo` sempre que o cargo estiver preenchido
- Sempre que houver mudanca estrutural relevante de banco, fluxo desktop ou release, o README deve ser atualizado
- Sempre que houver alteracao relevante de arquitetura frontend, padroes reutilizaveis ou convencoes de implementacao, o README tambem deve ser atualizado no mesmo trabalho
- Grades de dados do aplicativo devem nascer do componente-base reutilizavel `GradePadrao`; excecoes ficam restritas a documentos de exportacao e PDF
- Quando um modulo precisar priorizar composicao visual flexivel em vez de tabela semantica fixa, o `GradePadrao` pode operar em modo de layout com `display: grid`, mantendo carregamento, estados e rolagem reutilizaveis
- Grades de dados devem priorizar leitura sem rolagem horizontal: colunas curtas como codigo, valores e acoes permanecem mais contidas, enquanto colunas textuais podem expandir, quebrar linha ou aplicar truncamento visual conforme o contexto
- Grades de dados nao devem empilhar duas informacoes diferentes na mesma celula; quando o registro exigir mais de um dado relevante, cada informacao deve ganhar sua propria coluna
- Sempre que o conteudo textual de uma celula ultrapassar duas linhas, a grade deve truncar visualmente com reticencias para preservar altura previsivel e leitura da listagem
- Quando uma grade tiver muitas colunas ou textos longos, a distribuicao horizontal deve usar presets de largura por contexto dentro do `GradePadrao`, em vez de voltar para tabelas isoladas ou CSS solto por pagina
- Quando a empresa puder escolher colunas visiveis de uma grade, essa configuracao deve ficar persistida no cadastro da `Empresa`, refletir todas as colunas persistidas daquele modulo e usar renderizacao dinamica de cabecalho, linhas e `colgroup`
- Grades configuraveis tambem devem permitir personalizar o `rotulo` exibido no cabecalho de cada coluna, mantendo `Acoes`, `Codigo` e `Status` com espacos fixos quando essa regra existir no modulo
- Grades principais com pesquisa e filtros devem priorizar filtro no backend: a interface envia os parametros atuais da tela para a API e a listagem retorna somente o recorte solicitado
- Quando a pagina precisar dados auxiliares para modais e selects, esse contexto deve ser carregado separado da grade principal, para evitar recarregar listas inteiras a cada digitacao ou troca de filtro
- Cada componente novo deve ter seu proprio arquivo de estilo com o mesmo nome do componente salvo em `client/src/recursos/estilos/`
- CSS de pagina deve ficar restrito a layout/composicao da pagina e tambem salvo em `client/src/recursos/estilos/`
- Classes CSS devem ser prefixadas pelo nome do componente para reduzir acoplamento visual e colisao de seletores
- Mesmo componentes de pagina devem seguir a mesma regra: `paginaInicio.jsx` usa `client/src/recursos/estilos/paginaInicio.css`, `funilVendas.jsx` usa `client/src/recursos/estilos/funilVendas.css`, e assim por diante
- Para `Usuario padrao`, cards e graficos de `cotacoes` e `ordens de compra` da pagina inicial devem sempre filtrar por `idComprador` do usuario logado
- Para `Usuario padrao`, cards e graficos de `atendimentos` da pagina inicial devem sempre filtrar apenas pelos atendimentos cujo `idUsuario` seja o do usuario logado
- `Administrador` e `Gestor` veem leitura geral sem esses recortes individuais

## Arquitetura atual das grades

- Grades principais de `Fornecedores`, `Produtos`, `Atendimentos`, `Cotacoes` e `Ordens de Compra` nao devem mais carregar a tabela inteira para filtrar no frontend
- O fluxo esperado agora e: carregar contexto da pagina em uma etapa separada, enviar `pesquisa + filtros atuais` para a API e renderizar apenas o recorte devolvido pelo backend
- Dados auxiliares para filtros, selects, modais de busca e enriquecimento visual continuam vindo das tabelas auxiliares corretas, em requisicoes separadas da grade principal
- O frontend deve usar `client/src/utilitarios/montarParametrosConsulta.js` para montar query string e manter um formato consistente entre modulos
- Listagens enxutas de grade ficam concentradas em rotas dedicadas de `server/rotas/listagens.js` quando o modulo usar CRUD simples; fluxos customizados como `Cotacoes` e `Ordens de Compra` continuam filtrando dentro das proprias rotas
- A camada SQL compartilhada de filtros fica em `server/utilitarios/filtrosSql.js` e deve ser o ponto central de normalizacao de valores, listas e filtros numericos
- O frontend nao deve depender de carregar todos os registros para preencher filtros de selecao; esses filtros devem buscar diretamente suas tabelas auxiliares, como `ramosAtividade`, `gruposEmpresa`, `gruposProduto`, `marcas`, `unidadesMedida`, `compradores`, `etapas` e similares
- Quando a tela precisar contexto e grade ao mesmo tempo, falhas no contexto nao devem derrubar automaticamente a carga da grade; essas duas responsabilidades devem permanecer separadas
- Em erros de grade, a interface deve priorizar expor a mensagem real retornada pela API ou pelo navegador durante desenvolvimento para reduzir diagnostico por tentativa e erro

## Componentes e padroes reutilizaveis

Padroes centralizados no frontend:

- `Botao`: botoes primarios, secundarios, complementares, perigo e somente icone
- `GradePadrao`: componente-base unico para grades de dados da interface, com cabecalho fixo, rolagem vertical na lista, estados de carregamento/erro/vazio, `colgroup` opcional, distribuicao mais flexivel das colunas, suporte a presets de largura por contexto e classes de compatibilidade para preservar variacoes visuais existentes
- `AcoesRegistro`: acoes padrao de linha
- `CodigoRegistro`: selo visual de codigo
- `CampoImagemPadrao`: upload, preview e recorte de imagem com resolucao de saida configuravel por contexto e area de corte destacada no modal com moldura pontilhada e cantos arredondados
- `ModalItemProduto`: modal compartilhado de item para ordem de compra e cotacao
- `ModalFiltros`: modal generico de filtros, com suporte a um botao unico de datas que abre um modal interno com todos os periodos da tela
- `CampoSelecaoMultiplaModal`: selecao multipla com botao-resumo e modal com checkbox
- `ModalBuscaTabela`: base reutilizavel para modais de busca em grade
- `ModalBuscaClientes`: busca reutilizavel de fornecedores, mantendo nome tecnico legado
- `ModalBuscaContatos`: busca reutilizavel de contatos, com inclusao rapida quando o formulario ja tiver fornecedor definido
- `ModalBuscaProdutos`: busca reutilizavel de produtos
- `ModalHistoricoGrade`: base reutilizavel para modais amplos de historico em grade, com cabecalho, abas opcionais e acao de filtro
- `ModalRelatorioGrade`: base reutilizavel para modais amplos de relatorio, com cards de resumo no topo e filtro no cabecalho
- `ModalImportacaoCadastro`: modal reutilizavel para importacao por planilha, com download de modelo e tabela de linhas rejeitadas
- `ModalContatoCliente`: formulario reutilizavel de contato, mantendo nome tecnico legado
- `ModalRamosAtividade`: lista e cadastro reutilizavel de ramos
- `ModalGruposProduto`: lista e cadastro de grupos de produto com botao dedicado para abrir um submodal compacto de selecao de tamanhos e ordem por grupo
- `ModalMarcas`: lista e cadastro reutilizavel de marcas
- `ModalUnidadesMedida`: lista e cadastro reutilizavel de unidades
- `TabelaHistoricoOrdens de Compra`: grade reutilizavel de ordens de compra para historicos e relatorios, com coluna de acoes opcional
- `DocumentoCotacaoPdf`: layout isolado usado para exportacao da cotacao em PDF

Padroes aplicados recentemente:

- Busca de fornecedores foi unificada para atendimento e cotacao
- Busca de contatos foi unificada para atendimento, cotacao e ordem de compra
- A agenda tambem passou a usar os mesmos modais reutilizaveis de busca de `Fornecedor` e `Contato`
- O `App.jsx` foi reestruturado para atuar principalmente como casca de composicao, delegando sessao para `hooks`, avisos globais para um componente-container e atalhos/foco para hooks dedicados
- Hooks de comportamento global passaram a ficar em `client/src/hooks/`, incluindo sincronizacao de sessao, avisos de agendamento, foco automatico de modais e atalhos globais
- Catalogos estaticos do frontend como paginas do painel, cards da home, graficos da home e definicoes-base de colunas de grade passaram a ficar em `client/src/dados/`
- Todo modal aberto tenta focar automaticamente o primeiro campo editavel
- Modais de confirmacao focam por padrao a acao principal de confirmacao, mantendo `Sim` ou `Confirmar` prontos para teclado
- Quando um modal de busca de `Fornecedor` ou `Contato` devolve um registro ao formulario principal, o foco retorna para o campo que acabou de ser preenchido
- O atalho global `PageDown` aciona a acao principal de edicao do contexto atual: prioriza `Salvar` no modal ativo; quando nao houver salvamento disponivel, dispara `Adicionar`, `Incluir` ou `Novo` no modal ou na pagina operacional
- O atalho global `F8` abre a busca contextual do campo focado em modais operacionais; hoje ele funciona nos campos de `Fornecedor`, `Contato` e `Produto`, reaproveitando o mesmo botao lateral de pesquisa do formulario
- O modal de `Cotacoes` agora tambem oferece o botao `Gerar e-mail`, que abre o Outlook Web com destinatario, assunto e corpo preenchidos a partir do template configurado na aba `E-mail` da empresa, incluindo tags opcionais de observacao e campos personalizados
- Em modais com abas, `Alt + Seta para a esquerda` navega para a aba anterior e `Alt + Seta para a direita` navega para a proxima aba visivel; ao trocar de aba, o foco vai para o primeiro campo da nova secao
- Quando a busca de contatos for aberta com um fornecedor ja definido, o proprio modal permite incluir um novo contato e devolve esse contato ja selecionado no formulario atual
- O cadastro de fornecedor reaproveita o mesmo fluxo de `Ramo de Atividade` usado em configuracoes
- O cadastro de fornecedor agora tambem usa a tabela auxiliar `Conceitos de fornecedor`, mantida em `Configuracoes`, com valor padrao obrigatorio `Sem Conceito`
- A aba `Ordens de compra` da pagina inicial agora pode exibir a sessao `Ordens de compra do mes por conceito de fornecedor`, seguindo o mesmo padrao de top 5 na home e modal com a lista completa
- No modal de fornecedor, as abas `Atendimento` e `Ordens de compra` possuem grade propria com botao de filtro; os filtros de data abrem por padrao no mes corrente e o ultimo filtro aplicado fica salvo entre aberturas do modal, independentemente do fornecedor aberto
- O cadastro de produto reaproveita os mesmos fluxos de configuracao para `Grupo de Produto`, `Marca` e `Unidade`
- Modais com abas usam cabecalho e faixa de abas fixos, com rolagem apenas no corpo
- Modais empilhados possuem camadas de z-index separadas para evitar abertura por tras do modal pai
- O relatorio de Conversao exibe cards de cotacoes geradas, fechadas, conversao, recusadas e em aberto; recusadas usam a etapa obrigatoria `Recusado`, enquanto `Ordem de Compra Excluida` fica separada como etapa tecnica obrigatoria para cotacoes cuja ordem de compra vinculada foi removida

Utilitarios importantes:

- `normalizarTelefone.js`: padroniza telefone no formato brasileiro
- `normalizarPreco.js`: trata exibicao e digitacao de preco em real
- `obterPrimeiroCodigoDisponivel.js`: encontra o primeiro codigo livre para novos registros
- `codigoCliente.js`: centraliza a escolha e a formatacao do codigo principal do fornecedor com base na configuracao da empresa

## Modulos implementados

### Login e sessao
- Tela de login com a marca `Connecta SRM`
- Logo personalizada na tela inicial
- Validacao de `usuario` e `senha` via API local
- Sessao mantida apenas durante a janela atual do app; ao fechar e abrir novamente, o usuario precisa autenticar de novo
- Filtros das paginas principais ficam persistidos por usuario no `localStorage` do app Electron e reabrem com o ultimo estado aplicado

### Pagina inicial

- A pagina inicial usa abas `Cotacoes`, `Ordens de compra` e `Atendimentos` para separar funil, analise comercial e relacionamento
- A configuracao da empresa agora possui a aba `Pagina inicial`, com botoes `Graficos Cotacoes`, `Graficos Ordens de compra` e `Graficos Atendimentos`
- A mesma aba agora tambem possui o bloco `Cards resumo`, usado para configurar os cards que aparecem no topo das duas abas da home
- Cada aba da home pode ser configurada por lista, com `visivel`, `ordem`, `colunas` e `rotulo`, usando malha de `10 colunas`
- Os `Cards resumo` usam `visivel`, `ordem`, `colunas` e `rotulo`, e a composicao precisa caber em no maximo duas linhas de `10 colunas` cada
- A ordem das sessoes da home segue leitura visual: de cima para baixo e da esquerda para a direita
- Regra obrigatoria: sempre que um novo card ou uma nova sessao de grafico for criado na pagina inicial, ele tambem deve ser incluido na configuracao da empresa (aba `Pagina inicial`) para permitir controle de exibicao, ordem, largura e rotulo
- Os cards iniciais atuais mostram `Cotacoes em aberto`, `Ordens de Compra no mes`, `Media de dias para conversao`, `Atendimentos no mes`, `Prospeccao no mes`, `Positivacao no mes`, `% Positivacao da carteira`, `Catalogo` e `Carteira`
- Todo card da home deve ter tooltip no icone de `Informacao`
- O texto do tooltip de card deve ser simples e direto, sempre com `composicao do valor` e `periodo considerado`, no mesmo padrao dos tooltips dos graficos
- Padrao de conteudo dos tooltips de card: no maximo duas linhas curtas (`Composicao` e `Periodo`), sem textos longos
- Os graficos compactos da home seguem o padrao `maximo de 5 itens + modal com lista completa`
- O modal com a lista completa deve ser reutilizavel para qualquer sessao da home que precise resumir muitos itens
- Os icones de `Informacao` de cards e graficos usam tooltip padrao curto com apenas `Composicao` e `Periodo`
- O icone lateral ao lado do `Informacao` abre o modal com a lista completa quando houver mais de 5 resultados
- As secoes graficas compactas da home ocupam `2 colunas` no grid principal, salvo quando uma sessao explicitar outro span
- A aba `Cotacoes` concentra `Funil de cotacoes`, `Cotacoes em aberto por grupo de produtos`, `Cotacoes em aberto por marca` e `Cotacoes em aberto por produto`
- A sessao `Cotacoes em aberto por grupo de produtos` e componente reutilizavel proprio e aparece na configuracao da empresa em `Pagina inicial > Graficos Cotacoes`
- A aba `Ordens de compra` concentra `Ordens de compra do mes por grupo de produtos`, `Ordens de compra do mes por marca`, `Ordens de compra do mes por UF`, `Ordens de compra do mes por fornecedor`, `Ordens de compra do mes por produto` e `Compradores/Fornecedores em destaque`
- A aba `Atendimentos` concentra `Atendimentos do mes por canal`, `Atendimentos do mes por origem`, `Atendimentos do mes por fornecedor`, `Atendimentos do mes por tipo` e `Atendimentos do mes por usuario`
- O card `Prospeccao no mes` soma apenas atendimentos classificados com o tipo `Prospeccao`, identificado pela descricao do tipo cadastrada na configuracao
- O texto do tooltip de card e grafico deve ser simples e direto, com no maximo duas linhas curtas (`Composicao` e `Periodo`)
- Para `Usuario padrao`, toda a aba da home (`cards` e `graficos`) usa apenas registros de `cotacoes` e `ordens de compra` do comprador vinculado ao usuario (`idComprador`)
- Para `Administrador` e `Gestor`, a home mantem leitura consolidada da operacao sem recorte por comprador
- A pagina inicial segue em evolucao e a composicao atual da home deve ser lida pelos blocos documentados acima
- As barras exibem novamente a descricao da etapa diretamente sobre a propria barra, junto do valor
- A descricao dentro da barra usa a paleta do projeto com variacao baseada na cor da etapa, e o valor aparece em negrito
- As barras usam uma largura mais contida e com maior espacamento entre linhas para aliviar a leitura visual
- A distribuicao vertical das barras respeita a altura disponivel do card lateral sem sobreposicao entre linhas
- O grafico do funil se ajusta automaticamente quando a quantidade de etapas aumenta, reduzindo proporcoes e espacamentos para manter o layout estavel
- O cabecalho do funil exibe apenas o titulo principal, sem subtitulo auxiliar
- A grade do funil prioriza aproximar o valor das barras e reservar mais largura para o card lateral de detalhe
- O espacamento entre a coluna dos valores e o card lateral foi ampliado para melhorar a leitura
- A troca de etapa aplica uma transicao curta no card lateral para reforcar a mudanca de contexto
- A coluna da direita mostra um card resumido da etapa selecionada, com a primeira etapa carregada por padrao
- O card lateral foi compactado para nao ultrapassar visualmente a altura ocupada pelas barras do funil
- A altura total das barras passa a respeitar o card lateral como limite visual no desktop
- Ao clicar em outra barra do funil, o card lateral troca para a etapa correspondente
- A pagina inicial foi separada em componentes proprios e usa arquivos CSS dedicados para indicadores e funil
- Todo novo card/componente da pagina inicial deve ser reutilizavel e possuir arquivo CSS proprio em `client/src/recursos/estilos/`
- O cabecalho e cada card de indicador da pagina inicial seguem o padrao de CSS separado por componente
- O funil da pagina inicial foi dividido em subcomponentes com classes prefixadas por componente (`funilVendas...`, `inicioIndicadorResumo...`, `inicioCabecalho...`)
- Todos os CSS desses componentes ficam centralizados em `client/src/recursos/estilos/`
- Componentes-base compartilhados como App, PaginaLogin, BarraLateral, Botao, BotaoMenu, Icone, CampoPesquisa, PopupAvisos, CorpoPagina e CartaoPaginaVazia tambem ja seguem esse padrao
- `client/src/recursos/estilos/aplicacao.css` agora contem apenas variaveis, reset global e estilos base de tags
- Blocos compartilhados e remanescentes do legado foram distribuídos em arquivos dedicados como `gradePadrao.css`, `registrosTabela.css`, `formulariosBase.css`, `modaisBase.css`, `modalSecundario.css` e CSS por pagina em `client/src/recursos/estilos/`
- Carregamento via API local
- Mensagem de erro dedicada se os indicadores nao puderem ser carregados

### Perfis de acesso

Perfis disponiveis:

- `Administrador`
- `Gestor`
- `Usuario padrao`

Regras atualmente aplicadas no frontend:

- `Usuario padrao` nao pode alterar configuracoes administrativas
- `Usuario padrao` nao acessa `Empresa` nem `Usuarios` na tela de configuracoes
- `Usuario padrao` consulta produtos, sem incluir, editar, importar ou inativar
- `Usuario padrao` consulta a propria carteira na pagina de fornecedores
- Na pagina inicial, `Usuario padrao` enxerga cards e graficos comerciais apenas de `cotacoes` e `ordens de compra` do proprio comprador vinculado
- No grid de busca de fornecedor para incluir `Cotacoes` e `Ordens de Compra`, `Usuario padrao` pode selecionar fornecedores de outros compradores quando precisar abrir um novo registro comercial
- Na agenda, `Usuario padrao` nao pode excluir agendamentos
- Em configuracoes reutilizadas dentro de cadastros, usuarios sem permissao entram em modo de consulta
- O atalho `Compradores` em `Configuracoes` permanece desabilitado para `Usuario padrao`

Observacao:

- As restricoes de permissao estao principalmente no frontend
- O backend ainda nao implementa uma camada completa de autorizacao por perfil

### Fornecedores

- Tela com grade, pesquisa e filtro
- Manual visual da pagina de fornecedores acessado por `F1`, com fluxo do cadastro, carteira e filtros persistidos
- Modal em abas para incluir, editar e consultar
- Abas principais do cadastro: `Dados gerais`, `Endereco`, `Observacoes` e `Contato`
- Os antigos grids de `Atendimento` e `Ordens de compra` agora abrem em modais amplos separados, quase em tela cheia, para facilitar leitura operacional
- No historico de `Atendimentos`, a grade mostra `Data`, `Inicio`, `Fim`, `Assunto`, `Contato`, `Canal`, `Usuario` e `Acoes`
- O historico de `Atendimentos` tambem oferece busca por digitacao no cabecalho e filtros por `Data e horario`, um ou mais `Usuarios` e um ou mais `Canais`
- Dentro do modal amplo de `Ordens de compra`, continuam duas visoes: `Ordens de Compra` e `Itens da ordem de compra`, agora no mesmo componente reutilizavel usado tambem em produtos
- O grid de `Ordens de Compra` da aba Ordens de compra nao exibe mais o nome do contato
- O grid de `Ordens de Compra` mostra `Inclusao`, `Entrega`, `Ordem de Compra`, `Fornecedor` quando aplicavel, `Etapa`, `Comprador`, `Prazo de pagamento`, `Total` e `Acoes`
- Os grids de `Ordens de Compra` e `Itens da ordem de compra` mostram colunas separadas de `Inclusao` e `Entrega`, e o filtro desse historico tambem separa os dois periodos
- O grid de `Itens da ordem de compra` mostra `Inclusao`, `Entrega`, `Ordem de Compra`, `Referencia`, `Descricao`, `VALOR UN`, `QTD` e `Valor total`
- O historico de `Ordens de compra` tambem oferece busca por digitacao no cabecalho e filtros por `Datas`, um ou mais `Ordens de Compra`, um ou mais `Compradores`, uma ou mais `Etapas` e `Produto` via modal de busca em grade; as opcoes de ordem de compra consideram apenas ordens de compra do fornecedor consultado
- Thumbnail com codigo do fornecedor
- O cadastro de fornecedor aceita um `Codigo alternativo` numerico e opcional
- A empresa pode definir se o SRM exibe como principal o codigo padrao do fornecedor ou o `Codigo alternativo`; quando o alternativo estiver vazio, o sistema volta automaticamente ao codigo padrao
- O botao de importacao de fornecedores abre um modal com download de modelo em planilha; apos importar, o sistema informa as linhas rejeitadas e o motivo de cada uma
- Quando uma linha de fornecedores falha por comprador, ramo de atividade ou grupo de empresa nao encontrado/inativo, o modal de importacao passa a exibir um grid de pendencias para escolher um registro existente e reprocessar apenas essas linhas
- A importacao de fornecedores valida com mensagens especificas campos como CNPJ/CPF, codigo numerico, comprador, ramo, grupo, UF, CEP, email e status antes de inserir cada linha
- Integracao publica para consulta de `CEP`
- Integracao publica para consulta de `CNPJ`
- Aba de contatos com grade propria
- Formulario de contato reutilizavel
- Campo `Grupo de empresa` no modal do fornecedor, com atalho lateral para cadastrar e selecionar o grupo sem sair do fluxo
- Campo `Conceito` no modal do fornecedor, com atalho lateral para cadastrar e selecionar o conceito sem sair do fluxo
- Cada fornecedor pode se vincular a no maximo um `Grupo de empresa`, enquanto um grupo pode atender varios fornecedores
- Contatos do grupo aparecem como herdados no cadastro do fornecedor e ficam disponiveis para consulta no proprio modal
- Abertura do mesmo modal de `Ramo de Atividade` usado em configuracoes
- Inclusao e edicao de `Ramo de atividade` diretamente do cadastro de fornecedor, inclusive para `Usuario padrao`
- O cadastro de `Conceitos de fornecedor` nasce com `Sem Conceito` no `id 1`, esse registro fica protegido contra inativacao e todo novo fornecedor usa esse valor como padrao inicial
- A descricao dos `Conceitos de fornecedor` preserva exatamente a digitacao do usuario e nao passa pela capitalizacao automatica usada em outros cadastros auxiliares
- Os atalhos de `Grupo de empresa`, `Ramo de atividade` e `Conceito` preservam o formulario do fornecedor enquanto o cadastro auxiliar e aberto
- Ao salvar um novo `Grupo de empresa`, `Ramo de atividade` ou `Conceito` por esses atalhos, o registro retorna selecionado automaticamente no fornecedor
- Inativacao persiste no banco

Filtros de fornecedores:

- `Estado`
- `Cidade`
- `Grupo de empresa`
- `Ramo de atividade`
- `Comprador`
- `Tipo`
- `Ativo`

### Produtos

- Tela com grade, pesquisa e filtro
- Manual visual da pagina de produtos acessado por `F1`, com regras de catalogo, classificacoes auxiliares e permissoes do perfil
- Modal no mesmo padrao visual de fornecedores
- Modos incluir, editar e consultar
- No modal do produto, a aba `Ordens de compra` abre o mesmo historico amplo reutilizavel do fornecedor, filtrado automaticamente pelo produto selecionado e exibindo apenas itens das ordens de compra
- Nesse historico do produto, os filtros consideram separadamente `Data de inclusao` e `Data de entrega`
- Codigo automatico ao incluir
- Upload de imagem no padrao reutilizavel do projeto, com recorte final em 320 x 320 px para a foto principal do produto
- Campo de preco com mascara e digitacao amigavel em real
- Campo `Grupo de Produto` com botao de pesquisa para abrir o modal de configuracao
- O modal de `Grupo de Produto` permite definir quais `Tamanhos` estao disponiveis para cada grupo e em qual ordem devem aparecer
- Campo `Marca` com botao de pesquisa para abrir o modal de configuracao
- Campo `Unidade` com botao de pesquisa para abrir o modal de configuracao
- O botao de importacao de produtos abre um modal com download de modelo em planilha; apos importar, o sistema informa as linhas rejeitadas e o motivo de cada uma
- Quando uma linha de produtos falha por grupo, marca ou unidade nao encontrado/inativo, o modal de importacao passa a exibir um grid de pendencias para escolher um registro existente e reprocessar apenas essas linhas
- A importacao de produtos diferencia referencias auxiliares inativas de referencias inexistentes e tambem valida preco, codigo numerico e status com mensagens mais objetivas
- Inclusao e selecao imediata de registros auxiliares dentro do cadastro de produto
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
- Manual visual da agenda acessado por `F1`, com regras, obrigatoriedades, configuracoes e logicas reais da tela

Campos atuais do agendamento:

- `Assunto`
- `Dia`
- `Tipo`
- `Local`
- `Horario de inicio`
- `Horario de fim`
- `Fornecedor`
- `Contato do fornecedor`
- `Recursos` com selecao multipla
- `Usuarios` com selecao multipla
- `Status da visita`
- Ao incluir um agendamento, o campo `Status da visita` passa a vir preenchido automaticamente com o status ativo de menor ordem
- Os campos `Fornecedor` e `Contato do fornecedor` usam os mesmos modais reutilizaveis de busca do fluxo comercial
- Ao voltar da busca de fornecedor ou contato para o agendamento, o foco retorna para o campo preenchido
- Em modais e telas operacionais da agenda, `PageDown` prioriza `Salvar`; se nao houver salvamento disponivel no contexto atual, aciona `Adicionar`, `Incluir` ou `Novo`

Filtros da agenda:

- `Usuario` com selecao multipla
- `Comprador`
- `Fornecedor`
- `Local`
- `Recurso` com selecao multipla
- `Status`

### Atendimentos

- Tela com grade, pesquisa e filtros
- Modal de atendimento com formulario proprio
- Manual visual da pagina acessado por `F1`, com fluxo, validacoes, permissoes e atalhos reais da tela
- A grade principal usa distribuicao dinamica por coluna, mantendo dados curtos e previsiveis como `Data`, `Inicio`, `Fim`, `Origem` e `Acoes` mais contidos, deixando `Assunto` e `Descricao` ocuparem a maior parte do espaco util
- A empresa pode definir em `Configuracoes > Atendimentos > Colunas do grid` quais colunas do cadastro aparecem na listagem principal, incluindo `Codigo`, `Agendamento`, `Data`, `Inicio`, `Fim`, `Fornecedor`, `Contato`, `Assunto`, `Descricao`, `Canal`, `Origem` e `Usuario`
- A configuracao do grid principal de `Atendimentos` tambem permite definir a ordem e o espaco ocupado por cada informacao em uma malha de `100` partes, com `Acoes` sempre visivel
- O atalho geral `Colunas do grid` abre um seletor por modulo; hoje `Atendimentos`, `Fornecedores`, `Produtos`, `Cotacoes` e `Ordens de Compra` ja permitem configurar visibilidade, ordem, espaco e o `rotulo` do cabecalho por empresa
- As grades configuraveis de `Fornecedores`, `Cotacoes` e `Ordens de Compra` tambem podem exibir a coluna `Conceito`, reaproveitando a classificacao cadastrada no fornecedor
- As paginas principais desses modulos tambem exibem um botao direto de `Configurar grid` no cabecalho; `Usuario padrao` continua sem permissao para abrir esse ajuste
- Campos de fornecedor, contato e cotacao no mesmo fluxo comercial
- O modal de atendimento agora exige `Tipo de atendimento`, mantido em `Configuracoes > Atendimentos > Tipos de atendimento`
- Busca de fornecedor por modal reutilizavel
- Busca de contato por modal reutilizavel com inclusao rapida de novo contato quando o fornecedor ja estiver definido; o contato criado volta selecionado automaticamente no atendimento
- Inclusao de fornecedor dentro da busca de fornecedores
- Ao confirmar a busca de fornecedor ou contato, o foco retorna para o campo preenchido no modal principal
- O modal de atendimento abre com foco no primeiro campo editavel e `PageDown` prioriza `Salvar`; se nao houver salvamento disponivel no contexto atual, aciona `Adicionar`, `Incluir` ou `Novo`
- Quando o modal tiver abas, `Alt + Seta para a esquerda` e `Alt + Seta para a direita` alternam a secao ativa e reposicionam o foco no primeiro campo da nova aba
- Campo de status da cotacao no proprio atendimento
- Integracao com abertura de cotacao e ordem de compra a partir do atendimento
- Usuario administrador visualiza todos os fornecedores; `Usuario padrao` fica restrito a sua carteira na pagina de fornecedores

### Cotacoes

- Pagina propria de cotacoes
- Manual visual da pagina de cotacoes acessado por `F1`, com fluxo do funil, fechamento e ordem de compra derivado
- Modal em abas com `Dados gerais`, `Itens`, `Outros` e `Campos da cotacao`
- A inclusao e edicao de itens na cotacao seguem o mesmo padrao da ordem de compra, preservando snapshots de descricao, referencia, unidade e imagem no proprio item
- Ordens de Compra e cotacoes agora reutilizam o mesmo modal de item de produto, inclusive com o preview grande da imagem
- A logica de estado e manipulacao desses itens tambem foi centralizada em um hook compartilhado para reduzir duplicacao entre fluxos comerciais
- A imagem principal do produto continua sendo a origem padrao; quando o item da cotacao recebe uma imagem propria, ela fica exclusiva daquele item e e recortada em 1024 x 1024 px
- Busca reutilizavel de fornecedor e contato
- A busca de contato dentro da cotacao tambem permite incluir um novo contato do fornecedor ja selecionado e assumir esse contato automaticamente no formulario
- Ao confirmar a busca de fornecedor ou contato, o foco retorna para o campo preenchido no modal principal
- Quando o modal tiver abas, `Alt + Seta para a esquerda` e `Alt + Seta para a direita` alternam a secao ativa e reposicionam o foco no primeiro campo da nova aba
- Itens com selecao direta de produto no proprio modal, com atalho de busca para abrir o grid de produtos sem sair do item
- Controle de etapa da cotacao
- Ao entrar nas etapas `Fechado`, `Fechado sem ordem de compra`, `Ordem de Compra Excluida` ou `Recusado`, a cotacao passa a registrar `Data de fechamento` em campo proprio
- A `Data de fechamento` e obrigatoria nas etapas `Fechado`, `Fechado sem ordem de compra`, `Ordem de Compra Excluida` e `Recusado`
- As etapas `Fechado sem ordem de compra` e `Ordem de Compra Excluida` sao etapas tecnicas de uso automatico e nao aparecem nos selects manuais do usuario
- Integracao com abertura de ordem de compra ao fechar a cotacao
- A troca rapida da etapa para `Fechado` no grid tambem oferece a geracao imediata da ordem de compra
- Quando a troca para uma etapa final acontece pelo grid, a `Data de fechamento` usa automaticamente a data atual
- Dentro do modal da cotacao, a `Data de fechamento` pode ser ajustada manualmente antes de salvar
- O filtro da pagina de cotacoes tem um botao unico de `Datas` que abre um modal com os intervalos de `Data de inclusao` e `Data de fechamento`
- Cotacoes na etapa `Recusado` ficam somente para consulta por qualquer usuario
- Cotacoes com `ordem de compra vinculada` tambem ficam somente para consulta por qualquer usuario
- A edicao da cotacao volta a ser permitida apenas quando a ordem de compra vinculada e excluida, levando o registro para a etapa tecnica `Ordem de Compra Excluida`
- Modais de confirmacao do fluxo comercial abrem como sobreposicao fixa acima da pagina, inclusive no lancamento de ordem de compra a partir do grid
- Os modais de cotacao abrem com foco no primeiro campo editavel; modais de confirmacao priorizam `Sim` ou `Confirmar`
- O atalho `PageDown` prioriza `Salvar` no modal de cotacao; se nao houver salvamento disponivel no contexto atual, aciona `Adicionar`, `Incluir` ou `Novo`
- Campos configuraveis extras para a cotacao
- Os campos `Prazo de pagamento` nos modais de cotacao e ordem de compra reutilizam o mesmo grid de `Prazos de pagamento` da area de Configuracoes, permitindo cadastrar, editar, inativar e selecionar o prazo sem sair do fluxo
- Os atalhos que abrem tabelas configuraveis dentro dos modais tambem respeitam as permissoes do perfil; para `Usuario padrao`, os atalhos de configuracao sensiveis abrem em modo de consulta
- Em `Prazos de pagamento`, os dias sao opcionais; quando nenhum dia for informado, a descricao automatica fica apenas com o nome do metodo de pagamento
- O modal de cotacao permite exportar um PDF com cabecalho da empresa, dados do fornecedor, tabela de itens, total e observacoes
- No aplicativo web, o botao de PDF abre a janela de impressao do navegador para salvar o documento como PDF; no Electron, usa a exportacao nativa com escolha de arquivo
- A tabela de itens do PDF da cotacao exibe uma coluna propria de foto entre o numero do item e a descricao, com a miniatura centralizada quando a imagem estiver disponivel
- As observacoes do PDF incluem a observacao principal da cotacao, os campos extras preenchidos na cotacao e os textos padrao ativos configurados em `Campos da ordem de compra`
- O layout do PDF da cotacao foi separado em componente proprio para facilitar ajustes ou reversao da feature sem afetar o formulario principal
- O modal de cotacao em modo de inclusao pede confirmacao antes de fechar por `Cancelar`, `Escape` ou clique fora, inclusive quando aberto a partir do atendimento
- Em novas cotacoes, o comprador inicial passa a vir do comprador vinculado ao usuario do registro; trocar o fornecedor nao sobrescreve mais esse campo automaticamente
- A aba `Outros` da cotacao agora concentra `Ordem de Compra vinculada`

### Ordens de Compra

- Pagina propria de ordens de compra
- Manual visual da pagina de ordens de compra acessado por `F1`, com acompanhamento operacional, etapas, pagamento e permissoes
- Integracao com ordem de compra originado de cotacao
- No modal de inclusao da ordem de compra, os campos `Fornecedor` e `Contato` tambem possuem atalho de pesquisa para abrir os grids reutilizaveis sem sair do formulario
- A busca de contato dentro da ordem de compra tambem permite incluir um novo contato do fornecedor atual e assumir esse contato automaticamente no formulario
- Ao confirmar a busca de fornecedor ou contato, o foco retorna para o campo preenchido no modal principal
- Quando o modal tiver abas, `Alt + Seta para a esquerda` e `Alt + Seta para a direita` alternam a secao ativa e reposicionam o foco no primeiro campo da nova aba
- O modal da ordem de compra agora possui o campo `Tipo de ordem de compra`, alimentado por uma tabela auxiliar propria em `Configuracoes`
- A tabela `Tipos de ordem de compra` permanece como cadastro auxiliar tecnico do fluxo; nomes exibidos ao usuario devem seguir a linguagem de ordem de compra
- O modal de `Ordens de Compra` possui a aba `Outros`, que concentra a `Cotacao vinculada` e informacoes complementares sem reintroduzir conceitos comerciais removidos
- Em novas ordens de compra, o comprador inicial passa a vir do comprador vinculado ao usuario do registro; trocar o fornecedor nao sobrescreve mais esse campo automaticamente
- A pagina inicial agora exibe tambem `Ordens de compra do mes por grupo de produtos`, com quantidade total dos itens vendidos, quantidade de ordens de compra e valor total por grupo nas ordens de compra com data de entrada no mes corrente
- A pagina inicial agora exibe tambem `Ordens de compra do mes por marca`, com quantidade total dos itens vendidos, quantidade de ordens de compra e valor total por marca nas ordens de compra com data de entrada no mes corrente
- O cabecalho da pagina inicial agora possui as abas `Cotacoes` e `Ordens de compra`, separando os graficos comerciais por contexto sem misturar funil com analise de ordens de compra
- O modal de filtros da pagina de ordens de compra permite selecionar multiplas etapas ao mesmo tempo e salva esse recorte por usuario
- A etapa da ordem de compra pode ser alterada direto no grid, no mesmo padrao visual adotado em Cotacoes
- O filtro da pagina de ordens de compra tem um botao unico de `Datas` que abre um modal com os intervalos de `Data de inclusao` e `Data de entrega`
- Os modais de ordem de compra abrem com foco no primeiro campo editavel; modais de confirmacao priorizam `Sim` ou `Confirmar`
- O atalho `PageDown` prioriza `Salvar` no modal de ordem de compra; se nao houver salvamento disponivel no contexto atual, aciona `Adicionar`, `Incluir` ou `Novo`
- Ao mover uma ordem de compra para a etapa `Entregue`, a `Data de entrega` passa automaticamente para a data atual; dentro do modal, essa data ainda pode ser ajustada antes de salvar
- Quando uma ordem de compra chega em `Entregue`, o perfil `Usuario padrao` passa a consultar o registro sem edicao nem nova troca de etapa
- O modal de ordem de compra aberto a partir do fechamento de uma cotacao permite fechar direto pelo botao, clique fora ou `Escape`, devolvendo o fluxo a cotacao
- Campos extras configuraveis
- Itens com snapshots de produto para preservar historico comercial
- O item da ordem de compra herda a imagem da cotacao e, quando o usuario substituir essa imagem na propria ordem de compra, ela passa a ser exclusiva daquele item com recorte em 1024 x 1024 px
- Data de entrega baseada nas configuracoes da empresa

### Configuracoes

- Manual visual da pagina de configuracoes acessado por `F1`, com organizacao das secoes, permissoes e impacto dos cadastros no restante do SRM
- Sempre que uma regra, fluxo, validacao ou configuracao relevante de qualquer pagina mudar, o respectivo manual visual tambem deve ser atualizado para continuar refletindo o comportamento real da tela
- Refatoracoes internas sem impacto de uso nao exigem ajuste de manual visual, mas continuam exigindo atualizacao do README quando mudarem arquitetura, convencoes ou componentes-base reutilizaveis

A tela de configuracoes usa cards grandes e modais padrao. Hoje ela cobre:

- `Empresa`
- `Usuarios`
- `Ramos de atividade`
- `Conceitos de fornecedor`
- `Grupos de empresa`
- `Compradores`
- `Grupos de produto`
- `Marcas`
- `Tamanhos`
- `Unidades`
- `Metodos de pagamento`
- `Tipos de ordem de compra`
- `Prazos de pagamento`
- `Etapas da ordem de compra`
- `Etapas da cotacao`
- `Tamanhos`
- `Campos da cotacao`
- `Campos da ordem de compra`
- `Canais de atendimento`
- `Origens de atendimento`
- `Locais da agenda`
- `Tipos de recurso`
- `Recursos`
- `Tipos de agenda`
- `Status da visita`
- `Atualizacao do sistema`
- secao inicial de `Relatorios`, com atalhos para `Ordens de compra`, `Conversao` e `Atendimentos`
- os relatorios seguem o mesmo padrao visual: modal amplo, cards de resumo no topo, grade principal e botao de filtro no cabecalho
- `Ordens de compra` ja esta funcional e lista ordens de compra pelas datas de `Inclusao` e `Entrega`, com cards de consolidado, chips de filtros ativos, botao de exportacao em PDF e grade de ordens de compra sem botoes de acao
- `Conversao` ja esta funcional e lista cotacoes em grade propria mais simples, com colunas separadas de inclusao, fechamento, fornecedor e contato, cards de gerados, fechados, conversao e abertos, filtros por fornecedor, usuario, compradores, etapas, grupo de empresa, grupo de produto, marca e datas, alem de exportacao em PDF
- `Atendimentos` ja esta funcional e reaproveita a grade do historico por fornecedor com a coluna de `Fornecedor` adicionada, alem de cards com total atendido, fornecedores distintos, canal lider, origem lider, filtro no cabecalho e exportacao em PDF
- A secao `Atendimentos` tambem possui atalho para configurar por empresa quais colunas persistidas do cadastro aparecem na grade principal da pagina operacional
- `Ordens de Compra Entregues` e `Atendimentos` ja usam a mesma base visual e ficam preparados para evolucao das regras especificas

Regras importantes:

- Campos textuais de formularios passam por normalizacao para capitalizacao automatica, evitando persistencia acidental em caixa alta
- Dados retornados pela busca de CNPJ tambem sao normalizados antes de preencher o formulario, evitando razao social, nome fantasia e endereco em caixa alta
- O card de `Atualizacao do sistema` fica apenas na aba `Gerais`
- O card de `Atualizacao do sistema` fica visivel para todos os perfis, mas permanece desabilitado apenas para `Usuario padrao`; `Administrador` e `Gestor` podem abrir o modal
- A secao inicial de `Relatorios` fica visivel na pagina de `Configuracoes`, mas seus atalhos permanecem desabilitados para `Usuario padrao`
- O relatorio `Ordens de compra` usa filtros por `Fornecedor`, um ou mais `Compradores`, uma ou mais `Etapas`, `Grupo de empresa`, `Grupo de produto`, `Marca`, `Data de inclusao` e `Data de entrega`; o filtro de fornecedor tambem oferece botao de busca em grade para agilizar a selecao, e o periodo padrao do filtro ja abre no mes corrente
- O cabecalho do relatorio `Ordens de compra` exibe chips com os filtros ativos ao lado do botao de filtro e um botao dedicado para gerar o PDF do relatorio
- O PDF do relatorio `Ordens de compra` preserva as cores do cabecalho na impressao e organiza `Gerado em` e `Usuario` em uma coluna alinhada a direita no topo
- O resumo do relatorio `Ordens de compra` consolida `Ordens de Compra no recorte`, `Valor total`, `Quantidade` somando unidades dos itens e `Positivacao` por fornecedores distintos
- O relatorio `Ordens de compra` reaproveita a mesma grade base de ordens de compra usada no historico comercial, mas sem acoes de linha
- O relatorio `Conversao` usa uma grade simples de cotacoes sem acoes de linha, com colunas separadas de `Inclusao`, `Fechamento`, `Fornecedor` e `Contato`, filtros por `Fornecedor`, `Usuario`, `Compradores`, `Etapas`, `Grupo de empresa`, `Grupo de produto`, `Marca` e datas, e considera como fechadas as cotacoes em etapas de fechamento, fechado sem ordem de compra e recusado para calcular a conversao
- O resumo do relatorio `Conversao` destaca `Cotacoes gerados`, `Cotacoes fechados`, `Conversao` e `Cotacoes em aberto`
- O relatorio `Atendimentos` reaproveita a grade base do historico de atendimentos do fornecedor, adicionando a coluna `Fornecedor` e removendo as acoes de linha no contexto gerencial
- O resumo do relatorio `Atendimentos` destaca `Total de atendimentos`, `Fornecedores atendidos`, `Canal lider` e `Origem lider` a partir da distribuicao atual carregada
- O relatorio `Atendimentos` tambem usa modal de filtros com `Fornecedor`, um ou mais `Usuarios`, um ou mais `Canais`, uma ou mais `Origens` e `Data`, mostra chips de filtros ativos no cabecalho e oferece exportacao em PDF
- `Ramos de atividade` e `Grupos de empresa` tambem ficam liberados para `Usuario padrao` na propria pagina de `Configuracoes`, no mesmo modelo operacional ja adotado dentro do cadastro de fornecedores
- O modal de atualizacao permite salvar o link do repositorio GitHub usado para leitura das releases
- `Etapas da ordem de compra` e `Etapas da cotacao` agora possuem campo `Ordem`; os selects desses status respeitam essa ordem crescente nos formularios
- O campo `Abreviacao` foi removido das etapas de ordem de compra e cotacao; as regras e exibicao passam a considerar `Descricao`, `Cor`, `Ordem`, `Status` e, para etapas de cotacao, `Considera no Funil de Cotacoes`
- A logica operacional de ordens de compra valida a etapa critica `Entregue` por `idEtapa` fixo (`5`), sem depender da descricao cadastrada
- A etapa critica de ordem de compra usada pela logica do sistema nao pode ser inativada nem excluida (bloqueio no backend e no modal de Configuracoes)
- Etapas obrigatorias de cotacao nao podem ser inativadas nem excluidas (regra aplicada no backend e refletida no modal de Configuracoes)
- Regras obrigatorias das etapas de cotacao sao avaliadas por `idEtapaCotacao` fixo (`1` Fechado, `2` Fechado sem ordem de compra, `3` Ordem de Compra Excluida, `4` Recusado)
- A data de fechamento da cotacao tambem segue a validacao por `idEtapaCotacao` fixo (`1`, `2` e `3`), sem depender da descricao da etapa
- Regras criticas de `Status da visita` sao avaliadas por `idStatusVisita` fixo (`1` Agendado, `2` Confirmado, `3` Realizado, `4` Cancelado, `5` Nao compareceu)
- Status criticos da agenda podem ser editados, mas nao podem ser inativados nem excluidos (bloqueio no modal de Configuracoes e no backend)
- `Tipos de agenda` e `Status da visita` agora possuem campo `Ordem`; os selects/imputs da agenda respeitam a ordem crescente definida em Configuracoes
- `Recursos` nao usam mais `Sigla`; o cadastro e a exibicao passam a considerar `Descricao`, `Tipo` e `Status`
- `Tamanhos` possuem cadastro proprio em Configuracoes com `Codigo`, `Tamanho` e `Status`
- Cada `Grupo de Produto` pode vincular varios `Tamanhos`; essa relacao guarda a `Ordem` usada para exibicao no fluxo comercial
- `Grupos de empresa` possuem cadastro proprio com descricao, status e grade de contatos; qualquer alteracao nesses contatos sincroniza os fornecedores vinculados
- Os modais de grid da pagina de `Configuracoes` possuem botao que abre `Modal de filtros`; inicialmente ha filtro de `Ativo` e o estado padrao ao abrir e `somente ativos`
- Os modais de grid da pagina de `Configuracoes` possuem altura fixa na area de listagem para evitar variacao de tamanho ao trocar filtro ou contexto

### Empresa

O cadastro de empresa tem modal proprio com abas:

- `Dados gerais`
- `Pagina inicial`
- `Endereco`
- `Agenda`
- Dashboard inicial expandido com rolagem vertical e leitura executiva mais completa
- Painel heroico com resumo do periodo, carteira aberta, conversao, entregas, ticket medio e agenda futura
- Grade principal com indicadores de:
  - fornecedores da carteira filtrada
  - contatos ativos
  - produtos ativos
  - atendimentos no periodo
  - cotacoes no recorte
  - carteira aberta em valor
  - ordens de compra no recorte
  - ticket medio
  - ordens de compra em valores
  - itens vendidos
  - taxa de fechamento
- `Nome fantasia`
- Quando a logo da empresa e atualizada em Configuracoes, a barra lateral e os pontos que recarregam os dados da empresa passam a refletir a nova imagem sem exigir reinicio do aplicativo
- Os mesmos filtros da pagina inicial tambem sao aplicados aos cards de ordens de compra, usando ordens de compra como base para valor total e quantidade total vendida
- `Documento`
- O dashboard inclui grafico diario de tendencia para `Atendimentos`, `Cotacoes` e `Ordens de Compra` nos ultimos 7 dias do recorte
- O dashboard inclui rankings de `Compradores`, `Produtos`, `Grupos de produto` e `Marcas` com barras comparativas
- O dashboard inclui painel de agenda dos proximos dias e bloco de saude comercial com conversao, fechamento e entregas
- Os cards de resumo da pagina inicial usam titulo no topo com tipografia mais contida, valor abaixo, descricao auxiliar e icone ampliado na direita com corte parcial pelo proprio card
- Endereco completo
- Horarios de expediente da manha e da tarde
- Flag para trabalho aos sabados
- Horarios de sabado quando aplicavel
- `diasValidadeCotacao`
- `diasEntregaOrdem de Compra`
- `Filtro padrao de status da cotacao`

Esses dados sao usados em:

- Tela de login
- Barra lateral
- Faixa horaria padrao da agenda
- Validade inicial de cotacoes
- Previsao inicial de entrega de ordens de compra

### Layout Cotacao

Na secao `Cotacoes/Ordens de Compra` da pagina de `Configuracoes`, existe um card proprio chamado `Layout Cotacao`.

Campos de destaque:

- `Cor primaria do PDF da cotacao`
- `Cor secundaria do PDF da cotacao`
- `Cor de destaque do PDF da cotacao`

Esses dados sao usados em:

- Identidade visual usada na exportacao em PDF da cotacao

Na aba `Cotacoes/Ordens de Compra` do cadastro da `Empresa`, ficam as regras comerciais ligadas ao documento e ao fluxo:

- `Validade padrao da cotacao`
- `Prazo padrao de entrega da ordem de compra`
- `Codigo principal do fornecedor`
- `Primeiro plano dos itens` para priorizar `Descricao` ou `Referencia` nos grids de itens e no PDF da cotacao

### Usuarios

Usuarios possuem:

- foto
- nome
- usuario
- senha
- tipo
- ativo
- comprador vinculado
- quando o proprio usuario logado atualiza sua foto em `Configuracoes`, a barra lateral passa a refletir a nova imagem sem precisar reiniciar ou fazer novo login

Regra importante:

- `Usuario padrao` deve obrigatoriamente estar vinculado a um comprador

## Banco de dados

### Regras gerais

- Banco utilizado: `SQLite`
- Em build desktop, o banco principal fica na pasta persistente do usuario em `AppData/Roaming/Connecta SRM/data`
- Chaves primarias usam inteiros autoincrementais
- Campos booleanos usam `0` e `1`
- O projeto faz migracoes simples no startup com `ALTER TABLE` e recriacao de tabelas quando necessario
- Migracoes bem escritas preservam dados existentes; trocar a pasta de dados do app nao preserva automaticamente o mesmo arquivo de banco sem rotina de migracao
- O startup do Electron tenta migrar automaticamente bancos legados encontrados em pastas antigas de `AppData`, no diretório do executável, em `resources/data` e em caminhos antigos do app

### Tabelas principais do sistema

Cadastros comerciais:

- `ramoAtividade`
- `comprador`
- `grupoProduto`
- `tamanho`
- `grupoProdutoTamanho`
- `marca`
- `unidadeMedida`
- `fornecedor`
- `contato`
- `produto`

Cadastros da empresa e acesso:

- `empresa`
- `usuario`

Cadastros comerciais e de processo:

- `canalAtendimento`
- `tipoAtendimento`
- `origemAtendimento`
- `atendimento`
- `cotacao`
- `itemCotacao`
- `valorCampoCotacao`
- `ordemCompra`
- `itemOrdemCompra`
- `valorCampoOrdemCompra`

Cadastros de configuracao comercial:

- `metodoPagamento`
- `prazoPagamento`
- `etapaOrdemCompra`
- `etapaCotacao`
- `campoCotacaoConfiguravel`
- `campoOrdemCompraConfiguravel`

Cadastros da agenda:

- `localAgenda`
- `tipoRecurso`
- `recurso`
- `tipoAgenda`
- `statusVisita`
- `agendamento`
- `agendamentoRecurso`
- `agendamentoUsuario`

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

Rotas CRUD atualmente expostas:

- `/api/ramosAtividade`
- `/api/compradores`
- `/api/gruposProduto`
- `/api/tamanhos`
- `/api/gruposProdutoTamanhos`
- `/api/marcas`
- `/api/unidadesMedida`
- `/api/locaisAgenda`
- `/api/tiposRecurso`
- `/api/recursos`
- `/api/tiposAgenda`
- `/api/statusVisita`
- `/api/canaisAtendimento`
- `/api/tiposAtendimento`
- `/api/origensAtendimento`
- `/api/metodosPagamento`
- `/api/prazosPagamento`
- `/api/tiposPedido` (rota compativel atual para tipos de ordem de compra)
- `/api/etapasPedido` (rota compativel atual para etapas de ordem de compra)
- `/api/etapasCotacao`
- `/api/camposCotacao`
- `/api/camposPedido` (rota compativel atual para campos de ordem de compra)
- `/api/empresas`
- `/api/usuarios`
- `/api/fornecedores`
- `/api/contatos`
- `/api/produtos`
- `/api/atendimentos`
- `/api/listagens/fornecedores`: listagem enxuta para o grid principal, com busca textual e filtros enviados pela tela
- `/api/listagens/produtos`: listagem enxuta para o grid principal, com busca textual e filtros enviados pela tela
- `/api/listagens/atendimentos`: listagem enxuta para o grid principal, com busca textual, filtros e recorte por carteira quando aplicavel
- `/api/itensCotacao`
- `/api/valoresCamposCotacao`
- `/api/itensPedido` (rota compativel atual para itens de ordem de compra)
- `/api/valoresCamposPedido` (rota compativel atual para valores de campos de ordem de compra)

### Rotas customizadas

- `POST /api/auth/login`: autenticacao
- `/api/agendamentos`: CRUD customizado para agendamento, com suporte a multiplos recursos e multiplos usuarios
- `/api/cotacoes`: fluxo customizado de cotacoes com itens e campos extras
- `/api/ordensCompra`: fluxo customizado de ordens de compra com itens e campos extras
- `GET /api/cotacoes` e `GET /api/ordensCompra` aceitam os filtros das paginas principais para reduzir carga no frontend e retornar apenas o recorte solicitado
- `GET /api/atualizacaoSistema`: leitura da configuracao de update
- `PUT /api/atualizacaoSistema`: persistencia da configuracao de update
- `/api/arquivos/imagens`: entrega de imagens locais do sistema

## Integracoes externas

Hoje o frontend usa APIs publicas para:

- `CEP`: `ViaCEP`
- `CNPJ`: `BrasilAPI`

Essas integracoes sao usadas no cadastro de fornecedores para preencher dados automaticamente.

## Seeds e dados de teste

O comando `npm run reset:banco` reseta o banco local para a base minima obrigatoria do sistema. O alias `npm run popular:banco` continua disponivel e aponta para o mesmo fluxo.

Depois do reset, a base fica somente com os registros obrigatorios:

- usuario administrador padrao
- configuracao de atualizacao do sistema
- status obrigatorios da agenda
- tipos obrigatorios da agenda
- etapa obrigatoria da ordem de compra `Entregue`
- etapas obrigatorias da cotacao:
  `1 Fechado`
  `2 Fechado sem ordem de compra`
  `3 Ordem de Compra Excluida`
  `4 Recusado`

## Como rodar

1. Instale as dependencias com `npm install`
2. Use os scripts conforme o fluxo desejado

### Desenvolvimento

- `npm run dev`: sobe backend, frontend web e Electron juntos
- `npm run dev:webapp`: sobe backend e frontend web juntos
- `npm run dev:backend`: sobe somente o backend Express com `nodemon`
- `npm run dev:web`: sobe somente o frontend web com Vite
- `npm run dev:electron`: abre somente o Electron, aguardando backend e frontend

Observacoes do ambiente local:

- Em desenvolvimento, o backend local usa a porta `3101`
- Em desenvolvimento, o banco usado pelo projeto deve ser `data/srm.sqlite` dentro deste repositorio
- Essa separacao evita conflito com uma versao instalada do app no mesmo computador, que continua usando a propria pasta de dados
- O frontend web em desenvolvimento aponta para `http://127.0.0.1:3101/api`
- A `Content-Security-Policy` definida em `client/index.html` precisa permitir `connect-src` para `http://127.0.0.1:3101` e `http://localhost:3101`; sem isso, o navegador bloqueia a API local antes mesmo de a requisicao chegar ao backend

### Inicializacao manual

- `npm run start:backend`: inicia o backend sem `nodemon`
- `npm run start:web`: inicia o frontend web
- `npm run start:electron`: gera a build web e abre o app no Electron

### Build

- `npm run build`: gera a build web
- `npm run build:web`: gera a build web em `dist/web`
- `npm run build:electron`: gera a build web e empacota o Electron em `dist/electron`
- `npm run release`: gera a build desktop e publica os artefatos no `GitHub Releases`

Observacao sobre empacotamento Electron:

- O `electron-builder` cria a pasta intermediaria `dist/electron/win-unpacked` para montar o instalador Windows
- Essa pasta nao e um modo portatil publicado para o cliente final; e apenas uma etapa interna do empacotamento
- O projeto agora empacota primeiro em uma pasta temporaria fora do OneDrive e copia de volta apenas os artefatos finais para `dist/electron`
- Ao final de `npm run build:electron` e `npm run release`, `win-unpacked` nao permanece em `dist/electron`
- Quando o release conclui com sucesso, o arquivo de atualizacao `latest.yml` deve aparecer junto dos artefatos finais
- O fluxo de release nao depende da branch atual; ele depende da `version` do `package.json`, de uma tag compativel (`vx.y.z`) e do `GH_TOKEN`

### Reset do banco

- `npm run reset:banco`: reseta o banco local para a base minima obrigatoria
- `npm run popular:banco`: alias compativel que executa o mesmo reset

## Empacotamento desktop

Configuracao atual do instalador Windows:

- `NSIS`
- `oneClick: false`
- `allowToChangeInstallationDirectory: true`

Comportamento esperado:

- Na primeira instalacao, o cliente final pode escolher a pasta onde o aplicativo sera instalado
- As atualizacoes seguintes acompanham a instalacao ja existente
- O banco do sistema continua na pasta de dados do Electron, separado da pasta do executavel

Arquivos gerados em release:

- `Connecta-SRM-Setup-x.y.z.exe`
- `Connecta-SRM-Setup-x.y.z.exe.blockmap`
- `latest.yml`

## Atualizacao automatica via GitHub Releases

O projeto esta preparado para buscar atualizacoes publicadas no repositorio `TailonSilva/connecta-srm` usando `electron-updater`.

Como funciona:

- Em build empacotada, a verificacao de atualizacao acontece somente por acao manual do cliente final em `Configuracoes > Gerais > Atualizacao do sistema`
- O repositorio usado para leitura pode ser configurado pela tela `Configuracoes > Gerais > Atualizacao do sistema`
- Antes de iniciar a atualizacao manual, o modal oferece um botao para gerar e salvar um backup do banco de dados
- Se existir versao mais nova no `GitHub Releases`, o download acontece em segundo plano somente apos a acao manual do usuario
- Quando o download termina, o usuario recebe um aviso para reiniciar e concluir a instalacao
- Antes de instalar a atualizacao, o app cria um backup de seguranca dos dados em `AppData/Roaming/Connecta SRM/backups`

Mensagens visuais ja tratadas no modal:

- verificacao em andamento
- sem atualizacao disponivel
- nova versao encontrada
- progresso do download em percentual
- atualizacao baixada e pronta para reinicio
- erro de verificacao ou download

Fluxo para publicar uma nova versao:

1. Atualize o campo `version` no `package.json`
2. Gere a build/release vinculada a uma tag com a mesma versao
3. Garanta que a release no GitHub esteja publicada, nao como `draft`
4. Garanta que `latest.yml` e os artefatos estejam anexados
5. No terminal, defina `GH_TOKEN`
6. Execute `npm run release`

Antes de empacotar ou publicar:

- `npm run build:electron` e `npm run release` agora validam automaticamente se existe uma tag local compativel com a versao atual
- Tags aceitas: `1.4.4` ou `v1.4.4`
- Se a versao do `package.json` estiver divergente da tag, o comando interrompe antes do empacotamento

Exemplo no PowerShell:

```powershell
$env:GH_TOKEN="seu_token_aqui"
npm run release
```

Observacoes importantes:

- O auto-update depende de uma build instalada; nao roda no modo `dev`
- O repositorio usado pelo updater precisa estar acessivel para os clientes finais
- Cada release precisa ter versao maior que a anterior para o Electron detectar corretamente a atualizacao
- O nome do instalador publicado precisa bater com o `latest.yml`; hoje isso e garantido por `artifactName`

## Paleta visual atual

Variaveis CSS principais:

| Papel | Variavel | Hex |
| --- | --- | --- |
| Laranja principal | `--corPrimaria` | `#EC8702` |
| Laranja forte | `--corPrimariaForte` | `#C66F00` |
| Laranja suave | `--corPrimariaSuave` | `#FFB347` |
| Fundo | `--corFundo` | `#FFF6EA` |
| Superficie | `--corSuperficie` | `#FFFFFF` |
| Superficie suave | `--corSuperficieSuave` | `#F5E7D5` |
| Borda | `--corBorda` | `#E3C9A8` |
| Texto | `--corTexto` | `#3C4A57` |
| Texto suave | `--corTextoSuave` | `#7A8894` |

## Estado atual da navegacao

Paginas hoje presentes no painel:

- `Pagina inicial`
- `Agenda`
- `Atendimentos`
- `Fornecedores`
- `Produtos`
- `Cotacoes`
- `Ordens de Compra`
- `Configuracoes`

## Identidade visual aplicada

- Logo do login atualizada para a marca `Connecta SRM`
- Icone do aplicativo Electron configurado a partir do arquivo de marca em `build/icon.png`
- Instalador e executavel usando o nome visual da marca

