import { useMemo } from 'react';
import { ModalManualPagina } from '../comuns/modalManualPagina';

export function ModalManualAtendimento({
  aberto,
  aoFechar,
  atendimentos = [],
  tiposAtendimento = [],
  canaisAtendimento = [],
  origensAtendimento = [],
  orcamentos = [],
  filtros = {},
  usuarioLogado
}) {
  const filtrosAtivos = useMemo(
    () => Object.values(filtros).reduce((total, valor) => total + (valor ? 1 : 0), 0),
    [filtros]
  );

  const cardsResumo = [
    {
      titulo: 'Base carregada',
      descricao: `${atendimentos.length} atendimento(s) visivel(is) na grade atual.`,
      detalhe: 'A listagem cruza fornecedor, contato, canal, origem e usuario.',
      icone: 'atendimentos'
    },
    {
      titulo: 'Origem do fluxo',
      descricao: 'Um atendimento pode nascer direto da pagina, do cadastro do fornecedor ou de uma agenda concluida.',
      detalhe: `${orcamentos.length} orcamento(s) aberto(s) disponivel(is) para vinculo`,
      icone: 'cadastro'
    },
    {
      titulo: 'Estrutura comercial',
      descricao: `${tiposAtendimento.length} tipo(s), ${canaisAtendimento.length} canal(is) e ${origensAtendimento.length} origem(ns) ativos para classificacao.`,
      detalhe: 'Essas listas sao gerenciadas em Configuracoes.',
      icone: 'mensagem'
    },
    {
      titulo: 'Perfil atual',
      descricao: usuarioLogado?.tipo === 'Usuario padrao'
        ? 'Usuario padrao opera sua carteira e entra em atalhos de configuracao sensiveis apenas em consulta.'
        : 'Perfis administrativos podem operar o fluxo completo e manter configuracoes auxiliares.',
      detalhe: 'A permissao do perfil interfere nos atalhos internos e na exclusao.',
      icone: 'usuarios'
    }
  ];

  const cardsFluxo = [
    {
      titulo: 'Lancar atendimento',
      descricao: 'Use o botao Novo atendimento para abrir o formulario comercial e preencher cliente, assunto, data e horario.',
      icone: 'adicionar'
    },
    {
      titulo: 'Vincular cotacao',
      descricao: 'Dentro do atendimento e possivel criar, consultar, editar e acompanhar o status da cotacao sem sair do fluxo.',
      icone: 'orcamento'
    },
    {
      titulo: 'Fechar em ordem de compra',
      descricao: 'Quando o orcamento vai para fechamento, o sistema pode perguntar se deve abrir um ordem de compra imediatamente.',
      icone: 'pedido'
    },
    {
      titulo: 'Consultar historico',
      descricao: 'A grade principal serve para consulta, edicao e exclusao conforme o perfil, sempre preservando os filtros do usuario.',
      icone: 'consultar'
    }
  ];

  const cardsRegras = [
    {
      titulo: 'Filtros persistidos',
      descricao: 'Os filtros de Atendimentos ficam salvos por usuario e reaplicam o ultimo contexto usado ao reabrir a tela.',
      detalhe: filtrosAtivos > 0 ? `${filtrosAtivos} filtro(s) ativo(s) agora.` : 'Nenhum filtro ativo neste momento.',
      icone: 'filtro'
    },
    {
      titulo: 'Campos obrigatorios',
      descricao: 'Fornecedor, assunto, data e horario de inicio sao obrigatorios para salvar o atendimento.',
      detalhe: 'Tipo de atendimento tambem e obrigatorio; horario de fim pode ficar vazio em inclusao, mas se informado precisa ser maior que o inicio.',
      icone: 'selo'
    },
    {
      titulo: 'Descricao assistida',
      descricao: 'No campo de descricao, F2 insere o nome do usuario e F3 insere o nome do contato como marcador de anotacao.',
      detalhe: 'Isso acelera registro de historico comercial no mesmo texto.',
      icone: 'mensagem'
    },
    {
      titulo: 'Permissoes internas',
      descricao: 'Atalhos que abrem tabelas configuraveis, como prazos de pagamento, respeitam o perfil do usuario dentro do modal.',
      detalhe: 'Para Usuario padrao, configuracoes sensiveis abrem em consulta.',
      icone: 'configuracoes'
    },
    {
      titulo: 'Foco e atalho',
      descricao: 'O modal abre no primeiro campo editavel; confirmacoes deixam `Sim` ou `Confirmar` prontos para teclado.',
      detalhe: '`PageDown` prioriza Salvar e, quando nao houver salvamento disponivel, aciona Adicionar, Incluir ou Novo no contexto atual; `F8` abre a busca de Fornecedor ou Contato quando o foco estiver nesses campos.',
      icone: 'manual'
    }
  ];

  return (
    <ModalManualPagina
      aberto={aberto}
      aoFechar={aoFechar}
      titulo="Manual de Atendimentos"
      descricao="Guia visual com fluxo comercial, validacoes, permissoes e atalhos reais da pagina."
      eyebrow="Fluxo comercial"
      heroTitulo="Como a pagina de Atendimentos opera no Connecta CRM"
      heroDescricao="A tela de Atendimentos concentra o registro operacional do relacionamento com o cliente, permitindo vincular contato, classificar tipo, canal e origem, abrir orcamento e evoluir para ordem de compra sem quebrar o contexto do atendimento."
      painelHeroi={[
        { valor: atendimentos.length, rotulo: 'Atendimentos visiveis na grade' },
        { valor: orcamentos.length, rotulo: 'Cotacoes abertos disponiveis' },
        { valor: tiposAtendimento.length + canaisAtendimento.length + origensAtendimento.length, rotulo: 'Classificacoes comerciais carregadas' }
      ]}
      cardsResumo={cardsResumo}
      cardsFluxo={cardsFluxo}
      blocosTexto={[
        {
          tag: 'Formulario',
          titulo: 'O que e obrigatorio e o que depende do contexto',
          itens: [
            'Fornecedor, tipo de atendimento, assunto, data e horario de inicio sao obrigatorios para salvar o atendimento.',
            'Contato depende do fornecedor escolhido e so lista contatos ativos daquele cliente.',
            'A busca de fornecedores tambem permite incluir um novo fornecedor sem sair do fluxo.',
            'Quando o foco estiver em Fornecedor ou Contato, `F8` abre a busca correspondente sem depender do mouse.',
            'Ao abrir a busca de contatos com um fornecedor ja definido, o proprio modal permite cadastrar um novo contato e devolver esse contato ja selecionado no atendimento.',
            'Ao confirmar a busca de fornecedor ou contato, o foco retorna para o campo preenchido no atendimento.',
            'Orcamento so pode ser vinculado ou criado quando ja existe fornecedor definido no formulario.',
            'Tipo de atendimento, canal e origem classificam o relacionamento comercial dentro do CRM.',
            'O usuario do registro e preenchido automaticamente conforme a sessao atual.'
          ]
        },
        {
          tag: 'Grade',
          titulo: 'Como usar a listagem principal',
          itens: [
            'A grade permite pesquisar por texto e filtrar por fornecedor, usuario do registro, comprador, canal e origem.',
            'O cabecalho da pagina tambem oferece um atalho direto de Configurar grid para ajustar colunas sem precisar entrar na tela de Configuracoes.',
            'Os filtros ficam persistidos por usuario para reabrir a pagina no mesmo contexto de trabalho.',
            'As colunas da listagem foram ajustadas para evitar rolagem horizontal e agora separam fornecedor, contato, assunto e descricao em campos proprios.',
            'A distribuicao da largura prioriza colunas curtas e previsiveis, como data, inicio, fim, origem e acoes, para sobrar mais espaco util a assunto e descricao.',
            'A empresa pode ajustar em Configuracoes quais colunas do cadastro aparecem na grade, incluindo codigo, agendamento, inicio, fim, fornecedor, contato, canal, origem e usuario.',
            'Sempre que um texto ultrapassa duas linhas na grade, a celula aplica reticencias para manter o ritmo visual da listagem.',
            'Cada linha oferece consultar, editar e excluir conforme o perfil e a permissao da sessao.',
            'Usuario padrao enxerga apenas a propria carteira e os registros ligados ao seu usuario.',
            'Os dados exibidos na grade ja chegam enriquecidos com nomes de fornecedor, contato, canal, origem e comprador.'
          ]
        }
      ]}
      cardsRegras={cardsRegras}
    />
  );
}

