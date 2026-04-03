import { ModalManualPagina } from '../../componentes/comuns/modalManualPagina';

export function ModalManualConfiguracoes({
  aberto,
  aoFechar,
  totalAtalhos = 0,
  secoes = [],
  usuarios = [],
  vendedores = [],
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
      heroDescricao="A tela de Configuracoes centraliza cadastros auxiliares, parametros da empresa, layout do orcamento e atualizacao do sistema. Tudo o que e mantido aqui abastece formulários e regras das demais paginas do CRM."
      painelHeroi={[
        { valor: secoes.length, rotulo: 'Secoes disponiveis' },
        { valor: totalAtalhos, rotulo: 'Atalhos de configuracao' },
        { valor: usuarios.length + vendedores.length, rotulo: 'Usuarios e vendedores carregados' }
      ]}
      cardsResumo={[
        {
          titulo: 'Cadastros base',
          descricao: 'A pagina concentra empresa, usuarios, vendedores e tabelas auxiliares do CRM.',
          detalhe: 'Esses dados alimentam agenda, atendimentos, produtos, orcamentos e pedidos.',
          icone: 'configuracoes'
        },
        {
          titulo: 'Secoes por contexto',
          descricao: `${secoes.length} secao(oes) agrupam os atalhos por uso operacional.`,
          detalhe: 'Gerais, Agenda, Atendimentos, Cadastros e Orcamentos/Pedidos organizam a manutencao.',
          icone: 'empresa'
        },
        {
          titulo: 'Superficie atual',
          descricao: `${totalAtalhos} atalhos estao disponiveis para abrir modais especificos.`,
          detalhe: 'A secao Pagina inicial hoje funciona como espaco reservado para evolucoes futuras.',
          icone: 'cadastro'
        },
        {
          titulo: 'Perfil atual',
          descricao: usuarioLogado?.tipo === 'Usuario padrao'
            ? 'Usuario padrao entra com restricoes em configuracoes sensiveis, principalmente empresa, usuarios e layout do orcamento.'
            : 'Perfis administrativos podem manter toda a estrutura do sistema.',
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
            'Empresa, usuarios e layout do orcamento ficam protegidos para Usuario padrao.',
            'A atualizacao do sistema so aparece para administrador.',
            'Cadastros auxiliares sensiveis seguem o mesmo principio quando abertos por atalhos internos em outros modais.',
            'Essa consistencia evita que um usuario altere uma tabela protegida por um caminho alternativo.'
          ]
        },
        {
          tag: 'Impacto',
          titulo: 'Como as configuracoes se refletem no CRM',
          itens: [
            'Locais, recursos, tipos e status alimentam a Agenda.',
            'Canais, origens e motivos de perda entram no fluxo comercial.',
            'Metodos, prazos, etapas e campos personalizados abastecem Orcamentos e Pedidos.',
            'Parametros da empresa influenciam layout de PDF, expediente e leitura da pagina inicial.'
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
          descricao: 'Ao salvar configuracoes da empresa, o sistema dispara eventos para recarregar telas dependentes, como a pagina inicial.',
          detalhe: 'Isso reduz inconsistencias entre tela e parametro salvo.',
          icone: 'empresa'
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