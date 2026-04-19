import { ModalManualPagina } from '../comuns/modalManualPagina';

export function ModalManualOrcamentos({
  aberto,
  aoFechar,
  orcamentos = [],
  etapasOrcamento = [],
  motivosPerda = [],
  prazosPagamento = [],
  filtros = {},
  empresa,
  usuarioLogado
}) {
  const filtrosAtivos = [
    filtros.idCliente,
    filtros.idUsuario,
    filtros.idVendedorCliente,
    filtros.idVendedor,
    filtros.dataInclusaoInicio,
    filtros.dataInclusaoFim,
    filtros.dataFechamentoInicio,
    filtros.dataFechamentoFim,
    ...(Array.isArray(filtros.idsEtapaOrcamento) ? filtros.idsEtapaOrcamento : [])
  ].filter(Boolean).length;

  return (
    <ModalManualPagina
      aberto={aberto}
      aoFechar={aoFechar}
      titulo="Manual de Cotacoes"
      descricao="Guia visual do fluxo de propostas comerciais, etapas do funil, perda, fechamento e abertura de pedido."
      eyebrow="Propostas comerciais"
      heroTitulo="Como a pagina de Cotacoes conduz o funil de vendas"
      heroDescricao="A tela de Orcamentos concentra a criacao de propostas, o andamento por etapa comercial e o fechamento em pedido. Ela tambem controla motivos de perda e usa as configuracoes da empresa para montar o recorte inicial da operacao."
      painelHeroi={[
        { valor: orcamentos.length, rotulo: 'Cotacoes na grade atual' },
        { valor: etapasOrcamento.length, rotulo: 'Etapas configuradas' },
        { valor: prazosPagamento.length, rotulo: 'Prazos de pagamento carregados' }
      ]}
      cardsResumo={[
        {
          titulo: 'Carteira visivel',
          descricao: `${orcamentos.length} proposta(s) aparecem na grade conforme o filtro atual.`,
          detalhe: 'Usuario padrao ve na grade apenas os cotacoes em que ele proprio e o comprador do registro.',
          icone: 'orcamento'
        },
        {
          titulo: 'Funil configurado',
          descricao: `${etapasOrcamento.length} etapa(s) ordenadas controlam o fluxo da cotacao.`,
          detalhe: empresa?.etapasFiltroPadraoOrcamento
            ? 'A empresa define etapas padrao para o filtro inicial da pagina.'
            : 'Sem etapas padrao definidas na empresa para abertura da tela.',
          icone: 'cadastro'
        },
        {
          titulo: 'Perdas e fechamento',
          descricao: `${motivosPerda.length} motivo(s) de perda disponivel(is) para etapas que exigem justificativa.`,
          detalhe: 'No fechamento, o sistema pode abrir a inclusao da ordem de compra no mesmo fluxo.',
          icone: 'pedido'
        },
        {
          titulo: 'Filtros ativos',
          descricao: filtrosAtivos > 0
            ? `${filtrosAtivos} filtro(s) aplicados na tela.`
            : 'Nenhum filtro adicional ativo neste momento.',
          detalhe: 'O contexto do funil fica persistido por usuario.',
          icone: 'filtro'
        }
      ]}
      cardsFluxo={[
        {
          titulo: 'Criar proposta',
          descricao: 'Abra o modal para montar cliente, itens, valores, pagamento e etapa comercial da cotacao.',
          icone: 'adicionar'
        },
        {
          titulo: 'Mover na grade',
          descricao: 'A etapa pode ser ajustada pela propria listagem, sem abrir o modal completo, quando a regra permitir, adotando a data do fechamento na troca para etapas finais.',
          icone: 'editar'
        },
        {
          titulo: 'Justificar perda',
          descricao: 'Etapas configuradas com obrigatoriedade de motivo bloqueiam a troca ate que a justificativa seja informada.',
          icone: 'mensagem'
        },
        {
          titulo: 'Fechar em ordem de compra',
          descricao: 'Ao fechar o orcamento, o sistema pode perguntar se deve abrir imediatamente a ordem de compra com dados herdados.',
          icone: 'confirmar'
        }
      ]}
      blocosTexto={[
        {
          tag: 'Formulario',
          titulo: 'Campos e vinculos do modal',
          itens: [
            'Cliente e contato entram no mesmo fluxo da cotacao e abastecem a proposta comercial.',
            'Na busca de fornecedores da cotacao, Usuario padrao tambem pode selecionar clientes vinculados a outros compradores para montar novas propostas.',
            'Selecionar ou trocar o cliente nao puxa mais o comprador do cadastro do cliente; o comprador inicial da cotacao sempre segue o usuario do registro e so muda quando o proprio campo Comprador for alterado no modal.',
            'A busca de clientes tambem permite incluir um novo cliente sem sair do fluxo.',
            'Ao abrir a busca de contatos com um cliente ja definido, o proprio modal permite cadastrar um novo contato e devolver esse contato ja selecionado na cotacao.',
            'Quando o foco estiver em Cliente ou Contato, `F8` abre a busca correspondente sem depender do clique no botao lateral.',
            'Ao confirmar a busca de cliente ou contato, o foco retorna para o campo preenchido na cotacao.',
            'Itens e valores seguem o mesmo padrao visual da ordem de compra, com descricao e imagem preservadas no proprio item.',
            'Dentro do item, `F8` tambem abre a busca de Produto quando o foco estiver no campo correspondente.',
            'A imagem do item pode herdar a foto principal do produto, mas quando o usuario trocar essa imagem na cotacao ela passa a ser exclusiva daquele item e e recortada em 1024 x 1024 px.',
            'Prazos de pagamento podem ser mantidos dentro do modal, respeitando o perfil do usuario.',
            'A aba Outros concentra o Ordem de Compra vinculado, a Comissao (%), o Total comissao calculado sobre o total liquido dos itens e o Motivo da perda usado nas etapas finais do funil.',
            'O Total comissao da cotacao e atualizado em tempo real sempre que itens, valores ou percentual de comissao mudarem no formulario.',
            'O cabecalho do modal tambem oferece Gerar e-mail, que abre o Outlook Web usando o template configurado na aba E-mail da empresa e preenche destinatario, assunto e corpo do orçamento, incluindo tags opcionais de observacao e campos personalizados.',
            'O modo do modal controla corretamente inclusao, edicao e consulta, inclusive em saida sem salvar.',
            'Nas abas do modal da cotacao, `Alt + Seta para a esquerda` volta para a aba anterior e `Alt + Seta para a direita` avanca para a proxima, reposicionando o foco no primeiro campo da nova aba.',
            'O modal abre no primeiro campo editavel, confirmacoes focam a acao principal, `PageDown` prioriza Salvar e `F8` abre a busca contextual de Cliente, Contato ou Produto quando o foco estiver nesses campos.'
          ]
        },
        {
          tag: 'Grade',
          titulo: 'Como usar a listagem principal',
          itens: [
            'A pesquisa textual e os filtros ajudam a localizar propostas por cliente, usuario, comprador, etapa e um botao Datas que abre o painel com os periodos de inclusao e fechamento.',
            'O cabecalho da pagina tambem oferece um atalho direto de Configurar grid para ajustar colunas sem precisar entrar na tela de Configuracoes.',
            'A grade mostra rapidamente a etapa atual e permite acao rapida de evolucao do funil.',
            'As colunas foram redistribuidas para evitar rolagem horizontal e agora separam codigo, cliente, contato, etapa, comprador e total em campos proprios.',
            'A configuracao do grid tambem pode incluir a coluna Conceito do cliente para apoiar leitura comercial sem abrir o cadastro.',
            'Quando algum texto ultrapassa duas linhas, a grade aplica reticencias para preservar a altura das linhas.',
            'Registros fechados podem gerar ordem de compra sem perder o contexto da cotacao.',
            'A exclusao depende do perfil e usa confirmacao dedicada antes de remover o registro.'
          ]
        }
      ]}
      cardsRegras={[
        {
          titulo: 'Etapas padrao da empresa',
          descricao: 'A abertura da tela considera a configuracao da empresa para montar o filtro padrao de etapas da cotacao.',
          detalhe: 'Isso ajuda a focar o funil nas fases relevantes do processo comercial.',
          icone: 'empresa'
        },
        {
          titulo: 'Ordem de Compra a partir do fechamento',
          descricao: 'Quando uma etapa entra em fechamento e ainda nao ha ordem de compra vinculado, o sistema prepara automaticamente os dados iniciais do pedido.',
          detalhe: 'O usuario pode aceitar agora ou deixar a pendencia para depois.',
          icone: 'pedido'
        },
        {
          titulo: 'Comprador do registro',
          descricao: 'Em novos orcamentos, o comprador e a comissao inicial seguem o usuario do registro e nao o comprador cadastrado no cliente.',
          detalhe: 'Trocar o cliente nao sobrescreve mais o comprador nem o percentual de comissao automaticamente.',
          icone: 'usuarios'
        },
        {
          titulo: 'Data de fechamento',
          descricao: 'Ao entrar nas etapas Fechado, Fechado sem ordem de compra, Ordem de Compra Excluido ou Recusado, o orcamento passa a usar uma data de fechamento propria e obrigatoria.',
          detalhe: 'No modal, a data pode ser ajustada antes do salvamento; no grid, a troca usa a data atual automaticamente.',
          icone: 'confirmar'
        },
        {
          titulo: 'Etapas automaticas',
          descricao: 'Fechado sem ordem de compra e Ordem de Compra Excluido existem como etapas tecnicas do sistema e nao aparecem para escolha manual nos inputs do usuario.',
          detalhe: 'Essas etapas continuam sendo usadas automaticamente pelas regras internas do funil e do vinculo com ordens de compra.',
          icone: 'selo'
        },
        {
          titulo: 'Prazos protegidos',
          descricao: 'Atalhos para prazos de pagamento respeitam o perfil do usuario tambem dentro do modal da cotacao.',
          detalhe: 'Usuario padrao abre configuracoes sensiveis em consulta.',
          icone: 'configuracoes'
        },
        {
          titulo: 'Consulta em etapas finais',
          descricao: 'Orcamentos na etapa Recusado ou com ordem de compra vinculado ficam somente para consulta por qualquer usuario.',
          detalhe: 'A edicao volta a ser permitida apenas quando a ordem de compra vinculado e excluido, levando o orcamento para a etapa tecnica Ordem de Compra Excluido.',
          icone: 'usuarios'
        }
      ]}
    />
  );
}

