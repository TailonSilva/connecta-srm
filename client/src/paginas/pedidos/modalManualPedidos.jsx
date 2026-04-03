import { ModalManualPagina } from '../../componentes/comuns/modalManualPagina';

export function ModalManualPedidos({
  aberto,
  aoFechar,
  pedidos = [],
  etapasPedido = [],
  prazosPagamento = [],
  filtros = {},
  usuarioLogado
}) {
  const filtrosAtivos = Object.values(filtros).filter(Boolean).length;

  return (
    <ModalManualPagina
      aberto={aberto}
      aoFechar={aoFechar}
      titulo="Manual de Pedidos"
      descricao="Guia visual do acompanhamento de pedidos, etapas comerciais, pagamento e regras de permissao da tela."
      eyebrow="Execucao comercial"
      heroTitulo="Como a pagina de Pedidos acompanha o fechamento do CRM"
      heroDescricao="A pagina de Pedidos acompanha os registros gerados a partir das propostas fechadas ou criados diretamente na tela. Ela concentra etapa do pedido, pagamento, itens e consulta operacional da execucao comercial."
      painelHeroi={[
        { valor: pedidos.length, rotulo: 'Pedidos na grade atual' },
        { valor: etapasPedido.length, rotulo: 'Etapas de pedido' },
        { valor: prazosPagamento.length, rotulo: 'Prazos de pagamento carregados' }
      ]}
      cardsResumo={[
        {
          titulo: 'Grade operacional',
          descricao: `${pedidos.length} pedido(s) aparecem no recorte atual.`,
          detalhe: 'A listagem cruza cliente, usuario, vendedor e etapa do pedido.',
          icone: 'pedido'
        },
        {
          titulo: 'Etapas do processo',
          descricao: `${etapasPedido.length} etapa(s) configurada(s) organizam o andamento do pedido.`,
          detalhe: 'As etapas sao mantidas na pagina de Configuracoes.',
          icone: 'cadastro'
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
          titulo: 'Criar pedido',
          descricao: 'O pedido pode nascer diretamente pela tela ou a partir do fechamento de um orcamento.',
          icone: 'adicionar'
        },
        {
          titulo: 'Consultar e editar',
          descricao: 'A grade permite abrir o registro em consulta ou edicao, mantendo o contexto comercial do pedido.',
          icone: 'consultar'
        },
        {
          titulo: 'Controlar etapa',
          descricao: 'Cada pedido recebe uma etapa de acompanhamento para leitura operacional do andamento.',
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
            'Cliente, contato, usuario do registro e vendedor compoem a base comercial do pedido.',
            'Itens, valores e pagamento sao herdados do fluxo comercial e podem ser ajustados no modal.',
            'Prazos de pagamento podem ser cadastrados no proprio fluxo, respeitando o perfil.',
            'Campos personalizados do pedido aparecem conforme a configuracao carregada no sistema.'
          ]
        },
        {
          tag: 'Grade',
          titulo: 'Como usar a listagem principal',
          itens: [
            'A pesquisa textual ajuda a localizar rapidamente pedidos por dados do cliente e do registro.',
            'Os filtros incluem cliente, usuario do registro, vendedor e etapa.',
            'A grade funciona como consulta operacional do fechamento comercial.',
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
            ? 'Usuario padrao nao pode excluir pedidos diretamente pela grade.'
            : 'Perfis com permissao podem excluir pedidos mediante confirmacao explicita.',
          detalhe: 'A regra segue a politica operacional do CRM.',
          icone: 'usuarios'
        },
        {
          titulo: 'Prazos coerentes com o sistema',
          descricao: 'Os atalhos de prazo de pagamento dentro do pedido respeitam o mesmo modelo de permissao adotado em Atendimentos e Orcamentos.',
          detalhe: 'Isso evita diferenca de comportamento entre modais comerciais.',
          icone: 'configuracoes'
        }
      ]}
    />
  );
}