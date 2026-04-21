// Importa `useState` do React para guardar o `id` da pagina ativa; esse e o unico estado local que ainda faz sentido ficar diretamente no `App`.
import { useState } from 'react';

// Importa o CSS estrutural do componente raiz; as classes `app`, `appEstruturaPainel` e `appAreaConteudo` usadas no JSX sao definidas aqui.
import './recursos/estilos/app.css';

// Importa o componente que encapsula a busca e a exibicao dos popups globais de aviso para nao deixar essa responsabilidade dentro do `App`.
import { CentralAvisosGlobais } from './componentes/comuns/centralAvisosGlobais';
// Importa o menu lateral principal, responsavel por exibir os atalhos de navegacao entre os modulos do SRM.
import { BarraLateral } from './componentes/layout/barraLateral';
// Importa o componente que decide qual pagina do sistema deve ser renderizada na area central com base em `paginaSelecionada`.
import { ConteudoPainel } from './componentes/layout/conteudoPainel';
// Importa a tela de login, usada como retorno imediato enquanto nao existe sessao carregada no frontend.
import { PaginaLogin } from './paginas/paginaLogin';
// Importa o hook que registra o atalho global `PageDown`, usado para acionar salvar ou incluir no contexto atual.
import { useAtalhoAcaoPrimaria } from './hooks/useAtalhoAcaoPrimaria';
// Importa o hook que registra o atalho global `F8`, usado para abrir a busca contextual de fornecedor, contato ou produto no campo focado.
import { useAtalhoBuscaContextual } from './hooks/useAtalhoBuscaContextual';
// Importa o hook que registra a navegacao de abas por `Alt + Seta`, padrao global dos modais com abas.
import { useAtalhoNavegacaoAbasModal } from './hooks/useAtalhoNavegacaoAbasModal';
// Importa o hook que observa o DOM e reaplica foco automaticamente quando um modal abre ou muda de camada.
import { useFocoAutomaticoModais } from './hooks/useFocoAutomaticoModais';
// Importa o hook que centraliza leitura, persistencia e atualizacao da sessao do usuario fora do componente raiz.
import { useSessaoSincronizada } from './hooks/useSessaoSincronizada';
// Importa a lista fixa de paginas do painel; esse catalogo vem de `src/dados` porque e definicao estatica do frontend e nao regra utilitaria.
import { paginasPainel } from './dados/paginas';

// `App` e o componente raiz da interface React; ele compoe a moldura principal do sistema e delega o restante para hooks e componentes menores.
export default function App() {
  // Estado da pagina ativa do painel; guardamos apenas o `id` para manter o estado simples e alinhado com `paginasPainel`.
  // `useState` foi escolhido aqui porque a troca de pagina precisa provocar re-render do `ConteudoPainel` e da `BarraLateral`.
  // O valor inicial usa `paginasPainel[0].id` para que o default venha da mesma fonte que alimenta o menu, sem duplicar um id fixo dentro do `App`.
  const [paginaAtiva, definirPaginaAtiva] = useState(paginasPainel[0].id);

  // Centraliza a leitura, persistencia e atualizacao da sessao do usuario em um hook proprio.
  // `useSessaoSincronizada` devolve o usuario atual e os callbacks `entrar` e `sair`, evitando que o `App` precise conhecer detalhes de `localStorage` ou eventos globais.
  const { usuarioLogado, entrar, sair } = useSessaoSincronizada();

  // Resolve o objeto completo da pagina ativa sem criar um segundo estado sincronizado.
  // Em vez de guardar um objeto inteiro em estado, o `App` deriva `paginaSelecionada` a partir de `paginaAtiva` e `paginasPainel`, o que reduz duplicacao e risco de inconsistencias.
  // O fallback final garante uma pagina valida mesmo que algum `id` inesperado entre no estado por engano.
  const paginaSelecionada =
    paginasPainel.find((pagina) => pagina.id === paginaAtiva) || paginasPainel[0];

  // Ativa o foco automatico nos modais do sistema.
  // Esse hook e chamado sem guardar retorno porque o efeito dele e apenas registrar comportamento global no ciclo de vida do componente.
  useFocoAutomaticoModais();

  // Ativa o atalho global `PageDown` para salvar ou incluir no contexto atual.
  // Aqui tambem nao existe retorno para consumir; o valor do hook esta no efeito colateral de registrar e limpar o listener global.
  useAtalhoAcaoPrimaria();

  // Ativa o atalho global `F8` para abrir a busca contextual do campo focado em modais operacionais.
  // Essa regra vale para campos de fornecedor, contato de fornecedor e produto marcados semanticamente na interface.
  useAtalhoBuscaContextual();

  // Ativa a navegacao entre abas de modal com `Alt + Seta`.
  // Essa chamada fica no topo do componente para que o comportamento valha para qualquer tela carregada dentro da casca principal da aplicacao.
  useAtalhoNavegacaoAbasModal();

  // Enquanto nao houver usuario em memoria, o App renderiza apenas a tela de login.
  // Esse retorno antecipado e importante porque evita montar barra lateral, conteudo interno e avisos globais sem contexto de sessao valido.
  if (!usuarioLogado) {
    // `aoEntrar` recebe o callback vindo de `useSessaoSincronizada`; quando o login terminar, o hook persiste a sessao e atualiza o estado global do App.
    return <PaginaLogin aoEntrar={entrar} />;
  }

  // A estrutura principal combina menu lateral, area de conteudo e avisos globais.
  return (
    <main className="app">
      <div className="appEstruturaPainel">
        <BarraLateral
          itens={paginasPainel}
          paginaAtiva={paginaAtiva}
          usuarioLogado={usuarioLogado}
          aoSelecionarPagina={definirPaginaAtiva}
          aoSair={sair}
        />

        <section className="appAreaConteudo">
          <ConteudoPainel paginaSelecionada={paginaSelecionada} usuarioLogado={usuarioLogado} />
        </section>

        <CentralAvisosGlobais usuarioLogado={usuarioLogado} />
      </div>
    </main>
  );
}
