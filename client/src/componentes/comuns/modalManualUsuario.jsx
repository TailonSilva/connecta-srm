import { useEffect, useRef, useState } from 'react';
import { Botao } from './botao';

const atalhosRapidos = [
  { tecla: 'F1', acao: 'Abre o manual em qualquer tela logada.' },
  { tecla: 'ESC', acao: 'Fecha modais quando o fluxo atual permite.' },
  { tecla: 'Enter', acao: 'Confirma ação principal em formulários e modais.' },
  { tecla: 'Ctrl+C / Ctrl+V', acao: 'Na Agenda, copia e cola agendamento selecionado.' }
];

const fluxoComercial = [
  {
    etapa: '1. Preparação da base',
    descricao: 'Cadastre cliente, contato e produto com dados completos para evitar retrabalho.'
  },
  {
    etapa: '2. Atendimento',
    descricao: 'Registre origem, canal, responsável e próxima ação para manter contexto comercial.'
  },
  {
    etapa: '3. Orçamento',
    descricao: 'Monte proposta com itens e condições de pagamento coerentes com a negociação.'
  },
  {
    etapa: '4. Pedido',
    descricao: 'Converta a venda aprovada em pedido e acompanhe etapas operacionais.'
  },
  {
    etapa: '5. Acompanhamento',
    descricao: 'Atualize status no tempo certo para previsão confiável e histórico limpo.'
  }
];

const secoesManual = [
  {
    id: 'inicio-rapido',
    titulo: 'Início rápido',
    descricao: 'Se você está entrando agora no sistema, siga esta ordem para ter resultado já no primeiro dia.',
    comoFazer: [
      'Comece por Clientes: confirme nome, telefone e vendedor responsável antes de qualquer outro módulo.',
      'Cadastre Produtos com grupo, unidade e preço antes de iniciar propostas.',
      'Na Agenda, planeje compromissos do dia e use status para organizar prioridade.',
      'Registre cada interação como Atendimento para nunca perder histórico de negociação.',
      'Use filtros de busca em todas as grades para localizar registros com agilidade.'
    ],
    errosComuns: [
      'Criar orçamento sem revisar dados de contato do cliente.',
      'Pular o registro de atendimento e perder histórico da negociação.',
      'Não definir vendedor responsável no cadastro de cliente novo.'
    ],
    dicas: [
      'Acesse este manual pelo atalho F1 sempre que surgir dúvida durante o uso.',
      'A barra lateral mostra o módulo atual — use-a como referência de contexto.'
    ]
  },
  {
    id: 'clientes',
    titulo: 'Clientes',
    descricao: 'Use o cadastro de clientes como fonte única de verdade comercial.',
    comoFazer: [
      'Preencha dados gerais e endereço para reduzir correções em pedidos.',
      'Mantenha contatos atualizados para facilitar retorno rápido da equipe.',
      'Use inativação quando o cliente sair da base ativa, preservando histórico.',
      'Vincule sempre um vendedor ao cliente para rastreabilidade de carteira.',
      'Revise o campo "Tipo de cliente" para segmentar relatórios e funil comercial.'
    ],
    errosComuns: [
      'Duplicar cliente com variação pequena no nome.',
      'Salvar sem definir vendedor quando o processo exige carteira.',
      'Excluir cliente com histórico comercial — prefira inativar.'
    ],
    dicas: [
      'Contatos marcados como principal ficam em destaque nos modais de seleção.',
      'Use a busca por CNPJ para verificar duplicações antes de criar novo registro.'
    ]
  },
  {
    id: 'produtos',
    titulo: 'Produtos',
    descricao: 'Produto bem configurado evita erro em preço, tamanho e unidade durante a venda.',
    comoFazer: [
      'Vincule grupo, marca e unidade para padronizar filtros e seletores.',
      'Revise preço antes de fechar proposta para evitar divergência no pedido.',
      'Use tamanhos por grupo quando o item exigir variação comercial.',
      'Mantenha a imagem do produto atualizada para facilitar identificação em propostas.',
      'Defina preço de custo quando precisar controlar margem nos orçamentos.'
    ],
    errosComuns: [
      'Manter item desatualizado em vez de inativar e substituir.',
      'Misturar unidade comercial sem critério definido.',
      'Salvar produto sem grupo — isso prejudica filtros e relatórios.'
    ],
    dicas: [
      'Produtos inativos ficam ocultos nos seletores mas preservam dados históricos.',
      'Use o código do produto para referência rápida na seleção de itens em orçamentos.'
    ]
  },
  {
    id: 'agenda',
    titulo: 'Agenda',
    descricao: 'A agenda organiza a execução diária e evita conflito de horário.',
    comoFazer: [
      'Filtre por usuário e status para visualizar apenas o que importa no momento.',
      'Use tipos de agenda para diferenciar visitas, reuniões e retornos.',
      'Atualize status da visita após cada interação para leitura real do dia.',
      'Vincule cliente a cada agendamento para manter contexto na abertura.',
      'Use Ctrl+C / Ctrl+V para copiar agendamentos recorrentes sem retrabalho.'
    ],
    errosComuns: [
      'Deixar compromisso sem status final após o dia.',
      'Agendar sem vincular cliente quando o assunto depende de histórico.',
      'Criar agendamentos sobrepostos no mesmo horário para o mesmo usuário.'
    ],
    dicas: [
      'O status "Realizado" confirma execução — atualize no mesmo dia para relatórios precisos.',
      'Use a visualização semanal para planejar a semana completa de uma vez.'
    ]
  },
  {
    id: 'atendimentos',
    titulo: 'Atendimentos',
    descricao: 'Atendimento é o registro vivo da conversa comercial. Ele mostra contexto, próxima ação e responsabilidade.',
    comoFazer: [
      'Sempre vincule cliente, contato e responsável para rastreabilidade completa.',
      'Canal e origem devem refletir como a oportunidade chegou para medir conversão.',
      'Registre observações curtas e objetivas, com próximo passo e prazo.',
      'Atualize a etapa do atendimento conforme a negociação avança.',
      'Use o campo de próxima ação para garantir continuidade sem depender de memória.'
    ],
    errosComuns: [
      'Texto longo sem ação clara para o próximo usuário.',
      'Fechar atendimento sem atualizar etapa ou status coerente.',
      'Não registrar origem — dado essencial para análise de conversão.'
    ],
    dicas: [
      'Atendimentos vinculados ao cliente ficam no histórico do cliente para consulta futura.',
      'Use o campo de canal para identificar quais origens geram mais conversão na equipe.'
    ]
  },
  {
    id: 'orcamentos',
    titulo: 'Orçamentos',
    descricao: 'Orçamento traduz necessidade do cliente em proposta comercial negociável.',
    comoFazer: [
      'Revise itens, validade, desconto e condição de pagamento antes de enviar.',
      'Use etapa do orçamento de forma fiel ao momento real da negociação.',
      'Acompanhe o campo de funil para melhorar previsão de fechamento.',
      'Vincule o orçamento ao atendimento de origem para rastreabilidade completa.',
      'Use o campo de observações para registrar condições especiais negociadas.'
    ],
    errosComuns: [
      'Pular etapa para parecer avançado e distorcer indicadores.',
      'Fechar proposta sem conferir total e impostos calculados.',
      'Criar orçamento sem definir data de validade.'
    ],
    dicas: [
      'Orçamentos aprovados podem ser convertidos diretamente em pedido, evitando retrabalho.',
      'Mantenha a etapa atualizada para que o funil comercial reflita a realidade.'
    ]
  },
  {
    id: 'pedidos',
    titulo: 'Pedidos',
    descricao: 'Pedido executa a venda aprovada. Cada etapa reflete uma ação operacional real.',
    comoFazer: [
      'Converta pedido a partir do orçamento sempre que possível para evitar retrabalho.',
      'Atualize a etapa do pedido conforme o processo avança (produção, envio, entrega).',
      'Registre data de entrega prevista para acompanhamento de prazo.',
      'Use o campo de observações para incluir instruções de entrega especiais.',
      'Confirme dados de endereço do cliente antes de finalizar o pedido.'
    ],
    errosComuns: [
      'Criar pedido manualmente quando existe orçamento aprovado para conversão.',
      'Não atualizar a etapa após cada fase do processo operacional.',
      'Finalizar pedido sem registrar condição de pagamento acordada.'
    ],
    dicas: [
      'Pedidos gerados por conversão de orçamento herdam itens e condições automaticamente.',
      'Acompanhe o histórico de etapas para identificar gargalos no processo de entrega.'
    ]
  },
  {
    id: 'configuracoes',
    titulo: 'Configurações',
    descricao: 'Configurações mantêm consistência da operação. Alterações aqui impactam múltiplos módulos.',
    comoFazer: [
      'Prefira inativar registros a excluí-los para manter histórico utilizável.',
      'Use filtros nas grades de configurações para revisar ativos e inativos com rapidez.',
      'Verifique dependências antes de editar cadastros base (grupos, marcas, status).',
      'Cadastre usuários com perfil adequado para controlar acesso por função.',
      'Revise configurações após onboarding para remover dados de exemplo.'
    ],
    errosComuns: [
      'Editar cadastro base sem avaliar impacto em módulos já em uso.',
      'Excluir registro que ainda participa de histórico comercial.',
      'Não revisar usuários inativos que ainda têm acesso ao sistema.'
    ],
    dicas: [
      'Grupos de produtos e clientes são usados nos filtros de todas as grades — configure com cuidado.',
      'Tipos de agenda e canais de atendimento devem refletir a nomenclatura interna da equipe.'
    ]
  },
  {
    id: 'conexao-modulos',
    titulo: 'Conexão entre módulos',
    descricao: 'Entender como os módulos se conectam evita perda de dados e retrabalho entre equipes.',
    comoFazer: [
      'Cliente é o ponto de partida: atendimentos, orçamentos e pedidos exigem um cliente vinculado.',
      'Atendimento registra o contexto da negociação que justifica a geração de um orçamento.',
      'Orçamento aprovado deve ser convertido em pedido — não recriado manualmente.',
      'Agenda e atendimentos se complementam: use agendamento para marcar o encontro e atendimento para registrar o resultado.',
      'Configurações alimentam todos os seletores do sistema — um cadastro mal feito aparece em todos os módulos.'
    ],
    errosComuns: [
      'Criar pedido e orçamento sem vincular ao mesmo cliente — duplica dados e complica relatórios.',
      'Usar atendimento e agenda de forma isolada, sem cruzar as informações.',
      'Ignorar o histórico consolidado no cadastro do cliente antes de iniciar nova negociação.'
    ],
    dicas: [
      'O histórico completo de um cliente — atendimentos, orçamentos e pedidos — fica acessível dentro do próprio cadastro.',
      'Dados bem preenchidos nas configurações economizam tempo em todos os demais módulos.'
    ]
  }
];

export function ModalManualUsuario({ aberto, aoFechar }) {
  const [secaoAtiva, setSecaoAtiva] = useState('inicio-rapido');
  const refCorpo = useRef(null);

  useEffect(() => {
    if (!aberto) {
      return undefined;
    }

    setSecaoAtiva('inicio-rapido');

    const corpo = refCorpo.current;
    if (!corpo) {
      return undefined;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setSecaoAtiva(entry.target.id.replace('manual-', ''));
          }
        }
      },
      { root: corpo, threshold: 0.15, rootMargin: '-8% 0px -55% 0px' }
    );

    secoesManual.forEach((secao) => {
      const el = corpo.querySelector(`#manual-${secao.id}`);
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, [aberto]);

  useEffect(() => {
    if (!aberto) {
      return undefined;
    }

    function tratarTecla(evento) {
      if (evento.key === 'Escape') {
        aoFechar();
      }
    }

    window.addEventListener('keydown', tratarTecla);

    return () => {
      window.removeEventListener('keydown', tratarTecla);
    };
  }, [aberto, aoFechar]);

  if (!aberto) {
    return null;
  }

  function fecharAoClicarNoFundo(evento) {
    if (evento.target === evento.currentTarget) {
      aoFechar();
    }
  }

  function navegarParaSecao(id) {
    const corpo = refCorpo.current;
    if (!corpo) {
      return;
    }

    const el = corpo.querySelector(`#manual-${id}`);
    if (!el) {
      return;
    }

    corpo.scrollTo({
      top: Math.max(0, el.offsetTop - 8),
      behavior: 'smooth'
    });
    setSecaoAtiva(id);
  }

  return (
    <div className="camadaModal" role="presentation" onMouseDown={fecharAoClicarNoFundo}>
      <section
        className="modalCliente modalManualUsuario"
        role="dialog"
        aria-modal="true"
        aria-labelledby="tituloModalManualUsuario"
        onMouseDown={(evento) => evento.stopPropagation()}
      >
        <header className="cabecalhoModalCliente cabecalhoModalManualUsuario">
          <div className="heroManualUsuario">
            <p className="rotuloHeroManualUsuario">Manual prático do Connecta CRM</p>
            <h2 id="tituloModalManualUsuario">Como usar o sistema sem travar sua rotina</h2>
            <p className="subtituloModalManualUsuario">
              Este guia foi escrito para uso diário. Ele mostra o que fazer, em que ordem fazer e quais erros evitar
              para manter atendimento, orçamento e pedido sempre alinhados.
            </p>
            <div className="chipsHeroManualUsuario">
              <span>Fluxo comercial completo</span>
              <span>Linguagem direta para operação</span>
              <span>Boas práticas por módulo</span>
            </div>
          </div>

          <div className="acoesCabecalhoModalCliente">
            <Botao
              variante="secundario"
              type="button"
              icone="fechar"
              somenteIcone
              title="Fechar manual"
              aria-label="Fechar manual"
              onClick={aoFechar}
            >
              Fechar manual
            </Botao>
          </div>
        </header>

        <div className="corpoModalCliente corpoModalManualUsuario" ref={refCorpo}>
          <nav className="sumarioManualUsuario" aria-label="Sumário do manual">
            <h3>Navegue por assunto</h3>
            <p className="descricaoSumarioManualUsuario">
              Use o sumário para ir direto ao ponto sem perder a rolagem do manual.
            </p>
            {secoesManual.map((secao) => (
              <button
                key={secao.id}
                type="button"
                className={`linkSumarioManualUsuario${secaoAtiva === secao.id ? ' linkSumarioManualUsuarioAtivo' : ''}`}
                aria-current={secaoAtiva === secao.id ? 'true' : undefined}
                onClick={() => navegarParaSecao(secao.id)}
              >
                {secao.titulo}
              </button>
            ))}
          </nav>

          <div className="conteudoManualUsuario">
            <section className="painelRapidoManualUsuario" aria-label="Atalhos e fluxo rápido">
              <article className="cardAtalhosManualUsuario">
                <h3>Atalhos que aceleram sua operação</h3>
                <ul>
                  {atalhosRapidos.map((atalho) => (
                    <li key={atalho.tecla}>
                      <strong>{atalho.tecla}</strong>
                      <span>{atalho.acao}</span>
                    </li>
                  ))}
                </ul>
              </article>

              <article className="cardFluxoManualUsuario">
                <h3>Fluxo recomendado de ponta a ponta</h3>
                <ol>
                  {fluxoComercial.map((item) => (
                    <li key={item.etapa}>
                      <strong>{item.etapa}</strong>
                      <span>{item.descricao}</span>
                    </li>
                  ))}
                </ol>
              </article>
            </section>

            {secoesManual.map((secao) => (
              <article key={secao.id} id={`manual-${secao.id}`} className="secaoManualUsuario">
                <header className="cabecalhoSecaoManualUsuario">
                  <h3>{secao.titulo}</h3>
                  <p>{secao.descricao}</p>
                </header>

                <div className="gradeConteudoSecaoManualUsuario">
                  <section className="blocoSecaoManualUsuario" aria-label="Como fazer">
                    <h4>Como fazer</h4>
                    <ul>
                      {secao.comoFazer.map((item) => (
                        <li key={item}>{item}</li>
                      ))}
                    </ul>
                  </section>

                  <section className="blocoSecaoManualUsuario blocoSecaoManualUsuarioAlerta" aria-label="Evite estes erros">
                    <h4>Evite estes erros</h4>
                    <ul>
                      {secao.errosComuns.map((item) => (
                        <li key={item}>{item}</li>
                      ))}
                    </ul>
                  </section>
                </div>

                {secao.dicas && (
                  <section className="dicasSecaoManualUsuario" aria-label="Dicas de uso">
                    <h4>Dicas de uso</h4>
                    <ul>
                      {secao.dicas.map((dica) => (
                        <li key={dica}>{dica}</li>
                      ))}
                    </ul>
                  </section>
                )}
              </article>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
