import { ModalManualPagina } from '../../componentes/comuns/modalManualPagina';

export function ModalManualClientes({
  aberto,
  aoFechar,
  clientes = [],
  contatos = [],
  vendedores = [],
  ramosAtividade = [],
  filtros = {},
  usuarioLogado
}) {
  const filtrosAtivos = Object.values(filtros).filter(Boolean).length;

  return (
    <ModalManualPagina
      aberto={aberto}
      aoFechar={aoFechar}
      titulo="Manual de Clientes"
      descricao="Guia visual do cadastro de clientes, contatos, filtros persistidos e regras de carteira aplicadas na tela."
      eyebrow="Base cadastral"
      heroTitulo="Como a pagina de Clientes organiza a carteira"
      heroDescricao="A tela concentra os cadastros de clientes e seus contatos, permitindo consultar dados comerciais, definir vendedor responsavel e manter a carteira organizada com filtros persistidos por usuario."
      painelHeroi={[
        { valor: clientes.length, rotulo: 'Clientes na grade atual' },
        { valor: contatos.length, rotulo: 'Contatos carregados' },
        { valor: ramosAtividade.length, rotulo: 'Ramos de atividade cadastrados' }
      ]}
      cardsResumo={[
        {
          titulo: 'Grade principal',
          descricao: `${clientes.length} cliente(s) no recorte visivel.`,
          detalhe: 'A listagem mostra contato principal, vendedor, cidade, estado e status.',
          icone: 'contato'
        },
        {
          titulo: 'Carteira comercial',
          descricao: `${vendedores.length} vendedor(es) disponivel(is) para vinculacao.`,
          detalhe: 'Usuario padrao com vendedor vinculado trabalha sobre a propria carteira.',
          icone: 'usuarios'
        },
        {
          titulo: 'Classificacao',
          descricao: `${ramosAtividade.length} ramo(s) de atividade auxiliam o filtro e a segmentacao da base.`,
          detalhe: 'O ramo pode ser mantido sem sair do modal do cliente.',
          icone: 'cadastro'
        },
        {
          titulo: 'Filtros ativos',
          descricao: filtrosAtivos > 0
            ? `${filtrosAtivos} filtro(s) aplicados na tela.`
            : 'Nenhum filtro ativo no momento.',
          detalhe: 'O contexto e restaurado automaticamente ao reabrir a pagina.',
          icone: 'filtro'
        }
      ]}
      cardsFluxo={[
        {
          titulo: 'Cadastrar cliente',
          descricao: 'Use o botao Novo cliente para abrir o formulario completo com dados gerais, vendedor e contatos.',
          icone: 'adicionar'
        },
        {
          titulo: 'Manter contatos',
          descricao: 'Os contatos do cliente sao registrados no mesmo modal e podem marcar quem e o principal da empresa.',
          icone: 'mensagem'
        },
        {
          titulo: 'Consultar ou editar',
          descricao: 'A grade permite abrir o registro em consulta ou edicao, conforme o perfil e o fluxo desejado.',
          icone: 'consultar'
        },
        {
          titulo: 'Inativar sem perder historico',
          descricao: 'A exclusao operacional da tela acontece por inativacao do cliente, preservando o registro no sistema.',
          icone: 'confirmar'
        }
      ]}
      blocosTexto={[
        {
          tag: 'Cadastro',
          titulo: 'Informacoes importantes do formulario',
          itens: [
            'O codigo sugerido do cliente e calculado automaticamente a partir do primeiro codigo disponivel.',
            'O vendedor pode vir bloqueado para Usuario padrao quando a carteira e restrita ao proprio vendedor.',
            'O cadastro de contatos e salvo junto com o cliente, mantendo o vinculo por idCliente.',
            'Ramos de atividade podem ser mantidos sem sair do modal, respeitando a permissao do perfil.'
          ]
        },
        {
          tag: 'Grade',
          titulo: 'Como a listagem ajuda na operacao',
          itens: [
            'A pesquisa textual filtra rapidamente a grade combinando dados relevantes do cliente.',
            'Os filtros incluem estado, cidade, ramo, vendedor, tipo e status do cadastro.',
            'O contato principal e enriquecido para aparecer diretamente na grade.',
            'A listagem ja considera a carteira do vendedor quando o perfil e restrito.'
          ]
        }
      ]}
      cardsRegras={[
        {
          titulo: 'Persistencia de filtros',
          descricao: 'Estado da tela e filtros ficam salvos por usuario para que a pagina reabra no mesmo contexto.',
          detalhe: 'Isso vale inclusive para filtros de vendedor em ambientes administrativos.',
          icone: 'filtro'
        },
        {
          titulo: 'Carteira restrita',
          descricao: usuarioLogado?.tipo === 'Usuario padrao'
            ? 'Neste perfil, a pagina trabalha com a carteira vinculada ao usuario quando houver vendedor definido.'
            : 'Perfis administrativos visualizam toda a base de clientes cadastrada.',
          detalhe: 'A restricao tambem vale para o filtro e para o vendedor sugerido no modal.',
          icone: 'usuarios'
        },
        {
          titulo: 'Ramo em consulta',
          descricao: 'Atalhos internos para ramo de atividade respeitam o perfil e entram em consulta quando a configuracao estiver protegida.',
          detalhe: 'Isso evita quebrar o fluxo de cadastro com permissoes inconsistentes.',
          icone: 'configuracoes'
        }
      ]}
    />
  );
}