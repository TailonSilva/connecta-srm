import { ModalManualPagina } from '../comuns/modalManualPagina';

export function ModalManualConfiguracoes({
  aberto,
  aoFechar,
  totalAtalhos = 0,
  secoes = [],
  usuarios = [],
  vendedores = [],
  gruposEmpresa = [],
  usuarioLogado
}) {
  return (
    <ModalManualPagina
      aberto={aberto}
      aoFechar={aoFechar}
      titulo="Manual de Configuracoes"
      descricao="Guia visual dos cadastros base do CRM, atalhos por secao e regras de permissao da pagina de configuracoes."
      eyebrow="Base estrutural"
      heroTitulo="Como a pagina de Configuracoes sustenta o restante do sistema"
      heroDescricao="A tela de Configuracoes centraliza cadastros auxiliares, parametros da empresa, layout da cotacao, colunas visiveis de grids, atualizacao do sistema e a base inicial da area de relatorios. Tudo o que e mantido aqui abastece formularios e regras das demais paginas do CRM."
      painelHeroi={[
        { valor: secoes.length, rotulo: 'Secoes disponiveis' },
        { valor: totalAtalhos, rotulo: 'Atalhos de configuracao' },
        { valor: usuarios.length + vendedores.length, rotulo: 'Usuarios e compradores carregados' }
      ]}
      cardsResumo={[
        {
          titulo: 'Cadastros base',
          descricao: 'A pagina concentra empresa, usuarios, compradores, grupos de empresa e tabelas auxiliares do CRM.',
          detalhe: 'Esses dados alimentam agenda, atendimentos, clientes, produtos, orcamentos e ordens de compra.',
          icone: 'configuracoes'
        },
        {
          titulo: 'Secoes por contexto',
          descricao: `${secoes.length} secao(oes) agrupam os atalhos por uso operacional.`,
          detalhe: 'Gerais, Agenda, Atendimentos, Cadastros e Cotacoes/Ordens de Compra organizam a manutencao.',
          icone: 'empresa'
        },
        {
          titulo: 'Superficie atual',
          descricao: `${totalAtalhos} atalhos estao disponiveis para abrir modais especificos.`,
          detalhe: `${gruposEmpresa.length} grupo(s) de empresa ja carregados para reutilizacao nos clientes.`,
          icone: 'cadastro'
        },
        {
          titulo: 'Perfil atual',
          descricao: usuarioLogado?.tipo === 'Usuario padrao'
            ? 'Usuario padrao entra com restricoes em configuracoes sensiveis, principalmente empresa, usuarios, layout da cotacao e atualizacao do sistema.'
            : 'Administrador e Gestor podem manter toda a estrutura do sistema, incluindo a atualizacao do sistema.',
          detalhe: 'A permissao tambem e refletida nos atalhos internos de outros modais do CRM.',
          icone: 'usuarios'
        }
      ]}
      cardsFluxo={[
        {
          titulo: 'Escolher a secao',
          descricao: 'Cada bloco da pagina agrupa atalhos por assunto para reduzir busca manual entre cadastros.',
          icone: 'consultar'
        },
        {
          titulo: 'Abrir o cadastro',
          descricao: 'Ao clicar em um cartao, o sistema abre o modal correspondente para consulta, inclusao ou edicao.',
          icone: 'adicionar'
        },
        {
          titulo: 'Salvar a estrutura',
          descricao: 'Alteracoes validas passam a abastecer imediatamente as telas que dependem daquele cadastro.',
          icone: 'confirmar'
        },
        {
          titulo: 'Voltar ao fluxo comercial',
          descricao: 'Os cadastros criados aqui reaparecem nas paginas operacionais sem exigir navegacao extra do usuario.',
          icone: 'pedido'
        }
      ]}
      blocosTexto={[
        {
          tag: 'Permissoes',
          titulo: 'O que muda conforme o perfil',
          itens: [
            'Empresa, usuarios e layout da cotacao ficam protegidos para Usuario padrao.',
            'A atualizacao do sistema aparece para todos os perfis, mas fica desabilitada apenas para Usuario padrao.',
            'A nova secao de Relatorios fica disponivel com atalhos para Vendas, Conversao e Atendimentos, mas esses atalhos tambem ficam desabilitados para Usuario padrao.',
            'Vendas ja abre um relatorio funcional com cards de resumo, grade de ordens de compra, filtro por cliente, um ou mais compradores, uma ou mais etapas, grupo de empresa, grupo de produto, marca, data de inclusao e data de entrega, alem de busca dedicada para cliente; por padrao, o periodo inicia no mes corrente.',
            'Conversao usa uma grade simples de orcamentos com colunas separadas de inclusao, fechamento, cliente e contato, filtros por cliente, usuario, compradores, etapas, grupo de empresa, grupo de produto, marca e datas, exportacao em PDF e cards com orcamentos gerados, fechados, percentual de conversao, cancelados na etapa Recusado, percentual de perca e quantidade ainda em aberto; Ordem de Compra Excluido fica separado como etapa obrigatoria de controle tecnico quando um ordem de compra vinculado e removido.',
            'Atendimentos tambem ja abre um relatorio funcional com a mesma base visual, cards de total, fornecedores atendidos, canal lider e origem lider, alem da grade de historico com o fornecedor exibido junto nas linhas, botao de filtros e exportacao em PDF; os filtros de usuario, canal e origem aceitam selecao multipla.',
            'Os cadastros de Ramo de atividade e Grupo de empresa seguem liberados tambem na propria pagina de Configuracoes para alimentar o fluxo comercial.',
            'Conceitos de cliente tambem ficam em cadastro proprio para classificar a base comercial; o registro obrigatorio Sem Conceito nasce no banco com id 1 e nao pode ser inativado.',
            'A descricao digitada nesse cadastro e preservada exatamente como o usuario escreveu, sem a capitalizacao automatica aplicada em outros formularios auxiliares.',
            'Cadastros auxiliares sensiveis seguem o mesmo principio quando abertos por atalhos internos em outros modais.',
            'Essa consistencia evita que um usuario altere uma tabela protegida por um caminho alternativo.'
          ]
        },
        {
          tag: 'Impacto',
          titulo: 'Como as configuracoes se refletem no CRM',
          itens: [
            'Locais, recursos, tipos e status alimentam a Agenda.',
            'Tipos, canais, origens e motivos de perda entram no fluxo comercial, incluindo o novo tipo obrigatorio do formulario de atendimentos.',
            'Tipos de ordem de compra abastecem o novo campo de classificacao do modal de Ordens de Compra e deixam o fluxo preparado para personalizacoes futuras; Venda e Devolucao ja nascem como registros obrigatorios protegidos.',
            'Motivos da devolucao ficam disponiveis em tabela propria com abreviacao e descricao, para serem exigidos quando um ordem de compra de Devolucao estiver em Entregue.',
            'Grupos de empresa e seus contatos abastecem o cadastro de clientes com heranca de contatos.',
            'Conceitos de cliente abastecem o novo campo Conceito dentro do cadastro de clientes e novos registros nascem apontando para Sem Conceito ate que o usuario refine essa classificacao.',
            'A empresa define se o CRM usa o codigo padrao do cliente ou o Codigo alternativo como identificador principal nos grids que exibem codigo.',
            'A empresa tambem pode escolher quais colunas aparecem nos grids configuraveis, ajustar ordem, espaco e definir o rotulo que sera exibido no cabecalho de cada coluna.',
            'Clientes, Orcamentos e Ordens de Compra agora tambem aceitam a coluna Conceito dentro dessa configuracao de grade.',
            'A nova aba E-mail da empresa guarda assunto, corpo e assinatura padrao do envio comercial de orcamentos, com suporte a tags dinamicas para cliente, empresa, comprador, observacao, campos personalizados e total.',
            'As etapas obrigatorias Fechado sem ordem de compra e Ordem de Compra Excluido continuam cadastradas em Configuracoes, mas sao de uso automatico e nao aparecem nos selects manuais do fluxo comercial.',
            'As grades de configuracao, historico e relatorio priorizam leitura sem rolagem horizontal, com colunas curtas mais contidas e colunas textuais mais flexiveis.',
            'Metodos, prazos, etapas e campos personalizados abastecem Orcamentos e Ordens de Compra.',
            'Parametros da empresa influenciam layout de PDF, expediente, regras operacionais do cadastro, templates de e-mail comercial e agora tambem a composicao da pagina inicial nas abas Orcamentos e Vendas.',
            'O campo Primeiro plano dos itens fica na aba Cotacoes/Ordens de Compra do cadastro da Empresa e define se descricao ou referencia aparece primeiro nos itens do fluxo comercial e no PDF da cotacao.',
            'Nos modais com abas, `Alt + Seta para a esquerda` volta para a aba anterior e `Alt + Seta para a direita` avanca para a proxima, reposicionando o foco no primeiro campo da nova aba.'
          ]
        }
      ]}
      cardsRegras={[
        {
          titulo: 'Fonte unica de verdade',
          descricao: 'As demais paginas consultam estes cadastros como base oficial para listas, filtros e validacoes.',
          detalhe: 'Uma alteracao aqui impacta diretamente o comportamento da operacao.',
          icone: 'selo'
        },
        {
          titulo: 'Atualizacao imediata',
          descricao: 'Ao salvar configuracoes da empresa, o sistema dispara eventos para recarregar telas dependentes, como a pagina inicial e regras de exibicao ligadas ao cadastro de clientes.',
          detalhe: 'Isso reduz inconsistencias entre tela e parametro salvo.',
          icone: 'empresa'
        },
        {
          titulo: 'Home configuravel',
          descricao: 'A aba Pagina inicial dentro da Empresa agora permite definir quais sessoes aparecem em Orcamentos e Vendas, a ordem de leitura, quantas colunas cada bloco ocupa e qual titulo sera exibido em cada sessao, alem dos cards resumo do topo.',
          detalhe: 'A malha dos graficos usa base de 10 colunas, e os cards resumo tambem respeitam essa base, com validacao para caber em no maximo duas linhas.',
          icone: 'inicio'
        },
        {
          titulo: 'Relatorios padronizados',
          descricao: 'A area de relatorios usa modal amplo com cards de resumo no topo, grade principal e filtro no cabecalho.',
          detalhe: 'Vendas, Conversao e Atendimentos ja seguem esse padrao, reaproveitando grades operacionais e cards executivos no mesmo layout.',
          icone: 'pedido'
        },
        {
          titulo: 'Contato herdado sincronizado',
          descricao: 'Quando um grupo de empresa muda, os contatos herdados dos clientes vinculados sao sincronizados automaticamente.',
          detalhe: 'Isso preserva o reaproveitamento desses contatos no restante do fluxo comercial.',
          icone: 'mensagem'
        },
        {
          titulo: 'Prazos com dias opcionais',
          descricao: 'A tabela de prazos de pagamento aceita registros sem dias e monta a descricao apenas com o metodo quando necessario.',
          detalhe: 'O comportamento ja esta alinhado com frontend, backend e schema do SQLite.',
          icone: 'pagamento'
        }
      ]}
    />
  );
}

