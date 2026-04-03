import { ModalManualPagina } from '../../componentes/comuns/modalManualPagina';

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
          detalhe: 'A listagem mostra referencia, descricao, grupo, marca, unidade e preco.',
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
            'Imagem e um campo opcional e valores vazios sao normalizados para null.',
            'Grupo, marca e unidade podem ser cadastrados no fluxo sem sair do modal, se houver permissao.'
          ]
        },
        {
          tag: 'Grade',
          titulo: 'Como usar a listagem principal',
          itens: [
            'A pesquisa textual ajuda a localizar rapidamente referencia e descricao do item.',
            'Os filtros incluem grupo, marca, unidade e status.',
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
        }
      ]}
    />
  );
}