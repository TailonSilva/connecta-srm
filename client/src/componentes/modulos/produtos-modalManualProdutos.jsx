import { ModalManualPagina } from '../comuns/modalManualPagina';

export function ModalManualProdutos({
  aberto,
  aoFechar,
  produtos = [],
  gruposProduto = [],
  marcas = [],
  unidadesMedida = [],
  filtros = {},
  usuarioLogado
}) {
  const filtrosAtivos = Object.values(filtros).filter(Boolean).length;

  return (
    <ModalManualPagina
      aberto={aberto}
      aoFechar={aoFechar}
      titulo="Manual de Produtos"
      descricao="Guia visual da grade de produtos, classificacoes auxiliares e regras de permissao aplicadas ao cadastro."
      eyebrow="Catalogo comercial"
      heroTitulo="Como a pagina de Produtos organiza o catalogo"
      heroDescricao="A tela de Produtos centraliza o cadastro comercial do catalogo, combinando grupo, marca, unidade, preco e status do item. As classificacoes auxiliares podem ser mantidas dentro do proprio fluxo do produto."
      painelHeroi={[
        { valor: produtos.length, rotulo: 'Produtos na grade atual' },
        { valor: gruposProduto.length, rotulo: 'Grupos cadastrados' },
        { valor: marcas.length + unidadesMedida.length, rotulo: 'Marcas e unidades carregadas' }
      ]}
      cardsResumo={[
        {
          titulo: 'Catalogo visivel',
          descricao: `${produtos.length} produto(s) no recorte atual da grade.`,
          detalhe: 'A listagem mostra a referencia com prefixo REF.:, descricao, grupo, marca, unidade e preco.',
          icone: 'caixa'
        },
        {
          titulo: 'Classificacoes auxiliares',
          descricao: `${gruposProduto.length} grupo(s), ${marcas.length} marca(s) e ${unidadesMedida.length} unidade(s).`,
          detalhe: 'Essas tabelas podem ser mantidas dentro do modal do produto.',
          icone: 'cadastro'
        },
        {
          titulo: 'Filtros ativos',
          descricao: filtrosAtivos > 0
            ? `${filtrosAtivos} filtro(s) aplicados na tela.`
            : 'Nenhum filtro ativo neste momento.',
          detalhe: 'Grupo, marca, unidade e status ficam persistidos por usuario.',
          icone: 'filtro'
        },
        {
          titulo: 'Perfil atual',
          descricao: usuarioLogado?.tipo === 'Usuario padrao'
            ? 'Usuario padrao opera esta tela em modo de consulta para inclusao, edicao e inativacao.'
            : 'Perfis administrativos podem manter o catalogo completo.',
          detalhe: 'A permissao tambem vale para os atalhos internos de grupo, marca e unidade.',
          icone: 'usuarios'
        }
      ]}
      cardsFluxo={[
        {
          titulo: 'Cadastrar produto',
          descricao: 'Use o botao Novo produto para abrir o formulario com referencia, descricao, classificacoes e preco.',
          icone: 'adicionar'
        },
        {
          titulo: 'Classificar o item',
          descricao: 'Grupo, marca e unidade organizam o catalogo e alimentam filtros em outras telas do sistema.',
          icone: 'medida'
        },
        {
          titulo: 'Editar ou consultar',
          descricao: 'A grade abre o produto em consulta ou edicao, respeitando o nivel de permissao do usuario.',
          icone: 'editar'
        },
        {
          titulo: 'Abrir ordens de compra do produto',
          descricao: 'Dentro do modal do produto, a aba Ordens de compra abre o mesmo historico amplo reutilizavel do fornecedor, mas filtrado automaticamente para esse produto e exibindo apenas os itens das ordens de compra, com busca por digitacao no cabecalho e filtros para prazo, referencia e descricao.',
          icone: 'pedido'
        },
        {
          titulo: 'Importar por planilha',
          descricao: 'O botao de importacao abre um modal com download do modelo e, ao final do processo, lista as linhas rejeitadas; quando grupo, marca ou unidade falham, o proprio modal permite escolher um registro existente para reprocessar.',
          icone: 'importar'
        },
        {
          titulo: 'Inativar com seguranca',
          descricao: 'Quando permitido, a remocao operacional acontece por inativacao, preservando historico e referencias.',
          icone: 'confirmar'
        }
      ]}
      blocosTexto={[
        {
          tag: 'Formulario',
          titulo: 'Informacoes tratadas no cadastro',
          itens: [
            'O codigo do produto e sugerido automaticamente pelo primeiro codigo disponivel.',
            'Preco e convertido para numero antes do salvamento para manter consistencia no backend.',
            'Imagem e um campo opcional, com recorte proprio para thumbnail final em 320 x 320 px, e valores vazios sao normalizados para null.',
            'Grupo, marca e unidade podem ser cadastrados no fluxo sem sair do modal, se houver permissao.',
            'Nas abas do modal do produto, `Alt + Seta para a esquerda` volta para a aba anterior e `Alt + Seta para a direita` avanca para a proxima, reposicionando o foco no primeiro campo da nova aba.',
            'A aba Ordens de compra do modal do produto abre um historico amplo filtrado pelo produto atual e mostra apenas os itens das ordens de compra, com colunas separadas para data de inclusao e data de entrega.',
            'A importacao por planilha usa um modelo com aba de instrucoes, incluindo obrigatoriedades, tipo de dado e limite de caracteres por coluna.',
            'Quando uma linha falha na importacao, o retorno agora diferencia melhor preco invalido ou negativo, status incorreto e referencias auxiliares inativas ou inexistentes.',
            'Se grupo, marca ou unidade nao forem resolvidos durante a importacao, o modal exibe um grid de pendencias para escolher um cadastro existente e reenviar apenas essas linhas.'
          ]
        },
        {
          tag: 'Grade',
          titulo: 'Como usar a listagem principal',
          itens: [
            'A pesquisa textual ajuda a localizar rapidamente referencia e descricao do item.',
            'Os filtros incluem grupo, marca, unidade e status.',
            'O cabecalho da pagina tambem oferece um atalho direto de Configurar grid para ajustar colunas sem precisar entrar na tela de Configuracoes.',
            'A grade agora separa codigo, referencia e descricao em colunas proprias, mantendo imagem, preco, status e acoes mais contidos.',
            'Textos que ultrapassam duas linhas passam a ser truncados com reticencias para evitar crescimento excessivo das linhas.',
            'A grade ja vem enriquecida com os nomes das classificacoes auxiliares.',
            'Ao reabrir a pagina, o contexto do filtro anterior e restaurado automaticamente.'
          ]
        }
      ]}
      cardsRegras={[
        {
          titulo: 'Consulta para Usuario padrao',
          descricao: 'Neste perfil, o botao de novo produto e bloqueado e a edicao passa a abrir em consulta.',
          detalhe: 'O objetivo e proteger o catalogo base do CRM.',
          icone: 'usuarios'
        },
        {
          titulo: 'Atalhos protegidos',
          descricao: 'Grupos, marcas e unidades respeitam o mesmo perfil quando abertos dentro do modal do produto.',
          detalhe: 'Assim o comportamento do cadastro fica consistente com Configuracoes.',
          icone: 'configuracoes'
        },
        {
          titulo: 'Persistencia operacional',
          descricao: 'Filtros da tela ficam salvos por usuario e reaplicam o contexto anterior automaticamente.',
          detalhe: 'A rotina reduz retrabalho em catalogos grandes.',
          icone: 'filtro'
        },
        {
          titulo: 'Abas com teclado',
          descricao: 'Nos modais com abas, `Alt + Seta para a esquerda` e `Alt + Seta para a direita` trocam a secao ativa.',
          detalhe: 'Ao mudar de aba, o foco vai para o primeiro campo editavel da nova secao.',
          icone: 'manual'
        }
      ]}
    />
  );
}

