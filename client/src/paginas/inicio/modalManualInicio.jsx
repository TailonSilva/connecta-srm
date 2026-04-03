import { normalizarPreco } from '../../utilitarios/normalizarPreco';
import { ModalManualPagina } from '../../componentes/comuns/modalManualPagina';

export function ModalManualInicio({
  aberto,
  aoFechar,
  totalClientes = 0,
  totalProdutos = 0,
  totalVendasValor = 0,
  totalVendasQuantidade = 0,
  filtros = {},
  orcamentos = [],
  pedidos = [],
  etapasFunil = [],
  empresa,
  usuarioLogado
}) {
  const quantidadeFiltros = [
    filtros.dataInicio,
    filtros.dataFim,
    ...(Array.isArray(filtros.idVendedor) ? filtros.idVendedor : []),
    ...(Array.isArray(filtros.idProduto) ? filtros.idProduto : []),
    ...(Array.isArray(filtros.idGrupo) ? filtros.idGrupo : []),
    ...(Array.isArray(filtros.idMarca) ? filtros.idMarca : [])
  ].filter(Boolean).length;

  return (
    <ModalManualPagina
      aberto={aberto}
      aoFechar={aoFechar}
      titulo="Manual da Pagina Inicial"
      descricao="Guia visual dos indicadores, filtros analiticos e leitura do funil comercial exibidos no painel inicial."
      eyebrow="Painel executivo"
      heroTitulo="Como a Pagina Inicial consolida o CRM"
      heroDescricao="A tela inicial resume clientes, produtos, vendas e funil comercial em um unico painel. Os indicadores sempre respeitam o filtro aplicado e servem como ponto de partida para a leitura rapida da operacao."
      painelHeroi={[
        { valor: totalClientes.toLocaleString('pt-BR'), rotulo: 'Clientes cadastrados' },
        { valor: totalProdutos.toLocaleString('pt-BR'), rotulo: 'Produtos cadastrados' },
        { valor: normalizarPreco(totalVendasValor), rotulo: 'Vendas no recorte atual' }
      ]}
      cardsResumo={[
        {
          titulo: 'Janela de analise',
          descricao: `${formatarData(filtros.dataInicio)} ate ${formatarData(filtros.dataFim)}.`,
          detalhe: quantidadeFiltros > 0 ? `${quantidadeFiltros} parametro(s) ativos no painel.` : 'Sem filtros ativos fora o periodo padrao.',
          icone: 'agenda'
        },
        {
          titulo: 'Base comercial filtrada',
          descricao: `${orcamentos.length} orcamento(s) e ${pedidos.length} pedido(s) entram no resumo atual.`,
          detalhe: `${formatarQuantidade(totalVendasQuantidade)} em itens vendidos.`,
          icone: 'orcamento'
        },
        {
          titulo: 'Funil da empresa',
          descricao: empresa?.exibirFunilPaginaInicial
            ? `${etapasFunil.length} etapa(s) exibidas no funil de vendas.`
            : 'O funil esta oculto nas configuracoes da empresa.',
          detalhe: 'As etapas sao controladas em Configuracoes > Orcamentos/Pedidos.',
          icone: 'pedido'
        },
        {
          titulo: 'Perfil atual',
          descricao: usuarioLogado?.tipo === 'Usuario padrao'
            ? 'Usuario padrao entra com o vendedor vinculado como referencia principal do painel.'
            : 'Perfis administrativos podem combinar vendedores e produtos livremente no filtro.',
          detalhe: 'Os filtros ficam persistidos por usuario.',
          icone: 'usuarios'
        }
      ]}
      cardsFluxo={[
        {
          titulo: 'Ajustar o recorte',
          descricao: 'Abra os filtros para definir periodo, vendedores, produtos, grupos e marcas conforme a analise desejada.',
          icone: 'filtro'
        },
        {
          titulo: 'Ler indicadores',
          descricao: 'Os quatro cards superiores mostram volume de cadastros e resultado de vendas dentro do recorte ativo.',
          icone: 'consultar'
        },
        {
          titulo: 'Interpretar o funil',
          descricao: 'Quando habilitado na empresa, o funil resume a carteira de orcamentos por etapa e ajuda a identificar gargalos.',
          icone: 'orcamento'
        },
        {
          titulo: 'Refinar sem perder contexto',
          descricao: 'Ao voltar para a pagina, o painel reaplica o ultimo filtro salvo para continuar a leitura do mesmo cenario.',
          icone: 'confirmar'
        }
      ]}
      blocosTexto={[
        {
          tag: 'Filtros',
          titulo: 'O que voce consegue segmentar no painel',
          itens: [
            'Periodo inicial e final definem a janela usada nos indicadores e nos dados do funil.',
            'Vendedores, produtos, grupos e marcas aceitam selecao multipla para combinar recortes comerciais.',
            'Usuario padrao entra com o vendedor bloqueado quando houver vinculo com a carteira.',
            'Somente produtos, grupos e marcas ativas aparecem nas listas de filtro da pagina inicial.'
          ]
        },
        {
          tag: 'Leitura',
          titulo: 'Como interpretar os resultados',
          itens: [
            'Clientes e produtos cadastrados refletem a base geral carregada no sistema.',
            'Vendas em valores somam o total dos pedidos filtrados.',
            'Vendas em quantidades somam os itens vendidos considerando o recorte atual.',
            'O funil considera as etapas configuradas para orcamentos e a carteira filtrada no momento.'
          ]
        }
      ]}
      cardsRegras={[
        {
          titulo: 'Persistencia por usuario',
          descricao: 'O CRM salva o ultimo filtro aplicado na pagina inicial e restaura esse contexto na proxima abertura.',
          detalhe: 'Isso evita remontar o painel a cada acesso.',
          icone: 'filtro'
        },
        {
          titulo: 'Atualizacao por empresa',
          descricao: 'Quando a empresa e alterada em Configuracoes, a pagina inicial recarrega automaticamente os indicadores.',
          detalhe: 'O comportamento e disparado pelo evento global de atualizacao da empresa.',
          icone: 'empresa'
        },
        {
          titulo: 'Funil opcional',
          descricao: 'A exibicao do funil depende da configuracao da empresa e pode ser desativada sem remover os demais indicadores.',
          detalhe: 'A ausencia do funil nao afeta os filtros nem os cards de resumo.',
          icone: 'configuracoes'
        }
      ]}
    />
  );
}

function formatarData(valor) {
  if (!valor) {
    return 'Sem data definida';
  }

  const [ano, mes, dia] = String(valor).split('-');

  if (!ano || !mes || !dia) {
    return valor;
  }

  return `${dia}/${mes}/${ano}`;
}

function formatarQuantidade(valor) {
  return Number(valor || 0).toLocaleString('pt-BR');
}