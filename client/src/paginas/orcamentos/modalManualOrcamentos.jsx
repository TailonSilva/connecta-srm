import { ModalManualPagina } from '../../componentes/comuns/modalManualPagina';

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
    ...(Array.isArray(filtros.idsEtapaOrcamento) ? filtros.idsEtapaOrcamento : [])
  ].filter(Boolean).length;

  return (
    <ModalManualPagina
      aberto={aberto}
      aoFechar={aoFechar}
      titulo="Manual de Orcamentos"
      descricao="Guia visual do fluxo de propostas comerciais, etapas do funil, perda, fechamento e abertura de pedido."
      eyebrow="Propostas comerciais"
      heroTitulo="Como a pagina de Orcamentos conduz o funil de vendas"
      heroDescricao="A tela de Orcamentos concentra a criacao de propostas, o andamento por etapa comercial e o fechamento em pedido. Ela tambem controla motivos de perda e usa as configuracoes da empresa para montar o recorte inicial da operacao."
      painelHeroi={[
        { valor: orcamentos.length, rotulo: 'Orcamentos na grade atual' },
        { valor: etapasOrcamento.length, rotulo: 'Etapas configuradas' },
        { valor: prazosPagamento.length, rotulo: 'Prazos de pagamento carregados' }
      ]}
      cardsResumo={[
        {
          titulo: 'Carteira visivel',
          descricao: `${orcamentos.length} proposta(s) aparecem na grade conforme o filtro atual.`,
          detalhe: 'Usuario padrao pode ficar restrito aos clientes da propria carteira e aos registros vinculados ao seu usuario.',
          icone: 'orcamento'
        },
        {
          titulo: 'Funil configurado',
          descricao: `${etapasOrcamento.length} etapa(s) ordenadas controlam o fluxo do orcamento.`,
          detalhe: empresa?.etapasFiltroPadraoOrcamento
            ? 'A empresa define etapas padrao para o filtro inicial da pagina.'
            : 'Sem etapas padrao definidas na empresa para abertura da tela.',
          icone: 'cadastro'
        },
        {
          titulo: 'Perdas e fechamento',
          descricao: `${motivosPerda.length} motivo(s) de perda disponivel(is) para etapas que exigem justificativa.`,
          detalhe: 'No fechamento, o sistema pode abrir a inclusao do pedido no mesmo fluxo.',
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
          descricao: 'Abra o modal para montar cliente, itens, valores, pagamento e etapa comercial do orcamento.',
          icone: 'adicionar'
        },
        {
          titulo: 'Mover na grade',
          descricao: 'A etapa pode ser ajustada pela propria listagem, sem abrir o modal completo, quando a regra permitir.',
          icone: 'editar'
        },
        {
          titulo: 'Justificar perda',
          descricao: 'Etapas configuradas com obrigatoriedade de motivo bloqueiam a troca ate que a justificativa seja informada.',
          icone: 'mensagem'
        },
        {
          titulo: 'Fechar em pedido',
          descricao: 'Ao fechar o orcamento, o sistema pode perguntar se deve abrir imediatamente o pedido com dados herdados.',
          icone: 'confirmar'
        }
      ]}
      blocosTexto={[
        {
          tag: 'Formulario',
          titulo: 'Campos e vinculos do modal',
          itens: [
            'Cliente e contato entram no mesmo fluxo do orcamento e abastecem a proposta comercial.',
            'Itens e valores definem o total da proposta e alimentam o fechamento em pedido.',
            'Prazos de pagamento podem ser mantidos dentro do modal, respeitando o perfil do usuario.',
            'O modo do modal controla corretamente inclusao, edicao e consulta, inclusive em saida sem salvar.'
          ]
        },
        {
          tag: 'Grade',
          titulo: 'Como usar a listagem principal',
          itens: [
            'A pesquisa textual e os filtros ajudam a localizar propostas por cliente, usuario, vendedor e etapa.',
            'A grade mostra rapidamente a etapa atual e permite acao rapida de evolucao do funil.',
            'Registros fechados podem gerar pedido sem perder o contexto do orcamento.',
            'A exclusao depende do perfil e usa confirmacao dedicada antes de remover o registro.'
          ]
        }
      ]}
      cardsRegras={[
        {
          titulo: 'Etapas padrao da empresa',
          descricao: 'A abertura da tela considera a configuracao da empresa para montar o filtro padrao de etapas do orcamento.',
          detalhe: 'Isso ajuda a focar o funil nas fases relevantes do processo comercial.',
          icone: 'empresa'
        },
        {
          titulo: 'Pedido a partir do fechamento',
          descricao: 'Quando uma etapa entra em fechamento e ainda nao ha pedido vinculado, o sistema prepara automaticamente os dados iniciais do pedido.',
          detalhe: 'O usuario pode aceitar agora ou deixar a pendencia para depois.',
          icone: 'pedido'
        },
        {
          titulo: 'Prazos protegidos',
          descricao: 'Atalhos para prazos de pagamento respeitam o perfil do usuario tambem dentro do modal do orcamento.',
          detalhe: 'Usuario padrao abre configuracoes sensiveis em consulta.',
          icone: 'configuracoes'
        }
      ]}
    />
  );
}