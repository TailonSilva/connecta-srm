import { useState } from 'react';

import './recursos/estilos/app.css';

import { CentralAvisosGlobais } from './componentes/comuns/centralAvisosGlobais';
import { BarraLateral } from './componentes/layout/barraLateral';
import { ConteudoPainel } from './componentes/layout/conteudoPainel';
import { PaginaLogin } from './paginas/login/paginaLogin';
import { useAtalhoAcaoPrimaria } from './hooks/useAtalhoAcaoPrimaria';
import { useAtalhoNavegacaoAbasModal } from './hooks/useAtalhoNavegacaoAbasModal';
import { useFocoAutomaticoModais } from './hooks/useFocoAutomaticoModais';
import { useSessaoSincronizada } from './hooks/useSessaoSincronizada';
import { paginasPainel } from './dados/paginas';

export default function App() {
  // Estado da pagina ativa do painel; guardamos apenas o `id` para manter o estado simples e alinhado com `paginasPainel`.
  const [paginaAtiva, definirPaginaAtiva] = useState(paginasPainel[0].id);

  // Centraliza a leitura, persistencia e atualizacao da sessao do usuario em um hook proprio.
  const { usuarioLogado, entrar, sair } = useSessaoSincronizada();

  // Resolve o objeto completo da pagina ativa sem criar um segundo estado sincronizado.
  const paginaSelecionada =
    paginasPainel.find((pagina) => pagina.id === paginaAtiva) || paginasPainel[0];

  // Ativa o foco automatico nos modais do sistema.
  useFocoAutomaticoModais();

  // Ativa o atalho global `PageDown` para salvar ou incluir no contexto atual.
  useAtalhoAcaoPrimaria();

  // Ativa a navegacao entre abas de modal com `Alt + Seta`.
  useAtalhoNavegacaoAbasModal();

  // Enquanto nao houver usuario em memoria, o App renderiza apenas a tela de login.
  if (!usuarioLogado) {
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
