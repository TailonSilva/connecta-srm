import { ModalManualPagina } from '../comuns/modalManualPagina';

export function ModalManualOrdensCompra({
  aberto,
  aoFechar,
  pedidos = [],
  etapasPedido = [],
  prazosPagamento = [],
  filtros = {},
  usuarioLogado
}) {
  const filtrosAtivos = Object.values(filtros).filter((valor) => {
    if (Array.isArray(valor)) {
      return valor.length > 0;
    }

    return Boolean(valor);
  }).length;

  return (
    <ModalManualPagina
      aberto={aberto}
      aoFechar={aoFechar}
      titulo="Manual de Ordens de Compra"
      descricao="Guia visual do acompanhamento de ordens de compra, etapas comerciais, pagamento e regras de permissao da tela."
      eyebrow="Execucao comercial"
      heroTitulo="Como a pagina de Ordens de Compra acompanha o fechamento do CRM"
      heroDescricao="A pagina de Ordens de Compra acompanha os registros gerados a partir das propostas fechadas ou criados diretamente na tela. Ela concentra etapa da ordem de compra, pagamento, itens e consulta operacional da execucao comercial."
      painelHeroi={[
        { valor: pedidos.length, rotulo: 'Ordens de Compra na grade atual' },
        { valor: etapasPedido.length, rotulo: 'Etapas de ordem de compra' },
        { valor: prazosPagamento.length, rotulo: 'Prazos de pagamento carregados' }
      ]}
      cardsResumo={[
        {
          titulo: 'Grade operacional',
          descricao: `${pedidos.length} ordem de compra(s) aparecem no recorte atual.`,
          detalhe: 'Para Usuario padrao, a listagem considera apenas as ordens de compra em que ele proprio e o comprador do registro.',
          icone: 'pedido'
        },
        {
          titulo: 'Etapas do processo',
          descricao: `${etapasPedido.length} etapa(s) configurada(s) organizam o andamento do pedido.`,
          detalhe: 'As etapas sao mantidas na pagina de Configuracoes.',
          icone: 'cadastro'
        },
        {
          titulo: 'Classificacao da ordem de compra',
          descricao: 'O ordem de compra agora pode receber um Tipo de ordem de compra definido em tabela auxiliar propria.',
          detalhe: 'O tipo classifica o registro sem alterar automaticamente quantidade, valores ou etapa.',
          icone: 'pedido'
        },
        {
          titulo: 'Pagamento',
          descricao: `${prazosPagamento.length} prazo(s) de pagamento podem ser usados no modal do pedido.`,
          detalhe: 'Os prazos podem existir sem dias e manter apenas o metodo, conforme a configuracao atual.',
          icone: 'pagamento'
        },
        {
          titulo: 'Filtros ativos',
          descricao: filtrosAtivos > 0
            ? `${filtrosAtivos} filtro(s) aplicados agora.`
            : 'Nenhum filtro ativo no momento.',
          detalhe: 'O estado da tela e salvo por usuario.',
          icone: 'filtro'
        }
      ]}
      cardsFluxo={[
        {
          titulo: 'Criar ordem de compra',
          descricao: 'O ordem de compra pode nascer diretamente pela tela ou a partir do fechamento de um orcamento.',
          icone: 'adicionar'
        },
        {
          titulo: 'Consultar e editar',
          descricao: 'A grade permite consultar o registro e, quando permitido pelo perfil e pela etapa, seguir em edicao mantendo o contexto comercial do pedido.',
          icone: 'consultar'
        },
        {
          titulo: 'Controlar etapa',
          descricao: 'Cada ordem de compra recebe uma etapa de acompanhamento e pode ter a etapa alterada direto no grid para agilizar a operacao.',
          icone: 'editar'
        },
        {
          titulo: 'Excluir com confirmacao',
          descricao: 'Quando o perfil permite, a tela exige confirmacao antes de excluir um pedido.',
          icone: 'confirmar'
        }
      ]}
      blocosTexto={[
        {
          tag: 'Formulario',
          titulo: 'O que o modal concentra',
          itens: [
            'Fornecedor, contato, usuario do registro e comprador compoem a base comercial da ordem de compra, com atalhos de busca para fornecedor e contato no modo de inclusao.',
            'Na busca de fornecedores da ordem de compra, Usuario padrao tambem pode selecionar fornecedores vinculados a outros compradores para abrir um novo pedido.',
            'Selecionar ou trocar o fornecedor nao puxa mais o comprador do cadastro do fornecedor; o comprador inicial da ordem de compra sempre segue o usuario do registro e so muda quando o proprio campo Comprador for alterado no modal.',
            'A busca de fornecedores tambem permite incluir um novo fornecedor sem sair do fluxo.',
            'Ao abrir a busca de contatos com um fornecedor ja definido, o proprio modal permite cadastrar um novo contato e devolver esse contato ja selecionado no pedido.',
            'Quando o foco estiver em Fornecedor ou Contato, `F8` abre a busca correspondente sem depender do clique no botao lateral.',
            'Ao confirmar a busca de fornecedor ou contato, o foco retorna para o campo preenchido no pedido.',
            'O campo Tipo de ordem de compra usa uma tabela auxiliar propria para classificar o registro sem depender da etapa comercial.',
            'A aba Outros concentra o Orcamento vinculado e os dados complementares da ordem de compra.',
            'Itens, valores e pagamento sao herdados do fluxo comercial e podem ser ajustados no modal.',
            'Dentro do item, `F8` tambem abre a busca de Produto quando o foco estiver no campo correspondente.',
            'A imagem do item pode herdar o que veio da cotacao; quando o usuario trocar essa imagem na ordem de compra, ela passa a ser exclusiva daquele item e e recortada em 1024 x 1024 px.',
            'Prazos de pagamento podem ser cadastrados no proprio fluxo, respeitando o perfil.',
            'Campos personalizados da ordem de compra aparecem conforme a configuracao carregada no sistema.',
            'Nas abas do modal da ordem de compra, `Alt + Seta para a esquerda` volta para a aba anterior e `Alt + Seta para a direita` avanca para a proxima, reposicionando o foco no primeiro campo da nova aba.',
            'O modal abre no primeiro campo editavel, confirmacoes focam a acao principal, `PageDown` prioriza Salvar e `F8` abre a busca contextual de Fornecedor, Contato ou Produto quando o foco estiver nesses campos.'
          ]
        },
        {
          tag: 'Grade',
          titulo: 'Como usar a listagem principal',
          itens: [
            'A pesquisa textual ajuda a localizar rapidamente ordens de compra por dados do fornecedor e do registro.',
            'O cabecalho da pagina tambem oferece um atalho direto de Configurar grid para ajustar colunas sem precisar entrar na tela de Configuracoes.',
            'Os filtros incluem fornecedor, usuario do registro, comprador, uma ou mais etapas e um botao Datas que abre o painel com os periodos de inclusao e entrega.',
            'A grade permite trocar a etapa da ordem de compra sem abrir o modal completo.',
            'As colunas foram ajustadas para leitura sem rolagem horizontal e agora separam codigo, fornecedor, contato, etapa, comprador e total em campos proprios.',
            'A configuracao do grid tambem pode incluir a coluna Conceito do fornecedor para destacar a classificacao comercial na operacao de ordens de compra.',
            'Textos que excedem duas linhas passam a ser truncados com reticencias para manter a altura da grade sob controle.',
            'Ao reabrir a tela, os filtros anteriores sao restaurados automaticamente.'
          ]
        }
      ]}
      cardsRegras={[
        {
          titulo: 'Persistencia do contexto',
          descricao: 'A tela salva por usuario o ultimo recorte de filtros para retomar a mesma analise depois.',
          detalhe: 'Isso reduz retrabalho em operacoes de acompanhamento.',
          icone: 'filtro'
        },
        {
          titulo: 'Permissao de exclusao',
          descricao: usuarioLogado?.tipo === 'Usuario padrao'
            ? 'Usuario padrao nao pode excluir ordens de compra diretamente pela grade.'
            : 'Perfis com permissao podem excluir ordens de compra mediante confirmacao explicita.',
          detalhe: 'A regra segue a politica operacional do CRM.',
          icone: 'usuarios'
        },
        {
          titulo: 'Etapa entregue automatica',
          descricao: 'Ao mover a ordem de compra para a etapa Entregue, a data de entrega passa automaticamente para a data atual.',
          detalhe: 'Dentro do modal da ordem de compra, essa data ainda pode ser ajustada manualmente antes de salvar.',
          icone: 'confirmar'
        },
        {
          titulo: 'Prazos coerentes com o sistema',
          descricao: 'Os atalhos de prazo de pagamento dentro da ordem de compra respeitam o mesmo modelo de permissao adotado em Atendimentos e Orcamentos.',
          detalhe: 'Isso evita diferenca de comportamento entre modais comerciais.',
          icone: 'configuracoes'
        },
        {
          titulo: 'Comprador do registro',
          descricao: 'Em novas ordens de compra, o comprador inicial segue o usuario do registro e nao o comprador cadastrado no fornecedor.',
          detalhe: 'Trocar o fornecedor nao sobrescreve mais o comprador automaticamente.',
          icone: 'usuarios'
        },
        {
          titulo: 'Consulta apos entrega',
          descricao: usuarioLogado?.tipo === 'Usuario padrao'
            ? 'Quando a ordem de compra chega em Entregue, o perfil Usuario padrao passa a consultar o registro sem edicao.'
            : 'A etapa Entregue bloqueia a edicao apenas para Usuario padrao; perfis administrativos seguem com gestao completa.',
          detalhe: 'A validacao do status operacional usa o identificador fixo da etapa do sistema.',
          icone: 'pedido'
        }
      ]}
    />
  );
}

